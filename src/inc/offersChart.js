let activeOffers = [];
let offersPerDay = [];
let offersPerDayModified = [];
let maxvalue;
let myChart = null;
const month = ["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"];
let selectedMonth = month[(new Date().getMonth())];
let selectedYear = new Date().getFullYear();
const ctx = document.getElementById("line-chart");
const today = new Date().getDate() - 1;

function getActiveOffers() {
    const selectedMonthNum = month.indexOf(selectedMonth)+1
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        activeOffers = JSON.parse(this.response);
        calculateActiveDates();
    }
    xhttp.open("GET", "../src/libs/getActiveOffers.php?month=" + selectedMonthNum + "&year=" + selectedYear);
    xhttp.send();
}

function calculateActiveDates() {
    offersPerDay = [];
    const selectedMonthNum = month.indexOf(selectedMonth)+1;
    const nextMonth = (selectedMonthNum==12)? 01 : selectedMonthNum+1;
    //initialisation at 0
    const initialisationBegin = new Date(selectedYear + '-' + selectedMonthNum + '-01');
    const initialisationEnd = new Date(selectedYear + '-' + nextMonth + '-01');
    for (let i = initialisationBegin; i < initialisationEnd; i.setDate(i.getDate() + 1)) {
        offersPerDay[i.getDate()] = 0;
    }

    activeOffers.forEach ( offer => {
        let begin = new Date(Math.max.apply(null,[new Date(offer.Date), new Date(selectedYear + '-' + selectedMonthNum + '-01')]));
        let end   = new Date(Math.min.apply(null,[new Date(offer.End_Date), new Date(selectedYear + '-' + nextMonth + '-01')]));

        for(let i = begin; i < end; i.setDate(i.getDate() + 1)) {
            index = i.getDate();
            offersPerDay[index] = offersPerDay[index] + 1;
        }
    });
    //Remove first useless empty element
    offersPerDay.shift();
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

function fillYears(){
    let tmp = '<option value="" disabled selected hidden>Διάλεξε έτος</option>';
    for (let year=new Date().getFullYear(); year>=2020; year--) {
        tmp += "<option value=" + year + ">" + year + "</option>";
    }
    document.getElementById("year").innerHTML = tmp;
    fixForms();
}

const todayLine = {
    id: 'todayLine',
    beforeDraw(chart, args, options) {
        console.log(chart);
        const {chartArea: { top, right, bottom, left }, chart: {width, height}, scales: {x, y} } = chart;
        console.log(height);
        var ctx = chart.chart.ctx;
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.strokeRect(x.getPixelForTick(4), top, 0, height);
        ctx.restore();
    }
}

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
      ctx.moveTo(xaxis.getPixelForValue(undefined, index), yaxis.top);
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = 'red';
      ctx.lineTo(xaxis.getPixelForValue(undefined, index), yaxis.bottom);
      ctx.stroke();
      ctx.restore();
    }
  }
});

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
                        suggestedMax: 6,//maxvalue+1,
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

function refreshChart(value, type) {
    if (type == 1) {
        selectedMonth = month[value];
    }
    else {
        selectedYear = value;
    }
    getActiveOffers();
}

function fixForms() {
    document.getElementById('month').selectedIndex = month.indexOf(selectedMonth)+1;
    const yearsForm = document.getElementById('year').selectedIndex = 1;
}
  
getActiveOffers();
fillYears();