const express_jwt = require('express-jwt')
const config = require('../config/config')

module.exports = jwt

function jwt () {
    const secret = config.secret
    return express_jwt({secret: secret}).unless({
        path: [
            '/user/login',
            '/user/register'
        ]
    })
}
