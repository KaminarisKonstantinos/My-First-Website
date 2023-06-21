<?php
    session_start();
    if (!$_SESSION['userId']) {
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
    <link rel="stylesheet" href="https://www.phptutorial.net/app/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/editprofile.css">
    <link rel="stylesheet" href="../src/libs/css/rating.css">
    <link rel="stylesheet" href="../src/libs/css/style.css">
    <title>Αξιολόγηση</title> 
</head>
<body>
    <div class="box">
        <div class="row popup" id="offerPopup">
            <div class="col-12 popuptext" id="offerDetails">
            </div>
        </div>
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
                        <option value="./map.php">Χάρτης</option>
                        <option value="./editprofile.php">Επεξεργασία Προφίλ</option>
                        <option value="../src/libs/logout.php">Αποσύνδεση</option>
                    </select>
                </form>
            </div>
        </div>
        <div class="row rating">
            <div class="col-12 col-l-12 col-m-12 col-s-12" id="offersTable">
            </div>
        </div>
    </div>
    <?php
        $con->close();
    ?>
    <script src="../src/inc/rating.js"></script> 
</body>
</html>