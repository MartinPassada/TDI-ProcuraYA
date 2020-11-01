module.exports.validateLogin = validateLogin;
module.exports.addNewUser = addNewUser;
module.exports.blockUser = blockUser;
module.exports.rpAuth = rpAuth;
module.exports.unBlockUser = unBlockUser;
module.exports.resetPassword = resetPassword;
module.exports.emailConfirmation = emailConfirmation;
module.exports.saveFile = saveFile;
module.exports.getUserFiles = getUserFiles;
module.exports.getFile = getFile;
module.exports.getAttorneys = getAttorneys;
module.exports.attorneyData = attorneyData;
module.exports.attorneyFiles = attorneyFiles;
module.exports.getAssignedFiles = getAssignedFiles;
module.exports.searchMongoID = searchMongoID;
module.exports.updateUserImg = updateUserImg;
module.exports.getFilesToAssign = getFilesToAssign
module.exports.assignFiles = assignFiles
module.exports.attorneyDataMulti = attorneyDataMulti
module.exports.saveMessage = saveMessage
module.exports.getInboxMessagesIDList = getInboxMessagesIDList
module.exports.getInboxMessages = getInboxMessages
module.exports.updateMessageState = updateMessageState
module.exports.getTasksNames = getTasksNames
module.exports.addTaskToFile = addTaskToFile
module.exports.getRepresentatives = getRepresentatives
module.exports.completeTask = completeTask
module.exports.searchFriend = searchFriend
module.exports.searchFileInBD = searchFileInBD
module.exports.addFriend = addFriend
module.exports.checkDeadlines = checkDeadlines
module.exports.getUserEmail = getUserEmail
module.exports.getUserImg = getUserImg
module.exports.getLocations = getLocations
module.exports.getLocation = getLocation
module.exports.getMyFilesToAssign = getMyFilesToAssign
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
    mongoURL = "mongodb+srv://Tincho:76UdKBJtXvX4JkGU@procurayadatabase-ghqe3.mongodb.net/ProcuraYaDatabase?retryWrites=true&w=majority";
    mongoClient = new mongodb(mongoURL, { useNewUrlParser: true }, { useUnifiedTopology: true });
} else {
    // New Local Mongo DB config
    mongodb = require("mongodb").MongoClient;
    mongoURL = 'mongodb://localhost:27017';
    mongoClient = new mongodb(mongoURL, { useNewUrlParser: true }, { useUnifiedTopology: true },);
}

