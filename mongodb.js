module.exports.validateLogin = validateLogin;
module.exports.addNewUser = addNewUser;

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
            collection.find({ "$or": [{ "email": `${loginData.user}` }, { "userName": `${loginData.user}` }] }).limit(1).toArray((err, data) => {

                if (data == '') {

                    cbOK(403);

                } else if (data[0].email === loginData.user || data[0].userName === loginData.user && data[0].password === loginData.password) {


                    cbOK(`${data[0].userName}`);

                } else {

                    cbOK(403);
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
                        emailConfirmed: false
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
                        emailConfirmed: false
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

