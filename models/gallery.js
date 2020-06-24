const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: String,
    image: String,
    price: String,
    description: String
})

module.exports = mongoose.model('Gallery', gallerySchema);