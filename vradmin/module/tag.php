<?php
//会员管理
if(!defined('IN_T')){
   die('禁止访问！');
}
$act = Common::sfilter($_REQUEST['act']);
if($act=='profile'){
	$tid = intval($_REQUEST['tid']);
	if ($tid>0) {
		$tp->assign("row",$Db->query("SELECT * FROM ".$Base->table('tag')." WHERE id = $tid","Row"));
	}
}
else if($act == 'doedit'){
	$re['status']=0;
	$name = Common::sfilter($_REQUEST['name']);
	$sort = intval($_REQUEST['sort']);
	if (empty($name)||mb_strlen($name)>10) {
		$re['msg'] = "请输入1到10个字符长度";
	}else{
		$params['name'] = $name;
		$params['sort'] = $sort;
		$tid = intval($_REQUEST['tid']);
		if ($tid>0) {
			$Db->update($Base->table('tag'),$params,array('id'=>$tid));
			$re['msg'] = '编辑成功';
		}else{
			$params['type'] = intval($_REQUEST['type']);
			$Db->insert($Base->table('tag'),$params);
			$re['msg'] = '添加成功';
		}
		$re['status'] = 1;
		$re['href'] ='/'.ADMIN_PATH.'/?m=tag';
	}
	echo $Json->encode($re);
	exit;
}
else if($act == 'delete'){
	$re['status']=0;
	$tid = intval($_REQUEST['tid']);
	$tag = $Db->query('SELECT * FROM '.$Base->table('tag')." WHERE id =  $tid","Row");
	if (empty($tag)) {
		$re['msg'] = '查询不到相应的标签';
	}
	$count = 0 ;
	if ($tag['type'] == 1) {
		$count = $Db->getCount($Base->table('tag_works'),'id',array('tag_id'=>$tid));
	}else{
		$count = $Db->getCount($Base->table('tag_video'),'id',array('tag_id'=>$tid));
	}
	if($count>0){
		$re['msg'] = '标签已经被使用，不能删除';
	}else{
		$Db->delete($Base->table('tag'),array('id'=>$tid));
		$re['status'] = 1;
	}

	echo $Json->encode($re);
	exit;	
}
else{
    $size = 20;
	$page = intval($_REQUEST['page']);
	$type =  intval($_REQUEST['type']);
	$page = $page<1 ? 1 : $page;
	$res = get_tag_list($type,$page,$size);
	$pages = Common::set_page($size,$page,$res['count']);
	foreach ($pages as $key => $value) {
		 $pages[$key]['url'] = "/".ADMIN_PATH."/?m=tag&page=".$value['num'].$res['spm'];
	}
	$tp->assign("page",$page);
	$tp->assign("size",$size);
	$tp->assign("pages",$pages);
	$tp->assign('res',$res);
}
$tp->assign('nav','标签管理');
$tp->assign('act',$act);
function get_tag_list($type,$page=1,$pageCount=20){
   $sql = "from ".$GLOBALS['Base']->table('tag')." where 1 ";
   $spm = '';
   if($type>0){
      $sql .= "and type=$type ";
	  $spm .= "&type=$type";
	  $GLOBALS['tp']->assign('type',$type);
   }
  
   $rescount = $GLOBALS['Db']->query("SELECT COUNT(*) AS num " .$sql,"One");
   $sql = "select * ".$sql." order by type asc, sort asc limit ".($page-1)*$pageCount.", $pageCount";
   $res = $GLOBALS['Db']->query($sql);
   return array('spm'=>$spm,'count'=>$rescount,'res'=>$res);
}
?>