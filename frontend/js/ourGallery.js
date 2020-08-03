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

        api.userAdmin(function(admin){
            if(admin){
                let elmt = document.createElement('li');
                elmt.className = "nav-item";
                elmt.innerHTML= `
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#uploadPicture">Upload</button>
                `;
                document.getElementById("navbarMenu").append(elmt);
            }
        });


        api.onGelleryUpdate(function(galleries) {
            document.getElementById("gallery").innerHTML='';
            document.getElementById("sildes").innerHTML='';
            let index = 1;
            galleries.forEach(function(gallery){
                let elmt = document.createElement('div');
                let someId = "userPicture" + gallery._id;
                elmt.className = "mb-3 pics img-wrap";
                elmt.id = someId;
                elmt.innerHTML= `
                    <img class="img-fluid rounded mx-auto d-block" data-toggle="modal" data-target="#exampleModal" src="../ourGallery/${gallery._id}/" alt="">
                `;
                document.getElementById("gallery").append(elmt);

                elmt = document.createElement('div');
                if(index === 1){
                    elmt.className = "carousel-item active";
                } else {
                    elmt.className = "carousel-item";
                }
                elmt.innerHTML= `
                    <img class="d-block w-100" src="../ourGallery/${gallery._id}/" alt="First slide">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${gallery.title}</h5>
                        <p>${gallery.description}</p>
                    </div>
                    `;
                    document.getElementById("sildes").append(elmt);
                index ++;

                api.userAdmin(function(admin){
                    if(admin){
                        elmt = document.createElement('button');
                        elmt.className = "close delete-image";
                        elmt.id = gallery._id;
                        elmt.innerHTML = `
                        <span aria-hidden="true">&times;</span>
                        `;
                        document.getElementById(someId).append(elmt);

                        document.getElementById(gallery._id).addEventListener('click', function(e){
                            e.preventDefault();
                            api.deleteImage(gallery._id);
                        });
                    }
                });
            });
        });
    };
}());