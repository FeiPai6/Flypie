<?php
//前台入口文件
define('IN_T',true);
require 'source/include/init.php';


//请求模块
$module = isset($_REQUEST['module']) ? Common::sfilter($_REQUEST['module']) : 'index';
//前台的module模块在模板目录下
if(file_exists($module_file= 'template/'.$_lang['moban'].'/module/'.$module.'.php')){ 
   require $module_file;
   $tp->assign('module',$module);
   $tp->display($_lang['moban'].'/index.tpl');
}
else{
   die('禁止访问！');
}
?>