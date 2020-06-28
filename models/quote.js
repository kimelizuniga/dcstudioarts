const mongoose = require('mongoose');


const quoteSchema = new mongoose.Schema({
    quote: String,
    image: String,
    name: String
})


module.exports = mongoose.model('Quote', quoteSchema);