function searchMongoID(email, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            users.find({ "email": `${email}` }).project({ "_id": 1.0 }).toArray((err, data) => {
                if (data == '') {
                    cbOK(404);
                    //no files founded
                } else if (data !== '') {
                    cbOK(data[0]._id);
                } else {
                    cbOK(500);
                }
            });

        }
    });
}
// LOGIN
function validateLogin(loginData, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            console.log("No se pudo conectar a la DB. " + err);
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
                    //console.log('db login response');
                    //console.log(data[0])
                    cbOK(data[0]);
                    //credenciales validas
                } else if (data[0].password !== loginData.password) {
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
                        userImg: `${signUpData.userImg}`,
                        attorneys: signUpData.attorneys,
                        files: signUpData.files,
                        inbox: signUpData.inbox,
                        userType: `${signUpData.userType}`,
                        emailConfirmed: signUpData.emailConfirmed,
                        userIsBlocked: signUpData.userIsBlocked,
                    });
                    cbOK(200);
                } else if (data == '' && signUpData.userType === 'attorney') {
                    collection.insertOne({
                        email: `${signUpData.email}`,
                        password: `${signUpData.password}`,
                        userName: `${signUpData.userName}`,
                        userLastName: `${signUpData.userLastName}`,
                        userImg: `${signUpData.userImg}`,
                        representatives: signUpData.representatives,
                        files: signUpData.files,
                        inbox: signUpData.inbox,
                        userType: `${signUpData.userType}`,
                        emailConfirmed: signUpData.emailConfirmed,
                        userIsBlocked: signUpData.userIsBlocked,
                    });
                    cbOK(200);

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
// EMAIL CONFIRMATION
function emailConfirmation(email, cbOK) {
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
                    collection.updateOne({ 'email': `${email}` }, { $set: { emailConfirmed: true } });
                    cbOK(200);
                    //existe el mail y se confirma
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
//SAVE NEW FILE
function saveFile(file, email, mongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            console.log(err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            var users = db.collection("users");
            files.find({ "fileID": `${file.header.fileID}` }).limit(1).toArray((err, data) => {
                if (data == '') {
                    let lastItem = file.body.length - 1;
                    //console.log(lastItem)
                    files.insertOne({
                        fileID: `${file.header.fileID}`,
                        fileLocation: `${file.header.fileLocation}`,
                        locationRoom: `${file.header.locationRoom}`,
                        fileState: `${file.header.fileState}`,
                        fileTitle: `${file.header.fileTitle}`,
                        owner: `${mongoID}`,
                        isAssigned: false,
                        assignedTo: '',
                        creationDate: Date.now(),
                        lastEditionDate: Date.now(),
                        editionHistory: [Date.now(),],
                        tasks: [],
                        year: `${file.header.fileYear}`,
                        bodies: file.body[lastItem],
                    });
                    users.updateOne({ 'email': `${email}` }, { $push: { files: `${file.header.fileID}` } });

                    cbOK(200)

                } else if (data[0].fileID === file.header.fileID) {
                    cbOK(401)
                    //el expediente ya existe
                } else {
                    cbOK(500)

                    //server error
                }

            });
        }
        //client.close();
    });
}
//GET USER FILES
function getUserFiles(email, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            try {
                //var ObjectID = require('mongodb').ObjectID;
                var db = mongoClient.db("ProcuraYaDatabase");
                var users = db.collection("users");
                var files = db.collection("files");
                users.find({ "email": `${email}` }).project({ "_id": 0.0, "files": 1.0 }).toArray((err, data) => {
                    if (err) {
                        console.log(err)
                        cbOK(500)
                    } else if (data == '') {
                        //console.log('getUserFiles users find 404');
                        cbOK(data); //no se encontro nada
                    } else if (data !== '') {
                        //si se encontro algo
                        files.find({ "fileID": { $in: data[0].files } }).project({ "_id": 0.0, 'fileID': 1.0, 'assignedTo': 1.0, 'owner': 1.0, 'tasks': 1.0 }).toArray((err, data) => {
                            if (err) {
                                console.log(err)
                                cbOK(500)
                            } else if (data == '') {
                                //console.log('getUserFiles files find 404');
                                cbOK(data); //no se encontro nada
                            } else if (data !== '') {
                                //si se encontro algo
                                cbOK(data);
                            }
                        })
                    } else {
                        cbOK(500);
                    }

                });
            } catch (error) {
                throw error
            }

        }

        //client.close();
    });
}
//GET SINGLE FILE
function getFile(mongoID, fileID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            var users = db.collection("users");
            var ObjectID = require('mongodb').ObjectID;



            users.find({ "_id": ObjectID(`${mongoID}`), "files": `${fileID}` }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                } else if (data.length > 0) {

                    files.find({ "fileID": `${fileID}` }).project({ "_id": 0.0 }).toArray((err, data) => {
                        if (data == '') {
                            cbOK(404);
                            //no existe el expediente en files collection
                        } else if (data !== '') {
                            cbOK(data[0])

                        } else {
                            cbOK(500);
                        }

                    });
                } else if (data) {
                    console.log('no se encontro nada')
                    console.log(data);
                    cbOK(404);
                }
            })
        }

    })

    //client.close();
}
//GET ALL FILES
function checkDeadlines(cbOK) {

    mongoClient.connect(err => {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            var users = db.collection("users");
            var ObjectID = require('mongodb').ObjectID;
            var expiredTasksReport = [];
            var notifications = [];


            files.find().project({ "_id": 0, "tasks": 1, "assignedTo": 1, "owner": 1, "fileID": 1 }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                } else if (data.length > 0) {
                    //console.log(data);
                    data.forEach(obj => {
                        obj.tasks.forEach(t => {
                            if (Date.parse(t.expirationDate) < Date.now()) {
                                //tarea vencida
                                if (t.state == 'No realizada') {
                                    let objectIDArr = [];
                                    objectIDArr.push(obj.assignedTo);
                                    objectIDArr.push(obj.owner);
                                    let expiredTask = {
                                        fileID: obj.fileID,
                                        taskName: t.taskName,
                                        users: objectIDArr,
                                    }
                                    expiredTasksReport.push(expiredTask);
                                }

                            } else if ((Date.parse(t.expirationDate) - Date.now()) <= 86400000) {
                                //tarea vence pronto
                                if (t.state == 'No realizada') {
                                    let objectIDArr = [];
                                    objectIDArr.push(obj.assignedTo);
                                    objectIDArr.push(obj.owner);
                                    let closeToExpireTask = {
                                        fileID: obj.fileID,
                                        taskName: t.taskName,
                                        users: objectIDArr,
                                    }
                                    notifications.push(closeToExpireTask);
                                }

                            } else {
                                //todo bien
                            }

                        })
                    })
                    let deadLinesReport = {
                        expiredTasksReport: expiredTasksReport,
                        notifications: notifications
                    };
                    cbOK(deadLinesReport);
                    //console.log(data);
                } else {
                    cbOK(500);
                }

            })
        }

    })

    //client.close();

}
//GET ATTORNEYS (FRIENDLIST)
function getAttorneys(mongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            var ObjectID = require('mongodb').ObjectID;
            //console.log(mongoID)
            users.find({ "_id": ObjectID(`${mongoID}`) }).project({ "_id": 0.0, "attorneys": 1.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    cbOK(500);
                } else {
                    if (data == '') {
                        //console.log(data);
                        cbOK(404);
                        //no existe usuario
                    } else if (data !== '') {
                        //console.log(data[0].attorneys);
                        cbOK(data[0].attorneys)
                    } else {
                        cbOK(500);
                    }
                }


            });
        }
        //client.close();
    });
}
function getRepresentatives(mongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            var ObjectID = require('mongodb').ObjectID;
            users.find({ "_id": ObjectID(`${mongoID}`) }).project({ "_id": 0.0, "representatives": 1.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    cbOK(500);
                } else {
                    if (data == '') {
                        cbOK(404);
                        //no existe usuario
                    } else if (data !== '') {
                        cbOK(data[0].representatives)
                    } else {
                        cbOK(500);
                    }
                }


            });
        }
        //client.close();
    });
}
//GET DATA FROM MONGO ID (userName, userLastName, userImg)
function attorneyData(mongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var ObjectID = require('mongodb').ObjectID;
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");

            users.find({ "_id": ObjectID(`${mongoID}`) }).project({ "_id": 1.0, "userName": 1.0, "userLastName": 1.0, "userImg": 1.0, }).limit(1).toArray((err, data) => {
                if (data == '') {
                    cbOK(404);
                    //no existe usuario
                } else if (data !== '') {
                    cbOK(data[0]);
                } else {
                    cbOK(500);
                }

            });

        }


    });
    //client.close();
}
function attorneyDataMulti(mongoIDArr, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var ObjectID = require('mongodb').ObjectID;
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            let objectIDArr = []
            mongoIDArr.forEach(id => {
                objectIDArr.push(ObjectID(`${id}`))
            });
            //console.log(objectIDArr);
            users.find({ "_id": { $in: objectIDArr } }).project({ "_id": 1.0, "userImg": 1.0, }).toArray((err, data) => {
                if (data == '') {
                    cbOK(data);
                    //console.log('attorneyDataMulti users find 404');
                    //no existe usuario
                } else if (data !== '') {
                    cbOK(data);
                } else {
                    cbOK(500);
                }

            });

        }


    });
    //client.close();
}
//GET ID LIST OF FILES FROM (*mongoID attorney)
function attorneyFiles(mongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var ObjectID = require('mongodb').ObjectID;
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            users.find({ "_id": ObjectID(`${mongoID}`) }).project({ "_id": 0.0, "files": 1.0 }).toArray((err, ArrIDs) => {
                if (ArrIDs == '') {
                    cbOK(404);
                    //no files founded
                } else if (ArrIDs !== '') {
                    cbOK(ArrIDs[0].files);
                } else {
                    cbOK(500);
                }
            });

        }


    });
    //client.close();
}
//RETURNS ASSIGNED FILES TO (*attorneyMongoID) WITH OWNER (*userMongoID)
function getAssignedFiles(userMongoID, attorneyMongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            files.find({ $and: [{ owner: { $eq: `${userMongoID}` } }, { assignedTo: { $eq: `${attorneyMongoID}` } }] }).project({ "_id": 0.0 }).toArray((err, data) => {
                if (data == '') {
                    cbOK(404);
                    //no files founded
                } else if (data !== '') {
                    cbOK(data);
                } else {
                    cbOK(500);
                }
            });

        }


    });
    //client.close();
}
function updateUserImg(userMongoID, newUserImg, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var ObjectID = require('mongodb').ObjectID;
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");

            users.updateOne({ "_id": ObjectID(`${userMongoID}`) }, { $set: { "userImg": newUserImg } }, (err, result) => {
                if (err) {
                    cbOK(500)
                } else if (result) {
                    cbOK(200);
                }
            })
        }
    });
}
//RETURNS FILES AVAILABLES TO BE ASSIGNED
function getFilesToAssign(userMongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            files.find({ $and: [{ owner: { $eq: `${userMongoID}` } }, { isAssigned: { $eq: false } }] }).project({ "_id": 0.0, "fileID": 0.1 }).toArray((err, data) => {
                if (data == '') {
                    cbOK(404);
                    //no files founded
                } else if (data !== '') {
                    cbOK(data);
                } else {
                    cbOK(500);
                }
            });

        }


    });
    //client.close();
}
function assignFiles(data, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var ObjectID = require('mongodb').ObjectID;
            var files = db.collection("files");
            var users = db.collection("users");


            files.updateMany({ "fileID": { $in: data.assignedList } }, { $set: { "isAssigned": true, "assignedTo": `${data.attorneyID}`, "assignDate": Date.now() } }, function (err, result) {
                if (err) {
                    cbOK(500)
                } else if (result) {
                    users.updateOne({ "_id": ObjectID(`${data.attorneyID}`) }, { $push: { "files": { $each: data.assignedList } } }, function (err, result) {
                        if (err) {
                            cbOK(500)
                        } else if (result) {
                            files.updateMany({ "fileID": { $in: data.toAssignList } }, { $set: { "isAssigned": false, "assignedTo": '', "assignDate": '' } }, function (err, result) {
                                if (err) {
                                    cbOK(500)
                                } else if (result) {
                                    users.updateOne({ "_id": ObjectID(`${data.attorneyID}`) }, { $pull: { "files": { $in: data.toAssignList } } }, function (err, result) {
                                        if (err) {
                                            console.log('error en pull')
                                            cbOK(500)
                                        } else if (result) {
                                            cbOK(200)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        }

    }
        //client.close();
    )
}
function saveMessage(mongoID, userImg, userName, data, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var ObjectID = require('mongodb').ObjectID;
            var messages = db.collection("messages");
            var users = db.collection('users');
            let messageID = Math.floor(Math.random() * 9000000001);
            messages.insertOne({
                messageID: messageID,
                senderID: mongoID,
                senderImg: userImg,
                sender: userName,
                message: data.message,
                type: data.type,
                wasRead: false,
                date: Date.now(),
            }, function (err, result) {
                if (err) {
                    console.log(err)
                    cbOK(500)
                } else if (result) {
                    users.updateOne({ "_id": ObjectID(`${data.attorneyID}`) }, { $push: { inbox: messageID } }, function (err, result) {
                        if (err) {
                            console.log(err)
                            cbOK(500)
                        } else if (result) {
                            cbOK(200)
                        }
                    })

                }
            });
        }
    })
}
function getInboxMessagesIDList(userMongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var ObjectID = require('mongodb').ObjectID;
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            try {
                users.find({ "_id": ObjectID(`${userMongoID}`) }).project({ "_id": 0.0, "inbox": 0.1 }).toArray((err, data) => {
                    if (data == '') {
                        cbOK(404);
                        //no files founded
                    } else if (data !== '') {
                        //console.log('db data 200 getInboxMessagesIDList');
                        //console.log(data[0].inbox)
                        cbOK(data[0].inbox);
                    } else {
                        cbOK(500);
                    }
                });
            } catch (error) {
                console.log(error)
            }


        }


    });
    //client.close();
}
function getInboxMessages(MessageArrID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var ObjectID = require('mongodb').ObjectID;
            var db = mongoClient.db("ProcuraYaDatabase");
            var messages = db.collection("messages");
            messages.find({ "messageID": { $in: MessageArrID } }).project({ "_id": 0.0 }).toArray((err, data) => {
                if (data == '') {
                    cbOK(404);
                    //no files founded
                } else if (data !== '') {
                    //console.log(data)
                    cbOK(data);
                } else {
                    cbOK(500);
                }
            });

        }


    });
    //client.close();
}
function updateMessageState(fileID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var messages = db.collection("messages");
            messages.updateOne({ "messageID": fileID }, { $set: { "wasRead": true } }, function (err, result) {
                if (err) {
                    console.log(err)
                    cbOK(500)
                } else if (result) {
                    cbOK(200)
                }
            })

        }


    });
    //client.close();
}

