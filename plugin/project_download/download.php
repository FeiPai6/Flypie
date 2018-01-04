<?php 
/*
 *  下载功能
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: bind.php 28028 2016-06-19Z  $
*/
define('IN_T',true);
require_once "../../source/include/init.php";
//未登录
if($user['pk_user_main']<=0){
   Common::base_header("Location:".$_lang['host']."passport/login?redirectUrl=/member/$module\n");
}
//引用下载类
require_once ROOT_PATH.'source/include/cls_project_download.php';
$act = Common::sfilter($_REQUEST['act']);
if ($act == 'ready') {
	$pid = intval($_REQUEST['pid']);
	$re['status'] = 0 ;
	$project = $Db->query('SELECT * FROM '.$Base->table('worksmain').' w LEFT JOIN '.$Base->table('pano_config').' p ON w.pk_works_main = p.pk_works_main WHERE w.pk_works_main = '.$pid,'Row');
	if (empty($project)) {
		$re['msg'] ='未查询到该项目';
	}else{
		$project = Transaction::decode_str2arr($project);
		if (empty($project['sceneGroups'])) {
			//查询图片  imagesmain 
			$scenes = $Db->query("SELECT i.view_uuid AS viewuuid , i.filename AS sceneTitle ,i.thumb_path AS imgPath FROM ".$Base->table('imgsmain')."i LEFT JOIN ".$Base->table('imgs_works')." iw ON i.pk_img_main = iw.pk_img_main WHERE iw.pk_works_main =".$pid);
			$project['sceneGroups']['groupName'] = '场景选择';
			$project['sceneGroups']['scenes'] = $scenes;
		}
		chdir(ROOT_PATH);
		$p = new ProjectDownload($project,$_lang);
		$re['filename'] = $p->buildZip();
		$re['status'] = 1;
	}
	echo $Json->encode($re);
}
else if($act=='download'){
	$filename = Common::sfilter($_REQUEST['filename']);
	$url = ROOT_PATH.'temp/down/'.$filename;
	if (!file_exists($url)) {
		die('找不到该文件');
	}
	 /* headers */
	header('Cache-control: private');
	header("Content-type:application/x-zip-compressed"); 
	header('Content-Length: '.filesize($url));
	header('Content-Disposition: filename='.$filename);
	/* flush content */
	flush();
	/* open file */
	$fh = @fopen($url, 'r');
	while(!feof($fh)){
	    /* send only current part of the file to browser */
	    print fread($fh, 10);
	    /* flush the content to the browser */
	    flush();
	}
	/* close file */
	@fclose($fh);
	unlink($url);
}




?>