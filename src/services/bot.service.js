const { GoogleGenerativeAI } = require('@google/generative-ai')
const express = require('express')
const { getDocumentById, extractTextFromDocument } = require('../services/document.service')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'})

class BotService {

    semanticSearch = async (question, documentId) => {
        const textDoc = await extractTextFromDocument(documentId)

        const cleanedText = textDoc.trim();
        const segments = cleanedText.split('\n').map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');

        const prompt = `
            Bạn là AI tìm kiếm văn bản thông minh. Văn bản dưới đây được chia thành các đoạn (ngăn cách bằng dấu xuống dòng \`\\n\`). Nhiệm vụ của bạn là tìm đoạn có **ý nghĩa gần nhất với truy vấn**.

            Văn bản:
            ${segments}

            Truy vấn:
            ${question}

            Kết quả:
            (Trả lại đúng một đoạn phù hợp nhất)
                    `.trim();

        const result = await model.generateContent(prompt)
        const response = await result.response;
        const text = response.text().trim();
        return text;
    }
}

module.exports = new BotService()

