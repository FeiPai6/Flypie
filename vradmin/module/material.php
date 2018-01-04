<?php
/*
 *  素材管理
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author: wh #qq.com $
 * $Id: index.php 28028 2016-03-09Z wh $   
*/
if(!defined('IN_T')){
   die('禁止访问！');
}
$act = Common::sfilter($_REQUEST['act']);
if ($act == 'add') {
	$tp->assign('up_url',$_lang['up_url']);
	// print_r($_lang);die;
}
else if($act == 'doAdd'){
	$params = $Json->decode($_REQUEST['params']);
	$re['status'] = 0 ;
	if (empty($params)) {
		$re['msg'] = '非法参数';
	}else{
		$data = array(
				'type' => intval($params['type']),
				'title' => Common::sfilter($params['title']),
			);
		if ($data['type']<0) {
			$re['msg'] = '请选择素材类别';
		}else if (mb_strlen($data['title'])<0||mb_strlen($data['title'])>20) {
			$re['msg'] = '请输入0到20个字符的标题';
		}else{
			$absolutelocation = Common::sfilter($params['absolutelocation']);
			if (empty($absolutelocation)) {
				$re['msg'] = '请上传素材图片';
			}else{
				$data['absolutelocation'] = $_lang['cdn_host'].$absolutelocation;
				$thumb_path = Common::sfilter($params['thumb_path']);
				$data['thumb_path'] = $_lang['cdn_host'].(empty($thumb_path)?$absolutelocation:$thumb_path);
				$data['suffix'] = substr($absolutelocation ,  strrpos($absolutelocation , "."));
				$data['flag_del'] = 0 ;
				$Db->insert($Base->table('def_mediares'),$data);
				$re['status']=1;
			}
		}
	}
	echo $Json->encode($re);
	exit;
}
else if($act == 'del'){
	$id = intval($_REQUEST['id']);
	$Db->update($Base->table('def_mediares'),array('flag_del'=>1),array('pk_defmedia_main'=>$id));
	echo $Json->encode(array('status'=>1));
	exit;
}
else{
	$size = 20;
	$page = intval($_REQUEST['page']);
	$page = $page<1 ? 1 : $page;
	$res = get_material_list($page,$size);
	$pages = Common::set_page($size,$page,$res['count']);
	foreach ($pages as $key => $value) {
		 $pages[$key]['url'] = "/".ADMIN_PATH."/?m=material&page=".$value['num'].$res['spm'];
	}
	$tp->assign("page",$page);
	$tp->assign("pages",$pages);
	$tp->assign('res',$res);
}
$tp->assign('act',$act);
$tp->assign('nav','图片素材');

function get_material_list($page=1,$pageCount=20){
   $sql = "FROM ".$GLOBALS['Base']->table('def_mediares')." WHERE flag_del = 0 ";
   $spm = '';
   
   $rescount = $GLOBALS['Db']->query("SELECT COUNT(*) AS num " .$sql,"One");
   $res = $GLOBALS['Db']->query("SELECT *  ".$sql." ORDER BY type ASC , pk_defmedia_main DESC limit ".($page-1)*$pageCount.", $pageCount");
   return array('spm'=>$spm,'count'=>$rescount,'list'=>$res);
}
?>