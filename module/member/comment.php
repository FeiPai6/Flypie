<?php

if(!defined('IN_T')){
	die('禁止访问！');
}
$act =  Common::sfilter($_REQUEST['act']);
if($act=='list'){
	$currentPage =  intval($_REQUEST['currentPage']);
	$currentPage<0?1:$currentPage;
	$pageSize =  intval($_REQUEST['pageSize']);
	$pageSize==0?10:$pageSize;
	$pid =  intval($_REQUEST['pid']);
	if($pid<=0){
		exit;
	}
	$content =  Common::sfilter($_REQUEST['content']);
	echo  $Json->encode(_comment($pid,$user['pk_user_main'],$currentPage,$pageSize,$content),JSON_NUMERIC_CHECK);
	exit;
}
else if($act == "delete"){
	$params = $Json->decode(stripslashes($_REQUEST['params']));
	$re['flag'] = 0;
	$Db->beginTransaction();
	try{
		foreach($params as $p){
			if($Db->query("SELECT (c.id) AS num FROM ".$Base->table('comment')." c LEFT JOIN ".$Base->table('worksmain')." w ON c.pk_works_main = w.pk_works_main WHERE w.pk_user_main = ".$user['pk_user_main']." AND c.id = ".$p,"One")>0)
			$Db->delete($Base->table('comment'),array("id"=>$p));
		}
		$Db->commit();
		$re['flag'] = 1;
	}catch(Exception $e){
		$Db->rollback();
		$re['msg'] = "删除失败";
	}
	echo $Json->encode($re,JSON_NUMERIC_CHECK);
	exit;
}
else{
	die('禁止访问！');
}

//查询用户评论
function _comment($pid,$_user,$currentPage,$pageSize,$content=''){
	global $Db;
	global $Base;
	global $Json;
	 //查询评论数量
	if($Db->getCount($Base->table('worksmain'),'pk_works_main',array('pk_works_main'=>$pid,'pk_user_main'=>$_user))<=0){
		return array();
	}
	$sql="SELECT * FROM ".$Base->table('comment'). 'WHERE '. "pk_works_main".'='.$pid;
	$sql1="SELECT count(*) FROM ".$Base->table('comment'). 'WHERE '. "pk_works_main".'='.$pid;
	if(!empty($content)){//判断是否输入留言内容查询
		$_likesql=' and '. "content".' LIKE '.'"%'.$content.'%"';
		$sql.=$_likesql;
		$sql1.=$_likesql;
	}
	//查询当前页数据
	$sql.=" ORDER BY id DESC LIMIT ".($currentPage-1)*$pageSize.",".$pageSize;
	$_count=$Db->query($sql1,'One');
  	$result =$Db->query($sql,'All');
	$pageCount=ceil($_count/$pageSize);//总页数
	return array(
		'pageCount'=>$pageCount,
		'currentPage'=>$currentPage,
		'pageSize'=>$pageSize,
		'total'=>$_count,
		'list'=>$result
	);
		 
		
}

 
