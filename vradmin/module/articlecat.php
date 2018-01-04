<?php
//商品分类
if(!defined('IN_T')){
   die('禁止访问！');
}

$act = Common::sfilter($_REQUEST['act']);

//编辑，添加
if($act=='edit'){
   $acid = intval($_REQUEST['acid']);
   //检验id是否存在
   if($acid>0){
      $ac = $Db->query("select * from ".$Base->table('article_cat')." where id=$acid","Row");
      if(empty($ac)){
         $acid = 0;
      }
   }
   if(empty($_POST)){
      $res = get_article_cats(true);
      $tp->assign('res',$res);
      $tp->assign('ac',$ac);
   }
   else{
      $data = array(
      'cat_name'=>Common::sfilter($_POST['cat_name']),
      'parent_id'=>intval($_POST['parent_id']),
      'sort'=>intval($_POST['sort']),
      );
      $re['status'] = 0;
      if(empty($data['cat_name'])){
         $re['msg'] = '请填写分类名称';
      }
      else{
         if($acid>0){
            $Db->update($Base->table('article_cat'),$data,array('id'=>$acid));
         }
         else{
            $Db->insert($Base->table('article_cat'),$data);
         }
         $re = array('status'=>1,'msg'=>$acid>0?'编辑成功':'添加成功','href'=>'/'.$_lang['admin_path'].'/?m=articlecat',);
      }
      echo $Json->encode($re);
      exit;
   }
}
//删除
else if($act=='delete'){
   $acid = intval($_REQUEST['acid']);
   $re['status'] = 0;
   if($acid>0){
      //检验acid是否存在子分类
      $children = $Db->query("select id from ".$Base->table('article_cat')." where parent_id=$acid","One");
      //检验acid是否有文章
      $arts = $Db->query("select id from ".$Base->table('article')." where id = $acid","One");
      if(!empty($children)){
         $re['msg'] = '该分类下存在子分类，无法删除！';
      }
      else if(!empty($arts)){
         $re['msg'] = '该分类下存在文章，无法删除！';
      }
      else{
         $Db->delete($Base->table('article_cat'),array('id'=>$acid));
         $re['status'] = 1;
      }
   }
   echo $Json->encode($re);
   exit;
}
//列表
else{
   $res = get_article_cats();
   $tp->assign('res',$res);
}
$tp->assign('act',$act);
$tp->assign('nav','文章分类');

?>