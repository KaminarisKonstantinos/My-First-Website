<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT Monthly_Score, Global_Score, Monthly_Tokens, Global_Tokens FROM users WHERE User_Id = ?; ";

$stmt = $con->prepare($sql);
$stmt->bind_param('i', $_SESSION['userId']);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();