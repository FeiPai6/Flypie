<?php
//全景视频
if(!defined('IN_T')){
	die('hacking attempt');
}


$tag = intval($_REQUEST['tag']);

$page = intval($_REQUEST['page']);
$size = intval($_REQUEST['size']);

$page = $page<1?1:$page;
$size = $size<1?24:$size;

$res = get_video_projects($tag,$page,$size);
$pages = Common::set_page($size,$page,$res['count']);
foreach ($pages as $key => $value) {
		$pages[$key]['url'] = "/videos?page=".$value['num'].$res['spm'];
}
$tp->assign("page",$page);
$tp->assign("pages",$pages);
$tp->assign("list",$res);
$tp->assign('tag',$tag);
$tp->assign('p_tags',get_video_tags());
$tp->assign('video_tag',"1");
// $tp->assign('picture_projects',get_picture_projects($tag));
// $tp->assign('p_tags',$Db->query('SELECT * FROM '.$Base->table('tag').' WHERE type =1 ORDER BY sort ASC ' ));


//提取图片标签
function get_video_tags(){
	$sql = "select * from ".$GLOBALS['Base']->table('tag')." where type=2 order by sort asc, id asc";
	$res = $GLOBALS['Db']->query($sql);
	return $res;
}

//提取图片项目
function get_video_projects($tag,$page,$size){
	$sql = "from ".$GLOBALS['Base']->table('video')." as w ";
	$spm ="";
	if($tag>0){
		$sql .= "right join (select video_id from ".$GLOBALS['Base']->table('tag_video')." where tag_id=$tag group by video_id) as t on t.video_id=w.id";
		$spm .= "&tag=$tag";
	}
	$res['count'] = $GLOBALS['Db']->query("select count(*) ".$sql,'One');
	$sql .= " order by w.recommend desc,w.sort asc limit ".($page-1)*$size.",".$size;
	$res['res'] = $GLOBALS['Db']->query("select w.vname,w.thumb_path,w.id,w.profile,w.browsing_num ".$sql);
	$res['spm'] = $spm;
	return $res;
}






?>