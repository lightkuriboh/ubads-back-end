
module.exports = {
    getCode
}

const Submission = require('../../helpers/db').submission

async function getCode ({id, owner}) {
    let submissionInfo = await Submission.find({id: id})
    if (submissionInfo && submissionInfo.length > 0) {
        let _owner = submissionInfo[0].owner
        if (_owner === owner) {
            const fs = require('fs')
            const path = 'code/' + id.toString()
            return await fs.readFileSync(path, "utf8")
        }
    }
}
