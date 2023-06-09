let activeOffers = [];
let offersPerDay = [];
let offersPerDayModified = [];
let maxvalue;
let myChart = null;
// make a lookup table for months in greek
const month = ["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"];
let selectedMonth = month[(new Date().getMonth())];
let selectedYear = new Date().getFullYear();
const ctx = document.getElementById("line-chart");
const today = new Date().getDate();

function getActiveOffers() {
    // calculate the starting and ending date of the given month
    const selectedMonthNum = month.indexOf(selectedMonth)+1;
    let startDate = new Date(selectedYear, selectedMonthNum-1);
    //Set time diff to midnight to avoid wrong date transformation when using the "toJSON().slice(0, 10)" functionality
    startDate.setHours(20);
    startDate.setDate(startDate.getDate() - 6);
    let endDate = new Date(selectedYear, selectedMonthNum);
    //Set time diff to midnight to avoid wrong date transformation when using the "toJSON().slice(0, 10)" functionality
    endDate.setHours(20);
    endDate.setDate(endDate.getDate() - 1);
    // format dates into database-querry-friendly format
    startDateFormated = startDate.toJSON().slice(0, 10);
    endDateFormated = endDate.toJSON().slice(0, 10);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        activeOffers = JSON.parse(this.response);
        calculateActiveDates();
    }
    xhttp.open("GET", "../src/libs/getActiveOffers.php?startDate=" + startDateFormated + "&endDate=" + endDateFormated + "&categoryId=ALL&isParent=0");
    xhttp.send();
}

// calculate active offers per day of selected month
function calculateActiveDates() {
    offersPerDay = [];
    // use the lookup table to return the selected month in numberical form
    const selectedMonthNum = month.indexOf(selectedMonth)+1;
    // calculate previous month in numberical form
    const nextMonth = (selectedMonthNum==12)? 01 : selectedMonthNum+1;
    //initialisation at 0
    const initialisationBegin = new Date(selectedYear + '-' + selectedMonthNum + '-01');
    const initialisationEnd = new Date(selectedYear + '-' + nextMonth + '-01');
    for (let i = initialisationBegin; i < initialisationEnd; i.setDate(i.getDate() + 1)) {
        offersPerDay[i.getDate()] = 0;
    }

    // calculate #offers per day
    activeOffers.forEach ( offer => {
        // calculate begin and end date of each offer while restricting them in selected month
        let begin = new Date(Math.max.apply(null,[new Date(offer.Date), new Date(selectedYear + '-' + selectedMonthNum + '-01')]));
        let end   = new Date(Math.min.apply(null,[new Date(offer.End_Date), new Date(selectedYear + '-' + nextMonth + '-01')]));

        for(let i = begin; i < end; i.setDate(i.getDate() + 1)) {
            index = i.getDate();
            offersPerDay[index] = offersPerDay[index] + 1;
        }
    });
    //Remove first useless empty element
    offersPerDay.shift();
    // calculate the max value in offersPerDay table
    maxvalue = Math.max.apply(null, offersPerDay);
    //Transform array into array of Objects for chart.js
    offersPerDayModified = [];
    for (i in offersPerDay) {
        let tmp = new Object();
        tmp.date = i;
        tmp.date++;
        tmp.value = offersPerDay[i];
        offersPerDayModified.push(tmp);
    }
    generateChart();
}

// fills the year selection dropdown menu
function fillYears(){
    let tmp = '<option value="" disabled selected hidden>Διάλεξε έτος</option>';
    for (let year=new Date().getFullYear(); year>=2020; year--) {
        tmp += "<option value=" + year + ">" + year + "</option>";
    }
    document.getElementById("year").innerHTML = tmp;
    fixForms();
}

// draw a dotted line at "today" if today is visible
var originalLineDraw = Chart.controllers.line.prototype.draw;
Chart.helpers.extend(Chart.controllers.line.prototype, {
  draw: function() {
    originalLineDraw.apply(this, arguments);

    var chart = this.chart;
    var ctx = chart.chart.ctx;

    var index = chart.config.data.lineAtIndex;
    if (index && selectedYear==new Date().getFullYear() && selectedMonth==month[(new Date().getMonth())]) {
      var xaxis = chart.scales['x-axis-0'];
      var yaxis = chart.scales['y-axis-0'];

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
function generateChart() {
    if(myChart!=null){
        myChart.destroy();
    }
    const config = {
        type: 'line',
        data: {
            labels: offersPerDayModified.map(row => row.date),
            datasets: [{ 
                data: offersPerDayModified.map(row => row.value),
                label: "Ενεργές προσφορές",
                borderColor: "#3e95cd",
                fill: false
                }
            ],
            lineAtIndex: today
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: 10,
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Πλήθος ενεργών προσφορών ανά ημέρα (' + selectedMonth + ' ' + selectedYear + ')'
            },
        }
    };
    myChart = new Chart(ctx, config);//create chart
}

// redraws the chart when user selects diff month or year
function refreshChart(value, type) {
    if (type == 1) {
        selectedMonth = month[value];
    }
    else {
        selectedYear = value;
    }
    getActiveOffers();
}

// initialize selected year and month to match current date
function fixForms() {
    document.getElementById('month').selectedIndex = month.indexOf(selectedMonth)+1;
    document.getElementById('year').selectedIndex = 1;
}
  
getActiveOffers();
fillYears();