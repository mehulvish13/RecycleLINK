<html>
<head>
    <title>View Requests</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
            color: limegreen;
            font-family: monospace;
            font-size: 25px;
            
        }
        th {
            color: white;
            background-color: red;
        }
        h1 {
            color: blue;
        }
    </style>
    </head>
    <body>
        <br><center><h1>ENQUIERIES</h1></center><br>
    <table>
        <tr>
        <th>Name</th>
            <th>Contact number</th>
            <th>Email</th>
            <th>Address</th>
            <th>Type</th>
            <th>Weight</th>
            <th>Date and Time</th>
        </tr>
        <?php
        $conn =mysqli_connect("localhost","root","","project");
        if ($conn-> connect_error)
        {
            die("Connection Failed". $con-> connect_error);
        }
        $sql= "SELECT name,cno,email,address,type,weight,time from quries";
        $result = $conn -> query($sql);
        if($result-> num_rows > 0)
        {
            while ($row = $result-> fetch_assoc())
            {
                echo "<tr><td>" . $row["name"] ."</td><td>" . $row["cno"] . "</td><td>" . $row["email"] . "</td><td>" . $row["address"] . "</td><td>" . $row["type"] . "</td><td>" . $row["weight"] . "</td><td>" . $row["time"] . "</td></tr>";
            }
            
        }
        $conn-> close();
        ?>
        </table>
    </body>
</html>