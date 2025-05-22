const {Types} = require('mongoose');
const Document = require('../document.model');
const searchProductByUser = async ({query}) => {
    const regexSearch = new RegExp(query, 'i');
    const products = await Document.find({
        $or: [
            { title: {$regex: regexSearch } },
            { tags: {$regex: regexSearch } },
        ]
    })
    .sort({ createdAt: -1 })
    .lean()
    return products
}

module.exports = {
    searchProductByUser
}