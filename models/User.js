'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: [10, 'The password needs to be at least 10 characters long.'] }
}, { timestamps: true, versionKey: false })

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid username or password.')
  }

  return user
}

const User = mongoose.model('user', userSchema)

module.exports = User
