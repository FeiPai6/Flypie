<?php
require_once 'smarty.class.php';
$tp = new Smarty;
$tp->template_dir = ROOT_PATH.'template';
$tp->compile_dir = ROOT_PATH.'temp/compile';   //编译文件
$tp->caching = false ;   //是否启用缓存
$tp->caching_dir = ROOT_PATH.'temp/cache';   //缓存
$tp->cache_lifetime = 600;   //默认缓存时间为10分钟
$tp->left_delimiter = '{';
$tp->right_delimiter = '}';
?>