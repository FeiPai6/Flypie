<?php
//物体环视
if(!defined('IN_T')){
	die('禁止访问！');
}
$act =  Common::sfilter($_REQUEST['act']);
if ($act =='doAdd') {
	//设置该次请求超时时长，1800s
	@ini_set("max_execution_time", "1800"); 
	//兼容php-fpm设置超时
	@ini_set("request_terminate_timeout", "1800");
	
	$re['flag'] = 0;
	$params = $_REQUEST['params'];
	//过滤非法字符
	filter_array($params);
	$oname = $params['oname'];
	if (empty($oname)||mb_strlen($oname)>100) {
		$re['msg'] = '请填写1到100个字符的名称';
	}else if(empty($params)){
		$re['msg'] = '请先上传环物图片';
	}else{
		$imgs = $params['imgs'];
		foreach ($imgs as &$v) {
			$v['imgsrc'] = $_lang['cdn_host'].$v['imgsrc'];
			$key[] = $v['index'];
		}
		array_multisort($key,SORT_NUMERIC,SORT_ASC,$imgs);
		$data = array(
			'name'=>$params['oname'],
			'imgs'=>$Json->encode($imgs),
			'view_num'=>0,
			'pk_user_main'=>$user['pk_user_main'],
			'create_time'=>date("Y-m-d H:i:s",Common::gmtime()),
			'thumb_path'=>$imgs[0]['imgsrc'],
			'flag_publish'=>intval($params['flag_publish']),

		);
		$Db->insert($Base->table('object_around'),$data);
		$re['flag'] = 1;
	}
	echo $Json->encode($re);
	exit;
}

function filter_array(&$arr){
	foreach($arr as $k => &$v){
		if(is_array($v))
			filter_array($v);
		else{
			$k =Common::sfilter($k);
			$v =Common::sfilter($v);
		}
	}
}
?>