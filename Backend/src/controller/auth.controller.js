const userModal = require("../modals/user.modal");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlackListModal = require("../modals/blacklist.modal")


/**
 *
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request
 * @access Public
 */
async function registerUserController(req,res){
    const { username, email, password } = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username, email and password"
        })
    }
    const isUserAlreadyExists = await userModal.findOne({
        $or:[ {username}, {email}]
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }
    // We hash the password before creating a user to ensure that plain text passwords are not stored in the database. 
    // Hashing enhances security by protecting user credentials, even if the database is compromised. 
    // This makes it much more difficult for attackers to retrieve users' original passwords.

    const hash = await bcryptjs.hash(password,10)

    const user = await userModal.create({
        username,
        email,
        password: hash
    })
    const token = jwt.sign({ id: user._id, username: user.username },process.env.JWT_SECRET,{expiresIn: "1d"})
    
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
})
    res.status(201).json({
        message:"User registered Successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt

        }
    })
}

/**
 * 
 * @name loginUserController 
 * @description Login a user, expects username, email and password in the request body
 * @access Public 
 */
async function loginUserController(req,res){
    const { email, password } = req.body;

    const user = await userModal.findOne({ email })
    if(!user){
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password) //user.password is the saved password in database
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({ id: user._id, username: user.username },process.env.JWT_SECRET,{expiresIn: "1d"})
  
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
})
    res.status(200).json({
         message: "User logged-in successfully",
         user:{
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
         }
    }) 

}
/**
 * 
 * @name logout User controller
 * @description logsout a user using tokenblacklisting
 * @access Public
 */
async function logoutUserController(req,res){
    const token = req.cookies.token;
    if(token){
        // Using .create here adds the token to the blacklist collection, marking it as invalid.
        await tokenBlackListModal.create({ token });
    }
    res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
})
    res.status(200).json({
        message: "User Logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req,res){
    const user = await userModal.findById(req.user.id)
    res.status(200).json({
        message: "User details fetched successfully.",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        }
    })

}
module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }