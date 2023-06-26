<?php
include './connection.php';
session_start();

$query = 'DELETE FROM ';

switch($_GET['id']) {
    case 1: 
        $query .= ' categories; DELETE FROM products;';
        break;
    case 2:
        $query .= 'prices;';
        break;
    case 3:
        $query .= 'poi;';
        break;
}

$queryResult = mysqli_multi_query($con, $query);
$index = 'error'.$_GET['id'];

$_SESSION[$index] = ($queryResult) ? 'Τα δεδομένα διαγράφηκαν επιτυχώς' : 'Δεν ήταν δυνατή η διαγραφή των δεδομένων' ;
var_dump($index, $_SESSION[$index]);
unset($query);

header('Location: ../../public/admin.php');


