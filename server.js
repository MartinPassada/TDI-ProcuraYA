const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const sharp = require("sharp")
const svgCaptcha = require('svg-captcha');
const favicon = require('express-favicon');
//const uuid = require('uuid');
const mongoDatabase = require('./mongodb.js');
const hash = require('./hash.js');
const mailer = require('./mailer.js');
const fileUpload = require('express-fileupload')
const jwt = require("jsonwebtoken");



//Middlewares
app.use(fileUpload());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//app.use(cookieParser());
app.use(session({
    /*genid: function (req) {
        return uuid.v4();
    },*/
    //store: new MemoryStore(),
    secret: 'whatever',
    resave: false,
    saveUninitialized: false,
    /*cookie: {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 9999999999999 // 1800000 Expira despues de media hora
    }*/
},
    loginattemps = 0,
))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'build')));



//TOKENS
//******************************************************************************** */
var refreshTokens = [];
var triggerAlarmFiles = [];
function authenticateToken(req, res, next) {
    //console.log(req)
    //console.log('/authenticateToken')
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    //console.log(token);
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('session expired')
            return res.sendStatus(403)
        }
        req.user = user
        next();

    })
}
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7200s' })
}
function checkDeadlines() {
    setInterval(() => {
        mongoDatabase.checkDeadlines(cbOK => {
            let deadLinesReport = cbOK
            mailer.pushNotificationDeadlines(deadLinesReport);
            /*console.log('EXPIRED TASKS')
            console.log(expiredTasksReport);
            console.log('CLOSE TO EXPIRE TASKS')
            console.log(notificationReport);*/
        });
    }, 1800000);

}
function letMeKnowInXminutes(fileID, time, email, entity, location) {
    let minutes = (time * 1000) * 60
    setTimeout(() => {
        if (triggerAlarmFiles.includes(fileID)) {
            mailer.individualNotification(fileID, email, entity, location);
        }
    }, minutes);
}
function unblockTask(fileID, taskID) {
    mongoDatabase.unblockTask(fileID, taskID, cbOK => {
        if (`${cbOK}` == 500) {
            console.log('unblockTasks 500')
        } else if (`${cbOK}` == 200) {
            console.log('tarea desbloqueada')
        }
    })
}



checkDeadlines();


app.post('/token', (req, res) => {
    //console.log('/token')
    const refreshToken = req.body.token
    //console.log(refreshToken);
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({
            name: user.name,
            mongoID: user.mongoID,
            email: user.email,
            type: user.type,
            //img: user.img
        })
        res.json({ accessToken: accessToken })
    })
})
//******************************************************************************** */


