<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT Offer_Id, Date, End_Date FROM offers WHERE (Update_Date BETWEEN ? AND ?) OR (Date BETWEEN ? AND ?)";

$prevYear = 1;
$prevMonth = 1;
$prevDate = 1;

$stmt = $con->prepare($sql);
switch ($_GET['month']){
    case 1 : 
        $prevYear = $_GET['year']-1;
        $prevMonth = 12;
        $prevDate = 26;
        break;
    case 2:
    case 4:
    case 6:
    case 8:
    case 9:
    case 11:
        $prevYear = $_GET['year'];
        $prevMonth = $_GET['month']-1;
        $prevDate = 26;
        break;
    case 5:
    case 7:
    case 10:
    case 12:
        $prevYear = $_GET['year'];
        $prevMonth = $_GET['month']-1;
        $prevDate = 25;
        break;
    case 3:
        $prevYear = $_GET['year'];
        $prevMonth = $_GET['month']-1;
        $prevDate = 25;
        break;
    default:
        break;
}
$tmp1 = $prevYear.'-'.$prevMonth.'-'.$prevDate;
$tmp2 = $_GET['year'].'-'.$_GET['month'].'-'.'31';
$stmt->bind_param("ssss", $tmp1, $tmp2, $tmp1, $tmp2);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();