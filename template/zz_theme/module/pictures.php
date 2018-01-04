<?php
//全景摄影
if(!defined('IN_T')){
	die('hacking attempt');
}

$tag = intval($_REQUEST['tag']);

$page = intval($_REQUEST['page']);
$size = intval($_REQUEST['size']);

$page = $page<1?1:$page;
$size = $size<1?24:$size;

$res = get_picture_projects($tag,$page,$size);
$pages = Common::set_page($size,$page,$res['count']);
foreach ($pages as $key => $value) {
		$pages[$key]['url'] = "/pictures?page=".$value['num'].$res['spm'];
}
$tp->assign("page",$page);
$tp->assign("pages",$pages);
$tp->assign("list",$res);
$tp->assign('tag',$tag);
$tp->assign('p_tags',get_picture_tags());

// $tp->assign('picture_projects',get_picture_projects($tag));
// $tp->assign('p_tags',$Db->query('SELECT * FROM '.$Base->table('tag').' WHERE type =1 ORDER BY sort ASC ' ));


//提取图片标签
function get_picture_tags(){
	$sql = "select * from ".$GLOBALS['Base']->table('tag')." where type=1 order by sort asc, id asc";
	$res = $GLOBALS['Db']->query($sql);
	return $res;
}

//提取图片项目
function get_picture_projects($tag,$page,$size){
	$sql = "from ".$GLOBALS['Base']->table('worksmain')." as w ";
	$spm ="";
	if($tag>0){
		$sql .= "right join (select works_id from ".$GLOBALS['Base']->table('tag_works')." where tag_id=$tag group by works_id) as t on t.works_id=w.pk_works_main ";
		$spm .= "&tag=$tag";
	}
	$res['count'] = $GLOBALS['Db']->query("select count(*) ".$sql,'One');
	$sql .= "order by w.recommend desc,w.sort asc limit ".($page-1)*$size.",".$size;
	$res['res'] = $GLOBALS['Db']->query("select w.name,w.thumb_path,w.view_uuid,w.profile,w.browsing_num ".$sql);
	$res['spm'] = $spm;
	return $res;
}
?>