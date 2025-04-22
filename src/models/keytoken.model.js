const {Schema, model} = require('mongoose'); 

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys'

var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    refreshTokensUsed:{
        type: Array,
        default: [] // RT da duoc su dung
    },
    refreshToken: {
        type: String, 
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);