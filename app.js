const express = require('express')
const mongoose = require('./config/mongoose')
const hbs = require('express-hbs')
const path = require('path')
const session = require('express-session')

const PORT = 8000

const app = express()

// Connect to database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// setup and use session middleware (https://github.com/expressjs/session)
const sessionOptions = {
  name: 'supersnippetssession', // Don't use default session cookie name.
  secret: 'something about super snippets', // Change it!!! The secret is used to hash the session with HMAC.
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}

app.use(session(sessionOptions))

// Middleware before routes
app.use((req, res, next) => {
  // flash messages - survives only a round trip
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

// Provide additional context
app.use((req, res, next) => {
  if (req.session.context) {
    res.locals.context = req.session.context
    delete req.session.context
  }
  next()
})

app.use(async (req, res, next) => {
  if (req.session.loggedin) {
    const id = req.session.id
    const Session = require('./models/Session')

    const match = await Session.findOne({ id })

    if (match) {
      res.locals.loggedin = true
      res.locals.userid = req.session.user._id
    } else {
      delete req.session.loggedin
      delete req.session.user
    }
  }
  next()
})

// Set up routers
app.use('/', require('./routes/root-routes'))
app.use('/user', require('./routes/user-routes'))
app.use('/snippets', require('./routes/snippet-routes'))
app.use('/api', require('./routes/api-routes'))

app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal Server Error')
})

// Start listening
app.listen(PORT)
console.log(`Running on http://localhost:${PORT}`)
