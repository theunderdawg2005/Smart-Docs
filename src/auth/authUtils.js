const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { BadRequestError } = require('../core/error.response');
const { findKeyByUserId } = require('../services/keyToken.service');
const HEADER = {
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization"
}

const createTokenPair = async (payload) => {
    try {
        const accessToken = await JWT.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, process.env.SECRET_KEY, (err, decode) => {
            if(err)
            {
                console.error(`error verify:: `, err);
                
            }
            else {
                console.error(`decode verify::`, decode);
                
            }
        })

        return {accessToken, refreshToken};
    } catch (error) {
        return error
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const accessToken = req.headers[HEADER.AUTHORIZATION]

    if(!accessToken)
    {
        throw new BadRequestError("Yêu cầu không hợp lệ")
    }

    try {
        const decodeUser = JWT.verify(accessToken, process.env.SECRET_KEY)

        const keyStore = await findKeyByUserId(decodeUser.userId)

        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    }
    catch (err) {
        throw err
    }
})

module.exports = {
    createTokenPair,
    authentication
}