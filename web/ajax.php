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

	switch($_SERVER['REQUEST_METHOD']){
	    case 'POST':
	        save();
	    break;
	 
	    case 'GET':
	        fetch();
	    break;
	 
	    case 'PUT':
	        update();
	    break;
	 
	    case 'DELETE':
	        delete();
	    break;
	 
	    default:
	        echo "Shit, something went wrong...!";
	    break;
	}

	function update() {

	}

	function fetch() {
		// Connect to the database
    	$pdo=new PDO("mysql:dbname=YOUR_DB_NAME;host=YOUR_HOST","YOUR_USER","YOUR_PSW");

    	$sql = 'Select Drink, Dehydration From vittelup where ID=1';

    	$statement=$pdo->prepare($sql);
		$statement->execute();

	    $results=$statement->fetchAll(PDO::FETCH_ASSOC);
 
	    die(json_encode($results));
	}

	function save() {

	}
?>
