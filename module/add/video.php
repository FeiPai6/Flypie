<?php
//添加视频项目
if(!defined('IN_T')){
	die('禁止访问！');
}
$act =  Common::sfilter($_REQUEST['act']);
$input=null;
if (empty($act)) {
	$input = $Json->decode(file_get_contents("php://input"));
	if (!empty($input)) {
		$act = $input['act'];
	}
}

//添加视频
if($act == "doAdd"){
	$re['flag'] = 0;
	$params = $Json->decode(stripslashes($_REQUEST['params']));
	$data['vname'] = Common::sfilter($params['vname']);
	$videos = $params['videos'];
	$tags = $params['video_tags'];
	if (empty($data['vname'])||mb_strlen($data['vname'])>30) {
		$re['msg'] = "请输入1到30个字符的项目名称";
	}else if(empty($tags)||sizeof($tags)>3){
		$re['msg'] = "请选择1到3个标签";
	}else if(empty($videos)){
		$re['msg'] = "视频不能为空";
	}else{
		$data['profile'] = Common::sfilter($params['profile']);
		$data['flag_publish'] = 1;
		$data['state'] = 0;
		$data['create_time'] =date("Y-m-d H:i:s",Common::gmtime());
		$data['pk_user_main'] = $user['pk_user_main'];
		$size = 0 ;
		
		require_once __DIR__.'/../../source/krpano/cls_common_operation.php';
		foreach ($videos as &$v) {
			$v['thumb_path'] = KrOperation::get_video_thumb($v['location'],3);
			$size = intval($v['size']/1024)+$size;
		}
		
		$data['thumb_path'] = urldecode($videos[0]['thumb_path']);
		$data['videos'] = $Json->encode_unescaped_unicode($videos);
		$data['size'] = $size;
		$data['cdn_host'] = $_lang['cdn_host'];
		$vid = $Db->insert($Base->table("video"),$data);
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



?>