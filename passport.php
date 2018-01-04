<?php
//通行证入口文件
define('IN_T',true);
require 'source/include/init.php';

//请求模块
$module = isset($_REQUEST['module']) ? Common::sfilter($_REQUEST['module']) : 'login';

//关闭注册
if($_lang['close_reg'] && $module=='register'){
   Common::base_header("Location:".$_lang['host']."passport/login\n");
}

//已登录
if($user['pk_user_main']>0){
   Common::base_header("Location:".$_lang['host']."member/\n");
}

if(file_exists($module_file= 'module/passport/'.$module.'.php')){
   require $module_file;
   $tp->assign('module',$module);
//   $tp->display($_lang['moban'].'/passport.tpl');
}
else{
   die('禁止访问！');
}
?>