const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Question'
const COLLECTION_NAME = 'Questions'

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  question: String,
  answer: String,
  matchedSegments: [String], // text của các đoạn gần nhất
  createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, questionSchema);
