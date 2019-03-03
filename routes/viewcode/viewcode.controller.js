const express = require('express')
const router = express.Router()
const ViewCode = require('./viewcode.services')
const Token = require('../token/token')

router.use(async function (req, res, next) {
    const token = Token.retrieve(req)
    const payload = await Token.verify(token)
    if (payload === "Invalid") {
        res.status(401).json({ message: 'Authorization error!' })
    } else {
        next()
    }
})
router.post('/', getAll)

module.exports = router

function getAll (req, res, next) {
    req.body.userinfo = Token.getUserinfoFromToken(Token.retrieve(req))
    ViewCode.getCode(req.body)
        .then(
            (result) => {
                result ? res.json(result) : res.json('')
            }
        )
        .catch((err) => {
            console.log(err)
            next(err)
        })
}


