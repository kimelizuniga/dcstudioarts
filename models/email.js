const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    email: String,
    password: String
})

module.exports = mongoose.model('Email', emailSchema);