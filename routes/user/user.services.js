const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../../helpers/db')
const User = db.User
const Token = require('../token/token')

module.exports = {
    authenticate,
    getInfoByUsername,
    create
}

async function authenticate({ username, password }) {
    const user = await User.findOne({ username })
    if (user && password === user.password) {
        const token = Token.provide(username, user.privilege)
        return {
            user,
            token
        }
    }
}

async function getInfoByUsername ({username}) {
    const user = await User.find({username: username})
    if (user && user.length > 0) {
        let answer = {
            username: username,
            privilege: user[0].privilege,
            metadata: user[0].metadata
        }
        return answer
    } else {
        return {
            username: '',
            metadata: {}
        }
    }
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken'
    }

    const user = new User(userParam)

    // hash password
    if (userParam.password) {
        user.hash = await bcrypt.hashSync(userParam.password, 10)
    }
    user.privilege = 'minion'

    // save user
    await user.save()
}
