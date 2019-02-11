const express = require('express')
const router = express.Router()
const Records = require('./record.services')

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

function create (req, res, next) {
    Records.addNew(req.body)
        .then(
            (result) => res.json(result)
        )
        .catch(
            (err) => next(err)
        )
}
