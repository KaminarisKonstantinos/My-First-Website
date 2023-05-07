<?php
session_start();
include '../libs/connection.php';
// Now we check if the data was submitted, isset() function will check if the data exists.
if (!isset($_POST['product'], $_POST['price'])) {
	// Could not get the data that should have been sent.
  $_SESSION['error'] = 'Data could not be sent, please try again.';
  header('Location: ../../public/addOffer.php?poiId=' . $_GET['poiId']);
  $con->close();
  exit;
}
// Make sure the submitted registration values are not empty.
if (empty($_POST['product']) || empty($_POST['price'])) {
	// One or more values are empty.
 	$_SESSION['error'] = 'Please fill in all fields.';
	header('Location: ../../public/addOffer.php?poiId=' . $_GET['poiId']);
	$con->close();
  exit;
}
//Make sure the user entered a numeric price
if (!is_numeric($_POST['price'])) {
 	$_SESSION['error'] = 'Please enter a valid price.';
	header('Location: ../../public/addOffer.php?poiId=' . $_GET['poiId']);
	$con->close();
  exit;
}

//Perform DayCheck
$yesterday = date("Y-m-d", strtotime('-1 days'));
$stmt = $con->prepare('SELECT AVG(Price) AS Price FROM offers WHERE Product_Id=? AND Is_active=1 AND Has_Stock=1 AND Date BETWEEN ? AND ? ; ');
$stmt->bind_param('sss', $_POST['product'], $yesterday, $yesterday);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    // Product has other offers
    while($row = $result->fetch_assoc()) {
        $dayCheck = ($_POST['price'] < 0.8 * $row['Price']);
        header('Location: ../../public/addOffer.php?poiId=' . $_GET['poiId']);
        exit;
    }
} else {
      // Product has no offers
      $dayCheck = true;
}
$stmt->close();

$stmt = $con->prepare('INSERT INTO offers (Poi_Id, User_Id, Product_Id, Price, Day_Check, Week_Check) VALUES (?, ?, ?, ?, ?, 1); ');
$stmt->bind_param('sssss', $_GET['poiId'], $_SESSION['UserId'], $_POST['product'],  $_POST['price'],$dayCheck);
$stmt->execute();
$_SESSION['error'] = 'Η προσφορά καταχωρήθηκε! Ευχαριστούμε πολύ.';
header('Location: ../../public/addOffer.php?poiId=' . $_GET['poiId']);

$stmt->close();

$con->close();
?>