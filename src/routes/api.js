const router = require('express').Router();
const moment = require('moment');
const gifsM = require('../models/gifs')
const pedidosM = require('../models/pedidos')
const generator = require('generate-password');
const pedidos = require('../models/pedidos');
const discord = require('discord.js')
const client = new discord.Client()

router.post('/enviargif',async(req,res) => {
  try{
  req.files.gif.forEach(async gif => {
    await gif.mv('./src/public/gifs/'+req.user.discordId+'-'+gif.md5+'-'+gif.name)
    const gifsS = new gifsM({
      userId: req.user.discordId,
      titulo: req.body.titulo,
      categoria: req.body.categoria,
      data: moment().format(),
      arquivo: '/gifs/'+req.user.discordId+'-'+gif.md5+'-'+gif.name+''
    })
    await gifsS.save()
  })
}catch{
  let gif = req.files.gif
  await gif.mv('./src/public/gifs/'+req.user.discordId+'-'+gif.md5+'-'+gif.name)
  const gifsS = new gifsM({
    userId: req.user.discordId,
    titulo: req.body.titulo,
    categoria: req.body.categoria,
    data: moment().format(),
    arquivo: '/gifs/'+req.user.discordId+'-'+gif.md5+'-'+gif.name+''
  })
  await gifsS.save()
}
})

router.post('/post/enviargif',async(req,res) => {
  const pedidosF = await pedidosM.findOne({
    pedido: req.body.pedido
  })
  let arrFiles = []
  if(!pedidosF)return;
  if(req.body.negado === 'true'){
    await pedidosF.updateOne({
      respondido: true,
      respId: req.user.discordId,
      respData: moment().format(),
      negado: true
    })
  }else{
try{ 
    req.files.gif.forEach(async gif => {
    arrFiles.push('/gifs/'+req.user.discordId+'-'+gif.md5+'-'+gif.name+'')
    await gif.mv('./src/public/gifs/'+req.user.discordId+'-'+gif.md5+'-'+gif.name) 
    })
}catch{
  let gif = req.files.gif
  await gif.mv('./src/public/gifs/'+req.user.discordId+'-'+gif.md5+'-'+gif.name)
  arrFiles.push('/gifs/'+req.user.discordId+'-'+gif.md5+'-'+gif.name+'')
}finally{
  await pedidosF.updateOne({
    respondido: true,
    respId: req.user.discordId,
    respData: moment().format(),
    arquivos: arrFiles
  })
  let embed = new discord.MessageEmbed()
  .setTitle('Pedido#'+pedidosF.pedido)
  .setDescription(`Descrição do pedido: ${pedidosF.conteudo}

  Oberservação: ${pedidosF.obs}
  
  Foram entregues: ${arrFiles.length} gifs`)

  .setFooter("Obrigado por confiar na **GIF ISLAND**",client.users.cache.get(req.user.discordId).displayAvatarURL({dynamic:`gif`}))
  .setColor('GREEN')
  let channel = client.channels.cache.get('805916474530463785')
  channel.send(embed)
}
  }
})


router.post('/fazerpedido',async(req,res) => {
  var password = generator.generate({
    length: 10,
    lowercase: false,
    uppercase: false,
    numbers: true
  });
  const pedidosS = new pedidosM({
    userId: req.user.discordId,
    pedido: password,
    pedidoData: moment().format(),
    conteudo: req.body.tema,
    obs: req.body.obs,    
    respData : null,
    respondido: false,
    respId: null,
    negado: false,
    arquivos: null
  })
  await pedidosS.save()
})

//client.login('Njg0ODYzNjUxNTQ2NTI5ODE5.XmAS-g.hqewIIkPmuL63gPbjYZKA6e6d0M')

module.exports = router 