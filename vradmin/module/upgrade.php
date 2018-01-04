<?php
/*
 *  获取升级信息
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: upgrade.php 28028 2016-04-27Z  $
*/
if(!defined('IN_T')) 
{
 die('禁止访问！');
}
require_once ROOT_PATH.ADMIN_PATH.'/include/cls_upgrade_util.php';

$package_dir = ROOT_PATH.'upgrade/package/';//存放压缩文件和解压后代码的文件价

$act = Common::sfilter($_REQUEST['act']);


//下载升级包
if($act == 'download'){
	$re['status'] = 0;

	$version = (array)simplexml_load_file(ROOT_PATH.'data/version.conf', 'SimpleXMLElement', LIBXML_NOCDATA);
	$url = $version['downurl']."upgrade.php?customid=".$custom['customid']."&code=".$version['code']."&step=1";
	//设置该次请求超时时长，1800s
	@ini_set("max_execution_time", "1800"); 
	//兼容php-fpm设置超时
	@ini_set("request_terminate_timeout", "1800");
	
	$file = file_get_contents($url);
	if (!$file) {
		$re['msg'] = '升级包下载失败';
	}else{
		if (file_exists($package_dir)) {
			//删除package目录
			require_once ROOT_PATH.'source/include/cls_file_util.php';
			FileUtil::unlinkDir($package_dir);
		}
		Common::make_dir($package_dir);
		$zip_file = Common::gmtime().'.zip';
		file_put_contents($package_dir.$zip_file, $file);
		 @chmod($package_dir.$zip_file, 0777);
		$re['status'] = 1;
		$re['zip_file'] = $zip_file;
	}
	echo $Json->encode($re);
	exit;
}
//解压缩
else if($act == 'unzip'){
	$re['status'] = 0 ;
	$zip_file = Common::sfilter($_REQUEST['zip_file']);
	$zip_file_ab = $package_dir.$zip_file;
	if (!file_exists($zip_file_ab)) {
		$re['msg'] = '升级包不存在';
	}else{
		require_once ROOT_PATH.'source/include/pclzip.lib.php';
		$archive = new PclZip($zip_file_ab);
		if ($archive->extract(PCLZIP_OPT_PATH, $package_dir)){
		    $re['status'] = 1;
		}else {
		    $re['msg'] = '升级包解压失败' ;
		    unlink($zip_file_ab);
		}
	}
	echo $Json->encode($re);
	exit;
}
//得到被替换的列表,并判断客户是否有修改过
else if($act == 'validate_dir'){
	$re['status'] = 0;
	if (!file_exists($package_dir.'code/')) {
		$re['msg'] = '升级文件不存在';
	}else{
		$up_util = new UpgradeUtil(ROOT_PATH);
		
		$list = $up_util->list_validate_dir($package_dir.'code/');
		$re['list'] = $list;
		$re['status'] = 1;
	}
	echo $Json->encode($re);
	exit;
}
//得到被替换的列表,并判断客户是否有修改过
else if($act == 'validate'){
	$re['status'] = 0;
	if (!file_exists($package_dir.'code/')) {
		$re['msg'] = '升级文件不存在';
	}else{
		$up_util = new UpgradeUtil(ROOT_PATH);
		$hash_list_ab = ROOT_PATH.'upgrade/hash_list.php';
		if(!file_exists($hash_list_ab))
			$up_util->generate_md5_list();
		require_once $hash_list_ab;
		$list = $up_util->list_validate_file($package_dir.'code/',$hash_list);
		$re['list'] = $list;
		$re['status'] = 1;
	}
	echo $Json->encode($re);
	exit;
}
//替换文件
else if($act == 'apply'){
	$re['status'] = 0;
	$file = Common::sfilter($_REQUEST['file']);

	$new_path = $package_dir.'code/'.$file;
	$old_path = ROOT_PATH.$file;

	if(!file_exists($new_path)){
		$re['msg'] = '升级失败，找不到对应的升级文件';
	}else{
		require_once ROOT_PATH.'source/include/cls_file_util.php';
		if(FileUtil::copyFile($new_path,$old_path,true)){
			$re['file'] = $file;
			$re['status'] = 1;
		}
	}
	echo $Json->encode($re);
	exit;
}
//重新计算覆盖成功的文件的MD5值
else if ($act == 'refresh') {
	$files = $Json->decode($_REQUEST['files']);
	require_once ROOT_PATH.'upgrade/hash_list.php';
	foreach ($files as $value) {
		$hash_list[$value] = md5_file(ROOT_PATH.$value);
	}
	$up_util = new UpgradeUtil(ROOT_PATH);
	if($up_util->md5_list_write($hash_list))
		$re['status'] = 1;
		
	echo $Json->encode($re);
	exit;
}
else if($act == "update_db"){
	$db_file = $package_dir.'up_db.php';
	$re['status'] = 0 ;
	if (!file_exists($db_file)) {
		$re['msg'] = '没有数据库升级';
	}else{
		require_once $db_file;
		$re['status'] = 1;
		$re['msg'] = '数据库升级成功';
	}
	//删除package目录
	echo $Json->encode($re);
	exit;
}
else if($act == 'check'){
	$version = (array)simplexml_load_file(ROOT_PATH.'data/version.conf', 'SimpleXMLElement', LIBXML_NOCDATA);

	$url = $version['downurl']."upgrade.php?customid=".$custom['customid']."&code=".$version['code']."&from=".urlencode($_lang['host'])."";
	$res = Curl::callWebServer($url,'','get',false);

	echo $res;
	exit;

}
else if($act == 'step_6'){
	//删除package目录
	require_once ROOT_PATH.'source/include/cls_file_util.php';
	FileUtil::unlinkDir($package_dir);
}
$tp->assign('nav','自动升级');
$tp->assign('act',$act);
?>