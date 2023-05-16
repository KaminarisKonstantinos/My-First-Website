<?php
include '../src/libs/connection.php';

$query = 'INSERT IGNORE INTO products (product_name, subcatergory_id) VALUES ';
            
// json file name
$filename = "./e-katanalotis-data-main/products_and_categories.json";
            
// Read the JSON file in PHP
$data = file_get_contents($filename); 
            
// Convert the JSON String into PHP Array
$array = json_decode($data, true);

// Extracting row by row
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

echo var_dump($query);

//mysqli_multi_query($con, $query);


