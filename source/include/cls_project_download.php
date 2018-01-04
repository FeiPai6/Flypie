<?php
/*
 *  离线下载工具类
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author: wh #qq.com $
 * $Id: cls_project_download.php 28028 2016-04-27Z wh $
*/
require_once 'cls_file_util.php';
require_once 'cls_common.php';

class ProjectDownload{

	private $project; //项目配置信息 数组
	private $tempDir; //项目临时目录
	private $rootPath; //项目根路径
	private $folder;//文件夹名，压缩文件名
	function __construct($folder,$project){
		$this->project = $project;
		$this->rootPath = str_replace('/source/include/cls_project_download.php','',str_replace('\\', '/', __FILE__)).'/';
		//如果传入文件夹名为空，则生成一个
		if(empty($folder))
			$this->folder = date("Ymd",Common::gmtime()).Common::get_rand_number();
		else
			$this->folder = $folder;
		$this->tempDir = $this->rootPath.'temp/down/'.$this->folder.'/tour/';
		//如果传入了project 就将project 写入到临时文件
		if($project){
			$this->project = $project;
			if(empty($this->project['cdn_host']))
				$this->project['cdn_host'] = $GLOBALS['_lang']['cdn_host'];
		}else{
			//读取
			require_once $this->tempDir."project.php";
			$this->project = $project;
		}
	}

	public function buildDownload(){
		//资源下载
		$this->buildStructure();
		$this->buildHotspot();
		$this->buildTourXml();
		$this->buildOpenAlert();
		$this->buildBgMusic();
		$this->buildSkyLandShade();
		$this->buildUrlPhoneNvg();
		$this->buildSpeechExplain();
		$this->buildEffect();
		$this->buildSandTable();
		$this->buildCustomLogo();
		$this->buildShare();
		$this->buildIndexHtml();
		$this->buildJson();
		$this->buildZip();
		
		return $this->folder;
	}
	/**
	* 建立目录结构
	**/
	public function buildStructure(){
		//生成临时目录
		FileUtil::createDir($this->rootPath.'temp/down/'.$this->folder.'/');
		FileUtil::copyDir($this->rootPath.'data/static_template/',$this->rootPath.'temp/down/'.$this->folder.'/');
		return $this->folder;
	}
	/**
	* 更新场景跳转热点
	**/
	public function buildHScene(){
		$hotspot = $this->project['hotspot'];
		foreach ($hotspot as  &$h) {
			//scene
			foreach ($h['scene']as &$s) {
				$filename = $this->getFileName($s['imgPath']);
				$this->grabFile($s['imgPath'],$this->tempDir.'resource/images/'.$filename);
				$s['imgPath'] = 'resource/images/'.$filename;
			}
		}
		$this->project['hotspot'] = $hotspot;
	}
	/**
	* 更新链接热点
	**/
	public function buildHLink(){
		$hotspot = $this->project['hotspot'];
		foreach ($hotspot as &$h) {
			//link
			foreach ($h['link'] as &$l) {
				$filename = $this->getFileName($l['imgPath']);
				$this->grabFile($l['imgPath'],$this->tempDir.'resource/images/'.$filename);
				$l['imgPath'] = 'resource/images/'.$filename;
			}
		}
		$this->project['hotspot'] = $hotspot;
	}
	/**
	* 更图片接热点
	**/
	public function buildHImage(){
		$hotspot = $this->project['hotspot'];
		foreach ($hotspot as &$h) {
			//image
			foreach ($h['image'] as &$i) {
				$filename = $this->getFileName($i['imgPath']);
				$this->grabFile($i['imgPath'],$this->tempDir.'resource/images/'.$filename);
				$i['imgPath'] = 'resource/images/'.$filename;
				$imgs = &$i['imgs'];
				foreach ($imgs as &$img) {
					$filename = $this->getFileName($img['src']);
					$this->grabFile($img['src'],$this->tempDir.'resource/images/'.$filename);
					$img['src'] = 'resource/images/'.$filename;
				}
			}
		}
		$this->project['hotspot'] = $hotspot;
	}
	/**
	* 更新文本热点
	**/
	public function buildHText(){
		$hotspot = $this->project['hotspot'];
		foreach ($hotspot as &$h) {
			//text
			foreach ($h['text'] as &$t) {
				$filename = $this->getFileName($t['imgPath']);
				$this->grabFile($t['imgPath'],$this->tempDir.'resource/images/'.$filename);
				$t['imgPath'] = 'resource/images/'.$filename;
			}
		}
		$this->project['hotspot'] = $hotspot;
	}
	/**
	* 更新语音热点
	**/
	public function buildHVoice(){
		$hotspot = $this->project['hotspot'];
		foreach ($hotspot as &$h) {
			//voice
			foreach ($h['voice'] as &$v) {
				$filename = $this->getFileName($v['imgPath']);
				$this->grabFile($v['imgPath'],$this->tempDir.'resource/images/'.$filename);
				$v['imgPath'] = 'resource/images/'.$filename;
				$filename = $this->getFileName($v['musicSrc']);
				$this->grabFile($v['musicSrc'],$this->tempDir.'resource/media/'.$filename);
				$v['musicSrc'] = 'resource/media/'.$filename;
			}
		}
		$this->project['hotspot'] = $hotspot;
	}
	/**
	* 重置图文热点
	**/
	public function buildHImgText(){
		$hotspot = $this->project['hotspot'];
		foreach ($hotspot as &$h) {
			$h['imgtext'] = array();
		}
		$this->project['hotspot'] = $hotspot;
	}

