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
const { NotFoundError } = require('../core/error.response');
const tagsModel = require('../models/tags.model');
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
  async updateDocument(documentId, { title, tags }, userId) {
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const document = await Document.findByIdAndUpdate(
      documentId,
      {
        title,
        tags: tagArray
      },
      { new: true }
    )
    if (!document) {
      throw new Error('Document not found');
    }
    for(const tagTitle of tagArray) {
      await tagsModel.findOneAndUpdate(
        {title: tagTitle, userId },
        {title: tagTitle, userId},
        {upsert: true, new: true}
    )
    }
      const allTags = await tagsModel.find({ userId });
      for (const tag of allTags) {
        const used = await Document.exists({ tags: tag.title, uploadedBy: userId });
        if (!used) {
          await tagsModel.deleteOne({ _id: tag._id });
        }
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

  async extractTextFromDocument(documentId)
  {
    try {

      const document = await Document.findById(documentId)
      if(document.extractedText)
      {
        return document.extractedText
      }
      const response = await axios.get(document.fileUrl, { responseType: 'arraybuffer' })
      const fileBuffer = Buffer.from(response.data)

      const fileExt = document.fileType
      console.log(fileExt);
      
      if (fileExt === 'application/pdf') {
        const pdfData = await pdfParse(fileBuffer);
        document.extractedText = pdfData.text;
        await document.save()
        return pdfData.text;
      } else if (fileExt === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        document.extractedText = result.value;
        await document.save()
        return result.value;
      } else if (fileExt === 'text/plain') {
        document.extractedText = fileBuffer.toString()
        await document.save()
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
      // Kiểm tra đầu vào
      if (!documentId || typeof documentId !== 'string') {
          throw new BadRequestError("Invalid document ID");
      }
      if (!folderId || typeof folderId !== 'string') {
          throw new BadRequestError("Invalid folder ID");
      }

      // Tìm tài liệu
      const document = await Document.findById(documentId);
      if (!document) {
          throw new NotFoundError("Document not found");
      }

      // Kiểm tra nếu tài liệu đã thuộc thư mục
      if (document.folderId && document.folderId.toString() === folderId) {
          throw new BadRequestError("Document is already added to folder!");
      }

      // Cập nhật số lượng tài liệu trong thư mục
      await updateQuantityFolder(folderId);

      // Cập nhật folderId cho tài liệu
      const updatedDocument = await Document.findByIdAndUpdate(
          documentId,
          { folderId },
          { new: true }
      );

      return updatedDocument;
  }

  async togglePinDocument(documentId) {
    const document = await Document.findById(documentId)
    if(!document) {
      throw new NotFoundError("Document not found")
    }

    document.isPinned = !document.isPinned
    await document.save()
    return document
  }

  async getPinnedDocumentByUserId(userId) {
    return await Document.find({
      uploadedBy: userId,
      isPinned: true
    }).sort({
      createdAt: -1
    })
  }

  async filterDocument(userId, payload) {
    const {tags, fileType} = payload
    const query = { uploadedBy: userId}

    if(tags && tags.length > 0)
    {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
      query.tags = { $all: tagArray}
    }

    if(fileType)
    {
      query.fileType = fileType
    }

    return await Document.find(query).sort({createdAt: -1})
  }

}

module.exports = new DocumentService();