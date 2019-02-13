module.exports = {
    getCode
}

async function getCode (idData) {
    const fs = require('fs')
    const path = 'code/' + idData.id.toString()
    return await fs.readFileSync(path, "utf8")
}
