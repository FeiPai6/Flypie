<?php
/*
 *  ucenter初始化文件
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: init.php 28028 2016-02-19Z  $
*/
if(!defined('IN_T')) 
{
 die('禁止访问！');
}

//程序所在根目录
if(!defined('ROOT_PATH')){
   define('ROOT_PATH',str_replace('ucenter/include/init.php','',str_replace('\\', '/', __FILE__)));
}

/* 配置文件 */
require_once ROOT_PATH.'config/config.php';
/* ucenter配置文件 */
require_once ROOT_PATH.'ucenter/config_ucenter_default.php';

/* 基本类 */
require_once ROOT_PATH.'source/include/cls_db.php';
require_once ROOT_PATH.'source/include/cls_base.php';
require_once ROOT_PATH.'source/include/cls_common.php';   //Common方法
require_once ROOT_PATH.'source/include/cls_transaction.php';   //Transaction方法
require_once ROOT_PATH.'source/include/cls_curl.php';
require_once ROOT_PATH.'source/include/cls_json.php';
require_once ROOT_PATH.'source/language/common.php';
require_once ROOT_PATH.'source/include/inc_constant.php';

/* ucenter专用类 */
require_once ROOT_PATH.'ucenter/include/cls_common.php';

//session设置 
if(!empty($_REQUEST['code'])){
	session_id($_REQUEST['code']);
}
session_start();

/* 将session映射到变量 */
$user = array(
 'pk_user_main' => isset($_SESSION['user']['pk_user_main']) ? $_SESSION['user']['pk_user_main']: 0,
 'phone' => isset($_SESSION['user']['phone']) ? Common::hide_middle($_SESSION['user']['phone'],3,4): '',
 'nickname' => isset($_SESSION['user']['nickname']) ? $_SESSION['user']['nickname']: '',
 'avatar' => isset($_SESSION['user']['avatar']) ? $_SESSION['user']['avatar']: '',
 'level' => isset($_SESSION['user']['level']) ? $_SESSION['user']['level']: '',
);

/* 初始化基本类 */
$Json = new Json;
$Db = MyPDO::getInstance($db_host,$db_user,$db_pass,$db_name,$db_charset);
$Base = new Base($db_name,$db_prefix);

/* 语言变量输出到前台 */
Transaction::get_site_config();	//提取站点配置
?>