<?php
include '../src/libs/connection.php';
session_start();

$query = 'INSERT IGNORE INTO products (product_name, subcategory_id) VALUES ';
            
// json file name
$filename = '../uploadFiles/' . $_GET['filename'];
            
// Read the JSON file in PHP
$data = file_get_contents($filename); 
            
// Convert the JSON String into PHP Array
$array = json_decode($data, true);

// Products Insert
foreach($array["products"] as $row) {
  
    // Database query to insert data 
    // into database Make Multiple 
    // Insert Query 
    // Replace single quotes with escape character single quotes for the query
    $row["name"] = str_replace("'","\'",$row["name"]);

    $query .= "( '".$row["name"]."', '".$row["subcategory"]."')," ; 
}

//Remove last "," from query
$query = substr($query, 0, -1);

//echo var_dump($query);

$queryResult = mysqli_multi_query($con, $query);

$_SESSION['error1'] .= ($queryResult) ? 'Produts uploaded successfully<br>' : 'Produts did not upload successfully<br>' ;

$query = 'INSERT IGNORE INTO categories (category_id, category_name, category_parent_id) VALUES ';

// Categories Insert
foreach($array["categories"] as $row) {

    //replace "/" with " / "
    $row["name"] = str_replace("/", "/ ", $row['name']);
    //echo var_dump($row['name']);
  
    // Database query to insert data 
    // into database Make Multiple 
    // Insert Query 
    $query .= "( '".$row["id"]."', '".$row["name"]."', 'NULL' )," ; 
    foreach($row["subcategories"] as $subrow) {
        $subrow["name"] = str_replace("/", "/ ", $subrow['name']);
        $query .= "( '".$subrow["uuid"]."', '".$subrow["name"]."', '".$row["id"]."' )," ;
    }
}

//Remove last "," from query
$query = substr($query, 0, -1);

//echo var_dump($query);

$queryResult = mysqli_multi_query($con, $query);

$_SESSION['error1'] .= ($queryResult) ? 'Categories uploaded successfully' : 'Categories did not upload successfully' ;

header('Location: ../public/admin.php');


