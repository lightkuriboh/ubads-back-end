
module.exports = {
    getLog
}

const Db = require('../../helpers/db')

async function getLog ({id}) {
    const path = 'fight_log/' + id.toString() + '.json'
    const fs = require('fs')
    if (fs.existsSync(path)) {
        let log = require('../../' + path)
        return log.data
    }
}
