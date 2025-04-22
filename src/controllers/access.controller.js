const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: "Đăng kí thành công!",
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    login = async (req, res) => {
        new SuccessResponse({
            message: "Đăng nhập thành công",
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res) => {
        new SuccessResponse({
            message: "Đã đăng xuất!",
            metadata: await AccessService.logout(req.user.userId)
        }).send(res)
    }
}

module.exports = new AccessController()