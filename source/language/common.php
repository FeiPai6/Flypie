<?php
/**
 * 语言变量
 * @author  @2.16.2013
*/
if(!defined('IN_T'))
{
   die('禁止访问！');
}
$_lang = array(
'host' => 'http://'.$_SERVER['HTTP_HOST'].'/',  //当前项目的访问host域
'qiniu_zone' => array(
                'zone0' => array('name'=>'华东1区','up_url'=>'up.qiniu.com'),
				'zone1' => array('name'=>'华北1区','up_url'=>'up-z1.qiniu.com'),
				'zone2' => array('name'=>'华南1区','up_url'=>'up-z2.qiniu.com'),
                ),
'oss_zone' => array(
                'zone0' => array('name'=>'青岛','external_url'=>'oss-cn-qingdao.aliyuncs.com','internal_url'=>'oss-cn-qingdao-internal.aliyuncs.com','location'=>'oss-cn-qingdao'),
                'zone1' => array('name'=>'北京','external_url'=>'oss-cn-beijing.aliyuncs.com','internal_url'=>'oss-cn-beijing-internal.aliyuncs.com','location'=>'oss-cn-beijing'),
                'zone2' => array('name'=>'杭州','external_url'=>'oss-cn-hangzhou.aliyuncs.com','internal_url'=>'oss-cn-hangzhou-internal.aliyuncs.com','location'=>'oss-cn-hangzhou'),
                'zone3' => array('name'=>'香港','external_url'=>'oss-cn-hongkong.aliyuncs.com','internal_url'=>'oss-cn-hongkong-internal.aliyuncs.com','location'=>'oss-cn-hongkong'),
                'zone4' => array('name'=>'华南1','external_url'=>'oss-cn-shenzhen.aliyuncs.com','internal_url'=>'oss-cn-shenzhen-internal.aliyuncs.com','location'=>'oss-cn-shenzhen'),
                'zone5' => array('name'=>'上海','external_url'=>'oss-cn-shanghai.aliyuncs.com','internal_url'=>'oss-cn-shanghai-internal.aliyuncs.com','location'=>'oss-cn-shanghai'),
                ),
'global_storage_type' => array(
                'qiniu'=>'七牛',
				'oss'=>'阿里云oss',
				'local'=>'本地',
                ),		
'global_sms_type' => array(
                'yuntongxun'=>'云通讯',
				'alidayu'=>'阿里大鱼',
                ),	
'global_wx_type' => array(
                'wx'=>'微信公众号',
				'wxweb'=>'微信网页应用',
                ),											
);
?>