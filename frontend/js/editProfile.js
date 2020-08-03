(function(){
    "use strict";

    window.onload = function(){
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

        api.onUserUpdate(function(user){
            document.getElementById("userName").innerHTML = '';
            document.getElementById("userEmail").innerHTML = '';
            document.getElementById("userImageSection").innerHTML = '';

            document.getElementById("userName").innerHTML = `${user.username}`;
            document.getElementById("userEmail").innerHTML = `${user.email}`;
            if(user.userImage.filepath === 'none'){
                document.getElementById("userImageSection").innerHTML = `
                <img class="rounded-circle profileImgSize" src="../assets/img/rUserImage.png">
                `;
            } else {
                document.getElementById("userImageSection").innerHTML = `
                <img class="rounded-circle profileImgSize" src="../${user.userImage.filepath}">
                `;
            }
        });

        // document.getElementById("changeUsername").addEventListener('click', function(e) {
        //     e.preventDefault();

        // });
    };
}());