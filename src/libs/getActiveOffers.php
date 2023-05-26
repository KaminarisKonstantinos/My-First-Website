<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT Offer_Id, Date, End_Date FROM offers WHERE Update_Date BETWEEN '2023-04-25' AND '2023-05-31'";

$stmt = $con->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();