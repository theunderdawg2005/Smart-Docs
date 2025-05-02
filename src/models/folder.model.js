const {model, Schema, Types} = require('mongoose')
const DOCUMENT_NAME = "Folder"
const COLLECTION_NAME = "Folders"
const folderSchema =  new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    quantity: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, folderSchema)