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
    <link rel="stylesheet" href="../src/libs/css/editprofile.css">
    <link rel="stylesheet" href="../src/libs/css/style.css">
    <title>Επεξεργασία Προφίλ</title>
</head>
<body>
    <div class="box">
        <div class="row popup" id="offerpopup">
            <div class="col-12 popuptext" id="offerHistory">
            </div>
        </div>
        <div class="row popup" id="likespopup">
            <div class="col-12 popuptext" id="likesDislikes">
            </div>
        </div>
        <div class="row nav-bar" id='myTopnav'>
            <div class="col-1 col-m-1 col-s-1">
                <img class="logo" src="../src/stock_spirits_logo.svg.png" alt="Flowers in Chania">
            </div>
            <div class="col-9 col-m-9 col-s-9 blank">
            </div>
            <div class="col-2 col-m-2 col-s-2">
                <form name="form1" id="form1" method="post">
                    <select name="option" id="option" onchange="window.location.href=this.value;">
                        <option value="" disabled selected hidden>
                            <?php  
                                echo $_SESSION['username']
                            ?>
                        </option>
                        <option value="./map.php">Χάρτης</option>
                        <option value="../src/libs/logout.php">Αποσύνδεση</option>
                    </select>
                </form>
            </div>
        </div>
        <div class="row editprofile">
            <div class="col-1 col-m-3 col-s-0">
            </div>
            <div class="col-4-5 col-m-6 col-s-12">
                <div>
                    <main>
                    <form action="../src/libs/changeusername.php" method="post">
                        <h1>Αλλαγή ονόματος χρήστη</h1>
                        <br>
                        <div>
                            <label for="username">Νέο όνομα χρήστη:</label>
                            <input type="text" name="username" id="username" placeholder="<?php echo $_SESSION['username']?>">
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
                    <button type="submit">Αποθήκευση</button>
                    </form>
                    <form action="../src/libs/changepassword.php" method="post">
                        <h1>Αλλαγή κωδικού</h1>
                        <br>
                        <div>
                            <label for="oldpassword">Τρέχων κωδικός:</label>
                            <input type="password" name="oldpassword" id="oldpassword">
                        </div>
                        <div>
                            <label for="password">Νέος κωδικός:</label>
                            <input type="password" name="password" id="password">
                        </div>
                        <div>
                            <label for="password2">Επανάληψη κωδικού:</label>
                            <input type="password" name="password2" id="password2">
                        </div>
                        <?php
                            if (!empty($_SESSION['error2'])){
                        ?>
                        <div class="alert">
                        <?php
                            echo $_SESSION['error2'];
                            unset($_SESSION['error2']);
                        ?>
                        </div>                    
                        <?php
                            }
                        ?>
                        <button type="submit">Αποθήκευση</button>
                    </form>
                    </main>
                </div>
                <div>
                </div>
            </div>
            <div class="col-1 col-m-3 col-s-0">
            </div>
            <div class="col-0 col-m-3 col-s-0">
            </div>
            <div class="col-4-5 col-m-6 col-s-12">
                <div class="row" id="scoreNtokens">
                    <div class="col-6 col-m-6 col-s-6">
                        <div class="scoreNtokensTable" id='monthlyScore'></div>
                        <br>
                        <div class="scoreNtokensTable" id='monthlyTokens'></div>
                    </div>
                    <div class="col-6 col-m-6 col-s-6">
                        <div class="scoreNtokensTable" id='globalScore'></div>
                        <br>
                        <div class="scoreNtokensTable" id='globalTokens'></div>
                    </div>
                </div>
                <div class="row" id="historyButtons">
                    <div class="col-12 col-m-12 col-s-12">
                        <main>
                            <form>
                                <button class="button" onclick="window.location.href='#offerpopup';">Ιστορικό Προσφορών</button>
                                <br>
                                <button class="button" onclick="window.location.href='#likespopup';">Ιστορικό Likes/Dislikes</button>
                            </form>
                        </main>
                    </div>
                </div>
            </div>
            <div class="col-1 col-m-3 col-s-0">
            </div>
        </div>
        <script src="../src/inc/editprofile.js"></script>
    </div> 

    <?php
        $con->close();
    ?>
</body>
</html>