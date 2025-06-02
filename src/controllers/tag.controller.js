const tagsModel = require("../models/tags.model")
const tagService = require("../services/tag.service")

class TagController {
    getTagsByUserId = async (req, res) => {
        try {
            res.json(await tagService.getTagsByUser(req.user.userId))
        } catch (error) {
            res.status(500).json({ message: "Error getting tags", error: error.message });
        }
    }

    addTag = async(req, res) => {
        try {
            const {title} = req.body
            const tag = await tagService.addTag(req.user.userId, title)
            res.status(201).json(tag)
        } catch (error) {
            res.status(500).json({ message: "Error adding tag", error: error.message });
        }
    }

        // Xóa tag
    async deleteTag(req, res) {
        try {
            const { title } = req.body;
            await tagService.deleteTag(req.user.userId, title);
            res.json({ message: "Tag deleted successfully" });
        } catch (error) {
            res.status(400).json({ message: "Error deleting tag", error: error.message });
        }
    }

    // Cập nhật tên tag
    async updateTag(req, res) {
        try {
            const { oldTitle, newTitle } = req.body;
            const tag = await tagService.updateTag(req.user.userId, oldTitle, newTitle);
            res.json(tag);
        } catch (error) {
            res.status(500).json({ message: "Error updating tag", error: error.message });
        }
    }
}

module.exports = new TagController()