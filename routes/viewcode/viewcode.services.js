
module.exports = {
    getCode
}

const Submission = require('../../helpers/db').submission
const Languages = require('../../config/listLanguage').languages

async function getCode ({id, owner}) {
    let submissionInfo = await Submission.find({id: id})
    if (submissionInfo && submissionInfo.length > 0) {
        let _owner = submissionInfo[0].owner
        if (_owner === owner) {
            const fs = require('fs')
            for (let i = 0; i < Languages.length; i++) {
                const path = 'code/' + id.toString() + Languages[i].extend
                if (fs.existsSync(path)) {
                    return await fs.readFileSync(path, "utf8")
                }
            }
            return 'Your code was deleted from server!'
        }
    }
}
