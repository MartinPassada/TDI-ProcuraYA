module.exports.validateLogin = validateLogin;
module.exports.addNewUser = addNewUser;

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27018';
const fs = require("fs");
const path = require('path');

// LOGIN
/*
function validateLogin(loginData, cbOK) {
    mongoClient.connect(mongoURL, function (err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
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
*/
function addNewUser(signUpData, cbOK) {
    mongoClient.connect(mongoURL, function (err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("users");
            collection.findOne({ "email": `${signUpData.email}` }).limit(1).toArray((err, data) => {

                if (data == '') {

                    collection.insertOne({
                        email: `${signUpData.email}`,
                        userName: `${signUpData.userName}`,
                        password: `${signUpData.password}`,
                        moviesLiked: signUpData.moviesLiked,
                        commentsLiked: signUpData.commentsLiked,
                        commentsUnliked: signUpData.commentsUnliked
                    });

                    cbOK(200);

                } else if (data[0].email === signUpData.email) {

                    cbOK(403, 'email already exists');

                }
            });
        }

        //client.close();
    });
}

