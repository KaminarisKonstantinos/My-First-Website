<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT Offer_Id, Date, End_Date FROM offers WHERE (Update_Date BETWEEN ? AND ?) OR (Date BETWEEN ? AND ?)";
$stmt = $con->prepare($sql);
$stmt->bind_param("ssss", $_GET['startDate'], $_GET['endDate'], $_GET['startDate'], $_GET['endDate']);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();