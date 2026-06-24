const jwt = require("jsonwebtoken")
const tokenBlacklistModal = require("../modals/blacklist.modal")

async function authUser(req,res,next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Token not provided"
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModal.findOne({
        token
    })
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Token is invalid (blacklisted)"
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)          //whatever data we get after reading the token is stored in "decoded"
        req.user = decoded                                //in this line,we are creating new property "user" in req and set the data read through decoded in this req.body
        next()                                            //is used to forward the req to controller

    }catch(err){
        return res.status(401).json({
            message: "Invalid token,"
        })
    }
}

module.exports = { authUser }