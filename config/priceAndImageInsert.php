<?php
include '../src/libs/connection.php';
            
// json file name
$filename = "./product prices images.json";
            
// Read the JSON file in PHP
$data = file_get_contents($filename); 
            
// Convert the JSON String into PHP Array
$array = json_decode($data, true);

// Extracting row by row
foreach($array as $row) {
  
    // Database query to insert data 
    // into database Make Multiple 
    // Insert Query 
    $query = "UPDATE products SET product_price = ".$row["product_price"].", product_image = '".$row["product_image"]."' WHERE product_id = ".$row["product_id"];
    echo var_dump($query);
    // Run the query
    mysqli_multi_query($con, $query);
    unset($query);
}


