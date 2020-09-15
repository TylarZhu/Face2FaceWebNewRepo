let api = (function(){
    "use strict";

    let module = {};

    function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }

    if (!localStorage.getItem('face2face')){
        localStorage.setItem('face2face', JSON.stringify({
            username: "", 
            userId: "",
            newsletterPage: 0, 
            worshipVideoPage: 0,
            admin: false,

        }));
    }
    
    module.signOut = function() {
        let midStorage = JSON.parse(localStorage.getItem('face2face'));
        send("GET", "/signout/", undefined, function(err, res) {
            if (err) return notifyErrorListeners(err);
            midStorage.username = "";
            midStorage.userId = "";
            midStorage.admin = false;
            midStorage.newsletterPage = 0;
            midStorage.worshipVideoPage = 0;
            localStorage.setItem('face2face', JSON.stringify(midStorage));
            window.location.replace("/");
        });
    };

    module.signUp = function(username, email, password){
        send("POST", "/signUp/", {username: username, email: email, password: password}, function(err, res){
            if (err) return notifyErrorListeners(err);
            window.location.replace("/pleaseGoVerify.html");
        });
    };

    module.login = function(email, password){
        let midStorage = JSON.parse(localStorage.getItem('face2face'));
        send("POST", "/logIn/", {email: email, password: password}, function(err, res) {
            if (err) return notifyErrorListeners(err);
            midStorage.username = res.username;
            midStorage.userId = res._id;
            midStorage.admin = res.admin;
            localStorage.setItem('face2face', JSON.stringify(midStorage));
            window.location.replace("/");
        });
    };

    module.userAuthorized = function(callback) {
        let midStorage = JSON.parse(localStorage.getItem('face2face'));
        if(midStorage.username !== "") return callback(true);
        else return callback(false);
    };

    module.userAdmin = function(callback){
        let midStorage = JSON.parse(localStorage.getItem('face2face'));
        return callback(midStorage.admin);
    };

    module.getUsername = function() {
        let midStorage = JSON.parse(localStorage.getItem('face2face'));
        return midStorage.username;
    };

    module.getNewsletters = function(callback){
        let midStorage = JSON.parse(localStorage.getItem('face2face'));
        send("GET", "/getNewsletters/" + midStorage.newsletterPage + "/", undefined, callback);
    };


    function getNewslettersArrayLength(callback){
        send("GET", "/getNewslettersLength/", undefined, callback);
    }

    module.newslettersNextPage = function(){
        getNewslettersArrayLength(function(err, length){
            if (err) return notifyErrorListeners(err);
            let midStorage = JSON.parse(localStorage.getItem('face2face'));
            if(parseInt(length) > (midStorage.newsletterPage + 1) * 4){
                midStorage.newsletterPage ++;
            } else {
                return;
            }
            localStorage.setItem('face2face', JSON.stringify(midStorage));
            notifyNewslettersListeners();
        });
    }

    module.newslettersPreviousPage = function(){
        let midStorage = JSON.parse(localStorage.getItem('face2face'));

        if(midStorage.newsletterPage > 0){
            midStorage.newsletterPage --;
        } else {
            return;
        }
        localStorage.setItem('face2face', JSON.stringify(midStorage));
        notifyNewslettersListeners();
    }

    module.searchNewsletters = function(newsletterInfo, searchOption, callback){
        send("POST", "/searchNewsletters/", {newsletterInfo: newsletterInfo, searchOption: searchOption}, function(err, res){
            if (err) return notifyErrorListeners(err);
            callback(res);
        });
    }

    module.getWorshipVideos = function(callback){
        let midStorage = JSON.parse(localStorage.getItem('face2face'));
        send("GET", "/getWorshipVideos/" + midStorage.worshipVideoPage + "/", undefined, callback);
    }

    function getWorshipVideosArrayLength(callback){
        send("GET", "/getWorshipVideosLength/", undefined, callback);
    }

    module.getGallery = function(callback) {
        send("GET", "/getOurGallery/", undefined, callback);
    }

    module.worshipVideosNextPage = function(){
        getWorshipVideosArrayLength(function(err, length){
            if (err) return notifyErrorListeners(err);
            let midStorage = JSON.parse(localStorage.getItem('face2face'));
            if(parseInt(length) > (midStorage.worshipVideoPage + 1) * 6){
                midStorage.worshipVideoPage ++;
            } else {
                return;
            }
            localStorage.setItem('face2face', JSON.stringify(midStorage));
            notifyWorshipVideosListeners();
        });
    }

    module.worshipVideosPreviousPage = function(){
        let midStorage = JSON.parse(localStorage.getItem('face2face'));

        if(midStorage.worshipVideoPage > 0){
            midStorage.worshipVideoPage --;
        } else {
            return;
        }
        localStorage.setItem('face2face', JSON.stringify(midStorage));
        notifyWorshipVideosListeners();
    }

    module.searchWorshipVideos = function(videoInfo, searchOption, callback){
        send("POST", "/searchWorshipVideo/", {videoInfo: videoInfo, searchOption: searchOption}, function(err, res){
            if (err) return notifyErrorListeners(err);
            callback(res);
        });
    }

    module.deleteImage = function(id) {
        send("DELETE", "/delImage/", {id: id}, function(err, res) {
            if (err) return notifyErrorListeners(err);
            notifyGalleryListeners();
        });
    }

    module.deleteNewsletter = function(id){
        send("DELETE", "/delNewsletters/", {id: id}, function(err, res) {
            if (err) return notifyErrorListeners(err);
            let commentStorage = JSON.parse(localStorage.getItem('face2face'));
            if(commentStorage.newsletterPage > 0 && parseInt(res) <= commentStorage.newsletterPage * 4){
                commentStorage.newsletterPage --;
            }
            localStorage.setItem('face2face', JSON.stringify(commentStorage));
            notifyNewslettersListeners();
        });
    }

    module.deleteWorshipVideo = function(id){
        send("DELETE", "/delWorshipVideo/", {id: id}, function(err, res) {
            if (err) return notifyErrorListeners(err);
            let commentStorage = JSON.parse(localStorage.getItem('face2face'));
            if(commentStorage.worshipVideoPage > 0 && parseInt(res) <= commentStorage.worshipVideoPage * 6){
                commentStorage.worshipVideoPage --;
            }
            localStorage.setItem('face2face', JSON.stringify(commentStorage));
            notifyWorshipVideosListeners();
        });
    }

    module.getUser = function(callback){
        let midStorage = JSON.parse(localStorage.getItem('face2face'));
        send("GET", "/user/" + midStorage.userId + "/", undefined, callback);
    }

    module.checkUserLogin = function(callback){
        send("GET", "/checkSessionExists/", undefined, function(err, flag) {
            if(err) return notifyErrorListeners(err);
            return callback(flag);
        });
    }

    module.createFile = function(filename){
        send("POST", "/createFile/", {filename: filename}, function(err, res) {
            if(err) return notifyErrorListeners(err);
            notifyFilesListeners();
            window.location.replace("/ourBlog.html");
        });
    }

    module.deleteFile = function(id) {
        send("DELETE", '/deleteFile/', {id: id}, function(err, res) {
            if(err) return notifyErrorListeners(err);
            console.log(res);
            notifyFilesListeners();
        });
    }

    module.getFiles = function(callback){
        send("GET", "/files/", undefined, callback);
    }

    module.getPosts = function(fileId, callback) {
        send("GET", "/blogs/" + fileId + "/", undefined, function(err, res) {
            if(err) return notifyErrorListeners(err);
            callback(res);
        });
    }

    module.deletePost = function(fileId, postId) {
        send("DELETE", "/blogs/", {fileId: fileId, postId: postId}, function(err, res) {
            if(err) return notifyErrorListeners(err);
            window.location.replace("/ourBlog.html");
        });
    }

    let filesListeners = [];

    function notifyFilesListeners(){
        api.getFiles(function(err, files) {
            if(err) return notifyErrorListeners(err);
            filesListeners.forEach(function(listener){
                listener(files);
            });
        });
    }

    module.onFileUpdate = function(handler){
        api.getFiles(function(err, files) {
            if(err) return notifyErrorListeners(err);
            filesListeners.push(handler);
            handler(files);
        });
    };

    let userListeners = [];

    function notifyUserListeners(){
        api.getUser(function(err, user) {
            if(err) return notifyErrorListeners(err);
            userListeners.forEach(function(listener){
                listener(user);
            });
        });
    }

    module.onUserUpdate = function(handler){
        api.getUser(function(err, user) {
            if(err) return notifyErrorListeners(err);
            userListeners.push(handler);
            handler(user);
        });
    };

    let galleryListeners = [];

    function notifyGalleryListeners(){
        api.getGallery(function(err, galleries) {
            if(err) return notifyErrorListeners(err);
            galleryListeners.forEach(function(listener){
                listener(galleries);
            });
        });
    }

    module.onGelleryUpdate = function(handler){
        api.getGallery(function(err, galleries) {
            if(err) return notifyErrorListeners(err);
            galleryListeners.push(handler);
            handler(galleries);
        });
    };

    let newslettersListeners = [];

    function notifyNewslettersListeners(){
        api.getNewsletters(function(err, newsletter) {
            if(err) return notifyErrorListeners(err);
            newslettersListeners.forEach(function(listener){
                listener(newsletter);
            });
        });
    }

    module.onNewslettersUpdate = function(handler){
        api.getNewsletters(function(err, newsletter) {
            if(err) return notifyErrorListeners(err);
            newslettersListeners.push(handler);
            handler(newsletter);
        });
    };

    let worshipVideosListeners = [];

    function notifyWorshipVideosListeners(){
        api.getWorshipVideos(function(err, worshipVideo) {
            if(err) return notifyErrorListeners(err);
            worshipVideosListeners.forEach(function(listener){
                listener(worshipVideo);
            });
        });
    }

    module.onWorshipVideosUpdate = function(handler){
        api.getWorshipVideos(function(err, worshipVideo) {
            if(err) return notifyErrorListeners(err);
            worshipVideosListeners.push(handler);
            handler(worshipVideo);
        });
    };

    let errorListeners = [];
    
    function notifyErrorListeners(err){
        errorListeners.forEach(function(listener){
            listener(err);
        });
    };
    
    module.onError = function(listener){
        errorListeners.push(listener);
    };

    return module;
}());