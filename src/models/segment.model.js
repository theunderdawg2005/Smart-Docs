const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Segment'
const COLLECTION_NAME = 'Segments'

const segmentSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  text: { type: String, required: true },
  embedding: [{ type: Number, required: true }],
  createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, segmentSchema);
