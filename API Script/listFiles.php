<?php
require_once('getid3/getid3.php');

$getID3 = new getID3;
$whichDir = $_GET['path'];
$pathToGet;

if(isset($whichDir)){
	$pathToGet = 'music/' . $whichDir . '/';
} else {
	$pathToGet = 'music/';
}

$output;

if ($handle = opendir($pathToGet)) {
	$entries = array();
    while (false !== ($entry = readdir($handle))) {

		if($entry == '.' || $entry == '..'){
			continue;
		}
		$dName = $pathToGet . $entry;
		$type;
		if(is_dir($dName)){
			$type = "folder";
			$thisItem = array("type" => $type, "title" => $entry);
		} else {
			$type = "file";
			$id3tags = $getID3->analyze($dName);
			//We need to create a temporary filePath and pass it to the JSON object which then changes the various elements
			
			$file = 'temp/cover' . time() . '.jpeg';
			$current = $id3tags["comments"]["picture"][0]["data"];
			// Write the contents back to the file
			file_put_contents($file, $current);

			//Here we get the ID3 info of the track || the filename if the track isnt present
			if($id3tags['tags']['quicktime']['title'][0] == null || $id3tags['tags']['quicktime']['title'][0] == undefined){
				$title = $id3tags['id3v1']['title'];
			} else {
				$title = $id3tags['tags']["quicktime"]["title"][0];
			}
			
			
			
			if($title == null){
				$title = $entry;
			}
			
			$thisItem = array("type" => $type, "title" => $title, "filename" => $entry, "artwork" => $file);
		}

		array_push($entries, $thisItem);
		
    }
	
	$output = array("entries" => $entries);
	
    closedir($handle);
	echo json_encode($output);
}
