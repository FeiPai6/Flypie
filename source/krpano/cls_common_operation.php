<?php
if(!defined('IN_T'))
{
   die('禁止访问！');
}
require_once __DIR__."/../../config/config.php";
require_once __DIR__."/../include/cls_common.php";
abstract class KrOperation{

	abstract protected function downloadFile($origin_url , $dest_file);
	abstract protected function uploadFile($local_file , $origin_file);
	abstract protected function video_thumb($location,$time);
	/*
	 * $imgs 图片在存储服务器的路径
	 * $temp_dir 图片下载到本地的临时路径
	 * $kr_path  KRPANO 的路径
	 * $origin_dir 	切图完成后，存储图片的目录
	 * $cdn_host 云存储服务器域名
		notice : 目录必须带最后一个 /

	 * return $imgsmain  包含场景数组
	*/
	public static function slice($pk_user_main,$imgs,$origin_dir){
		//创建临时目录 
		$temp_dir = KRTEMP."/".$pk_user_main."/".date('Ymd',Common::gmtime()).Common::get_rand_number()."/";
		Common::make_dir($temp_dir);
		$kr=null;
		$cdn_host = 'http://';
		switch ($GLOBALS['_lang']['global_storage']) {
			case 'qiniu':
				require_once __DIR__.'/../qiniu/cls_qiniu.php';
				$kr = new qiniu();
				$cdn_host .= $GLOBALS['_lang']['qiniu_config']['cdn_host'];
				break;
			case 'oss':
				require_once __DIR__.'/../oss/cls_oss.php';
				$kr = new Oss();
				$cdn_host .= $GLOBALS['_lang']['oss_config']['cdn_host'];
				break;
		}
		$cdn_host .='/';
		return $kr==null?null:$kr->slicing($imgs,$temp_dir,$cdn_host,$origin_dir);
	}
	
	public static function get_video_thumb($location,$time){
		$kr = null;
		
		switch ($GLOBALS['_lang']['global_storage']) {
			case 'qiniu':
				require_once __DIR__.'/../qiniu/cls_qiniu.php';
				$kr = new qiniu();
				break;
			case 'oss':
				require_once __DIR__.'/../oss/cls_oss.php';
				$kr = new Oss();
				break;
		}
		return $kr==null?null:$kr->video_thumb($location,$time);
	}

    public function slicing($imgs,$temp_dir,$cdn_host,$origin_dir){
		// $mime_type = finfo_open(FILEINFO_MIME_TYPE);
		$path="";
		$scenes = array();
		$imgsmain = array();
		foreach ($imgs as $img) {
			$obj = $img['imgsrc'];
			$view_uuid=Common::guid(16);
			$rpos = strrpos($obj,"/");
			//计算云存储上的原始文件名，为下次升级素材管理时，针对单张全景图生成预览
			$temp_name = substr($obj, $rpos==0?$rpos:$rpos+1);
			$file = $this->downloadFile($obj,$temp_dir.$temp_name);
			if($file!=null){
				$info = getimagesize($file);
				if(($info['0']/$info['1']==2)&&( (strpos("image/jpeg",$info['mime'])===0)||(strpos("image/tif", $info['mime'])===0))){
					
					$filename = $img['imgname'];
					if (strpos($filename, ".jpg")) {
						$filename = substr($filename , 0 , strrpos($filename , "."));
					}
					if (mb_strlen($filename)) {
						$filename = substr($filename, 0,100);
					}
					//生成最终文件，合并生成整个项目全景图
					$final_name = $temp_dir.$view_uuid.substr($obj,strrpos($obj,"."));
					rename($temp_dir.$temp_name, $final_name );
					$path=$path.$final_name." ";
					$source = array(
						'filename' =>$filename, 
						'location'  =>$cdn_host.$obj,
						'thumb_path'=>$cdn_host.$origin_dir.$view_uuid."/thumb.jpg",
						'view_uuid' =>$view_uuid
						);
					$imgsmain[] = $source;
				}
				// if(!(strpos("image/jpeg",$info['mime'])===0)&& !(strpos("image/tif", $info['mime'])===0)||($info['0']/$info['1']!=2)){
				// }else{
					
				// }
			}
		}
		if ($path!="") {
			//echo KRPANO." ".$path;die;
			//执行切图
			exec(KRPANO." ".$path."");
			//上传切好图的整个目录到服务器
			$dir = $temp_dir."vtour/panos/";
			$this ->upload($dir,$origin_dir);
            $this ->deldir($temp_dir);   //上传完之后删除该目录
		}
		return  $imgsmain;
	
	}

    //循环删除目录和文件函数
    private function deldir($dir) {
        //先删除目录下的文件：
        $dh=opendir($dir);
        while ($file=readdir($dh)) {
            if($file!="." && $file!="..") {
                $fullpath=$dir."/".$file;
                if(!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    $this->deldir($fullpath);
                }
            }
        }

        closedir($dh);
        //删除当前文件夹：
        if(rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }
	private function upload($dir,$origin_file){
		if(is_dir($dir))
		{
			if ($dh = opendir($dir)) 
			{
				while (($file = readdir($dh)) !== false)
				{
					if((is_dir($dir.$file)) && $file!="." && $file!="..")
					{	
	
						//目录
						$this->upload($dir.$file."/",$origin_file.$file."/");
					}
					else
					{
						if($file!="." && $file!="..")
						{	
							//上传文件
							$this->uploadFile($dir.$file ,$origin_file.$file);
						}
					}
				}
				closedir($dh);
			}
		}
	}

}

?>