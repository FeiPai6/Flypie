<?php
//微信登录
if(!defined('IN_T')){
	die('禁止访问！');
}
require ROOT_PATH.'source/include/cls_weixin.php';

$wx = new Weixin($_lang['wxweb_config']['appid'],$_lang['wxweb_config']['appsecret']);
$param = array(
	'scope'=>'snsapi_login',
	'redirect_uri'=>$_lang['host'].'passport/loginwx',
	);
$res = $wx->loginWeixin($param);
if($res){
	//print_r($res);
	//openid已存在
	if($user = $Db->query("select * from ".$Base->table('user')." where openid='".$res['openid']."'","Row")){
		$Db->update($Base->table('user'),array('last_time' => date('Y-m-d H:i:s',Common::gmtime())),array('pk_user_main'=>$user['pk_user_main']));
	}
	//openid不存在，插入记录
	else{
		$data = array(
			'openid'=>$res['openid'],
			'create_time'=>date('Y-m-d H:i:s',Common::gmtime()),
			'nickname'=>$res['nickname'],
			'last_time'=>date('Y-m-d H:i:s',Common::gmtime()),
		);
		$uid = $Db->insert($Base->table('user'),$data);
		//更新profile
		if($uid){
			$data = array(
				'pk_user_main'=>$uid,
				'avatar'=>mb_substr($res['headimgurl'],0,strrpos($res['headimgurl'],'/')),
			);
			$Db->replace($Base->table('user_profile'),$data);
		}
		$user = $Db->query("select * from ".$Base->table('user')." where pk_user_main=$uid","Row");
	}
	//赋值到session
	$_SESSION['user'] = array(
	   'pk_user_main'=>$user['pk_user_main'],
	   'nickname'=>$user['nickname'],
	   'last_time'=>$user['last_time'],
	   'phone'=>$user['phone'],
	   'level'=>$user['level'],
	);
	Common::base_header("Location:".$_lang['host']."member/\n");
}
?>