function getTasksNames(cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var tasks = db.collection("tasks");
            tasks.find({}).project({ "_id": 0.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err);
                    cbOK(500)
                } else if (data.length > 0) {
                    cbOK(data[0])
                } else {
                    cbOK(404)
                }
            })

        }


    });
    //client.close();
}

function addTaskToFile(data, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            data.tasks.forEach(t => {
                t.state = 'No realizada';
                t.expired = false;
            })
            files.updateMany({ "fileID": { $in: data.files } }, { $push: { "tasks": { $each: data.tasks } } }, function (err, result) {
                if (err) {
                    console.log(err);
                    cbOK(500)
                } else if (result) {
                    cbOK(200)
                }
            })

        }


    });
    //client.close();
}
function completeTask(name, taskData, cbOK) {
    //console.log('en BD')
    //console.log(taskData);
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            files.find({ "fileID": taskData.fileID }).project({ "_id": 0.0, "tasks": 1.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err);
                    cbOK(500)
                } else if (data) {
                    //console.log(data[0]);
                    //console.log(data[0].tasks)
                    data[0].tasks.forEach(e => {
                        if (e.taskName === taskData.taskName && e.expirationDate === taskData.expirationDate) {
                            e.state = 'Realizada';
                            e.completedBy = name;
                            e.completedDate = Date.now();
                        }
                    })
                    let overWrite = data[0].tasks
                    files.updateOne({ "fileID": taskData.fileID }, { $set: { "tasks": [] } }, function (err, result) {
                        if (err) {
                            console.log(err)
                        } else if (result) {
                            files.updateOne({ "fileID": taskData.fileID }, { $set: { "tasks": overWrite } }, function (err, final) {
                                if (err) {
                                    console.log(err)
                                } else if (final) {
                                    cbOK(200)
                                }
                            })
                        }

                    })
                }
            })

        }

    })

    //client.close();
}
// limitar cantidad de friendRequest que se pueden enviar
function searchFriend(searchParameter, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            try {
                users.createIndex({ userName: 'text', userLastName: 'text' }, function (err, result) {
                    if (err) console.log(err);
                    if (result) {

                        users.find({ $text: { $search: `${searchParameter}` } },
                            { score: { $meta: 'textScore' } }).project({ "_id": 1, "userName": 1, "userLastName": 1, "userImg": 1, "score": { $meta: "textScore" } }).sort({ score: { $meta: 'textScore' } }).limit(15).toArray((err, data) => {
                                if (err) {
                                    console.log(err);
                                    cbOK(500)
                                } else if (data.length > 0) {
                                    console.log(data);
                                    cbOK(data)
                                } else {
                                    cbOK(404)
                                }
                            })
                    }
                })
            } catch (error) {
                console.log('bd error catched \n' + error)
            }


        }
    });
    //client.close();
}

