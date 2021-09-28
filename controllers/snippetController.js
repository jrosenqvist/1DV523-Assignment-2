'use strict'

const Snippet = require('../models/Snippet')
const moment = require('moment')

const snippetController = {}

snippetController.list = async (req, res, next) => {
  try {
    const snippets = await Snippet.find({ private: false }).populate('author', 'username').sort({ _id: -1 })

    res.render('snippet/index', { snippets: snippets })
  } catch (error) {
    console.log(error)
    req.session.flash = { type: 'danger', text: 'Error loading snippets.' }
    res.redirect('../../')
  }
}

snippetController.allByAuthor = async (req, res, next) => {
  try {
    const snippets = await Snippet.byAuthorName(req.params.name)
    snippets.forEach(snippet => {
      snippet.byAuthor = true
    })
    res.render('snippet/index', { snippets: snippets, byAuthor: req.params.name })
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'Error loading snippets.' }
    res.redirect('../../')
  }
}

snippetController.yourSnippets = async (req, res, next) => {
  try {
    const snippets = await Snippet.find({ author: req.params.id }).sort({ _id: -1 })
    res.render('snippet/your', { snippets: snippets })
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'Error loading snippets.' }
    res.redirect('../../')
  }
}

snippetController.viewSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id).populate('author')
    var isAuthor = false
    if (req.session.user) {
      isAuthor = String(snippet.author._id) === req.session.user._id
    }
    res.render('snippet/snippet', { snippet: snippet, author: isAuthor })
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'Error loading snippet.' }
    res.redirect('../')
  }
}

snippetController.create = async (req, res, next) => {
  if (!req.session.loggedin) {
    req.session.flash = { type: 'danger', text: 'You need to be logged in before creating a snippet!' }
    req.session.context = { previous: 'create' }
    res.redirect('../../login')
  } else {
    res.render('snippet/create')
  }
}

snippetController.createPost = async (req, res, next) => {
  try {
    const newSnippet = new Snippet({
      author: req.session.user._id,
      title: req.body.title,
      content: req.body.content,
      private: req.body.private === 'on',
      createdAt: moment().format('MMM D YYYY HH:mm:ss')
    })

    await newSnippet.save()

    req.session.flash = { type: 'success', text: 'Snippet successfully created.' }
    res.redirect('./create')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./create')
  }
}

snippetController.updateJson = async (req, res, next) => {
  try {
    await Snippet.findByIdAndUpdate(req.body.id, {
      title: req.body.title,
      content: req.body.content,
      private: req.body.private
    })
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
  }
}

snippetController.deleteJson = async (req, res, next) => {
  try {
    await Snippet.remove({ _id: req.body.id })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
}

snippetController.deletePost = async (req, res, next) => {

}

module.exports = snippetController
