<?php

if(!defined('IN_T')){
	die('禁止访问！');
}
$act =  Common::sfilter($_REQUEST['act']);
$input=null;
if (empty($act)) {
	$input = $Json->decode(file_get_contents("php://input"));
	if (!empty($input)) {
		$act = $input['act'];
	}
}
if($act =="update_init"){
	//查询项目  worksmain
	$pid =intval($input['pid']);
	$worksmain = $Db->query("SELECT * FROM ".$Base->table('worksmain')." WHERE pk_works_main = ".$pid." AND pk_user_main = ".$user['pk_user_main'],'Row');

	if (empty($worksmain)) {
		die("未找到相关项目");
	}
	//查询图片  imagesmain
	$imgsmain = $Db->query("SELECT i.* FROM ".$Base->table('imgsmain')."i LEFT JOIN ".$Base->table('imgs_works')." iw ON i.pk_img_main = iw.pk_img_main WHERE iw.pk_works_main =".$pid);
	
	//查询配置  panoconfig
	$panoconfig = $Db->query("SELECT * FROM ".$Base->table('pano_config')." WHERE pk_works_main = ".$pid,"Row");

	// if (!empty($panoconfig['hotspot']['imgtext'])) {
	// 	$panoconfig['hotspot']['imgtext'] = base64_decode($panoconfig['hotspot']['imgtext'])
	// }

	$panoconfig = Transaction::decode_str2arr($panoconfig);
	$hotspots = &$panoconfig['hotspot'];
	foreach ($hotspots as &$v) {
		$imgtext = &$v['imgtext'];
		if (!empty($imgtext)) {
			foreach ($imgtext as  &$v2) {
				if ($v2['imgtext_wordContent']) {
					$v2['imgtext_wordContent'] = base64_decode($v2['imgtext_wordContent']);
				}else if ($v2['wordContent']){
					$v2['imgtext_wordContent'] = base64_decode($v2['wordContent']);
					unset($v2['wordContent']);
				}
			}
		}
	}
	//查询对应分类
	$atlasmain = $Db->query("SELECT name FROM ".$Base->table('atlasmain')." WHERE pk_atlas_main = ".$worksmain['pk_atlas_main'],'Row');
	$worksmain['name'] = $worksmain['name']." ";
	//查询项目对应标签
	$tags = $Db->query("SELECT * FROM ".$Base->table('tag_works')." WHERE works_id = $pid");
	$tag_list = $Db->query("SELECT * FROM ".$Base->table('tag')." WHERE type = 1");
	$result = array('worksmain' => $worksmain,'imgsmain'=>$imgsmain,'panoConfig'=>$panoconfig,'userInfo'=>$user,"atlasmain"=>$atlasmain,"tags"=>$tags,"tag_list"=>$tag_list);
	echo  $Json->encode($result);
	exit;
}else if($act == "save_panosetting"){
	$result['flag'] =0;
	// $hotspots = &$input['hotspot'];
	//对图文进行base64
	// foreach ($hotspots as &$v) {
	// 		$imgtext = &$v['imgtext'];
	// 		if (!empty($imgtext)) {
	// 			foreach ($imgtext as &$v2) {
	// 				$v2['wordContent'] = base64_encode($v2['wordContent']);
	// 			}
	// 		}
	// }
	filter_array($input);
	$pk_works_main = intval($input['pk_works_main']);
	if ($Db->getCount($Base->table('worksmain'),"pk_works_main",array("pk_works_main"=>$pk_works_main ,"pk_user_main"=>$user['pk_user_main']))<=0) {
		$result['msg'] ="非法操作";
	}else{
		$params = array(
			'angle_of_view' =>$Json->encode($input['angle_of_view']),
			'special_effects'=>$Json->encode($input['special_effects']),
			'hotspot'=>$Json->encode_unescaped_unicode($input['hotspot']),
			'sand_table'=>$Json->encode_unescaped_unicode($input['sand_table']),
			'tour_guide'=>$Json->encode($input['tour_guide']),
			'scene_group'=>$Json->encode_unescaped_unicode($input['scene_group']),
			 );
		$Db->update($Base->table('pano_config'),$params,array("pk_works_main"=>$pk_works_main));
		$result['flag'] = 1;
	}
	echo $Json->encode($result,JSON_NUMERIC_CHECK);
	exit;
}else if($act == 'update_works'){
	$result['flag'] =0;
	$works = $input['works'];
	$panoconfig = $input['panoConfig'];
	$tags = $works['tags'];
	$imgs = $input['imgs'];
	$name = Common::sfilter($works['name']);
	if (empty($works)||empty($panoconfig)) {
		//没传项目数据直接返回
		$result['msg'] = '未接受到数据';
	}else if(empty($name)||mb_strlen($name)>30){
		$result['msg'] = "请输入1到30个字符的项目名称";
	}else if(empty($tags)){
		//没有选择标签
		$result['msg'] ="请选择分类标签";
	}else if(empty($imgs)){
		//没有图片
		$result['msg'] ="不能删除所有图片";
	}else if ($Db->getCount($Base->table('worksmain'),"pk_works_main",array("pk_works_main"=>$works['pk_works_main'],"pk_user_main"=>$user['pk_user_main']))<=0){
		//用户id和项目不对应
		$result['msg'] = '非法操作';
	}else{
		//是否设置项目密码
		$privacy_password = Common::sfilter($works['privacy_password']);
		if (!empty($privacy_password)&&(mb_strlen($privacy_password)<3||mb_strlen($privacy_password)>20||!preg_match('/^[A-Za-z0-9]+$/',$privacy_password))) {
			$result['msg'] = '请输入3到20位英文或数字密码';
			echo  $Json->encode($result,JSON_NUMERIC_CHECK);
			exit;
		}
	 	filter_array($works);
		filter_array($imgs);
		filter_array($panoconfig);
		$Db->beginTransaction();
		try{
			//修改worksmain的标签
			//删除原来的标签
			$Db->delete($Base->table("tag_works"),array("works_id"=>$works['pk_works_main']));
			//插入标签
			foreach ($tags as  $tid) {
				if ($Db->getCount($Base->table("tag"),"id",array("id"=>$tid))) {
					$Db->insert($Base->table("tag_works"),array("tag_id"=>$tid,"works_id"=>$works['pk_works_main']));
				}
			}
			//查询数据库原来的图片
			$imgsmain = $Db->query("SELECT i.*,iw.pk_works_main FROM ".$Base->table('imgsmain')."i LEFT JOIN ".$Base->table('imgs_works')." iw ON i.pk_img_main = iw.pk_img_main WHERE iw.pk_works_main =".$works['pk_works_main']);
			//删除图片
			foreach ($imgsmain as $d_v) {
				$flag = true;
				foreach ($imgs as $n_v) {
					if ($d_v['pk_img_main']==$n_v['pk_img_main']) {
						$flag = false;
						break;
					}
				}
				if ($flag) {
					//找到要删除的文件
					$Db ->delete($Base->table('imgs_works'),array('pk_works_main'=>$d_v['pk_works_main'],'pk_img_main'=>$d_v['pk_img_main']));
				}

			}
			//添加图片
			foreach ($imgs as $n_v){
				$flag = true;			
				foreach ($imgsmain as $d_v) {
					if ($d_v['pk_img_main']==$n_v['pk_img_main']) {
						$flag = false;
						break;
					}
				}
				if ($flag) {
					//添加图片
					$Db->insert($Base->table('imgs_works'),array('pk_img_main' =>$n_v['pk_img_main'] ,'pk_works_main'=>$n_v['pk_works_main'] ));
				}
			}

			
			//修改worksmain
			$worksmain_params = array(
					'name' => $name,
					'profile' => Common::sfilter($works['profile']),
					'flag_publish' => intval($works['flag_publish']),
					'privacy_password' => empty($privacy_password)?"":$privacy_password,
					'hideuser_flag' => intval($works['hideuser_flag']),
					'hidelogo_flag' => intval($works['hidelogo_flag']),
					'hideviewnum_flag'=>intval($works['hideviewnum_flag']),
					'flag_allowed_recomm'=>intval($works['flag_allowed_recomm']),
					'hidevrglasses_flag'=>intval($works['hidevrglasses_flag']),
					'hideprofile_flag'=>intval($works['hideprofile_flag']),
					'hidepraise_flag'=>intval($works['hidepraise_flag']),
					'hideshare_flag'=>intval($works['hideshare_flag'])
				);
			$Db->update($Base->table('worksmain'),$worksmain_params,array('pk_works_main'=>$works['pk_works_main']));
			$panoconfig_params = array(
					'footmark' => empty($panoconfig['footmark'])?0:intval($panoconfig['footmark']),
					'littleplanet'=>empty($panoconfig['littleplanet'])?0:intval($panoconfig['littleplanet']),
					'gyro' => empty($panoconfig['gyro'])?0:intval($panoconfig['gyro']),
					'comment' => empty($panoconfig['comment'])?0:intval($panoconfig['comment']),
					'scenechoose' => empty($panoconfig['scenechoose'])?0:intval($panoconfig['scenechoose']),
					'autorotate' => empty($panoconfig['autorotate'])?0:intval($panoconfig['autorotate']),
					'open_alert' => $Json->encode_unescaped_unicode($panoconfig['open_alert']),
					'sky_land_shade' => $Json->encode_unescaped_unicode($panoconfig['sky_land_shade']),
					'url_phone_nvg' => $Json->encode_unescaped_unicode($panoconfig['url_phone_nvg']),
					'bg_music' => $Json->encode_unescaped_unicode($panoconfig['bg_music']),
					'speech_explain' => $Json->encode_unescaped_unicode($panoconfig['speech_explain']),
					'custom_logo' => $Json->encode_unescaped_unicode($panoconfig['custom_logo']),
					'scene_group' => $Json->encode_unescaped_unicode($panoconfig['scene_group']),
					'custom_right_button' => $Json->encode_unescaped_unicode($panoconfig['custom_right_button']),
				);
			$Db->update($Base->table('pano_config'),$panoconfig_params,
				array('pk_works_main'=>$works['pk_works_main']));
		$Db->commit();
		$result['flag'] = 1;
		}catch(Exception $e){
			$Db->rollback();
			$result['msg'] = '操作失败！';
		}
	}
	echo  $Json->encode($result,JSON_NUMERIC_CHECK);
	exit;
}else if($act == "renameImg"){
	//重命名图片
	$pk_img_main = intval($input['pk_img_main']);	
	$filename = Common::sfilter($input['filename']);
	$resutl['flag'] = 0;
	if (empty($filename)||mb_strlen($filename,'utf-8')>30) {
		$result['msg'] = "文件名必须在1到30个字符之间";
	}else if($Db->getCount($Base->table('imgsmain'),'pk_img_main',
		array('pk_img_main'=>$pk_img_main,'pk_user_main'=>$user['pk_user_main']))<=0){
		$result['msg'] = "非法操作";
	}else{
		$Db->update($Base->table('imgsmain'),array('filename'=>$filename),array('pk_img_main'=>$pk_img_main) );
		$result['flag'] = 1;
	}
	echo  $Json->encode($result,JSON_NUMERIC_CHECK);
	exit;
}else if($act =="replaceWorkCover"){
	//修改封面
	$pk_works_main = intval($input['pk_works_main']);	
	$thumbpath = Common::sfilter($input['thumb_path']);
	$result['flag'] = 0;
	if (empty($thumbpath)) {
		$result['msg'] = "没有图片";
	}else if ($Db->getCount($Base->table('worksmain'),"pk_works_main",array("pk_works_main"=>$pk_works_main,"pk_user_main"=>$user['pk_user_main']))<=0){
		//用户id和项目不对应
		$result['msg'] = '非法操作';
	}else{
		$Db->update($Base->table("worksmain"),array('thumb_path'=>$_lang['cdn_host'].$thumbpath),array('pk_works_main'=>$pk_works_main));
		$result['absolutelocation'] = $_lang['cdn_host'].$thumbpath;
		$result['flag'] = 1;
	}
	echo  $Json->encode($result,JSON_NUMERIC_CHECK);
	exit;
}
//设置项目访问密码
else if($act == 'setPrivacyWord'){
	$privacyWord =  Common::sfilter($_REQUEST['privacyWord']);
	$pid = intval($_REQUEST['pid']);
	$re['status'] = 0 ;
	if (empty($privacyWord)||mb_strlen($privacyWord)<3||mb_strlen($privacyWord)>20||!preg_match('/^[A-Za-z0-9]+$/',$privacyWord)) {
		$re['msg'] = '请输入3到20位英文或数字密码';
	}else{
		$Db->update($Base->table('worksmain'),array('privacy_password'=>$privacy_password),array('pk_works_main'=>$pid,'pk_user_main'=>$user['pk_user_main']));
		$re['status']= 1;
	}
	echo $Json->encode($re);

}
else{

	//跳转编辑项目页面
	$pid = intval($_REQUEST['pid']);
	if ($pid<=0||$Db->getCount($Base->table('worksmain'),"pk_works_main",array("pk_works_main"=>$pid ,"pk_user_main"=>$user['pk_user_main']))<=0) {
		die("查询不到该项目");
	}
	//获取plugin
	require_once ROOT_PATH.'plugin/plugin_init_function.php';
	plugin_get_plugins("edit");
	//获取上传地址
	$tp->assign('up_url',$_lang['up_url']);
}

function filter_array(&$arr){
	foreach($arr as $k => &$v){
		if(is_array($v)){
			filter_array($v);
		}else{
			if ($k=='imgtext_wordContent') {
				$v=base64_encode($v);
			}else{
				$v=Common::sfilter($v);
			}
		}
	}
}
?>