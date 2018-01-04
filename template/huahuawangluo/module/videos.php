<?php
//全景视频
if(!defined('IN_T')){
	die('hacking attempt');
}
$act = Common::sfilter($_REQUEST['act']);
if ($act == 'list') {
	$page = intval($_REQUEST['page']);
	$page = $page<1?1:$page;
	$size =  24;
	$recommend = isset($_REQUEST['recommend']) ? intval($_REQUEST['recommend']) : 1;
	$list = get_video_projects($recommend,$page,$size);
	echo $Json->encode($list);
	exit;
}

// $tp->assign('videos',get_video_projects($recommend));

//提取视频项目
function get_video_projects($recommend,$page,$size){
	$sql = "select id,vname,thumb_path,browsing_num from ".$GLOBALS['Base']->table('video')." where 1 ";
	if($recommend>0){
		$sql .= "and recommend=1 ";
		$GLOBALS['tp']->assign('recommend',1);
	}
	$sql.=' limit '.($page-1)*$size.','.$size;
	$res = $GLOBALS['Db']->query($sql);
	return $res;
}
?>