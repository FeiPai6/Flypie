<?php
//设置模板
if(!defined('IN_T')){
   die('禁止访问！');
}

$unique = Common::sfilter($_REQUEST['unique']);

if(empty($unique)){
	$themes_xml = simplexml_load_file(ROOT_PATH.'template/templates.conf', 'SimpleXMLElement', LIBXML_NOCDATA);
	foreach($themes_xml as $v){
		$theme = (array)$v;
		if($theme['code']==$_lang['moban']){
			$theme_cur = $theme;
		}
		$themes[] = $theme;
	}
	$tp->assign('theme_cur',$theme_cur);
	$tp->assign('themes',$themes);
}
else{
	$sql = "replace into ".$Base->table('site_config')." (`parent_id`,`name`,`value`) values ('','moban','$unique')";
	//echo $sql; exit;
	$Db->execSql($sql);
	Common::base_header("Location:".$_lang['host'].$_lang['admin_path']."/?m=theme\n");
}
$tp->assign('nav','设置模板');
?>