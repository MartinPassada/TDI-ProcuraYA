const express = require('express');
console.log('paso');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(9000);
console.log('listening in port 9000');

/*const express = require('express');
const app = express();
const exphbs = require('express-handlebars')
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

// Configuracion Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'moviePageLayout',
    layoutsDir: path.join(__dirname, '/layouts')
}));
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '/views'));


// GET //
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/getUserName', (req, res) => {

    if (req.session.user == undefined) {
        res.send("Usuario Anonimo");


    } else if (req.session.user !== undefined) {
        res.send(req.session.user);

    } else {
        res.sendStatus(500);
    }

});

app.get('/logout', (req, res) => {

    req.session.destroy();
    res.redirect("back");

});


app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/welcome.html'));
});

app.get('/latestmovies', (req, res) => {
    mongoDatabase.getLatestMovies(moviesCollection => {
        res.json(moviesCollection);
    });
});

app.get('/genres', (req, res) => {
    mongoDatabase.getGenres(genres => {
        res.json(genres);
    });
});

app.get('/searchbygenre', (req, res) => {
    let searchparameter = req.query.genre
    mongoDatabase.searchByGenres(filteredsearch => {
        res.json(filteredsearch);
    }, searchparameter);
});

app.get('/mostviewed', (req, res) => {
    mongoDatabase.getMostWievedMovies(mostViewedMovies => {
        res.json(mostViewedMovies);
    });
});

app.get('/movies/:id', (req, res) => {
    let searchparameter = req.params.id;
    mongoDatabase.getMovieInfo(movieInfo => {
        res.render('moviePage', { movieInfo: movieInfo });
    }, searchparameter);

});

app.get('/Forum/:forumID', (req, res) => {
    let searchparameter = req.params.forumID;
    let userName = req.session.user;
    mongoDatabase.Forum(searchparameter, userName, forumData => {
        res.render('forum', { layout: 'forumLayout', forumData: forumData });
    });
});

app.get('/checkBeforeEnter', (req, res) => {
    let searchparameter = req.query.groupTitle;
    let userName = req.session.user;

    if (userName !== undefined) {
        mongoDatabase.checkBeforeEnter(searchparameter, userName, cbOK => {

            if (cbOK == 'noMember') {

                res.send('noMember');

            } else if (cbOK !== 'noMember') {

                res.json(cbOK);

            } else {

                res.sendStatus(500);
            }

        });

    } else {

        res.sendStatus(403);
    }

});

app.get('/checkAfterEnter', (req, res) => {
    let searchparameter = req.query.forumID;
    let userName = req.session.user;
    if (userName != undefined) {
        mongoDatabase.checkAfterEnter(searchparameter, userName, cbOK => {
            if (cbOK == 'noMember') {
                res.status(200).send('noMember');
            } else if (cbOK !== 'noMember') {
                res.status(200).send('ok');
            } else {
                res.sendStatus(500);
            }
        });
    } else {
        res.sendStatus(403);
    }
});



app.get('/community', (req, res) => {
    let userName = req.session.user;
    mongoDatabase.getCommunityInfo(userName, communityInfo => {
        res.render('community', { layout: 'communityLayout', communityInfo: communityInfo });
    });

});


app.get('/ranked', (req, res) => {
    mongoDatabase.getRankedMovies(rankedMovies => {
        res.json(rankedMovies);
    });
});

app.get('/getComments', (req, res) => {
    let searchparameter = req.query.currentID;
    let isForum = req.query.isForum;
    mongoDatabase.getComments(response => {
        res.json(response);
    }, searchparameter, isForum);
});

app.get('/getLastComment', (req, res) => {
    let searchparameter = req.query.currentID;
    let isForum = req.query.isForum;
    mongoDatabase.getLastComment(response => {
        res.json(response);
    }, searchparameter, isForum);
});

app.get('/getLikesForUser', (req, res) => {

    if (req.session.user !== undefined) {
        let userName = req.session.user;
        let movieID = req.query.movieID;
        mongoDatabase.getLikesForUser(userName, movieID, cbOK => {
            res.json(cbOK);
        });

    } else {

        res.sendStatus(403);

    }

});

app.get('/getUpLikesForComments', (req, res) => {

    if (req.session.user !== undefined) {
        let userName = req.session.user;

        mongoDatabase.getUpLikesForComments(userName, cbOK => {
            res.json(cbOK);
        });
    } else {
        res.status(200).send('Usuario Anonimo');
    }

});
app.get('/getDownLikesForComments', (req, res) => {

    if (req.session.user !== undefined) {
        let userName = req.session.user;

        mongoDatabase.getDownLikesForComments(userName, cbOK => {
            res.json(cbOK);
        });

    } else {
        res.status(200).send('Usuario Anonimo');
    }

});

// POST API's //

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

//SIGNUP

app.post('/signUp', (req, res) => {
    let userData = req.body;
    userData.password1 = hash.SHA1(userData.password1);
    mongoDatabase.addNewUser(userData, cbOK => {
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

//COMMENTS

app.post('/postComments', (req, res) => {
    let userCommentary = req.body;
    mongoDatabase.postComment(userCommentary, cbOK => {


        if (`${cbOK}` == 200) {

            res.sendStatus(200);

        }
    });

});

//LIKE

app.post('/postLike', (req, res) => {
    let userData = req.body;
    mongoDatabase.postLike(userData, cbOK => {

        if (cbOK == 'se quito like') {

            res.status(200).send('se quito like');

        } else if (cbOK == 'se agrego like') {

            res.status(200).send('se agrego like');

        } else {
            res.status(500);
        }

    });

});
//SUBSCRIBE

app.post('/subscribe', (req, res) => {
    let subscribeData = req.body;
    let userName = req.session.user;
    mongoDatabase.subscribe(subscribeData, userName, cbOK => {

        if (cbOK == 'se borro la subscripcion') {

            res.status(200).send('se borro la subscripcion');

        } else if (cbOK == 'se agrego a request') {

            res.status(200).send('se agrego a request');

        } else if (cbOK == 'se quito de request') {

            res.status(200).send('se quito de request');

        } {
            res.status(500);
        }

    });

});

//UPVOTE

app.post('/postLikeCommentUp', (req, res) => {
    var commentUpData = req.body;

    mongoDatabase.commentUp(commentUpData, cbOK => {

        if (cbOK == 'se quito like') {

            res.status(200).send('se quito like');

        } else if (cbOK == 'se agrego like') {

            res.status(200).send('se agrego like');

        } else if (cbOK == 'Nop...') {

            res.status(200).send('Nop...');

        } else {
            res.status(500);
        }

    });

});

//DOWNVOTE

app.post('/postLikeCommentDown', (req, res) => {
    var commentDownData = req.body;

    mongoDatabase.commentDown(commentDownData, cbOK => {


        if (cbOK == 'se quito like') {

            res.status(200).send('se quito like');

        } else if (cbOK == 'se agrego like') {

            res.status(200).send('se agrego like');

        } else if (cbOK == 'Nop...') {

            res.status(200).send('Nop...');

        } else {
            res.status(500);
        }

    });

});

// CREATE GROUP

app.post('/createGroup', (req, res) => {
    let groupData = req.body;
    mongoDatabase.addNewGroup(groupData, cbOK => {
        if (`${cbOK}` == 403) {

            res.sendStatus(403);

        } else if (`${cbOK}` == 200) {

            res.sendStatus(200);

        } else {
            res.sendStatus(500);
        }
    });
});

app.post('/acceptOrRejectMember', (req, res) => {
    let acceptOrRejectMemberData = req.body;
    mongoDatabase.acceptOrRejectMember(acceptOrRejectMemberData, cbOK => {

        if (cbOK == 'se agrego a members') {

            res.status(200).send('se agrego a members');

        } else if (cbOK == 'se borro de request') {

            res.status(200).send('se borro de request');

        } else {
            res.status(500);
        }

    });

});


app.listen(8001);
console.log('listening in port 8001');
*/