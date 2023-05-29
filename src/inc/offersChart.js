let activeOffers = [];
let offersPerDay = [];
let offersPerDayModified = [];
let maxvalue;
let myChart = null;
const month = ["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"];
let selectedMonth = month[(new Date().getMonth())];
let selectedYear = new Date().getFullYear();

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
    const selectedMonthNum = month.indexOf(selectedMonth)+1
    const nextMonth = (selectedMonthNum==12)? 01 : selectedMonthNum+1;
    //initialisation at 0
    for (let i=1; i<=31; i++) {
        offersPerDay[i] = 0;
    }
    console.log(activeOffers);

    activeOffers.forEach ( offer => {
        let begin = new Date(Math.max.apply(null,[new Date(offer.Date), new Date(selectedYear + '-' + selectedMonthNum + '-01')]));
        let end   = new Date(Math.min.apply(null,[new Date(offer.End_Date), new Date(selectedYear + '-' + nextMonth + '-01')]));
        console.log(begin);
        console.log(end)

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

function generateChart() {
    if(myChart!=null){
        myChart.destroy();
    }
    myChart = new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
        labels: offersPerDayModified.map(row => row.date),
        datasets: [{ 
            data: offersPerDayModified.map(row => row.value),
            label: "Ενεργές προσφορές",
            borderColor: "#3e95cd",
            fill: false
            }
        ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: maxvalue+1,
                        beginAtZero: true
                    }
                }]       
            },
        title: {
            display: true,
            text: 'Πλήθος ενεργών προσφορών ανά ημέρα (' + selectedMonth + ' ' + selectedYear + ')'
        }
        }
    });
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