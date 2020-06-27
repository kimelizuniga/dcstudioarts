const mongoose = require('mongoose');


const gallerySchema = new mongoose.Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    created_at: { type: Date, required: true, default: Date.now}
})


module.exports = mongoose.model('Gallery', gallerySchema);