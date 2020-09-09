const { route } = require("./testimonials");

const   express           = require("express"),
        app               = express(),
        router            = express.Router(),
        middleware = require("../middleware"),
        User              = require('../models/user'),
        Gallery           = require('../models/gallery'),
        Testimony         = require('../models/testimonials'),
        About             = require('../models/index'),
        Email             = require('../models/email'),
        Quote             = require('../models/quote'),
        Announcement      = require('../models/announcement'),
        nodemailer        = require('nodemailer'),
        passport          = require("passport");


// HOMEPAGE

router.get('/', (req,res)=>{

    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });

    Quote.find({}, (err, allQuotes)=>{
        if(err){
            console.log(err)
        } else {
            Announcement.find({}, (err, allAnnouncements) => {
                res.render('index', {quotes: allQuotes, announcement: allAnnouncements})
            })
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
        return res.redirect('/dashboard')
    }
    
})

router.post('/login', passport.authenticate('local',
{   
    failureRedirect: '/login',
    failureFlash: true
    }), (req, res) => {
        req.flash('success', 'Welcome Danene Copping');
        res.redirect('/dashboard')
        });

// LOGOUT ROUTE

router.get('/logout', middleware.isLoggedIn, (req, res) => {
    req.flash('success', 'Successfully logged out')
    req.logout();
    res.redirect('/');
})

// ROUTE FOR ABOUT

router.get('/about', (req,res) =>{
    About.find({}, (err, allAbout)=>{
        if(err){
            console.log(err)
        } else {
            res.render('about', {abouts: allAbout})
        }
    })
})

router.get('/about/new', (req,res) =>{
    res.render('about/new')
})

router.post('/about', middleware.isLoggedIn, (req, res) => {
    
    const about = req.body.about

    const newAbout = {about: about}

    About.create(newAbout, (err, newCreated) => {
        if(err){
            console.log(err)
        } else {
            req.flash('success','Successfully added about info')
            res.redirect('/about')
        }
    })
})

router.get('/about/:id/edit', middleware.isLoggedIn, (req, res)=>{
    About.findById(req.params.id, (err, foundAbout) => {
        res.render('about/edit', {about: foundAbout})
    })
})

router.put('/about/:id', middleware.isLoggedIn, (req, res) => {
    About.findByIdAndUpdate(req.params.id, req.body.about, (err, about) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('success','Successfully Updated!');
            res.redirect('/dashboard');
        }
    });
})


// ROUTE FOR CONTACT

router.get('/contact', (req,res) =>{
    Email.find({}, (err, allEmails)=>{
        if(err){
            console.log(err)
        } else {
            res.render('contact', {emails: allEmails})
        }
    })

    
})

router.get('/contact/new', (req,res) => {
    res.render('contact/new')
})

router.post('/contact', (req, res) => {
    const email    = req.body.email,
          password = req.body.password

    const newEmail = {email: email, password: password}

    Email.create(newEmail, (err, newCreated) => {
        if(err){
            console.log(err)
        } else {
            req.flash('success','Successfully added an email')
            res.redirect('/contact')
        }
    })
})

router.get('/contact/:id/edit', middleware.isLoggedIn, (req, res)=>{
    Email.findById(req.params.id, (err, foundEmail) => {
        res.render('contact/edit', {email: foundEmail})
    })
})

router.put('/contact/:id', middleware.isLoggedIn, (req, res) => {
    Email.findByIdAndUpdate(req.params.id, req.body.email, (err, email) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('success','Successfully Updated!');
            res.redirect('/contact');
        }
    });
})


// ROUTE FOR SENDING EMAIL

router.post('/send', (req, res) =>{

        Email.find({}, (err, allEmails)=>{
        if(err){
            console.log(err)
        } else {
            console.log({emails: allEmails})
            


        // NODE MAILER - SEND MESSAGE FROM CONTACT FORM TO SITE OWNER

        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
            user: allEmails[0].email,
            pass: allEmails[0].password
            }
        });

        const message = {
            to: allEmails[0].email,         // List of recipients
            subject: `WEBSITE - Message from: ${req.body.fullName}`, // Subject line
            html: `${req.body.message} <h3>Name:</h3><strong>${req.body.fullName}</strong> <h3>E-mail:</h3> ${req.body.email}` // Plain text body
        };

        transport.sendMail(message, function(err, info) {
            if (err) {
            console.log(err)
            } else {
            console.log(info);
            req.flash('success', 'Message sent successfully')
            res.redirect('/contact')
            }
        });      

        }
    })
})

// QUOTE with IMAGE ROUTE

// NEW QUOTE