//Entry point
//********************************************************* */
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/CreateAccount', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/ResetPassword', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/Home', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//********************************************************* */
//LOGIN 
app.post('/login', (req, res) => {
    let loginData = req.body;
    //console.log(loginData);
    loginData.password = hash.SHA1(loginData.password);
    if (req.session.loginattemps >= 2) {
        mongoDatabase.blockUser(loginData, cbOK => {

            if (`${cbOK}` == 500) {
                res.sendStatus(500);
            } else if (`${cbOK}` == 404) {
                res.sendStatus(404);
            } else if (`${cbOK}` == 603) {
                res.sendStatus(603);
            }
        })
    } else {
        mongoDatabase.validateLogin(loginData, cbOK => {
            if (`${cbOK}` == 403) {
                req.session.loginattemps++;
                res.sendStatus(403);
            } else if (`${cbOK}` == 404) {
                res.sendStatus(404);
            } else if (`${cbOK}` == 500) {
                res.sendStatus(500);
            } else if (`${cbOK}` == 603) {
                res.sendStatus(603);
            } else if (`${cbOK}` !== 403 && `${cbOK}` !== 404 && `${cbOK}` !== 603 && `${cbOK}` !== 500) {
                let userData = cbOK;
                /*req.session.regenerate(function (err) {
                    if (err) {
                        console.log(err)
                    }
                })*/
                //req.session.user = userData.userName + ' ' + userData.userLastName;
                //req.session.mongoID = userData._id;
                //req.session.email = userData.email;
                //req.session.userType = userData.userType;
                //req.session.userImg = userData.userImg;
                const user = {
                    name: userData.userName + ' ' + userData.userLastName,
                    mongoID: userData._id,
                    email: userData.email,
                    type: userData.userType,
                    //img: userData.userImg
                }
                const accessToken = generateAccessToken(user);
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                refreshTokens.push(refreshToken);
                //console.log(req.session);
                //console.log(req.session.id)
                console.log({ accessToken: accessToken, refreshToken: refreshToken })
                res.json({ accessToken: accessToken, refreshToken: refreshToken });
            }
        })
    }

});
//LOGOUT
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(200)
});
//USER
app.get('/getUserInfo', authenticateToken, (req, res) => {
    if (req.user.name === undefined) {
        res.sendStatus(403);
    } else if (req.user.name !== undefined) {
        let userIMG;
        mongoDatabase.getUserImg(req.user.mongoID, cbOK => {
            userIMG = cbOK
            if (req.user.type === 'attorney') {
                let data = {
                    name: req.user.name,
                    type: false,
                    img: userIMG,
                }
                res.send(data);

            } else if (req.user.type === 'representative') {
                let data = {
                    name: req.user.name,
                    type: true,
                    img: userIMG,
                }
                res.send(data);
            }
        })

    } else {
        res.sendStatus(500);
    }

});
//SIGNUP
app.post('/signUp', (req, res) => {
    let signUpData = req.body;
    signUpData.password = hash.SHA1(signUpData.password);
    mongoDatabase.addNewUser(signUpData, cbOK => {
        if (`${cbOK}` == 403) {
            res.sendStatus(403);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 403 && `${cbOK}` !== 500) {
            //req.session.user = signUpData.userName + ' ' + signUpData.userLastName;
            //req.session.email = signUpData.email;
            //req.session.userType = signUpData.userType;
            //req.session.userImg = signUpData.userImg;
            const user = {
                name: signUpData.userName + ' ' + signUpData.userLastName,
                email: signUpData.email,
                type: signUpData.userType,
                img: signUpData.userImg
            }
            mongoDatabase.searchMongoID(user.email, id => {
                if (`${cbOK}` == 404) {
                    res.sendStatus(404);
                } else if (`${cbOK}` == 500) {
                    res.sendStatus(500);
                } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
                    user.mongoID = id
                    //req.session.mongoID = id
                    const accessToken = generateAccessToken(user);
                    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                    refreshTokens.push(refreshToken);
                    res.json({ accessToken: accessToken, refreshToken: refreshToken });
                }
            })
        }
    });
});
// GENERATE RANDOM CAPTCHA
app.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.createMathExpr({
        mathMin: 1,
        mathOperator: '+-',
        mathMax: 284,
        noise: 4,
        color: true,
        width: 500,
        height: 250,
        fontSize: 300,
    })
    req.session.captcha = captcha.text;
    fs.writeFileSync('./src/assets/captcha.svg', captcha.data);
    let svgfile = fs.readFileSync('./src/assets/captcha.svg');
    sharp(svgfile)
        .png()
        .toFile("./src/assets/captcha" + '.png')
        .then(function (info) {
            //console.log(info);
            res.status(200).send("assets/captcha" + '.png');
        })
        .catch(function (err) {
            console.log(err)
            res.sendStatus(500);
        })
    //res.contentType('text');
})
//CHECK CAPTCHA
app.post('/captcha', function (req, res) {
    let captchaSolution = req.query.captchaSolution
    //console.log('solucion correcta = ' + req.session.captcha);
    //console.log('solucion enviada = ' + req.query.captchaSolution);
    if (captchaSolution === req.session.captcha) {
        res.status(200).send(true);
    } else {
        res.status(403).send(false);
    }
});
//CHECK RESET PASSWORD AUTH
app.post('/rpAuth', (req, res) => {
    let RPautData = req.body;
    mongoDatabase.rpAuth(RPautData, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` == 403) {
            res.sendStatus(403);
        } else if (`${cbOK}` == 200) {
            let rPcode = Math.floor(Math.random() * 1001);
            req.session.rPcode = `${rPcode}`;
            req.session.rPEmail = RPautData.email;
            if (mailer.sendRandomCodeToEmail(RPautData.email, rPcode)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        }
    });
});
//SEND RANDOM CODE TO EMAIL
app.get('/srcte', function (req, res) {
    let rPcode = Math.floor(Math.random() * 1001);
    req.session.rPcode = `${rPcode}`;
    if (mailer.sendRandomCodeToEmail(req.session.rPEmail, rPcode)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});
//CHECK RESET PASSWORD CODE
app.post('/crpc', function (req, res) {
    let rpc = req.query.rpc
    if (rpc === req.session.rPcode) {
        mongoDatabase.emailConfirmation(req.session.rPEmail, cbOK => {
            if (`${cbOK}` == 404) {
                res.sendStatus(404);
            } else if (`${cbOK}` == 500) {
                res.sendStatus(500);
            } else if (`${cbOK}` == 200) {
                res.status(200).send(true);
            }
        });
    } else {
        res.status(403).send(false);
    }
});
//UPDATE PASSWORD
app.post('/resetPassword/:rpc', function (req, res) {
    if (req.params.rpc !== req.session.rPcode) {
        req.session.destroy();
        res.sendStatus(403);
    }
    let data = req.body;
    data.password = hash.SHA1(data.password);
    mongoDatabase.resetPassword(req.session.rPEmail, data.password, cbOK => {
        if (`${cbOK}` == 403) {
            res.sendStatus(403);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` == 200) {
            mongoDatabase.unBlockUser(req.session.rPEmail, cbOK => {
                if (`${cbOK}` == 404) {
                    res.sendStatus(404);
                } else if (`${cbOK}` == 500) {
                    res.sendStatus(500);
                } else if (`${cbOK}` == 200) {
                    req.session.destroy();
                    res.sendStatus(200);
                }
            });

        }
    });

});
//UPLOAD FILE
app.post('/uploadFile', authenticateToken, function (req, res) {
    let file = req.body
    let email = req.user.email;
    mongoDatabase.saveFile(file, email, req.user.mongoID, cbOK => {
        if (`${cbOK}` == 200) {
            res.sendStatus(200);
        } else if (`${cbOK}` == 401) {
            res.sendStatus(401);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        }
    })
});
app.post('/updateUserImg', authenticateToken, (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.file;
    let randomNumber = Math.floor(Math.random() * 9999999999999);
    let date = Date.now();
    file.name = ((date.toString()) + (randomNumber.toString())) + '.png'
    file.mv(`src/assets/userImages/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        } else {
            let newUserImg = `assets/userImages/${file.name}`;
            mongoDatabase.updateUserImg(req.user.mongoID, newUserImg, cbOK => {
                if (`${cbOK}` == 200) {
                    //req.user.userImg = newUserImg;
                    res.sendStatus(200);
                } else if (`${cbOK}` == 500) {
                    res.sendStatus(500);
                }
            })
        }
    });
});
// GET USER FILES ID LIST
app.get('/getUserFiles', authenticateToken, function (req, res) {
    mongoDatabase.getUserFiles(req.user.email, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            if (cbOK.length === 0) {
                res.send(cbOK)
            } else {

                let array = cbOK;
                let AssignedFilesArray = [];
                let indexes = []
                let filteredArray = []
                let idsArr = [];

                if (req.user.type === 'representative') {
                    array.forEach(obj => {
                        if (obj.assignedTo !== '') {
                            let index = array.indexOf(obj);
                            if (index > -1) {
                                indexes.push(array.indexOf(obj))
                                AssignedFilesArray.push(obj);
                            }
                        }
                    });
                    AssignedFilesArray.forEach(e => {
                        idsArr.push(e.assignedTo);
                    })
                    filteredArray = idsArr.filter(function (item, pos) {
                        return idsArr.indexOf(item) == pos;
                    });
                } else if (req.user.type === 'attorney') {
                    array.forEach(obj => {
                        if (obj.owner !== '') {
                            let index = array.indexOf(obj);
                            if (index > -1) {
                                indexes.push(array.indexOf(obj))
                                AssignedFilesArray.push(obj);
                            }
                        }
                    });
                    AssignedFilesArray.forEach(e => {
                        idsArr.push(e.owner);
                    })
                    filteredArray = idsArr.filter(function (item, pos) {
                        return idsArr.indexOf(item) == pos;
                    });
                }

                console.log(filteredArray)
                mongoDatabase.attorneyDataMulti(filteredArray, cbOK => {
                    if (`${cbOK}` == 404) {
                        res.sendStatus(404);
                    } else if (`${cbOK}` == 500) {
                        res.sendStatus(500);
                    } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
                        if (cbOK.length === 0) {
                            res.send(array)
                        } else {
                            let userImages = cbOK;
                            if (req.user.type === 'representative') {
                                array.forEach(obj => {
                                    if (obj.assignedTo !== '') {
                                        userImages.forEach(elem => {
                                            if (`${elem._id}` == obj.assignedTo) {
                                                obj.assignedTo = elem.userImg
                                            }
                                        })
                                    }
                                })
                            } else if (req.user.type === 'attorney') {
                                array.forEach(obj => {
                                    if (obj.owner !== '') {
                                        userImages.forEach(elem => {
                                            if (`${elem._id}` == obj.owner) {
                                                obj.owner = elem.userImg
                                            }
                                        })
                                    }
                                })
                            }

                            //console.log(array);
                            res.send(array)
                        }

                    }
                })
            }
        }

    })
})
app.post('/getFile', authenticateToken, function (req, res) {
    let fileID = req.query.id;
    mongoDatabase.getFile(req.user.mongoID, fileID, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` == 402) {
            res.sendStatus(402)
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404 && `${cbOK}` !== 403) {
            res.send(cbOK);
        }
    })
})
app.get('/getAttorneys', authenticateToken, function (req, res) {
    //console.log(req.user.name);
    if (req.user.type === 'attorney') {
        console.log('es un attorney')
        mongoDatabase.getRepresentatives(req.user.mongoID, cbOK => {
            if (`${cbOK}` == 404) {
                res.sendStatus(404);
            } else if (`${cbOK}` == 500) {
                res.sendStatus(500);
            } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
                console.log('getRepresentatives:')
                console.log(cbOK)
                res.send(cbOK);
            }
        })
    } else if (req.user.type === 'representative') {
        console.log('es un representative')
        mongoDatabase.getAttorneys(req.user.mongoID, cbOK => {
            if (`${cbOK}` == 404) {
                res.sendStatus(404);
            } else if (`${cbOK}` == 500) {
                res.sendStatus(500);
            } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
                console.log('getAttornerys:')
                console.log(cbOK)
                res.send(cbOK);
            }
        })
    }

});
app.post('/attorneyData', function (req, res) {
    let mongoID = req.body.id
    mongoDatabase.attorneyData(mongoID, callbackOK => {
        if (`${callbackOK}` == 404) {
            res.sendStatus(404);
        } else if (`${callbackOK}` == 500) {
            res.sendStatus(500);
        } else if (`${callbackOK}` !== 500 && `${callbackOK}` !== 404) {
            res.send(callbackOK);
        }
    })
})
app.post('/getAssignedFiles', authenticateToken, function (req, res) {
    let attorneyMongoID = req.body.attorneyID;
    mongoDatabase.getAssignedFiles(req.user.mongoID, attorneyMongoID, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.send(cbOK);
        }
    })
})
app.get('/getFilesToAssign', authenticateToken, function (req, res) {
    mongoDatabase.getFilesToAssign(req.user.mongoID, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.send(cbOK);
        }
    })
})
app.post('/assignFiles', function (req, res) {
    let data = req.body;
    //console.log(data)
    mongoDatabase.assignFiles(data, cbOK => {
        if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` == 200) {
            res.sendStatus(200);
        }
    })

})
app.post('/saveMessage', authenticateToken, function (req, res) {
    let data = req.body;
    mongoDatabase.getUserImg(req.user.mongoID, userIMG => {
        mongoDatabase.saveMessage(req.user.mongoID, userIMG, req.user.name, data, cbOK => {
            if (`${cbOK}` == 500) {
                res.sendStatus(500);
            } else if (`${cbOK}` == 200) {
                res.sendStatus(200);
            }
        })
    })

})
app.get('/getInboxMessages', authenticateToken, function (req, res) {
    mongoDatabase.getInboxMessagesIDList(req.user.mongoID, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            let messageArrID = cbOK
            //console.log('server messageArrID')
            //console.log(messageArrID)
            mongoDatabase.getInboxMessages(messageArrID, cbOK => {
                if (`${cbOK}` == 404) {
                    res.sendStatus(404);
                } else if (`${cbOK}` == 500) {
                    res.sendStatus(500);
                } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
                    res.send(cbOK)
                }
            })
        }
    })
})
app.post('/updateMessageState', function (req, res) {
    let fileID = req.body.fileID
    mongoDatabase.updateMessageState(fileID, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.sendStatus(200);
        }
    })
})
app.get('/getTasksNames', function (req, res) {
    mongoDatabase.getTasksNames(cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.send(cbOK);
        }
    })
})
app.post('/addTaskToFile', function (req, res) {
    let data = req.body
    mongoDatabase.addTaskToFile(data, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.sendStatus(200);
        }
    })
})
app.post('/completeTask', authenticateToken, function (req, res) {
    let data = req.body
    mongoDatabase.completeTask(req.user.name, data, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.send(cbOK);
        }
    })
})
app.post('/searchFriend', authenticateToken, function (req, res) {
    let searchParameter = req.query.searchParameter
    //console.log('searchParameter in server ' + searchParameter)
    mongoDatabase.searchFriend(searchParameter, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            let searchResult = cbOK;
            let friendList = []
            //console.log(searchResult);
            if (req.user.type === 'attorney') {
                mongoDatabase.getRepresentatives(req.user.mongoID, cbOK => {
                    if (`${cbOK}` == 404) {
                        res.sendStatus(404);
                    } else if (`${cbOK}` == 500) {
                        res.sendStatus(500);
                    } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
                        friendList = cbOK
                        searchResult.forEach(e => {
                            e.alreadyInFriendList = false;
                            friendList.forEach(friend => {
                                if (e._id == friend) {
                                    e.alreadyInFriendList = true;
                                }
                            });
                        })
                        console.log('esta buscando ' + req.user.name + '\n')
                        let indexToDelete = false;
                        //console.log('antes de filtrar \n')
                        //console.log(searchResult)
                        searchResult.map((e, index) => {
                            if (e._id == req.user.mongoID) {
                                indexToDelete = index
                            }
                        })
                        if (indexToDelete !== false) {
                            searchResult.splice(indexToDelete, 1);
                            res.send(searchResult)
                        } else {
                            res.send(searchResult)
                        }

                    }
                })
            } else if (req.user.type === 'representative') {
                mongoDatabase.getAttorneys(req.user.mongoID, cbOK => {
                    if (`${cbOK}` == 404) {
                        res.sendStatus(404);
                    } else if (`${cbOK}` == 500) {
                        res.sendStatus(500);
                    } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
                        friendList = cbOK
                        searchResult.forEach(e => {
                            e.alreadyInFriendList = false;
                            friendList.forEach(friend => {
                                if (e._id == friend) {
                                    e.alreadyInFriendList = true;
                                }
                            });
                        })
                        console.log('esta buscando ' + req.user.name + '\n')
                        let indexToDelete = false;
                        searchResult.map((e, index) => {
                            if (e._id == req.user.mongoID) {
                                indexToDelete = index
                            }
                        })
                        //console.log('antes de filtrar \n')
                        //console.log(searchResult)
                        if (indexToDelete !== false) {
                            searchResult.splice(indexToDelete, 1);
                            res.send(searchResult)
                        } else {
                            res.send(searchResult)
                        }



                    }
                })
            }

        }
    })
})
app.post('/searchFileInBD', authenticateToken, async function (req, res) {
    let searchParameter = req.query.searchParameter;
    console.log('searchParameter in server ' + searchParameter)
    mongoDatabase.searchFileInBD(searchParameter, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.send(cbOK);
        }
    })
})
app.post('/addFriend', authenticateToken, function (req, res) {
    let data = req.body
    mongoDatabase.addFriend(data, req.user, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.sendStatus(200);
        }
    })
})
app.get('/getLocations', authenticateToken, function (req, res) {
    mongoDatabase.getLocations(cbOK => {
        if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500) {
            res.send(cbOK);
        }
    })
})
app.get('/getLocation', authenticateToken, function (req, res) {
    let locationName = req.query.name;
    mongoDatabase.getLocation(locationName, cbOK => {
        if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500) {
            res.send(cbOK);
        }
    })
})
app.get('/getMyFilesToAssign', authenticateToken, function (req, res) {
    let mongoID = req.user.mongoID;
    mongoDatabase.getMyFilesToAssign(mongoID, cbOK => {
        if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500) {
            //console.log(cbOK)
            res.send(cbOK);
        }
    })
})

app.get('/getAssignedFilesToLocation', authenticateToken, function (req, res) {
    //console.log('server' + req.query.locationName)
    let data = {}
    if (req.query.isRoom == 'false') {
        data = {
            entityName: req.query.entityName,
            locationName: req.query.locationName,
            isRoom: false
        }
    } else {
        data = {
            entityName: req.query.entityName,
            locationName: req.query.locationName,
            isRoom: true
        }
    }
    //console.log(data)
    mongoDatabase.getAssignedFilesToLocation(data, cbOK => {
        if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500) {
            /*let arr = cbOK
            let filteredArray = []
            arr.forEach(file => {
                if (file.assignedTo == req.user.mongoID) {
                    filteredArray.push(file)
                }
            })*/
            //console.log('files encontrados en sala o sec')
            //console.log(cbOK)
            res.send(cbOK);
        }

    })
})

app.post('/assignFilesToLocation', authenticateToken, function (req, res) {
    let data = req.body;
    console.log('data in server - assignFilesToLocation')
    console.log(data)

    mongoDatabase.assignFilesToLocation(data, cbOK => {
        if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` == 200) {

            data.assignedList.forEach(fileID => {
                if (!triggerAlarmFiles.includes(fileID)) {
                    if (parseInt(data.time.minutes) !== 0) {
                        triggerAlarmFiles.push(fileID);
                        letMeKnowInXminutes(fileID, parseInt(data.time.minutes), req.user.email, data.entityName, data.locationName);
                    }
                }
            })
            data.toAssignList.forEach(fileID => {
                if (triggerAlarmFiles.includes(fileID)) {
                    triggerAlarmFiles = triggerAlarmFiles.filter(fileObj => fileObj.file == fileID)
                }
            })
            //console.log('triggerAlarmFiles');
            //console.log(triggerAlarmFiles)
            mongoDatabase.getTaskToBeCompleted(data.assignedList, cbOK => {
                if (`${cbOK}` == 500) {
                    res.sendStatus(500);
                } else if (`${cbOK}` !== 500) {
                    let tasksToUnblock = cbOK
                    console.log('server 912 taskstoUnblock')
                    console.log(tasksToUnblock);
                    tasksToUnblock.forEach(t => {
                        unblockTask(t.fileID, t.tasksToUnblock);
                    })
                    res.sendStatus(200);
                }
            })

        }
    })

})
app.get('/getTasks', authenticateToken, function (req, res) {
    let fileID = req.query.fileID;
    console.log('server getTasks')
    //console.log(fileID)
    mongoDatabase.getTasks(fileID, cbOK => {
        if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500) {
            //console.log('get tasks server response')
            //console.log(cbOK)
            let filteredArray = [];
            cbOK.tasks.map((t, index) => {
                if (t.state == 'Realizada') {
                    cbOK.tasks.splice(index, 1)
                }
            })
            res.send(cbOK);
        }
    })

})



app.listen(process.env.PORT || 8001,
    () => console.log("Server is running..."));




