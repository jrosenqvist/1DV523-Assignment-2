'use strict'

const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.post('/deleteSnippet', auth.snippetJson, require('../controllers/snippetController').deleteJson)
router.post('/updateSnippet', auth.snippetJson, require('../controllers/snippetController').updateJson)

module.exports = router
