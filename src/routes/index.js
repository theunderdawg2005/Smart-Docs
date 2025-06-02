const express = require('express')
const router = express.Router()

router.use('/auth', require('./access'))

router.use('/folder', require('./folder'))

router.use('/document', require('./document'))

router.use('/bot', require('./bot'))

router.use('/api', require('./config'))

router.use('/tag', require('./tag'))

module.exports = router