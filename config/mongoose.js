'use strict'
const mongoose = require('mongoose')

// const CONNECTION_STRING = 'mongodb://db/jr222wb-1dv523-ass2'
const CONNECTION_STRING = 'mongodb+srv://assignment2:Sd9Kt1HztpTqGMOd@cluster0-r97aa.azure.mongodb.net/1dv523ass2'

exports.connect = async () => {
  // Bind connection to events (to get notifications).
  mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`Mongoose connection error has occurred: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  return mongoose.connect(CONNECTION_STRING, { useMongoClient: true })
}
