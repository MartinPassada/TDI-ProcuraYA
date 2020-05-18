module.exports.getLatestMovies = getLatestMovies;
module.exports.getGenres = getGenres;
module.exports.searchByGenres = searchByGenres;
module.exports.getMovieInfo = getMovieInfo;
module.exports.getMostWievedMovies = getMostWievedMovies;
module.exports.getRankedMovies = getRankedMovies;
module.exports.validateLogin = validateLogin;
module.exports.addNewUser = addNewUser;
module.exports.postComment = postComment;
module.exports.getComments = getComments;
module.exports.postLike = postLike;
module.exports.getLikesForUser = getLikesForUser;
module.exports.getLastComment = getLastComment;
module.exports.commentUp = commentUp;
module.exports.commentDown = commentDown;
module.exports.getUpLikesForComments = getUpLikesForComments;
module.exports.getDownLikesForComments = getDownLikesForComments;
module.exports.addNewGroup = addNewGroup;
module.exports.getCommunityInfo = getCommunityInfo;
module.exports.subscribe = subscribe;
module.exports.Forum = Forum;
module.exports.checkBeforeEnter = checkBeforeEnter;
module.exports.checkAfterEnter = checkAfterEnter;
module.exports.acceptOrRejectMember = acceptOrRejectMember;


const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017';
const fs = require("fs");
const path = require('path');



function getLatestMovies(cbOK) {

    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("moviesdatabase");
            collection.find().sort({ AddedDate: -1 }).limit(20).toArray((err, data) => {
                cbOK(data);
            });
        }


        //client.close();
    });



}

function getGenres(cbOK) {

    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("moviesdatabase");
            collection.find().project({ "genre": 1.0, "_id": 0.0 }).toArray((err, data) => {
                cbOK(data);
            });
        }


        //client.close();
    });



}

function searchByGenres(cbOK, searchparameter) {
    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {

            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("moviesdatabase");
            collection.find({ genre: new RegExp(searchparameter) }).toArray((err, data) => {
                cbOK(data);
            });
        }


        //client.close();
    });

}

function getMovieInfo(cbOK, searchparameter) {
    mongoClient.connect(mongoURL, function(err, client) {
        var ObjectID = require('mongodb').ObjectID;

        if (err) {

            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("moviesdatabase");
            collection.find({ "_id": ObjectID(`${searchparameter}`) }).toArray((err, data) => {
                var videoPath = `${data[0].moviePagePath}${data[0].name}.${data[0].filetype}`;
                try {
                    if (fs.readFileSync(path.resolve(__dirname, `../Client${videoPath}`), {})) {
                        data[0].exist = true;
                    }
                } catch (err) {

                    if (err.code === 'ENOENT') {
                        data[0].exist = false;

                    }
                }
                cbOK(data);
            });
        }
        //client.close();
    });

}

function getCommunityInfo(userName, cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {

            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var community = db.collection("community");

            community.find().limit(50).toArray((err, data) => {

                if (userName !== undefined) {

                    var isCreator = false;
                    var foundInMember = false;
                    var foundInJoinRequest = false;

                    for (let i = 0; i < data.length; i++) {

                        if (data[i].creator == userName) {
                            data[i].isCreator = true;
                            isCreator = true;
                        } else {
                            for (let m = 0; m < data[i].members.length; m++) {

                                if (data[i].members[m] == userName) {

                                    data[i].isMember = true;
                                    foundInMember = true;
                                }
                            }

                            if (foundInMember == false) {
                                for (let j = 0; j < data[i].joinRequests.length; j++) {

                                    if (data[i].joinRequests[j] == userName) {

                                        data[i].isRequested = true;
                                        foundInJoinRequest = true;
                                    }
                                }
                                if (foundInMember == false && foundInJoinRequest == false) {

                                    data[i].isNoMember = true;
                                }
                            }
                        }
                        isCreator = false;
                        foundInMember = false;
                        foundInJoinRequest = false;
                    }

                    cbOK(data);

                } else {

                    for (let u = 0; u < data.length; u++) {

                        data[u].isNosession = true;
                    }

                    cbOK(data);

                }
            });
        }
        //client.close();
    });

}

function getMostWievedMovies(cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {

            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("moviesdatabase");
            collection.find().sort({ views: -1 }).toArray((err, data) => {
                cbOK(data);
            });
        }


        //client.close();
    });
}

function getRankedMovies(cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {

            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("moviesdatabase");
            collection.find().sort({ average: -1 }).toArray((err, data) => {
                cbOK(data);
            });
        }


        //client.close();
    });
}

// LOGIN

