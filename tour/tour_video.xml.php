<?php
define('IN_T',true);
require("../source/include/init.php");

$url =substr($_lang["cdn_host"],0,-1); 
header( 'Access-Control-Allow-Origin:'.$url.'' );
$vid = intval($_REQUEST['vid']);


$project =  $Db->query("select * from ".$Base->table('video')." where id=$vid","Row");
if(!empty($project)){
	$project['videos'] = $Json->decode($project['videos']);	
}
$tp->assign('cdn_host',empty($project['cdn_host'])?$_lang['cdn_host']:$project['cdn_host']);
$tp->assign("project",$project);
$tp->setTemplateDir(ROOT_PATH.'tour');
$tp->display('tour_video.xml');
?>