	/**
	* 编辑环物热点
	**/
	public function buildHObj(){
		$hotspot = $this->project['hotspot'];
		foreach ($hotspot as &$h) {
			//obj
			foreach ($h['obj'] as &$o) {
				$filename = $this->getFileName($o['imgPath']);
				$this->grabFile($o['imgPath'],$this->tempDir.'resource/images/'.$filename);
				$o['imgPath'] = 'resource/images/'.$filename;
				if ($o['objid']) {
					$obj = $GLOBALS['Db']->query('SELECT imgs FROM '.$GLOBALS['Base']->table('object_around').' WHERE id='.$o['objid'],'Row');
					$obj['imgs'] = json_decode($obj['imgs']);
					foreach ($obj['imgs'] as $oi) {
						$filename = $this->getFileName($oi->imgsrc);
						$this->grabFile($oi->imgsrc,$this->tempDir.'resource/objs/'.$filename);
						// $oi->imgsrc = 'resource/objs/'.$filename;
						$o['objs'][] = array('imgsrc'=>'resource/objs/'.$filename);
					}
				}
			}
		}
		$this->project['hotspot'] = $hotspot;
	}
	/**
	* 重置视频热点
	**/
	public function buildHVideo(){
		$hotspot = $this->project['hotspot'];
		foreach ($hotspot as &$h) {
			//video
			foreach ($h['video'] as &$vi) {
				$filename = $this->getFileName($vi['imgPath']);
				$this->grabFile($vi['imgPath'],$this->tempDir.'resource/images/'.$filename);
				$vi['imgPath'] = 'resource/images/'.$filename;
				$filename = $this->getFileName($vi['location']);
				$this->grabFile($vi['location'],$this->tempDir.'resource/media/'.$filename);
				$vi['location'] = 'resource/media/'.$filename;
			}
		}
		$this->project['hotspot'] = $hotspot;
	}
	/**
	* 更新热点内的内容  已弃用该方法
	**/
	public function buildHotspot(){
		$hotspot = $this->project['hotspot'];
		$localDir = $this->tempDir.'resource/';
		foreach ($hotspot as  &$h) {
			$filename ="";//全局的文件名，用于临时变量赋值
			//scene
			foreach ($h['scene']as &$s) {
				$filename = $this->getFileName($s['imgPath']);
				$this->grabFile($s['imgPath'],$localDir.'/images/'.$filename);
				$s['imgPath'] = 'resource/images/'.$filename;
			}
			//link
			foreach ($h['link'] as &$l) {
				$filename = $this->getFileName($l['imgPath']);
				$this->grabFile($l['imgPath'],$localDir.'/images/'.$filename);
				$l['imgPath'] = 'resource/images/'.$filename;
			}
			//image
			foreach ($h['image'] as &$i) {
				$filename = $this->getFileName($i['imgPath']);
				$this->grabFile($i['imgPath'],$localDir.'/images/'.$filename);
				$i['imgPath'] = 'resource/images/'.$filename;
				$imgs = &$i['imgs'];
				foreach ($imgs as &$img) {
					$filename = $this->getFileName($img['src']);
					$this->grabFile($img['src'],$localDir.'/images/'.$filename);
					$img['src'] = 'resource/images/'.$filename;
				}
			}
			//text
			foreach ($h['text'] as &$t) {
				$filename = $this->getFileName($t['imgPath']);
				$this->grabFile($t['imgPath'],$localDir.'/images/'.$filename);
				$t['imgPath'] = 'resource/images/'.$filename;
			}
			//voice
			foreach ($h['voice'] as &$v) {
				$filename = $this->getFileName($v['imgPath']);
				$this->grabFile($v['imgPath'],$localDir.'/images/'.$filename);
				$v['imgPath'] = 'resource/images/'.$filename;
				$filename = $this->getFileName($v['musicSrc']);
				$this->grabFile($v['musicSrc'],$localDir.'/media/'.$filename);
				$v['musicSrc'] = 'resource/media/'.$filename;
			}
			//imgtext
			$h['imgtext'] = array();

			// $h['obj'] = array();
			//obj
			foreach ($h['obj'] as &$o) {
				$filename = $this->getFileName($o['imgPath']);
				$this->grabFile($o['imgPath'],$localDir.'/images/'.$filename);
				$o['imgPath'] = 'resource/images/'.$filename;
				if ($o['objid']) {
					$obj = $GLOBALS['Db']->query('SELECT imgs FROM '.$GLOBALS['Base']->table('object_around').' WHERE id='.$o['objid'],'Row');
					$obj['imgs'] = json_decode($obj['imgs']);
					foreach ($obj['imgs'] as $oi) {
						$filename = $this->getFileName($oi->imgsrc);
						$this->grabFile($oi->imgsrc,$localDir.'/objs/'.$filename);
						// $oi->imgsrc = 'resource/objs/'.$filename;
						$o['objs'][] = array('imgsrc'=>'resource/objs/'.$filename);
					}
				}
			}
			// $h['obj'] = array();
			//video
			foreach ($h['video'] as &$vi) {
				$filename = $this->getFileName($vi['imgPath']);
				$this->grabFile($vi['imgPath'],$localDir.'/images/'.$filename);
				$vi['imgPath'] = 'resource/images/'.$filename;
				$filename = $this->getFileName($vi['location']);
				$this->grabFile($vi['location'],$localDir.'/media/'.$filename);
				$vi['location'] = 'resource/media/'.$filename;
			}
		}
		$this->project['hotspot'] = $hotspot;
	}
	/**
	* 创建xml文件
	*/
	public function buildTourXml(){
		$groups = $this->project['scene_group']['sceneGroups'];
		$remote = $this->project['cdn_host'].$this->project['pk_user_main'].'/works/';
		$local = $this->tempDir.'resource/pano/';
		foreach ($groups as &$g) {
			//暂时不获取分组的缩略图
			foreach ($g['scenes'] as &$s) {
				$localDir = $local.$s['viewuuid'].'/';
				$remotePath = $remote.$s['viewuuid'].'/';
				$this->grabFile($remotePath.'pano_b.jpg',$localDir.'pano_b.jpg');
				$this->grabFile($remotePath.'pano_d.jpg',$localDir.'pano_d.jpg');
				$this->grabFile($remotePath.'pano_f.jpg',$localDir.'pano_f.jpg');
				$this->grabFile($remotePath.'pano_l.jpg',$localDir.'pano_l.jpg');
				$this->grabFile($remotePath.'pano_r.jpg',$localDir.'pano_r.jpg');
				$this->grabFile($remotePath.'pano_u.jpg',$localDir.'pano_u.jpg');
				$this->grabFile($remotePath.'preview.jpg',$localDir.'preview.jpg');
				$this->grabFile($remotePath.'thumb.jpg',$localDir.'thumb.jpg');
				$this->grabFile($remotePath.'mobile/pano_b.jpg',$localDir.'mobile/pano_b.jpg');
				$this->grabFile($remotePath.'mobile/pano_d.jpg',$localDir.'mobile/pano_d.jpg');
				$this->grabFile($remotePath.'mobile/pano_f.jpg',$localDir.'mobile/pano_f.jpg');
				$this->grabFile($remotePath.'mobile/pano_l.jpg',$localDir.'mobile/pano_l.jpg');
				$this->grabFile($remotePath.'mobile/pano_r.jpg',$localDir.'mobile/pano_r.jpg');
				$this->grabFile($remotePath.'mobile/pano_u.jpg',$localDir.'mobile/pano_u.jpg');

				$s['imgPath'] ='resource/pano/'.$s['viewuuid'].'/thumb.jpg';
			}
		}

		if($groups[0]['imgPath']){
			$filename = $this->getFileName($groups[0]['imgPath']);
			$this->grabFile($groups[0]['imgPath'],$this->tempDir.'resource/images/'.$filename);
			$groups[0]['imgPath'] = 'resource/images/'.$filename;
		}
		$this->project['scene_group']['sceneGroups'] = $groups;
		$scenesRes;
		if(count($groups)>1){
			foreach ($groups as $g2) {
				foreach ($g2['scenes'] as $k => $s2) {
					if ($k==0) 
						$s2['album'] = $g2['groupName'];
					$scenesRes[] = $s2;
				}
			}
		}else{
			$scenesRes = $groups[0]['scenes'];
		}

		$GLOBALS['tp']->assign('scenesRes',$scenesRes);
		$GLOBALS['tp']->assign('hotspot',$this->project['hotspot']);
		$GLOBALS['tp']->setTemplateDir($this->rootPath.'data/static_template/tour/');
		$output = $GLOBALS['tp']->fetch('tour.xml');
		file_put_contents($this->tempDir.'/tour.xml', $output);
	}
	/**
	* 开场图片
	*/
	public function buildOpenAlert(){
		$openAlert = $this->project['open_alert'];
		if ($openAlert['imgPath']) {
			$filename = $this->getFileName($openAlert['imgPath']);
			$this->grabFile($openAlert['imgPath'],$this->tempDir.'resource/images/'.$filename);
			$this->project['openAlert']['imgPath'] = 'resource/images/'.$filename;
		}
	}
	/**
	* 背景音乐
	*/
	public function buildBgMusic(){
		$bgMusic = $this->project['bg_music'];
		if($bgMusic['sceneSettings']){
			foreach ($bgMusic['sceneSettings'] as &$s) {
				if ($s['mediaUrl']) {
					$filename = $this->getFileName($s['mediaUrl']);
					$this->grabFile($s['mediaUrl'],$this->tempDir.'resource/media/'.$filename);
					$s['mediaUrl'] = 'resource/media/'.$filename;
				}
			}
		}else if($bgMusic['mediaUrl']){
			$filename = $this->getFileName($bgMusic['mediaUrl']);
			$this->grabFile($bgMusic['mediaUrl'],$this->tempDir.'resource/media/'.$filename);
			$bgMusic['mediaUrl'] = 'resource/media/'.$filename;
		}
		$this->project['bg_music'] = $bgMusic ;
	}

