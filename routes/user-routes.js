'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController')
const auth = require('../middlewares/auth')

// Register user
router.get('/register', controller.register)
router.post('/register', controller.registerPost)

// Update user
router.post('/update/:id', auth.user, controller.updatePost)

// Delete user
router.post('/delete/:id', auth.user, controller.deletePost)

// User profile
router.get('/profile/:id', auth.user, controller.profile)

module.exports = router
