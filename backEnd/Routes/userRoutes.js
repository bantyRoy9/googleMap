const express = require('express');
const authController = require('./../Controller/authController')

const userRouter = express.Router();

userRouter.post('/signup', authController.signup)

module.exports = userRouter