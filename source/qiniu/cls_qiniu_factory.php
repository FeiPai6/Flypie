<?php
	if(!defined('IN_T'))
	{
	   die('½ûÖ¹·ÃÎÊ£¡');
	}
	require_once __DIR__ ."/../../config/config.php";
	require_once 'autoload.php';
	use Qiniu\Auth;
	use Qiniu\Storage\UploadManager;
	use Qiniu\Processing\Operation;
	use Qiniu\config;
	class Qiniu_Factory 
	{
		private static $auth;
		private static $Operation;
		public static function getAuth()
		{
			if(empty($auth)){
				$auth = new Auth($GLOBALS['_lang']['qiniu_config']['accessKey'], $GLOBALS['_lang']['qiniu_config']['secretKey']);
			}
			return $auth;
		}

		public static function getUploaManager(){
			return new UploadManager();
		}

		public static function getOperation(){
			if (empty($Operation)) {
				$Operation = new Operation($GLOBALS['_lang']['qiniu_config']['cdn_host'] ,Qiniu_Factory::getAuth());
			}
			return $Operation;
		}

		public static function getZoneUrl(){
			// $config = new Config();
			// return $config->getUpHost();	
			return 'http://'.$GLOBALS['_lang']['qiniu_config']['up_url'];
		}

	}
?>


