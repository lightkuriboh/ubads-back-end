
module.exports = {
    getCode
}

const Db = require('../../helpers/db')
const Submission = Db.submission
const Languages = require('../../config/listLanguage').languages
const CompilationServices = require('../../routes/compilation/compilation.services')

async function getCode ({id, userinfo}) {
    let submissionInfo = await Submission.find({id: id})
    if (submissionInfo && submissionInfo.length > 0) {
        let _owner = submissionInfo[0].owner
        if (userinfo.privilege === 'boss' || _owner === userinfo.username) {

            let compilation_info = await CompilationServices.getCompilationInfo(id)

            const fs = require('fs')
            for (let i = 0; i < Languages.length; i++) {
                const path = 'code/' + id.toString() + Languages[i].extend
                if (fs.existsSync(path)) {
                    let code = await fs.readFileSync(path, "utf8")
                    return {
                        code: code,
                        compilation_info: {
                            language: compilation_info[0].language,
                            result: compilation_info[0].result
                        }
                    }
                }
            }
            return 'Your code was deleted from server!'
        }
    }
}
