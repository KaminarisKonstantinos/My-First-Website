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
    <link rel="stylesheet" href="https://www.phptutorial.net/app/css/style.css">

    <title>Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
     integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
     crossorigin=""/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../src/libs/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/map.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
    integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
    crossorigin=""></script>
</head>
<body>
    <div class="box">
        <div class="row" id="demo">
        </div>
        <div class="row nav-bar" id = 'myTopnav'>
            <div class="col-1 col-m-1 col-s-1">
                <img class="logo" src="../src/stock_spirits_logo.svg.png" alt="Flowers in Chania">
            </div>
            <div class="col-1 blank">
            </div>
            <div class="col-3 col-m-12 col-s-12">
                <form id="poifilter" method="POST">
                    <input name="inputbox" type="text" placeholder="Αναζήτησε για ένα κατάστημα..">
                    <button style="all:unset;" onclick="searchByName(this.form);return false"><i class="fa fa-search"></i></button>
                </form>
            </div>
            <div class="col-1 col-m-1 col-s-3 blank">
            </div>
            <div class="col-3 col-m-12 col-s-12">
                <form name="categoryform" id="categoryform">
                </form>
            </div>
            <div class="col-1 col-m-1 col-s-9 blank">
            </div>
            <div class="col-2 col-m-12 col-s-12">
                <form name="form1" id="form1" method="post">
                    <select name="option" id="option" onchange="window.location.href=this.value;">
                        <option value="" disabled selected hidden>
                            <?php  
                                echo $_SESSION['username']
                            ?>
                        </option>
                        <?php  
                                if ($_SESSION['isAdmin']) {
                        ?>
                        <option value="./admin.php">Main Admin</option>
                        <?php  
                                } else {
                        ?>
                        <option value="./editprofile.php">Επεξεργασία Προφίλ</option>
                        <?php  
                                }
                        ?>
                        <option value="../src/libs/logout.php">Logout</option>
                    </select>
                </form>
            </div>
            <a href="javascript:void(0);" class="icon" onclick="responsive()">
                <i class="fa fa-bars"></i>
            </a>
        </div>
        <div class="row" id="mapContainer">
            <div class="col-12 col-m-12 col-s-12" id="map"></div>
            <button onclick='mapRecenter1()' id="mapRecenter">
                <img src="../src/maprecenterbutton.png" id="buttonicon" alt="buttonpng"/>
            </button>
        </div>    
        <script src="../src/inc/map.js"></script> 
        <?php
            $con->close();
        ?>
    </div>
</body>
</html>