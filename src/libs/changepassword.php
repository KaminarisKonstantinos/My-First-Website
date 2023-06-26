<?php
session_start();
include '../libs/connection.php';
//We check if the data was submitted, isset() function will check if the data exists.
if (!isset($_POST['password']) || !isset($_POST['password2'])) {
	// Could not get the data that should have been sent.
    $_SESSION['error2'] = 'Πρόβλημα με την αποστολή δεδομένων, προσπαθήστε ξανά.';
    header('Location: ../../public/editprofile.php');
    $con->close();
    exit;
}
// Make sure the submitted registration values are not empty.
if (empty($_POST['password']) || empty($_POST['password2'])) {
	// One or more values are empty.
    $_SESSION['error2'] = 'Παρακαλώ συμπληρώστε όλα τα πεδία.';
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
            $_SESSION['error2'] = 'Ο τρέχων κωδικός είναι λάθος. Παρακαλώ προσπαθήστε ξανά.';
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
    $_SESSION['error2'] = 'Ο κωδικός πρέπει να έχει μήκος τουλάχιστον 8 χαρακτήρες και να περιέχει ένα κεφαλαίο γράμμα, ένα νούμερο και έναν ειδικό χαρακτήρα.';
	header('Location: ../../public/editprofile.php');
	$con->close();
  	exit;
}
// Make sure the passwords match
if ($_POST['password']!= $_POST['password2']) {
    $_SESSION['error2'] = 'Οι κωδικοί δεν ταιριάζουν. Παρακαλώ προσπαθήστε ξανά.';
	header('Location: ../../public/editprofile.php');
	$con->close();
    exit;
}

$stmt = $con->prepare("UPDATE users SET password = ? WHERE User_Id = ?");
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$stmt->bind_param('ss', $password, $_SESSION['userId']);
$stmt->execute();

$_SESSION['error2'] = "Ο κωδικός σας άλλαξε επιτυχώς.";

//Redirect
header('Location: ../../public/editprofile.php');

$stmt->close();
$con->close();