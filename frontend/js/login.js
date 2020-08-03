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

        document.getElementById("signInForm").addEventListener('submit', function(e){
            e.preventDefault();
            let password = document.getElementById("inputPassword").value;
            let email = document.getElementById("inputEmail").value;
            document.getElementById("signInForm").reset();
            
            api.login(email, password);
        });
    };
}());