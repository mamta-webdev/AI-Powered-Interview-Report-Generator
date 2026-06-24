const express = require("express");
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */

router.post("/login",authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description Logout a user by blacklisting the token
 * @access Public
 */

router.get("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

router.get("/get-me",authMiddleware.authUser, authController.getMeController)

module.exports = router;