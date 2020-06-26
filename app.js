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
      Gallery                   =require('./models/gallery')
      methodOverride            = require('method-override'),
      bodyParser                = require('body-parser');
  



const url =  process.env.MONGOURL || 'mongodb://localhost/danene';  

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() =>{
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


// ROUTES

app.get('/', (req,res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            res.render('index', {galleries: allGalleries})
        }
    })
})



// REGISTER ROUTE

app.get('/register', (req,res) => {
    User.find({}, (err, allUsers)=>{
        if(allUsers.length == 2){
            req.flash('error', 'Max users reached, cannot register new user')
            res.redirect('/')
        } else {
            res.render('register', {users: allUsers})
        }
    })
})

app.post('/register', (req,res) => {
    req.body.username
    req.body.password
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            return res.redirect('/register');
        }
        req.flash('success', 'Successfully registered - Now logged in as ' + req.body.username)
        passport.authenticate('local')(req, res, () => {
            res.redirect('/');
        })
    })
})

// LOGIN ROUTE

app.get('/login', (req,res) => {

    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });

    if(!req.user){
        res.render('login')
    } else {
        req.flash('error', 'Already logged in')
        return res.redirect('/')
    }
    
})

app.post('/login', passport.authenticate('local',
{   
    failureRedirect: '/login',
    failureFlash: true
    }), (req, res) => {
        req.flash('success', 'Welcome Danene Copping');
        res.redirect('/')
        });

// LOGOUT ROUTE

app.get('/logout', (req, res) => {
    req.flash('success', 'Successfully logged out')
    req.logout();
    res.redirect('/');
})

// GALLERY ROUTE

// SORT BY DATE OLDEST

app.get('/gallery', (req, res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            res.render('gallery', {galleries: allGalleries})
        }
    })
})

// SORT BY DATE NEWEST

app.get('/gallery/newest', (req, res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            allGalleries.sort((a, b) => b.created_at - a.created_at);
            res.render('gallery', {galleries: allGalleries})
        }
    })
})

// SORT BY PRICE - HIGHEST

app.get('/gallery/highest', (req, res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            allGalleries.sort((a, b) => b.price - a.price);
            res.render('gallery', {galleries: allGalleries})
        }
    })
})

// SORT BY PRICE - LOWEST

app.get('/gallery/lowest', (req, res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            allGalleries.sort((a, b) => a.price - b.price);
            res.render('gallery', {galleries: allGalleries})
        }
    })
})

// ADD NEW GALLERY

app.get('/new', (req,res)=>{
    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });

    if(!req.user){
        req.flash('error', 'You are not authorized to do that')
        res.redirect('/gallery')
    } else {
        res.render('new')
    }
})

app.post('/', (req, res)=>{

    // CREATE NEW GALLERY

    const title       = req.body.title,
          image       = req.body.image,
          price       = req.body.price,
          description = req.body.description;

    const newGallery = {title: title, image:image, price: price, description: description};

    Gallery.create(newGallery, (err, newCreated)=>{
        if(err){
            console.log(err)
        } else {
            req.flash('Successfully added a new gallery')
            res.redirect('/gallery')
        }
    })
})

app.get('/gallery/:id', (req, res)=>{
    
    Gallery.findById(req.params.id).exec(function (err, foundGallery){
        if(err){
            console.log(err)
        } else {
            res.render('show', {gallery: foundGallery})
        }
    })
})

// ROUTE FOR ABOUT

app.get('/about', (req,res) =>{
    res.render('about')
})

// ROUTE FOR CONTACT

app.get('/contact', (req,res) =>{
    res.render('contact')
})

// ROUTE FOR SENDING EMAIL

app.post('/send', (req, res) =>{

    const fullname = req.body.fullName,
          email    = req.body.email,
          image    = req.body.imageUpload,
          messaged  = req.body.message



    // NODE MAILER - SEND MESSAGE FROM CONTACT FORM TO SITE OWNER

    let transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: "3dd8a09f10306f",
        pass: "fde9f8e42f1247"
        }
    });

    const message = {
        from: req.body.email, // Sender address
        to: 'keaz@hotmail.ca',         // List of recipients
        subject: `Message from: ${req.body.fullName}`, // Subject line
        text: req.body.message, // Plain text body
    };

    transport.sendMail(message, function(err, info) {
        if (err) {
        console.log(err)
        } else {
        console.log(info);
        res.redirect('/')
        }
    });

})

// PORT LISTEN

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, () => {
    console.log('Server started ' + port);
});