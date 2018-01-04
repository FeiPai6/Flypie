<?php
/**
 * 生成验证码
 * Author:
 * Release Date: 2013-8-28
 **/
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

define('IN_T', true);

require('./source/include/init.php');
require('./source/include/cls_captcha.php');

$act = Common::sfilter($_REQUEST['act']);

if(!empty($act)){
	$rsi = new Captcha();
	$rsi->TFontSize=array(15,20);
	$rsi->Width=60;
	$rsi->Height=32;
	$code = $rsi->RandRSI();
	$_SESSION['captcha'][$act] = md5(strtolower($code));
	$rsi->Draw();
	exit;
}

?>