<?php
/**
 * 公用行为类
 * @author  10.18.2014
*/
class Transaction extends Common{
	
	//退出登录
	public static function logout(){
	    unset($_SESSION['user']);
		unset($_SESSION['sms']);
		unset($_SESSION['captcha']);
		unset($_SESSION['reg']);
		unset($_SESSION['edit']);
		unset($_SESSION['view']);
		//如果记住密码，销毁cookie
		setcookie("remember[id]",0,parent::gmtime()-1,'/');
		setcookie("remember[hashcode]",'',parent::gmtime()-1,'/');
	}
    
	public static function  decode_str2arr($arr){
		foreach ($arr as $key => $value) {
				$value = str_replace(array("\r\n", "\r", "\n"), "", $value);
					$value_tmp = $GLOBALS['Json']->decode($value);
					if(is_array($value_tmp)){
						$arr[$key] = $value_tmp;
					}
				}
		return $arr;
	}
	
	//提取project
	public static function get_project($uid){
		$user['pk_user_main'] = 2;
	    $pid = intval($_REQUEST['pid']);
	    //查询imgagesmain
	    $worksmain = $GLOBALS['Db']->query("SELECT * FROM ".$GLOBALS['Base']->table('worksmain')." WHERE pk_works_main = ".$pid." AND pk_user_main = ".$user['pk_user_main'],'Row');

		if (empty($worksmain)) {
			die("未找到相关项目");
		}
		//查询图片  imagesmain
		$imgsmain = $GLOBALS['Db']->query("SELECT * FROM ".$GLOBALS['Base']->table('imgsmain')." WHERE pk_works_main =".$pid);
		$GLOBALS['tp']->assign('imgsmain',$imgsmain);
	}
	
	//提取站点配置信息
	//七牛、oss、短信、微信等配置
	//@return null
	public static function get_site_config(){
		//提取父项
		$sql = "select * from ".$GLOBALS['Base']->table('site_config')." where parent_id=''";
		$conf = $GLOBALS['Db']->query($sql);
		//提取子项
		$sql = "select * from ".$GLOBALS['Base']->table('site_config')." where parent_id!='' ";
		$conf_child = $GLOBALS['Db']->query($sql);
		foreach($conf as $k=>$v){
			//值为enable或disable，则有子项
			if($v['value']=='enable' || $v['value']=='disable'){
				$GLOBALS['_lang'][$v['name']."_config"]['enable'] = $v['value'];
				foreach($conf_child as $v2){
					if($v2['parent_id']==$v['name']){
						$GLOBALS['_lang'][$v['name']."_config"][$v2['name']] = $v2['value']; 
					}
				}
				//组装qiniu参数
				if($v['name']=='qiniu'){
					$GLOBALS['_lang']['qiniu_config']['up_url'] = $GLOBALS['_lang']['qiniu_zone'][$GLOBALS['_lang']['qiniu_config']['zone']]['up_url'];
				}
				//组装oss参数
				if($v['name']=='oss'){
					$GLOBALS['_lang']['oss_config']['external_url'] = $GLOBALS['_lang']['oss_zone'][$GLOBALS['_lang']['oss_config']['zone']]['external_url'];
					$GLOBALS['_lang']['oss_config']['internal_url'] = $GLOBALS['_lang']['oss_zone'][$GLOBALS['_lang']['oss_config']['zone']]['internal_url'];
					$GLOBALS['_lang']['oss_config']['location'] = $GLOBALS['_lang']['oss_zone'][$GLOBALS['_lang']['oss_config']['zone']]['location'];
				    //如果不使用内网，内网赋值为外网
					if($GLOBALS['_lang']['oss_config']['internal']==0){
						$GLOBALS['_lang']['oss_config']['internal_url'] = $GLOBALS['_lang']['oss_zone'][$GLOBALS['_lang']['oss_config']['zone']]['external_url'];
					}
				}
			}
			//没有子项，直接赋值
			else{
				$GLOBALS['_lang'][$v['name']] = $v['value'];
			}
		}
		//给模板赋初始值
		if(empty($GLOBALS['_lang']['moban'])){
			$GLOBALS['_lang']['moban'] = 'default';
		}
		$GLOBALS['_lang']['cdn_host'] = 'http://'.$GLOBALS['_lang'][$GLOBALS['_lang']['global_storage'].'_config']['cdn_host'].'/';

		switch ($GLOBALS['_lang']['global_storage']) {
			case 'qiniu':
				$GLOBALS['_lang']['up_url'] = 'http://'.$GLOBALS['_lang']['qiniu_config']['up_url'];
				break;
			case 'oss':
				$GLOBALS['_lang']['up_url'] = 'http://'.$GLOBALS['_lang']['oss_config']['bucket'].'.'.$GLOBALS['_lang']['oss_config']['external_url'];
				break;
			case 'local':
				# code...
				break;
		}
	    // print_r($GLOBALS['_lang']);  exit;
	}
	
	//获取用户还可上传的项目数量
	public static function get_user_projects_limit($uid){
		//用户可上传的项目数量
		$sql = "select limit_num from ".$GLOBALS['Base']->table('user')." where pk_user_main=$uid ";
		$limit_num = $GLOBALS['Db']->query($sql,"One");
		//无限制，总是返回1
		if($limit_num==0){
			return 1;
		}
		//用户已上传的项目数量
		$sql = "select count(*) from ".$GLOBALS['Base']->table('worksmain')." where pk_user_main=$uid ";
		$uploaded_num = $GLOBALS['Db']->query($sql,"One");
		return $limit_num - $uploaded_num;
	}
	
	//获取导链接内容
	public static function get_nav_links(){
		$sql = "select id,title,is_nav from ".$GLOBALS['Base']->table('article')." where is_nav!='' order by sort asc,id desc";
		$res = $GLOBALS['Db']->query($sql);
		foreach($res as $k=>$v){
			$navs[$v['is_nav']][] = $v;
		}
		return $navs;
	}

}
?>