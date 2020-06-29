const express                   = require('express'),
      multer                    = require('multer'),
      app                       = express(),
      mongoose                  = require('mongoose'),
      path                      = require('path'),
      nodemailer                = require('nodemailer'),
      passport                  = require('passport'),
      LocalStrategy             = require('passport-local'),
      flash                     = require("connect-flash"),
      User                      = require('./models/user'),
      Gallery                   =require('./models/gallery'),
      methodOverride            = require('method-override'),
      bodyParser                = require('body-parser');
  



const url =  process.env.MONGOURL || 'mongodb://localhost/danene';  

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(() =>{
    console.log('Connected to Database!');
}).catch(err => {
    console.log('ERROR', err.message);
});

// SAVE SESSION

app.use(require('express-session')({
    secret: 'Danene Copping and Tarek',
    resave: false,
    saveUninitialized: false
}));

// APP CONFIG

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// REQUIRE ROUTES

const indexRoutes           = require('./routes/index'),
      galleryRoutes         = require('./routes/gallery'),
      testimonialsRoutes    = require('./routes/testimonials');

// ROUTES CONFIG

app.use('/', indexRoutes)
app.use('/gallery', galleryRoutes)
app.use('/testimonials', testimonialsRoutes)

// PORT LISTEN

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, () => {
    console.log('Server started ' + port);
});