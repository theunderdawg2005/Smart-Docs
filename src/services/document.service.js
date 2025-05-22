const { exec } = require('child_process');
const Document = require('../models/document.model');
const fs = require('fs').promises;
const path = require('path');
const { stderr, stdout } = require('process');
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth');
const { default: axios } = require('axios');
const { updateQuantityFolder } = require('../models/repository/folder.repo');
const folderModel = require('../models/folder.model');
const { BadRequestError } = require('openai');
const { searchProductByUser } = require('../models/repository/product.repo');
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

class DocumentService {
  // Thêm tài liệu
  async createDocument( userId, { title, fileUrl, fileName, fileType ,tags }) {
    const document = new Document({
      title,
      fileUrl,
      fileName,
      fileType,
      tags: tags,
      uploadedBy: userId
    });
    return await document.save();
  }

  async getDocumentByUserId(userId) {
    return await Document.find({
      uploadedBy: userId
    }).sort({
      createdAt: -1
    })

  }

  // Sửa tài liệu
  async updateDocument(id, { title, tags }) {
    const document = await Document.findByIdAndUpdate(
      id,
      {
        title,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
      },
      { new: true }
    )
    if (!document) {
      throw new Error('Document not found');
    }
    return document;
  }

  // Xóa tài liệu
  async deleteDocument(id) {
    const document = await Document.findByIdAndDelete(id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    const publicId = document.fileUrl.split('/').pop().split('.')[0]

    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })

    await Document.deleteOne({ _id: id})
  }

  async searchDocumentsByUser(keyword) {
    const documents = await Document.find({
      title: { $regex: keyword, $options: "i"}
    })

    return documents
  }

  // Tìm kiếm tài liệu
  async searchDocuments({ keyword, tags, uploadedBy, startDate, endDate }) {
    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (tags) {
      query.tags = { $all: tags.split(',').map(tag => tag.trim()) };
    }

    if (uploadedBy) {
      query.uploadedBy = uploadedBy;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    return await Document.find(query).sort({ createdAt: -1 });
  }

  // Lấy tất cả tài liệu
  async getAllDocuments() {
    return await Document.find().sort({ createdAt: -1 });
  }

  // Lấy tài liệu theo ID
  async getDocumentById(id) {
    const document = await Document.findById(id);
    if (!document) {
      throw new Error('Document not found');
    }
    return document;
  }

  async extractTextFromDocument(document)
  {
    try {
      const response = await axios.get(document.fileUrl, { responseType: 'arraybuffer' })
      const fileBuffer = Buffer.from(response.data)

      const fileExt = path.extname(document.fileName).toLowerCase()

      if (fileExt === '.pdf') {
        const pdfData = await pdfParse(fileBuffer);
        return pdfData.text;
      } else if (fileExt === '.docx' || fileExt === '.doc') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value;
      } else if (fileExt === '.txt') {
        return fileBuffer.toString();
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      throw new Error(`Error extracting text: ${error.message}`);
    }
  }

  async summarizeDocument(document) {

    
    const text = await this.extractTextFromDocument(document)
    if(!text) {
      throw new Error('No text was found')
    }

    console.log(text);
    
    const maxLengthPerChunk = 4096;  // Tăng giới hạn lên 4096
    const chunks = [];
    for (let i = 0; i < text.length; i += maxLengthPerChunk) {
      chunks.push(text.substring(i, i + maxLengthPerChunk));
    }

    const summaries = [];
    for (const chunk of chunks) {
      try {
        const response = await axios.post(
          `${process.env.NGROK_URL}/summarize`,
          {
            text: chunk,
            max_length: 100,
            min_length: 30
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && response.data.summary) {
          summaries.push(response.data.summary);
        }
      } catch (error) {
        throw new Error(`Error summarizing with Colab API: ${error.response?.data?.detail || error.message}`);
      }
    }

    const finalSummary = summaries.join(' ');
    return finalSummary;
  }

  async addDocumentToFolder(documentId, folderId) {
    const document = await Document.findById(documentId)
    
    if(document.folderId.toString() === folderId) {
      throw new BadRequestError("Document is already added to folder!")
    }
    await updateQuantityFolder(folderId)
    
    return await Document.findByIdAndUpdate(
      documentId
    , {
      folderId
    }, {
      new: true
    })
  }

}

module.exports = new DocumentService();