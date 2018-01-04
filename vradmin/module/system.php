<?php
//系统设置
//@author  
//@date 10.14.2016
if(!defined('IN_T')){
   die('禁止访问！');
}
$act = Common::sfilter($_REQUEST['act']);

//上传站点logo
if($act=='site_logo'){
	$data['error'] = 1;
	if(isset($_FILES)){
		$cwd = getcwd();
		chdir(ROOT_PATH);
		if(!is_writable('static/images/logo.png')){
			$data['message'] = '文件不可写，替换失败！';
		}
		else{
			if(move_uploaded_file($_FILES['imgFile']['tmp_name'],'static/images/logo.png')){
				$data = array('error'=>0);
			}
		}
		chdir($cwd);
	}
	echo $Json->encode($data);
	exit;
}
//上传左上默认logo
else if($act=='custom_logo'){
	$data['error'] = 1;
	if(isset($_FILES)){
		$cwd = getcwd();
		chdir(ROOT_PATH);
		if(!is_writable('plugin/custom_logo/images/custom_logo.png')){
			$data['message'] = '文件不可写，替换失败！';
		}
		else{
			if(move_uploaded_file($_FILES['imgFile']['tmp_name'],'plugin/custom_logo/images/custom_logo.png')){
				$data = array('error'=>0);
			}
		}
		chdir($cwd);
	}
	echo $Json->encode($data);
	exit;
}
//上传补天补地默认图标
else if($act=='shade_sky_floor'){
	$data['error'] = 1;
	if(isset($_FILES)){
		$cwd = getcwd();
		chdir(ROOT_PATH);
		if(!is_writable('plugin/shade_sky_floor/images/shade_sky_floor.png')){
			$data['message'] = '文件不可写，替换失败！';
		}
		else{
			if(move_uploaded_file($_FILES['imgFile']['tmp_name'],'plugin/shade_sky_floor/images/shade_sky_floor.png')){
				$data = array('error'=>0);
			}
		}
		chdir($cwd);
	}
	echo $Json->encode($data);
	exit;
}
//常规设置
else if($act=='main'){
	$sql = "replace into ".$Base->table('site_config')." (`parent_id`,`name`,`value`) values ";
	foreach($_POST as $k=>$v){
		$vals[] = "('','".Common::sfilter($k)."','".Common::sfilter($v)."')";
	}
	$vals = implode(',',$vals);
	$sql .= $vals;
	$Db->execSql($sql);
	$res = array('status'=>1,'msg'=>'设置成功');
	echo $Json->encode($res);
	exit;
}
//存储设置 
else if($act=='cdn'){
	//print_r($_POST); exit;
	$global_storage = Common::sfilter($_POST['global_storage']);
	$re['status'] = 0;
	if(empty($global_storage)){
		$re['msg'] = '请选择一个存储类型';
	}
	else{
		$sql = "replace into ".$Base->table('site_config')." (`parent_id`,`name`,`value`) values ('','global_storage','$global_storage')";
		$global_storage_type = array_keys($_lang['global_storage_type']);	
		foreach($global_storage_type as $v){
			$state = $global_storage==$v ? 'enable' : 'disable';
			$sql .= ",('','$v','$state')";
		}
		//echo $sql; exit;
		$Db->execSql($sql);

		$sql = "replace into ".$Base->table('site_config')." (`parent_id`,`name`,`value`) values ";
		foreach($global_storage_type as $v){
			foreach($_POST[$v] as $k2=>$v2){
				$sql_tmp[] = "('$v','".Common::sfilter($k2)."','".Common::sfilter($v2)."')";
			}
		}		
		$sql .= implode(',',$sql_tmp); 
		//echo $sql; exit;
		$Db->execSql($sql);
		$re = array('status'=>1,'msg'=>'设置成功');
	}
	echo $Json->encode($re);
	exit;
}
//短信设置
else if($act=='sms'){
	//print_r($_POST);
	$global_sms = Common::sfilter($_POST['global_sms']);
	$re['status'] = 0;
	if(empty($global_sms)){
		$re['msg'] = '请选择一个短信接口';
	}
	else{
		$sql = "replace into ".$Base->table('site_config')." (`parent_id`,`name`,`value`) values ('','global_sms','$global_sms')";
		$global_sms_type = array_keys($_lang['global_sms_type']);	
		foreach($global_sms_type as $v){
			$state = $global_sms==$v ? 'enable' : 'disable';
			$sql .= ",('','$v','$state')";
		}
		//echo $sql; exit;
		$Db->execSql($sql);

		$sql = "replace into ".$Base->table('site_config')." (`parent_id`,`name`,`value`) values ";
		foreach($global_sms_type as $v){
			foreach($_POST[$v] as $k2=>$v2){
				$sql_tmp[] = "('$v','".Common::sfilter($k2)."','".Common::sfilter($v2)."')";
			}
		}		
		$sql .= implode(',',$sql_tmp); 
		//echo $sql; exit;
		$Db->execSql($sql);
		$re = array('status'=>1,'msg'=>'设置成功');
	}
	echo $Json->encode($re);
	exit;
}
//微信设置
else if($act=='wx'){
	//print_r($_POST);
	$global_wx_type = array_keys($_lang['global_wx_type']);	
	
	$sql = "replace into ".$Base->table('site_config')." (`parent_id`,`name`,`value`) values ";
	foreach($global_wx_type as $v){
		$state = in_array($v,$_POST['global_wx']) ? 'enable' : 'disable';
		$sql_tmp[] = "('','$v','$state')";
	}
	$sql .= implode(',',$sql_tmp);
	//echo $sql; exit;
	$Db->execSql($sql);
	
		
	$sql = "replace into ".$Base->table('site_config')." (`parent_id`,`name`,`value`) values ";
	foreach($global_wx_type as $v){
		foreach($_POST[$v] as $k2=>$v2){
			$sql_tmp2[] = "('$v','".Common::sfilter($k2)."','".Common::sfilter($v2)."')";
		}
	}
	$sql .= implode(',',$sql_tmp2); 
	//echo $sql; exit;
	$Db->execSql($sql);
	$re = array('status'=>1,'msg'=>'设置成功');
	echo $Json->encode($re);
	exit;
}
$tp->assign('nav','系统设置');
?>