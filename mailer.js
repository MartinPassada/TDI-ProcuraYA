module.exports.sendRandomCodeToEmail = sendRandomCodeToEmail;
const sendmail = require('sendmail')();
"use strict";
const nodemailer = require("nodemailer");
function sendRandomCodeToEmail(userEmail, code) {
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




