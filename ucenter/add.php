<?php
/*
 *  上传项目
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: add.php 28028 2016-02-19Z  $
*/
define('IN_T',true);

require './include/init.php';

if($_SESSION['user']['pk_user_main']<1){
	echo ERROR_NO_LOGIN;
	exit;
}

//包含图片项目生成的module

//组装原始数据
$worksmain['hidelogo_flag']=1;
$worksmain['hideuser_flag']=1;
$worksmain['hideviewnum_flag']=1;
$worksmain['hideprofile_flag']=1;

$panoconfig['footmark'] = 0;
$panoconfig['comment'] = 0;

require ROOT_PATH.'module/add/pic.php';

?>