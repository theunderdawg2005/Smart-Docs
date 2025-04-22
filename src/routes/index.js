const express = require('express')
const router = express.Router()

router.use('/auth', require('./access'))

module.exports = router