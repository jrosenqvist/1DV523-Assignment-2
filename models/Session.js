'use strict'

const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  user: {
    type: String,
    get: function (data) {
      try {
        return JSON.parse(data)
      } catch (err) {
        return data
      }
    },
    set: function (data) {
      return JSON.stringify(data)
    },
    required: true
  },
  createdAt: { type: Date, default: Date.now, expires: '24h' }
})

const Session = mongoose.model('session', sessionSchema)

module.exports = Session
