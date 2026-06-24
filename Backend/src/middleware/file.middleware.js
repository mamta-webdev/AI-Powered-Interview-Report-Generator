const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize:3*1024*1024  //3MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed."))
        }
        cb(null, true)
    },
})

module.exports = upload
