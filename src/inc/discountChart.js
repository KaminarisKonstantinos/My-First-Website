let categories;
let mainCategories;
let subcategories;
let avgPriceTable;
let activeOffers;
const ctx = document.getElementById('line-chart');
const chartPlaceholder = document.getElementById("chartPlaceholder");
const backButton = document.getElementById('back');
const forwardButton = document.getElementById('forward');
let myChart = null;
const today = new Date().getDate();
let startDate = new Date();
let diffTable = [];
let indexLookUp = [];
//remember active user selections
let activeCategory;
let activeIsParent;

function getCategories() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      categories = JSON.parse(this.response);
      // filter only parent categories
      mainCategories = categories.filter(function (element) {return element["Category_Parent_Id"]=="NULL";});
      fillCategories();
      backButton.addEventListener("click", () => {
        goBackOneWeek();
      });
      forwardButton.addEventListener("click", () => {
        goForwardOneWeek();
      });
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

//Function to fill the dropdown menu with the available subcategories
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
    activeCategory = value;
    activeIsParent = 1;
    getAveragePrices(value, 1);
}

//Change chart according to selected subcategory
function chooseSubcategory(value) {
    activeCategory = value;
    activeIsParent = 0;
    getAveragePrices(value, 0);
}

// returns most recent monday
function getPreviousMonday()
{
    let prevMonday = new Date(startDate);
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    return prevMonday;
}

// returns the day that was 6 days before the most recent monday to help with database search
function sixDaysBeforePreviousMonday() {
    let sixDaysBeforePreviousMonday = getPreviousMonday();
    sixDaysBeforePreviousMonday.setDate(sixDaysBeforePreviousMonday.getDate() - 6);
    return sixDaysBeforePreviousMonday;
}

// returns the sunday that follows most recent monday
function getNextSunday() {
    let nextSunday = getPreviousMonday();
    nextSunday.setDate(nextSunday.getDate() + 6);
    return nextSunday;
}

// returns a date in database-query-friendly format
function modifyDate(date) {
    return date.toJSON().slice(0, 10);
}

function goBackOneWeek() {
    startDate.setDate(startDate.getDate() - 7);
    getAveragePrices(activeCategory, activeIsParent);

}

function goForwardOneWeek() {
    startDate.setDate(startDate.getDate() + 7);
    getAveragePrices(activeCategory, activeIsParent);
}

// returns the average prices for all products of a given category during the selected week
function getAveragePrices(category, isParent) {
    // activate or deactivate the bottom buttons according to which week is shown
    backButton.classList.remove("disabled");
    backButton.removeAttribute("disabled");
    if (startDate.toDateString() == new Date().toDateString()) {
        forwardButton.classList.add("disabled");
        forwardButton.setAttribute("disabled", true);
    }
    else {
        forwardButton.classList.remove("disabled");
        forwardButton.removeAttribute("disabled");
    }
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        avgPriceTable = JSON.parse(this.response);
        getActiveOffers(category, isParent);
    }
    xhttp.open("GET", "../src/libs/getAverageDiscount.php?startDate=" + modifyDate(getPreviousMonday()) + "&categoryId="+category+"&isParent=" + isParent);
    xhttp.send();
}

// returns all active offers during a given time period (week) that includes products from the selected category
function getActiveOffers(category, isParent) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        activeOffers = JSON.parse(this.response);
        createData();
    }
    xhttp.open("GET", "../src/libs/getActiveOffers.php?startDate=" + modifyDate(sixDaysBeforePreviousMonday()) + "&endDate=" + modifyDate(getNextSunday()) + "&categoryId=" + category + "&isParent=" + isParent);
    xhttp.send();
}

