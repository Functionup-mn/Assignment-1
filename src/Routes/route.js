const express = require('express')
const router = express.Router()
const middleware = require('../Middleware/auth')
const userController = require('../Controllers/userController')

//<<<<<<<<------------------- User Api -------------------->>>>>>>>>>>>>
router.post("/signUp",  userController.createUser)

//<<<<<<<<------------------- login User Api -------------------->>>>>>>>>>>>>
router.post("/login", userController.loginUser)

//<<<<<<<<------------------- get User Api -------------------->>>>>>>>>>>>>

router.get("/users", userController.getUser)

//<<<<<<<<------------------- update User Api -------------------->>>>>>>>>>>>>

router.put("/user/:userId", middleware.authentication, userController.updateUser )

//<<<<<<<<------------------- delete User Api -------------------->>>>>>>>>>>>>

router.delete("/user/:userId", middleware.authentication, userController.deleteUser)

module.exports = router
