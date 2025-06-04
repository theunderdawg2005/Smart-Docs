const express = require('express')
const { authentication } = require('../../auth/authUtils')
const userController = require('../../controllers/user.controller')
const router = express.Router()

router.use(authentication)

router.patch('/update', userController.updateUser)

module.exports = router