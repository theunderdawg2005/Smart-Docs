const express = require('express');
const router = express.Router();
const DocumentController = require('../../controllers/document.controller');
const upload = require('../../middleware/upload.middleware');
const { authentication } = require('../../auth/authUtils');

router.use(authentication)

// Thêm tài liệu
router.post('/', upload ,DocumentController.createDocument);

// Sửa tài liệu
router.put('/:id', DocumentController.updateDocument);

// Xóa tài liệu
router.delete('/:id', DocumentController.deleteDocument);

// Chia sẻ tài liệu
router.post('/share/:id', DocumentController.shareDocument);

router.post('/toggle-pin/:id', DocumentController.togglePinDocument)

// Truy cập tài liệu qua link chia sẻ
router.get('/share/:shareId', DocumentController.getSharedDocument);

// Tìm kiếm tài liệu
router.get('/search', DocumentController.searchDocuments);

// Lấy tất cả tài liệu
router.get('/', DocumentController.getAllDocuments);

router.get('/get-docs-user', DocumentController.getDocumentByUserId)

router.post('/add/:id', DocumentController.addDocToFolder)

router.get('/sumarize/:id', DocumentController.summarizeDocument)

// Xem tài liệu
router.get('/:id', DocumentController.getDocument);



module.exports = router;