function validateLogin(loginData, cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {
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

function addNewUser(userData, cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("users");
            collection.find({ "$or": [{ "email": `${userData.email}` }, { "userName": `${userData.userName}` }] }).limit(1).toArray((err, data) => {

                if (data == '') {

                    collection.insertOne({
                        email: `${userData.email}`,
                        userName: `${userData.userName}`,
                        password: `${userData.password1}`,
                        moviesLiked: userData.moviesLiked,
                        commentsLiked: userData.commentsLiked,
                        commentsUnliked: userData.commentsUnliked
                    });

                    cbOK(`${userData.userName}`);

                } else if (data[0].email === userData.email) {


                    cbOK(403);

                } else if (data[0].userName === userData.userName) {

                    cbOK(999);

                }
            });
        }

        //client.close();
    });
}

// COMMENTS

function postComment(userCommentary, cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("comments");
            var community = db.collection("community");
            var ObjectID = require('mongodb').ObjectID;

            collection.count({}, function(err, NroOfdocs) {


                if (userCommentary.movieID !== null) {

                    var aux = NroOfdocs;
                    collection.insertOne({

                        movieID: `${userCommentary.movieID}`,
                        author: `${userCommentary.author}`,
                        date: userCommentary.date,
                        image: userCommentary.image,
                        likes: userCommentary.likes,
                        text: `${userCommentary.text}`,

                        Nro: (aux + 1)

                    });
                } else {

                    var aux = NroOfdocs;

                    collection.insertOne({

                        forumID: `${userCommentary.forumID}`,
                        author: `${userCommentary.author}`,
                        date: userCommentary.date,
                        image: userCommentary.image,
                        likes: userCommentary.likes,
                        text: `${userCommentary.text}`,

                        Nro: (aux + 1)

                    });

                    community.updateOne({ "_id": ObjectID(`${userCommentary.forumID}`) }, { $inc: { numberOfComments: +1 } });

                }

            });


            cbOK(200);


        }

        //client.close()
    });

}

function getComments(cbOK, searchparameter, isForum) {

    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("comments");
            if (isForum == 'Forum') {
                collection.find({ forumID: `${searchparameter}` }).sort({ date: -1 }).limit(15).toArray((err, data) => {
                    cbOK(data);
                });
            } else {
                collection.find({ movieID: `${searchparameter}` }).sort({ date: -1 }).limit(15).toArray((err, data) => {
                    cbOK(data);
                });
            }

        }


        //client.close();
    });
}

function getLastComment(cbOK, searchparameter, isForum) {

    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("comments");
            if (isForum == 'Forum') {
                collection.find({ forumID: `${searchparameter}` }).sort({ date: -1 }).limit(1).toArray((err, data) => {

                    cbOK(data);
                });
            } else {
                collection.find({ movieID: `${searchparameter}` }).sort({ date: -1 }).limit(1).toArray((err, data) => {

                    cbOK(data);

                });
            }

        }


        //client.close();
    });
}

function postLike(userData, cbOK) {
    var ObjectID = require('mongodb').ObjectID;
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var users = db.collection("users");
            var moviesdatabase = db.collection("moviesdatabase");
            var found = false;


            users.find({ userName: `${userData.userName}` }).project({ "moviesLiked": 1.0 }).limit(1).toArray((err, userLikes) => {


                for (var i = 0; i < userLikes[0].moviesLiked.length; i++) {
                    if (userLikes[0].moviesLiked[i] == userData.movieID) {
                        found = true;
                    }
                }


                if (found == true) {

                    users.updateOne({ userName: `${userData.userName}` }, { $pull: { moviesLiked: `${userData.movieID}` } });

                    moviesdatabase.updateOne({ "_id": ObjectID(`${userData.movieID}`) }, { $inc: { likes: -1 } });

                    cbOK('se quito like');


                } else if (found == false) {


                    users.updateOne({ userName: `${userData.userName}` }, { $addToSet: { moviesLiked: `${userData.movieID}` } });

                    moviesdatabase.updateOne({ "_id": ObjectID(`${userData.movieID}`) }, { $inc: { likes: +1 } });

                    cbOK('se agrego like');

                }


            });
        }
        //client.close();

    });
}

function getLikesForUser(userName, movieID, cbOK) {

    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("users");
            collection.find({ userName: `${userName}` }).project({ "moviesLiked": 1.0 }).limit(1).toArray((err, data) => {

                var found = false;

                for (var i = 0; i < data[0].moviesLiked.length; i++) {
                    if (data[0].moviesLiked[i] == movieID) {
                        found = true;
                    }
                }

                cbOK(found);

            });
        }


        //client.close();
    });
}

