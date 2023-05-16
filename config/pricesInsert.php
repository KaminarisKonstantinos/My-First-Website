<?php
include '../src/libs/connection.php';
            
// json file name
$filename = "./updatePrices.json";
            
// Read the JSON file in PHP
$data = file_get_contents($filename); 
            
// Convert the JSON String into PHP Array
$array = json_decode($data, true);

$query = 'INSERT INTO prices (product_id, date, price) VALUES ';

// Extracting row by row
foreach($array['data'] as $row) {
  
    // Database query to insert data 
    // into database Make Multiple 
    // Insert Query 
    $product_Id = $row['id'];
    foreach($row['prices'] as $priceData) {
        $query .= "( '".$product_Id."', '".$priceData["date"]."', '".$priceData["price"]."')," ; 
    }
}

//Remove last "," from query
$query = substr($query, 0, -1);

echo var_dump($query);
// Run the query
mysqli_multi_query($con, $query);


