const express = require('express')
const folderController = require('../../controllers/folder.controller')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.use(authentication)

router.post('/', folderController.createFolder)
router.get('/', folderController.getFoldersByUserId)
router.get('/:id', folderController.getDocumentsByFolderId)
router.delete('/:id', folderController.deleteFolder)

module.exports = router