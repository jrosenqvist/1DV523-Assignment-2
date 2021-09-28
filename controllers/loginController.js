'use strict'

const User = require('../models/User')
const Session = require('../models/Session')

const loginController = {}

loginController.login = (req, res, next) => {
  res.render('login/index')
}

loginController.loginPost = async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password)
    req.session.loggedin = true
    req.session.user = user
    const newSession = new Session({
      id: req.session.id,
      user: user
    })
    await newSession.save()

    req.session.flash = { type: 'success', text: 'You successfully logged in.' }
    res.redirect('./')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./login')
  }
}

loginController.logout = (req, res, next) => {
  delete req.session.loggedin
  delete req.session.user
  res.locals.loggedin = false
  req.session.flash = { type: 'success', text: 'You are now logged out.' }
  res.redirect('./')
}

module.exports = loginController
