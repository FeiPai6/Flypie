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
if(!defined('IN_T')){
	die('禁止访问！');
}
//引用下载类
require_once ROOT_PATH.'source/include/cls_project_download.php';
require_once ROOT_PATH.'source/include/cls_file_util.php';
$act = Common::sfilter($_REQUEST['act']);

//准备压缩包
if($act == 'build'){
	//设置该次请求超时时长，1800s
	@ini_set("max_execution_time", "1800"); 
	//兼容php-fpm设置超时
	@ini_set("request_terminate_timeout", "1800");
	
	$re['status'] = 0;
	$operation = Common::sfilter($_POST['operation']); //前台传入的操作 (normal 正常流程) (afresh 重新下载) (continue 继续下载)
	$pid = intval($_REQUEST['pid']);
	if (empty($operation)||!in_array($operation,array('normal','afresh','continue'))) {
		$re['msg']='未知操作';
		echo $Json->encode($re);
		exit;
	}
	//判读项目是否存在
	$project = $Db->query('SELECT * FROM '.$Base->table('worksmain').' w LEFT JOIN '.$Base->table('pano_config').' p ON w.pk_works_main = p.pk_works_main WHERE w.pk_works_main = '.$pid.' AND w.pk_user_main = '.$user['pk_user_main'],'Row');
	if(empty($project)){
		$re['msg'] = '项目不存在';
	}else{
		//取得下载任务
		$task = $Db->query('SELECT id,folder,step,status,msg FROM '.$Base->table('project_download').' WHERE pid='.$pid.' AND uid = '.$user['pk_user_main'],'Row');
		if(empty($task)){
			$re['msg'] = '任务不存在';
		}else if ($task['status']==2) {
			$re['msg'] = '打包完成';
			$re['status'] = 2;
			$re['folder'] = $task['folder'];
		}else{
			$step = $task['step'];
			if ($step == 0||$operation=='normal') {
				$step++;
			}else if($operation=='afresh'){
				if (!empty($task['folder']))
					FileUtil::unlinkDir(ROOT_PATH.'temp/down/'.$task['folder'].'/');
				$step = 1;
			}
			$task['step'] = $step;
			$funs = getDownloadStep($step);
			if ($funs['fun']=='success') {
				//下载成功
				$re['msg'] = '打包完成';
				$re['status'] = 2;
				$re['folder'] = $task['folder'];
				$task['status']=2;
				$task['msg'] = $funs['msg'];
			}else{
				//继续下载
				$project = Transaction::decode_str2arr($project);
				if (empty($project['scene_group']['sceneGroups'])) {
					//查询图片  imagesmain 
					$scenes = $Db->query("SELECT i.view_uuid AS viewuuid , i.filename AS sceneTitle ,i.thumb_path AS imgPath FROM ".$Base->table('imgsmain')."i LEFT JOIN ".$Base->table('imgs_works')." iw ON i.pk_img_main = iw.pk_img_main WHERE iw.pk_works_main =".$pid);
					$project['scene_group']['sceneGroups'][0]['groupName'] = '场景选择';
					$project['scene_group']['sceneGroups'][0]['scenes'] = $scenes;
				}
				chdir(ROOT_PATH);
				//执行打包程序
				if ($step==1) {
					$p = new ProjectDownload($task['folder'],$project);
					$task['folder'] = $p->$funs['fun']();
				}else{
					$p = new ProjectDownload($task['folder']);
					$p->$funs['fun']();
				}
				$p->writePro($funs['fun']);
				
				//获取下一步要执行的操作
				$funs = getDownloadStep($step++); 
				$task['msg'] = $funs['msg'];
				$task['status'] = 1;
				$re['msg'] = $funs['msg'];
				$re['status'] = 1;
				$re['step'] = $step;
			}
			$taskid = $task['id'];
			unset($task['id']);
			$Db->update($Base->table('project_download'),$task,array('id'=>$taskid));
		}
	}
	echo $Json->encode($re);
	exit;
}
//下载压缩包 ##提取到根目录下 download.php 
// else if($act=='download'){
// 	$filename = Common::sfilter($_REQUEST['filename']);
// 	$task = $Db->query('SELECT id FROM '.$Base->table('project_download').' WHERE uid='.$user['pk_user_main'].' AND folder = '.$filename,'Row');
// 	if (empty($task)) {
// 		die('没有该下载任务');
// 	}
// 	$filename = $filename.'.zip';
// 	$url = ROOT_PATH.'temp/down/'.$filename;
// 	if (!file_exists($url)) {
// 		die('找不到该文件');
// 	}
// 	 /* headers */
// 	header('Cache-control: private');
// 	header("Content-type:application/x-zip-compressed"); 
// 	header('Content-Length: '.filesize($url));
// 	header('Content-Disposition: filename=中文名称'.$filename);
// 	flush();
// 	$fh = @fopen($url, 'r');
// 	while(!feof($fh)){
// 	    print fread($fh, 1024);
// 	    flush();
// 	}
// 	@fclose($fh);
// 	unlink($url);
// 	$Db->delete($Base->table('project_download'),array('id'=>$task['id']));
// 	exit;
// }
//校验是否在离线下载列表中
else if($act == 'validate'){
	$pid = intval($_POST['pid']);
	$re['status'] = 0 ;
	$project = $Db->query('SELECT name,thumb_path FROM '.$Base->table('worksmain').' w WHERE w.pk_works_main = '.$pid.' AND pk_user_main ='.$user['pk_user_main'],'Row');
	if (empty($project)) {
		$re['msg'] = '未查询到该项目';
	}else{
		if($Db->getCount($Base->table('project_download'),'id',array('pid'=>$pid,'uid'=>$user['pk_user_main']))==0){
			//写入等待执行到数据库
			$Db->insert($Base->table('project_download'),array('pid'=>$pid,'uid'=>$user['pk_user_main'],'pname'=>$project['name'],'thumb'=>$project['thumb_path'],'msg'=>'正在创建目录结构'));
			$re['status'] = 1;
		}else{
			//已经下载列表
			$re['msg'] = '您的项目已经在下载列表中，请到离线下载页继续下载，或者删除任务';
		}
	}
	echo $Json->encode($re);
	exit;
}
//删除一个离线任务
else if($act=='delete'){
	$tid = intval($_REQUEST['tid']);
	$re['status'] = 0;
	$task = $Db->query('SELECT * FROM '.$Base->table('project_download').' WHERE id = '.$tid.' AND uid = '.$user['pk_user_main'],'Row');
	if (empty($task)) {
		$re['msg'] = '离线任务不存在';
	}else{
		$Db->delete($Base->table('project_download'),array('id'=>$tid,'uid'=>$user['pk_user_main']));
		if (!empty($task['folder'])) {
			$temp = ROOT_PATH.'temp/down/'.$task['folder'];
			FileUtil::unlinkDir($temp);
			FileUtil::unlinkFile($temp.'.zip');
		}
		$re['status'] = 1;
	}
	echo $Json->encode($re);
	exit;
}
//跳转到查看页面
else{
	//如果传入pid ,则判断pid是否已经在下载列表中
	$tp->assign('taskList',$Db->query('SELECT * FROM '.$Base->table('project_download').' WHERE uid='.$user['pk_user_main'].' ORDER BY id DESC'));
}

