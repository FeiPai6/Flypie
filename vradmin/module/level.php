<?php
//组与权限
//@author  #qq.com
//@date 10.9.2016
if(!defined('IN_T')){
   die('禁止访问！');
}

$act = Common::sfilter($_REQUEST['act']);

//组详情: 查看或编辑或增加
if($act=='detail'){
	//组id
	$level = intval($_REQUEST['level']);
	//传递了level，验证level是否存在，不存在强制赋值为0
	if($level>0){
		$level_desc = $Db->query("select * from ".$Base->table('user_level')." where id=$level","Row");
		if(!$level_desc){
			$level = 0;
		}
	}
	//前台查看
	if(empty($_POST)){
		require ROOT_PATH.'plugin/plugin_init_function.php';
		plugin_get_plugins("edit",true);
		if(!empty($level_desc)){
			$level_desc['privileges'] = explode(',',$level_desc['privileges']);
		}
		$tp->assign('level_desc',$level_desc);
	}
	//后台处理
	else{
		$data = array(
			'level_name' => Common::sfilter($_POST['level_name']),
			'privileges' => implode(',',$_POST['privileges']),
		);
		$res['status'] = 0;
		if(empty($data['level_name'])){
			$res['msg'] = '请填写组名称';
		}
		else if(empty($data['privileges'])){
			$res['msg'] = '请至少选择一个组权限';
		}
		else{
			if($level>0){
				$data['id'] = $level;
			}
			$Db->replace($Base->table('user_level'),$data);
			$res = array('status'=>1,'msg'=>'提交成功','href'=>'/'.ADMIN_PATH.'/?m=level');
		}
		echo $Json->encode($res);
		exit;
	}
	$tp->assign('act','detail');
}
else if($act=='delete'){
	//组id
	$level = intval($_REQUEST['level']);
	$res['status'] = 0;
	$level_users = $Db->query("select pk_user_main from ".$Base->table('user')." where level=$level","Row");
	if($level==1){
		$res['msg'] = 'ID为1的用户组为系统默认组，无法删除！';
	}
	else if($level_users){
		$res['msg'] = '该组下还有用户，无法删除！';
	}
	else{
		$Db->delete($Base->table('user_level'),array('id'=>$level));
		$res = array('status'=>1,'msg'=>'删除成功！');
	}
	echo $Json->encode($res);
	exit;
}
//组列表 
else{
	require ROOT_PATH.'plugin/plugin_init_function.php';
	$plugins = plugin_get_plugins("edit",true,true);
	$sql = "select * from ".$Base->table('user_level')." order by id asc";
	$list = $Db->query($sql,"All");
	foreach($list as $k=>$v){
		$privileges = explode(',',$v['privileges']);
		if(!empty($privileges[0])){
			foreach($privileges as $k2=>$v2){
				$list[$k]['privileges_name'][$k2] = $plugins[$v2]['plugin_name'];
			}
		}
	}
	$tp->assign('list',$list);
	$tp->assign('act','list');
}
$tp->assign('nav','组与权限');
?>