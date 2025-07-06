<html>
<head>
    <title>Login</title>
<style>
    body {
            background-color:antiquewhite;
    }
    p {
        color: black;
        background-color: cornflowerblue;
        font-size:inherit;
    }
div {
  background-color:cornflowerblue;
    line-height: 35px;
  width: 500px;
  border: 15px solid brown;
  padding: 30px;
  margin:auto;
    margin-top: 100px
        
}
    a {
        font-size: 20px;
        text-decoration-color: black;
        
    }
</style>
    
</head>
<body>
    <a href="index.html" style="text-align:left; width:100%;height:50px; color:brown;font-size:50px"; font-size:35px>E-GARBIN</a>
   <p style=" text-align:center; margin-top: 0px; background-color: lightgray
  width: 500px;
  border:0px;
  padding: 30px;
  margin:auto;font-size: 20px">WELLCOME USER: <?php
            session_start();  
            echo $_SESSION["new"];
            ?></p>     
   
            
    </div>

    <div id="d1" style="text-color:green;text-align:center;">
    <h4 style="text-align:center; font-size:25px">AVALABLE SERVICES</h4>
    <a href="crreg.html">REGISTER NEW CR</a><br>
    <a href="showrequest.php">QURIES</a><br>
    <a href="#">ASSIGN JOB</a>
    </div>
    </body>
</html>