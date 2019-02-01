const db = require('../../helpers/db')
const Submission = db.submission

module.exports = {
    getAll,
    getMine
}

async function getMine({username}) {
    let skipNumber = 0
    let limit = 10
    await Submission.countDocuments({owner: username} , function (err, count) {
        if (count < limit) {
            skipNumber = 0
        } else {
            skipNumber = count - limit
        }
    })
    return await Submission.find({owner: username}).skip(skipNumber)
}

async function getAll() {
    return await Submission.find()
}
