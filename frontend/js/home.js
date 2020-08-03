// const { AuthPlus } = require("googleapis/build/src/googleapis");
(function(){
    "use strict";
    window.onload = function() {
        api.onError(function(err){
            document.getElementById('errorBox').innerHTML = `
            <div class="alert alert-primary alert-dismissible fade show" role="alert" id="errorBox">
                ${err}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `;
        });

        api.userAuthorized(function(authorized) {
            document.getElementById("titleBar").innerHTML = '';
            document.getElementById("titleBar").innerHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle mx-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        About Us
                    </a>
                    <div class="dropdown-menu animate slideIn">
                        <a class="dropdown-item nav-link text-muted" href="../aboutUs.html">Our Team</a>
                        <a class="dropdown-item nav-link text-muted" href="../ourBelieve.html">Our Beliefs</a>
                        <a class="dropdown-item nav-link text-muted" href="../ourGallery.html">Our Gallery</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Worship Resource
                    </a>
                    <div class="dropdown-menu animate slideIn">
                        <a class="dropdown-item nav-link text-muted" href="../newsletters.html">Newsletter</a>
                        <a class="dropdown-item nav-link text-muted" href="../worshipVideo.html">Worship Videos</a>
                    </div>
                </li>
                <li class="nav-item" id="login"><a class="nav-link js-scroll-trigger" href="../login.html">Log in</a></li>
            `;
            if(authorized){
                // document.getElementById("login").style.visibility = 'hidden';
                document.getElementById("login").parentNode.removeChild(document.getElementById("login"));
                let elmt = document.createElement('li');
                elmt.className = "nav-item";
                elmt.innerHTML = `
                    <a class="nav-link js-scroll-trigger" id="signout">Sign Out</a>
                `;
                document.getElementById("titleBar").append(elmt);

                // <img src="../assets/img/example.jpg" class="rounded-circle profileImgSize" alt=""></img>

                // <span style="font-size: 17px; color: Dodgerblue;">
                //     <i class="fal fa-user fa-2x profileImgSize"></i>
                // </span>

                elmt = document.createElement('li');
                elmt.className = "nav-item dropdown";
                elmt.innerHTML = `
                <a class="nav-link navbar-brand dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="userImageArea">
                    
                </a>
                <div class="dropdown-menu animate slideIn">
                    <h5 class="dropdown-item nav-link text-dark" id="username"> ${api.getUsername()} </h5>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item nav-link text-muted" href="../editProfile.html">Edit Profile</a>
                </div>
                `;
                document.getElementById("titleBar").append(elmt);
                document.getElementById("signout").addEventListener('click', function(e) {
                    e.preventDefault();
                    api.signOut();
                });
            }
        });

        api.checkUserLogin(function(flag) {
            if(flag === "true") {
                api.onUserUpdate(function(user){
                    document.getElementById("userImageArea").innerHTML = '';
                    document.getElementById("username").innerHTML = '';
                    
                    if(user.userImage.filepath === 'none'){
                        document.getElementById("userImageArea").innerHTML = `
                        <span style="font-size: 30px; color: Dodgerblue;">
                            <i class="fal fa-user"></i>
                        </span>
                        `;
                    } else {
                        document.getElementById("userImageArea").innerHTML = `
                        <img class="rounded-circle profileImgSize" src="../${user.userImage.filepath}">
                        `;
                    }

                    document.getElementById("username").innerHTML = user.username;
                });
            }
        });
    };
}());