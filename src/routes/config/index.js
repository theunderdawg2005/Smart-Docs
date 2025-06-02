const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.use(authentication)

router.get('/config', (req, res) => {
    const apiKey = process.env.FPT_KEY

    if(!apiKey)
    {
        return res.status(500).json({ message: 'API key not configured' });
    }
    res.json({ fpt_api_key: apiKey });
})

module.exports = router