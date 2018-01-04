<?php
/*
 * 基础类函数
 * author  @2.16.2013
*/
if(!defined('IN_T'))
{
  die('禁止访问！');
}
 
class Common{

/*
 * 去除字符串中的非法字符，sql注入等
 * @param $char：要过滤的字符串
 * @param $type：字符串类型，string(default)、 html
 * @return string
 */
 public static function sfilter($char,$type='string'){
      if($char===null || $char===false){
	     return "";
	  }
      $char = trim($char);   //去掉两边空格
	  //字符串
	  if($type=='string'){
		  $char = urldecode($char);   //url解码：Get方式传递的值有的浏览器会自动urlencode()
		  $char = strip_tags($char);  //去掉字符串中的HTML、XML、PHP标签
		  $char =  htmlspecialchars($char);    //预定义的字符转换为HTML:',",&,>,<
		  $char = addslashes($char);   //为预定义字符添加反斜杠:',",\,NULL
	  }
	  //html
	  else if($type=='html'){
	  	$char = preg_replace("(\\\\+')","'",$char);  //连续反斜杠加单引号，处理为单引号
  		$char = str_replace("'","\'",$char);  //单引号添加反斜杠
      $char = str_replace('"',"&quot;",$char);  //单引号添加反斜杠
  		$char = str_replace("<?","&lt;?",$char);  //转义php的声明符
  		$char = str_replace("?>","?&gt;",$char); 
  		$char = str_replace("<script","&lt;script",$char);  //转义script声明符
  		$char = str_replace("</script>","&lt;/script&gt;",$char); 
      // $char = preg_replace('/\r|\n|\t/', '', $char);
	  }else if($type == 'json'){
      
    }
	  return $char;
 }  

 /**
 * 自定义 header 函数，用于过滤可能出现的安全隐患
 * @param   string  string  内容
 * @return  void
 **/
 public static function base_header($string, $replace = true, $http_response_code = 0)
 {
    $string = str_replace(array("\r", "\n"), array('', ''), $string);
    if (preg_match('/^\s*location:/is', $string))
    {
        @header($string . "\n", $replace);
        exit();
    }
    if (empty($http_response_code) || PHP_VERSION < '4.3')
    {
        @header($string, $replace);
    }
    else
    {
        @header($string, $replace, $http_response_code);
    }
 }

 /* 加密函数 
  * 所有加密均用这个接口，以便修改
 */
 public static function encrypt($char)
 {
    return md5(md5($char)); 
 }


 /**
  * 获得当前格林威治时间的时间戳
  * @return  integer
  */
 public static function gmtime($date=0)
 {
    if($date > 0){
	   $today = strtotime(date('Ymd'));
	   return $today - ($date-1)*24*60*60;
	}
    //return (time() - date('Z'));
	return time();
 }

 /*
 * 从html中提取图片整合到数组
 @ param string $str
 @ return array
 */
 static function get_pics_from_html($str)
 {
    $pattern="/<[img|IMG].*?src=[\'|\"](.*?(?:[\.gif|\.png|\.jpg]))[\'|\"].*?[\/]?>/";    // 正则式
    preg_match_all($pattern,$str,$match);  
    return $match[1];    // 返回只带有图片路径的一维数组
 }

 /*
  * get
  * get方式请求资源 
  * @param string $url       基于的baseUrl
  * @return string           返回的资源内容
 */
 public static function file_get($url)
 {
   if(function_exists('file_get_contents'))
   {  
       $response = file_get_contents($url);
   }
   else
   {
       $ch = curl_init();
       $timeout = 5;
       curl_setopt ($ch, CURLOPT_URL, $url);
       curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
       curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
       $response = curl_exec($ch);
       curl_close($ch);
   }
   return $response;
 }
 
