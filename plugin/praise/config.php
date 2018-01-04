<?php
/*
 *  点赞插件
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: bind.php 28028 2016-06-19Z  $
*/

$plugins['praise'] = array(
		'plugin_name' => '隐藏点赞',
		"enable" => 1,    			
		"edit_container" => "option_group",
		"edit_sort" => 8,
		"view_container" => "right_bottom",
		"view_sort" => 4,
		"table"=>"worksmain",
  		"column"=>"hidepraise_flag"
	);


?>