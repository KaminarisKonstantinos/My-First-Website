<?php
session_start();
include '../libs/connection.php';
//We check if the data was submitted, isset() function will check if the data exists.
if (!isset($_POST['username'])) {
	// Could not get the data that should have been sent.
  $_SESSION['error'] = 'Data could not be sent, please try again.';
  header('Location: ../../public/editprofile.php');
  $con->close();
  exit;
}
// Make sure the submitted registration values are not empty.
if (empty($_POST['username'])) {
	// One or more values are empty.
  $_SESSION['error'] = 'Please fill in all fields.';
  header('Location: ../../public/editprofile.php');
  $con->close();
  exit;
}
// We need to check if the account with that username exists.
if ($stmt = $con->prepare('SELECT user_id FROM users WHERE username = ?')) {
	// Bind parameters (s = string, i = int, b = blob, etc), hash the password using the PHP password_hash function.
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
		// Username exists
		$_SESSION['error'] = 'Username exists. Please try again.';
        header('Location: ../../public/editprofile.php');
        $stmt->close();
        $con->close();
        exit;
    }
    else {
        $stmt->close();
        // Username doesn't exists. Update database.
        $stmt = $con->prepare("UPDATE users SET username = ? WHERE User_Id = ?");
        $stmt->bind_param('ss', $_POST['username'], $_SESSION['userId']);
        $stmt->execute();

        //Update session variables
        $_SESSION['username'] = $_POST['username'];
        $_SESSION['error'] = "Το username σας άλλαξε επιτυχώς.";

        //Redirect
        header('Location: ../../public/editprofile.php');
    }
}
$stmt->close();
$con->close();