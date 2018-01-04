<?php
//编辑全景视频
if(!defined('IN_T')){
	die('禁止访问！');
}
$act =  Common::sfilter($_REQUEST['act']);
if ($act =="update") {
	$vid = intval($_REQUEST['vid']);
	$re['flag'] = 0 ;
	$video = $Db->query("SELECT * FROM ".$Base->table('video')." WHERE id = $vid  AND pk_user_main = ".$user['pk_user_main'],"Row");
	if (empty($video)) {
		die("参数有误");
	}
	$params['profile'] = Common::sfilter($_REQUEST['profile']);
	$params['vname'] = Common::sfilter($_REQUEST['vname']);
	$sources =  $Json->decode(stripslashes($_REQUEST['sources']));
	$thumbpath = Common::sfilter($_REQUEST['thumbpath']);
	$tags =$Json->decode(stripslashes($_REQUEST['tags']));
	if (empty($params['vname'])||mb_strlen($params['vname'])>30) {
		$re['msg'] = "请输入1到30位之间的项目名称";
	}else if(empty($sources)){
		$re['msg'] = "不能没有视频资源";
	}else if(empty($tags)||sizeof($tags)>3){
		$re['msg'] = "请选择1到3个标签";
	}else if(empty($thumbpath)){
		$re['msg'] = "请选择缩略图";
	}else{
		//重新设置视频资源
		$sources_db = $Json->decode($video['videos']);
		foreach ($sources_db as $k => $v) {
			$flag = false;
			foreach ($sources as $k1 => $v1) {
				if ($v['location']===$v1['location']) {
					$sources_db[$k]['progressive'] = $v1['progressive'];
					$flag = true;
				}
			}
			if(!$flag){
				unset($sources_db[$k]);
			}
		}
		$params['videos'] = $Json->encode_unescaped_unicode($sources_db);
		$params['state'] = 1;
		$flag_publish = intval($_REQUEST['flag_publish']);
		$params['flag_publish'] = $flag_publish!=0&&$flag_publish!=1?0:$flag_publish;
		$params['thumb_path'] = $thumbpath;
		$Db->update($Base->table('video'),$params,array("id"=>$vid));
		//更新标签
		$Db->delete($Base->table("tag_video"),array("video_id"=>$vid));
		foreach ($tags as  $tid) {
			if ($Db->getCount($Base->table("tag"),"id",array("id"=>$tid,"type"=>2))) {
				$Db->insert($Base->table("tag_video"),array("tag_id"=>$tid,"video_id"=>$vid));
			}
		}
		$re['flag'] = 1;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//跳转到编辑页面
else{
	$vid = intval($_REQUEST['vid']);
	$video = $Db->query("SELECT * FROM ".$Base->table('video')." WHERE id = $vid AND pk_user_main = ".$user['pk_user_main'],"Row");
	if (empty($video)) {
		die("未找到相关项目");
	}
	//查询项目对应标签
	$tags = $Db->query("SELECT * FROM ".$Base->table('tag_video')." WHERE video_id = $vid");
	$tag_list = $Db->query("SELECT * FROM ".$Base->table('tag')." WHERE type = 2");
	foreach ($tag_list as &$p) {
		foreach ($tags as $t) {
			if($p['id']==$t['tag_id']){
				$p['selected'] = 1;
				break;
			}
		}
	}
	$tp->assign("tag_list",$tag_list);
	$tp->assign("video",$video);
	$tp->assign("source",$Json->decode($video['videos']));
	$tp->assign('cdn_host',empty($video['cdn_host'])?$_lang['cdn_host']:$video['cdn_host']);
}
?>