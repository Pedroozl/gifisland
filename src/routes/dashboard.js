const router = require('express').Router();
const gifsM = require('../models/gifs')
const pedidosM = require('../models/pedidos')
const moment = require('moment')

router.get('/enviargif', isAuthorized,  async (req, res) => {
    res.render('enviargif',{
        user: req.user
    })
})

router.get('/categoria/:id', isAuthorized,  async (req, res) => {
    const gifsF = await gifsM.find({
        categoria: req.params.id
    })
    res.render('categoria',{
        user: req.user,
        gifs: gifsF,
        categoria: req.params.id
    })
})

router.get('/pedidos', isAuthorized,  async (req, res) => {
    const pedidoF = await pedidosM.find({
        userId: req.user.discordId
    })
    res.render('pedido',{
        user: req.user,
        pedido: pedidoF,
        moment: moment
    })
})

router.get('/historico', isAuthorized,  async (req, res) => {
    const pedidoF = await pedidosM.find({
        userId: req.user.discordId
    })
    res.render('historico',{
        user: req.user,
        pedido: pedidoF,
        moment: moment
    })
})

router.get('/verperfil', isAuthorized,  async (req, res) => {
    res.render('discord',{
        user: req.user,
        gif: req.query.gif,
    })
})

router.get('/post/pedidos', isAuthorized,  async (req, res) => {
    const pedidoF = await pedidosM.find({
        
    })
    res.render('pedidopost',{
        user: req.user,
        pedido: pedidoF
    })
})

function isAuthorized(req, res, next) {
    if(req.user) {
        next();
    }
    else {
        res.redirect('/auth/redirect');
    }
}

module.exports = router;