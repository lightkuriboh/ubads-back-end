const db = require('../../helpers/db')
const Record = db.record

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
    let dateNow = new Date()
    let id = Date.parse(dateNow.toString())
    let random = Math.floor(Math.random() * 1000 + 1);
    id += random
    let record = new Record(recordParam)
    record.id = id
    await record.save()
}
