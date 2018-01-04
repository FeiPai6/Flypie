<?php
/*
 *  物体环视
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author: wh #qq.com $
 * $Id: objectaround.php 28028 2016-06-19Z wh $
*/
if(!defined('IN_T')){
	die('禁止访问！');
}

$act =  Common::sfilter($_REQUEST['act']);

if ($act=='list') {
	$page = intval($_REQUEST['page'])<1 ? 1 : intval($_REQUEST['page']);
	$pageSize = intval($_REQUEST['pageSize'])<1 ? 10 : intval($_REQUEST['pageSize']);
	if($pageSize>30){
		$pageSize=10;
	}
	$oname = Common::sfilter($_REQUEST['oname']);
	$time_s = Common::sfilter($_REQUEST['time_s']);
	$time_e = Common::sfilter($_REQUEST['time_e']);
	$list = get_obj_list($user['pk_user_main'],$page,$pageSize,$oname,$time_s,$time_e);
	echo $Json->encode($list);
	exit;	
}
else if($act =='delete'){
	$oid = intval($_REQUEST['oid']);
	$re['status'] = 0;
	//用户限制了上传数量，则无法删除
	if($limit_num = $Db->query("select limit_num from ".$Base->table('user')." where pk_user_main=".$user['pk_user_main']."","One")){
		$re['msg'] = "你当前只能上传".$limit_num."个项目，请联系客服删除！";
	}
	else{
		//TODO 需要判断是否在全景热点中是否绑定过物体环视
		$Db->delete($Base->table('object_around'),array('pk_user_main'=>$user['pk_user_main'],'id'=>$oid));
		$re['status'] = 1;
	}
	echo $Json->encode($re);
	exit;
}
else{
	$tp->assign('total',$Db->getCount($Base->table('object_around'),"id",array('pk_user_main'=>$user['pk_user_main'])));
}

//获取视频列表
function get_obj_list($uid , $page ,$pageSize,$oname,$time_s,$time_e){
	$sql  = " FROM ".$GLOBALS['Base']->table('object_around')." WHERE pk_user_main = $uid";
	if (!empty($oname)) {
		$sql .= " AND name LIKE '%$oname%'";
	}
	if(!empty($time_s)&&!empty($time_e)){
		$sql .= " AND create_time between '$time_s' AND '$time_e' ";
	}
    $itemCount = $GLOBALS['Db']->query(" SELECT COUNT(id) AS num ".$sql,"One");
    $pageCount = ceil($itemCount/$pageSize);
    $list = $GLOBALS['Db']->query(" SELECT * ".$sql.' ORDER BY id DESC limit '.($page-1)*$pageSize.','.$pageSize);
    $res = array(
    	'itemCount'=>$itemCount,
    	'pageCount'=>$pageCount,
    	'currentPage'=>$page,
    	'pageSize'=>$pageSize,
    	'list'=>$list,
    	);

	return $res;
}
?>