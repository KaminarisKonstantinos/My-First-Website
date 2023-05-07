<?php
session_start();
include './connection.php';
$output = [];

$sql = "UPDATE offers SET Dislikes = Dislikes + 1 WHERE Offer_Id = ?;";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$sql = "INSERT INTO ratings (User_Id, Offer_Id, Is_Positive) VALUES (?, ?, 0) ;";

$stmt = $con->prepare($sql);
$stmt->bind_param("ii", $_SESSION['userId'], $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$con->close();