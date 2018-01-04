<?php
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
//编辑时查询用户的场景
if($act=="list_scenes"){
	$page = intval($_REQUEST['page'])<1 ? 1 : intval($_REQUEST['page']);

	$pageSize = 210;
	
	$res = list_scenes( $page,$pageSize,$user['pk_user_main']);
	echo $Json->encode($res);
	exit;
}
//查看项目列表，ajax动态获取数据
else if($act=="list_data"){
	$page = intval($_REQUEST['page'])<1 ? 1 : intval($_REQUEST['page']);
	$pageSize = intval($_REQUEST['pageSize'])<1 ? 10 : intval($_REQUEST['pageSize']);
	if($pageSize>30){
		$pageSize=10;
	}
	$name = Common::sfilter($_REQUEST['name']);
	$atlas = intval($_REQUEST['atlas']);
	$time_s = Common::sfilter($_REQUEST['time_s']);
	$time_e = Common::sfilter($_REQUEST['time_e']);
	$list = get_list_project($user['pk_user_main'],$page,$pageSize,$name,$atlas,$time_s,$time_e);
	echo $Json->encode($list);
	exit;
}
//添加或者更新图册
else if($act == "atlas_update"){
	$atlas_id = intval($_REQUEST['atlas_id']);
	$name = Common::sfilter($_REQUEST['name']);
	$re['flag'] = 0;
	if (mb_strlen($name)<=0||mb_strlen($name)>200) {
		$re['msg'] = "请输入0到200个长度的名称";
	}
	if ($atlas_id<=0) {
		if($Db->getCount($Base->table('atlasmain'),'pk_atlas_main',array('pk_user_main'=>$user['pk_user_main']))>=20){
			$re['msg'] = '每个用户最多只能创建20个图册';
		}else{
			//插入
			$Db->insert($Base->table('atlasmain'),array('pk_user_main'=>$user['pk_user_main'],'name'=>$name,'create_time'=>date('Y-m-d H:i:s',Common::gmtime()),'atlas_type'=>1 ));
			$re['flag'] = 1;
		}
	}else{
		//更新
		if($Db->getCount($Base->table('atlasmain'),'pk_atlas_main',array('pk_atlas_main'=>$atlas_id,'pk_user_main'=>$user['pk_user_main'],'atlas_type'=>1))>0){
			$Db->update($Base->table('atlasmain'),array('name'=>$name),array('pk_atlas_main'=>$atlas_id));
			$re['flag'] = 1;
		}else{
			$re['msg'] = "非法操作";
		}
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//删除图册
else if($act == "atlas_del"){
	$atlas_id = intval($_REQUEST['atlas_id']);
	$re['flag'] = 0;
	if($Db->getCount($Base->table('atlasmain'),'pk_atlas_main',array('pk_atlas_main'=>$atlas_id,'pk_user_main'=>$user['pk_user_main'],'atlas_type'=>1))<=0){
		$re['msg'] = "非法操作";
	}else{
		if($Db->getCount($Base->table('worksmain'),'pk_works_main',array('pk_atlas_main'=>$atlas_id))>0){
			$default_aid = $Db->query("SELECT pk_atlas_main FROM ".$Base->table('atlasmain')." WHERE pk_user_main = ".$user['pk_user_main']." AND atlas_type =0","One");
			$Db->update($Base->table('worksmain'),array("pk_atlas_main"=>$default_aid),array("pk_atlas_main"=>$atlas_id));
		}
		$Db->delete($Base->table('atlasmain'),array('pk_atlas_main'=>$atlas_id));
		$re['flag'] = 1;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//删除项目
else if($act == "works_del"){
	
	$pid = intval($_REQUEST['pid']);
	$re['flag'] = 0 ;
	
	//用户限制了上传数量，则无法删除
	if($limit_num = $Db->query("select limit_num from ".$Base->table('user')." where pk_user_main=".$user['pk_user_main']."","One")){
		$re['msg'] = "你当前只能上传".$limit_num."个项目，请联系客服删除！";
	}
	else if($pid==0 || $Db->getCount($Base->table('worksmain'),'pk_works_main',array('pk_works_main'=>$pid,'pk_user_main'=>$user['pk_user_main']))<=0){
		$re['msg'] = "非法操作";
	}else{
		$Db->beginTransaction();
		try{
			//删除 项目与图片的中间表
			$Db->delete($Base->table('imgs_works'),array('pk_works_main'=>$pid));
			//删除 项目与标签的中间表
			// $Db->delete($Base->table("tag_works"),array('works_id'=>$pid));
			//删除评论 TODO
			// $Db->delete($Base->table('comment'),array('pk_works_main'=>$pid));
			//删除项目
			$Db->delete($Base->table('worksmain'),array('pk_works_main'=>$pid));
			//删除panoconfig
			// $Db->delete($Base->table('pano_config'),array('pk_works_main'=>$pid));
			$Db->commit();
			$re['flag'] = 1;
		}catch(Exception $e){
			$Db->rollback();
			$re['msg'] = '操作失败！';
		}
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;

}
//移动项目到某个图册
else if($act =="move_project"){
	$pids =$Json->decode(Common::sfilter($_REQUEST['pids']));
	$atlas_id = intval($_REQUEST['atlas_id']);
	$re['flag'] = 0 ;
	if ($pids == null||$atlas_id<=0) {
		$re['msg'] = '参数有误';
	}else{
		$Db->execSql("update ".$Base->table("worksmain")." SET pk_atlas_main = ".$atlas_id." WHERE pk_user_main = ".$user['pk_user_main']." AND pk_works_main IN (".implode(",", $pids).")");
		$re['flag'] = 1;
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
//跳转到视频列表
else if($act == "videos"){
	$tp->assign("total",$Db->getCount($Base->table('video'),"id",array('pk_user_main'=>$user['pk_user_main'])));
	$tp->assign('act','videos');
}
//前台获取视频的json数据
else if($act == "list_videos"){
	$page = intval($_REQUEST['page'])<1 ? 1 : intval($_REQUEST['page']);
	$pageSize = intval($_REQUEST['pageSize'])<1 ? 10 : intval($_REQUEST['pageSize']);
	if($pageSize>30){
		$pageSize=10;
	}
	$vname = Common::sfilter($_REQUEST['vname']);
	$time_s = Common::sfilter($_REQUEST['time_s']);
	$time_e = Common::sfilter($_REQUEST['time_e']);
	$list = get_video_list($user['pk_user_main'],$page,$pageSize,$vname,$time_s,$time_e);
	echo $Json->encode($list);
	exit;	
}
//删除一个视频项目
else if($act == "video_del"){
	$vid = intval($_REQUEST['vid']);
	$re['flag'] = 0;
	//用户限制了上传数量，则无法删除
	if($limit_num = $Db->query("select limit_num from ".$Base->table('user')." where pk_user_main=".$user['pk_user_main']."","One")){
		$re['msg'] = "你当前只能上传".$limit_num."个项目，请联系客服删除！";
	}
	else{
		$Db->delete($Base->table("video"),array("id"=>$vid,"pk_user_main"=>$user['pk_user_main']));
		$re['flag'] = 1;
	}
	echo $Json->encode($re);
	exit;
}else if($act =="edit_sort_recommend"){
	//type 1 : 修改全景图片  2：修改视频
	//edit 1: 修改排序  2：修改推荐
	$re['status'] = 0;
	$type = intval($_REQUEST['type']);
	$edit = intval($_REQUEST['edit']);
	$id = intval($_REQUEST['id']);
	if ($id<=0||$type<=0||$edit<=0) {
		$re['msg'] = '非法参数';
	}else{
		$param = array();
		if ($edit==1) {
			$param['user_sort'] = intval($_REQUEST['user_sort']);
			if ($param['user_sort']<=0||$param['user_sort']>999) {
				$re['msg'] = '请输入1到999之间的值';
				echo $Json->encode($re);
				exit;
			}
		}else{
			$pro = $Db->query("SELECT user_recommend FROM ".($type==1?$Base->table('worksmain'):$Base->table('video'))." WHERE ".($type==1?"pk_works_main":"id").' = '.$id,"Row" );
			if (empty($pro)) {
				$re['msg'] = '非法参数';
				echo $Json->encode($re);
				exit;
			}else{
				$param['user_recommend'] = $pro['user_recommend']==0?1:0;
				$re['recommend'] = $param['user_recommend'];
			}
		}

		if($type == 1) {
			$Db->update($Base->table('worksmain'),$param,array('pk_works_main'=>$id,'pk_user_main'=>$user['pk_user_main']) );	
		}else if ($type == 2) {
			$Db->update($Base->table('video'),$param,array('id'=>$id,'pk_user_main'=>$user['pk_user_main']) );
		}
		$re['status'] = 1;
	}
	echo $Json->encode($re);
	exit;
}
//跳转到project查看列表
else{
	$tp->assign("atlas",$Db->query("SELECT a.name ,COUNT(w.pk_works_main) AS num ,a.atlas_type,a.pk_atlas_main FROM ".$Base->table('atlasmain')." a LEFT JOIN ".$Base->table('worksmain')." w ON a.pk_atlas_main = w.pk_atlas_main WHERE a.pk_user_main=".$user['pk_user_main']." GROUP BY a.pk_atlas_main "));
	$tp->assign("total",$Db->getCount($Base->table("worksmain"),"pk_works_main",array("pk_user_main"=>$user["pk_user_main"])));
	$tp->assign('act','list');
}
//分页
function list_scenes( $page = 1,$pageSize = 210,  $uid=0){

	$sql = 'FROM'.$GLOBALS['Base']->table('imgsmain');
	if($uid >0){
		$sql.=' WHERE pk_user_main='.$uid;
	}
	$list = $GLOBALS['Db']->query('SELECT * '.$sql.' ORDER BY pk_img_main DESC LIMIT '.($page-1)*$pageSize.','.$pageSize);
	$itemCount = $GLOBALS['Db']->query(" SELECT COUNT(*) AS num ".$sql,"One");
	$pageCount = ceil($itemCount/$pageSize);

	$res = array(
			'pageCount'=>$pageCount,
			'currentPage'=>$page,
			'pageSize'=>$pageSize,
			'list'=>$list,
	);

	return $res;

	// if($uid==0){
	// 	$list = $GLOBALS['Db']->query("SELECT * FROM ".$GLOBALS['Base']->table('imgsmain')." WHERE pk_user_main = $uid ORDER BY pk_img_main DESC LIMIT $start,$pageSize");
	// 	$all = $GLOBALS['Db']->query("SELECT * FROM ".$GLOBALS['Base']->table('imgsmain')." WHERE pk_user_main = ".$uid;
	// 	$pageCount = ceil(count($all)/$pageSize);
	// 	$res = array(
	// 			'pageCount'=>$pageCount,
	// 			'currentPage'=>$page,
	// 			'pageSize'=>$pageSize,
	// 			'list'=>$list,
	// 	);
	// 	return json_encode($res);
	// }else if($type == 'all'){
	// 	$list = $GLOBALS['Db']->query("SELECT * FROM ".$GLOBALS['Base']->table('imgsmain').'ORDER BY pk_img_main DESC');
	// 	$res = array(
	// 			'list'=>$list,
	// 	);
	// 	return json_encode($res);
	// }
}
//获取视频列表
function get_video_list($uid , $page ,$pageSize,$vname,$time_s,$time_e){
	$sql  = " FROM ".$GLOBALS['Base']->table('video')." WHERE pk_user_main = $uid";
	if (!empty($vname)) {
		$sql .= " AND vname LIKE '%$vname%'";
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
//提取图片列表
function get_list_project($uid,$page,$pageSize,$name,$atlas,$time_s,$time_e){
	$list_sql = "SELECT * ";
	$count_sql = "SELECT count(*) as num ";
	$sql = "FROM ".$GLOBALS['Base']->table('worksmain')." WHERE pk_user_main=$uid ";
	//搜索項目名稱
	if(!empty($name)){
		$sql .= "AND name like '%$name%' ";
	}
	//搜索分類
	if($atlas>0){
		$sql .= "AND pk_atlas_main=$atlas ";
	}
	//搜索時間
	if(!empty($time_s) && !empty($time_e)){
		$sql .= "AND create_time between '$time_s' AND '$time_e' ";
	}
    //取得總條數
    $itemCount = $GLOBALS['Db']->query($count_sql.$sql,"Row");
    $itemCount = $itemCount['num'];

    //取得總頁數
    $pageCount = ceil($itemCount/$pageSize);

	//echo $sql;	
	$list = $GLOBALS['Db']->query($list_sql.$sql.' ORDER BY pk_works_main DESC limit '.($page-1)*$pageSize.','.$pageSize);

    $res = array(
    	'itemCount'=>$itemCount,
    	'pageCount'=>$pageCount,
    	'currentPage'=>$page,
    	'pageSize'=>$pageSize,
    	'list'=>$list,
    	);

	return $res;
}
$tp->assign('title','全景图片');
?>