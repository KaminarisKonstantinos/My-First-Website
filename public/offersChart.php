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
    <link rel="stylesheet" href="../src/libs/css/offersChart.css">
    <title>Offers Chart</title>
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
                <select class="form-select" id="month" name="month" onchange='refreshChart(this.value, 1)'>
                    <option value="" disabled selected hidden>Διάλεξε μήνα</option>
                    <option value=0>Ιανουάριος</option>
                    <option value=1>Φεβρουάριος</option>
                    <option value=2>Μάρτιος</option>
                    <option value=3>Απρίλιος</option>
                    <option value=4>Μάιος</option>
                    <option value=5>Ιούνιος</option>
                    <option value=6>Ιούλιος</option>
                    <option value=7>Αύγουστος</option>
                    <option value=8>Σεπτέμβριος</option>
                    <option value=9>Οκτώβριος</option>
                    <option value=10>Νοέμβριος</option>
                    <option value=11>Δεκέμβριος</option>
                </select>
            </div>
            <div class="col-1 col-m-1 col-s-3 blank">
            </div>
            <div class="col-3 col-m-12 col-s-12">
                <select class="form-select" id="year" name="year" onchange='refreshChart(this.value, 2)'>
                </select>
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
            <canvas id="line-chart" maintainAspectRatio=false></canvas>
        </div>
    </div>
    <script src="../src/inc/offersChart.js"></script>
</body>
</html> 