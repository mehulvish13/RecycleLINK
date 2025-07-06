<html>
<body>
    <center>
    <?php
if(!empty($_POST['name']) && !empty($_POST['pno']) && !empty($_POST['email']) && !empty($_POST['add']) && !empty($_POST['type']) && !empty($_POST['weight'])) 
{  
        $n=$_POST['name'];
        $p=$_POST['pno'];
        $e=$_POST['email'];
        $a=$_POST['add'];
        $t=$_POST['type'];
        $w=$_POST['weight'];
        
        $con=mysql_connect('localhost','root','');
        mysql_select_db('project');
        mysql_query("INSERT INTO `project`.`quries` (`name`,`cno`,`email`,`address`,`type`,`weight`)
        VALUES('$n','$p','$e','$a','$t','$w');");
        echo 'Enquiery Submitted Sucessfully!!   CR will Contact you soon.' ;
    
        mysql_close($con);
}
 else echo"Fields Can't Be Empty"   
?>
    <br>
    
  <a href="index.html">Click Here To Fill Enquiry Form Again If Not</a>
    </center>
    
    </body>
</html>
<script>
function myFunction() {
  alert("Hello! I am an alert box!");
}</script>
