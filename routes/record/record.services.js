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
}
