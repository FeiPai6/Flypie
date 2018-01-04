<?php
//首页
if(!defined('IN_T')){
	die('hacking attempt');
}

$recommend = get_index_recommend();
$tp->assign('recommend',$recommend);

//提取首页推荐图片
function get_index_recommend(){
	$sql = "select name,thumb_path,view_uuid,profile,browsing_num ".
	       "from ".$GLOBALS['Base']->table('worksmain')." where recommend=1 order by sort asc, pk_works_main desc limit 21";
	$res = $GLOBALS['Db']->query($sql);
	return $res;
}
?>