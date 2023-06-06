<?php
session_start();
include './connection.php';
$output = [];

$begin = $_GET['startDate'];
$end = date('Y-m-d', strtotime($begin. ' + 6 days'));
if (!$_GET['isParent']) {
    $stmt = $con->prepare('SELECT Product_Id, AVG(Price) AS AvgPrice FROM prices WHERE Date BETWEEN ? AND ? AND EXISTS (SELECT Product_Id from products WHERE prices.Product_Id = products.Product_Id AND Subcategory_Id = ?) GROUP BY Product_Id; ');
}
else {
    $stmt = $con->prepare('SELECT Product_Id, AVG(Price) AS AvgPrice FROM prices WHERE Date BETWEEN ? AND ? AND EXISTS (SELECT Product_Id from products WHERE prices.Product_Id = products.Product_Id AND EXISTS (SELECT Category_Id from categories WHERE categories.Category_Id = products.Subcategory_Id AND categories.Category_Parent_Id=?  ) ) GROUP BY Product_Id; ');
}
$stmt->bind_param('sss', $begin, $end, $_GET['categoryId']);
//var_dump($stmt);
$stmt->execute();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
    $output[] = $row;
}
$stmt->close();

echo json_encode($output);

$con->close();