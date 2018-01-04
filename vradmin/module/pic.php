<?php
//全景图片
if(!defined('IN_T')){
   die('禁止访问！');
}
$act = Common::sfilter($_REQUEST['act']);

if($act=='delete'){
    $ret['status'] = 0;
	$pid = intval($_REQUEST['pid']);
	$Db->beginTransaction();
		try{
			//删除 项目与图片的中间表
			$Db->delete($Base->table('imgs_works'),array('pk_works_main'=>$pid));
			//删除评论 TODO
			$Db->delete($Base->table('comment'),array('pk_works_main'=>$pid));
			//删除项目
			$Db->delete($Base->table('worksmain'),array('pk_works_main'=>$pid));
			//删除panoconfig
			$Db->delete($Base->table('pano_config'),array('pk_works_main'=>$pid));
			$Db->commit();
			$ret['status'] = 1;
	}catch(Exception $e){
		$Db->rollback();
		$ret['msg'] = '操作失败！';
	}
	echo  $Json->encode($ret);
	exit;
}
//编辑是否推荐
else if($act == 'edit_recommon'){
	$pid = intval($_REQUEST['pid']);
	$pro = $Db->query('SELECT * FROM '.$Base->table('worksmain').' WHERE pk_works_main = '.$pid,"Row");
	$param['recommend'] = $pro['recommend']==0?1:0;
	$Db->update($Base->table('worksmain'),$param,array('pk_works_main'=>$pid));
	$re['recommend']=$pro['recommend'];
	$re['flag'] = 1;
	echo  $Json->encode($re);
	exit;
}
//编辑项目的浏览量和点赞量 type: 1浏览量 2 点赞量  3 排序
else if($act=="edit_num"){
	$re['flag'] = 0;
	$num = intval($_REQUEST['num']);
	$type = intval($_REQUEST['type']);
	$param = array();
	$num = $num<0?0:$num;
	if ($type ==1) {
	 	$param['browsing_num'] = $num;
	 }else if($type ==2){
	 	$param['praised_num'] =$num;
	 }else if($type == 3){
		$num = $num>999?999:$num;
	 	$param['sort'] = $num;
	 }
	if ($param) {
		$pid = intval($_REQUEST['pid']);
		$Db->update($Base->table('worksmain'),$param,array("pk_works_main"=>$pid));
		$re['flag'] = 1;
		$re['num'] = $num;
	}
	echo $Json->encode($re);
	exit;
}
else{
    $size = 15; //定义每页显示10条
	$page = intval($_REQUEST['page']);
	$recommon = intval($_REQUEST['recommon']);
	$uid = intval($_REQUEST['uid']);
	$time_s = Common::sfilter($_REQUEST['time_s']);
	$time_e = Common::sfilter($_REQUEST['time_e']);
	$pname = Common::sfilter($_REQUEST['pname']);
	$page = $page<1 ? 1 : $page;

	$res = get_project_list($recommon,$uid,$time_s,$time_e,$pname,$page,$size);
	$pages = Common::set_page($size,$page,$res['count']);
	foreach ($pages as $key => $value) {
		$pages[$key]['url'] = "/".ADMIN_PATH."/?m=pic&page=".$value['num'].$res['spm'];
	}
	$tp->assign("page",$page);
	$tp->assign("pages",$pages);
	$tp->assign("res",$res);
}
$tp->assign('nav','全景图片');
$tp->assign('act',$act);
/**
  *查询projectlist
  *@param int $uid  用户id,默认为0:查询所有的project
  *@return $res[] 返回总条数，project list
*/
function get_project_list($recommon,$uid=0,$time_s,$time_e,$pname,$page=0,$size=10){
	$sql = $GLOBALS['Base']->table('worksmain')." AS p ".
	       "left join ".$GLOBALS['Base']->table('user')." as u on u.pk_user_main=p.pk_user_main WHERE 1 ";
	$spm = "";   //整合检索字符串
	if($recommon>0){
		$sql .= "and p.recommend = 1 ";
		$spm .= "&recommon=$recommon";
		$GLOBALS['tp']->assign('recommon',$recommon);
	}
	if($uid>0) {
		$sql .= "and p.pk_user_main = ".$uid." ";
		$spm .= "&uid=$uid";
		$GLOBALS['tp']->assign('uid',$uid);
	}
	if(!empty($time_s)){
	    $sql .= "and unix_timestamp(p.create_time)>= ".strtotime($time_s)." ";
		$spm .= "&time_s=$time_s";
		$GLOBALS['tp']->assign('time_s',$time_s);
	}
	if(!empty($time_e)){
	    $sql .= "and unix_timestamp(p.create_time)<= ".strtotime($time_e)." ";
		$spm .= "&time_e=$time_e";
		$GLOBALS['tp']->assign('time_e',$time_e);
	}
	if(!empty($pname)){
	   $sql .= "and name like '%$pname%' ";
	   $spm .= "&name=$pname";
	   $GLOBALS['tp']->assign('pname',$pname);
	}
	$res['spm']= $spm;
	$res['count'] = $GLOBALS['Db']->query("SELECT COUNT(p.pk_works_main) AS num FROM".$sql,"One");
	$sql ="SELECT p.*,u.nickname FROM ".$sql." ORDER BY p.sort ASC,p.pk_works_main DESC LIMIT ".($page-1)*$size.",".$size."";
	$res['res'] = $GLOBALS['Db']->query($sql,"All");
	return $res;
}
?>