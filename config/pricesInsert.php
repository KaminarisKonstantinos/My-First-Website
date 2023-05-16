<?php
include '../src/libs/connection.php';
            
$query = 'INSERT INTO prices (product_id, date, price) VALUES ';

// json file name
$filename = "./updatePrices.json";
            
// Read the JSON file in PHP
$data = file_get_contents($filename); 
            
// Convert the JSON String into PHP Array
$array = json_decode($data, true);

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

//Add duplicate functionality
$query .= ' ON DUPLICATE KEY UPDATE price=VALUES(price)';

echo var_dump($query);
// Run the query
mysqli_multi_query($con, $query);


