module.exports.sendRandomCodeToEmail = sendRandomCodeToEmail;
const sendmail = require('sendmail')();
"use strict";
const nodemailer = require("nodemailer");
function sendRandomCodeToEmail(userEmail, code) {
    /*sendmail({
        from: 'procurayanoresponder@gmail.com',
        to: 'Martin_passada@outlook.com, TinchoTinchin@protonmail.com, mdbf2012@gmail.com, 95636494c1@emailmonkey.club',
        // por ahora este es el mejor, envia a proton y a mohmal from: 'procuraYaNoReply@gmail.com',
        //to: `${userEmail}`,
        subject: 'Reset Password Code',
        html: `${code}`,
    }, function (err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
    return true;*/
    //let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'procurayanoresponder@gmail.com',
            pass: 'jsudvssubnovsybw', //procura2020ya
        },
    });
    let info = transporter.sendMail({
        from: 'procurayanoresponder@gmail.com',
        to: `${userEmail}`,
        subject: "PROCURAYA RPC",
        text: `Reset password code: ${code}`,
        html: "", // html body
    })
    return true;
}




