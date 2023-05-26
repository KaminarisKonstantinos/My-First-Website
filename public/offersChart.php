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
    <link rel="stylesheet" href="../src/libs/css/leaderboard.css">
    <title>Register</title>
</head>
<body>
    <div class='box'>
        <div class="row nav-bar">
            <div class="col-1 col-l-1 col-m-1 col-s-1">
                <img class="logo" src="../src/stock_spirits_logo.svg.png" alt="Flowers in Chania">
            </div>
            <div class="col-9 col-l-9 col-m-9 col-s-9">
            </div>
            <div class="col-2 col-l-2 col-m-2 col-s-2">
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
            <canvas id="line-chart" width='' height='130'></canvas>
        </div>
        
        <script src="../src/inc/offersChart.js"></script>
    </div>
</body>
</html> 