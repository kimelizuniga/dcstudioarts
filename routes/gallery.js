const   express           = require("express"),
        app               = express(),
        router            = express.Router(),
        middleware        = require("../middleware"),
        Gallery           = require('../models/gallery');
      


// SORT BY DATE OLDEST

router.get('/', (req, res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            res.render('gallery/gallery', {galleries: allGalleries})
        }
    })
})

// SORT BY DATE NEWEST

router.get('/newest', (req, res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            allGalleries.sort((a, b) => b.created_at - a.created_at);
            res.render('gallery/gallery', {galleries: allGalleries})
        }
    })
})

// SORT BY PRICE - HIGHEST

router.get('/highest', (req, res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            allGalleries.sort((a, b) => b.price - a.price);
            res.render('gallery/gallery', {galleries: allGalleries})
        }
    })
})

// SORT BY PRICE - LOWEST

router.get('/lowest', (req, res)=>{
    Gallery.find({}, (err, allGalleries)=>{
        if(err){
            console.log(err)
        } else {
            allGalleries.sort((a, b) => a.price - b.price);
            res.render('gallery/gallery', {galleries: allGalleries})
        }
    })
})

// ADD NEW GALLERY

router.get('/new', middleware.isLoggedIn, (req,res)=>{

    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });

    res.render('gallery/new')

})


// CREATE NEW GALLERY

router.post('/', middleware.isLoggedIn, (req, res)=>{

    const title       = req.body.title,
          image       = req.body.image,
          price       = req.body.price,
          description = req.body.description;

    const newGallery = {title: title, image:image, price: price, description: description};

    Gallery.create(newGallery, (err, newCreated)=>{
        if(err){
            console.log(err)
        } else {
            req.flash('success','Successfully added a new gallery')
            res.redirect('/gallery')
        }
    })
})

// SHOW GALLERY

router.get('/:id', (req, res)=>{
    
    Gallery.findById(req.params.id).exec(function (err, foundGallery){
        if(err){
            console.log(err)
        } else {
            res.render('gallery/show', {gallery: foundGallery})
        }
    })
})

// GALLERY EDIT 

router.get('/:id/edit', middleware.isLoggedIn,  (req,res) => {
    Gallery.findById(req.params.id, (err, foundGallery) => {
        res.render('gallery/edit', {gallery: foundGallery})
    })
})

// GALLERY UPDATE

router.put('/:id', middleware.isLoggedIn, (req, res) => {
    Gallery.findByIdAndUpdate(req.params.id, req.body.gallery, (err, gallery) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('success','Successfully Updated!');
            res.redirect('/gallery');
        }
    });
})

// DESTROY GALLERY

router.get('/:id/delete', (req, res) => {
    Gallery.findById(req.params.id, (err, foundGallery) => {
        res.render('gallery/delete', {gallery: foundGallery})
    })
})

router.delete('/:id', middleware.isLoggedIn,  (req, res) => {
    Gallery.findById(req.params.id, (err, gallery) => {
        if(err){
            res.redirect('/gallery')
        } else {
            gallery.remove();
            req.flash('success', 'Gallery removed successfully')
            res.redirect('/gallery')
        }
    })
})

module.exports = router;