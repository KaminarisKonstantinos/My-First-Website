<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT User_Id, Username, Global_Score, Monthly_Tokens, Global_Tokens FROM users WHERE Is_Admin = 0 ORDER BY Global_Score DESC";

$stmt = $con->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();