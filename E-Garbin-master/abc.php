<?php 
session_start();
include "dbconfigure.php";
if(verifyuser())
{
$name = $_SESSION['sun'];
}
else
{
header("location:index.php");
}
?>
<html>
<head>
<?php include "header.php"; ?>

  <link rel = stylesheet href="https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css">
<link rel = stylesheet href="https://cdn.datatables.net/buttons/1.6.1/css/buttons.dataTables.min.css">

<script src = https://code.jquery.com/jquery-3.3.1.js></script>
<script src = https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js></script>
<script src = https://cdn.datatables.net/buttons/1.6.1/js/dataTables.buttons.min.js></script>
<script src = https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js></script>
<script src = https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js></script>
<script src = https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js></script>
<script src = https://cdn.datatables.net/buttons/1.6.1/js/buttons.html5.min.js></script>





<script>
$(document).ready(function() {
    $('#example').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
        ]
    } );
} );
</script>

</head>
<body>
<?php include "nav2.php";
echo "<br>Welcome <b style = 'text-transform : capitalize ; color : blue'>$name</b>";
 ?>


<div class="container" style = "margin-top:10px">
<h2 class="text-center" style = "font-family : Monotype Corsiva ; color : red">View Employee</h2>
<BR>
<?php 
$query = "select * from employee";
$rs = my_select($query);
echo "<table class='table table-hover' id = example>";
echo "<thead style = 'background-color : red ; color : white'>";
echo "<tr>";
echo "<th>Name</th>";
echo "<th>Password</th>";
echo "<th>Email ID</th>";
echo "<th>DateofBirth</th>";
echo "<th>Gender</th>";
echo "<th>Department</th>";
echo "<th>Designation</th>";
echo "<th>Address</th>";
echo "<th>Contact No.</th>";
echo "<th>Delete</th>";
echo "</tr>";
echo "</thead>";

echo "<tbody>";
while($row = mysqli_fetch_array($rs,MYSQLI_NUM))
{
echo "<tr>";
echo "<td>$row[0]</td>";
echo "<td>$row[1]</td>";
echo "<td>$row[2]</td>";
echo "<td>$row[3]</td>";
echo "<td>$row[4]</td>";
echo "<td>$row[5]</td>";
echo "<td>$row[6]</td>";
echo "<td>$row[7]</td>";
echo "<td>$row[8]</td>";
echo "<td><a href = 'deleteemployee.php?id=$row[2]' class='btn btn-danger'>Delete</a></td>";
echo "</tr>";
echo "</tr>";
}
echo "</tbody>";

echo "</table>";
?>



</div>
</body>
</html>
