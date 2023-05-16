let pois;
let offers;
let offersByPoi;
let htmltext;
let userPosition;
let categories;
let visibleNPois;
let visibleCPois;
let categoryFilter = 0;

//I got this from StackOverflow :)
function distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusM = 6371000;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusM * c;
}

//This too
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

//Get location of user
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(mapRecenter);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

//Prepare the offers table using ajax
function getOffersTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    offers = JSON.parse(this.response);
    markerPlacement();
  }
  xhttp.open("GET", "../src/libs/getoffers.php");
  xhttp.send();
}

//Initial marker placement
function markerPlacement() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    //Place markers
    pois = JSON.parse(this.response);
    visibleNPois = pois;
    visibleCPois = pois;
    pois.forEach(makeMarker);
    function makeMarker(poi) {
      poi["marker"] = L.marker([poi["Latitude"],poi["Longitude"]]).addTo(map);
      htmltext = "<div class=\"row\"><div class=\"col-12 col-l-12 col-m-12 col-s-12\"><table><thead><tr><h2>" + poi["Poi_Name"] + "</h2></tr>";
      //Create space for buttons
      htmltext += "<div class=\"row\"><div class=\"col-12 col-l-12 col-m-12 col-s-12 popup-button-section\" id = buttons" + poi["Poi_Id"] + "></div></div>"
      poi["popup"] = poi["marker"].bindPopup(createPopup(poi), {maxWidth: 1100, maxHeight:400}).on("popupopen", () => {
        let buttonContainer = document.getElementById("buttons" + poi["Poi_Id"]);
////////////////////////////////////////Use the correct if before sumbitting the project please :)
        //if (userPosition && distanceInMBetweenEarthCoordinates(poi["Latitude"], poi["Longitude"], userPosition.coords.latitude, userPosition.coords.longitude) <= 5) {
        if(userPosition && distanceInMBetweenEarthCoordinates(poi["Latitude"], poi["Longitude"], 38.248395, 21.738489) <= 50) {
          //Add buttons if poi within 50 meters
          let buttonContainer = document.getElementById("buttons" + poi["Poi_Id"]);
          if (poi["offerFlag"]) {
            buttonContainer.innerHTML = "<div class=\"box centeralign\"><button class=\"popupbutton\" type=\"button\" onclick=\"location.href='./rating.php?poiId=" + poi["Poi_Id"] + "'\">Αξιολόγηση</button><button class=\"popupbutton\" type=\"button\" onclick=\"location.href='./addOffer.php?poiId=" + poi["Poi_Id"] + "'\">Προσθήκη Προσφοράς</button></div>";
          }
          else {
            buttonContainer.innerHTML = "<div class=\"box centeralign\"><button class=\"popupbutton\" type=\"button\" onclick=\"location.href='./addOffer.php?poiId=" + poi["Poi_Id"] + "'\">Προσθήκη Προσφοράς</button></div>";
          }
        }
        else {
          buttonContainer.style.position = "absolute";
          buttonContainer.style.clip = "rect(0 0 0 0)";
        }
      });
    }
  }
  xhttp.open("GET", "../src/libs/getpoi.php");
  xhttp.send();
}

//Create the HTML code to appear on popup
function createPopup(poi){
  //Filter the offers array
  try {
    offersByPoi = offers.filter(function (element) {return element["Poi_Id"]==poi["Poi_Id"];});
  }catch(error){
    console.log(error);
  }
  if (!offersByPoi.length){
    poi["offerFlag"]=0;
    htmltext += "Καμία διαθέσιμη προσφορά."
  }
  else{
    poi["offerFlag"]=1;
    htmltext += "<tr><th>ΠΡΟΪΟΝ</th><th>ΤΙΜΗ</th><th>ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ</th><th>ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ</th><th>ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ</th><th>LIKES</th><th>DISLIKES</th><th>ΑΠΟΘΕΜΑ</th></tr></thead><tbody>";
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    offersByPoi.forEach(fillPopup);
    function fillPopup(offer){
      htmltext += "<tr><td data-label=\"ΠΡΟΪΟΝ\">" + offer["Product_Name"] + "</td><td data-label=\"ΤΙΜΗ\">" + offer["Price"] + " Ευρώ</td>";
      if (offer["Day_Check"]) {
        htmltext += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ\">ΝΑΙ</td>";
      }
      else {
        htmltext += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΜΕΡΑΣ\">ΟΧΙ</td>";
      }
      if (offer["Week_Check"]) {
        htmltext += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ\">ΝΑΙ</td>";
      }
      else {
        htmltext += "<td data-label=\"ΚΡΙΤΗΡΙΟ ΕΒΔΟΜΑΔΑΣ\">ΟΧΙ</td>";
      }
      htmltext += "<td data-label=\"ΗΜΕΡΟΜΗΝΙΑ ΚΑΤΑΧΩΡΙΣΗΣ\">" + offer["Date"] + "</td><td data-label=\"LIKES\">" + offer["Likes"] + "</td><td data-label=\"DISLIKES\">" + offer["Dislikes"] + "</td>"
      if (offer["Has_Stock"]) {
        htmltext += "<td data-label=\"ΑΠΟΘΕΜΑ\">ΝΑΙ</td></tr>";
      }
      else {
        htmltext += "<td data-label=\"ΑΠΟΘΕΜΑ\">ΟΧΙ</td></tr>";
      }
    }
    htmltext += "</tr></tbody></table></div></div>";
  }
  return htmltext;
}

