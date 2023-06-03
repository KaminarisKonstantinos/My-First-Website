let categories;
let mainCategories;
let subcategories;
let avgPriceTable;
let activeOffers;
const ctx = document.getElementById('line-chart');
const chartPlaceholder = document.getElementById("chartPlaceholder");
let myChart;
const today = new Date().getDate() - 1;
let data;
let startDate = new Date();
console.log(startDate);
let diffTable = [];

function getCategories() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      categories = JSON.parse(this.response);
      mainCategories = categories.filter(function (element) {return element["Category_Parent_Id"]=="NULL";});
      fillCategories();
    }
    xhttp.open("GET", "../src/libs/getcategories.php");
    xhttp.send();
}

//Function to fill the dropdown menu with the available categories
function fillCategories(){
    let tmp = "<select name=\"category\" id=\"category\" onchange=\"chooseCategory(this.value)\"><option value=\"\" selected disabled hidden>Διάλεξε Κατηγορία</option>"
    mainCategories.forEach(fillForm);
    function fillForm(category){
        tmp += "<option value=" + category["Category_Id"] + ">" + category["Category_Name"] + "</option>";
    }
    tmp += "</select>";
    document.getElementById("categoryform").innerHTML = tmp;
}

function fillSubcategories(value) {
    let tmp = "<select name='subcategory' class='subcategory' onchange='chooseSubcategory(this.value);'><option value='' selected hidden>Διάλεξε Υποκατηγορία</option>";
    subcategories = categories.filter(function (element) {return element["Category_Parent_Id"]==value;});
    subcategories.forEach(makeOption);
    function makeOption(category){
        tmp += "<option value=" + category["Category_Id"] + ">" + category["Category_Name"] + "</option>";
    }
    tmp += "</select>";
    document.getElementById("subcategoryForm").innerHTML = tmp;
}

//Change chart according to selected category
function chooseCategory(value){
    //If no category is selected, do nothing
    if (value == ""){
      return;
    }
    fillSubcategories(value);    
    drawChart(value, 1);
}

function chooseSubcategory(value) {
    drawChart(value, 0);
}

function getPreviousMonday()
{
    var prevMonday = Object.assign(new Date(), startDate);
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    return prevMonday;
}

function sixDaysBeforePreviousMonday() {
    var sixDaysBeforePreviousMonday = Object.assign(new Date(), startDate);
    sixDaysBeforePreviousMonday.setDate(sixDaysBeforePreviousMonday.getDate() - (sixDaysBeforePreviousMonday.getDay() + 6) % 7);
    sixDaysBeforePreviousMonday.setDate(sixDaysBeforePreviousMonday.getDate() - 6);
    return sixDaysBeforePreviousMonday;
}

function getNextSunday() {
    var nextSunday = Object.assign(new Date(), startDate);
    nextSunday.setDate(nextSunday.getDate() - (nextSunday.getDay() + 6) % 7);
    nextSunday.setDate(nextSunday.getDate() + 6);
    return nextSunday;
}

function modifyDate(date) {
    return date.toJSON().slice(0, 10);
}

function goBackOneWeek() {
    startDate.setDate(startDate.getDate() - 7);
}

function goForwardOneWeek() {
    startDate.setDate(startDate.getDate() + 7);
}

function fillData(category, isParent) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        avgPriceTable = JSON.parse(this.response);
        console.log(avgPriceTable);
        getActiveOffers(category, isParent);
    }
    xhttp.open("GET", "../src/libs/getAverageDiscount.php?startDate=" + modifyDate(getPreviousMonday()) + "&categoryId="+category+"&isParent=" + isParent);
    xhttp.send();
}

function getActiveOffers(category, isParent) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        activeOffers = JSON.parse(this.response);
        console.log(activeOffers);
        calcDiff();
    }
    xhttp.open("GET", "../src/libs/getActiveOffers.php?startDate=" + modifyDate(sixDaysBeforePreviousMonday()) + "&endDate=" + modifyDate(getNextSunday()) + "&categoryId=" + category + "&isParent=" + isParent);
    xhttp.send();
}

function calcDiff() {
    let avgPriceDict = Object.assign({}, ...avgPriceTable.map((x) => ({[x.Product_Id]: x.AvgPrice})));
    console.log(avgPriceDict);
    //initialize the diffTable array
    for (let d = getPreviousMonday(); d <= getNextSunday(); d.setDate(d.getDate() + 1)) {
        let tmp = new Object();
        tmp.date = new Date(d).getDate();
        tmp.value = [];
        diffTable.push(tmp);
    }
    //transform diffTable into diffDict
    let diffDict = Object.assign({}, ...diffTable.map((x) => ({[x.date]: x.value})));
    console.log(diffDict);
    for (let d = getPreviousMonday(); d <= getNextSunday(); d.setDate(d.getDate() + 1)) {
        activeOffers.forEach(minusAvg);
        function minusAvg(offer) {
            diffDict[d.getDate()].push(avgPriceDict[offer.Product_Id]-offer.Price);
        }
    }
    console.log(diffDict);
    //let diffs = map();
}

function drawChart(category, isParent) {
    if(myChart!=null){
        myChart.destroy();
    }
    fillData(category, isParent);
    const config = {
        type: 'line',
        data: {
            /*labels: offersPerDayModified.map(row => row.date),
            datasets: [{ 
                data: offersPerDayModified.map(row => row.value),
                label: "Ενεργές προσφορές",
                borderColor: "#3e95cd",
                fill: false
                }
            ],*/
            lineAtIndex: today
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: 6,
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Πλήθος ενεργών προσφορών ανά ημέρα (' + ')'//selectedMonth + ' ' + selectedYear + ')'
            },
        }
    };
    chartPlaceholder.style.display='none';
    myChart = new Chart(ctx, config);
}

getCategories();