module.exports = {
    getListLanguages
}

async function getListLanguages () {
    let lang = require('../../config/listLanguage')
    return await JSON.stringify(lang.languages)
}
