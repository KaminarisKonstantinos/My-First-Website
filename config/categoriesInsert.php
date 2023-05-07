<?php
include '../src/libs/connection.php';

$query = 'INSERT INTO categories (category_id, category_name, category_parent_id) VALUES ';
            
// json file name
$filename = "./e-katanalotis-data-main/products_and_categories.json";
            
// Read the JSON file in PHP
$data = file_get_contents($filename); 
            
// Convert the JSON String into PHP Array
$array = json_decode($data, true);

// Extracting row by row
foreach($array["categories"] as $row) {

    //replace "/" with " / "
    $row["name"] = str_replace("/", "/ ", $row['name']);
    echo var_dump($row['name']);
  
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

echo var_dump($query);

//mysqli_multi_query($con, $query);


