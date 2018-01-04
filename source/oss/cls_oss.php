<?php
/*
 *  oss上传下载文件
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: index.php 28028 2016-03-09Z  $
*/
if(!defined('IN_T'))
{
   die('禁止访问！');
}
require_once __DIR__.'/../krpano/cls_common_operation.php';
require_once 'cls_oss_factory.php';
class Oss extends KrOperation
{
	
	public  function downloadFile($obj , $localfile){
		$ossClient = Oss_Factory::getOssClient();
		$options = array(
		    $ossClient::OSS_FILE_DOWNLOAD => $localfile,
		);
		try{
		    $ossClient->getObject($GLOBALS['_lang']['oss_config']['bucket'], $obj, $options);
		} catch(OssException $e) {
		    printf($e->getMessage() . "\n");
		    return null;
		}
		return $localfile;
	}

	public function uploadFile($local_file , $origin_file){
		$ossClient = Oss_Factory::getOssClient();
	    try{
	        $ossClient->uploadFile($GLOBALS['_lang']['oss_config']['bucket'],$origin_file, $local_file);
	    } catch(OssException $e) {
	        printf($e->getMessage() . "\n");
	        return;
	    }

	}

	public function video_thumb($obj,$time){

		$thumb = 'video_thumb/'.Common::guid().'.jpg';
		$arr = array(
				'Action' => 'SubmitSnapshotJob',
				'Input'  => '{"Bucket":"'.$GLOBALS['_lang']['oss_config']['bucket'].'","Location":"'.$GLOBALS['_lang']['oss_config']['location'].'","Object":"'.$obj.'"}',
				'SnapshotConfig' => '{"OutputFile": {"Bucket": "'.$GLOBALS['_lang']['oss_config']['location'].'","Location": "'.$GLOBALS['_lang']['oss_config']['location'].'","Object": "'.$thumb.'"},"Time": "'.($time*1000).'","FrameType":"normal"}'
			);
		$ossMts = Oss_Factory::getOssMts();
		$result = Curl::callWebServer($ossMts->getSignUrl($arr));
		if($result['SnapshotJob']['State']=='Success')
			return $GLOBALS['_lang']['cdn_host'].$thumb;
		else
			return $GLOBALS['_lang']['host'].'static/images/def_video_thumb.jpg';
	}
}


?>