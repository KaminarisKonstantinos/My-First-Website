let categories
let mainCategories
let categoriesHtml
let subcategories
let products
let productsHtml
let allSubcategories
let productsPerSubcategory = new Object();
function makeVisible(value) {
    //Make all subcategory selects invisible
    const allSubSelects = document.getElementsByClassName('subcategory');
    Array.from(allSubSelects).forEach(function (element) {
        element.value = '';
        element.classList.remove('visible');
    });
    //Make all product selects invisible
    const allProdSelects = document.getElementsByClassName('product');
    Array.from(allProdSelects).forEach(function (element) {
        element.classList.remove('visible');
    });
    //Make the correct select visible
    document.getElementById(value).classList.add('visible');
}

function makeVisibleSub(value) {
    //Make all product selects invisible
    const allProdSelects = document.getElementsByClassName('product');
    Array.from(allProdSelects).forEach(function (element) {
        element.classList.remove('visible');
    });
    //Make the correct select visible
    document.getElementById(value).classList.add('visible');
}

function getCategories() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      categories = JSON.parse(this.response);
      mainCategories = categories.filter(function (element) {return element["Category_Parent_Id"]=="NULL";});
      fillCategories();
      getProducts();
    }
    xhttp.open("GET", "../src/libs/getcategories.php");
    xhttp.send();
}

function fillCategories() {
    //Fill main categories
    categoriesHtml = "<select name='mainCategory' class='mainCategory' onchange='makeVisible(this.value);'><option value='' selected hidden>Διάλεξε Κατηγορία</option>"
    mainCategories.forEach(makeOption);
    function makeOption(category){
        categoriesHtml += "<option value=" + category["Category_Id"] + ">" + category["Category_Name"] + "</option>";
    }
    categoriesHtml += "</select>";
    document.getElementById("mainCategoriesContainer").innerHTML = categoriesHtml;
    //Fill subcategories
    categoriesHtml = '';
    mainCategories.forEach(makeSelect);
    function makeSelect(mainCategory) {
        categoriesHtml += "<select name='subcategory' class='subcategory' id='" + mainCategory['Category_Id'] + "' onchange='makeVisibleSub(this.value);'><option value='' selected hidden>Διάλεξε Υποκατηγορία</option>";
        subcategories = categories.filter(function (element) {return element["Category_Parent_Id"]==mainCategory['Category_Id'];});
        subcategories.forEach(makeOption);
        categoriesHtml += "</select>";
    }
    document.getElementById("subcategoriesContainer").innerHTML = categoriesHtml;
}

function getProducts() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        products = JSON.parse(this.response);
        fillProducts();
    }
    xhttp.open("GET", "../src/libs/getProducts.php");
    xhttp.send();
}

function fillProducts() {
    //Fill products
    productsHtml = '';
    allSubcategories = categories.filter(function (element) {return element["Category_Parent_Id"]!="NULL";});
    allSubcategories.forEach(makeProductSelect);
    function makeProductSelect(subcategory) {
        productsPerSubcategory [subcategory['Category_Id']] = "<select name='products' class='product' id='" + subcategory['Category_Id'] + "' onchange='selectProduct(this.value);'><option selected hidden>Διάλεξε Προϊόν</option>";
    }
    products.forEach(fillSelect);
    function fillSelect(product){
        productsPerSubcategory [product['Subcategory_Id']] += "<option value='" + product['Product_Id'] + "," + product['Product_Name'] + "'>" + product["Product_Name"] + "</option>";
    }
    for (const key in productsPerSubcategory) {
        productsPerSubcategory[key] += "</select>";
        productsHtml += productsPerSubcategory[key];
    }
    document.getElementById("productsContainer").innerHTML = productsHtml;
}

function selectProduct(value) {
    const valueSplit = value.split(",");
    document.getElementById('productName').value = valueSplit[1];
    document.getElementById('product').value = valueSplit[0];
}

//Removing greek accents
function toNormalForm(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function searchByName(form) {
    const inputValue = form.inputbox.value;
    const matchingProducts = products.filter(function (element) {return toNormalForm(element["Product_Name"]).toLowerCase().includes(toNormalForm(inputValue).toLowerCase());});
    productsHtml = "<select name='products' class='product' onchange='selectProduct(this.value);'><option selected hidden>Διάλεξε Προϊόν</option>";
    matchingProducts.forEach(fillSelect);
    function fillSelect(product){
        productsHtml += "<option value='" + product['Product_Id'] + "," + product['Product_Name'] + "'>" + product["Product_Name"] + "</option>";
    }
    productsHtml += "</select>";
    document.getElementById("searchProductsContainer").innerHTML = productsHtml;
}

getCategories();