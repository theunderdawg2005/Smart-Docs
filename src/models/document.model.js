const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Document'
const COLLECTION_NAME = 'Documents'

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    },
    fileType: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    tags: {
        type: [String],
        default: []
    },
    extractedText: { type: String },
    summary: { type: String },
    folderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Folder'
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
  sharedLink: { type: String, unique: true, sparse: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = mongoose.model(DOCUMENT_NAME, documentSchema)