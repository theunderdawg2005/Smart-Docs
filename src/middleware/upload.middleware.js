const multer = require('multer')
const path = require('path')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf|doc|docx|txt/
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimeType = fileTypes.test(file.mimetype)
        if(extName && mimeType)
        {
            
            return cb(null, true)
        }
        console.log(extName + " " + mimeType);
        cb(new Error('Only PDF, DOC, DOCX, TXT files are allowed!'))

    }
}).single('document')

module.exports = upload