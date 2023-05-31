let categories;
let mainCategories;
let subcategories;
const ctx = document.getElementById('line-chart');
const chartPlaceholder = document.getElementById("chartPlaceholder");
let myChart;
const today = new Date().getDate() - 1;
let data;
let startDate;

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

function fillData(category, isParent) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      const result = JSON.parse(this.response);
      startDate = new Date().toJSON().slice(0, 10);
      console.log("../src/libs/getAverageDiscount.php?startDate="+startDate+"&categoryId="+category+"&isParent="+isParent);
      console.log(result);
    }
    xhttp.open("GET", "../src/libs/getAverageDiscount.php?startDate="+startDate+"&categoryId="+category+"&isParent="+isParent);
    xhttp.send();
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