// 
function createData() {
    // transform the avgPriceTable into a dictionary
    let avgPriceDict = Object.assign({}, ...avgPriceTable.map((x) => ({[x.Product_Id]: x.AvgPrice})));
    //initialize the diffTable array
    diffTable = [];
    indexLookUp = [];
    let index = 0;
    for (let d = getPreviousMonday(); d <= getNextSunday(); d.setDate(d.getDate() + 1)) {
        let tmp = new Object();
        indexLookUp.push(new Date(d).getDate());
        tmp.index = index;
        tmp.date = new Date(d).getDate();
        tmp.value = [];
        diffTable.push(tmp);
        index++;
    }
    //transform diffTable into diffDict
    let diffDict = Object.assign({}, ...diffTable.map((x) => ({[[x.index]]: {date:x.date, value:x.value}})));
    // fill diffDict with the percent difference between each offer price and the avg price that week
    for (let d = getPreviousMonday(); d <= getNextSunday(); d.setDate(d.getDate() + 1)) {
        let i = indexLookUp.indexOf(d.getDate());
        activeOffers.forEach(calcDiff);
        function calcDiff(offer) {
            if ((d.getTime() >= new Date(offer.Date).getTime() && d.getTime() <= new Date(offer.End_Date).getTime())) {
                let diff = avgPriceDict[offer.Product_Id]-offer.Price;
                let ratio = diff/avgPriceDict[offer.Product_Id];
                let percent = ratio*100;
                diffDict[i].value.push(percent);
            }
        }
        // calculate the avg percent diff for all products
        diffDict[i].value = diffDict[i].value.reduce((a, b) => a + b, 0) / diffDict[i].value.length;
    }
    // transform diffDict back into a table
    diffTableFinal = Object.values(diffDict);
    drawChart();
}

// draw a dotted line at "today" if today is visible
var originalLineDraw = Chart.controllers.line.prototype.draw;
Chart.helpers.extend(Chart.controllers.line.prototype, {
  draw: function() {
    originalLineDraw.apply(this, arguments);

    var chart = this.chart;
    var ctx = chart.chart.ctx;

    var index = chart.config.data.lineAtIndex;
    if (startDate.toDateString() == new Date().toDateString()) {
      var xaxis = chart.scales['x-axis-0'];
      var yaxis = chart.scales['y-axis-0'];

      console.log(today, xaxis.getPixelForValue(index));
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xaxis.getPixelForValue(index), yaxis.top);
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = 'red';
      ctx.lineTo(xaxis.getPixelForValue(index), yaxis.bottom);
      ctx.stroke();
      ctx.restore();
    }
    // make both axiis black
    if (true) {
        var xaxis = chart.scales['x-axis-0'];
        var yaxis = chart.scales['y-axis-0'];
  
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xaxis.left, yaxis.getPixelForValue(0));
        ctx.strokeStyle = 'black';
        ctx.lineTo(xaxis.right, yaxis.getPixelForValue(0));
        ctx.stroke();
        ctx.restore();
    }
    if (true) {
        var xaxis = chart.scales['x-axis-0'];
        var yaxis = chart.scales['y-axis-0'];
  
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xaxis.getPixelForValue('undefined', 0), yaxis.top);
        ctx.strokeStyle = 'black';
        ctx.lineTo(xaxis.getPixelForValue('undefined', 0), yaxis.bottom);
        ctx.stroke();
        ctx.restore();
    }
  }
});

// draw the chart
function drawChart() {
    if(myChart!=null){
        myChart.destroy();
    }
    const config = {
        type: 'line',
        data: {
            labels: diffTableFinal.map(row => row.date),
            datasets: [{ 
                data: diffTableFinal.map(row => row.value),
                label: "Ενεργές προσφορές",
                borderColor: "#3e95cd",
                fill: false
                }],
            lineAtIndex: today
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: 100,
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Μέση % έκπτωση ανά ημέρα (από ' + getPreviousMonday().toDateString() + ' έως ' + getNextSunday().toDateString() + ')'
            },
        }
    };
    chartPlaceholder.style.display='none';
    myChart = new Chart(ctx, config);
}

getCategories();