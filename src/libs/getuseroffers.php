<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT O.Offer_Id, O.Price, DATE_FORMAT(O.Date, '%d/%m/%Y') AS Date, O.Day_Check, O.Week_Check, O.Likes, O.Dislikes, O.Has_Stock, O.Is_Active, P.Product_Name, C.Category_Name, poi.Poi_Name FROM offers AS O JOIN products AS P ON O.Product_Id = P.Product_Id JOIN categories AS C ON P.Subcategory_Id = C.Category_Id JOIN poi ON O.Poi_Id = poi.Poi_Id WHERE O.User_Id = ? ORDER BY O.Date";

$stmt = $con->prepare($sql);
$stmt->bind_param('i', $_SESSION['userId']);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();