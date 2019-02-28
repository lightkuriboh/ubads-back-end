const express = require('express')
const router = express.Router()
const Submissions = require('./submission.services')
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

router.get('/', getAll)
router.post('/mine', getMine)
router.post('/add', create)

module.exports = router

function getAll (req, res, next) {
    Submissions.getAll()
        .then(
            (result) => res.json(result)
        )
        .catch(
            (err) => next(err)
        )
}

function getMine (req, res, next) {
    Submissions.getMine(req.body)
        .then(
            (result) => {
                res.json(result)
            }
        )
        .catch(
            (err) => {
                next(err)
            }
        )
}

function create (req, res, next) {
    Submissions.addNew(req.body)
        .then(
            (result) => res.json(result)
        )
        .catch(
            (err) => next(err)
        )
}
