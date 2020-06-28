const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    about: String
})

module.exports = mongoose.model('About', aboutSchema);