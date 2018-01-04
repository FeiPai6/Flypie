<?php
	define('IN_T',true);
	require("../source/include/init.php");

    $view_uuid = Common::sfilter($_REQUEST['view']);
    //查询imgagesmain
    $worksmain = $Db->query("SELECT w.pk_works_main,w.pk_user_main,w.cdn_host,p.hotspot,p.scene_group FROM ".$Base->table('worksmain')." w LEFT JOIN ".$Base->table('pano_config')." p ON w.pk_works_main = p.pk_works_main WHERE w.view_uuid = '$view_uuid'",'Row');
	if (empty($worksmain)) {
		die("未找到相关项目");
	}
	$scene_group = $Json->decode($worksmain['scene_group']);
	$groups = $scene_group['sceneGroups'];
	if (empty($groups)) {
		$scenes = $Db->query("SELECT i.view_uuid AS viewuuid , i.filename AS sceneTitle ,i.thumb_path AS imgPath FROM ".$Base->table('imgsmain')."i LEFT JOIN ".$Base->table('imgs_works')." iw ON i.pk_img_main = iw.pk_img_main WHERE iw.pk_works_main =".$worksmain['pk_works_main']);
		$groups[]['scenes'] = $scenes;
	}
	//查询图片  imagesmain   
	$scenesRes;
	if(count($groups)>1){
		foreach ($groups as  $g) {
			foreach ($g['scenes'] as $k => $s) {
				if ($k==0) 
					$s['album'] = $g['groupName'];
				$scenesRes[] = $s;
			}
		}
	}else{
		$scenesRes = $groups[0]['scenes'];
	}
	// print_r($scenesRes);die;
	// print_r($worksmain);die;
	require_once ROOT_PATH.'plugin/plugin_init_function.php';
	plugin_get_plugins("view",true);
	
	$cdn_host = empty($worksmain['cdn_host'])?$_lang['cdn_host']:$worksmain['cdn_host'];
	$tp->assign('cdn_host',$cdn_host);
	$tp->assign('prefix',$cdn_host.$worksmain['pk_user_main'].'/works');
	$tp->assign('scenesRes',$scenesRes);
	$tp->assign('hotspot',$Json->decode($worksmain['hotspot']));
	$tp->setTemplateDir(ROOT_PATH.'tour');
	$tp->display('tour.xml');
?>