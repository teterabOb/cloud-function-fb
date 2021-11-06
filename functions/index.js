const functions = require("firebase-functions");
const admin = require('firebase-admin');
const nodemailer = require('nodemailer')
const express = require('express')
const cors = require('cors')

/*
require('dotenv').config({
    path: '../.env',
});
*/
admin.initializeApp(functions.config().firebase)

const app = express();
app.use(cors({origin: true}));

app.post('/', (req, res) => {
    const {body} = req;
    const idValidMessage = body.message && body.to && body.subject;

    if(!idValidMessage){
        return res.status(400).send({message: 'invalid request'});
    }    

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: "gilbertsahumada@gmail.com",//process.env.EMAIL,
            pass: "jdxecbzxvgjmttks"//process.env.PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: body.to,
        subject: body.subject,
        text: body.message
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err){
            return res.status(500).send({ message: "error " + err.message})
        }

        return res.send({message: "email enviado satisfactoriamente"});
    });

});

module.exports.mailer = functions.https.onRequest(app);