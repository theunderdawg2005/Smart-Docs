const express = require('express')
const { authentication } = require('../../auth/authUtils')
const tagController = require('../../controllers/tag.controller')
const router = express.Router()

router.use(authentication)

router.post('/', tagController.addTag)
router.get('/', tagController.getTagsByUserId)
router.put('/', tagController.updateTag)
router.delete('/', tagController.deleteTag)

module.exports = router