let poioffers;
let offersText;
let offerText;
let poiId;

function getCurrentURL () {
    return window.location.search
}

//Prepare the offers table using ajax
function getOffersTable() {
    const url = getCurrentURL();
    const urlParams = new URLSearchParams(url);
    poiId = urlParams.get('poiId');
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        poioffers = JSON.parse(this.response);
        fillOffersTable();
    }
    xhttp.open("GET", "../src/libs/getpoioffers.php?poiId=" + poiId);
    xhttp.send();
}

function fillOffersTable() {
    offersText = "<table><h2>ΠΡΟΣΦΟΡΕΣ " + poioffers[0]["Poi_Name"] + "</h2><br><thead><tr><th>ΠΡΟΪΟΝ</th><th>ΤΙΜΗ</th><th>ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ</th><th>ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ</th><th>ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ</th><th>LIKES</th><th>DISLIKES</th><th>ΑΠΟΘΕΜΑ</th></tr></thead><tbody>";
    poioffers.forEach(fillTable);
    function fillTable(offer){
        const offerId = poioffers.indexOf(offer);
        offersText += "<tr onclick=fillAndOpenPopup(" + offerId + ")><td data-label=\"ΠΡΟΪΟΝ\">" + offer["Product_Name"] + "</td><td data-label=\"ΤΙΜΗ\">" + offer["Price"] + " Ευρώ</td>";
        if (offer["Day_Check"]) {
            offersText += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ\">ΝΑΙ</td>";
        }
        else {
            offersText += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ\">ΟΧΙ</td>";
        }
        if (offer["Week_Check"]) {
            offersText += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ\">ΝΑΙ</td>";
        }
        else {
            offersText += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ\">ΟΧΙ</td>";
        }
        offersText += "<td data-label=\"ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ\">" + offer["Date"] + "</td><td data-label=\"LIKES\">" + offer["Likes"] + "</td><td data-label=\"DISLIKES\">" + offer["Dislikes"] + "</td>"
        if (offer["Has_Stock"]) {
            offersText += "<td data-label=\"ΑΠΟΘΕΜΑ\">ΝΑΙ</td></tr>";
        }
        else {
            offersText += "<td data-label=\"ΑΠΟΘΕΜΑ\">ΟΧΙ</td></tr>";
        }
    }
    offersText += "</tr></tbody></table></div></div>";
    document.getElementById("offersTable").innerHTML = offersText;
}

//Ajax functions
function addLike(offerId, likeButton, dislikeButton) {
    $.get( "../src/libs/addlike.php", { offer_Id: offerId });
    highlightLikeButton(offerId, likeButton, dislikeButton);
}

function addDislike(offerId, likeButton, dislikeButton) {
    $.get( "../src/libs/adddislike.php", { offer_Id: offerId } );
    highlightDislikeButton(offerId, likeButton, dislikeButton);
}

function highlightLikeButton(offerId, likeButton, dislikeButton) {
    likeButton.classList.add("alreadyLiked");
    likeButton.onclick = function () { removeLike(offerId, likeButton , dislikeButton) };
    dislikeButton.onclick = function () { removeLikeAndAddDislike(offerId, likeButton , dislikeButton) };
}

function highlightDislikeButton(offerId, likeButton, dislikeButton) {
    dislikeButton.classList.add("alreadyDisliked");
    dislikeButton.onclick = function () { removeDislike(offerId, likeButton , dislikeButton) };
    likeButton.onclick = function () { removeDislikeAndAddLike(offerId, likeButton , dislikeButton) };
}

function removeLike(offerId, likeButton, dislikeButton) {
    $.get( "../src/libs/removelike.php", { offer_Id: offerId } );
    unhighlightLikeButton(offerId, likeButton, dislikeButton);
}

function removeDislike(offerId, likeButton, dislikeButton) {
    $.get( "../src/libs/removedislike.php", { offer_Id: offerId } );
    unhighlightDislikeButton(offerId, likeButton, dislikeButton);
}

function unhighlightLikeButton(offerId, likeButton, dislikeButton) {
    likeButton.classList.remove("alreadyLiked");
    likeButton.onclick = function () { addLike(offerId, likeButton , dislikeButton) };
    dislikeButton.onclick = function () { addDislike(offerId, likeButton , dislikeButton) };
}

function unhighlightDislikeButton(offerId, likeButton, dislikeButton) {
    dislikeButton.classList.remove("alreadyDisliked");
    dislikeButton.onclick = function () { addDislike(offerId, likeButton , dislikeButton) };
    likeButton.onclick = function () { addLike(offerId, likeButton , dislikeButton) };
}

function removeLikeAndAddDislike(offerId, likeButton, dislikeButton) {
    removeLike(offerId, likeButton, dislikeButton);
    addDislike(offerId, likeButton, dislikeButton);
}

function removeDislikeAndAddLike(offerId, likeButton, dislikeButton) {
    removeDislike(offerId, likeButton, dislikeButton);
    addLike(offerId, likeButton, dislikeButton);
}