router.get('/new', (req, res) => {
    res.render('landing/new')
})

router.post('/', middleware.isLoggedIn, (req, res) => {
    const image = req.body.image,
          quote = req.body.quote,
          name  = req.body.name

    const newQuote = {image: image, quote: quote, name: name}  
    
    Quote.create(newQuote, (err, newCreated) => {
        if(err){
            console.log(err)
        } else {
            req.flash('success','Successfully added a new quote')
            res.redirect('/')
        }
    })
})

// EDIT QUOTE

// EDIT QUOTE PAGE

router.get('/quotes', (req, res) => {
    Quote.find({}, (err, allQuotes)=>{
        if(err){
            console.log(err)
        } else {
            res.render('landing/quote', {quotes: allQuotes})
        }
    })
})

router.get('/quotes/:id/edit', middleware.isLoggedIn, (req, res)=>{
    Quote.findById(req.params.id, (err, foundQuote) => {
        res.render('landing/edit', {quote: foundQuote})
    })
})

router.put('/quotes/:id', middleware.isLoggedIn, (req, res) => {
    Quote.findByIdAndUpdate(req.params.id, req.body.quote, (err, quote) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('success','Quote successfully updated!');
            res.redirect('/quotes');
        }
    });
})

// DELETE TESTIMONY


router.get('/quotes/:id/delete', middleware.isLoggedIn, (req, res) => {
    Quote.findById(req.params.id,    (err, foundQuote) => {
        res.render('landing/delete', {quote: foundQuote})
    })
})

router.delete('/quotes/:id', middleware.isLoggedIn, (req, res) => {
    Quote.findById(req.params.id, (err, quote) => {
        if(err){
            res.redirect('/quotes')
        } else {
            quote.remove();
            req.flash('success', 'Quote removed successfully')
            res.redirect('/quotes')
        }
    })
})

// ROUTE FOR DASHBOARD

router.get('/dashboard', middleware.isLoggedIn, (req,res) => {

    Quote.find({}, (err, allQuotes)=>{
        if(err){
            console.log(err)
        } else {
            Gallery.find({}, (err, allGalleries)=>{
                if(err){
                    console.log(err)
                } else {
                    Testimony.find({}, (err, allTestimonials)=>{
                        if(err){
                            console.log(err)
                        } else {
                            About.find({}, (err, allAbouts) =>{
                                if(err){
                                    console.log(err)
                                } else {
                                Email.find({}, (err, allEmails)=>{
                                    if(err){
                                        console.log(err)
                                    } else {
                                       Announcement.find({}, (err, allAnnouncements)=> {
                                           if(err){
                                               console.log(err)
                                           } else {
                                            res.render('dashboard',{
                                                quotes: allQuotes,
                                                galleries: allGalleries,
                                                abouts: allAbouts,
                                                emails: allEmails,
                                                testimonials: allTestimonials,
                                                announcements: allAnnouncements
                                            })
                                           }
                                       })
                                    }
                                })    
                              }
                            }) 
                        }
                    })
                }
            })
        }
    })
})

// ANNOUNCEMENT 

router.get('/announcement', (req,res) => {
    res.render('announcement')
})

router.post('/announcement', (req,res) => {
    const message = req.body.message,
          image   = req.body.image

    const newAnnouncement = {message: message, image: image}   

    Announcement.create(newAnnouncement, (err, newCreated) => {
        if(err){
            console.log(err);
        } else {
            req.flash('success','Successfully added announcement')
            res.redirect('/dashboard')
        }
    })
})

router.get('/announcement/:id/edit', (req, res)=> {
    Announcement.findById(req.params.id, (err, foundAnnouncement)=> {
        res.render('announceEdit', {announcement: foundAnnouncement})
    })
})

router.put('/announcement/:id', (req, res)=> {
    Announcement.findByIdAndUpdate(req.params.id, req.body.announcement, (err, announcement) => {
        if(err){
            console.log(err)
        } else {
            req.flash('success','Announcement successfully updated!');
            res.redirect('/dashboard')
        }
    })
})

router.get('/announcement/:id/delete', (req, res) => {
    Announcement.findById(req.params.id, (err, foundAnnouncement)=> {
        res.render('announceDelete', {announcement: foundAnnouncement})
    })
})

router.delete('/announcement/:id', middleware.isLoggedIn, (req, res) => {
    Announcement.findById(req.params.id, (err, announcement) => {
        if(err){
            res.redirect('/dashboard')
        } else {
            announcement.remove();
            req.flash('success', 'Announcement removed successfully')
            res.redirect('/dashboard')
        }
    })
})


module.exports = router;