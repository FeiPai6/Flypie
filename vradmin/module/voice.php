<?php
/*
 *  后台首页
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author: liyuanzhang #qq.com $
 * $Id: index.php 28028 2016-03-09Z liyuanzhang $
*/

if(!defined('IN_T')){
   die('禁止访问！');
}

$act = Common::sfilter($_GET['act']);

if($act == 'add'){
   if(empty($_POST)){
   	  $tp->assign('up_url',$_lang['up_url']);
      $tp->assign('act',$act);
   }
   else{
      $params = $Json->decode($_REQUEST['params']);
      $re['status'] = 0 ;
      if (empty($params)) {
         $re['msg'] = '非法参数';
      }
	  else{
          $title =  Common::sfilter($params['title']);
          if(mb_strlen($title)<0||mb_strlen($title)>20){
            $re['msg'] = '请输入0到20个字符的标题';
         }else{
            $absolutelocation = Common::sfilter($params['absolutelocation']);
            if (empty($absolutelocation)) {
               $re['msg'] = '请上传素材图片';
            }else{
                $data['absolutelocation'] = $_lang['cdn_host'] . $absolutelocation;
                $data['flag_del'] = 0 ;
                $data['title'] = $title;
                $data['name_uniqid'] = Common::guid(16);
                $Db->insert($Base->table('def_voice'),$data);
                $re['status']=1;
            }
         }
      }
      echo $Json->encode($re);
      exit;
   }
}
else if($act == 'del'){
   $pk = intval($_POST['tid']);
   $res = $Db->update($Base->table('def_voice'), array('flag_del'=>1), array('pk_voice'=>$pk));
   $res = $res != false ? json_encode(array('status'=>1)) :  json_encode(array('msg'=>'失败！请重试'));
   echo $res;
   exit;
}
else{
   $sql = "SELECT * FROM u_def_voice WHERE flag_del = 0 ORDER BY pk_voice DESC";
   $lists = $Db->query($sql);
   $tp->assign('lists',$lists);
   $tp->assign('act',$act);
   $tp->assign('nav','音频素材');
}
?>