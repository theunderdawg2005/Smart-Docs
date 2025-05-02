const folderModel = require("../folder.model")

const updateQuantityFolder = async (folderId) => {
    const folder = await folderModel.findById(folderId)
    folder.quantity += 1
    await folder.save()
}

module.exports = {
    updateQuantityFolder
}