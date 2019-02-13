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
    let submission = new Submission(submissionParam.submitData)
    submission.id = id
    await compileCode(code, submission.language, id)
    return await submission.save()
}

async function writeCodeToFile(code, language, id) {
    const langList = require('../../config/listLanguage').languages
    let myLanguage = {
        extendOut: '.fuck'
    }

    for (let i = 0; i < langList.length; i++) {
        if (langList[i].code === language) {
            console.log(JSON.stringify(langList[i]))
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
    let fileCode = codeInfo.fileName
    //
    // let commandString = myLanguage.command
    //
    // const { execFile } = require('child_process')
    // const child = execFile(commandString, ['services/compiler.py', myLanguage, fileCode, id], (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(error)
    //         throw error
    //     }
    //     console.log('Out: ', stdout)
    //     console.log('Err: ', stderr)
    // })
}
