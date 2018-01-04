<?php
$plugins['comment'] = array (
  'plugin_name' => '微信评论',
  'enable' => 1,
  'edit_container' => 'option_group',
  'edit_sort' => 1,
  'view_container' => 'right_bottom',
  'view_sort' => 5,
  'view_resource' => 1,
  'xml' => 'plugin.xml',
  'brief' => '微信登录对场景指定位置发表说一说',
  "table"=>"pano_config",
  "column"=>"comment",
) 
?>