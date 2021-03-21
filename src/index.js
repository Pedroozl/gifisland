require('./strategies/discordstrategy');
const express = require('express');
const siofu = require("socketio-file-upload");
const app = express().use(siofu.router)
const db = require('./database/mongo')
const passport = require('passport')
const session = require('express-session');
const gifsM = require('./models/gifs')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session);
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const discord = require('discord.js')
const pedidosM = require('./models/pedidos')
const client = new discord.Client()
const bodyParser = require('body-parser')
var fileupload = require("express-fileupload");

db.then(() => {
  console.log('DB CONECTADO')
}).catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'some random secret',
  cookie: {
      maxAge: 60000 * 60 * 24
  },
  saveUninitialized: false,
  resave: false,
  name: 'discord.oauth2',
  store: new MongoStore({ mongooseConnection:  mongoose.connection })
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

const authRoute = require('./routes/auth')
const apiRoute = require('./routes/api')
const dashRoute = require('./routes/dashboard')

app.use('/home',dashRoute)
app.use('/auth',authRoute)
app.use('/api',apiRoute)
app.get('/',isAuthorized,async (req,res) => {
  const gifsF = await gifsM.find({}).limit(100).sort({'data': -1})
  res.render('home',{
    user: req.user,
    client: client,
    gifs: gifsF
  })
})

io.on('connection', (socket) => {
  //console.log('Socket connected '+socket.id);
  socket.on('getPedidoInfo',async data => {
    const pedidosF = await pedidosM.findOne({
      pedido: data
    })
    socket.emit('sendPedidoInfo',pedidosF)
  })

  socket.on('deletGif',async data => {
    const gifsF = await gifsM.findOne({
      arquivo: data.gif
    })
    gifsF.deleteOne()
    socket.emit('deleteGifFront',gifsF)
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

//client.login('ODEzNTI5OTE2ODU4OTU3ODQ0.YDQoxg.kzEbThiKnLOfWj9SkB9RfAedp7s')

server.listen(3000, () => {
  console.log('Servidor rodando na porta: 3000')
}); 