function swapStock(offerId, hasStock) {
    $.get( "../src/libs/swapStock.php", { offer_Id: offerId } );
}

function fillAndOpenPopup(offer) {
    const offerElement = poioffers[offer];
    offerText = "<a class=\"close\" href=\"#\"></a><br><table><h2></h2><br><thead><tr><th>ΠΡΟΪΟΝ</th><th>ΤΙΜΗ</th><th>ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ</th><th>ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ</th><th>ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ</th><th>LIKES</th><th>DISLIKES</th><th>ΑΠΟΘΕΜΑ</th></tr></thead><tbody>";
    offerText += "<tr><td data-label=\"ΠΡΟΪΟΝ\">" + offerElement["Product_Name"] + "</td><td data-label=\"ΤΙΜΗ\">" + offerElement["Price"] + " Ευρώ</td>";
    if (offerElement["Day_Check"]) {
        offerText += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ\">ΝΑΙ</td>";
    }
    else {
        offerText += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ\">ΟΧΙ</td>";
    }
    if (offerElement["Week_Check"]) {
        offerText += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ\">ΝΑΙ</td>";
    }
    else {
        offerText += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ\">ΟΧΙ</td>";
    }
    offerText += "<td data-label=\"ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ\">" + offerElement["Date"] + "</td><td data-label=\"LIKES\">" + offerElement["Likes"] + "</td><td data-label=\"DISLIKES\">" + offerElement["Dislikes"] + "</td>"
    if (offerElement["Has_Stock"]) {
        offerText += "<td data-label=\"ΑΠΟΘΕΜΑ\">ΝΑΙ</td></tr>";
    }
    else {
        offerText += "<td data-label=\"ΑΠΟΘΕΜΑ\">ΟΧΙ</td></tr>";
    }
    offerText += "</tr></tbody></table>";

    offerText += "<br><div class=\"col-6 col-m-6 col-s-12\"><table><thead><tr><th>ΟΝΟΜΑ ΧΡΗΣΤΗ</th><th>ΣΥΝΟΛΙΚΟ ΣΚΟΡ ΧΡΗΣΤΗ</th></tr></thead><tbody><tr><td data-label=\"ΟΝΟΜΑ ΧΡΗΣΤΗ\">" + offerElement["Username"] + "</td><td data-label=\"ΣΥΝΟΛΙΚΟ ΣΚΟΡ ΧΡΗΣΤΗ\">" + offerElement["Global_Score"] + "</td></tr></tbody></table></div>";

    offerText += "<div class=\"col-6 col-m-6 col-s-12\"><img class=\"productImg\" src=\"" + offerElement["Product_Image"] + "\" alt=\"Εικόνα προϊόντος προσωρινά μη διαθέσιμη\"></div>";

    offerText += "<div class=\"col-6 col-m-6 col-s-6\"><button class=\"popupbutton like\" type=\"button\" id=\"likeButton\"><img class=\"ratingimage\" src=\"../src/like.png\" alt=\"Like\"/></button><button class=\"popupbutton dislike\" type=\"button\" id=\"dislikeButton\"><img class=\"ratingimage\" src=\"../src/dislike.png\" alt=\"Dislike\"/></button></div>";

    offerText += "<div class=\"col-6 col-m-6 col-s-6\"><button class=\"popupbutton\" type=\"button\" id=\"stockButton\">Εκτός αποθέματος</button></div>";

    document.getElementById("offerDetails").innerHTML = offerText;

    const offerId = offerElement['Offer_Id'];

    //Begin like/dislike and stock button management
    const likeButton = document.getElementById("likeButton");
    const dislikeButton = document.getElementById("dislikeButton");

    document.getElementById("stockButton").onclick = function () { 
        if (offerElement['Has_Stock']) {
            offerElement['Has_Stock'] = !offerElement['Has_Stock'];
            document.getElementById("stockButton").innerHTML = "Σε απόθεμα";
        }
        else {
            offerElement['Has_Stock'] = !offerElement['Has_Stock'];
            document.getElementById("stockButton").innerHTML = "Εκτός αποθέματος";
        }
        swapStock(offerId, offerElement['Has_Stock']);
    };

    if (!offerElement['Has_Stock']) {
        document.getElementById("stockButton").innerHTML = "Σε απόθεμα";
        document.getElementById("likeButton").disabled = true;
        document.getElementById("likeButton").classList.add('outOfStock');
        document.getElementById("dislikeButton").disabled = true;
        document.getElementById("dislikeButton").classList.add('outOfStock');
    }

    //Manage if user already likes the offer
    if (offerElement['User_Likes']) {
        highlightLikeButton(offerId, likeButton, dislikeButton);
    }
    else {
        likeButton.onclick = function () { addLike(offerId, likeButton , dislikeButton) };
        //Manage if user already dislikes the offer
        if (offerElement['User_Dislikes']) {
            highlightDislikeButton(offerId, likeButton, dislikeButton);
        }
        else {
            dislikeButton.onclick = function () { addDislike(offerId, likeButton , dislikeButton) };
        }
    }

    window.location='#offerPopup';
}

getOffersTable();