 /**
   * post
   * post方式请求资源
   * @param string $url       基于的baseUrl
   * @param array $keysArr    请求的参数列表
   * @param int $flag         标志位
   * @return string           返回的资源内容
 */
 public static function file_post($url, $keysArr, $flag = 0)
 {
     $ch = curl_init();
     if(! $flag) curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); 
     curl_setopt($ch, CURLOPT_POST, TRUE); 
     curl_setopt($ch, CURLOPT_POSTFIELDS, $keysArr); 
     curl_setopt($ch, CURLOPT_URL, $url);
     $ret = curl_exec($ch);

     curl_close($ch);
     return $ret;
 }

 /*
 * 验证输入的网址
 * @param string  $url:要匹配的网址
 * @param string $base:模型网址，如taobao.com，jd.com 
 * @return bool
 */
 public static function is_url($url,$base)
 {
    //将网址转换为小写
    if(!empty($base)){
	   $base = strtolower($base);
	}
	//淘宝和天猫，共享域名
	if($base=='taobao.com' || $base=='tmall.com'){
	   $base = "(taobao.com)|(tmall.com)";
	}
    $chars = "/((^http)|(^https)):\/\/(\S)+($base)(\S)+/";   //http(https)://***$base***
	if (preg_match($chars, $url))
	{
		return true;
	}
	return false;
 }
 
 /*
 * 验证手机号格式
 * @param String mobile
 * @return bool
 */
 public static function is_mobile($mobile)
 {
   if(preg_match("/^13[0-9]{9}$|^15[0-9]{9}$|^18[0-9]{9}$|^17[0-9]{9}$|^147[0-9]{8}$/",$mobile)) 
   {
      return true;
   }
   return false;
 }
 
 /**
  * 验证qq号是否正确 
  * @5-10位数字
  */
 public static function is_qq($qq){
   if(preg_match("/^[0-9]{5,10}$/",$qq))
   {
      return true;
   }
   return false;
 }  
 
 /*
  * 2到20位字符串：只能包括字母、数字、汉字、下划线，且下划线不能开头和结尾
  * @汉字的正则式为(包括全角符号)：\x80-\xff
 */
 public static function is_username($username)
 {
   //不能多于16个字符
   if(mb_strlen($username)>=30){
      return false;
   }
   if(preg_match("/^[a-zA-Z0-9\x80-\xff]{1}[\_a-zA-Z0-9\x80-\xff]*[a-zA-Z0-9\x80-\xff]{1}$/",$username))
   {
      return true;
   }
   return false;
 }

 /*
  * 检查email是否符合规范
  * param char
 */
 public static function is_email($email)
 {
   if(preg_match("/^[0-9a-zA-Z]+(?:[\_\-.][a-z0-9\-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+$/i", $email))
   {
      return true;
   }
   return false;
 }

 /*
  * 设置分页
  * @param pageNum：每页显示数，pageNow：当前页，allNum：总条数
 */
 public static function set_page($pageNum=20,$pageNow=1,$allNum)
 {
   $pages = ceil($allNum/$pageNum);   // 总页数 
   
   $GLOBALS['tp']->assign('allNum',$allNum);
   $GLOBALS['tp']->assign('allPages',$pages);
   
   $arr = array();   //用于返回的数组
   if($pageNow>$pages || $pageNow<1 || $pages==1)  // 当前页大于所有页 or 当前页小于1 or 总共只有一页
   {  
      return $arr; 
   }
   if($pageNow>1)  // 首页
   {
      $arr[] = array('num'=>1,'name'=>'首页');
      $arr[] = array('num'=>$pageNow-1,'name'=>'«上一页');
   }
   
   //前3条
   for($i=$pageNow-3;$i<$pageNow;$i++)
   {
      if($i>=1)
	  {
	     $arr[] = array('num'=>$i,'name'=>$i);
	  }
   }
   
   //当前
   $arr[] = array('num'=>$pageNow,'name'=>$pageNow);
   
   //后3条
   $next = $pageNow<4 ? 7 : $pageNow+3 ;
   for($i=$pageNow+1; $i<=$next; $i++)
   {
      if($i<=$pages)
	  {
	     $arr[] = array('num'=>$i,'name'=>$i);
	  }
   }
   if($pageNow<$pages)
   {
      $arr[] = array('num'=>$pageNow+1,'name'=>'下一页»');
      $arr[] = array('num'=>$pages,'name'=>'末页');
   }   
   return $arr;
 }

