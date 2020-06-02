const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const sharp = require("sharp")
const svgCaptcha = require('svg-captcha');

// JS propios
const mongoDatabase = require('./mongodb.js');
const hash = require('./hash.js');


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

// GET REACT PAGES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/Home', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/CreateAccount', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/ResetPassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//CHECK AUTH
app.get('/checkAuth', (req, res) => {

    if (req.session.user == undefined) {
        res.status(403).send('no session');

    } else if (req.session.user !== undefined) {
        res.send(req.session.user);

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
                req.sendStatus(404);
            } else if (`${cbOK}` == 603) {
                res.sendStatus(603);
            }
        })
    } else {
        mongoDatabase.validateLogin(loginData, cbOK => {
            if (`${cbOK}` == 403) {
                req.session.loginattemps++;
                //console.log('loginattemps:' + req.session.loginattemps);
                res.sendStatus(403);
            } else if (`${cbOK}` == 404) {
                req.sendStatus(404);
            } else if (`${cbOK}` == 500) {
                res.sendStatus(500);
            } else if (`${cbOK}` == 603) {
                res.sendStatus(603);
            } else if (`${cbOK}` !== 403 && `${cbOK}` !== 404 && `${cbOK}` !== 603 && `${cbOK}` !== 500) {
                req.session.user = (`${cbOK}`);
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

            req.session.user = (`${cbOK}`);
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
        })
    //res.contentType('text');
})
//CHECK CAPTCHA
app.post('/captcha', function (req, res) {
    let captchaSolution = req.query.captchaSolution
    console.log('solucion correcta = ' + req.session.captcha);
    console.log('solucion enviada = ' + req.query.captchaSolution);
    if (captchaSolution === req.session.captcha) {
        res.status(200).send(true);
    } else {
        res.status(403).send(false);
    }

});
//RESET PASSWORD
app.post('/rpAuth', (req, res) => {
    let RPautData = req.body;
    mongoDatabase.getUserDataFromMail(RPautData, cbOK => {
        if (`${cbOK}` == 404) {

            res.sendStatus(404);

        } else if (`${cbOK}` == 500) {

            res.sendStatus(500);

        } else if (`${cbOK}` == 200) {

            res.sendStatus(200);

        }
    });
});
app.listen(8001);
console.log('listening on port 8001');
