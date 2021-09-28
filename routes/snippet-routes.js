'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/snippetController')
const auth = require('../middlewares/auth')

router.route('/create')
  .get(controller.create)
  .post(controller.createPost)

router.get('/author/:id', auth.user, controller.yourSnippets)

router.get('/:id', controller.viewSnippet)

router.get('/by/:name', controller.allByAuthor)

router.get('/', controller.list)

module.exports = router
