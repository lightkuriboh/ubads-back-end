module.exports = {
    getListLanguages
}

async function getListLanguages () {
    let fs = require('./list')
    return await JSON.stringify(fs.languages)
}
