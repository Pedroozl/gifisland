const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({    
    userId: String,
    pedido: String,
    pedidoData: String,
    conteudo: String,
    obs: String,
    respondido: Boolean,
    respId: String,
    respData: String,
    negado: Boolean,
    arquivos: Array
});

const DiscordUser = module.exports = mongoose.model('pedido', UserSchema);