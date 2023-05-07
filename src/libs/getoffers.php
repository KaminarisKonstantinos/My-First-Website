<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT O.Offer_Id, O.Poi_Id, O.Price, DATE_FORMAT(O.Date, '%d/%m/%Y') AS Date, O.Day_Check, O.Week_Check, O.Likes, O.Dislikes, O.Has_Stock, U.Username, P.Product_Name, C.Category_Parent_Id FROM offers AS O JOIN users AS U ON O.User_Id = U.User_Id JOIN products AS P ON O.Product_Id = P.Product_Id JOIN categories AS C ON P.Subcategory_Id = C.Category_Id WHERE O.Is_Active = 1 ORDER BY O.Poi_Id";

$stmt = $con->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();