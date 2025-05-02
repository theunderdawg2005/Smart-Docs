const folderModel = require("../models/folder.model")

class FolderService {
    static createFolder = async (name, userId) => {
        return await folderModel.create({
            name,
            userId
        })
    }

    static getFoldersByUserId = async (userId) => {
        return await folderModel.findOne({
            userId: userId
        })
    }
}

module.exports = FolderService