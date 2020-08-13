const express = require('express');
const app = express();
// const assert = require('assert');
const fs = require('fs');
const crypto = require('crypto');
// const session = require('express-session');
// const cookie = require('cookie');
var cookieSession = require('cookie-session')
const mongoose = require('mongoose');
const multer  = require('multer');
const bodyParser = require('body-parser');
require('events').EventEmitter.defaultMaxListeners = 30;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('frontend'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use(cookieSession({
    name: 'session',
    keys: ["Aax020020"],

    // Cookie Options
    path : '/',
    secure: false,
    sameSite: true,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true
}));

function generateSalt(){
    return crypto.randomBytes(16).toString('base64');
}

function generateHash(password, salt){
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

let usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    email: String,
    userImage: {filepath: {type: String, default: 'none'},
        fileType: {type: String, default: 'none'}, 
        filename: {type: String, default: 'none'}},
    admin: {type: Boolean, default: false},
    verify: {type: Boolean, default: false},
    date: {type: Date, default: Date.now()}
});
let User = mongoose.model('Users', usersSchema);

let newslettersSchema = new mongoose.Schema({
    filepath: String,
    fileType: String,
    title: String,
    author: String,
    date: Date,
    description: String
});
let Newsletters = mongoose.model('Newsletters', newslettersSchema);

let WorshipVideosSchema = new mongoose.Schema({
    videoId: String,
    filepath: String,
    fileType: String,
    title: String,
    size: Number,
    author: String,
    date: Date,
});
let WorshipVideos = mongoose.model('WorshipVideos', WorshipVideosSchema);

let File = new mongoose.Schema({
    fileName: String,
    posts: [{
        pictures: [{
            picturePath: {type: String, default: 'none'},
            pictureType: {type: String, default: 'none'}
        }],
        title: {type: String, default: 'none'},
        author: {type: String, default: 'none'},
        date: Date,
        content: {type: String, default: 'none'}
    }]
});
let Files = mongoose.model('Files', File);

let GallerySchema = new mongoose.Schema({
    filepath: String,
    fileType: String,
    title: String,
    description: String
});
let Gallery = mongoose.model('Gallery', GallerySchema);

let adminEmail = ['zhuxingyuan123@gmail.com',
    'angelaningzhou@gmail.com',
    'jeff48wang@gmail.com',
    'rogerlau2013@gmail.com',
    'voss2005@gmail.com',
    'luoxiaohu918@gmail.com',
    'xinliu.liu@gmail.com',
    'he6477673996@gmail.com',
    'serenagaga777@gmail.com'];

let uploadNewsletters = multer({ dest: 'newsletters/' });
let uploadworshipVideo = multer({ dest: 'worshipVideo/' });
let uploadImage = multer({ dest: 'gallery/' });
let uploadBlogImage = multer({ dest: 'blogImage/' });
let userImage = multer({ dest: 'userImage/' });

let isAuthenticated = function(req, res, next) {
    if (!req.session.user) return res.status(401).end("access denied");
    return next();
};

// videoUpload.request({ method: 'GET', path: '/tutorial' }, function (error, body, status_code, headers) {
//     if (error) {
//       console.log(error);
//     }
//     console.log(body);
// });

