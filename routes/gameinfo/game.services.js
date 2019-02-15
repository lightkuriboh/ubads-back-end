const db = require('../../helpers/db')
const Game = db.game

module.exports = {
    getAll,
    getByID
}

async function getAll() {
    return await Game.find({active: true})
}

async function getByID({id}) {
    return await Game.find({active: true, id: id})
}
