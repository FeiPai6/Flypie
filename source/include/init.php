<?php
/*
 *  项目初始化文件
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

//session设置 
//session_set_cookie_params(0,'/','..com');   //设置session作用域
session_start();

//程序所在根目录
if(!defined('ROOT_PATH')){
   define('ROOT_PATH',str_replace('source/include/init.php','',str_replace('\\', '/', __FILE__)));
}
/* 配置文件 */
require_once ROOT_PATH.'config/config.php';

//smarty配置文件
require_once ROOT_PATH.'source/include/smarty/smarty.config.php';

/* 常量 */
require_once ROOT_PATH.'source/include/inc_constant.php';

/* 语言库 */
require_once ROOT_PATH.'source/language/common.php';

/* 基本类 */
require_once ROOT_PATH.'source/include/cls_json.php';
require_once ROOT_PATH.'source/include/cls_db.php';
require_once ROOT_PATH.'source/include/cls_base.php';
require_once ROOT_PATH.'source/include/cls_common.php';   //Common方法
require_once ROOT_PATH.'source/include/cls_transaction.php';   //Transaction方法
require_once ROOT_PATH.'source/include/cls_curl.php';

/* 初始化基本类 */
$Json = new Json;
$Db = MyPDO::getInstance($db_host,$db_user,$db_pass,$db_name,$db_charset);
$Base = new Base($db_name,$db_prefix);

/* 将session登录信息映射到$user */
$user = array(
 'pk_user_main' => isset($_SESSION['user']['pk_user_main']) ? $_SESSION['user']['pk_user_main']: 0,
 'phone' => isset($_SESSION['user']['phone']) ? Common::hide_middle($_SESSION['user']['phone'],3,4): '',
 'nickname' => isset($_SESSION['user']['nickname']) ? $_SESSION['user']['nickname']: '',
 'avatar' => isset($_SESSION['user']['avatar']) ? $_SESSION['user']['avatar']: '',
 'level' => isset($_SESSION['user']['level']) ? $_SESSION['user']['level']: '',
);

/* 7天内免登录 */
if($_COOKIE['remember']['id']>0 && $user['pk_user_main']<1){ 
   $u = $Db->query("select pk_user_main,phone,nickname,level,password from ".$Base->table('user')." where pk_user_main=".$_COOKIE['remember']['id']."","Row");
   $hashcode = Common::encrypt($u['phone'].$u['password']);
   if($hashcode==$_COOKIE['remember']['hashcode']){
     unset($u['password']);
	 $u['avatar'] = $Db->query("select avatar from ".$Base->table('user_profile')." where pk_user_main=".$u['pk_user_main']."","One");
	 $_SESSION['user'] = $user = $u;
   }
}

$tp->assign('user',$user);

/* 语言变量输出到前台 */
Transaction::get_site_config();	//提取站点配置
//临时关闭站点
if($_lang['tempclose']){
	echo "<div style=\"text-align:center;\">".$_lang['closereason']."</div>";
	exit;
}
$_SESSION['is_mobile'] = Common::is_mobile_visit();
$tp->assign('_lang',$_lang);

//提取站点导航链接
$tp->assign('nav_links',Transaction::get_nav_links());
?>