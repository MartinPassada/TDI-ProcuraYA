module.exports.validateLogin = validateLogin;
module.exports.addNewUser = addNewUser;
module.exports.blockUser = blockUser;
module.exports.rpAuth = rpAuth;
module.exports.unBlockUser = unBlockUser;
module.exports.resetPassword = resetPassword;
/******************************************************************** */
const fs = require("fs");
const path = require('path');
var usingOnlineCluster = true;
var mongodb = '';
var mongoURL = '';
var mongoClient = '';

if (usingOnlineCluster) {
    //Online Mongo BD Atlas
    mongodb = require("mongodb").MongoClient;
    mongoURL = "mongodb+srv://Tincho:7eR6JDjR8FrHqWPO@procurayadatabase-ghqe3.mongodb.net/ProcuraYaDatabase?retryWrites=true&w=majority";
    mongoClient = new mongodb(mongoURL, { useNewUrlParser: true }, { useUnifiedTopology: true });
} else {
    // New Local Mongo DB config
    mongodb = require("mongodb").MongoClient;
    mongoURL = 'mongodb://localhost:27017';
    mongoClient = new mongodb(mongoURL, { useNewUrlParser: true }, { useUnifiedTopology: true });
}
// Old Local Mongo BD config

/*const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017';*/
/************************************************************************** */

// LOGIN
function validateLogin(loginData, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
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
    mongoClient.connect(err => {
        if (err) {
            console.log(err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
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
    mongoClient.connect(err => {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
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
// UNBLOCK CREDENTIALS
function unBlockUser(email, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var collection = db.collection("users");
            collection.find({ "email": `${email}` }).limit(1).toArray((err, data) => {
                if (data == '') {
                    cbOK(404);
                    //no existe el mail
                } else if (data !== '') {
                    collection.updateOne({ 'email': `${email}` }, { $set: { userIsBlocked: false } });
                    cbOK(200);
                    //existe el mail y se desbloquea violentamente
                } else {
                    cbOK(500);
                    //se rompio algo
                }

            });
        }

        //client.close();
    });
}
//RESET PASSWORD
function resetPassword(email, np, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var collection = db.collection("users");
            collection.find({ "email": `${email}` }).limit(1).toArray((err, data) => {
                if (data == '') {
                    cbOK(404);
                    //no existe el mail
                } else if (data !== '') {
                    if (np !== data[0].password) {
                        collection.updateOne({ 'email': `${email}` }, { $set: { password: `${np}` } });
                        cbOK(200);
                        //existe el mail y se resetea la password
                    } else if (np === data[0].password) {
                        cbOK(403)
                        //el usuario intentó cambiar su contraseña por la misma que tenia
                    }
                } else {
                    cbOK(500);
                    //se rompio algo
                }

            });
        }

        //client.close();
    });
}
// RESET PASSWORD AUTH
function rpAuth(RPautData, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var collection = db.collection("users");
            collection.find({ "email": `${RPautData.email}` }).limit(1).toArray((err, data) => {

                if (data == '') {
                    cbOK(404);
                } else if (data !== '') {
                    if (RPautData.userName === data[0].userName && RPautData.userLastName === data[0].userLastName) {
                        cbOK(200);
                        //console.log('Existe el usuario y los datos ingresados coinciden');
                    } else {
                        cbOK(403);
                        //console.log('Existe el usuario pero los datos ingresados no coinciden');
                    }
                } else {
                    cbOK(500);
                    //El servidor explotó
                }

            });
        }

    });


}