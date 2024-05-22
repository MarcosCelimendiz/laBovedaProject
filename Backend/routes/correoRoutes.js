const express = require('express')
const app = express()

let envio = require('../controllers/correoController')

app.post('/envio',envio.envioCorreo)
app.post('/envioAutomatico',envio.envioCorreoAutomático)
app.post('/envioCorreoContacto',envio.envioCorreoContacto)
app.post('/envioContactoCliente',envio.envioContactoCliente)

module.exports = app