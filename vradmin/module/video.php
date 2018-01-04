<?php
//全景图片
if(!defined('IN_T')){
   die('禁止访问！');
}
$act = Common::sfilter($_REQUEST['act']);

if($act=='delete'){
	$pid = intval($_REQUEST['pid']);
	$Db->delete($Base->table('video'),array('id'=>$pid));
    $ret['status'] = 1;
	echo  $Json->encode($ret);
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
		$Db->update($Base->table('video'),$param,array("id"=>$pid));
		$re['flag'] = 1;
		$re['num'] = $num;
	}
	echo $Json->encode($re);
	exit;
}
//编辑是否推荐
else if($act == 'edit_recommon'){
	$pid = intval($_REQUEST['pid']);
	$pro = $Db->query('SELECT * FROM '.$Base->table('video').' WHERE id = '.$pid,"Row");
	$param['recommend'] = $pro['recommend']==0?1:0;
	$Db->update($Base->table('video'),$param,array('id'=>$pid));
	$re['recommend']=$pro['recommend'];
	$re['flag'] = 1;
	echo  $Json->encode($re);
	exit;
}
else{
    $size = 15; //定义每页显示10条
	$page = intval($_REQUEST['page']);
	$recommon = intval($_REQUEST['recommon']);
	$uid = intval($_REQUEST['uid']);
	$time_s = Common::sfilter($_REQUEST['time_s']);
	$time_e = Common::sfilter($_REQUEST['time_e']);
	$vname = Common::sfilter($_REQUEST['vname']);
	$page = $page<1 ? 1 : $page;

	$res = get_project_list($recommon,$uid,$time_s,$time_e,$vname,$page,$size);
	$pages = Common::set_page($size,$page,$res['count']);
	foreach ($pages as $key => $value) {
		$pages[$key]['url'] = "/".ADMIN_PATH."/?m=video&page=".$value['num'].$res['spm'];
	}
	$tp->assign("page",$page);
	$tp->assign("pages",$pages);
	$tp->assign("res",$res);
}
$tp->assign('nav','全景视频');
$tp->assign('act',$act);
/**
  *查询projectlist
  *@param int $uid  用户id,默认为0:查询所有的project
  *@return $res[] 返回总条数，project list
*/
function get_project_list($recommon,$uid=0,$time_s,$time_e,$vname,$page=0,$size=10){
	$sql = $GLOBALS['Base']->table('video')." AS p ".
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
	if(!empty($vname)){
	   $sql .= "and vname like '%$vname%' ";
	   $spm .= "&vname=$vname";
	   $GLOBALS['tp']->assign('vname',$vname);
	}
	$res['spm']= $spm;
	$res['count'] = $GLOBALS['Db']->query("SELECT COUNT(p.id) AS num FROM".$sql,"One");
	$sql ="SELECT p.*,u.nickname FROM ".$sql." ORDER BY p.sort ASC,p.id DESC LIMIT ".($page-1)*$size.",".$size."";
	$res['res'] = $GLOBALS['Db']->query($sql,"All");
	return $res;
}
?>