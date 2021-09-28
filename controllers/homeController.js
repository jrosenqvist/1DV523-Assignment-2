'use strict'

const homeController = {}

homeController.index = (req, res, next) => {
  res.render('home/index')
}

module.exports = homeController
