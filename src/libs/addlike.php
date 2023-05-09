<?php
session_start();
include './connection.php';
$output = [];

$sql = "UPDATE offers SET Likes = Likes + 1 WHERE Offer_Id = ?;";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$sql = "INSERT INTO ratings (User_Id, Offer_Id, Is_Positive) VALUES (?, ?, 1) ;";

$stmt = $con->prepare($sql);
$stmt->bind_param("ii", $_SESSION['userId'], $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$sql = "UPDATE users JOIN offers ON users.User_Id = offers.User_Id SET users.Monthly_Score = users.Monthly_Score + 5 WHERE offers.Offer_Id = ?;";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$sql = "UPDATE users JOIN offers ON users.User_Id = offers.User_Id SET users.Global_Score = users.Global_Score + 5 WHERE offers.Offer_Id = ?;";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$con->close();