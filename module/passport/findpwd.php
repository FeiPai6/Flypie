<?php
//找回密码
if(!defined('IN_T')){
	die('禁止访问！');
}

//取当前步骤
$step = $_SESSION['find_uid']? 'reset': 'validate';

//验证手机
if($step=='validate'){
	if(empty($_POST)){
		//todo
	}
	else{
		$res['status'] = 0;
		$sms_captcha = Common::sfilter($_POST['sms_captcha']);
		if($_SESSION['sms']['find']['captcha'] !=  Common::encrypt($sms_captcha)){
            $res['msg'] = '手机验证码不正确，请重新输入';
        }
		else if(!$uid=$Db->query("select pk_user_main from ".$Base->table('user')." where phone='".$_SESSION['sms']['find']['phone']."'","One")){
			$res['msg'] = '手机号未注册，请重新输入';
		}
		else{
			$res['status'] = 1;
			$res['msg'] = '手机验证成功，请重设密码';
			$_SESSION['find_uid'] = $uid;
		}
		echo $Json->encode($res);
		exit;
	}
}
//重设密码
else if($step=='reset'){
	//未完成手机验证，返回上一步
	if(!$_SESSION['find_uid']){
		Common::base_header("Location:".$_lang['host']."passport/findpwd\n");
	}
	if(empty($_POST)){
		//todo
	}
	else{
		$re['status'] = 0;
		$pwd = Common::sfilter($_POST['pwd']);
		$repwd = Common::sfilter($_POST['repwd']);
		if(empty($pwd)){
			$re['msg'] = '请输入正确的密码';
		}
		else if($pwd!=$repwd){
			$re['msg'] = '重复密码不正确';
		}
		else{
			$Db->update($Base->table('user'),array('password'=>Common::encrypt($pwd)),array('pk_user_main'=>$_SESSION['find_uid']));
			$re['status'] = 1;
			$re['href'] = '/passport/login';
			$re['msg'] = '重设密码成功，请重新登录';
			unset($_SESSION['sms']['find']);
			unset($_SESSION['captcha']['find']);
			unset($_SESSION['find_uid']);
		}
		echo $Json->encode($re);
		exit;
	}
}
$tp->assign('title','找回密码');
$tp->assign('step',$step);
?>