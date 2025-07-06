<?php
if(isset($_POST["submit"]))
{
    if(!empty($_POST['user']) && !empty($_POST['pass']) )
    {
        $b=$_POST['user'];
        $c=$_POST['pass'];
        
        $con=mysql_connect('localhost','root','');
        mysql_select_db('project');
        mysql_query("INSERT INTO `project`.`login` (`uname`,`pass`) VALUES('$b','$c');");
        echo 'Registration Successfull!!' ;
        mysql_close($con);
        
    }
}