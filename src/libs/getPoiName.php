<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT Poi_Name FROM poi WHERE Poi_Id=?";

$stmt = $con->prepare($sql);
$stmt->bind_param("s", $_GET['poiId']);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();