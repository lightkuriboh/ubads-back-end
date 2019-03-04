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

async function update_achivement(submission) {
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
        let achievementParam = {
            id: IDCreator.createID(),
            username: submission.owner,
            game: submission.game,
            result: {
                rating: 0,
                score: '0'
            },
            active_submission: submission.id
        }
        let newAchievement = new achievement(achievementParam)
        await newAchievement.save()
    }
}

async function update_compilation_db (id, language, log) {
    let Compilation = db.compilation
    let compilation = new Compilation({
        id: id,
        language: language,
        result: log
    })
    await compilation.save()
}

async function addNew (submissionParam) {


    let code = submissionParam.code
    let submission = new Submission(submissionParam.submitData)
    submission.id = IDCreator.createID()

    let compilation_info = await compileCode(code, submission.language, submission.id)
    let compileMessage = compilation_info.compileMessage
    let compileLog = compilation_info.compileLog

    await update_achivement(submission)

    await update_compilation_db(submission.id, submission.language, compileLog)


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
    let compileLog = 'No warning or error'

    // const EventEmitter = require('events')
    //
    // class Compilation extends EventEmitter {
    //     execute(asyncFunc, name, ...args) {
    //         this.emit('begin')
    //         console.time('execute')
    //         asyncFunc(name, ...args, (err, stdout, stderr) => {
    //             if (err) {
    //                 return this.emit('error', err)
    //             }
    //             this.emit('data', stdout)
    //             this.emit('s_error', stderr)
    //             console.timeEnd('execute')
    //             this.emit('end')
    //         })
    //     }
    // }
    //
    // const compilation = new Compilation()
    // compilation.on('begin', () => {console.log('Begin compilation!')})
    // compilation.on('err', (err) => {console.log('Error: ', err)})
    // compilation.on('s_error', (stderr) => {
    //     console.log('Stderr: ', stderr)
    //     if (stderr) {
    //         return 'Compile error!'
    //     }
    // })
    // compilation.on('data', (data) => {console.log('Data: ', data)})
    // compilation.on('end', () => {
    //     console.log('Ended compilation')
    // })
    //
    // compilation.execute(require('child_process').execFile, 'python3', ["services/compiler.py", id, myLanguage.code])

    const utils = require('util')
    const execFile = utils.promisify(require('child_process').execFile)
    async function execute() {
        const {error, stdout, stderr} = await execFile('python3', ["services/compiler/compiler.py", id, myLanguage.code])
        if (error) {
            compileMessage = 'Compile error!'
            compileLog = error
        } else
        if (stderr.length > 0) {
            compileMessage = 'Compile error!'
            compileLog = stderr
        } else {
            if (stdout.length > 0) {
                compileLog = stdout
            }
        }
        // console.log(stdout, stderr)
    }

    await execute()

    return {
        compileMessage,
        compileLog
    }
}
