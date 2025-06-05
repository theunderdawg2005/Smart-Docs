const { BadRequestError } = require("../core/error.response")
const bcrypt = require('bcrypt')
const userModel = require("../models/user.model")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { findUserByEmail } = require("./user.service")
const { getInfoData } = require("../utils")
const { sendOTPEmail } = require("../utils/sendEmail")
const redisClient = require("../configs/config.redis")

class AccessService {
    static signUp = async (payload) => {
      try {
        if (!payload) {
          throw new BadRequestError("Missing request body");
        }

        const { fullname, username, email, password, phone } = payload;
        const existedUser = await userModel.findOne({email}).lean()
        if(existedUser) {
            throw new BadRequestError("Người dùng đã tồn tại")
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        const otpExpiresInSeconds = 5 * 60

        await sendOTPEmail(email, otp)

        await redisClient.setEx(`signup: ${email}`, otpExpiresInSeconds, JSON.stringify({
              fullname,
              username,
              email,
              password, 
              phone,
              otp
        }))

        

        return {
            code: 200,
            data: "OTP sent to email"
        }
      }
      catch (error) 
      {
        console.error("SignUp Error:", error); 
        throw error;
      }
    }

    static verifyUser = async ({email, otp}) => {
      const data = await redisClient.get(`signup: ${email}`)
      if(!data)
      {
        throw new BadRequestError("OTP expired or not requested!")
      }

      const parsed = JSON.parse(data)
      if(parsed.otp !== otp)
      {
        throw new BadRequestError("Invalid OTP");
      }

      const passwordHash = await bcrypt.hash(parsed.password, 10);

      const newUser = await userModel.create({
            fullname: parsed.fullname,
            username: parsed.username,
            email: parsed.email,
            password: passwordHash,
            phoneNumber: parsed.phone,
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
          fields: [ "_id", "fullname", "username", "email", "phone"],
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