//Recenter map at user location
function mapRecenter(position) {
  userPosition = position;
////////////////////////////////////////////////Use correct panTo please :)
  //map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
  map.setView(new L.LatLng(38.248395, 21.738489), 17);
  //var circle = L.circle([position.coords.latitude, position.coords.longitude], {
  var circle = L.circle([38.248395, 21.738489], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 50
  }).addTo(map);
  var circle = L.circle([38.248395, 21.738489], {
    color: 'black',
    fillColor: 'black',
    fillOpacity: 1,
    radius: 2
  }).addTo(map);
}

//Recenter map when button press
function mapRecenter1() {
////////////////////////////////////////////////////fix
  //map.panTo(new L.LatLng(userPosition.coords.latitude, userPosition.coords.longitude));
  if (userPosition) {
    map.setView(new L.LatLng(38.248395, 21.738489), 17);
  }
}

//Update the map according to user search
function searchByName(form){
  const inputValue = form.inputbox.value;
  //Group pois to show
  poisToShow = visibleCPois.filter(function (element) {return toNormalForm(element["Poi_Name"]).toLowerCase().includes(toNormalForm(inputValue).toLowerCase());});
  //Group pois to hide
  poisToHide = visibleCPois.filter(function (element) {return !toNormalForm(element["Poi_Name"]).toLowerCase().includes(toNormalForm(inputValue).toLowerCase());});
  if (categoryFilter == 1) {
    visibleNPois = pois.filter(function (element) {return toNormalForm(element["Poi_Name"]).toLowerCase().includes(toNormalForm(inputValue).toLowerCase());});
  }
  else {
    visibleNPois = poisToShow;
  }
  if (!poisToHide.length){
    nameFilter = 0;
    visibleCPois.forEach(revertColor);
    function revertColor(poi){
      poi["marker"].remove();
      poi["marker"].addTo(map);
      poi["marker"]._icon.classList.add("huechangeback");
    }
    return;
  }
  poisToShow.forEach(showMarkers);
  function showMarkers(poi){
    poi["marker"].remove();
    poi["marker"].addTo(map);
    if (poi["offerFlag"] && categoryFilter == 0){
      poi["marker"]._icon.classList.add("huechange");
    }
  }
  poisToHide.forEach(hideMarkers);
  function hideMarkers(poi){
    poi["marker"].remove();
  }
  nameFilter = 1;
}

//Function to fill the dropdown menu with the available categories
function fillCategories(){
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    categories = JSON.parse(this.response);
    let tmp = "<select name=\"category\" id=\"category\" onchange=\"chooseCategory(this.value)\"><option value=\"\" selected disabled hidden>Διάλεξε Κατηγορία</option><option id = removeFilter value =''>Αφαίρεση φίλτρου</option>"
    categories.forEach(fillForm);
    function fillForm(category){
      tmp += "<option value=" + category["Category_Id"] + ">" + category["Category_Name"] + "</option>";
    }
    tmp += "</select>";
    document.getElementById("categoryform").innerHTML = tmp;
  }
  xhttp.open("GET", "../src/libs/getMainCategories.php");
  xhttp.send();
}

//Change map according to selected category
function chooseCategory(value){
  //If no category is selected, show all
  if (value == ""){
    categoryFilter = 0;
    visibleNPois.forEach(showMarkers);
    function showMarkers(poi){
      poi["marker"].remove();
      poi["marker"].addTo(map);
    }
    visibleCPois = pois;
    return;
  }
  pois.forEach(removeAllMarkers);
  //Remove all markers from map
  function removeAllMarkers(poi){
    poi["marker"].remove();
  }
  visibleCPois = [];
  categoryOffers = offers.filter(function (element) {return element["Category_Parent_Id"]==value;});
  //Add back markers that relate to the selected category
  categoryOffers.forEach(showCategoryOffers);
  function showCategoryOffers(offer){
    let poi = visibleNPois.find(poi => poi["Poi_Id"] === offer["Poi_Id"]);
    if (poi) {
      poi["marker"].remove();
      poi["marker"].addTo(map);
    }
  }
  categoryOffers.forEach(fillVisibleCPois);
  function fillVisibleCPois(offer){
    let poi = pois.find(poi => poi["Poi_Id"] === offer["Poi_Id"]);
    if (poi) {
      if (visibleCPois.indexOf(poi) == -1) {
        visibleCPois.push(poi);
      }
    }
  }
  categoryFilter = 1;
}

//Removing greek accents
function toNormalForm(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//Responsive navbar
function responsive() {
  var x = document.getElementById("myTopnav");
  if (x.className === "row nav-bar") {
    x.className += " responsive";
  } else {
    x.className = "row nav-bar";
  }
}

//Create map
let map = L.map('map').setView([38.246445, 21.735517], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const x = document.getElementById("demo");
getLocation();

fillCategories();

getOffersTable();