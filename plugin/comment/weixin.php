<?php
/*
 *  微信接口
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: weixin.php 28028 2016-03-09Z  $
*/
define('IN_T',true);
require_once '../../source/include/init.php';
require_once '../../source/include/cls_weixin.php';

//启用微信开发功能时配置，放开代码
//$wx = new Weixin($_lang['wx_config']['appid'],$_lang['wx_config']['appsecret'],$_lang['wx_config']['token']);
//$wx->valid(true);

$act = Common::sfilter($_REQUEST['act']);

//微信评论，登录
if($act=='wxcomment'){
    $step = Common::sfilter($_REQUEST['step']);
	//检查是否已授权登录过
	if($step=='check'){
		$res['ret'] = 0;
		if (!empty($_COOKIE['wx']['head_img'])) {
			$res['ret']=1;
			$res['img']=$_COOKIE['wx']['head_img'];	
		}
		echo json_encode($res);
		exit;
	}
	//授权
	$pid = Common::sfilter($_REQUEST['project']);
	$sid = Common::sfilter($_REQUEST['scene']);
	//微信打开
	if(strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false){
		$wx = new Weixin($_lang['wx_config']['appid'],$_lang['wx_config']['appsecret'],$_lang['wx_config']['token']);
		$param = array(
			'scope'=>'snsapi_userinfo',
			'redirect_uri'=>$_lang['host'].'plugin/comment/weixin.php?act=wxcomment',
			'state'=>$pid.'.'.$sid,
			);	
	}
	//其他浏览器打开
	else{
		$wx = new Weixin($_lang['wxweb_config']['appid'],$_lang['wxweb_config']['appsecret']);
		$param = array(
			'scope'=>'snsapi_login',
			'redirect_uri'=>$_lang['host'].'plugin/comment/weixin.php?act=wxcomment',
			'state'=>$pid.'.'.$sid,
			);
	}
	$user = $wx->loginWeixin($param);
	if($user){
		$state = explode(".",$user['state']);
		$head_img = GrabImage($user['headimgurl']);
		setcookie('wx[head_img]',$head_img,time()+1296000,"/");
		setcookie('wx[nickname]',$user['nickname'],time()+1296000,"/");
		setcookie('wx[sex]',$user['sex'],time()+1296000,"/");
		setcookie('wx[province]',$user['province'],time()+1296000,"/");
		setcookie('wx[city]',$user['city'],time()+1296000,"/");
		Common::base_header("Location:".$_lang['host']."tour/".$state[0]."?scene=".$state[1].""); 
	}
}

/*
*@通过curl方式获取指定的图片到本地
*@ 完整的图片地址
*@ 要存储的文件名
*/
function GrabImage($url)
{
  $url = substr($url,0,-1)."64"; 
  $filename = explode("/",$url);
  $filename = $filename[4].".jpg";
 //去除URL连接上面可能的引号
  //$url = preg_replace( '/(?:^['"]+|['"/]+$)/', '', $url );
  $hander = curl_init();
  $fp = fopen(dirname(__FILE__).'/avatar/'.$filename,'wb');
   if(!$fp){
  	die("写入头像失败");
  }
  curl_setopt($hander,CURLOPT_URL,$url);
  curl_setopt($hander,CURLOPT_FILE,$fp);
  curl_setopt($hander,CURLOPT_HEADER,0);
  curl_setopt($hander,CURLOPT_FOLLOWLOCATION,1);
  //curl_setopt($hander,CURLOPT_RETURNTRANSFER,false);//以数据流的方式返回数据,当为false是直接显示出来
  curl_setopt($hander,CURLOPT_TIMEOUT,60);
  curl_exec($hander);
  curl_close($hander);
  fclose($fp);
  return '/plugin/comment/avatar/'.$filename;
}
?>