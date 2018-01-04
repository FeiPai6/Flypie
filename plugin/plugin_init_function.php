<?php
/*
 *  插件主入口程序
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: bind.php 28028 2016-06-19Z  $
*/
if(!defined('IN_T')){
	die('禁止访问！');
}

//获取插件目录下的所有配置  
//@param $type: 编辑页 edit, 显示页 view
//@param $refresh: 强制刷新session，重新读取数据
//@param $return: 是否返回，为ture则返回而不输出
function plugin_get_plugins($type, $refresh=false, $return=false){
	//session保存了模块权限，且不刷新
	if($_SESSION[$type] && !$refresh){
		$plugins = $_SESSION[$type];
	}
	else{
		$plugins = array();
		//遍历plugin目录
		$dir = dirname(__FILE__).'/';
		if ($dh = opendir($dir)){
				while(($file = readdir($dh)) !== false)
				{
					if((is_dir($dir.$file)) && $file!="." && $file!="..")
					{	
						//存在功能模块，则加载该模块的配置文件
						if (file_exists($dir.$file.'/config.php')) {
							require_once($dir.$file.'/config.php');
						}
					}
				}
				closedir($dh);
		}
		if(!empty($plugins)){
			//管理员后台不会进行此操作，level_enable总是为0，忽略该值
			if($type=='edit' && $GLOBALS['user']['level']>0){
				$sql = "select privileges from ".$GLOBALS['Base']->table('user_level')." where id=".$GLOBALS['user']['level']."";
				$level = $GLOBALS['Db']->query($sql,"One");
				$level = explode(',',$level);		
			}

			foreach ($plugins as $k => $v) {			
				if(in_array($k,$level)){
					$plugins[$k]['level_enable'] = 1;	//该用户组可用
				}
				else{
					$plugins[$k]['level_enable'] = 0;	//该用户组不可用
				}
				
				$key1[] = $plugins[$k]['level_enable'];
				$key2[] = $v[$type.'_sort'];
			}
			//对模块进行前台排序
			array_multisort($key1,SORT_NUMERIC,SORT_DESC,$key2,SORT_NUMERIC,SORT_ASC,$plugins);
		}
	}
	//print_r($plugins);
	//直接返回，不赋值session
	if($return){
		return $plugins;
	}
	//输出前台
	else{
		//赋值到session
		$_SESSION[$type] = $plugins;
		$GLOBALS['tp']->assign('plugins',$plugins);
	}
}
?>