<?php
/**
 * 发送短信验证码
 * @author  #qq.com 
 * @date 9.16.2012
*/
define('IN_T',true);
require './source/include/init.php';

$act_legal = array(
'reg' => '注册新用户',
'find' => '找回密码',
);

$act = Common::sfilter($_REQUEST['act']);
$re['status'] = 0;

//非法请求
if(!in_array($act,array_keys($act_legal))){
   $re['msg'] = '非法请求';
} 
else{
  if($act=='reg' || $act=='find'){
     $phone =  Common::sfilter($_REQUEST['phone']);
  }
  //不是注册和找回密码时，自动提取手机号
  else{
     $phone = $Db->query("select phone from ".$Base->table('user')." where id = ".$user['pk_user_main']."","One");
  }
  //图片验证码
  $captcha = Common::sfilter($_REQUEST['captcha']); 
  if($_SESSION['captcha'][$act]!=md5(strtolower($captcha))){
      $re['msg'] = '请先输入正确的图片验证码';
   }
   else if(!Common::is_mobile($phone)){
      $re['msg'] = '请输入正确的手机号';
   }
   //1个手机号60秒内只能发送一次
   else if($_SESSION['sms'][$act]['phone']==$phone && Common::gmtime() - $_SESSION['sms'][$act]['send_time'] < 60){
      $re['msg'] = '1个手机号1分钟内只能发送1次验证码';
   }
   else{
      $sms_captcha = Common::get_rand_number();
	  //云通讯发送短信
	  if($_lang['global_sms']=='yuntongxun'){
		  require './source/include/cls_sms.php';
		  $Sms_yuntongxun = new Sms_yuntongxun($_lang['yuntongxun_config']['accountSid'],$_lang['yuntongxun_config']['accountToken'],$_lang['yuntongxun_config']['appId'],$_lang['yuntongxun_config']['templateId']);
		  $Sms_yuntongxun->sendMsg($phone,array($sms_captcha,$act_legal[$act],15),$_lang['yuntongxun_config']['templateid']);
	  }
	  //阿里大鱼发送短信
	  if($_lang['global_sms']=='alidayu'){
		  require './source/alidayu/TopSdk.php';
		  sendSMS($_lang['alidayu_config']['appkey'],$_lang['alidayu_config']['secretkey'],$_lang['alidayu_config']['freesignname'],$_lang['alidayu_config']['templatecode'],$phone,$sms_captcha); 
	  }
	  $_SESSION['sms'][$act]['send_time'] = Common::gmtime();
	  $_SESSION['sms'][$act]['phone'] = $phone;
	  $_SESSION['sms'][$act]['captcha'] = Common::encrypt($sms_captcha);
	  $re['status'] = 1;
   }
}
echo $Json->encode($re);
exit;
?>