const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Tag'
const COLLECTION_NAME = 'Tags'

const tagSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = mongoose.model(DOCUMENT_NAME, tagSchema)