'use strict'

const User = require('../models/User')
const Snippet = require('../models/Snippet')

const userController = {}

userController.register = async (req, res, next) => {
  res.render('user/register')
}

userController.registerPost = async (req, res) => {
  try {
    if (await User.findOne({ username: req.body.username })) {
      throw new Error('Username already exists.')
    }

    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    })

    await newUser.save()

    req.session.flash = { type: 'success', text: 'You have successfully signed up. Now proceed to log in.' }
    req.session.context = { username: req.body.username }
    res.redirect('../login')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./register')
  }
}

userController.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.render('user/profile', { user: user })
  } catch {

  }
}

userController.updatePost = async (req, res, next) => {
  req.session.flash = { text: '' }

  try {
    const user = await User.findById(req.session.user._id)
    const currentUsername = user.username

    if (req.body.username !== currentUsername) {
      await User.findByIdAndUpdate(req.session.user._id, { username: req.body.username })

      req.session.flash.type = 'success'
      req.session.flash.text += 'Username successfully updated to ' + req.body.username + '. '
    }
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
  }

  try {
    if (req.body.password && req.body.confirmpassword) {
      const user = await User.findById(req.session.user._id)
      if (req.body.password !== req.body.confirmpassword) {
        throw new Error('Passwords do not match.')
      }
      user.password = req.body.password
      await user.save()
      req.session.flash.type = 'success'
      req.session.flash.text += 'Password successfully changed.'
    }
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
  }
  if (req.session.flash.text === '') {
    req.session.flash = { type: 'warning', text: 'Nothing to update.' }
  }
  res.redirect('./../profile/' + req.session.user._id)
}

userController.deletePost = async (req, res, next) => {
  try {
    await Snippet.deleteMany({ author: req.params.id })
    await User.findByIdAndDelete(req.params.id)
    req.session.flash = { type: 'success', text: 'Your account and snippets were successfully deleted.' }
    delete req.session.loggedin
    delete req.session.user
    res.locals.loggedin = false
    res.redirect('../../')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('../profile/' + req.session.user._id)
  }
}

module.exports = userController
