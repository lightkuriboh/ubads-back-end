const db = require('../../helpers/db')
const Game = db.game

module.exports = {
    getAll
}

async function getAll() {
    return await Game.find({active: true})
}
