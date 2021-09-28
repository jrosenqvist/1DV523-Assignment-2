'use strict'

const Snippet = require('../models/Snippet')
const Session = require('../models/Session')
const path = require('path')

const auth = {}

auth.user = async (req, res, next) => {
  try {
    if (!await validSession(req.session)) {
      throw new Error()
    }
    const pageID = req.params.id
    const user = req.session.user

    if (pageID !== user._id) {
      throw new Error()
    }
    next()
  } catch {
    send404(res)
  }
}

auth.snippetJson = async (req, res, next) => {
  try {
    if (!await validSession(req.session)) {
      throw new Error()
    }
    const userID = req.session.user._id
    const snippet = await Snippet.findById(req.body.id).populate('author')
    const authorID = String(snippet.author._id)
    if (authorID !== userID) {
      throw new Error('Not matching ids')
    }
    next()
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
}

async function validSession (session) {
  const match = await Session.findOne({ id: session.id })
  if (match) {
    if (match.user._id === session.user._id) {
      console.log('Valid session')
      return true
    }
  }
  return false
}

function send404 (res) {
  res.status(404)
  res.sendFile(path.join(__dirname, '../public', '404.html'))
}

module.exports = auth
