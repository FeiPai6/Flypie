<?php

	define('IN_T',true);
	require("../../../source/include/init.php");

	$arr = array();
	$refer = $_SERVER['HTTP_REFERER'];
	if (!empty($refer)) {
		$viewid = substr($refer,strrpos($refer,"/")+1);
		$custom_right = $Db->query('SELECT p.custom_right_button FROM '.$Base->table('pano_config').' p LEFT JOIN '.$Base->table('worksmain').' w ON p.pk_works_main = w.pk_works_main WHERE w.view_uuid = "'.$viewid.'"',"One");
		if (!empty($custom_right)) {
			$arr = $Json->decode($custom_right);
			$arr = $arr['linkSettings'];
			
		}
	}
	foreach ($arr as &$v) {
		$v['name'] = Common::guid(16);
		if (Common::is_mobile($v['content'])) {
			$v['content'] = 'tel://'.$v['content'];
		}else if(!(strpos("http://",$v['content'])===0)){
			$v['content'] = 'http://'.$v['content'];
		}
	}
	$tp->assign('arr',$arr);
	$tp->display('plugin.xml');

?>