app.post('/signUp/', function(req, res, next) {
    let name = req.body.username;
    let signUpEmail = req.body.email;
    let salt = generateSalt();
    let hash = generateHash(req.body.password, salt);

    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let newUser = new User({username: name, password: hash, email: signUpEmail, salt: salt});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    User.findOne({$or: [{email: signUpEmail}, {username: name}]}, function(err, docs) {
        if (err) return res.status(500).end(err);
        if (docs) return res.status(409).end('Email or user name is already exsits! Please sign in.');
        if (adminEmail.includes(signUpEmail)) newUser.admin = true;
        let link = "http://" + req.get('host') + "/verify?uid=" + newUser._id;
        let mailOptions = {
            from: 'f2fhomechurch@gmail.com',
            to: signUpEmail,
            subject: 'Please confirm your Email account',
            html: `
            <!DOCTYPE html>
            <html>

                <head>
                    <title></title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <style type="text/css">
                        @media screen {
                            @font-face {
                                font-family: 'Lato';
                                font-style: normal;
                                font-weight: 400;
                                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                            }

                            @font-face {
                                font-family: 'Lato';
                                font-style: normal;
                                font-weight: 700;
                                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                            }

                            @font-face {
                                font-family: 'Lato';
                                font-style: italic;
                                font-weight: 400;
                                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                            }

                            @font-face {
                                font-family: 'Lato';
                                font-style: italic;
                                font-weight: 700;
                                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                            }
                        }

                        /* CLIENT-SPECIFIC STYLES */
                        body,
                        table,
                        td,
                        a {
                            -webkit-text-size-adjust: 100%;
                            -ms-text-size-adjust: 100%;
                        }

                        table,
                        td {
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                        }

                        img {
                            -ms-interpolation-mode: bicubic;
                        }

                        /* RESET STYLES */
                        img {
                            border: 0;
                            height: auto;
                            line-height: 100%;
                            outline: none;
                            text-decoration: none;
                        }

                        table {
                            border-collapse: collapse !important;
                        }

                        body {
                            height: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 100% !important;
                        }

                        /* iOS BLUE LINKS */
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                            text-decoration: none !important;
                            font-size: inherit !important;
                            font-family: inherit !important;
                            font-weight: inherit !important;
                            line-height: inherit !important;
                        }

                        /* MOBILE STYLES */
                        @media screen and (max-width:600px) {
                            h1 {
                                font-size: 32px !important;
                                line-height: 32px !important;
                            }
                        }

                        /* ANDROID CENTER FIX */
                        div[style*="margin: 16px 0;"] {
                            margin: 0 !important;
                        }
                    </style>
                </head>

                <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                    <!-- HIDDEN PREHEADER TEXT -->
                    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <!-- LOGO -->
                        <tr>
                            <td bgcolor="#FFA73B" align="center">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> 
                                            <img src="https://previews.123rf.com/images/lenm/lenm1801/lenm180100278/93471320-illustration-of-stickman-kids-with-jesus-christ.jpg" width="500" height="500" style="display: block; border: 0px;" />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#ffffff" align="left">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="${link}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr> <!-- COPY -->
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">Blessings,<br>Face 2 Face Team</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>

            </html>
            `,
        };
        mg.messages().send(mailOptions, function (err, body) {
            if (err) return console.log(err);
            newUser.save(function(err) {
                if (err) return res.status(500).end(err.response);
                db.close();
                return res.json(docs);
            });
        });
    });
});

app.post('/logIn/', function(req, res, next) {
    let logInEmail = req.body.email;
    let password = req.body.password;

    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    User.findOne({email: logInEmail}, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("No email found!");
        if(!user.verify) return res.status(401).end("Please go to your email to active your account!");
        if (user.password !== generateHash(password, user.salt)) return res.status(401).end("access denied");

        
        req.session.userId = user._id;
        console.log("id: " + req.session.userId);
        db.close();
        return res.json(user);
    });
});

app.post("/createFile/", function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let files = new Files({fileName: req.body.filename});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));
    // Files.updateOne({}, {$push: {files: { "fileName": req.body.filename }}}, function(err) {
    //     if (err) return res.status(500).end(err);
    //     db.close();
    //     return res.json("success");
    // });
    files.save(function(err) {
        if (err) return res.status(500).end(err);
        db.close();
        return res.json("success");
    });
});

app.post('/ourGallery/', uploadImage.any(), function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let gallery = new Gallery({
        filepath: req.files[0].path, 
        fileType: req.files[0].mimetype,
        title: req.body.title,
        description: req.body.description
    });

    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    gallery.save(function(err) {
        if (err) return res.status(500).end(err);
        db.close();
        return res.redirect('/ourGallery.html');
    });
});