/* 生成6位随机数 */
public static function get_rand_number()
{
   /* 选择一个随机的方案 */
   mt_srand((double) microtime() * 1000000);
   return  str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
}

/**
 * 生成订单号：2015010112345
 * @return  string
 */
function get_order_sn()
{
    /* 选择一个随机的方案 */
    mt_srand((double) microtime() * 1000000);

    return date('Ymd',self::gmtime()) . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
}

/**
 * 获取客户端IP地址
 * @param integer $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
 * @param boolean $adv 是否进行高级模式获取（有可能被伪装） 
 * @return mixed
 */
public static function get_client_ip($type = 0,$adv=false) {
    $type       =  $type ? 1 : 0;
    static $ip  =   NULL;
    if ($ip !== NULL) return $ip[$type];
    if($adv){
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $arr    =   explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $pos    =   array_search('unknown',$arr);
            if(false !== $pos) unset($arr[$pos]);
            $ip     =   trim($arr[0]);
        }elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $ip     =   $_SERVER['HTTP_CLIENT_IP'];
        }elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip     =   $_SERVER['REMOTE_ADDR'];
        }
    }elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ip     =   $_SERVER['REMOTE_ADDR'];
    }
    //IP地址合法验证
    $long = sprintf("%u",ip2long($ip));
    $ip   = $long ? array($ip, $long) : array('0.0.0.0', 0);
    return $ip[$type];
}

/* 
 * 淘宝ip地址库获取地址
*/
public static function get_ip_address_taobao($ip)
{
    $server_api = 'http://ip.taobao.com/service/getIpInfo.php?ip=';
    $uri = $server_api.$ip;
    $json_string = self::file_get($uri);
    $array = json_decode($json_string, true);
    $ret = array();
    if($array['code'])
    {
        $ret = array(
            'country' => '未知',
            'city' => '未知',
            'isp' => '未知'
        );
    }
    else
    {
        $ret['region'] = $array['data']['region'] ? $array['data']['region'] : '未知';   //江苏省
        $ret['city'] = $array['data']['city'] ? $array['data']['city'] : '未知';         //徐州市
    }
	return $ret['region'].' '.$ret['city'];
}

/* 
 * 新浪ip地址库获取地址
*/
public static function get_ip_address_sina($ip)
{
    $server_api = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
    $uri = $server_api.$ip;
    $json_string = self::file_get($uri);
    $re = json_decode($json_string); 
    return $re->province.' '.$re->city;
}

/*
 * 替换字符串中间字符为*
 * @param int start:保留开始几位；int end：保留结束几位；int middle：替换中间几位
 * @return String
 */
