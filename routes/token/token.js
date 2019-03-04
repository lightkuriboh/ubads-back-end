const jwt = require("jsonwebtoken");
const secret_key = require('../../config/config').secret

module.exports = {
    verify,
    retrieve,
    provide,
    getUserInfoFromToken,
    authorizationOK
}

function verify(token) {
    return new Promise(function(resolve) {
        jwt.verify(token, secret_key, function(err, payload) {
            if (err) resolve("Invalid")
            else resolve(payload)
        })
    })
}

function retrieve(request) {
    return request.headers.authorization
}

function provide(username, privilege) {
    const payload = {
        username,
        privilege
    }
    const signSetting = {
        // expiresIn: "1 days"
    }
    return jwt.sign(payload, secret_key, signSetting)
}

function getUserInfoFromToken(token) {
    let decoded = {}
    try {
        decoded = jwt.verify(token, secret_key)
    } catch (e) {
        return {username: '', privilege: ''}
    }
    return decoded
}

async function authorizationOK (req) {
    const token = retrieve(req)
    const payload = await verify(token)
    if (payload === "Invalid") {
        return false
    }
    return true
}
