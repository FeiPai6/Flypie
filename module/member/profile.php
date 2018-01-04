<?php
/*
 *  资料管理
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: profile.php 28028 2016-06-19Z  $
*/
if(!defined('IN_T')){
	die('禁止访问！');
}
$act =  Common::sfilter($_REQUEST['act']);
if($act == "update_head_img"){
	$re['status'] = 0 ;
	$file = $_FILES['file_data'];
	if (empty($file)) {
		$re['msg'] = "请选择头像";
	}else if ($file['size']>300*1024) {
		$re['msg'] = "请不要上传超过300kb的图片";
	}elseif (strpos("image/jpeg",$file['type'])!=0||strpos("image/png",$file['type'])!=0) {
		$re['msg'] = "只能上传jpg和png格式的图片";
	}else{
		$x = intval($_REQUEST['left']);
		$y = intval($_REQUEST['top']);
		$w = intval($_REQUEST['width']);
		$h = intval($_REQUEST['height']);
		if ($x<0||$y<0||$w<100||$h<100) {
			$re['msg'] = "非法参数";
		}else{
			//图片裁剪
			require_once ROOT_PATH.'source/include/cls_img_cutter.php';
			$prefix = substr($file['name'], strrpos($file['name'], '.'));
			$dest_path = "/data/avatar/user/".Common::guid().$prefix;
			$t = new ThumbHandler();
			$t->setSrcImg($file['tmp_name']);
			$t->setCutType(2);//声明为手动裁剪
			$t->setSrcCutPosition(intval($_REQUEST['left']), intval($_REQUEST['top']));
			$t->setRectangleCut(intval($_REQUEST['width']), intval($_REQUEST['height']));// 裁切尺寸 
			$t->setDstImg(ROOT_PATH.$dest_path); 
			$result = $t->createImg(intval($_REQUEST['width']), intval($_REQUEST['height']));
			if ($result) {
				#图片裁剪成功
				$avatar = $Db->query('SELECT avatar FROM '.$Base->table('user_profile').' WHERE pk_user_main ='.$user['pk_user_main'],"One" );
				if (empty($avatar)) {
					$profile = array(
							'pk_user_main'=>$user['pk_user_main'],
							'avatar'=>$dest_path
						);
					$Db->insert($Base->table('user_profile'),$profile);
				}else{
					//删除原来的头像
					@unlink (ROOT_PATH.$avatar);
					$Db->update($Base->table('user_profile'),array('avatar'=>$dest_path),array('pk_user_main'=>$user['pk_user_main']));
				}
				$re['status'] = 1;
				$re['imgsrc'] = $dest_path;
			}else{
				$re['msg'] = "图片裁剪失败";
			}
		}
	}
	echo $Json->encode($re);
	exit;
}else if($act == 'edit'){
	$nickname = Common::sfilter($_REQUEST['nickname']);
	$re['status'] = 0;
	if(empty($nickname)||mb_strlen($nickname)>32){
		$re['msg'] ='请输入32位以内的昵称';
	}else{
		$Db->update($Base->table('user'),array('nickname'=>$nickname),array('pk_user_main'=>$user['pk_user_main']));
		$re['status'] = 1;
		$re['msg'] = '修改成功';
	}
	echo $Json->encode($re);
	exit;
}
else{
	$profile = $Db->query('SELECT u.phone,u.nickname,u.last_time,p.* FROM '.$Base->table('user').' u LEFT JOIN '.$Base->table('user_profile').' p ON u.pk_user_main = p.pk_user_main WHERE u.pk_user_main = '.$user['pk_user_main'] ,"Row");
	$tp->assign('profile',$profile);
}
$tp->assign('title','作者资料');
?>