const db = require('../../helpers/db')
const Record = db.record

module.exports = {
    getAll
}

async function getAll() {
    let skipNumber = 0
    let limit = 100
    await Record.countDocuments({} , function (err, count) {
        if (count < limit) {
            skipNumber = 0
        } else {
            skipNumber = count - limit
        }
    })
    return await Record.find().skip(skipNumber)
}
