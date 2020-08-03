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

        document.getElementById("signUpForm").addEventListener('submit', function(e) {
            e.preventDefault();

            let username = document.getElementById("inputUserame").value;
            let email = document.getElementById("inputEmail").value;
            let password = document.getElementById("inputPassword").value;
            let confirmPassword = document.getElementById("inputConfirmPassword").value;
            document.getElementById("signUpForm").reset();

            if(username.length < 10){
                if(password === confirmPassword) {
                    api.signUp(username, email, password);
                } else {
                    document.getElementById('errorBox').innerHTML = `
                    <div class="alert alert-primary alert-dismissible fade show" role="alert" id="errorBox">
                        <strong> Password and confirmPassword are not the same! </strong> Please check your password.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
                }
            } else {
                document.getElementById('errorBox').innerHTML = `
                <div class="alert alert-primary alert-dismissible fade show" role="alert" id="errorBox">
                    <strong> Username is too long! </strong> Please enter less than 10 letters.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `;
            }
        });
    };
}());