<?php

define('IN_T',true);
require_once "./source/include/init.php";

$act =  Common::sfilter($_REQUEST['act']);
$oid = intval($_REQUEST['oid']);

if($act =='init_obj'){
	$obj = $Db->query('SELECT * FROM '.$Base->table('object_around').' WHERE id = '.$oid,'Row');
	$obj['imgs'] = $Json->decode($obj['imgs']);
	echo $Json->encode($obj);
	exit;
}
else{
	if($oid <= 0 )
		die("未查询到相关项目1");
	$obj = $Db->query('SELECT id,name,view_num,thumb_path FROM '.$Base->table('object_around').' WHERE id = '.$oid,'Row');
	if (empty($obj)) {
		die("未查询到相关项目");
	}
	$Db->update($Base->table('object_around'),array('view_num'=>$obj['view_num']+1),array('id'=>$oid));
	$tp->assign("obj",$obj);
//	$tp->display($_lang['moban']."/obj.tpl");
}

?>