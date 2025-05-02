const express = require('express')
const router = express.Router()

router.use('/auth', require('./access'))

router.use('/document', require('./document'))

router.use('/bot', require('./bot'))

module.exports = router