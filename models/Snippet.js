'use strict'

const mongoose = require('mongoose')
const User = require('./User')

const snippetSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  private: { type: Boolean, default: true }
}, { versionKey: false })

// snippetSchema.pre('find', function () {
//   this.populate('author')
// })

snippetSchema.statics.byAuthorName = async function (name) {
  const user = await User.findOne({ username: name })
  const userId = user._id
  const snippets = await this.find({ author: userId, private: false })
  return snippets
}

const Snippet = mongoose.model('snippet', snippetSchema)

module.exports = Snippet
