const express = require('express')
const router = express.Router()
const Records = require('./record.services')
const Token = require('../token/token')

router.get('/', getAll)
router.post('/add', create)

module.exports = router

function getAll (req, res, next) {
    Records.getAll()
        .then(
            (result) => res.json(result)
        )
        .catch(
            (err) => next(err)
        )
}

async function create (req, res, next) {
    if (await Token.authorizationOK(req)) {
        Records.addNew(req.body)
            .then(
                (result) => res.json(result)
            )
            .catch(
                (err) => next(err)
            )
    } else {
        res.status(401).json({ message: 'Authorization error!' })
    }
}