function getUpLikesForComments(userName, cbOK) {

    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("users");
            collection.find({ userName: `${userName}` }).project({ commentsLiked: 1, _id: 0 }).limit(1).toArray((err, data) => {

                cbOK(data);

            });
        }


        //client.close();
    });
}

function getDownLikesForComments(userName, cbOK) {

    mongoClient.connect(mongoURL, function(err, client) {

        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("users");
            collection.find({ userName: `${userName}` }).project({ commentsUnliked: 1, _id: 0 }).limit(1).toArray((err, data) => {

                cbOK(data);

            });
        }


        //client.close();
    });
}
//up
function commentUp(commentUpData, cbOK) {
    var ObjectID = require('mongodb').ObjectID;
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var users = db.collection("users");
            var commentsdatabase = db.collection("comments");
            var foundinliked = false;
            var foundinUnliked = false;


            users.find({ userName: `${commentUpData.userName}` }).project({ commentsUnliked: 1.0, commentsLiked: 1.0, }).limit(1).toArray((err, userLikes) => {


                for (var i = 0; i < userLikes[0].commentsUnliked.length; i++) {
                    if (userLikes[0].commentsUnliked[i] == commentUpData.commentsId) {
                        foundinUnliked = true;
                    }
                }
                for (var i = 0; i < userLikes[0].commentsLiked.length; i++) {
                    if (userLikes[0].commentsLiked[i] == commentUpData.commentsId) {
                        foundinliked = true;
                    }
                }


                if (foundinUnliked == true) {

                    users.updateOne({ userName: `${commentUpData.userName}` }, { $pull: { commentsUnliked: `${commentUpData.commentsId}` } });

                    commentsdatabase.updateOne({ "_id": ObjectID(`${commentUpData.commentsId}`) }, { $inc: { likes: +1 } });

                    cbOK('se quito like');


                } else if (foundinUnliked == false && foundinliked == false) {


                    users.updateOne({ userName: `${commentUpData.userName}` }, { $addToSet: { commentsLiked: `${commentUpData.commentsId}` } });

                    commentsdatabase.updateOne({ "_id": ObjectID(`${commentUpData.commentsId}`) }, { $inc: { likes: +1 } });

                    cbOK('se agrego like');

                } else {
                    cbOK('Nop...');
                }


            });
        }
        //client.close();

    });
}
//down
function commentDown(commentDownData, cbOK) {
    var ObjectID = require('mongodb').ObjectID;
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var users = db.collection("users");
            var commentsdatabase = db.collection("comments");
            var foundinliked = false;
            var foundinUnliked = false;


            users.find({ userName: `${commentDownData.userName}` }).project({ commentsUnliked: 1.0, commentsLiked: 1.0, }).limit(1).toArray((err, userLikes) => {


                for (var i = 0; i < userLikes[0].commentsLiked.length; i++) {
                    if (userLikes[0].commentsLiked[i] == commentDownData.commentsId) {
                        foundinliked = true;
                    }
                }
                for (var i = 0; i < userLikes[0].commentsUnliked.length; i++) {
                    if (userLikes[0].commentsUnliked[i] == commentDownData.commentsId) {
                        foundinUnliked = true;
                    }
                }

                if (foundinliked == true) {

                    users.updateOne({ userName: `${commentDownData.userName}` }, { $pull: { commentsLiked: `${commentDownData.commentsId}` } });

                    commentsdatabase.updateOne({ "_id": ObjectID(`${commentDownData.commentsId}`) }, { $inc: { likes: -1 } });

                    cbOK('se quito like');


                } else if (foundinliked == false && foundinUnliked == false) {


                    users.updateOne({ userName: `${commentDownData.userName}` }, { $addToSet: { commentsUnliked: `${commentDownData.commentsId}` } });

                    commentsdatabase.updateOne({ "_id": ObjectID(`${commentDownData.commentsId}`) }, { $inc: { likes: -1 } });

                    cbOK('se agrego like');

                } else {
                    cbOK('Nop...');
                }


            });
        }
        //client.close();

    });
}
//CREATE GROUP

function addNewGroup(groupData, cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("community");
            collection.find({ "groupName": `${groupData.groupName}` }).limit(1).toArray((err, data) => {

                if (data == '') {

                    collection.insertOne({
                        groupName: `${groupData.groupName}`,
                        groupDescription: `${groupData.groupDescription}`,
                        creator: `${groupData.creator}`,
                        members: groupData.members,
                        joinRequests: groupData.joinRequests,
                        numberOfComments: 0
                    });

                    cbOK(200);

                } else if (data[0].groupName === groupData.groupName) {

                    cbOK(403);

                } else {
                    cbOK(500);
                }
            });
        }

        //client.close();
    });
}

