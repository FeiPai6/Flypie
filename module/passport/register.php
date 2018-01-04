<?php
//注册
if(!defined('IN_T')){
	die('禁止访问！');
}
//显示界面
if(empty($_POST)){
	$tp->assign('redirectUrl',$_REQUEST['redirectUrl'] ? $_REQUEST['redirectUrl']:'');
    $tp->assign('title','注册');
}
//处理数据
else{
      $res['status'] = 0;
      $params = array(
                  'nickname'=>empty($_REQUEST['nickname'])?"":Common::sfilter($_REQUEST['nickname']),
                  'phone'=>empty($_REQUEST['phone'])?"":Common::sfilter($_REQUEST['phone']),
                  'password'=>empty($_REQUEST['password'])?"":Common::sfilter($_REQUEST['password']),
            );
      if ($params['nickname']==""||mb_strlen($params['nickname'])>20||!Common::is_mobile($params['phone'])
                  ||strlen($params['password'])<6||strlen($params['password'])>20) {
            $res['msg'] = '参数有误';
      }else{
         $sms_captcha = isset($_POST['sms_captcha']) ? strtolower(Common::sfilter($_POST['sms_captcha'])) : '';
         if($Db->getCount($Base->table('user'),"pk_user_main",array('phone'=>$_SESSION['sms']['reg']['phone']))>0){
            $res['msg'] = '手机号已被使用，请换一个';
         }else if($_SESSION['sms']['reg']['captcha'] !=  Common::encrypt($sms_captcha)){
           $res['msg'] = '手机验证码不正确，请重新输入';
         }else{

            $redirectUrl = isset($_POST['redirectUrl']) ? $_POST['redirectUrl']:'';
            $params['create_time'] = date('Y-m-d H:i:s',Common::gmtime());
            $params['last_time'] = date('Y-m-d H:i:s',Common::gmtime());
            $params['phone'] = $_SESSION['sms']['reg']['phone'];
            $params['password'] = Common::encrypt($params['password']);
            unset($_SESSION['sms']);
            unset($_SESSION['captcha']);
            unset($_SESSION['reg']['referrer']);
            unset($_SESSION['sms']['reg']['phone']);
            if($uid = $Db->insert($Base->table('user'),$params)){
                  $user = $Db->query("SELECT * FROM ".$Base->table('user')." WHERE pk_user_main=".$uid,'Row');
                   $_SESSION['user'] = array(
                              'nickname'=>$user['nickname'],
                              'phone'=>$user['phone'],
							  'level'=>$user['level'],
                              'avatar'=>$Db->query("select avatar from ".$Base->table('user_profile')." where pk_user_main=$uid","One"),
                              'pk_user_main'=>$uid
                        );
               
               $res = array('status'=>1,'msg'=>'注册成功，正在跳转....','href'=>$redirectUrl);
            }
         }
     }
     echo $Json->encode($res);
     exit;
}
?>