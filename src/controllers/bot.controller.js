const { GoogleGenerativeAI } = require('@google/generative-ai')
const express = require('express')
const { getDocumentById, extractTextFromDocument } = require('../services/document.service')
const { summarizeText } = require('../services/bot.service')
const botService = require('../services/bot.service')
const router = express.Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'})

class BotController {
    summarize = async (req, res, next) => {
        const textDoc = await extractTextFromDocument(req.params.id)
        
        const baseContext = 'Hãy tóm tắt đoạn văn bản sau: '
        const fullContext = baseContext + textDoc
        const result = await model.generateContent(fullContext)
        const response = await result.response
        const text = response.text()
        res.json({ message: text })
    }

    semanticSearch = async (req, res) => {
        try {
            const { question } = req.body;
            const result = await botService.semanticSearch(question, req.params.id);
            console.log(result);
            
            res.json({ result });
        } catch (error) {
            console.error("Semantic Search Error:", error);
            res.status(500).json({ error: "AI search failed" });
        }
    }
}

module.exports = new BotController()

