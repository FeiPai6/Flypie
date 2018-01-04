<?php
/*
 *  初始化常用类库
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: init.php 28028 2016-04-27Z  $
*/
if(!defined('IN_T')) 
{
 die('禁止访问！');
}

//session设置
//session_set_cookie_params(0,'/','..com');   //设置session作用域
session_start();

//自定义后台目录，管理后台目录名须与此一致
define('ADMIN_PATH','vradmin');

//程序所在根目录
if(!defined('ROOT_PATH')){
   define('ROOT_PATH',str_replace(ADMIN_PATH.'/include/init.php','',str_replace('\\', '/', __FILE__)));
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
require_once ROOT_PATH.ADMIN_PATH.'/include/lib_main.php';

/* 初始化基本类 */
$Json = new Json;
$Db = MyPDO::getInstance($db_host,$db_user,$db_pass,$db_name,$db_charset);
$Base = new Base($db_name,$db_prefix);

/* 将登录信息输出到前台 */
$admin = array(
 'id' => isset($_SESSION['admin']['id']) ? $_SESSION['admin']['id']: 0,
 'admin_name' => isset($_SESSION['admin']['admin_name']) ? $_SESSION['admin']['admin_name']: '',
);

/* 7天内免登录 */
if($_COOKIE['admin']['id']>0 && $admin['id']==0){ 
   $sql = "select * from ".$Base->table('admin')." where id=".$_COOKIE['admin']['id']."";
   $u = $Db->query($sql,"Row");
   $hashcode = Common::encrypt($u['admin_name'].$u['passwd']);
   if($hashcode==$_COOKIE['admin']['hashcode']){
     unset($u['passwd']);
	 $_SESSION['admin'] = $admin = $u;
   }
}

$tp->assign('admin',$admin);

//获取当前版本
$custom = (array)simplexml_load_file(ROOT_PATH.'data/custom.conf', 'SimpleXMLElement', LIBXML_NOCDATA);
$_lang['customvip'] = $custom['vip'];
$_lang['customid'] = $custom['customid'];

/* 语言变量输出到前台 */
Transaction::get_site_config();	//提取站点配置
$_lang['admin_path'] = ADMIN_PATH;
$tp->assign('_lang',$_lang);

//重新赋值模板目录
$tp->template_dir = ROOT_PATH.ADMIN_PATH.'/template';

?>