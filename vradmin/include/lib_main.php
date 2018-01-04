<?php
/*
 *  管理后台常用方法
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: lib_main.php 28028 2016-02-19Z  $
*/
if(!defined('IN_T')) 
{
 die('禁止访问！');
}

//提取所有用户组
//@param $name: 是否返回level_id=>level_name的一维数组
function get_user_levels($name=false){
	$sql = "select * from ".$GLOBALS['Base']->table('user_level')." ";
	$levels = $GLOBALS['Db']->query($sql,"All");
	if($name){
		foreach($levels as $v){
			$res[$v['id']] = $v['level_name'];
		}
		return $res;
	}
	return $levels;
}

//提取文章分类
function get_article_cats($parent=false){
	$sql = "select * from ".$GLOBALS['Base']->table("article_cat")." where  parent_id=0 ";
	$sql .= "order by sort asc";
	$res = $GLOBALS['Db']->query($sql);

	if($parent){	
		return $res;
	}
	foreach($res as $k=>$v){
		$res[$k]['sub'] = $GLOBALS['Db']->query("select * from ".$GLOBALS['Base']->table("article_cat")." where parent_id=".$v['id']."");
	}
	return $res;
}
?>