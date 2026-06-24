const mongoose = require("mongoose");

const blacklistTokenSchema  = new mongoose.Schema({
    token:{
        type:String,
        required: [true, "Token is required to blacklist a token"],
    }
},{
    timestamps: true
})

const tokenBlacklistModal = mongoose.model("BlacklistToken", blacklistTokenSchema)

module.exports = tokenBlacklistModal;