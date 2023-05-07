<?php
session_start();
include './connection.php';
$output = [];

$sql = "UPDATE offers SET Has_Stock = NOT Has_Stock WHERE Offer_Id = ?;";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $_GET['offer_Id']);
$stmt->execute();
$stmt->close();

$con->close();