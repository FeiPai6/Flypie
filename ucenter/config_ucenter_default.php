<?php
/*
 *  ucenter配置文件
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author: liyuanzhang #qq.com $
 * $Id: config_ucenter_default.php 28028 2016-02-19Z liyuanzhang $
*/
if(!defined('IN_T'))
{
 die('禁止访问！');
}

define('APPID',          'xxxxxxxxxxxx');
define('APPSECRET',      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

//定义错误码常量
define('SUCCESS', 1);  //执行成功
define('ERROR_CHECK_FAILURE', 1001);   //签名验证错误
define('ERROR_METHOD_NO_EXISTS', 1003);   //方法不存在
define('ERROR_USER_NO', 1006);   //用户不存在
define('ERROR_NO_LOGIN',1007);   //用户未登录
define('ERROR_OTHER', 1099);  //其他错误
?>