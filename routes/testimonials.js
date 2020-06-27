const   express           = require("express"),
        app               = express(),
        middleware        = require("../middleware"),
        Testimony          = require('../models/testimonials'),
        router            = express.Router();

// ROUTE INDEX

router.get('/', (req,res) => {
    Testimony.find({}, (err, allTestimonials)=>{
        if(err){
            console.log(err)
        } else {
            res.render('testimonials/index', {testimonials: allTestimonials})
        }
    })
})

// CREATE NEW TESTIMONIAL

router.get('/new', middleware.isLoggedIn, (req,res) => {
    res.render('testimonials/new')
})

router.post('/', middleware.isLoggedIn, (req, res) => {
    const quote = req.body.quote,
          name      = req.body.name

    const newTestimony = {quote: quote, name: name}  
    
    Testimony.create(newTestimony, (err, newCreated) => {
        if(err){
            console.log(err)
        } else {
            req.flash('success','Successfully added a new testimony')
            res.redirect('/testimonials')
        }
    })
})

module.exports = router;