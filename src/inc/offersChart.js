let activeOffers = [];
let offersPerDay = [];
let offersPerDayModified = [];
let maxvalue;

function getActiveOffers() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      activeOffers = JSON.parse(this.response);
      calculateActiveDates();
    }
    xhttp.open("GET", "../src/libs/getActiveOffers.php");
    xhttp.send();
}

function calculateActiveDates() {
    activeOffers.forEach ( offer => {
        let begin = new Date(Math.max.apply(null,[new Date(offer.Date), new Date('2023-05-01')]));
        let end   = new Date(Math.min.apply(null,[new Date(offer.End_Date), new Date('2023-05-31')]));

        for(let i = begin; i <= end; i.setDate(i.getDate() + 1)) {
            index = i.getDate();
            offersPerDay[index] = (offersPerDay[index])? offersPerDay[index] + 1 : 1;
        }
    });
    //Remove first useless empty element
    offersPerDay.shift();
    maxvalue = Math.max.apply(null, offersPerDay);
    //Transform array into array of Objects for chart.js
    for (i in offersPerDay) {
        let tmp = new Object();
        tmp.date = i;
        tmp.date++;
        tmp.value = offersPerDay[i];
        offersPerDayModified.push(tmp);
    }
    generateChart();
}

function generateChart() {
    new Chart(document.getElementById("line-chart"), {
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
            text: 'Πλήθος ενεργών προσφορών ανά ημέρα (Μάιος 2023)'
        }
        }
    });
}
  
getActiveOffers();