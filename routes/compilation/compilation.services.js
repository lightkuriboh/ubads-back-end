
module.exports = {
    getCompilationInfo
}

const Db = require('../../helpers/db')
const Compilation = Db.compilation

async function getCompilationInfo (id) {
    return await Compilation.find({id: id})
}
