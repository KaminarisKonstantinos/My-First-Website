<?php
include './connection.php';
session_start();

$sql = 'DELETE FROM offers WHERE Offer_Id = ?;';

$stmt = $con->prepare($sql);
$stmt->bind_param('i', $_POST['offer_Id']);
$stmt->execute();

$stmt->close();



