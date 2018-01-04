<?php
if(!defined('IN_T')){
	die('hacking attempt');
}
$word = Common::sfilter($_REQUEST['word']);
if (!empty($word)) {
	$size = 32; //定义每页显示10条
	$page = intval($_REQUEST['page']);

	$page = $page<1 ? 1 : $page;

	$res = search($word,$page,$size);
	$pages = Common::set_page($size,$page,$res['count']);
	foreach ($pages as $key => $value) {
		$pages[$key]['url'] = "/search?page=".$value['num'].$res['spm'];
	}
	$tp->assign("word",$word);
	$tp->assign("page",$page);
	$tp->assign("pages",$pages);
	$tp->assign("list",$res);
}

function search($word,$page=0,$size=32){
	$sql = $GLOBALS['Base']->table('worksmain').' WHERE name LIKE "%'.$word.'%"';
	$spm = "&word=$word";   //整合检索字符串
	
	$res['spm']= $spm;
	$res['count'] = $GLOBALS['Db']->query("SELECT COUNT(*) AS num FROM ".$sql,"One");
	$res['res'] = $GLOBALS['Db']->query('SELECT * FROM '.$sql." LIMIT ".($page-1)*$size.",".$size."","All");
	return $res;
}

?>