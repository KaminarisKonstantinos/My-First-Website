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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://www.phptutorial.net/app/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/style1.css">
    <link rel="stylesheet" href="../src/libs/css/admin.css">
    <title>Admin</title> 
</head>
<body>
    <div class="box">
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
                        <option value="../src/libs/logout.php">Logout</option>
                    </select>
                </form>
            </div>
        </div>
        <div class='adminOptions'>
            <div class='uploadSection'>
                <div class='categoriesManagement'>
                    <header>Κατηγορίες</header>
                    <form id='categoryForm' action="../uploadFiles/categories.json" method="post" enctype="multipart/form-data">
                        <div class='t'>
                            <input id="file" name="file" type="file" />
                        </div>
                        <div class='t'>
                            <button><i class="fa fa-cloud-upload"></i></button>
                        </div>
                    </form>
                    <button class='delete'>Διαγραφή όλων</button>
                </div>
                <div class='productsManagement'>
                    <header>Προϊόντα</header>
                    <form id='productForm' action="/api" method="post" enctype="multipart/form-data">
                        <div class='t'>
                            <input id="file" name="file" type="file" />
                        </div>
                        <div class='t'>
                            <button><i class="fa fa-cloud-upload"></i></button>
                        </div>
                    </form>
                    <button class='delete'>Διαγραφή όλων</button>
                </div>
                <div class='poisManagement'>
                    <header>Points of Interest</header>
                    <form id='poiForm' action="/api" method="post" enctype="multipart/form-data">
                        <div class='t'>
                            <input id="file" name="file" type="file" />
                        </div>
                        <div class='t'>
                            <button><i class="fa fa-cloud-upload"></i></button>
                        </div>
                    </form>
                    <button class='delete'>Διαγραφή όλων</button>
                </div>
            </div>
            <div class='menuSection'>
            </div>
        </div>
    </div>
    <?php
        $con->close();
    ?>
    <script src="../src/inc/admin.js"></script> 
</body>
</html>