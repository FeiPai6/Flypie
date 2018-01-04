<?php
/**
 * 用户管理专用方法
 * @author  
 * @date 10.03.2016
 */
 
//新增用户
function ucinsert(){
	$data = array(
	'phone'=>Common::sfilter($_REQUEST['phone']),
	'openid'=>Common::sfilter($_REQUEST['openid']),
	'nickname'=>Common::sfilter($_REQUEST['nickname']),
	'password'=>Common::sfilter($_REQUEST['password']),
	'level'=>intval($_REQUEST['level']),   //用户级别，1-3，默认为1 
	'state'=>intval($_REQUEST['state']),   //用户状态，0为正常，1为禁止，默认为0
	);
	$GLOBALS['Db']->insert($GLOBALS['Base']->table('user'), $data);
	echo SUCCESS;
	exit;
}

//修改用户资料
function ucedit(){
	$data = array(
	'phone'=>Common::sfilter($_REQUEST['phone']),
	'openid'=>Common::sfilter($_REQUEST['openid']),
	'nickname'=>Common::sfilter($_REQUEST['nickname']),
	'password'=>Common::sfilter($_REQUEST['password']),
	'level'=>Common::sfilter($_REQUEST['level']),
	'state'=>Common::sfilter($_REQUEST['state']),
	);
	$phone_previous = Common::sfilter($_REQUEST['phone_previous']);
	$GLOBALS['Db']->update($GLOBALS['Base']->table('user'), $data, array('phone'=>$phone_previous));
	echo SUCCESS;
	exit;
}

//删除用户
function ucdelete(){
	$phone = Common::sfilter($_REQUEST['phone']);
	$GLOBALS['Db']->delete($GLOBALS['Base']->table('user'), array('phone'=>$phone));
	echo SUCCESS;
	exit;	
}

//用户登录
//@param $phone:用户手机号
function uclogin(){
	$phone = Common::sfilter($_REQUEST['phone']);
	$redirect_uri = empty($_REQUEST['redirect_uri']) ? '' : urldecode($_REQUEST['redirect_uri']);
	
	$sql = "SELECT pk_user_main,phone,nickname,level FROM ".$GLOBALS['Base']->table('user')." WHERE phone ='$phone'";
	$userInfo = $GLOBALS['Db']->query($sql,"Row");
	//用户不存在
	if(!$userInfo){
		echo ERROR_USER_NO;
		exit;
	}
	//匹配成功，创建SESSION
	$_SESSION['user'] = array(
		'nickname'=>$userInfo['nickname'],
		'phone'=>$userInfo['phone'],
		'pk_user_main'=>$userInfo['pk_user_main'],
		'level'=>$userInfo['level'],
		'avatar' => $GLOBALS['Db']->query("select avatar from ".$GLOBALS['Base']->table('user_profile')." where pk_user_main=".$userInfo['pk_user_main']."","One"),
	);
	//取得当前session_id
	$code = session_id();
	//未传回调地址，则直接输出code，终止程序
	if(empty($redirect_uri)){
		echo $code;
		exit;
	}
	else{
		//回调地址有"?"
		if(strpos($redirect_uri,'?')){
			$redirect_uri = $redirect_uri."&code=".$code;
		}else{
			$redirect_uri = $redirect_uri."?code=".$code;
		}
		Common::base_header("Location:".$redirect_uri."\n");
	}
}

//用户退出
function uclogout(){
	Transaction::logout();
}
?>