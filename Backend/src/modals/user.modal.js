const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true,"User name already taken"],
        required: true
    },
    email:{
        type:String,
        unique: [ true, "Account already exists with this email"],
        required: true
    },
    password:{
        type: String,
        required: true //why password should be unique ?
    }
},{
    timestamps:true
})

const userModal = mongoose.model("users", userSchema);
module.exports = userModal;