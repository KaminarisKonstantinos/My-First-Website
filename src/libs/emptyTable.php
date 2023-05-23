<?php
include './connection.php';
session_start();

$query = 'TRUNCATE ';

switch($_GET['id']) {
    case 1: 
        $query .= 'categories; TRUNCATE products;';
        break;
    case 2:
        $query .= 'prices;';
        break;
    case 3:
        $query .= 'poi;';
        break;
}

$queryResult = mysqli_multi_query($con, $query);

$_SESSION['error'.$_GET['id']] .= ($queryResult) ? 'Τα δεδομένα διαγράφηκαν επιτυχώς' : 'Δεν ήταν δυνατή η διαγραφή των δεδομένων' ;

unset($query);

header('Location: ../../public/admin.php');


