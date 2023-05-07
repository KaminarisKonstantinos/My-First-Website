<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://www.phptutorial.net/app/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/style.css">
    <link rel="stylesheet" href="../src/libs/css/style1.css">
    <title>Register</title>
</head>
<body>
<div class="row nav-bar">
    <div class="col-1 col-l-1 col-m-1 col-s-1">
        <img class="logo" src="../src/stock_spirits_logo.svg.png" alt="Flowers in Chania">
    </div>
    <div class="col-11 col-l-11 col-m-11 col-s-11">
    </div>
</div>
<div class="row">
    <div class="col-4 col-l-3 col-m-3 col-s-2">   
    </div>
    <div class="col-4 col-l-6 col-m-6 col-s-8">   
        <main>
            <form action="../src/libs/registeraction.php" method="post">
                <h1>Sign Up</h1>
                <div>
                    <label for="username">Username:</label>
                    <input type="text" name="username" id="username">
                </div>
                <div>
                    <label for="email">Email:</label>
                    <input type="email" name="email" id="email">
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" name="password" id="password">
                </div>
                <div>
                    <label for="password2">Password Again:</label>
                    <input type="password" name="password2" id="password2">
                </div>
                <?php
                    session_start();
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
                <button type="submit">Register</button>
                <footer>Already a member? <a href="login.php">Login here</a></footer>
            </form>
        </main>
    </div>
    <div class="col-4 col-l-3 col-m-3 col-s-2">   
    </div>
</div>
</body>
</html>