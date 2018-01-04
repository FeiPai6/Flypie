-- phpMyAdmin SQL Dump
-- version 3.4.8
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2017 年 01 月 10 日 05:48
-- 服务器版本: 5.5.53
-- PHP 版本: 5.4.45

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `yuntest`
--

-- --------------------------------------------------------

--
-- 表的结构 `u_admin`
--

CREATE TABLE IF NOT EXISTS `u_admin` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(16) NOT NULL DEFAULT '',
  `passwd` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `u_admin`
--

INSERT INTO `u_admin` (`id`, `admin_name`, `passwd`) VALUES
(1, 'admin', '0c909a141f1f2c0a1cb602b0b2d7d050');

-- --------------------------------------------------------

--
-- 表的结构 `u_article`
--

CREATE TABLE IF NOT EXISTS `u_article` (
  `id` smallint(6) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL DEFAULT '' COMMENT '标题',
  `cat_id` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '分类id，为0则是单页面',
  `keywords` varchar(255) NOT NULL DEFAULT '' COMMENT '关键词',
  `content` text NOT NULL COMMENT '正文',
  `is_nav` varchar(32) NOT NULL DEFAULT '' COMMENT '是否导航，左下导航为：left_bottom',
  `sort` smallint(6) unsigned NOT NULL DEFAULT '199' COMMENT '排序规则，越小越靠前',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_article_cat`
--

CREATE TABLE IF NOT EXISTS `u_article_cat` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(32) NOT NULL DEFAULT '' COMMENT '分类名称',
  `parent_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `sort` smallint(5) unsigned NOT NULL DEFAULT '29' COMMENT '排序规则，越小越靠前',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_atlasmain`
--

CREATE TABLE IF NOT EXISTS `u_atlasmain` (
  `pk_atlas_main` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pk_user_main` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `create_time` datetime NOT NULL,
  `atlas_type` tinyint(1) NOT NULL COMMENT '图册类型  0 默认图册  1 用户自己创建',
  PRIMARY KEY (`pk_atlas_main`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `u_atlasmain`
--

INSERT INTO `u_atlasmain` (`pk_atlas_main`, `pk_user_main`, `name`, `create_time`, `atlas_type`) VALUES
(1, 3, '默认图册', '2017-01-10 13:44:17', 0);

-- --------------------------------------------------------

--
-- 表的结构 `u_comment`
--

CREATE TABLE IF NOT EXISTS `u_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pk_works_main` int(11) NOT NULL,
  `sname` varchar(100) NOT NULL,
  `content` varchar(255) NOT NULL,
  `head_img` varchar(255) NOT NULL,
  `ath` smallint(6) NOT NULL,
  `atv` smallint(6) NOT NULL,
  `nickname` varchar(100) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `province` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `add_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_works_wid` (`pk_works_main`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_cus_mediares`
--

CREATE TABLE IF NOT EXISTS `u_cus_mediares` (
  `pk_media_res` int(11) NOT NULL AUTO_INCREMENT,
  `media_type` tinyint(1) NOT NULL COMMENT '1音乐 0图片',
  `view_uuid` varchar(16) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `media_path` varchar(255) NOT NULL,
  `absolutelocation` varchar(255) NOT NULL,
  `media_name` varchar(100) NOT NULL,
  `pk_user_main` int(11) NOT NULL COMMENT '关联userid',
  `media_suffix` varchar(100) NOT NULL COMMENT '后缀',
  `media_size` int(11) NOT NULL COMMENT '文件大小 ',
  PRIMARY KEY (`pk_media_res`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_def_mediares`
--

CREATE TABLE IF NOT EXISTS `u_def_mediares` (
  `pk_defmedia_main` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `absolutelocation` varchar(255) NOT NULL,
  `flag_del` tinyint(1) NOT NULL COMMENT '是否删除图标 0 正常 1删除',
  `suffix` varchar(10) NOT NULL,
  `thumb_path` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL COMMENT '0 静态图标 1 动态程序循环图标 2 其他资源用的图片，例如添加电话等',
  PRIMARY KEY (`pk_defmedia_main`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_def_voice`
--

CREATE TABLE IF NOT EXISTS `u_def_voice` (
  `pk_voice` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `absolutelocation` varchar(255) NOT NULL,
  `flag_del` tinyint(1) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `name_uniqid` char(32) NOT NULL,
  PRIMARY KEY (`pk_voice`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_imgsmain`
--

CREATE TABLE IF NOT EXISTS `u_imgsmain` (
  `pk_img_main` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL COMMENT '图片路径',
  `thumb_path` varchar(255) NOT NULL,
  `view_uuid` varchar(16) NOT NULL,
  `pk_atlas_main` int(11) NOT NULL,
  `pk_user_main` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`pk_img_main`),
  KEY `imgsmain_user_pk` (`pk_user_main`),
  KEY `imgsmain_atlas_pk` (`pk_atlas_main`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_imgs_works`
--

CREATE TABLE IF NOT EXISTS `u_imgs_works` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pk_img_main` int(11) NOT NULL,
  `pk_works_main` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `uiw_img_id` (`pk_img_main`),
  KEY `uiw_works_id` (`pk_works_main`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_object_around`
--

CREATE TABLE IF NOT EXISTS `u_object_around` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imgs` text NOT NULL,
  `name` varchar(100) NOT NULL,
  `view_num` int(11) NOT NULL DEFAULT '0',
  `pk_user_main` int(11) NOT NULL,
  `thumb_path` varchar(200) NOT NULL,
  `create_time` datetime NOT NULL,
  `flag_publish` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否公开作品 1 公开 0 不公开',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_pano_atlas`
--

CREATE TABLE IF NOT EXISTS `u_pano_atlas` (
  `pk_atlas_main` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `pk_user_main` int(11) NOT NULL,
  PRIMARY KEY (`pk_atlas_main`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_pano_config`
--

CREATE TABLE IF NOT EXISTS `u_pano_config` (
  `pk_pano_config` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pk_works_main` int(11) NOT NULL,
  `open_alert` text NOT NULL,
  `bg_music` text NOT NULL,
  `sky_land_shade` text NOT NULL,
  `footmark` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `tour_guide` text NOT NULL,
  `url_phone_nvg` text NOT NULL,
  `speech_explain` text NOT NULL,
  `angle_of_view` text NOT NULL,
  `special_effects` text NOT NULL,
  `littleplanet` tinyint(1) NOT NULL DEFAULT '0',
  `gyro` tinyint(1) NOT NULL DEFAULT '0',
  `sand_table` text NOT NULL,
  `custom_logo` text NOT NULL,
  `scene_group` text NOT NULL,
  `scenechoose` tinyint(1) NOT NULL DEFAULT '1',
  `comment` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `hotspot` text NOT NULL,
  `autorotate` tinyint(1) NOT NULL DEFAULT '1',
  `loading_img` text NOT NULL,
  `custom_right_button` text NOT NULL COMMENT '自定义右键菜单',
  PRIMARY KEY (`pk_pano_config`),
  KEY `pano_config_works_wid` (`pk_works_main`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_project_download`
--

CREATE TABLE IF NOT EXISTS `u_project_download` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `uid` mediumint(8) unsigned NOT NULL COMMENT '关联用户id',
  `pid` mediumint(8) unsigned NOT NULL COMMENT '关联项目id',
  `pname` varchar(255) NOT NULL COMMENT '项目名',
  `thumb` varchar(255) NOT NULL COMMENT '缩略图',
  `folder` varchar(100) NOT NULL DEFAULT '' COMMENT '临时文件夹名,压缩包名称',
  `step` smallint(2) NOT NULL DEFAULT '0' COMMENT '步骤',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 等待执行 1执行中 2执行完成 -1 出现异常',
  `msg` varchar(100) DEFAULT '' COMMENT '当前步骤对应信息',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生成时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_site_config`
--

CREATE TABLE IF NOT EXISTS `u_site_config` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` varchar(32) NOT NULL DEFAULT '' COMMENT '父级id，配置信息为一维数组时',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '配置项',
  `value` varchar(255) NOT NULL DEFAULT '' COMMENT '配置内容',
  PRIMARY KEY (`id`),
  UNIQUE KEY `parent_id` (`parent_id`,`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='站点配置表' AUTO_INCREMENT=1810 ;

--
-- 转存表中的数据 `u_site_config`
--

INSERT INTO `u_site_config` (`id`, `parent_id`, `name`, `value`) VALUES
(1796, '', 'global_storage', 'qiniu'),
(1797, '', 'qiniu', 'enable'),
(1798, '', 'oss', 'disable'),
(1799, '', 'local', 'disable'),
(1801, 'qiniu', 'accessKey', 'HOy1LfS6AvUjaNTWXTZaU-u5Zq5u-VHUy61iP2bdQ'),
(1802, 'qiniu', 'secretKey', 'Woy4f91_4UNInKvJLbLI-HSsWBxONcllgFOjhEYav'),
(1803, 'qiniu', 'bucket', 'demo'),
(1804, 'qiniu', 'cdn_host', 'yunfx.xikuu.com'),
(1805, 'oss', 'internal', '0'),
(1806, 'oss', 'access_id', ''),
(1807, 'oss', 'access_secret', ''),
(1808, 'oss', 'bucket', ''),
(1809, 'oss', 'cdn_host', ''),
(1751, '', 'global_sms', 'alidayu'),
(1752, '', 'yuntongxun', 'disable'),
(1753, '', 'alidayu', 'enable'),
(1754, 'yuntongxun', 'accountSid', ''),
(1755, 'yuntongxun', 'accountToken', ''),
(1756, 'yuntongxun', 'appId', ''),
(1757, 'yuntongxun', 'templateId', ''),
(1758, 'alidayu', 'appkey', '23552799'),
(1759, 'alidayu', 'secretkey', '58f595e1fd065cc6cdda61acf87f6509'),
(1760, 'alidayu', 'freesignname', '全景网'),
(1761, 'alidayu', 'templatecode', 'SMS_32665046'),
(1800, 'qiniu', 'zone', 'zone0'),
(1776, '', 'title', '全景云平台'),
(1777, '', 'subtitle', '全景虚拟现实平台,720全景摄影,全景视频,360度全景拍摄,VR制作,全景旅游,街景地图,全景新闻,全景图片,虚拟漫游,VR视频,VR航拍'),
(1778, '', 'desciption', '360度全景摄影、VR全景视频拍摄、VR空中全景航拍、3D虚拟现实制作，全景上传、分享、展示、漫游，以及创作者互动交流、VR供需交易的综合性社区平台'),
(1779, '', 'address', '北京市东花市北里20号楼6单元501室'),
(1780, '', 'icp', '京ICP备111111111号'),
(1781, '', 'tel', 'QQ：1946897301'),
(1782, '', 'qq', '1946897301'),
(1783, '', 'rewrite', '1'),
(1784, '', 'tempclose', '0'),
(1785, '', 'closereason', ''),
(1786, '', 'wx', 'enable'),
(1787, '', 'wxweb', 'enable'),
(1788, 'wx', 'appid', '需要自己配置哦'),
(1789, 'wx', 'appsecret', '需要自己配置哦'),
(1790, 'wx', 'token', '需要自己配置哦'),
(1791, 'wxweb', 'appid', '需要自己配置哦'),
(1792, 'wxweb', 'appsecret', '需要自己配置哦'),
(1795, '', 'moban', 'default');

-- --------------------------------------------------------

--
-- 表的结构 `u_tag`
--

CREATE TABLE IF NOT EXISTS `u_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 图片标签  2 视频标签',
  `sort` smallint(5) unsigned NOT NULL DEFAULT '99' COMMENT '排序，越小越靠前',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `u_tag`
--

INSERT INTO `u_tag` (`id`, `name`, `type`, `sort`) VALUES
(1, '商业拍摄', 1, 99);

-- --------------------------------------------------------

--
-- 表的结构 `u_tag_video`
--

CREATE TABLE IF NOT EXISTS `u_tag_video` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_id` int(11) NOT NULL,
  `video_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tag_video_vid` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_tag_works`
--

CREATE TABLE IF NOT EXISTS `u_tag_works` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_id` int(11) NOT NULL,
  `works_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tag_works_wid` (`works_id`),
  KEY `tag_works_tid` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_user`
--

CREATE TABLE IF NOT EXISTS `u_user` (
  `pk_user_main` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL DEFAULT '',
  `openid` varchar(32) NOT NULL DEFAULT '',
  `nickname` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL DEFAULT '',
  `level` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '用户组',
  `limit_num` smallint(6) unsigned NOT NULL DEFAULT '0' COMMENT '可发布项目数量限制，默认为0，无限制',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `state` tinyint(1) unsigned DEFAULT '0' COMMENT '用户是否被禁用  0 正常 1禁用',
  PRIMARY KEY (`pk_user_main`),
  KEY `openid` (`openid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `u_user`
--

INSERT INTO `u_user` (`pk_user_main`, `phone`, `openid`, `nickname`, `password`, `level`, `limit_num`, `create_time`, `last_time`, `state`) VALUES
(3, '13888888888', '', '这是什么鬼', '51f55e40dc6d254807ae57cc23e191e2', 9, 65535, '2016-12-14 05:49:49', '2017-01-10 05:44:09', 0),
(4, '18000000000', '', '呵呵', '51f55e40dc6d254807ae57cc23e191e2', 9, 0, '2016-12-14 08:54:00', '2016-12-14 08:54:00', 0);

-- --------------------------------------------------------

--
-- 表的结构 `u_user_level`
--

CREATE TABLE IF NOT EXISTS `u_user_level` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '组id，1为系统默认，不可删除',
  `level_name` varchar(15) NOT NULL DEFAULT '' COMMENT '用户组名称',
  `privileges` text NOT NULL COMMENT '组权限',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户组表' AUTO_INCREMENT=10 ;

--
-- 转存表中的数据 `u_user_level`
--

INSERT INTO `u_user_level` (`id`, `level_name`, `privileges`) VALUES
(1, '注册会员', 'gyro,showvrglass'),
(8, '高级会员', 'gyro,bgmusic,comment,bgvoice,footmarker,link,showviewnum,open_alert,showvrglass,profile,praise,share,allowed_recomm'),
(9, '全权限', 'gyro,bgmusic,comment,bgvoice,footmarker,showuser,link,showlogo,shade_sky_floor,showviewnum,open_alert,showvrglass,custom_logo,custom_right_button,profile,custom_user,praise,share,allowed_recomm');

-- --------------------------------------------------------

--
-- 表的结构 `u_user_profile`
--

CREATE TABLE IF NOT EXISTS `u_user_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pk_user_main` mediumint(8) unsigned NOT NULL COMMENT '用户id',
  `avatar` varchar(255) NOT NULL COMMENT '头像路径',
  `province` varchar(15) NOT NULL,
  `city` varchar(15) NOT NULL,
  `sex` tinyint(1) unsigned NOT NULL COMMENT '1为男性，2为女性',
  PRIMARY KEY (`id`),
  KEY `pk_user_main` (`pk_user_main`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_video`
--

CREATE TABLE IF NOT EXISTS `u_video` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pk_user_main` int(11) NOT NULL,
  `vname` varchar(30) NOT NULL,
  `profile` text NOT NULL,
  `videos` text NOT NULL,
  `flag_publish` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 未发布 1发布',
  `create_time` datetime NOT NULL,
  `size` bigint(20) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 等待编辑 1 已编辑',
  `praised_num` int(11) NOT NULL DEFAULT '0',
  `browsing_num` int(11) NOT NULL DEFAULT '0',
  `thumb_path` varchar(255) NOT NULL,
  `sort` smallint(4) NOT NULL DEFAULT '999',
  `recommend` tinyint(1) NOT NULL DEFAULT '0',
  `user_sort` smallint(4) NOT NULL DEFAULT '999',
  `user_recommend` tinyint(1) NOT NULL DEFAULT '0',
  `cdn_host` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `u_worksmain`
--

CREATE TABLE IF NOT EXISTS `u_worksmain` (
  `pk_works_main` int(11) NOT NULL AUTO_INCREMENT,
  `pk_user_main` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `profile` text COMMENT '场景简介',
  `thumb_path` varchar(255) NOT NULL COMMENT '缩略图',
  `pk_atlas_main` int(11) NOT NULL COMMENT '类别',
  `view_uuid` varchar(16) NOT NULL,
  `photo_date` datetime NOT NULL,
  `privacy_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否设置为公开浏览 0 公开  1私有',
  `privacy_password` varchar(32) DEFAULT NULL COMMENT '私有密码',
  `hidelogo_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'logo隐藏',
  `hideuser_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '作者隐藏',
  `flag_publish` tinyint(1) NOT NULL DEFAULT '1',
  `browsing_num` int(11) NOT NULL DEFAULT '0' COMMENT '浏览量',
  `praised_num` int(11) NOT NULL DEFAULT '0' COMMENT '点赞',
  `hideshare_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '隐藏分享',
  `hidevrglasses_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '隐藏vr眼镜',
  `hideprofile_flag` tinyint(1) NOT NULL DEFAULT '0',
  `hidepraise_flag` tinyint(1) NOT NULL DEFAULT '0',
  `hideviewnum_flag` tinyint(1) NOT NULL,
  `create_time` datetime NOT NULL,
  `sort` smallint(4) NOT NULL DEFAULT '999' COMMENT '管理员定义的排序',
  `recommend` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否推荐 0 不推荐 1推荐',
  `user_sort` smallint(4) NOT NULL DEFAULT '999',
  `user_recommend` tinyint(1) NOT NULL DEFAULT '0',
  `flag_allowed_recomm` tinyint(1) NOT NULL DEFAULT '1',
  `cdn_host` varchar(100) NOT NULL,
  PRIMARY KEY (`pk_works_main`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 限制导出的表
--

--
-- 限制表 `u_comment`
--
ALTER TABLE `u_comment`
  ADD CONSTRAINT `comment_works_wid` FOREIGN KEY (`pk_works_main`) REFERENCES `u_worksmain` (`pk_works_main`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `u_imgs_works`
--
ALTER TABLE `u_imgs_works`
  ADD CONSTRAINT `uiw_img_id` FOREIGN KEY (`pk_img_main`) REFERENCES `u_imgsmain` (`pk_img_main`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uiw_works_id` FOREIGN KEY (`pk_works_main`) REFERENCES `u_worksmain` (`pk_works_main`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `u_pano_config`
--
ALTER TABLE `u_pano_config`
  ADD CONSTRAINT `pano_config_works_wid` FOREIGN KEY (`pk_works_main`) REFERENCES `u_worksmain` (`pk_works_main`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `u_tag_video`
--
ALTER TABLE `u_tag_video`
  ADD CONSTRAINT `tag_video_vid` FOREIGN KEY (`video_id`) REFERENCES `u_video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `u_tag_works`
--
ALTER TABLE `u_tag_works`
  ADD CONSTRAINT `tag_works_tid` FOREIGN KEY (`tag_id`) REFERENCES `u_tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tag_works_wid` FOREIGN KEY (`works_id`) REFERENCES `u_worksmain` (`pk_works_main`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
