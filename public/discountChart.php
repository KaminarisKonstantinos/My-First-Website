<?php
    session_start();
    if (!$_SESSION['userId'] | !$_SESSION['isAdmin']) {
        header('Location: ./');
    }
    include '../src/libs/connection.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
    <link rel="stylesheet" href="https://www.phptutorial.net/app/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/style1.css">
    <link rel="stylesheet" href="../src/libs/css/discountChart.css">
    <title>Discount Chart</title>
</head>
<body>
    <div class='box' id='box'>
        <div class="row nav-bar" id = 'myTopnav'>
            <div class="col-1 col-m-1 col-s-1">
                <img class="logo" src="../src/stock_spirits_logo.svg.png" alt="Flowers in Chania">
            </div>
            <div class="col-1 blank">
            </div>
            <div class="col-3 col-m-12 col-s-12">
                <form name="categoryform" id="categoryform">
                </form>
            </div>
            <div class="col-1 col-m-1 col-s-3 blank">
            </div>
            <div class="col-3 col-m-12 col-s-12">
                <form name="subcategoryForm" id="subcategoryForm">
                </form>
            </div>
            <div class="col-1 col-m-1 col-s-9 blank">
            </div>
            <div class="col-2 col-m-12 col-s-12">
            <form name="form1" id="form1" method="post">
                    <select name="option" id="option" onchange="window.location.href=this.value;">
                        <option value="" disabled selected hidden>
                            <?php  
                                echo $_SESSION['username'];
                            ?>
                        </option>
                        <option value="./admin.php">Main Admin</option>
                        <option value="../src/libs/logout.php">Logout</option>
                    </select>
                </form>
            </div>
        </div>
        <div class='row' id='chartContainer'>
            <header id='chartPlaceholder'>Διάλεξε κατηγορία για την εμφάνιση δεδομένων.</header>
            <canvas id="line-chart" maintainAspectRatio=false></canvas>
        </div>
        <div class='row navButtons' id='navButtons'>
            <button class='nav-button disabled' id='back' disabled><</button>
            <button class='nav-button disabled' id='forward' disabled>></button>
        </div>
    </div>
    <script src="../src/inc/discountChart.js"></script>
</body>
</html> 