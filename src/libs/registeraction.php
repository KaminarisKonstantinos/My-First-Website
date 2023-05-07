<?php
session_start();
include '../libs/connection.php';
// Now we check if the data was submitted, isset() function will check if the data exists.
if (!isset($_POST['username'], $_POST['password'], $_POST['password2'],$_POST['email'])) {
	// Could not get the data that should have been sent.
  $_SESSION['error'] = 'Data could not be sent, please try again.';
  header('Location: ../../public');
  $con->close();
  exit;
}
// Make sure the submitted registration values are not empty.
if (empty($_POST['username']) || empty($_POST['password']) || empty($_POST['password2']) ||empty($_POST['email'])) {
	// One or more values are empty.
 	$_SESSION['error'] = 'Please fill in all fields.';
	header('Location: ../../public');
	$con->close();
  exit;
}
// Make sure the email if of valid form.
if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
	$_SESSION['error'] = 'Please enter a valid email.';
	header('Location: ../../public');
	$con->close();
  	exit;
}
// Validate password strength
$uppercase = preg_match('@[A-Z]@', $_POST['password']);
$number    = preg_match('@[0-9]@', $_POST['password']);
$specialChars = preg_match('@[^\w]@', $_POST['password']);
if(!$uppercase || !$number || !$specialChars || strlen($_POST['password']) < 8) {
  $_SESSION['error'] = 'Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.';
	header('Location: ../../public');
	$con->close();
  	exit;
}
// Make sure the passwords match
if ($_POST['password']!= $_POST['password2']) {
    $_SESSION['error'] = 'Passwords do not match. Please try again.';
	header('Location: ../../public');
	$con->close();
    exit;
  }
// We need to check if the account with that username exists.
if ($stmt = $con->prepare('SELECT user_id, password FROM users WHERE username = ?')) {
	// Bind parameters (s = string, i = int, b = blob, etc), hash the password using the PHP password_hash function.
	$stmt->bind_param('s', $_POST['username']);
	$stmt->execute();
	$stmt->store_result();
	// Store the result so we can check if the account exists in the database.
	if ($stmt->num_rows > 0) {
		// Username already exists
		$_SESSION['error'] = 'Username exists. Please use another.';
	  	header('Location: ../../public');
		$stmt->close();
	  	$con->close();
    	exit;
	} else {
	  	// Username doesn't exist, insert new account
    	if ($stmt = $con->prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)')) {
	    	// We do not want to expose passwords in our database, so hash the password and use password_verify when a user logs in.
	    	$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
	    	$stmt->bind_param('sss', $_POST['username'], $password, $_POST['email']);
	    	$stmt->execute();
	    	header('Location: ../../public/login.php');
    	} else {
	  		// Something is wrong with the SQL statement
	  		$_SESSION['error'] = 'Problem with the database. Please try again.';
	  		header('Location: ../../public');
			$stmt->close();
	  		$con->close();
    		exit;
		}
  	}
	$stmt->close();
} else {
	// Something is wrong with the SQL statement
	$_SESSION['error'] = 'Problem with the database. Please try again.';
	header('Location: ../../public');
	$con->close();
  	exit;
}
$con->close();
?>