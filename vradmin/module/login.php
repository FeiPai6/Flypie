<?php
//登录
if(!defined('IN_T')){
   die('禁止访问！');
}
if(empty($_POST)){
   //todo
}
else{
   $admin_name = Common::sfilter($_REQUEST['admin_name']);
   $passwd = Common::sfilter($_REQUEST['passwd']);
   $remember = intval($_REQUEST['remember']);
   $res['status'] = 0;
   $admin = $Db->query("select id,admin_name from ".$Base->table('admin')." where admin_name='$admin_name' and passwd='".Common::encrypt($passwd)."'","Row");
   if(!empty($admin)){
      //赋值到session
	  $_SESSION['admin'] = array(
	   'id' => $admin['id'],
	   'admin_name' => $admin['admin_name'],
	  );
      //7天内免登录
	  if($remember==1){
	    //admin_name,passwd连接加密
	    $hashcode = Common::encrypt($admin_name.Common::encrypt($passwd));
	    setcookie("admin[id]",$admin['id'],Common::gmtime()+7*60*60*24,'/');
		setcookie("admin[hashcode]",$hashcode,Common::gmtime()+7*60*60*24,'/');   
	  }
      $res['status'] = 1;
	  $res['msg']= '登录成功，跳转...';
	  $res['href'] = '/'.ADMIN_PATH.'/?m=index';
   }
   else{
      $res['msg'] = '账号密码不正确';
   }
   echo $Json->encode($res);
   exit;
}
?>