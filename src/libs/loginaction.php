<?php
session_start();
include '../libs/connection.php';
//We check if the data was submitted, isset() function will check if the data exists.
if (!isset($_POST['username'], $_POST['password'])) {
	// Could not get the data that should have been sent.
  $_SESSION['error'] = 'Data could not be sent, please try again.';
  header('Location: ../../public/login.php');
  $con->close();
  exit;
}
// Make sure the submitted registration values are not empty.
if (empty($_POST['username']) || empty($_POST['password'])) {
	// One or more values are empty.
  $_SESSION['error'] = 'Please fill in all fields.';
  header('Location: ../../public/login.php');
  $con->close();
  exit;
}
// We need to check if the account with that username exists.
if ($stmt = $con->prepare('SELECT user_id, password FROM users WHERE username = ?')) {
	// Bind parameters (s = string, i = int, b = blob, etc), hash the password using the PHP password_hash function.
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
    $result = $stmt->get_result();
    if (!$result->num_rows > 0) {
		// Username doesn't exist
		$_SESSION['error'] = 'Username doesn\'t exist. Please try again.';
	  header('Location: ../../public/login.php');
    $stmt->close();
    $con->close();
    exit;
    }
    else {
        // Username exists. Password confirmation.
        while($row = $result->fetch_assoc()) {
            if(!password_verify($_POST['password'], $row['password'])){
                // Wrong password
		          $_SESSION['error'] = 'Wrong password. Please try again.';
                header('Location: ../../public/login.php');
                $stmt->close();
                $con->close();
                exit;
            }
            else {
              $_SESSION['userId'] = $row['user_id'];
              $_SESSION['username'] = $_POST['username'];
              header('Location: ../../public/map.php');
              $stmt->close();
              $con->close();
              exit;
            }
          }
    }
}
$stmt->close();
$con->close();