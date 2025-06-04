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
        }).sort({ createdAt: -1 })
    }

    static getDocumentByFolderId = async (folderId) => {
        return await documentModel.find({
            folderId
        })
    }

    static deleteFolder = async (id) => {
        return await folderModel.deleteOne({_id: id})
    }

    static updateFolder = async (folderId, payload) => {
        const {title} = payload
        const updatedFolder = folderModel.findByIdAndUpdate(
            folderId,
            { title },
            {new: true, runValidators: true}
        )
        if (!updatedFolder) {
            throw new Error("Folder not found");
        }
        return updatedFolder;
    }
}

module.exports = FolderService