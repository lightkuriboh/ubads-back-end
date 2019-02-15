const express = require('express')
const router = express.Router()
const ViewCode = require('./viewcode.services')

router.post('/', getAll)

module.exports = router

function getAll (req, res, next) {
    ViewCode.getCode(req.body)
        .then(
            (result) => result ? res.json(result) : res.json('')
        )
        .catch((err) => {
            console.log(err)
            next(err)
        })
}