function getDownloadStep($step){
	$funs = array(
			//0=>array(),
			1=>array('fun'=>'buildStructure','msg'=>'正在生成目录结构'),
			//2=>array('fun'=>'buildHotspot','msg'=>'正在生成热点内容'),
			2=>array('fun'=>'buildTourXml','msg'=>'正在创建xml文件'),
			3=>array('fun'=>'buildHScene','msg'=>'正在生成场景跳转热点'),
			4=>array('fun'=>'buildHLink','msg'=>'正在生成链接热点'),
			5=>array('fun'=>'buildHImage','msg'=>'正在生成图片热点'),
			6=>array('fun'=>'buildHText','msg'=>'正在生成文本热点'),
			7=>array('fun'=>'buildHVoice','msg'=>'正在生成语音热点'),
			8=>array('fun'=>'buildHImgText','msg'=>'正在生成图文热点'),
			9=>array('fun'=>'buildHObj','msg'=>'正在生成环物热点'),
			10=>array('fun'=>'buildHVideo','msg'=>'正在生成视频热点'),
			11=>array('fun'=>'buildOpenAlert','msg'=>'正在生成开场图片'),
			12=>array('fun'=>'buildBgMusic','msg'=>'正在生成背景音乐'),
			13=>array('fun'=>'buildSkyLandShade','msg'=>'正在生成补天补地'),
			14=>array('fun'=>'buildUrlPhoneNvg','msg'=>'正在生成电话链接导航'),
			15=>array('fun'=>'buildSpeechExplain','msg'=>'正在生成语音解说'),
			16=>array('fun'=>'buildEffect','msg'=>'正在生成雨雪特效'),
			17=>array('fun'=>'buildSandTable','msg'=>'正在生成沙盘图'),
			18=>array('fun'=>'buildCustomLogo','msg'=>'正在生成自定义logo'),
			19=>array('fun'=>'buildShare','msg'=>'正在生成分享'),
			20=>array('fun'=>'buildIndexHtml','msg'=>'正在生成首页'),
			21=>array('fun'=>'buildJson','msg'=>'正在序列化json到文件'),
			22=>array('fun'=>'buildZip','msg'=>'正在压缩文件夹'),
			23=>array('fun'=>'success','msg'=>'打包完成'),
		);

	return $funs[$step];
}

?>