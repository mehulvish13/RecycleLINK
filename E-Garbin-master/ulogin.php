<?php  
{
  
if(!empty($_POST['us']) && !empty($_POST['pa'])) {  
    
    $use=$_POST['us'];  
    $pas=$_POST['pa'];  
  
   $con=mysql_connect('localhost','root','');
    mysql_select_db('project') or die("cannot select DB");  
  
    $query=mysql_query("SELECT * FROM login WHERE uname='".$use."' AND pass='".$pas."'");  
    $numrows=mysql_num_rows($query);  
    if($numrows!=0)  
    {  
    while($row=mysql_fetch_assoc($query))  
    {  
    $dbusername=$row['uname'];  
    $dbpassword=$row['pass']; 
    }  
  
    if($use == $dbusername && $pas == $dbpassword)  
    {  
    session_start();  
  $_SESSION["new"]=$dbusername ; 
  
     
    header("Location: home.php");  
       
    }  
    } else {  
    echo "Invalid username or password!";  
    }  
  
} else {  
    echo "All fields are required!";  
}  
}  
?>  