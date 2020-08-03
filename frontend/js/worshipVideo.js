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
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Upload</button>
                `;
                document.getElementById("navbarMenu").append(elmt);
            }
        });

        api.onWorshipVideosUpdate(function(worshipVideos){
            document.getElementById("worshipVideoArea").innerHTML='';
            worshipVideos.forEach(function(worshipVideo){
                let watchWorshipVideoId = worshipVideo._id + "watchVideo";
                let elmt = document.createElement('div');
                elmt.className = "col-lg-6 mb-4";
                elmt.innerHTML= `
                <div class="card mb-4">
                    <div class="card-body">
                        <h2 class="card-title">${worshipVideo.title}</h2>
                    </div>
                    <div class="card-footer text-muted d-flex justify-content-between" id="worshipVideoDeleteArea">
                        <p>Posted on ${worshipVideo.date.split("T")[0]} by ${worshipVideo.author}</p>
                        <div id="videoOpertion">
                            <button class="btn btn-primary" data-toggle="modal" data-target="#videoModal" id="${watchWorshipVideoId}"> 
                                Watch Video
                                <span style="font-size: 1em;">
                                    <i class="fal fa-play-circle"></i>
                                </span>
                            </button>
                            <button class="btn btn-primary" id="${worshipVideo._id}">Delete</button>
                        </div>
                    </div>
                </div>
                `;
                document.getElementById("worshipVideoArea").append(elmt);
                document.getElementById(watchWorshipVideoId).addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById("videoTitle").innerHTML = `
                    <h5 class="modal-title" id="uploadWorshipVideo">${worshipVideo.title}</h5> 
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    `;
                    document.getElementById("videoDisplay").innerHTML = `
                        <iframe src="https://player.vimeo.com/video/${worshipVideo.videoId}" frameborder="0" title=${worshipVideo.title} webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                    `;
                });
                api.userAdmin(function(admin){
                    if(admin) {
                        document.getElementById(worshipVideo._id).addEventListener('click', function(e){
                            e.preventDefault();
                            api.deleteWorshipVideo(worshipVideo._id);
                        });
                    } else {
                        document.getElementById(worshipVideo._id).parentNode.removeChild(document.getElementById(worshipVideo._id));
                    } 
                });
            });
        });

        document.getElementById('worshipVideoPrev').addEventListener('click', function(e){
            e.preventDefault();
            api.worshipVideosPreviousPage();
        });

        document.getElementById('worshipVideoNext').addEventListener('click', function(e){
            e.preventDefault();
            api.worshipVideosNextPage();
        });

        document.getElementById('searchWorshipVideo').addEventListener('submit', function(e){
            e.preventDefault();
            let searchOption = document.getElementById('formControlSelect').value; 
            let searchInfo = document.getElementById('videoInfo').value;
            document.getElementById('searchWorshipVideo').reset();
            api.searchWorshipVideos(searchInfo, searchOption, function(searchItems){
                document.getElementById("worshipVideoArea").innerHTML='';

                searchItems.forEach(function(searchItem){
                    let watchWorshipVideoId = searchItem._id + "watchVideo";
                    let elmt = document.createElement('div');
                    elmt.className = "col-lg-6 mb-4";
                    elmt.innerHTML= `
                    <div class="card mb-4">
                        <div class="card-body">
                            <h2 class="card-title">${searchItem.title}</h2>
                        </div>
                        <div class="card-footer text-muted d-flex justify-content-between" id="worshipVideoDeleteArea">
                            <p>Posted on ${searchItem.date.split("T")[0]} by ${searchItem.author}</p>
                            <div id="videoOpertion">
                                <button class="btn btn-primary" data-toggle="modal" data-target="#videoModal" id="${watchWorshipVideoId}"> 
                                    Watch Video
                                    <span style="font-size: 1em;">
                                        <i class="fal fa-play-circle"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    `;
                    document.getElementById("worshipVideoArea").append(elmt);
                    document.getElementById(watchWorshipVideoId).addEventListener('click', function(e) {
                        e.preventDefault();
                        document.getElementById("videoTitle").innerHTML = `
                        <h5 class="modal-title" id="uploadWorshipVideo">${searchItem.title}</h5> 
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                        `;
                        document.getElementById("videoDisplay").innerHTML = `
                            <iframe src="https://player.vimeo.com/video/${searchItem.videoId}" frameborder="0" title=${searchItem.title} webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                        `;
                    });
                });
            });
            document.getElementById('searchNav').insertAdjacentHTML('afterend',
            `<li class="nav-item"> 
                <a class="nav-link" href="javascript:window.location.reload(false)"> Finish Search </a>
            </li>`);
            document.getElementById("searchNav").parentNode.removeChild(document.getElementById("searchNav"));
        });
    };
}());