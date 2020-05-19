const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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
}))

// Recursos estaticos
app.use(express.static(path.join(__dirname, 'build')));

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

/*
//Check session status
app.get('/checkAuth', (req, res) => {

    if (req.session.user == undefined) {
        res.send("Usuario Anonimo");


    } else if (req.session.user !== undefined) {
        res.send(req.session.user);

    } else {
        res.sendStatus(500);
    }

});

//LOGIN 

app.post('/login', (req, res) => {
    let loginData = req.body;
    loginData.password = hash.SHA1(loginData.password);
    mongoDatabase.validateLogin(loginData, cbOK => {
        if (`${cbOK}` == 403) {

            req.session.destroy();
            res.sendStatus(403);

        } else if (`${cbOK}` !== 403) {

            req.session.user = (`${cbOK}`);
            res.redirect('back');
        };
    })
});

//LOGOUT

app.get('/logout', (req, res) => {

    req.session.destroy();
    res.redirect("back");

});
*/
//SIGNUP

app.post('/signUp', (req, res) => {
    let signUpData = req.body;
    signUpData.password = hash.SHA1(signUpData.password);
    mongoDatabase.addNewUser(signUpData, cbOK => {
        if (`${cbOK}` == 403) {

            res.sendStatus(403);

        } else if (`${cbOK}` == 999) {

            res.sendStatus(999);

        } else if (`${cbOK}` !== 403 && `${cbOK}` !== 999) {

            req.session.user = (`${cbOK}`);
            res.redirect('/');

        }
    });
});
