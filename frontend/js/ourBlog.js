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

        document.getElementById("newFile").addEventListener('submit', function(e) {
            e.preventDefault();
            let fileName = document.getElementById("fileName").value;
            document.getElementById('newFile').reset();
            console.log(fileName.length);
            if(fileName.length < 15) {
                api.createFile(fileName);
            } else {
                document.getElementById('filenameError').innerHTML = `
                    <div class="alert alert-primary alert-dismissible fade show" role="alert" id="errorBox">
                        Please enter less than <strong> 15 </string> character.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `;
            }
        });

        api.onFileUpdate(function(files) {
            document.getElementById("fileList").innerHTML = '';
            document.getElementById("blogUploadForm").innerHTML = '';
            document.getElementById("blogArea").innerHTML = '';

            if(files.length === 0) {
                document.getElementById("fileList").innerHTML = `
                <small class="form-text text-muted pl-2">There is no file.</small>
                `;
            }
            if(document.getElementById("blogArea").innerHTML === "") {
                document.getElementById("blogArea").innerHTML = `
                <small class="form-text text-muted pl-2">No Blog is selected.</small>
                `;
            }
            
            files.forEach(function(file){
                let blogLength = file.posts.length;
                let postBlogId = postBlog + file._id
                let viewBlogId = "viewBlog" + file._id;


                if(blogLength > 99) {
                    blogLength = "99+"
                }

                let elmt = document.createElement('div');
                elmt.className = "dropdown-item";
                elmt.innerHTML= `
                <i class="fal fa-folder fa-lg">
                    ${file.fileName}
                </i>
                <span class="badge badge-danger">${blogLength}</span>
                <button type="button" class="btn btn-outline-primary" data-toggle="tooltip" data-placement="top" title="View Blogs" id="${viewBlogId}">
                    <i class="far fa-eye"></i>
                </button>
                <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#postBlog" id="${postBlogId}">
                    <i class="far fa-file-plus"></i>
                </button>
                <button type="button" class="btn btn-outline-danger" data-toggle="tooltip" data-placement="top" title="Delete This File" id="${file._id}">
                    <i class="far fa-trash-alt"></i>
                </button>
                `;

                document.getElementById("fileList").append(elmt);

                api.userAdmin(function(admin){
                    if(admin){
                        document.getElementById(file._id).style.visibility = 'visible';
                        document.getElementById(postBlogId).style.visibility = 'visible';
                    } else {
                        document.getElementById(file._id).style.visibility = 'hidden';
                        document.getElementById(postBlogId).style.visibility = 'hidden';
                    }
                });
                
                document.getElementById(file._id).addEventListener('click', function(e) {
                    e.preventDefault();
                    api.deleteFile(file._id);
                });

                document.getElementById(viewBlogId).addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById("blogArea").innerHTML = '';
                    api.getPosts(file._id, function(items) {
                        items.forEach(function(item) {
                            let viewMoreId = "viewMore" + file._id;
                            let addPictureId = "morePicture" + file._id;
                            elmt = document.createElement('div');
                            elmt.className = "row pb-5";
                            elmt.innerHTML=`
                            <div class="col">
                                <img src="/blogsCoverImage/${item._id}/" class="img-fluid rounded" alt="Card image cap">
                            </div>
                            <div class="col-sm-6">
                                <div class="card-block px-2">
                                    <h5 class="card-title">${item.title}</h5>
                                    <small id="emailHelp" class="text-muted">Author: ${item.author}</small>
                                    <small id="emailHelp" class="text-muted">Date: ${item.date.split("T")[0]}</small>
                                    <hr/>
                                    <p class="card-text">${item.content}</p>
                                </div>
                            </div>
                            <div class="w-100"></div>
                            <div class="col pt-3">
                                <button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#viewImage" id=${viewMoreId}> 
                                    <i class="far fa-glasses"></i>
                                </button>
                                <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#addImage" id=${addPictureId}> 
                                    <i class="far fa-file-plus"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger" data-toggle="tooltip" data-placement="bottom" title="Delete This Blog" id=${item._id}> 
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </div>
                            `;
                            document.getElementById("blogArea").append(elmt);
                            api.userAdmin(function(admin){
                                if(admin){
                                    document.getElementById(addPictureId).style.visibility = 'visible';
                                    document.getElementById(item._id).style.visibility = 'visible';
                                } else {
                                    document.getElementById(addPictureId).style.visibility = 'hidden';
                                    document.getElementById(item._id).style.visibility = 'hidden';
                                }
                            });
                            document.getElementById(item._id).addEventListener('click', function(e) {
                                e.preventDefault();
                                api.deletePost(file._id, item._id);
                            });
                            document.getElementById(viewMoreId).addEventListener('click', function(e) {
                                e.preventDefault();
                                api.viewImages(item._id, function(res) {
                                    let first = 0;
                                    res.forEach(function(re) {
                                        elmt = document.createElement("div");
                                        if(first === 0) {
                                            elmt.className = "carousel-item active";
                                        } else {
                                            elmt.className = "carousel-item";
                                        }
                                        elmt.innerHTML=`
                                            <img src="/imageView/${re._id}/" class="img-fluid">
                                        `;
                                        document.getElementById("slideItem").append(elmt);

                                        elmt = document.createElement("li");
                                        elmt.setAttribute("data-target", "#carouselExampleIndicators");
                                        elmt.setAttribute("data-slide-to", first);
                                        if(first === 0) {
                                            elmt.className = "active";
                                        }
                                        document.getElementById("indicators").append(elmt);
                                        first ++;
                                    });
                                });
                            });
                            document.getElementById(addPictureId).addEventListener('click', function(e) {
                                e.preventDefault();
                                document.getElementById("imageAddForm").innerHTML = `
                                <form action="/postImages/${item._id}/" method="POST" enctype="multipart/form-data" id="uploadBlogInfo">
                                    <div class="form-group">
                                        <input type="file" name="addImages" required multiple>
                                        <small class="form-text text-muted pl-2">Maximum 10 images.</small>
                                    </div>
                                    <button type="submit" class="btn btn-outline-success">
                                        Add
                                        <i class="fal fa-image"></i>
                                    </button>
                                </form>
                                <div id="filenameError"></div>
                                `;
                            });
                        });
                    });
                });

                document.getElementById(postBlogId).addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById("blogUploadForm").innerHTML = `
                    <form action="/postBlog/${file._id}/" method="POST" enctype="multipart/form-data" id="uploadBlogInfo">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Blog Title</label>
                            <input type="text" class="form-control" id="title" aria-describedby="emailHelp" placeholder="Enter Title" name="title" required>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Blog Author</label>
                                    <input type="text" class="form-control" id="title" aria-describedby="emailHelp" placeholder="Enter Author" name="author" required>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Date</label>
                                    <input type="date" class="form-control" id="newsletterAuthor" placeholder="Enter Date" name="date" required>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Message Content <small class="form-text text-muted pl-2">Content must less than 50 word.</small></label>
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" maxlength="220" name="content" placeholder="Enter Content" required></textarea>
                        </div>
                        <div class="form-group">
                            <input type="file" name="blogImages" required>
                        </div>
                        <button type="submit" class="btn btn-outline-success">
                            Post
                            <i class="far fa-blog"></i>
                        </button>
                    </form>
                    <div id="filenameError"></div>
                    `;
                });
            });
        });
    };
}());