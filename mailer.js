module.exports.sendRandomCodeToEmail = sendRandomCodeToEmail;
module.exports.pushNotificationDeadlines = pushNotificationDeadlines;
module.exports.individualNotification = individualNotification;
const mongoDatabase = require('./mongodb.js');
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

function pushNotificationDeadlines(deadLinesReport) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'procurayanoresponder@gmail.com',
            pass: 'jsudvssubnovsybw', //procura2020ya
        },
    });
    if (deadLinesReport && deadLinesReport.expiredTasksReport) {
        deadLinesReport.expiredTasksReport.length > 0 ? (
            deadLinesReport.expiredTasksReport.forEach(t => {
                t.users.forEach(user => {
                    mongoDatabase.getUserEmail(user, cbOK => {
                        console.log(cbOK)
                        transporter.sendMail({
                            from: 'procurayanoresponder@gmail.com',
                            to: `${cbOK}`,
                            subject: "Tarea pronta a expirar",
                            text: `Se acerca el plazo limite para completar la tarea "${t.taskName}" en el expediente ${t.fileID}`,
                            html: "", // html body
                        })
                    })
                })
            })
        ) : (
                console.log('no expired tasks to notify')
            )
    } else {
        console.log('no expired tasks to notify')
    }
    if (deadLinesReport && deadLinesReport.notifications) {
        deadLinesReport.notifications.length > 0 ? (
            deadLinesReport.notifications.forEach(t => {
                t.users.forEach(user => {
                    mongoDatabase.getUserEmail(user, cbOK => {
                        console.log(cbOK)
                        transporter.sendMail({
                            from: 'procurayanoresponder@gmail.com',
                            to: `${cbOK}`,
                            subject: "Tarea pronta a expirar",
                            text: `Se acerca el plazo limite para completar la tarea "${t.taskName}" en el expediente ${t.fileID}`,
                            html: "", // html body
                        })
                    })

                })
            })
        ) : (
                console.log('no task close to expire')
            )
    } else {
        console.log('no task close to expire')
    }

}

function individualNotification(fileID, email, entity, location) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'procurayanoresponder@gmail.com',
            pass: 'jsudvssubnovsybw', //procura2020ya
        },
    });
    transporter.sendMail({
        from: 'procurayanoresponder@gmail.com',
        to: `${email}`,
        subject: "Ya puedes buscar tu expediente",
        text: `El expediente Nro ${fileID} enviado a ${location} de ${entity}, ya esta listo para ser retirado`,
        html: "", // html body
    })
}




