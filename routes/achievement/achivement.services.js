const db = require('../../helpers/db')
const Achievement = db.achievement

module.exports = {
    getAll,
    getGame
}

async function getGame({game}) {
    return await Achievement.find({game: game})
}

async function getAll() {
    return await Achievement.find()
}
