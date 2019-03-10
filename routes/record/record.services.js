const db = require('../../helpers/db')
const Record = db.record
const GameServices = require('../gameinfo/game.services')
const IDCreator = require('../../helpers/id.creator')

module.exports = {
    getAll,
    addNew
}

async function getNLastRecords(limit) {
    let skipNumber = 0
    await Record.countDocuments({} , function (err, count) {
        if (count < limit) {
            skipNumber = 0
        } else {
            skipNumber = count - limit
        }
    })
    return await Record.find().skip(skipNumber)
}

async function getAll() {
    return await getNLastRecords(100)
}

async function addNew (recordParam) {

    let record = new Record(recordParam)
    record.id = IDCreator.createID()

    await record.save()

    const port = require('../../services/game_communicator/port')
    const result_updater = require('../../services/result_updater/result_updater')
    let query = {
        id: record.game
    }
    let game_info = await GameServices.getByID(query)
    game_info = JSON.parse(JSON.stringify(game_info))
    let game_config = game_info.config
    let game_engine = game_info.game_engine
    const config = require(game_config).config
    // await port.run_game(
    //     config.game_engine_command,
    //     game_engine,
    //     [],
    //     [record.attacker, record.defender],
    //     game_config.turn_number,
    //     game_config.default_response_data,
    //     game_config.bot_maximum_running_time,
    //     game_config.game_engine_maximum_running_time
    // )
    // result_updater.update_all(record.id, record.game, record.attacker, record.defender)
}
