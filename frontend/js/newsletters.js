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

        api.onNewslettersUpdate(function(newsletters){
            document.getElementById("newslettersArea").innerHTML='';
            newsletters.forEach(function(newsletter){
                let elmt = document.createElement('div');
                elmt.className = "card mb-4";
                elmt.innerHTML= `
                <div class="card-body">
                    <h2 class="card-title">${newsletter.title}</h2>
                    <p class="card-text">${newsletter.description}</p>
                    <a href="/newsletter/${newsletter._id}/" class="btn btn-primary">Read More &rarr;</a>
                    <button class="btn btn-primary" id="${newsletter._id}">Delete</button>
                </div>
                <div class="card-footer text-muted">
                    Posted on ${newsletter.date.split("T")[0]} by ${newsletter.author}
                </div>
                `;
                document.getElementById("newslettersArea").append(elmt);
                document.getElementById(newsletter._id).addEventListener('click', function(e){
                    e.preventDefault();
                    api.deleteNewsletter(newsletter._id);
                });

                api.userAdmin(function(admin){
                    if(admin) {
                        document.getElementById(newsletter._id).style.visibility = 'visible';
                    } else {
                        document.getElementById(newsletter._id).style.visibility = 'hidden';
                    } 
                });
            });
        });

        document.getElementById('newsletterPrev').addEventListener('click', function(e){
            e.preventDefault();
            api.newslettersPreviousPage();
        });

        document.getElementById('newsletterNext').addEventListener('click', function(e){
            e.preventDefault();
            api.newslettersNextPage();
        });

        document.getElementById('searchNewsletters').addEventListener('submit', function(e){
            e.preventDefault();
            let searchOption = document.getElementById('formControlSelect').value; 
            let searchInfo = document.getElementById('newsletterInfo').value;
            document.getElementById('searchNewsletters').reset();
            api.searchNewsletters(searchInfo, searchOption, function(searchItems){
                document.getElementById("newslettersArea").innerHTML='';

                searchItems.forEach(function(searchItem){
                    let elmt = document.createElement('div');
                    elmt.className = "card mb-4";
                    elmt.innerHTML= `
                    <div class="card-body">
                        <h2 class="card-title">${searchItem.title}</h2>
                        <p class="card-text">${searchItem.description}</p>
                        <a href="/newsletter/${searchItem._id}/" class="btn btn-primary">Read More &rarr;</a>
                        <button class="btn btn-primary" id="${searchItem._id}">Delete</button>
                    </div>
                    <div class="card-footer text-muted">
                        Posted on ${searchItem.date.split("T")[0]} by ${searchItem.author}
                    </div>
                    `;
                    document.getElementById("newslettersArea").append(elmt);
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