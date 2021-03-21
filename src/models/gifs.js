const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({    
    userId: String,
    titulo: String,
    categoria: Number,
    data: String,
    arquivo: String
});

const DiscordUser = module.exports = mongoose.model('gifs', UserSchema);