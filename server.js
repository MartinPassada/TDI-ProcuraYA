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
// JS propios
const mongoDatabase = require('./mongodb.js');
const hash = require('./hash.js');
const mailer = require('./mailer.js');



//Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'whatever',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1800000 } //Expira despues de media hora
},
    loginattemps = 0,
))

// Recursos estaticos
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'build')));

//Entry point
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/CreateAccount', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
/*app.get('/Home', function (req, res) {
    console.log('url directa a home');
    if (req.session.user === undefined) {
        res.redirect(403, '/Unauthorized')
        console.log('devolvio a unautorized')
    } else if (req.session.user !== undefined) {
        console.log('devolvio a home')
        res.redurect('/Home')
    } else {
        res.sendStatus(500);
    }
    //res.sendFile(path.join(__dirname, 'build', 'index.html'));
});*/
app.get('/ResetPassword', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/Home', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//********************************************************* */

//CHECK AUTH
app.get('/getUserInfo', (req, res) => {
    if (req.session.user === undefined) {
        res.sendStatus(403);
    } else if (req.session.user !== undefined) {
        if (req.session.userType === 'attorney') {
            let data = {
                name: req.session.user,
                attorney: [req.session.userType],
                representative: [],
                img: req.session.userImg,
            }
            res.send(data);

        } else if (req.session.userType === 'representative') {
            let data = {
                name: req.session.user,
                attorney: [],
                representative: [req.session.userType],
                img: req.session.userImg,
            }
            res.send(data);
        }
    } else {
        res.sendStatus(500);
    }

});
//LOGIN 
app.post('/login', (req, res) => {
    let loginData = req.body;
    //console.log(loginData);
    loginData.password = hash.SHA1(loginData.password);
    if (req.session.loginattemps >= 3) {
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
                req.session.user = userData.userName + ' ' + userData.userLastName;
                req.session.email = userData.email;
                req.session.userType = userData.userType;
                req.session.userImg = userData.userImg;
                res.sendStatus(200);
            }
        })
    }

});
//LOGOUT
app.get('/logout', (req, res) => {

    req.session.destroy();
    res.sendStatus(200);

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
            req.session.user = signUpData.userName + ' ' + signUpData.userLastName;
            req.session.email = signUpData.email;
            req.session.userType = signUpData.userType;
            req.session.userImg = signUpData.userImg;
            res.sendStatus(200);
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
app.post('/uploadFile', function (req, res) {
    let file = req.body
    let email = req.session.email;
    mongoDatabase.saveFile(file, email, cbOK => {
        if (`${cbOK}` == 200) {
            res.sendStatus(200);
        } else if (`${cbOK}` == 403) {
            res.sendStatus(403);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        }
    })
});
// GET USER FILES
app.get('/getUserFiles', function (req, res) {
    let email = req.session.email;
    mongoDatabase.getUserFiles(email, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.send(cbOK);
        }
    })
})
app.post('/getFile', function (req, res) {
    let id = req.query.id;
    mongoDatabase.getFile(id, cbOK => {
        if (`${cbOK}` == 404) {
            res.sendStatus(404);
        } else if (`${cbOK}` == 500) {
            res.sendStatus(500);
        } else if (`${cbOK}` !== 500 && `${cbOK}` !== 404) {
            res.send(cbOK);
        }
    })
})


app.listen(process.env.PORT || 8001,
    () => console.log("Server is running..."));




