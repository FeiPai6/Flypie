<?php
//商品分类
if(!defined('IN_T')){
   die('禁止访问！');
}

$act = Common::sfilter($_REQUEST['act']);
//编辑，添加
if($act=='edit'){
   $aid = intval($_REQUEST['id']);
   //检验id是否存在
   if($aid>0){
      $a = $Db->query("select * from ".$Base->table('article')." where id=$aid","Row");
      if(empty($a)){
         $aid = 0;
      }
   }
   if(empty($_POST)){
      $res = get_article_cats();
      $tp->assign('res',$res);
      $tp->assign('a',$a);
   }
   else{
      $data = array(
      'title'=>Common::sfilter($_POST['title']),
      'cat_id'=>intval($_POST['cat_id']),
      'content'=>Common::sfilter($_POST['content'],'html'),
      'keywords'=>Common::sfilter($_POST['keywords']),
	  'is_nav'=>Common::sfilter($_POST['is_nav']),
	  'sort'=>intval($_POST['sort']),
      );
      $tags = $_POST['tags'];
      $re['status'] = 0;
      if(empty($data['title'])){
         $re['msg'] = '请填写文章标题';
      }
      else if($data['cat_id']<1){
         $re['msg'] = '请选择文章分类';
      }
      else if(empty($data['content'])){
         $re['msg'] = '请填写文章详情';
      } 
      else{
         if($aid>0){
            $Db->update($Base->table('article'),$data,array('id'=>$aid));
         }
         else{
            $Db->insert($Base->table('article'),$data);
         }
         $re = array('status'=>1,'msg'=>$aid>0?'编辑成功':'添加成功','href'=>'/'.$_lang['admin_path'].'/?m=article',);
      }
      echo $Json->encode($re);
      exit;
   }
}
//删除文章
else if($act=='delete'){
   $aid = intval($_REQUEST['aid']);
   $ids = isset($_REQUEST['ids']) ? $_REQUEST['ids'] : array();
   $ids[] = $aid;
   
   $ids = implode(',', $ids);
   $p = $Db->query("select * from ".$Base->table('article')." where id in ($ids)");
   if(!empty($p)){
         //删除内容中的图片
         foreach($p as $k=>$v){
             $pics = Common::get_pics_from_html($v['content']);
			 chdir(ROOT_PATH);
			 foreach($pics as $v){
				@unlink(substr($v,1));
			 }
         }  
		 
         $res = $Db->execSql("DELETE FROM ".$Base->table('article')." WHERE id in ($ids)");

         if($res>0){
            $re['status'] = 1;
         }else{
            $re['msg']='删除失败!';
         }   
   }
   echo $Json->encode($re);
   exit;
}
//移动文章 
else if($act=='move'){
   $ids = $_REQUEST['ids'];
   $newcatid = intval($_REQUEST['newcatid']);
   $ids = implode(',', $ids);
   $p = $Db->query("select * from ".$Base->table('article')." where id in ($ids)");
      if(!empty($p)){
         //开始更改栏目
         $res=$Db->execSql('update '.$Base->table('article').' set cat_id='.$newcatid.' WHERE id in ('.$ids.')');
         if($res>0){
            $re['status'] = 1;
         }else{
            $re['msg']='删除失败!';
         }
      }
      echo $Json->encode($re);
      exit;
}
//列表
else{
   $cat_id = intval($_REQUEST['cat_id']);
   $page = intval($_REQUEST['page'])>0 ? intval($_REQUEST['page']): 1;
   $res = get_art_list($cat_id,$page);
   $tp->assign('res',$res);
   $tp->assign('cat_id',$cat_id);
   $tp->assign('cats',get_article_cats());
}
$tp->assign('act',$act);
$tp->assign('nav','文章列表');

function get_art_list($cat_id,$page){
   $pageNum = 20;
   $sql = "select p.*,ac.cat_name from ".$GLOBALS['Base']->table('article')." as p ".
          "left join ".$GLOBALS['Base']->table('article_cat')." as ac on ac.id=p.cat_id where 1 ";
   $param = "";
   if($cat_id>0){
      $sql .= "and p.cat_id=$cat_id ";
      $GLOBALS['tp']->assign('cat_id',$cat_id);
      $param .= "&cat_id=$cat_id";
   }
   $sql .= "order by p.sort asc,p.cat_id desc limit ".($page-1)*$pageNum.",$pageNum ";
   $res = $GLOBALS['Db']->query($sql);
   return $res;
}
?>