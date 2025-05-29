const DocumentService = require('../services/document.service');
const path = require('path');
const { exec } = require('child_process');
const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

class DocumentController {
  // Thêm tài liệu
    async createDocument(req, res) {
      try {
        if (!req.file) {
          throw new BadRequestError({
            message: 'No file uploaded'
          })
        }
        const { title, tags } = req.body;
        const userId = req.user.userId
        if (!title) {
          throw new BadRequestError({
            message: 'title is required'
          })
        }
        console.log('FILE: ', req.file);
        console.log("title: ", title);
        
        
        const fileBuffer = req.file.buffer

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              resource_type: 'raw',
              folder: "documents",
            },
          (error, result) => {
            if(error) reject(error);
            else resolve(result)
          }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream)
        })

        const document = await DocumentService.createDocument( userId,{
          title,
          fileUrl: result.secure_url,
          fileName: req.file.originalname,
          fileType: req.file.mimetype,
          tags: tags ? tags.split(',') : [],

        });

        res.status(201).json({ message: 'Document uploaded successfully', document });
      } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Error uploading document', error: error.message });
      }
    }

  // Sửa tài liệu
  async updateDocument(req, res) {
    try {
      const document = await DocumentService.updateDocument(req.params.id, req.body);
      res.json({ message: 'Document updated successfully', document });
    } catch (error) {
      console.log(error.message);
      res.status(error.message === 'Document not found' ? 404 : 500).json({ message: error.message });
    }
  }

  // Xóa tài liệu
  async deleteDocument(req, res) {
    try {
      await DocumentService.deleteDocument(req.params.id);
      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      res.status(error.message === 'Document not found' ? 404 : 500).json({ message: error.message });
    }
  }

  // Chia sẻ tài liệu
  async shareDocument(req, res) {
    try {
      const sharedLink = await DocumentService.shareDocument(req.params.id);
      res.json({ message: 'Share link generated', sharedLink });
    } catch (error) {
      res.status(error.message === 'Document not found' ? 404 : 500).json({ message: error.message });
    }
  }

  // Truy cập tài liệu qua link chia sẻ
  async getSharedDocument(req, res) {
    try {
      const document = await DocumentService.getSharedDocument(req.params.shareId);
      res.sendFile(path.resolve(document.filePath));
    } catch (error) {
      res.status(error.message === 'Shared document not found' ? 404 : 500).json({ message: error.message });
    }
  }

  // Tìm kiếm tài liệu
  async searchDocuments(req, res) {
    const keyword = req.query.q
    const results = await DocumentService.searchDocumentsByUser(keyword)
    res.json(results)
  }

  // Lấy tất cả tài liệu
  async getAllDocuments(req, res) {
    try {
      const documents = await DocumentService.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
  }

  // Xem tài liệu
  async getDocument(req, res) {
    try {
      const document = await DocumentService.getDocumentById(req.params.id);
      res.json(document)
    } catch (error) {
      res.status(error.message === 'Document not found' ? 404 : 500).json({ message: error.message });
    }
  }

  async getDocumentByUserId(req, res) {
    try {
      const document = await DocumentService.getDocumentByUserId(req.user.userId)
      console.log(req.user.userId)
      res.json(document)
    } catch (error) {
      res.status(error.message === 'User not found' ? 404: 500).json({
        message: error.message
      })
    }
  }

  // Tóm tắt tài liệu
  async summarizeDocument(req, res) {
    try {
      const document = await DocumentService.getDocumentById(req.params.id);
      if (!document || !document.fileUrl) {
        return res.status(404).json({ message: 'Document or file path not found' });
      }

      const summary = await DocumentService.summarizeDocument(document.fileUrl);
      res.json({ 
        message: 'Document summarized successfully', 
        summary 
      });
    } catch (error) {
      res.status(500).json({ message: 'Error summarizing document', error: error.message });
    }
  }

  async addDocToFolder(req, res) {
    try {
      res.json({
        message: "Added document to folder!",
        data: await DocumentService.addDocumentToFolder(req.params.id, req.body.folderId)
      })
    } catch (error) {
      res.status(500).json({ message: "Error moving document", error: error.message });
    }
  }

  async togglePinDocument(req, res) {
    try {
      
      const document = await DocumentService.togglePinDocument(req.params.id)
      res.json({
        message: 'Toggled oke!',
        metada: document
      })
    } catch (error) {
      res.status(error.message === 'Document not found' ? 404 : 500).json({
        message: error.message
      });
    }
  }

  async getPinnedDocument(req, res) {
    try {
      
      const document = await DocumentService.getPinnedDocumentByUserId(req.user.userId)
      res.json(document)
    } catch (error) {
      res.status(error.message === 'User not found' ? 404 : 500).json({
        message: error.message
      });
    }
  }

  async filterDocument(req, res) {
    try {
      const documents = await DocumentService.filterDocument(req.user.userId, req.query)
      res.json(documents)
    } catch (error) {
      res.status(error.message === 'User not found' ? 404 : 500).json({
        message: error.message
      });
    }
  }
}


module.exports = new DocumentController();