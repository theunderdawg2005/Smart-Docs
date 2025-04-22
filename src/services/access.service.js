const { BadRequestError } = require("../core/error.response")
const bcrypt = require('bcrypt')
const userModel = require("../models/user.model")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { findUserByEmail } = require("./user.service")
const { getInfoData } = require("../utils")

class AccessService {
    static signUp = async ({fullname, username, email, password, phone, address}) => {
        const existedUser = await userModel.findOne({email}).lean()
        if(existedUser) {
            throw new BadRequestError("Người dùng đã tồn tại")
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            fullname,
            username,
            email,
            password: passwordHash,
            phoneNumber: phone,

        })

        if(newUser)
        {
            const tokens = await createTokenPair({userId: newUser._id, email})
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id, 
                refreshToken: tokens.refreshToken
            })

            if (!keyStore) {
                return {
                  code: "400",
                  message: "keyStore error",
                };
              }
        
              console.log(`Created Token Success::`, tokens);
              return {
                code: 201,
                metadata: {
                  user: newUser,
                  tokens,
                },
              };
        }

        return {
            code: 200,
            data: null
        }
    }

    static login = async ({email, password}) => {
      const userFound = await findUserByEmail({email})
      
      if(!userFound) {
        throw new BadRequestError("Mật khẩu hoặc email không trùng khớp")
      }

      const { _id: userId } = userFound
      const tokens = await createTokenPair({userId: userFound._id, email})

      await KeyTokenService.createKeyToken({
        userId,
        refreshToken: tokens.refreshToken
      })

      return {
        user: getInfoData({
          fields: [ "_id", "fullname" ,"email"],
          object: userFound
        }),
        tokens
      }
    }

    static logout = async (userId) => {
      const delKey = await KeyTokenService.removeKeyByUserId(userId)
      return delKey
    }
}

module.exports = AccessService

