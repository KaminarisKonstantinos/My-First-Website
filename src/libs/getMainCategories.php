<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT C.Category_Name, C.Category_Id FROM categories AS C WHERE C.Category_Parent_Id = 'NULL';";

$stmt = $con->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();