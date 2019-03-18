
module.exports = {
    run_game
}


const {spawn} = require('child_process')
const { Duplex } = require('stream')

function create_io_stream () {
    let my_stream = new Duplex({
        write(chunk, encoding, callback) {
            this.push(chunk)
            callback()
        },
        read() {
        }
    })
    my_stream.on('error', (error) => {
        console.log(error)
    })
    return my_stream
}

function create_io_data_storage (turn, default_data) {
    let global_bot_data = []
    for (let i = 0; i < turn; i++) {
        global_bot_data.push(default_data)
    }
    return global_bot_data
}

function check_all_had_data (children, turn, number_of_bots) {
    if (number_of_bots !== children.length) {
        return false
    }
    for (let child of children) {
        if (child.had_data[turn] === false) {
            return false
        }
    }
    return true
}

function spawn_the_bots(bots, turn, default_data) {
    let number_of_bots = bots.length
    let children = []
    for (let i = 0; i < number_of_bots; i++) {
        let spawn_command = './' + bots[i].toString()
        children.push(spawn(spawn_command))
        children[i].stdin.on('error', (error) => {
            console.log('Bot stream error:', error)
        })
        children[i].turn = 0
        children[i].bot_data = create_io_data_storage(turn, default_data)
        children[i].had_data = create_io_data_storage(turn, false)
    }
    return children
}


function connect_bots_to_stream(bots, gameEngine_to_bot_stream) {
    for (let bot of bots) {
        gameEngine_to_bot_stream.pipe(bot.stdin)
    }
}


function spawn_game_engine(game_engine_command, game_engine_name, fightID, players_name) {
    let game_engine = spawn(game_engine_command, [game_engine_name, fightID, ...players_name])
    game_engine.stdin.on('error', (error) => {
        console.log('Game engine stdin error: ', error)
    })
    game_engine.resp_data = ''
    return game_engine
}


function connect_gameEngine_to_stream(game_engine, bot_to_gameEngine_stream) {
    bot_to_gameEngine_stream.pipe(game_engine.stdin)
}


function push_bot_data_to_gameEngine(bots, bot_to_gameEngine_stream, turn_num) {
    for (let bot of bots) {
        // console.log(turn_num, bot.bot_data[turn_num])
        bot_to_gameEngine_stream.push(bot.bot_data[turn_num])
    }
}


function push_gameEngine_data_to_bots(game_engine, gameEngine_to_bot_stream) {
    gameEngine_to_bot_stream.push(game_engine.resp_data.toString())
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


async function waiting_children (children, bot_to_game_engine_stream, game_info, turn, semaphore) {
    const time_wait = 200
    while (game_info.turn_count < turn) {
        await sleep(10)

        await wait (semaphore)

        if ((new Date()).getTime() - game_info.time_start > time_wait) {
            console.log('Time Out')
            game_info.time_start = (new Date()).getTime()
            push_bot_data_to_gameEngine(children, bot_to_game_engine_stream, game_info.turn_count)
            game_info.turn_count++
        }

        signal (semaphore)
    }
    // bot_to_game_engine_stream.push(null)
}


function print_data (children, turn) {
    console.log('Bot turn: ', turn)
    let cnt = 0
    for (let child of children) {
        console.log('Child ', cnt, '\'s response: ', child.bot_data[turn])
        cnt++
    }
}


async function kill_all (game_engine, children) {
    /**
     * Kill the bots
     */
    await sleep(200)
    for (let child of children) {
        let pid = child.pid
        spawn('kill', [pid])
    }
    /**
     * Kill the game_engine
     */
    await sleep(1000)
    spawn('kill', [game_engine.pid])
}


function create_semaphore () {
    return {
        sem: 1
    }
}

async function wait (semaphore) {
    while (semaphore.sem <= 0) {
        await sleep(5)
    }
    semaphore.sem--
}

function signal (semaphore) {
    semaphore.sem++
}

async function run_game(
    game_engine_command,
    game_engine_name,
    bots,
    fightID,
    players_name,
    turn,
    default_data
) {

    const number_of_bots = bots.length

    const bot_to_gameEngine_stream = create_io_stream()

    const gameEngine_to_bot_stream = create_io_stream()

    let children = spawn_the_bots(bots, turn, default_data)

    connect_bots_to_stream(children, gameEngine_to_bot_stream)

    let semaphore = create_semaphore()

    for (let child of children) {
        child.stdout.on('data', async function (data) {
            child.bot_data[child.turn] = data.toString()
            child.had_data[child.turn] = true
            child.turn += 1
            await wait (semaphore)
            if (game_info.turn_count < turn && check_all_had_data(children, game_info.turn_count, number_of_bots)) {
                // console.log('All had data, now push data!')
                // print_data(children, game_info.turn_count)
                push_bot_data_to_gameEngine(children, bot_to_gameEngine_stream, game_info.turn_count)
                game_info.turn_count++
                game_info.time_start = (new Date()).getTime()
            }
            signal (semaphore)
        })
    }

    const game_engine = spawn_game_engine(game_engine_command, game_engine_name, fightID, players_name)

    connect_gameEngine_to_stream(game_engine, bot_to_gameEngine_stream)

    game_engine.stdout.on('data', async function (data) {
        game_engine.resp_data = data.toString()
        if (game_info.turn_count < turn) {
            push_gameEngine_data_to_bots(game_engine, gameEngine_to_bot_stream)
        }
        // if (game_info.turn_count === 0) {
        //     console.log('Initial response:', game_engine.resp_data)
        // } else {
        //     console.log('Response game engine turn ', game_info.turn_count - 1, ': ', game_engine.resp_data)
        // }
    })

    let game_info = {}
    game_info.turn_count = 0
    game_info.time_start = (new Date()).getTime()

    await waiting_children(children, bot_to_gameEngine_stream, game_info, turn, semaphore)

    // gameEngine_to_bot_stream.push(null)
    /**
     * Kill game engine and bots
     */
    await kill_all(game_engine, children)
}

// run_game('python3', 'test.py', ['aa.out', 'bb.out'], ['hekl0', 'lightkuriboh'], 3, '0\n', 12000, 15000)