function searchFileInBD(searchParameter, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            try {
                files.createIndex({ fileID: 'text', fileTitle: 'text', year: 'text', fileState: 'text', locationRoom: 'text', fileLocation: 'text' }, function (err, result) {
                    if (err) console.log(err);
                    if (result) {

                        files.find({ $text: { $search: `${searchParameter}` } },
                            { score: { $meta: 'textScore' } }).project({ "_id": 1, "fileID": 1, "fileTitle": 1, "year": 1, "score": { $meta: "textScore" } }).sort({ score: { $meta: 'textScore' } }).limit(15).toArray((err, data) => {
                                if (err) {
                                    console.log(err);
                                    cbOK(500)
                                } else if (data.length > 0) {
                                    cbOK(data)
                                } else {
                                    cbOK(404)
                                }
                            })
                    }
                })
            } catch (error) {
                console.log('bd error catched \n' + error)
            }

        }
    });
    //client.close();
}

function addFriend(data, userData, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            var ObjectID = require('mongodb').ObjectID;


            if (userData.type == 'attorney') {

                users.updateOne({ "_id": ObjectID(`${userData.mongoID}`) }, { $push: { representatives: data.friendID } }, (err, result) => {
                    if (err) {
                        console.log(err)
                        cbOK(500)
                    } else if (result) {
                        users.updateOne({ "_id": ObjectID(`${data.friendID}`) }, { $push: { attorneys: userData.mongoID } }, (err, result) => {
                            if (err) {
                                console.log(err)
                                cbOK(500)
                            } else if (result) {
                                console.log('bd un attorney acepto a un amigo')
                                cbOK(200)
                            }
                        })
                    }
                })

            } else if (userData.type == 'representative') {
                users.updateOne({ "_id": ObjectID(`${userData.mongoID}`) }, { $push: { attorneys: data.friendID } }, (err, result) => {
                    if (err) {
                        console.log(err)
                        cbOK(500)
                    } else if (result) {
                        users.updateOne({ "_id": ObjectID(`${data.friendID}`) }, { $push: { representatives: userData.mongoID } }, (err, result) => {
                            if (err) {
                                console.log(err)
                                cbOK(500)
                            } else if (result) {
                                console.log('bd un attorney acepto a un amigo')
                                cbOK(200)
                            }
                        })
                    }
                })
            }


        }
    });
    //client.close();
}

