const db = require('../../helpers/db')
const Submission = db.submission

module.exports = {
    getAll,
    getMine,
    addNew
}

async function getMine ({username}) {
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

async function getAll () {
    return await Submission.find()
}

async function addNew (submissionParam) {
    let dateNow = new Date()
    let id = Date.parse(dateNow.toString())
    let random = Math.floor(Math.random() * 1000 + 1);
    id += random
    let code = submissionParam.code
    // console.log(code)
    let submission = new Submission(submissionParam.submitData)
    submission.id = id
    return await submission.save()
}
