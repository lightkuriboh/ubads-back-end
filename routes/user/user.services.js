const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../../helpers/db')
const User = db.User

module.exports = {
    authenticate,
    getInfoByUsername,
    create
}

async function authenticate({ username, password }) {
    const user = await User.findOne({ username })
    if (user && password === user.password) {
        const token = jwt.sign({ sub: user.username }, config.secret)
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
        user.hash = bcrypt.hashSync(userParam.password, 10)
    }

    // save user
    await user.save()
}
