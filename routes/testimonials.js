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

// TESTIMONIALS EDIT PAGE

router.get('/edit', (req, res) => {
    Testimony.find({}, (err, allTestimonials)=>{
        if(err){
            console.log(err)
        } else {
            res.render('testimonials/edits', {testimonials: allTestimonials})
        }
    })
})

router.get('/edit/:id/edit', (req, res)=>{
    Testimony.findById(req.params.id, (err, foundTestimony) => {
        res.render('testimonials/edit', {testimony: foundTestimony})
    })
})

router.put('/edit/:id', (req, res) => {
    Testimony.findByIdAndUpdate(req.params.id, req.body.testimony, (err, testimony) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('success','Successfully Updated!');
            res.redirect('/testimonials/edit');
        }
    });
})

// DELETE TESTIMONY


router.get('/edit/:id/delete', (req, res) => {
    Testimony.findById(req.params.id, (err, foundTestimony) => {
        res.render('testimonials/delete', {testimony: foundTestimony})
    })
})

router.delete('/edit/:id', (req, res) => {
    Testimony.findById(req.params.id, (err, gallery) => {
        if(err){
            res.redirect('/testimonies/edit')
        } else {
            gallery.remove();
            req.flash('success', 'Testimony removed successfully')
            res.redirect('/testimonials/edit')
        }
    })
})


module.exports = router;