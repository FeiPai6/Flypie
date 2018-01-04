<?php
//首页
if(!defined('IN_T')){
	die('hacking attempt');
}

$recommend = get_index_recommend();
$tp->assign('recommend',$recommend);
$tp->assign('new_join',get_index_new_join());
$tp->assign('video_recommmend',get_index_video_recom());
$tp->assign('p_tags',$Db->query('SELECT * FROM '.$Base->table('tag').' WHERE type =1 ORDER BY sort ASC ' ));

//提取首页推荐图片
function get_index_recommend(){
	$sql = "select name,thumb_path,view_uuid,profile,browsing_num ".
			"from ".$GLOBALS['Base']->table('worksmain')." where recommend=1 order by sort asc, pk_works_main desc limit 21";
	$res = $GLOBALS['Db']->query($sql);
	return $res;
}
//查询首页最新入驻
function get_index_new_join(){
	$sql = "select name,thumb_path,view_uuid,profile,browsing_num ".
			"from ".$GLOBALS['Base']->table('worksmain')." where flag_publish=1 order by pk_works_main desc limit 6";
	$res = $GLOBALS['Db']->query($sql);
	return $res;
}

function get_index_video_recom(){
	$sql = 'SELECT id,vname,profile,thumb_path FROM '.$GLOBALS['Base']->table('video').' WHERE flag_publish =1 ORDER BY recommend DESC , id DESC limit 8';
	$res = $GLOBALS['Db']->query($sql);
	return $res;
}
?>