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
$stmt = $con->prepare('SELECT Price FROM prices WHERE Product_Id=? AND Date=? ; ');
$stmt->bind_param('ss', $_POST['product'], $yesterday);
$stmt->execute();
$result = $stmt->get_result();
$dayCheck = true;
while($row = $result->fetch_assoc()) {
  $dayCheck = ($_POST['price'] < round(0.8 * $row['Price'], 2));
  break;
}
$stmt->close();

//Perform WeekCheck
$lastWeek = date("Y-m-d", strtotime('-7 days'));
$stmt = $con->prepare('SELECT AVG(Price) AS Price FROM prices WHERE Product_Id=? AND Date BETWEEN ? AND ? ; ');
$stmt->bind_param('sss', $_POST['product'], $lastWeek, $yesterday);
$stmt->execute();
$result = $stmt->get_result();
$weekCheck = true;
while($row = $result->fetch_assoc()) {
  if ($row['Price'] == NULL) break;
  $weekCheck = ($_POST['price'] < round(0.8 * $row['Price'], 2));
  break;
}

$stmt->close();

//Check for already existing offer
$stmt = $con->prepare('SELECT Price FROM offers WHERE Poi_Id=? AND Product_Id=? AND Is_Active=1 ;');
$stmt->bind_param('ss', $_GET['poiId'], $_POST['product']);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
  if(!$row['Price']){
    // There is no existing offer
    $existingCheck = false;
    $stmt->close();
    exit;
  }
  else {
    // There is an existing offer active
    if ($_POST['price'] < round(0.8 * $row['Price'], 2)) {
      // The proposed offer is good enough
      $stmt2 = $con->prepare('UPDATE offers SET Is_Active = 0 WHERE Poi_Id=? AND Product_Id=? AND Is_Active=1 ;');
      $stmt2->bind_param('ss', $_GET['poiId'], $_POST['product']);
      $stmt2->execute();
      $stmt2->close();
      $existingCheck = false;
      $stmt->close();
    }
    else{
      // The proposed offer is not good enough
      $existingCheck = true;
      $_SESSION['error'] = 'Υπάρχει ήδη προσφορά για αυτό το προϊόν σε αυτό το κατάστημα.';
      header('Location: ../../public/addOffer.php?poiId=' . $_GET['poiId']);
      $stmt->close();
      $con->close();
      exit;
    }
  }
}

$stmt = $con->prepare('INSERT INTO offers (Poi_Id, User_Id, Product_Id, Price, Day_Check, Week_Check, End_Date) VALUES (?, ?, ?, ?, ?, ?, ?); ');
$endDate = date("Y-m-d", strtotime('+7 days'));
$stmt->bind_param('sssssss', $_GET['poiId'], $_SESSION['userId'], $_POST['product'],  $_POST['price'],$dayCheck, $weekCheck, $endDate);
$stmt->execute();
$_SESSION['error'] = 'Η προσφορά καταχωρήθηκε! Ευχαριστούμε πολύ.';
if ($weekCheck) {
  if ($dayCheck) {
    $_SESSION['error'] .= ' Συγχαρητήρια! Βρήκατε πολύ καλή προσφορά και κερδίζετε 70 πόντους! ';
    $score = 70;
  }
  else {
    $_SESSION['error'] .= ' Συγχαρητήρια! Βρήκατε καλή προσφορά και κερδίζετε 20 πόντους! ';
    $score = 20;
  }
}
else if ($dayCheck) {
  $_SESSION['error'] .= ' Συγχαρητήρια! Βρήκατε καλή προσφορά και κερδίζετε 50 πόντους! ';
  $score = 50;
}
$stmt->close();
$stmt = $con->prepare('UPDATE users SET Monthly_Score = Monthly_Score + ? WHERE User_Id = ? ;');
$stmt->bind_param('is', $score, $_SESSION['userId']);
$stmt->execute();
$stmt->close();
$stmt = $con->prepare('UPDATE users SET Global_Score = Global_Score + ? WHERE User_Id = ? ;');
$stmt->bind_param('is', $score, $_SESSION['userId']);
$stmt->execute();
$stmt->close();

header('Location: ../../public/addOffer.php?poiId=' . $_GET['poiId']);

$con->close();
?>