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

            if(files.length === 0) {
                document.getElementById("fileList").innerHTML = `
                <small class="form-text text-muted pl-2">There is no file.</small>
                `;
            }
            
            files.forEach(function(file){
                let blogLength = file.posts.length;
                let postBlogId = postBlog + file._id
                if(blogLength > 99) {
                    blogLength = "99+"
                }

                let elmt = document.createElement('div');
                elmt.className = "dropdown-item";
                // elmt.href = "/getBlogs/" + file._id + "/";
                elmt.innerHTML= `
                <i class="fal fa-folder fa-lg">
                    ${file.fileName}
                </i>
                <span class="badge badge-danger">${blogLength}</span>
                <button type="button" class="btn btn-outline-primary" data-toggle="tooltip" data-placement="top" title="View Blogs">
                    <i class="far fa-eye"></i>
                </button>
                <span data-toggle="tooltip" data-placement="top" title="Post A Blog">
                    <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#postBlog" id="${postBlogId}">
                        <i class="far fa-file-plus"></i>
                    </button>
                </span>
                <button type="button" class="btn btn-outline-danger" data-toggle="tooltip" data-placement="top" title="Delete This File" id="${file._id}">
                    <i class="far fa-trash-alt"></i>
                </button>
                `;
                document.getElementById("fileList").append(elmt);
                
                document.getElementById(file._id).addEventListener('click', function(e) {
                    e.preventDefault();
                    api.deleteFile(file._id);
                });

                document.getElementById(postBlogId).addEventListener('click', function(e) {
                    e.preventDefault();
                    // document.getElementById("uploadBlogInfo").action = "/postBlog/" + file._id + "/";
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
                            <label for="exampleInputEmail1">Message Content</label>
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="content" placeholder="Enter Content" required></textarea>
                        </div>
                        <div class="form-group">
                            <input type="file" name="blogImages" multiple required>
                            <small id="emailHelp" class="form-text text-muted">You can choice more than one picture.</small>
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