public static function hide_middle($str,$start=1,$end=1,$middle){
   $length = mb_strlen($str,'utf8');
   $replace = "*******************************************";   //用于替换
   $total = $start + $end;
   if($length<=$total){
      return $str;
   }
   //未设置中间保留或强制替换的中间位数大于实际值
   if(!$middle || $middle>$length-$total){
      $middle = $length-$total;
   }
   return mb_substr($str,0,$start,'utf8').substr($replace,0,$middle).mb_substr($str,-$end,$end,'utf8');
}

 /**
  * 格式化时间为：X秒前(后)，X分钟前(后)，X小时前(后)，X天前(后)
  * @param int 
 */
 public static function simple_time($time){
    $now = self::gmtime();   //当前时间 
    $value = $now - $time;
	$dvalue = abs($value);
	if($dvalue<60){
	   $r = $dvalue.'秒';
	}
	else if($dvalue<3600){
	   $r = ceil($dvalue/60).'分钟';
	}
	else if($dvalue<3600*24){
	   $r = ceil($dvalue/3600).'小时';
	}
	else if($dvalue<3600*24*30){
	   $r = ceil($dvalue/(3600*24)).'天';
	}
	else{
	   $r = '30天';
	}
	return $r.($value>0?'前':'后');
 }
 
 /**
  * 获取当前php文件名
 */
 public static function php_self(){
    $php_self = substr($_SERVER['PHP_SELF'],strrpos($_SERVER['PHP_SELF'],'/')+1);
    return $php_self;
 }
 
 /**
 * 重写unserialize()函数
 */
 public static function _unserialize($string)
 {
	return unserialize(preg_replace('!s:(\d+):"(.*?)";!se', '"s:".strlen("$2").":\"$2\";"', $string));
 }
 
 /**
  * 判断当前设备是否是移动设备
  */
 public static function is_mobile_visit()
 { 
    //如果有HTTP_X_WAP_PROFILE则一定是移动设备
    if(isset($_SERVER['HTTP_X_WAP_PROFILE']))
    {
        return true;
    } 
    //如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
    if(isset($_SERVER['HTTP_VIA']))
    { 
        //找不到为flase,否则为true
        return stristr($_SERVER['HTTP_VIA'], "wap") ? true : false;
    } 
    //脑残法，判断手机发送的客户端标志,兼容性有待提高
    if(isset($_SERVER['HTTP_USER_AGENT']))
    {
        $clientkeywords = array(
								'nokia',
								'sony',
								'ericsson',
								'mot',
								'samsung',
								'htc',
								'sgh',
								'lg',
								'sharp',
								'sie-',
								'philips',
								'panasonic',
								'alcatel',
								'lenovo',
								'iphone',
								'ipod',
								'blackberry',
								'meizu',
								'android',
								'netfront',
								'symbian',
								'ucweb',
								'windowsce',
								'palm',
								'operamini',
								'operamobi',
								'openwave',
								'nexusone',
								'cldc',
								'midp',
								'wap',
								'mobile'
                               ); 
        //从HTTP_USER_AGENT中查找手机浏览器的关键字
        if(preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT'])))
        {
            return true;
        } 
    } 
    //协议法，因为有可能不准确，放到最后判断
    if(isset($_SERVER['HTTP_ACCEPT']))
    { 
        // 如果只支持wml并且不支持html那一定是移动设备
        // 如果支持wml和html但是wml在html之前则是移动设备
        if((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html'))))
        {
            return true;
        } 
    } 
    return false;
 } 
 
 /*
 * 检查目标文件夹是否存在，如果不存在则自动创建该目录
 * @param       string      folder     目录路径。不能使用相对于网站根目录的URL
 */
 public static function make_dir($folder)
 {   
    $reval = false;
    if (!file_exists($folder))
    {
        /* 如果目录不存在则尝试创建该目录 */
        @umask(0);
        /* 将目录路径拆分成数组 */
        preg_match_all('/([^\/]*)\/?/i', $folder, $atmp);
        /* 如果第一个字符为/则当作物理路径处理 */
        $base = ($atmp[0][0] == '/') ? '/' : '';
        /* 遍历包含路径信息的数组 */
        foreach ($atmp[1] AS $val)
        {
            if ('' != $val)
            {
                $base .= $val;
                if ('..' == $val || '.' == $val)
                {
                    /* 如果目录为.或者..则直接补/继续下一个循环 */
                    $base .= '/';
                    continue;
                }
            }
            else
            {
                continue;
            }
            $base .= '/';
            if (!file_exists($base))
            {
                /* 尝试创建目录，如果创建失败则继续循环 */
                if (@mkdir(rtrim($base, '/'), 0777))
                {
                    @chmod($base, 0777);
                    $reval = true;
                }
            }
        }
    }
    else
    {
        /* 路径已经存在。返回该路径是不是一个目录 */
        $reval = is_dir($folder);
    }
    clearstatcache();
    return $reval;
 }
 
 /*
  * 获取32/16位uuid
 */
 public static  function guid($length = 32){
     mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
     $charid = strtolower(md5(uniqid(rand(), true)));
     if($length == 16)
     	$charid = substr($charid,8,16);
     return $charid;
 }
 
}
?>