<?php
/*
 * 生成二维码
 * @author  09.12.2016
 */
define('IN_T',true);
require_once "./source/include/init.php";
require_once './source/qrcode/phpqrcode.php';

$act = Common::sfilter($_REQUEST['act']);

//二维码存储目录
$temp = ROOT_PATH.'data/qr/';
//不存在目录则创建
if (!is_dir($temp)) {
	Common::make_dir($temp);
}

//物体环视项目
if($act=='obj_around'){
	$oid = intval($_REQUEST['oid']);
	$obj = $Db->query('SELECT id , pk_user_main FROM '.$Base->table('object_around').' WHERE id = '.$oid,'Row');
	if (empty($obj)) {
		exit;
	}
	$QR = $temp.'obj_'.$obj['pk_user_main'].'_'.$oid.'.png';
	createQr($GLOBALS['_lang']['host'].'obj.php?oid='.$oid,$QR);
	$QR = createWithLogo($QR);
	header('Content-type: image/png');
	ob_clean();
	imagepng($QR);
	exit;
}
//全景视频
else if($act=='video'){
	$vid = intval($_REQUEST['vid']);
	$pro = $Db->query('SELECT id , pk_user_main, cdn_host FROM '.$Base->table('video').' WHERE id = '.$vid, 'Row');
	if (empty($pro)) {
		exit;
	}
	//没有cdn_host，则取当前的cdn_host
	if(empty($pro['cdn_host'])){
		$pro['cdn_host'] = $GLOBALS['_lang']['host'];	
	}
	$QR = $temp.'video_'.$pro['pk_user_main'].'_'.$vid.'.png';
	createQr($pro['cdn_host'].'video/play.html?vid='.$vid, $QR);
	$QR = createWithLogo($QR);
	header('Content-type: image/png');
	ob_clean();
	imagepng($QR);
	exit;
}
//全景图片
else{
	$viewid = Common::sfilter($_REQUEST['viewid']);
	if (empty($viewid)) {
		exit;
	}
	//查询该viewid对应项目
	$pro = $Db->query('SELECT w.pk_works_main, p.custom_logo FROM '.$Base->table('worksmain').' as w LEFT JOIN '.$Base->table('pano_config').' as p  ON p.pk_works_main=w.pk_works_main WHERE w.view_uuid = "'.$viewid.'"',"Row" );
	if (empty($pro)) {
		exit;
	}
	
	$QR = $temp.$viewid.'.png';
	//去掉二维码缓存
	createQr($GLOBALS['_lang']['host'].'tour/'.$viewid,$QR);
	// if (!file_exists($QR) ){
	// 	createQr($GLOBALS['_lang']['host'].'tour/'.$viewid,$QR);
	// }
	//生成带logo的二维码
	$custom_logo = $Json->decode($pro['custom_logo']);
	$logo;
	if ($custom_logo['useCustomLogo']=='1') {
		$logo = $custom_logo['logoImgPath'];
	}
	$QR = createWithLogo($QR,$logo);
	header('Content-type: image/png');
	ob_clean();
	imagepng($QR);
	exit;
}

function createQr($url,$QR){
	// url  路径  容错级别 大小 边距 保存并打印
	QRcode::png($url, $QR, 'Q', 8, 1);  
}

function createWithLogo($QR,$logo){
	//设置该次请求超时时长，10s
	@ini_set("max_execution_time", "10"); 
	//兼容php-fpm设置超时
	@ini_set("request_terminate_timeout", "10");
	if (empty($logo)) {
		//使用系统的默认logo
		$logo = ROOT_PATH.'plugin/custom_logo/images/custom_logo.png';
	}
	$QR = imagecreatefromstring(file_get_contents($QR));
	$logo = imagecreatefromstring(file_get_contents($logo));
	if ($QR&&$logo) {
		$QR_width = imagesx($QR);  
		$QR_height = imagesy($QR);  
		$logo_width = imagesx($logo);  
		$logo_height = imagesy($logo);  
		$logo_qr_width = $QR_width / 4;  
		$scale = $logo_width / $logo_qr_width;  
		$logo_qr_height = $logo_height / $scale;  
		$from_width = ($QR_width - $logo_qr_width) / 2;  
		imagecopyresampled($QR, $logo, $from_width, $from_width, 0, 0, $logo_qr_width, $logo_qr_height, $logo_width, $logo_height);
	}
	return $QR;
}
?>