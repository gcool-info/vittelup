<?php

/********************************************************************************
* Vittel Up                                                                     *
* Project for Vittel to track dehydration and water consumption using an        *
* arduino Yun and a 1.5 watter bottle.                                          *
*                                                                               *
* Copyright (C) 2014 George Koulouris (george.koulouris1@gmail.com)             * 
*                                                                               *
* License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html> *
* This is free software: you are free to change and redistribute it.            *
* There is NO WARRANTY, to the extent permitted by law.                         *
*                                                                               *
*********************************************************************************/

/* Check whether the yun has posted a GET command */
if (isset($_GET['dehydration']) && isset($_GET['drink'])) {

	// Connext to the databes
    $pdo=new PDO("mysql:dbname=YOUR_DB_NAME;host=YOUR_HOST","YOUR_USER","YOUR_PSW");

    // Update the database values
    $sql = 'UPDATE vittelup SET Dehydration='.htmlspecialchars($_GET['dehydration']).', Drink='.htmlspecialchars($_GET['drink']).' WHERE ID=1';

    $statement=$pdo->prepare($sql);
	$statement->execute();

	mysql_close($pdo);

}

?>
