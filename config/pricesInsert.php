<?php
include '../src/libs/connection.php';
session_start();
            
$query = 'INSERT INTO prices (product_id, date, price) VALUES ';

// json file name
$filename = '../uploadFiles/' . $_GET['filename'];
            
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

// Run the query
$queryResult = mysqli_multi_query($con, $query);

$_SESSION['error2'] .= ($queryResult) ? 'Οι τιμές ανέβηκαν με επιτυχία.' : 'Οι τιμές δεν ανέβηκαν με επιτυχία. Παρακαλώ προσπαθήστε ξανά.' ;

header('Location: ../public/admin.php');


