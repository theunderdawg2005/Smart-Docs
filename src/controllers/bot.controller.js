const { GoogleGenerativeAI } = require('@google/generative-ai')
const express = require('express')
const { getDocumentById, extractTextFromDocument } = require('../services/document.service')
const { summarizeText } = require('../services/bot.service')
const router = express.Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'})

class BotController {
    summarize = async (req, res, next) => {
        const document = await getDocumentById(req.params.id)
        const textDoc = await extractTextFromDocument(document)
        
        const baseContext = 'Hãy tóm tắt đoạn văn bản sau: '
        const fullContext = baseContext + textDoc
        const result = await model.generateContent(fullContext)
        const response = await result.response
        const text = response.text()
        res.json({ message: text })
    }
}

module.exports = new BotController()

