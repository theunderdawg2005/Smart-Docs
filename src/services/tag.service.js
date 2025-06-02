
const Document = require('../models/document.model');
const tagsModel = require('../models/tags.model');

class TagService {
  // Lấy tất cả tag của user
  async getTagsByUser(userId) {
    return await tagsModel.find({ userId }).sort({ createdAt: -1 });
  }

  // Thêm tag mới (nếu chưa tồn tại)
  async addTag(userId, title) {
    return await tagsModel.findOneAndUpdate(
      { userId, title },
      { userId, title },
      { upsert: true, new: true }
    );
  }

  // Xóa tag (chỉ khi không còn document nào dùng tag này)
  async deleteTag(userId, title) {
    const used = await Document.exists({ tags: title, uploadedBy: userId });
    if (used) {
      throw new Error('Tag is still used in some documents');
    }
    return await tagsModel.deleteOne({ userId, title });
  }

  // Cập nhật tên tag
  async updateTag(userId, oldTitle, newTitle) {
    // Đổi tên tag trong Tag collection
    const tag = await tagsModel.findOneAndUpdate(
      { userId, title: oldTitle },
      { title: newTitle },
      { new: true }
    );
    // Đổi tên tag trong tất cả document của user
    await Document.updateMany(
      { uploadedBy: userId, tags: oldTitle },
      { $set: { "tags.$[elem]": newTitle } },
      { arrayFilters: [{ "elem": oldTitle }] }
    );
    return tag;
  }
}

module.exports = new TagService();