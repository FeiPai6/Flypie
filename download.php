<?php
/*
 *  下载功能
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: bind.php 28028 2016-06-19Z  $
*/
define('IN_T',true);
require_once "./source/include/init.php";

$act = Common::sfilter($_REQUEST['act']);
//下载离线项目
if ($act=='project') {
	$filename = Common::sfilter($_REQUEST['filename']);
	$filename = str_replace('.','',$filename).'.zip';
	$url = ROOT_PATH.'temp/down/'.$filename;
	if (!file_exists($url)) {
		die('找不到该文件');
	}
	createDowanload($url,$filename);
	exit;
}

function createDowanload($url,$filename,$isDelete=false){
	/* headers */
	//设置该次请求超时时长，1800s
	@ini_set("max_execution_time", "1800"); 
	
	header('Cache-control: private');
	header("Content-type:application/x-zip-compressed"); 
	header('Content-Length: '.filesize($url));
	header('Content-Disposition:attachment; filename='.$filename);
	flush();
	$fh = @fopen($url, 'r');
	while(!feof($fh)){
	    print fread($fh, 1024);
	    flush();
	}
	@fclose($fh);
	if($isDelete)
		unlink($url);
}

?>