function getUserEmail(mongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var ObjectID = require('mongodb').ObjectID;
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            users.find({ "_id": ObjectID(`${mongoID}`) }).project({ "_id": 0.0, "email": 1.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    cbOK(500)
                } else if (data) {
                    cbOK(data[0].email)
                }

            })

        }
    })
}
function getUserImg(mongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var ObjectID = require('mongodb').ObjectID;
            var db = mongoClient.db("ProcuraYaDatabase");
            var users = db.collection("users");
            users.find({ "_id": ObjectID(`${mongoID}`) }).project({ "_id": 0.0, "userImg": 1.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    cbOK(500)
                } else if (data) {
                    cbOK(data[0].userImg)
                }

            })

        }
    })
}
function getLocations(cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var locations = db.collection("locations");
            locations.find({}).project({ "_id": 0.0, "name": 1.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    cbOK(500)
                } else if (data) {
                    cbOK(data)
                }

            })

        }
    })
}
function getLocation(locationName, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var locations = db.collection("locations");
            locations.find({ "name": locationName }).project({ "_id": 0.0, "name": 0.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    cbOK(500)
                } else if (data) {
                    cbOK(data[0])
                }

            })

        }
    })
}
function getMyFilesToAssign(mongoID, cbOK) {
    mongoClient.connect(err => {
        if (err) {
            cbError('No se pudo conectar a la DB ' + err);
        } else {
            var db = mongoClient.db("ProcuraYaDatabase");
            var files = db.collection("files");
            files.find({ "assignedTo": mongoID }).project({ "_id": 0.0, "fileID": 1.0 }).toArray((err, data) => {
                if (err) {
                    console.log(err)
                    cbOK(500)
                } else if (data) {
                    cbOK(data)
                }

            })

        }
    })
}








// 
