<?php
/*
 *  升级信息工具类
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author: wh #qq.com $
 * $Id: cls_upgrade.php 28028 2016-04-27Z wh $
*/

class UpgradeUtil{

	private $root;
	/*
	* 构造方法，传入项目跟路径
	**/
	public function __construct($rootpath){
		$this->root = $rootpath;
	}
	/*
	* 将MD5的数组写入到文件中
	*/
	public function md5_list_write($doc){
		
		$cont = var_export($doc,true);
		$cont ="<?php\n\$hash_list = $cont \n?>";
		if(file_put_contents($this->root.'upgrade/hash_list.php',$cont))
			return true;
	}

	/*
	*	生成文件的MD5值，并写入到数组中
	*	@except 计算MD5值时，忽略的目录
	*/
	public function generate_md5_list($except =null){
		if (!file_exists($this->root)) {
			return false;
		}
		if ($except == null) {
			$except = array();
		}
		$except[] = $this->root.'data/';
		$except[] = $this->root.'temp/';
		$except[] = $this->root.'.git/';
		$except[] = $this->root.'upgrade/';
		$except[] = $this->root.'docs/';
		$res = array();
		$this->do_generate($this->root,$except,$res);
		$this->md5_list_write($res);
		return true;
	}
	/**
	* 得到要写入的目录是否有写入权限
	*/
	public function list_validate_dir($up_code_dir){
		$dirs = array();
		$this->do_list_dir($up_code_dir,"",$dirs);
		$res = array();
		foreach ($dirs as $dir) {
			$writable = $this->is_writable($this->root.$dir);
			$res[$dir] = $writable;
		}
		return $res;
	}
	/*
	*  校验需要被替换的文件
	*   @up_code_dir  升级文件的目录
	*   @hash_list 原目录的所有hash列表
	*/
	public function list_validate_file($up_code_dir,$hash_list){
		$res = array();
		$this->do_validate($up_code_dir,'',$hash_list,$res);

		//对数组按是否修改降序排列 是否可写升序排列
		foreach ($res as  $v) {
			$key1[] = $v;
		}
		array_multisort($key1,SORT_NUMERIC,SORT_DESC,$res);
		return $res;
	}
	/*
	* @dir_ab 绝对路径
	* @dir_re 相对路径
	*/
	private function do_list_dir($dir_ab,$dir_re,&$res){
		if(is_dir($dir_ab))
		{
			if ($dh = opendir($dir_ab)) 
			{
				while (($file = readdir($dh)) !== false)
				{
					if((is_dir($dir_ab.$file)) && $file!="." && $file!="..")
					{	
						$old_ab = $dir_re.$file; //用户真实路径
						if (file_exists($this->root.$old_ab)) {
							if (!in_array($old_ab, $res)) {
								$res[] = $old_ab;
							}
						}
						$this->do_list_dir($dir_ab.$file.'/',$dir_re.$file.'/',$res);
					}
				}
				closedir($dh);
			}
		}
	}
	/*
	* @dir_ab 绝对路径
	* @dir_re 相对路径
	*/
	private function do_validate($dir_ab,$dir_re,$hash_list,&$res){
		if(is_dir($dir_ab))
		{	
			if ($dh = opendir($dir_ab)) 
			{
				while (($file = readdir($dh)) !== false)
				{
					if((is_dir($dir_ab.$file)) && $file!="." && $file!="..")
					{	
						//目录
						$this->do_validate($dir_ab.$file.'/',$dir_re.$file.'/',$hash_list,$res);
					}
					else
					{
						if($file!="." && $file!="..")
						{	
							$modify = 0; //是否修改过 0 未修改 
							$new_re = $dir_re.$file;  //相对路径
							$old_ab = $this->root.$new_re;//被替换文件的绝对路径
							if (file_exists($old_ab) && $hash_list[$new_re] != md5_file($old_ab) && $file!="version.conf") {
								$modify = 1 ;
							}
							$res[$new_re] =  $modify;
						}
					}
				}
				closedir($dh);
			}
		}
	}


	private function do_generate($dir,$except,&$res){
		if(is_dir($dir))
		{	
			$flag = true;
			foreach ($except as $e) {
				if ($e==$dir) {
					$flag = false;
					break;
				}
			}
			if ($flag&&$dh = opendir($dir)) 
			{
				while (($file = readdir($dh)) !== false)
				{
					if((is_dir($dir.$file)) && $file!="." && $file!="..")
					{	
						//目录
						$this->do_generate($dir.$file.'/',$except,$res);
					}
					else
					{
						if($file!="." && $file!="..")
						{	
							$path = $dir.$file;
							$res[substr($path, mb_strlen($this->root))] = md5_file($path);
						}
					}
				}
				closedir($dh);
			}
		}


	}

	private function validate_noexists_writable($file){
		$file = str_replace("\\", "/", $file);
		$file = str_replace($this->root, "", $file);
		$arr = explode("/", $file);
		$writeable = 0;
		$temp;
		foreach ($arr as $v) {
			if ($this->is_writable($this->root.$temp.$v)==0) {
				$writeable = 0;
				break;
			}
			$temp.=$v.'/';
			$writeable = 1;
		}
		return $writeable;
	}

	private function is_writable($file){
		if (is_dir($file)){
		       $dir = $file;
		       if ($fp = @fopen("$dir/test.txt", 'w')) {
		           @fclose($fp);
		           @unlink("$dir/test.txt");
		           $writeable = 1;
		       } else {
		           $writeable = 0;
		       }
		   } else {
		   		if(!file_exists($file)){
		   			$writeable = 1;
		   		}else{
			       if ($fp = @fopen($file, 'a+')) {
			           @fclose($fp);
			           $writeable = 1;
			       } else {
			           $writeable = 0;
			       }
		  	 }
		   }
		
		   return $writeable;
		}



}






?>