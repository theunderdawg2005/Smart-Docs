const {model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new Schema ({
    fullname: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
    type: Date,
    default: Date.now,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);