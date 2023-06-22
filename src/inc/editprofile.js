let userStats;
let userOffers;
let userLikes;
let offersText;
let likesText;


//Get the user's score and tokens via ajax
function getScoreAndTokens() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      userStats = JSON.parse(this.response);
      updateScoreAndTokens();
    }
    xhttp.open("GET", "../src/libs/getscoreandtokens.php");
    xhttp.send();
}

function updateScoreAndTokens(){
    document.getElementById("monthlyScore").innerHTML = "Μηνιαίο <br>Σκορ: <p>" + userStats[0]['Monthly_Score'] + "</p>";
    document.getElementById("globalScore").innerHTML = "Συνολικό <br>Σκορ: <p>" + userStats[0]['Global_Score'] + "</p>";
    document.getElementById("monthlyTokens").innerHTML = "Μηνιαίοι <br>Πόντοι: <p>" + userStats[0]['Monthly_Tokens'] + "</p>";
    document.getElementById("globalTokens").innerHTML = "Συνολικοί <br>Πόντοι: <p>" + userStats[0]['Global_Tokens'] + "</p>";
}

function getUserOffers() {
  const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      userOffers = JSON.parse(this.response);
      fillPopup();
    }
    xhttp.open("GET", "../src/libs/getuseroffers.php");
    xhttp.send();
}

function fillPopup() {
  var popup = document.getElementById("offerHistory");
  //Αν δεν υπάρχουν προσφορές από αυτό το χρήστη
  if (!userOffers.length){
    offersText = "<a class=\"close\" href=\"#\"></a><br><table><h2>ΙΣΤΟΡΙΚΟ ΠΡΟΣΦΟΡΩΝ</h2></table><br>Δεν έχετε υποβάλει καμία προσφορά.";
  }
  //Αν υπάρχουν προσφορές
  else {
    offersText = "<a class=\"close\" href=\"#\"></a><br><table><h2>ΙΣΤΟΡΙΚΟ ΠΡΟΣΦΟΡΩΝ</h2><br><thead><tr><th>ΚΑΤΑΣΤΗΜΑ</th><th>ΠΡΟΪΟΝ</th><th>ΚΑΤΗΓΟΡΙΑ ΠΡΟΪΟΝΤΟΣ</th><th>ΤΙΜΗ</th><th>ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ</th><th>ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ</th><th>ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ</th><th>LIKES</th><th>DISLIKES</th><th>ΠΡΟΣΦΟΡΑ ΕΝΕΡΓΗ</th><th>ΑΠΟΘΕΜΑ</th></tr></thead><tbody>";
    userOffers.forEach(fillTable);
    function fillTable(offer){
      offersText += "<tr><td data-label=\"ΚΑΤΑΣΤΗΜΑ\">" + offer["Poi_Name"] + "</td><td data-label=\"ΠΡΟΪΟΝ\">" + offer["Product_Name"] + "</td><td data-label=\"ΚΑΤΗΓΟΡΙΑ ΠΡΟΪΟΝΤΟΣ\">" + offer["Category_Name"] + "</td><td data-label=\"ΤΙΜΗ\">" + offer["Price"] + " Ευρώ</td>";
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
      offersText += "<td data-label=\"ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ\">" + offer["Date"] + "</td><td data-label=\"LIKES\">" + offer["Likes"] + "</td><td data-label=\"DISLIKES\">" + offer["Dislikes"] + "</td>";
      if (offer["Is_Active"]) {
        if (offer["Has_Stock"]) {
          offersText += "<td data-label=\"ΠΡΟΣΦΟΡΑ ΕΝΕΡΓΗ\">ΝΑΙ</td><td data-label=\"ΑΠΟΘΕΜΑ\">ΝΑΙ</td></tr>";
        }
        else {
          offersText += "<td data-label=\"ΠΡΟΣΦΟΡΑ ΕΝΕΡΓΗ\">ΝΑΙ</td><td data-label=\"ΑΠΟΘΕΜΑ\">ΟΧΙ</td></tr>";
        }
      }
      else {
        offersText += "<td data-label=\"ΠΡΟΣΦΟΡΑ ΕΝΕΡΓΗ\">ΟΧΙ</td><td data-label=\"ΑΠΟΘΕΜΑ\">X</td></tr>";
      }
    }
    offersText += "</tbody></table>";
  }
  popup.innerHTML = offersText;
}

function getLikesDislikes() {
  const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      userLikes = JSON.parse(this.response);
      fillPopup2();
    }
    xhttp.open("GET", "../src/libs/getlikesdislikes.php");
    xhttp.send();
}

function fillPopup2 () {
  var popup = document.getElementById("likesDislikes");
  //Αν δεν υπάρχουν Likes/Dislikes απο το χρήστη
  if (!userLikes.length){
    likesText = "<a class=\"close\" href=\"#\"></a><br><table><h2>ΙΣΤΟΡΙΚΟ LIKES/DISLIKES</h2></table><br>Δεν έχετε κάνει κανένα Like/Dislike.";
  }
  //Αν υπάρχουν 
  else {
    likesText = "<a class=\"close\" href=\"#\"></a><br><table><h2>ΙΣΤΟΡΙΚΟ LIKES/DISLIKES</h2><br><thead><tr><th>ΚΑΤΑΣΤΗΜΑ</th><th>ΠΡΟΪΟΝ</th><th>ΚΑΤΗΓΟΡΙΑ ΠΡΟΪΟΝΤΟΣ</th><th>ΤΙΜΗ</th><th>ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ</th><th>LIKE/DISLIKE</th><th>ΠΡΟΣΦΟΡΑ ΕΝΕΡΓΗ</th><th>ΑΠΟΘΕΜΑ</th></tr></thead><tbody>";
    userLikes.forEach(fillTable);

    function fillTable(offer){
      likesText += "<tr><td data-label=\"ΚΑΤΑΣΤΗΜΑ\">" + offer["Poi_Name"] + "</td><td data-label=\"ΠΡΟΪΟΝ\">" + offer["Product_Name"] + "</td><td data-label=\"ΚΑΤΗΓΟΡΙΑ ΠΡΟΪΟΝΤΟΣ\">" + offer["Category_Name"] + "</td><td data-label=\"ΤΙΜΗ\">" + offer["Price"] + "</td><td data-label=\"ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ\">" + offer["Date"] + "</td>";
      if (offer["Is_Positive"]) {
        likesText += "<td data-label=\"LIKE/DISLIKE\">Like</td>";
      }
      else {
        likesText += "<td data-label=\"LIKE/DISLIKE\">Dislike</td>";
      }
      if (offer["Is_Active"]) {
        if (offer["Has_Stock"]) {
          likesText += "<td data-label=\"ΠΡΟΣΦΟΡΑ ΕΝΕΡΓΗ\">ΝΑΙ</td><td data-label=\"ΑΠΟΘΕΜΑ\">ΝΑΙ</td></tr>";
        }
        else {
          likesText += "<td data-label=\"ΠΡΟΣΦΟΡΑ ΕΝΕΡΓΗ\">ΝΑΙ</td><td data-label=\"ΑΠΟΘΕΜΑ\">ΟΧΙ</td></tr>";
        }
      }
      else {
        likesText += "<td data-label=\"ΠΡΟΣΦΟΡΑ ΕΝΕΡΓΗ\">ΟΧΙ</td><td data-label=\"ΑΠΟΘΕΜΑ\">X</td></tr>";
      }
    }
    likesText += "</tbody></table>";
  }
  popup.innerHTML = likesText;
}

getScoreAndTokens();

getUserOffers();

getLikesDislikes();