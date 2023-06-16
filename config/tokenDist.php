<?php
session_start();
include 'D:\xamp\htdocs\Web22-23\src\libs\connection.php';

$users = [];

$myfile = fopen("D:\\xamp\htdocs\Web22-23\uploadFiles\userCount.txt", "r") or die("Unable to open file!");
$userCount =  fread($myfile,filesize("D:\\xamp\htdocs\Web22-23\uploadFiles\userCount.txt"));
fclose($myfile);

$totalTokens = $userCount * 80;

//get users with their monthly score
$sql = "SELECT User_Id, Monthly_Score FROM users WHERE Is_Admin=0";
$stmt = $con->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $users[] = $row;
}
$stmt->close();

//get sum of monthly score
$sql = "SELECT SUM(Monthly_Score) FROM users WHERE Is_Admin=0";
$stmt = $con->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $totalScore = $row['SUM(Monthly_Score)'];
    break;
}
$stmt->close();

//calculate tokens for each user
foreach ($users as &$user) {
    $user['Tokens'] = round(($user['Monthly_Score'] / $totalScore) * $totalTokens);
}

//update tokens and reset monthly score
$sql = '';
foreach ($users as &$user) {
    $sql .= "UPDATE users SET Monthly_Tokens = " .$user['Tokens']. ", Global_Tokens = Global_Tokens + " .$user['Tokens']. ", Monthly_Score = 0 WHERE User_Id = " .$user['User_Id']. ";";
}
$con -> multi_query($sql);

$con->close();