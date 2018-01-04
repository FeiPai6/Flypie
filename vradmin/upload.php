<?php
//公用上传程序
//@author  Date. 8.23.2013
define('IN_T',true);
require 'include/init.php';;

$act = Common::sfilter($_REQUEST['act']);

/* 未登录 */
if($admin['id']<=0){
   echo $Json->encode(array('error'=>1,'message'=>'请先登录！'));
   exit;
}

/* 未上传文件 */
if(empty($_FILES))
{
   echo $Json->encode(array('error'=>1,'message'=>'非法请求！'));
   exit;
}

$old = getcwd();  //当前目录 
chdir(ROOT_PATH);  //切换到程序根目录
   
//文章详情
if($act=='article'){
	$dir_path = 'data/article/'.date('Ym',Common::gmtime());
	Common::make_dir($dir_path);
	$file_path = $dir_path.'/'.Common::gmtime().'.png';
	$data['error'] = 1;
	if(move_uploaded_file($_FILES['imgFile']['tmp_name'],$file_path)){
		$data = array('error'=>0,'url'=>'/'.$file_path);
	}
	else{
		$data['message'] = '上传失败！';
	}
}
chdir($old);
echo $Json->encode($data);
exit;
?>