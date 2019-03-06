
module.exports = {
    run_game
}

const {spawn} = require('child_process')
const {Duplex} = require('stream')

function kill_process(pid) {
    return function (pid) {
        spawn('kill', [pid])
    }
}


function kill_process_after(process, maximum_running_time) {
    setTimeout(kill_process(process.pid), maximum_running_time)
}


function set_bots_killing_time(bots, maximum_running_time) {
    for (let bot of bots) {
        kill_process_after(bot, maximum_running_time)
    }
}


function set_game_engine_killing_time(game_engine, maximum_running_time) {
    kill_process_after(game_engine, maximum_running_time)
}


function create_io_stream () {
    return new Duplex({
        write(chunk, encoding, callback) {
            this.push(chunk)
            callback()
        },
        read() {
        }
    })
}

function create_io_data_storage(turn, default_data) {
    let global_bot_data = []
    for (let i = 0; i < turn; i++) {
        global_bot_data.push(default_data)
    }
    return global_bot_data
}


function spawn_the_bots(bots, turn, default_data) {
    let number_of_bots = bots.length
    let children = []
    for (let i = 0; i < number_of_bots; i++) {
        let spawn_command = './' + bots[i].toString()
        children.push(spawn(spawn_command))
        children[i].turn = 0
        children[i].bot_data = create_io_data_storage(turn, default_data)

        children[i].stdout.on('data', function (data) {
            children[i].bot_data[children[i].turn] = data.toString()
            children[i].turn += 1
        })
    }
    return children
}


function connect_bots_to_stream(bots, gameEngine_to_bot_stream) {
    for (let bot of bots) {
        gameEngine_to_bot_stream.pipe(bot.stdin)
    }
}


function spawn_game_engine(game_engine_command, game_engine_name, players_name) {
    let game_engine = spawn(game_engine_command, [game_engine_name, ...players_name])
    game_engine.resp_data = ''
    game_engine.stdout.on('data', function (data) {
        game_engine.resp_data = data.toString()
    })
    return game_engine
}


function connect_gameEngine_to_stream(game_engine, bot_to_gameEngine_stream) {
    bot_to_gameEngine_stream.pipe(game_engine.stdin)
}


function push_bot_data_to_gameEngine(bots, bot_to_gameEngine_stream, turn_num) {
    for (let bot of bots) {
        bot_to_gameEngine_stream.push(bot.bot_data[turn_num])
    }
}


function push_gameEngine_data_to_bots(game_engine, gameEngine_to_bot_stream) {
    gameEngine_to_bot_stream.push(game_engine.resp_data)
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


async function run_game(
    game_engine_command,
    game_engine_name,
    bots,
    players_name,
    turn,
    default_data,
    bots_running_time,
    game_engine_running_time
) {

    const number_of_bots = bots.length

    const bot_to_gameEngine_stream = create_io_stream()

    const gameEngine_to_bot_stream = create_io_stream()

    let children = spawn_the_bots(bots, turn, default_data)

    connect_bots_to_stream(children, gameEngine_to_bot_stream)

    set_bots_killing_time(children, bots_running_time)

    const game_engine = spawn_game_engine(game_engine_command, game_engine_name, players_name)

    connect_gameEngine_to_stream(game_engine, bot_to_gameEngine_stream)

    set_game_engine_killing_time(game_engine, game_engine_running_time)

    await sleep(100)
    // console.log('Finished Initiating')
    // console.log(game_engine.resp_data)
    push_gameEngine_data_to_bots(game_engine, gameEngine_to_bot_stream)
    for (let i = 0; i < turn; i++) {
        await sleep(100)
        // console.log('Finished Waiting Turn', i)
        // for (let j = 0; j < number_of_bots; j++) {
        //     console.log('Bot' + j.toString() + '\'response: ' + children[j].bot_data[i])
        // }
        push_bot_data_to_gameEngine(children, bot_to_gameEngine_stream, i)
        await sleep(100)
        // console.log('Finished Processing Turn', i)
        // console.log(game_engine.resp_data)
        push_gameEngine_data_to_bots(game_engine, gameEngine_to_bot_stream)
    }
}

// run_game('python3', 'test.py', ['aa.out', 'bb.out'], ['hekl0', 'lightkuriboh'], 3, '0\n', 12000, 15000)
