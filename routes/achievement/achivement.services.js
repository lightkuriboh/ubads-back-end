const db = require('../../helpers/db')
const Achievement = db.achievement

module.exports = {
    getAll,
    getGame,
    getUserInfo,
    getActiveSubmission
}

async function getGame({game}) {
    return await Achievement.find({game: game})
}

async function getAll() {
    return await Achievement.find()
}

async function getUserInfo ({username, game}) {
    let ans = await Achievement.findOne({username: username, game: game})
    if (ans) {
        return ans
    }
    return {}
}

async function getActiveSubmission ({username, game}) {
    let ans = await Achievement.findOne({username: username, game: game})
    if (ans) {
        return ans.active_submission
    }
    return ''
}

