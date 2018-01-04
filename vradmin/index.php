<?php
//管理后台入口文件
define('IN_T',true);
require 'include/init.php';

//请求模块
$module = isset($_REQUEST['m']) ? Common::sfilter($_REQUEST['m']) : 'index';
//未登录
if($admin['id']<=0 && $module!='login'){
   Common::base_header("Location:".$_lang['host']."".ADMIN_PATH."/?m=login\n");
}
if(file_exists($module_file= 'module/'.$module.'.php')){ 
   require $module_file;
   $tp->assign('title','管理后台');
   $tp->assign('module',$module);
   $tp->display('index.tpl');
}
else{
   die('禁止访问！');
}
?>