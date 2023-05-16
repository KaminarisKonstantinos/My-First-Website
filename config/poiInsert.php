<?php
include '../src/libs/connection.php';

$query = 'INSERT IGNORE INTO poi (poi_id, poi_name, latitude, longitude) VALUES ';

// json file name
$filename = "./poi.geojson";
            
// Read the JSON file in PHP
$data = file_get_contents($filename); 
            
// Convert the JSON String into PHP Array
$array = json_decode($data, true);

// Extracting row by row
foreach($array["features"] as $row) {
  
    // Database query to insert data 
    // into database Make Multiple 
    // Insert Query 
    if ($row["properties"]["name"]) {
        $query .= "( '".$row["id"]."', '".$row["properties"]["name"]."', '".$row["geometry"]["coordinates"][1]."', '".$row["geometry"]["coordinates"][0]."' )," ; 
    }  
    else {
        $query .= "( '".$row["id"]."', 'Unknown Name', '".$row["geometry"]["coordinates"][1]."', '".$row["geometry"]["coordinates"][0]."' )," ; 
    }
}

//Remove last "," from query
$query = substr($query, 0, -1);

echo var_dump($query);

mysqli_multi_query($con, $query);


