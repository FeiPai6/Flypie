<?php
//编辑全景视频
if(!defined('IN_T')){
	die('禁止访问！');
}
$act =  Common::sfilter($_REQUEST['act']);

if ($act == 'edit') {
	$params = $_REQUEST['params'];
	filter_array($params);
	$oid = intval($params['id']);
	$re['status'] = 0 ;
	if (empty($params['name']) || mb_strlen($params['name'])>100){
		$re['msg'] = '请填写1到100字符的名称';
	}else if(empty($params['thumb_path'])){
		$re['msg'] = '请选择封面';
	}else if(count($params['imgs'])<1||count($params['imgs'])>50){
		$re['msg'] ='请上传1到50帧的环物图片';
	}else{
		$params['imgs'] = $Json->encode($params['imgs']);
		$Db->update($Base->table('object_around'),$params,array('id'=>$oid,'pk_user_main'=>$user['pk_user_main']));
		$re['status'] = 1;
	}
	echo $Json->encode($re);
	exit;

}
//查询某个用户的环物项目
else if ($act == 'list'){
	$list = $Db->query('SELECT id , name , thumb_path FROM '.$Base->table('object_around').' WHERE pk_user_main = '.$user['pk_user_main']);
	echo $Json->encode($list);
	exit;
}
else{
	$oid = intval($_REQUEST['oid']);
	$obj = $Db->query('SELECT * FROM '.$Base->table('object_around').' WHERE id = '.$oid.' AND pk_user_main = '.$user['pk_user_main'],'Row');
	if (empty($obj)) {
		die('无法查询该项目');
	}
	$tp->assign('obj',$obj);
	$tp->assign('imgs',$Json->decode($obj['imgs']));
	$tp->assign('cdn_host',$_lang['cdn_host']);
}

function filter_array(&$arr){
	foreach($arr as $k => &$v){
		if(is_array($v))
			filter_array($v);
		else{
			$k =Common::sfilter($k);
			$v =Common::sfilter($v);
		}
	}
}
?>