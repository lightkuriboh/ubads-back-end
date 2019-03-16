const express = require('express')
const router = express.Router()
const ViewLog = require('./viewlog.services')

router.post('/', getLog)

module.exports = router

function getLog (req, res, next) {
    ViewLog.getLog(req.body)
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