	/**
	* 补天补地
	*/
	public function buildSkyLandShade(){
		$sls = $this->project['sky_land_shade'];
		if ($sls['shadeSetting']&&$sls['shadeSetting']['imgPath']) {
			$filename = $this->getFileName($sls['shadeSetting']['imgPath']);
			$this->grabFile($sls['shadeSetting']['imgPath'],$this->tempDir.'resource/images/'.$filename);
			$this->project['sky_land_shade']['shadeSetting']['imgPath'] = 'resource/images/'.$filename;
		}
	}

	/**
	* 电话链接导航
	*/
	public function buildUrlPhoneNvg(){
	   $upn = $this->project['url_phone_nvg'];
	   if ($upn['linkSettings']) {
	   	  foreach ($upn['linkSettings'] as $k => $v) {
	   	  		if ($v['type'] == '0') {
	   	  			unset($this->project['url_phone_nvg']['linkSettings'][$k]);
	   	  		}else{
	   	  			$filename = $this->getFileName($v['imgPath']);
					$this->grabFile($v['imgPath'],$this->tempDir.'resource/images/'.$filename);
					$this->project['url_phone_nvg']['linkSettings'][$k]['imgPath'] = 'resource/images/'.$filename;
	   	  		}
	   	  }
	   }
	}

