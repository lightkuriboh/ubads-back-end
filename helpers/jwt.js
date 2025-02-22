const express_jwt = require('express-jwt')
const config = require('../config')
const userService = require('../routes/user/user.services')

module.exports = jwt

function jwt () {
    const secret = config.secret
    return express_jwt({
        secret,
        isRevoked
    }).unless({
        path: [
            '/user/login',
            '/user/register'
        ]
    })
}

async function isRevoked (req, payload, done) {
    const user = await userService.getById(payload.sub)
    if (!user) {
        return done(null, true)
    }
    done()
}
