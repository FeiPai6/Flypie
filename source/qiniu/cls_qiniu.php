<?php
	if(!defined('IN_T'))
	{
	   die('禁止访问！');
	}
	require_once __DIR__."/../include/cls_common.php";
	require_once __DIR__.'/cls_qiniu_factory.php';
	require_once __DIR__.'/../krpano/cls_common_operation.php';
	// require_once __DIR__.'/../../config/config.php';

	/**
	* 七牛相关操作封装
	*/
	class Qiniu  extends KrOperation
	{
		/*
	     * origin 原地址
	     * dest 目标地址
	     * @return file
		 */
		public  function downloadFile($obj , $file){
			if (empty($obj)||empty($file)) {
				return null;
			}
			$signedUrl = Qiniu_Factory::getAuth()->privateDownloadUrl('http://'.$GLOBALS['_lang']['qiniu_config']['cdn_host'].'/'.$obj);
			$temp = Common::file_get($signedUrl);
			//$file = $dest_dir.substr($origin_url,strrpos($origin_url,"/")+1);
			if(@file_put_contents($file, $temp) && !curl_error($ch)) {
			      return $file;
			    } else {
			      return null;
			  }
		}
		/*
		*  上传文件到七牛
		*	$local_file 本地文件
		*	$origin_file 远程的文件
		*/
		public function uploadFile($local_file , $origin_file){
			if (empty($local_file)||empty($origin_file)) {
				return false;
			}
			list($ret, $err) = Qiniu_Factory::getUploaManager()->putFile(Qiniu_Factory::getAuth()->uploadToken($GLOBALS['_lang']['qiniu_config']['bucket']), $origin_file, $local_file);
			if ($err !== null) {
			    return true;
			} else {
				return false;
			}
		}

		public function video_thumb($location,$time){
			$Operation = Qiniu_Factory::getOperation();
			$fos = "vframe/jpg/offset/".$time;
			return $Operation->buildUrl($location,$fos);
		}
	}

?>