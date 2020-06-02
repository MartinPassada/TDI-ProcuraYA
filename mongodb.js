module.exports.validateLogin = validateLogin;
module.exports.addNewUser = addNewUser;
module.exports.blockUser = blockUser;
module.exports.getUserDataFromMail = blockUser;

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017';
const fs = require("fs");
const path = require('path');

// LOGIN
function validateLogin(loginData, cbOK) {
    mongoClient.connect(mongoURL, function (err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("ProcuraYaDatabase");
            var collection = db.collection("users");
            collection.find({ "email": `${loginData.email}` }).limit(1).toArray((err, data) => {
                if (data == '') {

                    cbOK(404);
                    //no existe el mail

                } else if (data[0].userIsBlocked) {
                    cbOK(603)
                    //usuario bloqueado

                } else if (data[0].password === loginData.password) {
                    let completeUserName = data[0].userName + ' ' + data[0].userLastName;
                    cbOK(`${completeUserName}`);
                    //credenciales validas

                } else if (data[0].password !== loginData.password) {
                    let completeUserName = data[0].userName + ' ' + data[0].userLastName;
                    cbOK(403);
                    //credenciales invalidas
                } else {
                    cbOK(500);
                    //Server or DB issues
                }

            });
        }

        //client.close();
    });
}

// SIGNUP
function addNewUser(signUpData, cbOK) {
    mongoClient.connect(mongoURL, function (err, client) {
        if (err) {
            console.log(err);
        } else {
            var db = client.db("ProcuraYaDatabase");
            var collection = db.collection("users");

            collection.find({ "email": `${signUpData.email}` }).limit(1).toArray((err, data) => {

                if (data == '' && signUpData.userType === 'representative') {

                    collection.insertOne({
                        email: `${signUpData.email}`,
                        password: `${signUpData.password}`,
                        userName: `${signUpData.userName}`,
                        userLastName: `${signUpData.userLastName}`,
                        attorneys: signUpData.attorneys,
                        files: signUpData.files,
                        inbox: signUpData.inbox,
                        userType: `${signUpData.userType}`,
                        emailConfirmed: signUpData.emailConfirmed,
                        userIsBlocked: signUpData.userIsBlocked,
                    });

                    let completeUserName = signUpData.userName + ' ' + signUpData.userLastName;
                    cbOK(completeUserName);

                } else if (data == '' && signUpData.userType === 'attorney') {
                    collection.insertOne({
                        email: `${signUpData.email}`,
                        password: `${signUpData.password}`,
                        userName: `${signUpData.userName}`,
                        userLastName: `${signUpData.userLastName}`,
                        files: signUpData.files,
                        inbox: signUpData.inbox,
                        userType: `${signUpData.userType}`,
                        emailConfirmed: signUpData.emailConfirmed,
                        userIsBlocked: signUpData.userIsBlocked,
                    });

                    let completeUserName = signUpData.userName + ' ' + signUpData.userLastName;
                    cbOK(completeUserName);

                } else if (data[0].email === signUpData.email) {

                    cbOK(403); //email already exists

                } else {
                    cbOK(500)  //server or BD problem
                }
            });
        }

        //client.close();
    });
}

// BLOCK CREDENTIALS
function blockUser(loginData, cbOK) {
    mongoClient.connect(mongoURL, function (err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("ProcuraYaDatabase");
            var collection = db.collection("users");
            collection.find({ "email": `${loginData.email}` }).limit(1).toArray((err, data) => {

                if (data == '') {

                    cbOK(404);
                    //no existe el mail

                } else if (data !== '') {
                    collection.updateOne({ 'email': `${loginData.email}` }, { $set: { userIsBlocked: true } });
                    cbOK(603);
                    //existe el mail y se bloquea violentamente

                } else {
                    cbOK(500);
                    //se rompio algo
                }

            });
        }

        //client.close();
    });
}

function getUserDataFromMail(RPautData, cbOK) {
    mongoClient.connect(mongoURL, function (err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("ProcuraYaDatabase");
            var collection = db.collection("users");
            collection.find({ "email": `${RPautData.email}` }).limit(1).toArray((err, data) => {

                if (data == '') {
                    cbOK(404);
                    //no existe el mail

                } else if (data !== '') {

                    if (RPautData.userName === data.userName && RPautData.userLastName === data.userLastName) {
                        cbOK(200);
                    } else {
                        cbOK(403);
                    }
                    //se devuelven los datos del usuario

                } else {
                    cbOK(500);
                    //El servidor explotó
                }

            });
        }

    });


}