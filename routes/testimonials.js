const   express           = require("express"),
        app               = express(),
        middleware = require("../middleware"),
        router            = express.Router();

// ROUTE INDEX

router.get('/', (req,res) => {
    res.render('testimonials/index')
})

module.exports = router;