const documentModel = require("../models/document.model")
const folderModel = require("../models/folder.model")

class FolderService {
    static createFolder = async (name, userId) => {
        return await folderModel.create({
            name,
            userId
        })
    }


    static getFoldersByUserId = async (userId) => {
        return await folderModel.find({
            userId: userId
        }).sort({ createdAt: -1 }) // Sort by creation date, newest first
    }

    static getDocumentByFolderId = async (folderId) => {
        return await documentModel.find({
            folderId
        })
    }

    static deleteFolder = async (id) => {
        return await folderModel.deleteOne({_id: id})
    }


}

module.exports = FolderService