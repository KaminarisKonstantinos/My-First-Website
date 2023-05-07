<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT * FROM poi";

$stmt = $con->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();