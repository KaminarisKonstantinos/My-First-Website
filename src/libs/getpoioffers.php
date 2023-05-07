<?php
session_start();
include './connection.php';
$output = [];

$sql = "SELECT O.Offer_Id, O.Price, DATE_FORMAT(O.Date, '%d/%m/%Y') AS Date, O.Day_Check, O.Week_Check, O.Likes, O.Dislikes, O.Has_Stock, U.Username, U.Global_Score, P.Product_Name, P.Product_Image, C.Category_Parent_Id, POI.Poi_Name, EXISTS(SELECT * FROM ratings AS R WHERE R.User_Id = ? AND R.Is_Positive = 1 AND R.Offer_Id = O.Offer_Id) AS User_Likes, EXISTS(SELECT * FROM ratings AS R WHERE R.User_Id = ? AND R.Is_Positive = 0 AND R.Offer_Id = O.Offer_Id) AS User_Dislikes FROM offers AS O JOIN users AS U ON O.User_Id = U.User_Id JOIN products AS P ON O.Product_Id = P.Product_Id JOIN categories AS C ON P.Subcategory_Id = C.Category_Id JOIN poi AS POI ON O.Poi_Id = POI.Poi_Id WHERE O.Is_Active = 1 AND O.Poi_Id = ? ";

$stmt = $con->prepare($sql);
$stmt->bind_param("iis", $_SESSION["userId"], $_SESSION["userId"], $_GET['poiId']);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();