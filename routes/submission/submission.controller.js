const express = require('express')
const router = express.Router()
const Submissions = require('./submission.services')

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
