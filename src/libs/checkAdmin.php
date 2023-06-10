<?php
session_start();
include './connection.php';

$data = array('isAdmin'=>$_SESSION['isAdmin']);

echo json_encode($data);

$con->close();

