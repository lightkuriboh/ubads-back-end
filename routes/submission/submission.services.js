const db = require('../../helpers/db')
const Submission = db.submission
const IDCreator = require('../../helpers/id.creator')

module.exports = {
    getAll,
    getMine,
    addNew
}

async function getMine ({game, username}) {
    let skipNumber = 0
    let limit = 10
    await Submission.countDocuments({game: game, owner: username} , function (err, count) {
        if (count < limit) {
            skipNumber = 0
        } else {
            skipNumber = count - limit
        }
    })
    return await Submission.find({game: game, owner: username}).skip(skipNumber)
}

async function getAll () {
    return await Submission.find()
}

async function addNew (submissionParam) {

    let code = submissionParam.code
    let submission = new Submission(submissionParam.submitData)
    submission.id = IDCreator.createID()

    let compileMessage = await compileCode(code, submission.language, submission.id)

    let achievement = db.achievement

    let Query = {
        username: submission.owner,
        game: submission.game
    }
    let Update = {
        active_submission: submission.id
    }
    let foundDocument = await achievement.find(Query)
    if (foundDocument && foundDocument.length > 0) {
        await achievement.updateOne(Query, Update)
    } else {
        let achivementParam = {
            id: IDCreator.createID(),
            username: submission.owner,
            game: submission.game,
            result: {
                rating: 0,
                score: '0'
            },
            active_submission: submission.id
        }
        let newAchievement = new achievement(achivementParam)
        await newAchievement.save()
    }

    await submission.save()

    return compileMessage
}

async function writeCodeToFile(code, language, id) {
    const langList = require('../../config/listLanguage').languages

    let myLanguage = {
        extend: '.fuck'
    }

    for (let i = 0; i < langList.length; i++) {
        if (langList[i].code === language) {
            myLanguage = langList[i]
            break
        }
    }
    let fileOut = 'code/' + id.toString() + myLanguage.extend

    try {
        const fs = require('fs')
        await fs.writeFileSync(fileOut, code, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        })
    } catch (e) {
        console.log(JSON.stringify(e))
    }

    return {
        languageInfo: myLanguage,
        fileName: fileOut
    }
}

async function compileCode(code, language, id) {

    let codeInfo = await writeCodeToFile(code, language, id)
    let myLanguage = codeInfo.languageInfo

    let compileMessage = 'Compiled successfully!'

    const utils = require('util')
    const execFile = utils.promisify(require('child_process').execFile)
    async function execute() {
        const {error, stdout, stderr} = await execFile("python3", ["services/compiler.py", id, myLanguage.code])
        if (error) {
            console.log(error)
            compileMessage = 'Compile error!'
        }
        if (stderr) {
            // console.log(error)
            compileMessage = 'Compile error!'
        }
    }
    await execute()
    return compileMessage
}
