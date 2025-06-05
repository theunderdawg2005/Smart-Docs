const { text } = require('express')
const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWD
    }
})

const sendOTPEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Smart Docs OTP',
        text: `Your OTP code is: ${otp}. It expires in 5 minutes.`
    }

    await transporter.sendMail(mailOptions)
}

module.exports = {
    sendOTPEmail
}