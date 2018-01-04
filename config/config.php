<?php
/*
 * 配置信息
 * @author  02.16.2013 
*/
if(!defined('IN_T'))
{
   die('禁止访问！');
} 

/* 设置编码 */
header("Content-type:text/html; charset=utf-8");

/*设置时区 东八区*/
date_default_timezone_set('Asia/Chongqing');

/* php错误报告 */
error_reporting(E_ALL^E_WARNING^E_NOTICE);

/* 数据库配置 */
$db_type = 'mysql';   //数据库类型

$db_host = '192.168.0.88';

$db_user = 'root';

$db_pass =  '710761';

$db_port = 3306;

$db_charset = 'utf8';  //编码

$db_name = 'flypiepanorama';  

$db_prefix  = 'u_';    //表前缀

?>