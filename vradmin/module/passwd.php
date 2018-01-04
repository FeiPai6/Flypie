<?php
//会员管理
if(!defined('IN_T')){
   die('禁止访问！');
}
if(empty($_POST)){
    $tp->assign('nav','修改密码');
}
else{
    $res['status']=0;
	$oldpwd = isset($_POST['oldpwd']) ? Common::sfilter($_POST['oldpwd']): '';
	$newpwd = isset($_POST['newpwd']) ? Common::sfilter($_POST['newpwd']): '';
	$confirmpwd = isset($_POST['confirmpwd']) ? Common::sfilter($_POST['confirmpwd']): '';
	if (mb_strlen($oldpwd)<6||mb_strlen($newpwd)<6||mb_strlen($confirmpwd)<6) {
		$res['msg'] = "密码长度不能低于6位!";
	}
	else if($newpwd!=$confirmpwd){
		$res['msg'] = "新密码和确认密码不相同！";
	}
	else {
		$admin = $Db->query("select * from ".$Base->table('admin')." where id =".$admin['id'],"Row");
		if($admin['passwd']!=Common::encrypt($oldpwd)){
			$res['msg'] = "原密码不正确!";
		}
		else{
			 $Db->update($Base->table('admin'),array('passwd'=>Common::encrypt($newpwd)),array('id'=>$admin['id']));
			 unset($_SESSION['admin']);
			 //如果记住密码
			 setcookie("admin[id]",0,Common::gmtime()-1,'/');
			 setcookie("admin[hashcode]",'',Common::gmtime()-1,'/');
	         $res = array('status'=>1,'msg'=>'密码修改成功...');
		}
	}
	echo $Json->encode($res);
	exit;
}
?>