<?php
include '../src/libs/connection.php';
session_start();

$query = 'INSERT IGNORE INTO poi (poi_id, poi_name, latitude, longitude) VALUES ';

// json file name
$filename = '../uploadFiles/' . $_GET['filename'];
            
// Read the JSON file in PHP
$data = file_get_contents($filename); 
            
// Convert the JSON String into PHP Array
$array = json_decode($data, true);

// Extracting row by row
foreach($array["features"] as $row) {
  
    // Database query to insert data 
    // into database Make Multiple 
    // Insert Query 
    if (array_key_exists('name', $row["properties"])) {
        $query .= "( '".$row["id"]."', '".$row["properties"]["name"]."', '".$row["geometry"]["coordinates"][1]."', '".$row["geometry"]["coordinates"][0]."' )," ; 
    }  
    else {
        $query .= "( '".$row["id"]."', 'Unknown Name', '".$row["geometry"]["coordinates"][1]."', '".$row["geometry"]["coordinates"][0]."' )," ; 
    }
}

//Remove last "," from query
$query = substr($query, 0, -1);

$queryResult = mysqli_multi_query($con, $query);

$_SESSION['error3'] .= ($queryResult) ? 'Τα καταστήματα ανέβηκαν με επιτυχία.' : 'Τα καταστήματα δεν ανέβηκαν με επιτυχία. Παρακαλώ προσπαθήστε ξανά.' ;

header('Location: ../public/admin.php');


