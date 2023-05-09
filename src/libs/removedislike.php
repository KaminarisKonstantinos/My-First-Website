<?php
session_start();
include './connection.php';
$output = [];

$sql = "UPDATE offers SET Dislikes = Dislikes - 1 WHERE Offer_Id = ?;";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$sql = "DELETE FROM ratings WHERE Offer_Id = ? AND User_Id = ? ;";

$stmt = $con->prepare($sql);
$stmt->bind_param("ii", $_GET['offer_Id'], $_SESSION['userId']);
$stmt->execute();
$stmt->close();

$sql = "UPDATE users JOIN offers ON users.User_Id = offers.User_Id SET users.Monthly_Score = users.Monthly_Score + 1 WHERE offers.Offer_Id = ?;";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$sql = "UPDATE users JOIN offers ON users.User_Id = offers.User_Id SET users.Global_Score = users.Global_Score + 1 WHERE offers.Offer_Id = ?;";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$con->close();