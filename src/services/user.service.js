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

const updateUser = async (userId, payload) => {
    const allowFields = ["fullname", "username", "email", "phoneNumber"]
    const updatedData = {}

    Object.keys(payload).forEach((key) => {
        if(allowFields.includes(key))
        {
            updatedData[key] = payload[key]
        }
    })

    if(Object.keys(updatedData).length === 0)
    {
        throw new Error("Không có trường hợp ngoại lệ!")
    }

    const userUpdated = await userModel.findByIdAndUpdate(
        userId,
        {
            $set: payload
        },
        {new: true, runValidators: true}
    )

    if (!userUpdated) {
        throw new NotFoundError("Không tìm thấy người dùng");
    }
    return userUpdated;
}

module.exports= {
    findUserByEmail,
    updateUser
}