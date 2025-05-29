const { GoogleGenerativeAI } = require('@google/generative-ai')
const express = require('express')
const { getDocumentById, extractTextFromDocument } = require('../services/document.service')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'})

class BotService {

    semanticSearch = async (question, documentId) => {
        const document = await getDocumentById(documentId)
        const textDoc = await extractTextFromDocument(document)

        const prompt = `
        Bạn là một trợ lý AI. Dưới đây là các đoạn của một tài liệu:

        ${textDoc}

        Người dùng hỏi: "${question}"
        Hãy chọn đoạn phù hợp nhất, trả về số đoạn và nội dung đoạn đó.
        `;

        const result = await model.generateContent(prompt)
        const response = await result.response;
        const text = response.text()
        return text;
    }
}

module.exports = new BotService()

