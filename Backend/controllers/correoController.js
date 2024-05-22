const { request, response } = require('express')
const nodeMailer = require('nodemailer')


const envioCorreo = (req=request,resp=response) =>{
    let body = req.body

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:'marcodcelimendizarcega@gmail.com',
            pass:'pxkm jbxq ldjo lnsi'
        }
    })

    const opciones = {
        from: '"LaBóveda" <reservas@labóveda.com>',
        subject: 'Reserva Restaurante La Bóveda',
        to: body.email,
        html: `
            <p>Estimado/a ${body.nombre} ${body.apellido},</p>
            <p>Gracias por su reserva en Restaurante La Bóveda.</p>
            <p>Esperamos su visita y que disfrute de nuestros servicios.</p>
            <p>Su reserva está programada para el día ${body.fecha} a las ${body.hora} para ${body.comensales} personas</p>
            <p>Saludos cordiales,</p>
            <p>La Bóveda</p>
        `
    };


    config.sendMail(opciones,function(error,result){
        if (error) return resp.json({ok:false,msg:error})
        return resp.json({
            ok:true,
            msg:result
        })
    })
}

const envioCorreoAutomático = (req=request,resp=response) =>{
    let body = req.body

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:'marcodcelimendizarcega@gmail.com',
            pass:'pxkm jbxq ldjo lnsi'
        }
    })

    const opciones = {
        from: '"LaBóveda" <reservas@labóveda.com>',
        subject: 'Reserva Restaurante La Bóveda',
        to:body.email,
        html: `
            <p>Estimado/a ${body.nombre} ${body.apellido},</p>
            <p>Solo queda un día para su reserva en nuestro restaurante</p>
            <p>Recuerde que su reserva es a las ${body.hora} para ${body.comensales} personas</p>
            <p>Si hay algún inconveniente, no dude en ponerse en contactacto con nosotros</p>
            <p>Saludos cordiales,</p>
            <p>La Bóveda</p>
        `
    };


    config.sendMail(opciones,function(error,result){
        if (error) return resp.json({ok:false,msg:error})
        return resp.json({
            ok:true,
            msg:result
        })
    })
}

const envioCorreoContacto = (req=request,resp=response) =>{
    let body = req.body

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:'marcodcelimendizarcega@gmail.com',
            pass:'pxkm jbxq ldjo lnsi'
        }
    })

    const opciones = {
        from: '"LaBóveda" <reservas@labóveda.com>',
        subject: 'Contacto Restaurante La Bóveda',
        to: "mcelimen03@gmail.com",
        html: `
            <p>Pregunta de ${body.nombre} ${body.apellido} con teléfono ${body.tel}.</p>
            <p>${body.contenido}</p>
            <p>La Bóveda</p>
        `
    };


    config.sendMail(opciones,function(error,result){
        if (error) return resp.json({ok:false,msg:error})
        return resp.json({
            ok:true,
            msg:result
        })
    })
}

const envioContactoCliente = (req=request,resp=response) =>{
    let body = req.body

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:'marcodcelimendizarcega@gmail.com',
            pass:'pxkm jbxq ldjo lnsi'
        }
    })

    const opciones = {
        from: '"LaBóveda" <reservas@labóveda.com>',
        subject: 'Contacto Restaurante La Bóveda',
        to: body.gmail,
        html: `
            <p>Gracias por ponerse en contacto con nosotros, enseguida nos pondremos en contacto con usted.</p>
            <p>Gracias y un saludo</p>
            <p>La Bóveda</p>
        `
    };


    config.sendMail(opciones,function(error,result){
        if (error) return resp.json({ok:false,msg:error})
        return resp.json({
            ok:true,
            msg:result
        })
    })
}

module.exports = {
    envioCorreo,
    envioCorreoAutomático,
    envioCorreoContacto,
    envioContactoCliente
}