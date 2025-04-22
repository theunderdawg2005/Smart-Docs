const userModel = require("../models/user.model")

const findUserByEmail = async ({
    email, 
    select = {
        email: 1,
        password: 2,
        fullname: 1,
        username: 1
    }
}) => {
    return await userModel.findOne({email}).select(select).lean()
}

module.exports= {
    findUserByEmail
}