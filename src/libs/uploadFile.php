<?php
session_start();

$uploaddir = '../../uploadFiles/';

switch ($_GET['id']) {
    case 1: 
        $filename='productsAndCategories.json';
        break;
    case 2: 
        $filename='prices.json';
        break;
    case 3: 
        $filename='pois.geojson';
        break;
}

$uploadfile = $uploaddir . $filename;

if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
    $_SESSION['error'.$_GET['id']] = "File is valid, and was successfully uploaded.<br>";
    switch ($_GET['id']) {
        case 1: 
            header('Location: ../../config/categoriesAndProductsInsert.php?filename=' . $filename);
            break;
        case 2: 
            header('Location: ../../config/pricesInsert.php?filename=' . $filename);
            break;
        case 3: 
            header('Location: ../../config/poiInsert.php?filename=' . $filename);
            break;
    }
} else {
    $_SESSION['error'.$_GET['id']] = "Upload failed";
    header('Location: ../../public/admin.php');
}