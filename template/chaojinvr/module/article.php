<?php
//文章
if(!defined('IN_T')){
	die('hacking attempt');
}

$aid = intval($_REQUEST['aid']);
$a = $Db->query("select * from ".$Base->table('article')." where id=$aid","Row");
$tp->assign('a',$a);

?>