	/**
	* 语音解说
	*/
	public function buildSpeechExplain(){
		$se = $this->project['speech_explain'];
		if($se['sceneSettings']){
			foreach ($se['sceneSettings'] as &$s) {
				if ($s['mediaUrl']) {
					$filename = $this->getFileName($s['mediaUrl']);
					$this->grabFile($s['mediaUrl'],$this->tempDir.'resource/media/'.$filename);
					$s['mediaUrl'] = 'resource/media/'.$filename;
				}
			}
		}else if($se['mediaUrl']){
			$filename = $this->getFileName($bgMusic['mediaUrl']);
			$this->grabFile($bgMusic['mediaUrl'],$this->tempDir.'resource/media/'.$filename);
			$se['mediaUrl'] = 'resource/media/'.$filename;
		}
		$this->project['speech_explain'] = $se ;
	}

	/**
	* 雨雪特效
	*/
	public function buildEffect(){
		$effect = $this->project['special_effects'];
		if ($effect['effectSettings']) {
			foreach ($effect['effectSettings'] as &$e) {
				if($e['effectImgPath']){
					$filename = $this->getFileName($e['effectImgPath']);
					$this->grabFile($e['effectImgPath'],$this->tempDir.'resource/images/'.$filename);
					$e['effectImgPath'] = 'resource/images/'.$filename;
				}
			}
			$this->project['special_effects'] = $effect;
		}
	}

