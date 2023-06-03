<?php
session_start();
include './connection.php';
$output = [];

if ($_GET['categoryId'] == "ALL") {
    $sql = "SELECT O.Offer_Id, O.Product_Id, O.Date, O.End_Date, O.Price FROM offers as O WHERE (Update_Date BETWEEN ? AND ?) OR (Date BETWEEN ? AND ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ssss", $_GET['startDate'], $_GET['endDate'], $_GET['startDate'], $_GET['endDate']);
}
else if (!$_GET['isParent']) {
    $sql = "SELECT O.Offer_Id, O.Product_Id, O.Date, O.End_Date, O.Price FROM offers as O JOIN products AS P ON O.Product_ID = P.Product_Id JOIN categories AS C ON P.Subcategory_Id = C.Category_Id WHERE ((O.Update_Date BETWEEN ? AND ?) OR (O.Date BETWEEN ? AND ?)) AND C.Category_Id = ?; ";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssss", $_GET['startDate'], $_GET['endDate'], $_GET['startDate'], $_GET['endDate'], $_GET['categoryId']);
}
else {
    $sql = "SELECT O.Offer_Id, O.Product_Id, O.Date, O.End_Date, O.Price FROM offers as O JOIN products AS P ON O.Product_ID = P.Product_Id JOIN categories AS C ON P.Subcategory_Id = C.Category_Id WHERE ((O.Update_Date BETWEEN ? AND ?) OR (O.Date BETWEEN ? AND ?)) AND C.Category_Parent_Id = ?; ";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssss", $_GET['startDate'], $_GET['endDate'], $_GET['startDate'], $_GET['endDate'], $_GET['categoryId']);
}

$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();