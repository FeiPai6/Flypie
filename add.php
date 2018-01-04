<?php
//添加项目(图片、视频)入口文件
define('IN_T',true);
require 'source/include/init.php';
//未登录
if($user['pk_user_main']<=0){
   Common::base_header("Location:".$_lang['host']."passport/login?redirectUrl=/member/$module\n");
}
//请求模块
$module = isset($_REQUEST['module']) ? Common::sfilter($_REQUEST['module']) : 'pic';

if(file_exists($module_file= 'module/add/'.$module.'.php')){ 
   require $module_file;
   $tp->assign('module',$module);
   $tp->assign('limit_num',Transaction::get_user_projects_limit($user['pk_user_main']));
//   $tp->display('add/add.tpl');
}
else{
   die('禁止访问！');
}
?>