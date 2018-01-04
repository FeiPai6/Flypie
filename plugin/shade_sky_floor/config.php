<?php
/*
 *  天空地面遮罩提示插件
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author:  #qq.com $
 * $Id: bind.php 28028 2016-06-19Z  $
*/

$plugins['shade_sky_floor'] = array(
		'plugin_name' => '补天补地',
		"enable" => 1,    			
		"edit_container" => "setting_group",
		"edit_sort" => 4,
		"edit_resource"=>1,
		"view_container" => "",
		"view_sort" => 2,
		"view_resource"=>1,
		"xml"=>'plugin.xml'
	);


?>