	/**
	*沙盘图
	*/
	public function buildSandTable(){
		$sandTable = $this->project['sand_table'];
		if ($sandTable['sandTables']) {
			foreach ($sandTable['sandTables'] as &$s) {
				$filename = $this->getFileName($s['imgPath']);
				$this->grabFile($s['imgPath'],$this->tempDir.'resource/images/'.$filename);
				$s['imgPath'] = 'resource/images/'.$filename;
			}
			$this->project['sand_table'] = $sandTable;
		}
	}
	/**
	*自定义logo
	*/
	public function buildCustomLogo(){
		$customLogo = $this->project['custom_logo'];
		if ($customLogo['logoImgPath']) {
			$filename = $this->getFileName($customLogo['logoImgPath']);
			$this->grabFile($customLogo['logoImgPath'],$this->tempDir.'resource/images/'.$filename);
			$this->project['custom_logo']['logoImgPath'] = 'resource/images/'.$filename;
		}else{
			$this->grabFile('/plugin/custom_logo/images/custom_logo.png',$this->tempDir.'resource/images/custom_logo.png');
		}
	}
	/**
	*去掉功能分享
	*/
	public function buildShare(){
		// if($this->project['hideshare_flag']==0){
		// 	$this->grabFile('http://localhost/qrcode.php?viewid='.$this->project['view_uuid'],$this->tempDir.'resource/images/qrcode.png');
		// }
	}
	/**
	*生成首页
	*/
	public function buildIndexHtml(){
		require_once $this->rootPath.'plugin/plugin_init_function.php';
		$plugins = plugin_get_plugins("view",false,true);
		//去掉足迹 去掉说一说
		unset($plugins['footmarker'],$plugins['comment'],$plugins['share']);
		$GLOBALS['tp']->template_dir = $this->rootPath.'data/static_template/tour/';
		$GLOBALS['tp']->assign('nickname',$this->project['nickname']);
		$GLOBALS['tp']->assign('plugins',$plugins);
		$GLOBALS['tp']->assign('custom_right',$this->project['custom_right_button']);
		$output = $GLOBALS['tp']->fetch('index.html');
		file_put_contents($this->tempDir.'/index.html', $output);
	}
	/**
	*序列化json到文件
	*/
	public function buildJson(){
		// 序列化json到文件中
		file_put_contents($this->tempDir.'/static/js/data.js', "var data = ".json_encode($this->project));
		
	}
	/**
	*压缩文件夹
	*/
	public function buildZip(){
		//删除临时存储配置的文件
		unlink($this->tempDir."project.php");
		require_once 'pclzip.lib.php';
		$zip = new PclZip($this->rootPath.'temp/down/'.$this->folder.'.zip');
		$rs = $zip->create($this->rootPath.'temp/down/'.$this->folder,PCLZIP_OPT_REMOVE_PATH,$this->rootPath.'temp/down/'); 
	    if ($rs == 0) { 
	        return null;
	    }
	    //删除原有的文件夹
		FileUtil::unlinkDir($this->rootPath.'temp/down/'.$this->folder.'/');
	}
	/**
	*写入project到文件中
	*/
	public function writePro($fun){
		//如果是在执行打包，不写入直接返回
		if ($fun=='buildZip') {
			return;
		}
		$cont = var_export($this->project,true);
		$cont ="<?php\n\$project = $cont \n?>";
		file_put_contents($this->tempDir."project.php",$cont);
	}
    /*
    * 下载远程文件
    *　@param String 远程资源url 
    *  @param String 本地资源目录
    */
    public function grabFile($remoteFile,$localFile){
    	if (file_exists($localFile)) {
    		return;
    	}
    	if(strpos($remoteFile,"http://") === 0){
    		 $localDir = dirname($localFile);
    		 if(!is_dir($localDir))
    		 	FileUtil::createDir($localDir);
    		 $hander = curl_init();
    		 $fp = fopen($localFile,'wb');
    		 curl_setopt($hander,CURLOPT_URL,$remoteFile);
    		 curl_setopt($hander,CURLOPT_FILE,$fp);
    		 curl_setopt($hander,CURLOPT_HEADER,0);
    		 curl_setopt($hander,CURLOPT_FOLLOWLOCATION,1);
    		 curl_setopt($hander,CURLOPT_TIMEOUT,60);
    		 curl_exec($hander);
    		 curl_close($hander);
    		 fclose($fp);
    	}else{
    		FileUtil::copyFile($this->rootPath.substr($remoteFile, 1),$localFile);
    	}
    }

    /**
    *  根据url截取资源的名称
    */
    public function getFileName($url){
    	return substr($url, strrpos($url, "/")+1);
    }
}



?>