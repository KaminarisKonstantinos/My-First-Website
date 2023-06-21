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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://www.phptutorial.net/app/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/editprofile.css">
    <link rel="stylesheet" href="../src/libs/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/style1.css">
    <link rel="stylesheet" href="../src/libs/css/addOffer.css">
    <title>Προσθήκη Προσφοράς</title> 
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
                        <option value="./map.php">Χάρτης</option>
                        <option value="./editprofile.php">Επεξεργασία Προφίλ</option>
                        <option value="../src/libs/logout.php">Αποσύνδεση</option>
                    </select>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-1 col-l-1 col-m-1 col-s-1">
            </div>
            <div class="col-10 col-l-10 col-m-10 col-s-10 addOfferBox"> 
            <h1>Προσθήκη Προσφοράς</h1>
            <h2 id='poiName'></h2>
                <div class="col-6 col-l-6 col-m-12 col-s-12 categoryBox">
                    <main>
                        <form method="post">
                            <label for="product">&nbsp;Αναζήτηση με κατηγορίες:</label>
                            <div class="menu">
                                <div id='mainCategoriesContainer'>
                                </div>
                                <div id='subcategoriesContainer'>
                                </div>
                                <div id='productsContainer'>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
                <div class="col-6 col-l-6 col-m-12 col-s-12">
                    <main>
                        <form method="post">
                            <label for="product">&nbsp;Αναζήτηση με όνομα:</label>
                            <input name="inputbox" type="text" placeholder="Αναζήτησε για ένα προϊόν..">
                            <button style="all:unset;" onclick="searchByName(this.form);return false"><i class="fa fa-search"></i></button>
                            <div id='searchProductsContainer'>
                            </div>
                        </form>
                    </main>
                </div>
                <div class="col-12 col-l-12 col-m-12 col-s-12">
                    <main>
                        <form id='submitForm' method="post">
                            <div>
                                <label for="product">Προϊόν:</label>
                                <textarea type="text" name="product" id="productName" readonly disabled>
                                </textarea>
                                <input type="text" name="product" id="product" hidden>
                            </div>
                            <div>
                                <label for="price">Τιμή (σε €):</label>
                                <input type="text" name="price" id="price">
                            </div>
                            <?php
                                if (!empty($_SESSION['error'])){
                            ?>
                            <div class="alert">
                            <?php
                                echo $_SESSION['error'];
                                unset($_SESSION['error']);
                            ?>
                            </div>
                            <?php
                                }
                            ?>
                            <button type="submit">Υποβολή</button>
                        </form>
                    </main>
                </div>
            </div>
            <div class="col-1 col-l-1 col-m-1 col-s-1">
            </div>
        </div>
    </div>
    <?php
        $con->close();
    ?>
    <script src="../src/inc/addOffer.js"></script> 
</body>
</html>