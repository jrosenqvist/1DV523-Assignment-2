'use strict'

const express = require('express')
const router = express.Router()

router.get('/', require('../controllers/homeController').index)

const loginController = require('../controllers/loginController')
router.route('/login/')
  .get(loginController.login)
  .post(loginController.loginPost)
router.get('/logout', loginController.logout)

module.exports = router
