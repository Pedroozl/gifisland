const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    username: { type: String, required: true },
    guilds: { type: Array, required: true },
    avatar: { type: String, required: true },
    mod: Boolean,
    postador: Boolean,
    flags: { type: String, required: true }
});

const DiscordUser = module.exports = mongoose.model('User', UserSchema);