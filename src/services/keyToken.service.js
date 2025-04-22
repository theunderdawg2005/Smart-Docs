const { Types } = require("mongoose")
const { BadRequestError } = require("../core/error.response")
const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {
    static createKeyToken = async ({userId, refreshToken}) => {
        try {
            const filter = {user: userId}
            const update = {
                refreshTokenUsed: [], refreshToken
            }

            const options = {upsert: true, new: true}

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.refreshToken : null
        } catch (error) {
            return error
        }
    }

    static findKeyByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: new Types.ObjectId(userId)})
    }

    static removeKeyByUserId = async (userId) => {
        return await keyTokenModel.deleteMany({
            user: new Types.ObjectId(userId)
        })
    }
}

module.exports = KeyTokenService