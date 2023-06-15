<?php
session_start();
include 'D:\xamp\htdocs\Web22-23\src\libs\connection.php';

$output = [];
$reactivateTable = [];
$deactivateTable = [];

$sql = "SELECT * FROM offers WHERE End_Date = ?";
$stmt = $con->prepare($sql);
$date = date("Y-m-d");
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

foreach ($output as $offer) {
    //Perform DayCheck
    $yesterday = date("Y-m-d", strtotime('-1 days'));
    $stmt = $con->prepare('SELECT Price FROM prices WHERE Product_Id=? AND Date=? ; ');
    $stmt->bind_param('ss', $offer["Product_Id"], $yesterday);
    $stmt->execute();
    $result = $stmt->get_result();
    $dayCheck = true;
    while($row = $result->fetch_assoc()) {
        $dayCheck = ($offer["Price"] < round(0.8 * $row['Price'], 2));
        break;
    }
    $stmt->close();

    //Perform WeekCheck
    $lastWeek = date("Y-m-d", strtotime('-7 days'));
    $stmt = $con->prepare('SELECT AVG(Price) AS Price FROM prices WHERE Product_Id=? AND Date BETWEEN ? AND ? ; ');
    $stmt->bind_param('sss', $offer["Product_Id"], $lastWeek, $yesterday);
    $stmt->execute();
    $result = $stmt->get_result();
    $weekCheck = true;
    while($row = $result->fetch_assoc()) {
        if ($row['Price'] == NULL) break;
        $weekCheck = ($offer["Price"] < round(0.8 * $row['Price'], 2));
        break;
    }

    $stmt->close();
    if ($dayCheck || $weekCheck) {
        array_push($reactivateTable, $offer["Offer_Id"]);
    }
    else {
        array_push($deactivateTable, $offer["Offer_Id"]);
    }
} 

if (count($reactivateTable)) {
    // Reactivate offers
    $parameters = str_repeat('?,', count($reactivateTable) - 1) . '?';
    $reactivateQuery = "UPDATE offers SET Update_Date = '$date', End_Date =  date_add(`End_Date`, INTERVAL 7 DAY) WHERE Offer_Id IN ($parameters)";
    $con->execute_query($reactivateQuery, $reactivateTable);
}

if (count($deactivateTable)) {
    // Deactivate offers
    $parameters = str_repeat('?,', count($deactivateTable) - 1) . '?';
    $deactivateQuerry = "UPDATE offers SET Is_Active = 0 WHERE Offer_Id IN ($parameters)";
    $con->execute_query($deactivateQuerry, $deactivateTable);
}

$con->close();