app.post('/newsletters/', uploadNewsletters.any(), function(req, res, next){ 
    // console.log(req.body);
    if(req.files[0].mimetype !== "application/pdf") return res.status(401).end(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
    
            <title>404 HTML Template by Colorlib</title>
    
            <link href="https://fonts.googleapis.com/css?family=Montserrat:500" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Titillium+Web:700,900" rel="stylesheet">
    
            <link type="text/css" rel="stylesheet" href="../css/errorPage.css"/>
    
        <body>
            <div id="notfound">
                <div class="notfound">
                    <div class="notfound-404">
                        <h1>401</h1>
                    </div>
                    <h2>The Newsletter Must in PDF format!</h2>
                    <p>Please go back to Newsletter Page</p>
                    <a href="../newsletters.html">Go To Newsletter</a>
                </div>
            </div>
        </body>
    </html>
    `);
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let newNewsletter = new Newsletters({filepath: req.files[0].path, 
        fileType: req.files[0].mimetype, 
        title: req.body.title, 
        author: req.body.author, 
        date: req.body.date, 
        description: req.body.description});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    newNewsletter.save(function(err) {
        if (err) return res.status(500).end(err);
        db.close();
        return res.redirect('/newsletters.html');
    });
});

app.post('/worshipVideo/', uploadworshipVideo.any(), function(req, res, next){
    // console.log(req.files);
    if(req.files[0].mimetype !== "video/mp4") return res.status(401).end(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
    
            <title>404 HTML Template by Colorlib</title>
    
            <link href="https://fonts.googleapis.com/css?family=Montserrat:500" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Titillium+Web:700,900" rel="stylesheet">
    
            <link type="text/css" rel="stylesheet" href="../css/errorPage.css"/>
    
        <body>
            <div id="notfound">
                <div class="notfound">
                    <div class="notfound-404">
                        <h1>401</h1>
                    </div>
                    <h2>The Video Must in MP4 format!</h2>
                    <p>Please go back to worship video page</p>
                    <a href="../worshipVideo.html">Go To Worship Video</a>
                </div>
            </div>
        </body>
    </html>
    `);
    if(req.files[0].size > 70000000) return res.status(401).end(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
    
            <title>404 HTML Template by Colorlib</title>
    
            <link href="https://fonts.googleapis.com/css?family=Montserrat:500" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Titillium+Web:700,900" rel="stylesheet">
    
            <link type="text/css" rel="stylesheet" href="../css/errorPage.css"/>
    
        <body>
            <div id="notfound">
                <div class="notfound">
                    <div class="notfound-404">
                        <h1>401</h1>
                    </div>
                    <h2>The Video Must Less Than 70MB!</h2>
                    <p>Please go back to worship video page</p>
                    <a href="../worshipVideo.html">Go To Worship Video</a>
                </div>
            </div>
        </body>
    </html>
    `);

    let file_name = req.files[0].path;
    videoUpload.upload( file_name, {'name': req.body.title, 'description': req.body.title}, function (uri) {
            console.log('Your video URI is: ' + uri);

            let videoId = uri.split('/')[2];
            mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
            let worshipVideo = new WorshipVideos({videoId: videoId,
                filepath: req.files[0].path, 
                fileType: req.files[0].mimetype,
                size: req.files[0].size,
                title: req.body.title, 
                author: req.body.author, 
                date: req.body.date
            });
            let db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error!'));

            worshipVideo.save(function(err) {
                if (err) return res.status(500).end(err);
                db.close();
                return res.redirect('/worshipVideo.html');
            });
        }, function (bytes_uploaded, bytes_total) {
            var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2);
            console.log(bytes_uploaded, bytes_total, percentage + '%');
        }, function (error) {
            console.log('Failed because: ' + error)
    });
});

app.post('/searchWorshipVideo/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    if(req.body.searchOption === "Author") {
        WorshipVideos.find({author: req.body.videoInfo}, function(err, videos) {
            if (err) return res.status(500).end(err);
            if (!videos.length) return res.status(500).end("No video found!"); 
            db.close();
            return res.json(videos);
        });
    } else if (req.body.searchOption === "Title") {
        WorshipVideos.find({title: req.body.videoInfo}, function(err, videos) {
            if (err) return res.status(500).end(err);
            if (!videos.length) return res.status(500).end("No video found!"); 
            db.close();
            return res.json(videos);
        });
    } else {
        WorshipVideos.find({date: {$gte: new Date(req.body.videoInfo), $lte: new Date(req.body.videoInfo)}}, function(err, videos) {
            if (err) return res.status(500).end(err);
            if (!videos.length) return res.status(500).end("No video found!"); 
            db.close();
            return res.json(videos);
        });
    }  
});

app.post('/searchNewsletters/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    if(req.body.searchOption === "Author") {
        Newsletters.find({author: req.body.newsletterInfo}, function(err, newsletters) {
            if (err) return res.status(500).end(err);
            if (!newsletters.length) return res.status(500).end("No video found!"); 
            db.close();
            return res.json(newsletters);
        });
    } else if (req.body.searchOption === "Title") {
        Newsletters.find({title: req.body.newsletterInfo}, function(err, newsletters) {
            if (err) return res.status(500).end(err);
            if (!newsletters.length) return res.status(500).end("No video found!"); 
            db.close();
            return res.json(newsletters);
        });
    } else {
        Newsletters.find({date: {$gte: new Date(req.body.newsletterInfo), $lte: new Date(req.body.newsletterInfo)}}, function(err, newsletters) {
            if (err) return res.status(500).end(err);
            if (!newsletters.length) return res.status(500).end("No video found!"); 
            db.close();
            return res.json(newsletters);
        });
    }
});

app.post('/userImageUpload/', userImage.any(), function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    console.log("image upload user id:" + req.session.userId);
    console.log(req.files[0]);

    User.findOne({_id: mongoose.Types.ObjectId(req.session.userId)}, function(err, doc) {
        if (err) return res.status(500).end(err);
        if (!doc) return res.status(401).end("No user found!");

        if(doc.userImage.filepath !== 'none') {
            fs.unlink(__dirname + '/' + doc.userImage.filepath, function(err){
                if(err) return res.status(500).end(err.response);
            });
        }

        User.updateOne({_id: mongoose.Types.ObjectId(req.session.userId)},
        {$set: {'userImage.filepath': req.files[0].path, 'userImage.fileType': req.files[0].mimetype, 'userImage.filename': req.files[0].filename}}, 
        function(err, user) {
            if(err) return res.status(500).end(err.response);
            if (!user) return res.status(401).end("No user found!");
            db.close();
            return res.redirect('/editProfile.html');
        });
    });
});

app.post('/postBlog/:id/', uploadBlogImage.array('blogImages'), function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));
    console.log(req.files);
    console.log(req.body.title)

    req.files.forEach(function(file) {
        Files.updateOne({_id: mongoose.Types.ObjectId(req.params.id)},
        {$push: {posts: {'title': req.body.title, ''}}},
        function(err) {
            if (err) return res.status(500).end(err);
            db.close();
            return res.redirect("/ourBlog.html");
        });
    });
});

app.get('/user/:id/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));
    User.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function(err, doc) {
        if (err) return res.status(500).end(err);
        return res.json(doc);
    });
});

app.get("/files/", function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));
    
    Files.find({}, function(err, doc) {
        if (err) return res.status(500).end(err);
        return res.json(doc);
    });
});

app.get('/userImage/:userId/', function(req, res, next) {
    User.findOne({_id: mongoose.Types.ObjectId(req.session.userId)}, function(err, doc) {
        if (err) return res.status(500).end(err);
        if (!doc) return res.status(500).end("cannot find user!");
        res.setHeader('Content-Type', doc.userImage.fileType);
        res.sendFile(doc.userImage.filepath, { root: __dirname });
    });
});

app.get('/checkSessionExists/', function(req, res, next) {
    if(!req.session.userId) return res.json('false');
    return res.json('true');
});

app.get('/getNewsletters/:page/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    Newsletters.find({}, function(err, newsletters) {
        if (err) return res.status(500).end(err);
        let returnData = newsletters.slice((req.params.page * 4), (req.params.page * 4 + 4));
        db.close();
        return res.json(returnData);
    });
});

app.get('/getNewslettersLength/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    Newsletters.find({}, function(err, newsletters) {
        if (err) return res.status(500).end(err);
        db.close();
        return res.json(newsletters.length);
    });
});

app.get('/getWorshipVideos/:page/', function(req, res, next){
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    WorshipVideos.find({}, function(err, worshipVideos) {
        if (err) return res.status(500).end(err);
        let returnData = worshipVideos.slice((req.params.page * 6), (req.params.page * 6 + 6));
        db.close();
        return res.json(returnData);
    });
});

app.get('/getWorshipVideosLength/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    WorshipVideos.find({}, function(err, worshipVideos){
        if (err) return res.status(500).end(err);
        db.close();
        return res.json(worshipVideos.length);
    });
});

app.get('/getOurGallery/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    Gallery.find({}, function(err, gallerise) {
        if (err) return res.status(500).end(err);
        db.close();
        return res.json(gallerise);
    });
});

app.get('/ourGallery/:id/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    Gallery.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function(err, docs){
        if (err) return res.status(500).end(err);
        if (!docs) return res.status(401).end("Cannot find Newsletters!");
        db.close();
        res.setHeader('Content-Type', docs.fileType);
        return res.sendFile(docs.filepath, { root: __dirname });
    });
});

app.get('/newsletter/:id/', function(req, res, next){
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    Newsletters.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function(err, docs){
        if (err) return res.status(500).end(err);
        if (!docs) return res.status(401).end("Cannot find Newsletters!");
        db.close();
        res.setHeader('Content-Type', docs.fileType);
        return res.sendFile(docs.filepath, { root: __dirname });
    });
});

app.get('/signout/', function(req, res, next){
    req.session = null;
    return res.json('signout');
});

app.get('/verify', function (req, res) {
    if((req.protocol+"://"+req.get('host'))==("http://"+req.get('host'))) {

        mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error!'));

        User.updateOne({_id: mongoose.Types.ObjectId(req.query.uid)}, {$set: {verify: true}}, function(err, user) {
            if(err) return res.status(500).end(err.response);
            if (!user) return res.status(401).end("No user found!");
            db.close();
            return res.redirect('/emailConfirmed.html');
        });
    }
    else {
        return res.status(500).end("Request is from unknown source");
    }
});

app.delete('/delNewsletters/', function(req, res){
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    Newsletters.findOneAndDelete({_id: mongoose.Types.ObjectId(req.body.id)}, function(err, doc){
        fs.unlink(__dirname + '/' + doc.filepath, function(err){
            if(err) return res.status(500).end(err.response);
            Newsletters.find({}, function(err, newsletters) {
                if (err) return res.status(500).end(err);
                db.close();
                return res.json(newsletters.length);
            });
        });
    });
});

app.delete('/delWorshipVideo/', function(req, res){
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    WorshipVideos.findOneAndDelete({_id: mongoose.Types.ObjectId(req.body.id)}, function(err, doc){
        if(err) return res.status(500).end(err);

        let path = "/videos/" + doc.videoId;
        fs.unlink(__dirname + '/' + doc.filepath, function(err){
            if(err) return res.status(500).end(err.response);
            WorshipVideos.find({}, function(err, worshipVideos) {
                if (err) return res.status(500).end(err);
                db.close();

                videoUpload.request({ method: 'DELETE', path: path}, function (error, body, status_code, headers) {
                    if (error) return console.log(error);
                    return res.json(worshipVideos.length);
                });
            });
        });
    });
});

app.delete('/delImage/', function(req, res) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    Gallery.findOneAndDelete({_id: mongoose.Types.ObjectId(req.body.id)}, function(err, doc){
        if(err) return res.status(500).end(err);
        fs.unlink(__dirname + '/' + doc.filepath, function(err){
            if(err) return res.status(500).end(err.response);
            Gallery.find({}, function(err, gallery) {
                if (err) return res.status(500).end(err);
                db.close();
                return res.json(gallery.length);
            });
        });
    });
});

app.delete('/deleteFile/', function(req, res, next) {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    Files.findOneAndDelete({_id: mongoose.Types.ObjectId(req.body.id)}, function(err, doc) {
        if (err) return res.status(500).end(err);
        db.close();
        return res.json("success");
    });
});

const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});