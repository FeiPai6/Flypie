<?php
/*
 *  修改密码
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: passwd.php 28028 2016-06-19Z  $
*/
if(!defined('IN_T')){
	die('禁止访问！');
}
if(empty($_POST)){
	//todo
}
else{
	$oldpwd = Common::sfilter($_POST['oldpwd']);
	$newpwd = Common::sfilter($_POST['newpwd']);
	$repwd = Common::sfilter($_POST['repwd']);
	$re['status'] = 0;
	if(empty($oldpwd) || empty($newpwd)){
		$re['msg'] = '密码不能为空';
	}
	else if(mb_strlen($oldpwd)<6 || mb_strlen($newpwd)<6){
		$re['msg'] = '密码长度不能小于6位';
	}
	else if($newpwd!=$repwd){
		$re['msg'] = '重复密码不正确';
	}
	else if(!$Db->query("select pk_user_main from ".$Base->table('user')." where pk_user_main=".$user['pk_user_main']." and password='".Common::encrypt($oldpwd)."'","Row")){
		$re['msg'] = '原密码不正确';
	}
	else{
		$Db->update($Base->table('user'),array('password'=>Common::encrypt($newpwd)),array('pk_user_main'=>$user['pk_user_main']));
		Transaction::logout();
		$re = array('status'=>1,'msg'=>'密码修改成功，请重新登录','href'=>'/member/');
	}
	echo $Json->encode($re);
	exit;
}
$tp->assign('title','修改密码');
?>