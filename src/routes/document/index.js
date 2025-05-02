const express = require('express');
const router = express.Router();
const DocumentController = require('../../controllers/document.controller');
const upload = require('../../middleware/upload.middleware');
const { authentication } = require('../../auth/authUtils');


// Thêm tài liệu
router.post('/', upload, DocumentController.createDocument);

// Sửa tài liệu
router.put('/:id', DocumentController.updateDocument);

// Xóa tài liệu
router.delete('/:id', DocumentController.deleteDocument);

// Chia sẻ tài liệu
router.post('/:id/share', DocumentController.shareDocument);

// Truy cập tài liệu qua link chia sẻ
router.get('/share/:shareId', DocumentController.getSharedDocument);

// Tìm kiếm tài liệu
router.get('/search', DocumentController.searchDocuments);

// Lấy tất cả tài liệu
router.get('/', DocumentController.getAllDocuments);

// Xem tài liệu
router.get('/:id', DocumentController.getDocument);

router.get('/:id/summarize', DocumentController.summarizeDocument)

module.exports = router;