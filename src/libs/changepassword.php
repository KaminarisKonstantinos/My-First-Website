<?php
session_start();
include '../libs/connection.php';
//We check if the data was submitted, isset() function will check if the data exists.
if (!isset($_POST['password']) || !isset($_POST['password2'])) {
	// Could not get the data that should have been sent.
    $_SESSION['error2'] = 'Data could not be sent, please try again.';
    header('Location: ../../public/editprofile.php');
    $con->close();
    exit;
}
// Make sure the submitted registration values are not empty.
if (empty($_POST['password']) || empty($_POST['password2'])) {
	// One or more values are empty.
    $_SESSION['error2'] = 'Please fill in all fields.';
    header('Location: ../../public/editprofile.php');
    $con->close();
    exit;
}

//Check current password
if ($stmt = $con->prepare('SELECT password FROM users WHERE User_Id = ?')) {
	// Bind parameters (s = string, i = int, b = blob, etc), hash the password using the PHP password_hash function.
	$stmt->bind_param('s', $_SESSION['userId']);
	$stmt->execute();
    $result = $stmt->get_result();
    while($row = $result->fetch_assoc()) {
        if(!password_verify($_POST['oldpassword'], $row['password'])){
            // Wrong password
            $_SESSION['error2'] = 'Wrong password. Please try again.';
            header('Location: ../../public/editprofile.php');
            $stmt->close();
            $con->close();
            exit;
        }
        $stmt->close();
    }
}

// Validate password strength
$uppercase = preg_match('@[A-Z]@', $_POST['password']);
$number    = preg_match('@[0-9]@', $_POST['password']);
$specialChars = preg_match('@[^\w]@', $_POST['password']);
if(!$uppercase || !$number || !$specialChars || strlen($_POST['password']) < 8) {
    $_SESSION['error2'] = 'Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.';
	header('Location: ../../public/editprofile.php');
	$con->close();
  	exit;
}
// Make sure the passwords match
if ($_POST['password']!= $_POST['password2']) {
    $_SESSION['error2'] = 'Passwords do not match. Please try again.';
	header('Location: ../../public/editprofile.php');
	$con->close();
    exit;
}

$stmt = $con->prepare("UPDATE users SET password = ? WHERE User_Id = ?");
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$stmt->bind_param('ss', $password, $_SESSION['userId']);
$stmt->execute();

$_SESSION['error2'] = "Το password σας άλλαξε επιτυχώς.";

//Redirect
header('Location: ../../public/editprofile.php');

$stmt->close();
$con->close();