<?php
/*
 * 局部缓存函数
 * 基于此函数，直接在前台使用{nocache}{/nocache}就能实现局部缓存
 * 无须在后台页面执行register_block
 * author  @2.21.2013
*/
function smarty_block_nocache($param,$content,$smarty)
{
   return $content; 
}  
?>
