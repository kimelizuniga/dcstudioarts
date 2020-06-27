const   express           = require("express"),
        app               = express(),
        router            = express.Router(),
        middleware = require("../middleware"),
        User              = require('../models/user'),
        Gallery                   =require('../models/gallery'),
        nodemailer                = require('nodemailer'),
        passport          = require("passport");


// HOMEPAGE

router.get('/', (req,res)=>{

    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });

    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            res.render('index', {galleries: allGalleries})
        }
    })
})

// REGISTER

router.get('/register', (req,res) => {
    User.find({}, (err, allUsers)=>{
        if(allUsers.length == 2){
            req.flash('error', 'Max users reached, cannot register new user')
            res.redirect('/')
        } else {
            res.render('register', {users: allUsers})
        }
    })
})

router.post('/register', (req,res) => {
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

router.get('/login', (req,res) => {

    if(!req.user){
        res.render('login')
    } else {
        req.flash('error', 'Already logged in')
        return res.redirect('/')
    }
    
})

router.post('/login', passport.authenticate('local',
{   
    failureRedirect: '/login',
    failureFlash: true
    }), (req, res) => {
        req.flash('success', 'Welcome Danene Copping');
        res.redirect('/')
        });

// LOGOUT ROUTE

router.get('/logout', (req, res) => {
    req.flash('success', 'Successfully logged out')
    req.logout();
    res.redirect('/');
})

// ROUTE FOR ABOUT

router.get('/about', (req,res) =>{
    res.render('about')
})

// ROUTE FOR CONTACT

router.get('/contact', (req,res) =>{
    res.render('contact')
})

// ROUTE FOR SENDING EMAIL

router.post('/send', (req, res) =>{

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

module.exports = router;