<?php
//全景图片
if(!defined('IN_T')){
   die('禁止访问！');
}
$act = Common::sfilter($_REQUEST['act']);

if($act=='delete'){
	$pid = intval($_REQUEST['pid']);
	$Db->delete($Base->table('video'),array('id'=>$pid));
    $ret['status'] = 1;
	echo  $Json->encode($ret);
	exit;
}


else{
    $type = intval($_REQUEST['type']);
	$tp->assign('res',$Db->query('SELECT * FROM '.$Base->table('def_mediares').' WHERE flag_del=1 AND type = '.$type ));

}
$tp->assign('nav','图标资源管理');
$tp->assign('act',$act);

?>