<?php
//登录
if(!defined('IN_T')){
	die('禁止访问！');
}
$act = Common::sfilter($_REQUEST['act']);
//执行登录
if($act=="do_login") {
  $re['status'] = 0;
  $phone = isset($_POST['phone']) ? Common::sfilter($_POST['phone']): '';
  $password = isset($_POST['password']) ? Common::sfilter($_POST['password']):'';
  $remember = intval($_POST['remember']);
  if(!Common::is_mobile($phone)){
     $re['msg'] = '手机号格式不正确';
  }
  else if(strlen($password)<6){
     $re['msg'] = '登录密码不能少于6位';
  }
  else if(!$user = $Db->query("select * from ".$Base->table('user')." where phone='".$phone."' and password = '".Common::encrypt($password)."' ",'Row')){
     $re['msg'] = '账号或密码不正确';
  }
  else{
     $data = array('last_time' => date('Y-m-d H:i:s',Common::gmtime()));
	 $Db->update($Base->table('user'),$data,array('pk_user_main'=>$user['pk_user_main']));
	 //赋值到session
	 $_SESSION['user'] = array(
               'nickname'=>$user['nickname'],
               'phone'=>$user['phone'],
               'pk_user_main'=>$user['pk_user_main'],
			   'level'=>$user['level'],
			   'avatar'=>$Db->query("select avatar from ".$Base->table('user_profile')." where pk_user_main=".$user['pk_user_main']."","One"),
	     );
	  //7天内免登录
	  if($remember){
	    //username,passwd
	    $hashcode = Common::encrypt($phone.Common::encrypt($password));
	    setcookie("remember[id]",$user['pk_user_main'],Common::gmtime()+7*60*60*24,'/');
		setcookie("remember[hashcode]",$hashcode,Common::gmtime()+7*60*60*24,'/');   
	  }
      $re = array('status'=>1,'msg'=>'登录成功，跳转...','href'=>empty($_POST['redirectUrl'])? '/member/' : Common::sfilter($_POST['redirectUrl']));
  }
  echo $Json->encode($re);
  exit;
}
//登录页面
else{
	$tp->assign('redirectUrl',$_REQUEST['redirectUrl'] ? Common::sfilter($_REQUEST['redirectUrl']): '');
    $tp->assign('title','登录');
}
?>