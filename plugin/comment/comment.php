<?php 
	/*
	 *  评论插件
	 * ============================================================================
	 * 技术支持：2015-2099 
	 * 
	 * ----------------------------------------------------------------------------
	 * $Author:  #qq.com $
	 * $Id: bind.php 28028 2016-06-19Z  $
	*/
	define('IN_T',true);
	require_once "../../source/include/init.php";
	$act = Common::sfilter($_REQUEST['act']);

	//获取评论列表
	if($act =="list_comment"){
		$pid = intval($_REQUEST['pid']);
		$sname = Common::sfilter($_REQUEST['sname']);
		$comments= array();
		if ($pid<=0||empty($sname)) {
			echo $comments;
			exit;
		}
		$comments = $Db->query("SELECT * FROM ".$Base->table('comment')." WHERE pk_works_main = $pid AND sname = '$sname'");
		// echo $Json->encode($comments,JSON_NUMERIC_CHECK);
		echo $Json->encode($comments);
		exit;
	}
	//添加评论
	else if($act == "add_comment"){
		$re = 0;
	    $data = array(
		  'pk_works_main' => isset($_POST['pid']) ? intval($_POST['pid']): 0,
		  'sname'   => isset($_POST['sname']) ? Common::sfilter($_POST['sname']): '' ,
		  'content' => isset($_POST['content'])?Common::sfilter($_POST['content']):'',
		  'ath' => isset($_POST['ath'])?Common::sfilter($_POST['ath']):0,
		  'atv' => isset($_POST['atv'])?Common::sfilter($_POST['atv']):0,
		  'add_time'=>date('Y-m-d H:i:s',Common::gmtime()),
	    'nickname'=>$_COOKIE['wx']['nickname'],
	    'sex'=>$_COOKIE['wx']['sex']==0?'未知':($_COOKIE['wx']['sex']==1?'男':'女'),
	    'province'=>$_COOKIE['wx']['province'],
	    'city'=>$_COOKIE['wx']['city']
		);
	    if($data['pk_works_main']<1||$data['sname']==""||$data['content']==""||strlen($data['content'])>200){
	        //todo
	    }
		else{
	         $data['head_img'] =$_COOKIE['wx']['head_img'];
		    if($id = $Db->insert($Base->table('comment'),$data)){
			    $re = 1;
		    }
	    }
	    echo $re;
	    exit;

	}





?>