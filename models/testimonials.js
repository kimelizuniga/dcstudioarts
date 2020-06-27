const mongoose = require('mongoose');

const testimonySchema = new mongoose.Schema({
    quote: String,
    name: String
})

module.exports = mongoose.model('Testimony', testimonySchema);