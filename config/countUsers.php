<?php
session_start();
include 'D:\xamp\htdocs\Web22-23\src\libs\connection.php';

$file = "D:\\xamp\htdocs\Web22-23\uploadFiles\userCount.txt";

$sql = "SELECT COUNT(*) FROM users WHERE Is_Admin=0";
$stmt = $con->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $count = $row['COUNT(*)'];
    file_put_contents($file, $count);
    break;
}

$stmt->close();