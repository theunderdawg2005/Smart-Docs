
const { updateUser } = require("../services/user.service")

class UserController {
    updateUser = async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ message: "No data provided" });
            }
            const updatedUser = await updateUser(req.user.userId, req.body);
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Error updating user", error: error.message });
        }
    }
}

module.exports = new UserController()