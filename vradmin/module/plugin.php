<?php
//插件管理
if(!defined('IN_T')){
   die('禁止访问！');
}

$pid = Common::sfilter($_REQUEST['pid']);

if(empty($pid)){	
	require ROOT_PATH.'plugin/plugin_init_function.php';
	$plugins = plugin_get_plugins($type='edit', $refresh=true, $return=true);
	//print_r($plugins);
	$tp->assign('plugins',$plugins);
}
else{
	//检查$pid是否存在
	if(!file_exists(ROOT_PATH."plugin/$pid/config.php")){
		Common::base_header("Location:".$_lang['host'].$_lang['admin_path']."/?m=plugin");
	}
	require ROOT_PATH."plugin/$pid/config.php";
	if(empty($_POST)){
		$tp->assign('plugin',$plugins[$pid]);
	}
	else{
		$brief = Common::sfilter($_POST['brief']);
		$enable = intval($_POST['enable'])==1 ? 1: 0;
		$default = intval($_POST['default'])==1 ? 1: 0;
		$plugins[$pid]['brief'] = $brief;
		$plugins[$pid]['default'] = $default;
		$plugins[$pid]['enable'] = $enable;
		$re['status'] = 0;
		if(!is_writable(ROOT_PATH."plugin/$pid/config.php")){
			$re['msg'] = "插件 $pid 的配置文件不可写！";
		}
		else{
			$cont = var_export($plugins[$pid],true);
			$cont ="<?php\n\$plugins['$pid'] = $cont \n?>";
			if(file_put_contents(ROOT_PATH."plugin/$pid/config.php",$cont)){
				$re = array('status'=>1,'msg'=>'编辑成功','href'=>'/'.$_lang['admin_path'].'/?m=plugin');
			}else{
				$re['msg'] = '写入配置失败！';
			}
		}
		echo $Json->encode($re);;
		exit;
	}
}
$tp->assign('pid',$pid);
$tp->assign('nav','插件管理');
?>