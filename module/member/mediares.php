<?php
if(!defined('IN_T')){
	die('禁止访问！');
}

$act =  Common::sfilter($_REQUEST['act']);

if (empty($act)) {
	$input = $Json->decode(file_get_contents("php://input"));
	if (!empty($input)) {
		$act = $input['act'];
	}
	else{
		$act = 'panos';
	}
}
if ($act == 'panos') {
	$atlas = $Db->query('SELECT count(u.pk_img_main) as num , p.`name`,p.pk_atlas_main FROM '.$Base->table('imgsmain').' u RIGHT JOIN '.$Base->table('pano_atlas').' p ON u.pk_atlas_main = p.pk_atlas_main WHERE p.pk_user_main = '.$user['pk_user_main'].' GROUP BY p.pk_atlas_main  ');
	$tp->assign('atlas',$atlas);
	$tp->assign('total_count',$Db->getcount($Base->table('imgsmain'),'pk_img_main',array('pk_user_main'=>$user['pk_user_main'])));
	$tp->assign('default_count',$Db->getcount($Base->table('imgsmain'),'pk_img_main',array('pk_atlas_main'=>0,'pk_user_main'=>$user['pk_user_main'])));
}
else if($act == 'saveOrUpdateAtlas'){
	$atlasId = intval($_REQUEST['atlasId']);
	$name = Common::sfilter($_REQUEST['name']);
	$re['status'] = 0;
	if (empty($name)||mb_strlen($name)>100) {
		$re['msg'] = '请输入1到100个字符的分类名';
	}else{
		$params = array('name'=>$name);
		if ($atlasId == 0) {
			$params['pk_user_main'] = $user['pk_user_main'];
			$Db->insert($Base->table('pano_atlas'),$params);
		}else{
			$Db->update($Base->table('pano_atlas'),$params,array('pk_atlas_main'=>$atlasId,'pk_user_main'=>$user['pk_user_main']));
		}
		$re['status'] = 1;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
else if($act == 'del_pano_atlas'){
	$re['status'] = 0;
	$atlasId = intval($_REQUEST['atlasId']);
	if ($Db->getcount($Base->table('pano_atlas'),'pk_atlas_main',array('pk_atlas_main'=>$atlasId,'pk_user_main'=>$user['pk_user_main']) )<=0) {
		$re['msg'] = '查询不到该分类';
	}else{
		$Db->delete($Base->table('pano_atlas'),array('pk_atlas_main'=>$atlasId,'pk_user_main'=>$user['pk_user_main']));
		$Db->update($Base->table('imgsmain'),array('pk_atlas_main'=>0),array('pk_atlas_main'=>$atlasId,'pk_user_main'=>$user['pk_user_main']) );
		$re['status'] = 1;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//移动项目到某个图册
else if($act =="move_panos"){
	$pids =$Json->decode(Common::sfilter($_REQUEST['ids']));
	$atlas_id = intval($_REQUEST['atlas_id']);
	$re['status'] = 0 ;
	if ($pids == null||$atlas_id<0) {
		$re['msg'] = '参数有误';
	}else{
		$Db->execSql("update ".$Base->table("imgsmain")." SET pk_atlas_main = ".$atlas_id." WHERE pk_user_main = ".$user['pk_user_main']." AND pk_img_main IN (".implode(",", $pids).")");
		$re['status'] = 1;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//编辑项目时，请求图标素材
else if($act == "list"){
	$type = Common::sfilter($input['type']);//system custom
	$media_type=Common::sfilter($input['media_type']); //客户图标
	
	if ($media_type=="") {
		exit("[]");
	}
	$result ;
	if ($type=='system') {
		if($media_type =="def_msc"){
			$list = $Db->query("SELECT * FROM ".$Base->table('def_voice')." WHERE flag_del =0 ORDER BY pk_voice DESC");
			foreach ($list as $v) {
				$abs = $v['absolutelocation'];
				$r['media_name'] = $v['title'];
				$r['absolutelocation'] = $abs;
				$r['media_suffix'] = substr($abs,strrpos($abs,"."));
				$result[] = $r;
			}
		}
		else
			$result = $Db->query("SELECT * FROM ".$Base->table('def_mediares')." WHERE flag_del =0 AND type in (".$media_type.") ORDER BY pk_defmedia_main DESC");
	}else if($type=='custom'){
			//客户自定义静态图片
		$result = $Db->query("SELECT * FROM ".$Base->table('cus_mediares')." WHERE pk_user_main = ".$user['pk_user_main']." AND media_type in (".$media_type.") ORDER BY pk_media_res DESC");
	}
	echo  $Json->encode($result);
	exit;
}
//素材管理页面，按类别获取素材
else if($act =="list_media_res"){
	$page = intval($_REQUEST['page'])<1 ? 1 : intval($_REQUEST['page']);
	$pageSize = intval($_REQUEST['pageSize'])<1 ? 10 : intval($_REQUEST['pageSize']);
	$type = intval($_REQUEST['type']); // 1 全景图片 2 素材 3音乐
	$query_sql="";
	$count_sql="";
	switch ($type) {
		case 1:
			$extParams = empty($_REQUEST['extParams'])?array():$Json->decode($_REQUEST['extParams']);
			$sql = ' FROM '.$Base->table("imgsmain").' i ';
			$extParams['atlasId'] = intval($extParams['atlasId']);
			$extParams['name'] = Common::sfilter($extParams);
			if ($extParams['atlasId']!=0) {
				$sql.=' LEFT JOIN '.$Base->table('pano_atlas').' p ON i.pk_atlas_main = p.pk_atlas_main WHERE p.pk_atlas_main='.$extParams['atlasId'];
			}else{
				$sql.=' WHERE i.pk_atlas_main = 0';
			}
			$sql.=' AND i.pk_user_main ='.$user['pk_user_main'];
			if (!empty($extParams['name'])) {
				$sql.=' AND i.filename LIKE "%'.$extParams['name'].'%"';
			}
			$query_sql = 'SELECT * '.$sql." ORDER BY i.pk_img_main DESC LIMIT ".($page-1)*$pageSize.",".$pageSize;
			$count_sql = "SELECT COUNT(*) AS num ".$sql;
			break;
		case 2:
			$query_sql = "SELECT * FROM ".$Base->table("cus_mediares")." WHERE pk_user_main = ".$user['pk_user_main']." AND media_type = 0 ORDER BY pk_media_res DESC LIMIT ".($page-1)*$pageSize.",".$pageSize;
			$count_sql = "SELECT COUNT(*) AS num FROM ".$Base->table("cus_mediares")." WHERE pk_user_main=".$user['pk_user_main']." AND media_type = 0";
			break;
		case 3:
			$query_sql = "SELECT * FROM".$Base->table("cus_mediares")." WHERE pk_user_main = ".$user['pk_user_main']." AND media_type = 1 ORDER BY pk_media_res DESC LIMIT ".($page-1)*$pageSize.",".$pageSize;
			$count_sql = "SELECT COUNT(*) AS num FROM ".$Base->table("cus_mediares")." WHERE pk_user_main=".$user['pk_user_main']." AND media_type = 1";
			break;
		case 4:
			$query_sql = "SELECT * FROM".$Base->table("cus_mediares")." WHERE pk_user_main = ".$user['pk_user_main']." AND media_type = 2 ORDER BY pk_media_res DESC LIMIT ".($page-1)*$pageSize.",".$pageSize;
			$count_sql = "SELECT COUNT(*) AS num FROM ".$Base->table("cus_mediares")." WHERE pk_user_main=".$user['pk_user_main']." AND media_type = 2";
			break;	
	}
	$re;
	if ($query_sql != "") {
		$list = $Db->query($query_sql,"All");
		$total = $Db->query($count_sql,"One");
		$pageCount = ceil($total/$pageSize);
		$re = array(
				"list"=>$list,
				"pageCount"=>$pageCount,
				"total"=>$total,
				"currentPage"=>$page,
				"pageSize"=>$pageSize
			);
	}
	echo $Json->encode($re);
	exit;
}
//上传全景素材
else if($act == "pano_add"){
	//设置该次请求超时时长，1800s
	@ini_set("max_execution_time", "1800"); 
	//兼容php-fpm设置超时
	@ini_set("request_terminate_timeout", "1800");
	
	$re['status']=0;
	$imgsrc = Common::sfilter($_REQUEST['imgsrc']);
	if (empty($imgsrc)) {
		$re['msg'] = "找不到图片";
	}
	$imgname = Common::sfilter($_REQUEST['imgname']);
	require_once __DIR__.'/../../source/krpano/cls_common_operation.php';
	$imgsmain = KrOperation::slice($user['pk_user_main'],array("0"=>array("imgsrc"=>$imgsrc,"imgname"=>$imgname)),$user['pk_user_main']."/works/");
	if (sizeof($imgsmain)<=0) {
		$re['msg'] = "切图失败";
	}else{
		$img = $imgsmain[0];
		$img['create_time'] =date("Y-m-d H:i:s",Common::gmtime());
		$img['pk_user_main'] = $user['pk_user_main'];
		$img['pk_atlas_main'] = 0;
		$Db->insert($Base->table('imgsmain'),$img);
		$re['status'] =1;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//重命名资源
else if ($act =="media_rename") {
	$media_id = intval($_REQUEST['media_id']);
	$name = Common::sfilter($_REQUEST['name']);
	$type = intval($_REQUEST['type']);  //1 全景图片 2 素材 3音乐
	$re['status'] =0 ;
	if (mb_strlen($name)==0||mb_strlen($name)>100) {
		$re['msg'] = "名字长度在1到100之间";
	}else{
		switch ($type) {
			case 1:
				$Db->update($Base->table('imgsmain'),array('filename'=>$name),array('pk_user_main'=>$user['pk_user_main'],'pk_img_main'=>$media_id));
				break;
			case 2:
			case 3:
			case 4:
				$Db->update($Base->table('cus_mediares'),array('media_name'=>$name),array('pk_user_main'=>$user['pk_user_main'],'pk_media_res'=>$media_id));
				break;
		}
		$re['status'] = 1;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//资源删除
else if($act =="media_delete"){
	$media_id = intval($_REQUEST['media_id']);
	$type = intval($_REQUEST['type']);
	$re['status'] = 0 ;
	switch ($type) {
		case 1:
			if($Db->getcount($Base->table("imgs_works"),"id",array("pk_img_main"=>$media_id))>0){
				$re['msg'] = "资源被引用，不能被删除";
			}else{
				$Db->delete($Base->table('imgsmain'),array('pk_user_main'=>$user['pk_user_main'],'pk_img_main'=>$media_id));
				$re['status'] = 1 ;
			}
			break;
		case 2:
			$condition = "	u.open_alert LIKE '%@@%'".
								"   OR u.sky_land_shade LIKE '%@@%'".
								"   OR u.tour_guide LIKE '%@@%'  ".
								"   OR u.url_phone_nvg LIKE '%@@%' ".
								"   OR u.special_effects LIKE '%@@%'".
								"   OR u.sand_table LIKE '%@@%'".
								"   OR u.custom_logo LIKE '%@@%'".
								"   OR u.scene_group LIKE '%@@%'".
								"   OR u.hotspot LIKE '%@@%' ";

		case 3:
			$condition = "	u.bg_music LIKE '%@@%'".
					      "   OR u.speech_explain LIKE '%@@%'";
		case 4:
			$condition = "  u.hotspot LIKE '%@@%' ";

			$location = $Db->query("SELECT absolutelocation FROM ".$Base->table('cus_mediares')." WHERE pk_user_main = ".$user['pk_user_main']." AND pk_media_res = ".$media_id,"One");
				if(empty($location)){
					$re['msg'] = "无法查询到该资源";
				}else{

					$count_sql ="SELECT COUNT(*) AS num FROM ".
								"	(SELECT c.* FROM ".$Base->table('pano_config')." c LEFT JOIN ".$Base->table('worksmain')." w ON c.pk_works_main = w.pk_works_main WHERE w.pk_user_main =".$user['pk_user_main'].") u".
								" WHERE ".$condition;

					$count_sql = str_replace("@@", $location, $count_sql);
					if($Db->query($count_sql,"One")){
						$re['msg'] = "资源被引用，不能被删除";
					}else{
						$Db->delete($Base->table('cus_mediares'),array("pk_media_res"=>$media_id));
						$re['status'] = 1 ;
					}
				}
			break;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//上传视频
else if($act =='video_add'){
	$params = $_REQUEST['params'];
	require_once ROOT_PATH.'source/krpano/cls_common_operation.php';

	foreach ($params as &$v) {
		$v['location'] =Common::sfilter($v['location']);
		$name = Common::sfilter($v['name']);
		$filename = substr($name, 0,strrpos($name, '.'));
		$suffix = substr($name, strpos($name,'.'));
		$data = array(
				// 'thumb_path'=>KrOperation::get_video_thumb($v['location'],3), //暂时去掉封面字段
				'media_type'=>2,
				'view_uuid'=>Common::guid(16),
				'create_time'=>date("Y-m-d H:i:s",Common::gmtime()),
				'media_path'=>$v['location'],
				'absolutelocation'=>$_lang['cdn_host'].$v['location'],
				'media_name'=> mb_strlen($filename)>100?substr($filename, 0,100):$filename,
				'pk_user_main'=>$user['pk_user_main'],
				'media_suffix'=>$suffix,
				'media_size'=>intval($v['size']/1024),
			);
		$Db->insert($Base->table('cus_mediares'),$data);
	}
	$re['status'] = 1;
	echo $Json->encode($re);
	exit;
}
$tp->assign("act",$act);
$tp->assign('title','素材管理');
$tp->assign('up_url',$_lang['up_url']);
?>