//SUBSCRIBE

function subscribe(subscribeData, userName, cbOK) {

    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var community = db.collection("community");

            var foundInJoinRequest = false;
            var foundInMember = false;


            community.find({ groupName: `${subscribeData.groupTitle}` }).project({ members: 1.0, joinRequests: 1.0, _id: -1 }).limit(1).toArray((err, group) => {


                for (var i = 0; i < group[0].members.length; i++) {
                    if (group[0].members[i] == userName) {
                        foundInMember = true;
                    }
                }
                for (var i = 0; i < group[0].joinRequests.length; i++) {
                    if (group[0].joinRequests[i] == userName) {
                        foundInJoinRequest = true;
                    }
                }


                if (foundInMember == true) {

                    community.updateOne({ groupName: `${subscribeData.groupTitle}` }, { $pull: { members: `${userName}` } });

                    //community.updateOne({ groupName: `${subscribeData.groupTitle}` }, { $inc: { members: -1 } });

                    cbOK('se borro la subscripcion');


                } else if (foundInMember == false && foundInJoinRequest == false) {


                    community.updateOne({ groupName: `${subscribeData.groupTitle}` }, { $addToSet: { joinRequests: `${userName}` } });


                    cbOK('se agrego a request');

                } else if (foundInJoinRequest == true) {


                    community.updateOne({ groupName: `${subscribeData.groupTitle}` }, { $pull: { joinRequests: `${userName}` } });


                    cbOK('se quito de request');

                } {
                    cbOK('Nop...');
                }


            });
        }
        //client.close();

    });
}

function Forum(searchparameter, userName, cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {

            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("community");
            var ObjectID = require('mongodb').ObjectID;

            collection.find({ "_id": ObjectID(`${searchparameter}`) }).limit(1).toArray((err, data) => {
                if (data[0].creator == userName) {
                    data[0].isCreator = true;
                }
                cbOK(data);


            });
        }
        //client.close();
    });

}

function checkBeforeEnter(searchparameter, userName, cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {

            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("community");
            var isCreator = false;
            var isMember = false;

            collection.find({ groupName: `${searchparameter}` }).limit(1).toArray((err, data) => {


                if (data[0].creator == userName) {
                    isCreator = true;

                } else {
                    for (let i = 0; i < data[0].members.length; i++) {
                        if (data[0].members[i] == userName) {
                            isMember = true;
                        }
                    }

                }
                if (isCreator == true || isMember == true) {

                    cbOK(data);

                } else {

                    cbOK('noMember');

                }

            });
        }
        //client.close();
    });

}

function checkAfterEnter(searchparameter, userName, cbOK) {
    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {

            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var collection = db.collection("community");
            var ObjectID = require('mongodb').ObjectID;
            var isCreator = false;
            var isMember = false;

            collection.find({ "_id": ObjectID(`${searchparameter}`) }).limit(1).toArray((err, data) => {


                if (data[0].creator == userName) {
                    isCreator = true;

                } else {
                    for (let i = 0; i < data[0].members.length; i++) {
                        if (data[0].members[i] == userName) {
                            isMember = true;
                        }
                    }

                }
                if (isCreator == true || isMember == true) {

                    cbOK('ok');

                } else {

                    cbOK('noMember');

                }

            });

        }
        //client.close();
    });

}

function acceptOrRejectMember(acceptOrRejectMemberData, cbOK) {

    mongoClient.connect(mongoURL, function(err, client) {
        if (err) {
            cbError("No se pudo conectar a la DB. " + err);
        } else {
            var db = client.db("admin");
            var community = db.collection("community");
            var ObjectID = require('mongodb').ObjectID;


            if (acceptOrRejectMemberData.actionClicked == 'accepted') {

                community.updateOne({ "_id": ObjectID(`${acceptOrRejectMemberData.forumID}`) }, { $pull: { joinRequests: `${acceptOrRejectMemberData.userName}` } });

                community.updateOne({ "_id": ObjectID(`${acceptOrRejectMemberData.forumID}`) }, { $addToSet: { members: `${acceptOrRejectMemberData.userName}` } });


                cbOK('se agrego a members');


            } else if (acceptOrRejectMemberData.actionClicked == 'rejected') {


                community.updateOne({ "_id": ObjectID(`${acceptOrRejectMemberData.forumID}`) }, { $pull: { joinRequests: `${acceptOrRejectMemberData.userName}` } });


                cbOK('se borro de request');

            }
        }
        //client.close();

    });
}