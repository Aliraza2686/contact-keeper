const express = require('express')
const methodOverride = require('method-override')
const path = require('path')
const fs = require('fs')
require('./db/db')
require('dotenv').config()

const app = express()

const expressSession = require("express-session"),
cookieParser = require("cookie-parser"),
connectFlash = require("connect-flash");

//importing @routes
const userRouter = require('./routes/userRoutes')
const contactRouter = require('./routes/contactRoutes')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended : false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

//Setting Up flash messages and cookies
app.use(cookieParser("secret_passcode"));
app.use(expressSession({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));

app.use(connectFlash());

//Flash messages middleware
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});
  
//Using @routes
app.use(userRouter)
app.use(contactRouter)

//running express server
const port = process.env.PORT | 3000

app.listen(port, () => {

    console.log(`Server is running on port ${port}`)

})      