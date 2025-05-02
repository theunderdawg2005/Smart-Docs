const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const botController = require('../../controllers/bot.controller')
const router = express.Router()

router.post('/summarize/:id', asyncHandler(botController.summarize))


module.exports = router