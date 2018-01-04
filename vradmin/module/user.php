<?php
//会员管理
if(!defined('IN_T')){
   die('禁止访问！');
}
$act = Common::sfilter($_REQUEST['act']);
if($act=='profile'){
   $uid = intval($_REQUEST['uid']);
   $row = $Db->query("select u.* , p.avatar from ".$Base->table('user')." u left join ".$Base->table("user_profile")." p on u.pk_user_main = p.pk_user_main  where u.pk_user_main=$uid","Row");
   $tp->assign('row',$row);
   $tp->assign('level_groups',get_user_levels());
}
else if($act=='edit_profile'){
   $uid = intval($_REQUEST['uid']);
   $data = array(
   'phone' => Common::sfilter($_REQUEST['phone']),
   'password' => Common::sfilter($_REQUEST['passwd']),
   'nickname' => Common::sfilter($_REQUEST['nickname']),
   'state' => intval($_REQUEST['state']),
   'level' => intval($_REQUEST['level']),
   'limit_num' => intval($_REQUEST['limit_num']),
   );
   $res['status']=0;
   if(!Common::is_mobile($data['phone'])){
      $res['msg'] = '手机号格式不正确';
   }else if($data['level']<1){
   	  $res['msg'] = '请选择用户所属分组';
   }else if($Db->query("select pk_user_main from ".$Base->table('user')." where phone ='".$data['phone']."' and pk_user_main !=$uid","One")){
      $res['msg'] = '手机号已被使用';
   }
   else{
      if(!empty($data['password'])){
	     $data['password'] = Common::encrypt($data['password']);
	  }
	  else{
	     unset($data['password']);
	  }
      $uid = $Db->query("select pk_user_main from ".$Base->table('user')." where pk_user_main=$uid","One");
	  //编辑
	  if($uid){
	      $Db->update($Base->table('user'),$data,array('pk_user_main'=>$uid));
		  $res = array('status'=>1,'msg'=>'编辑成功','href'=>'/'.ADMIN_PATH.'/?m=user');
	  }
	  //添加
	  else{
	     if(empty($data['password'])){
		    $res['msg'] = '请填写登录密码';
		 }
		 else{
			$data['last_time'] = $data['create_time'] = date('Y-m-d H:i:s',Common::gmtime());
			$uid = $Db->insert($Base->table('user'),$data);
			$res = array('status'=>1,'msg'=>'添加成功','href'=>'/'.ADMIN_PATH.'/?m=user');			
		 }
	  }
   }
   echo $Json->encode($res);
   exit;
}
else{
    $size = 20;
	$page = intval($_REQUEST['page']);
	$uid =  intval($_REQUEST['uid']);
	$level =  intval($_REQUEST['level']);
	$phone = Common::sfilter($_REQUEST['phone']);
	$nickname = Common::sfilter($_REQUEST['nickname']);
	$page = $page<1 ? 1 : $page;
	$res = get_user_list($uid,$level,$phone,$nickname,$page,$size);
	$pages = Common::set_page($size,$page,$res['count']);
	foreach ($pages as $key => $value) {
		 $pages[$key]['url'] = "/".ADMIN_PATH."/?m=user&page=".$value['num'].$res['spm'];
	}
	$tp->assign("page",$page);
	$tp->assign("size",$size);
	$tp->assign("pages",$pages);
	$tp->assign('res',$res);
	$tp->assign('levels',get_user_levels(true));
}
$tp->assign('nav','会员管理');
$tp->assign('act',$act);
function get_user_list($uid,$level,$phone,$nickname,$page=1,$pageCount=20){
   $sql = "from ".$GLOBALS['Base']->table('user')." where 1 ";
   $spm = '';
   if($uid>0){
      $sql .= "and pk_user_main=$uid ";
	  $spm .= "&uid=$uid";
	  $GLOBALS['tp']->assign('uid',$uid);
   }
   if($level>0){
   	  $sql .= "and level=$level ";
	  $spm .= "&level=$level";
	  $GLOBALS['tp']->assign('level',$level);
   }
   if(!empty($nickname)){
      $sql .= "and nickname like '%$nickname%'";
	  $spm .= "&nickname=$nickname";
	  $GLOBALS['tp']->assign('nickname',$nickname);
   }
   if(!empty($phone)){
      $sql .= "and phone='$phone' ";
	  $spm .= "&phone=$phone";
	  $GLOBALS['tp']->assign('phone',$phone);
   }
   $rescount = $GLOBALS['Db']->query("SELECT COUNT(*) AS num " .$sql,"One");
   $sql = "select *,date_format(create_time,'%Y-%m-%d ') as reg_time,date_format(last_time,'%Y-%m-%d ') as last_time ".$sql." order by pk_user_main desc limit ".($page-1)*$pageCount.", $pageCount";
   $res = $GLOBALS['Db']->query($sql);
   return array('spm'=>$spm,'count'=>$rescount,'res'=>$res);
}
?>