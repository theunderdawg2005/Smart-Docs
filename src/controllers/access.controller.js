const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: "OTP đã gửi đến email của bạn!",
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    verifyUser = async (req, res) => {
        new CREATED({
            message: "Đã xác thực thành công!",
            metadata: await AccessService.verifyUser(req.body)
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