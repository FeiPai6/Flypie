<?php
/*
 *  ucenter常用方法类
 * ============================================================================
 * 技术支持：2015-2099 
 * 
 * ----------------------------------------------------------------------------
 * $Author: liyuanzhang #qq.com $
 * $Id: config_ucenter_default.php 28028 2016-02-19Z liyuanzhang $
*/
if(!defined('IN_T')) 
{
 die('禁止访问！');
}
class UCommon{

	private $appid;
	private $appsecret;
	
	//构造方法
	//@param $appid:接口id $appsecret:接口密钥
	function __construct($appid,$appsecret){
	    $this->Db = $GLOBALS['Db'];
		$this->Base = $GLOBALS['Base'];
		$this->appid = $appid;
		$this->appsecret = $appsecret;
	}
	
	//验证signature
	public function checkSignature()
	{        
        $signature = $_GET["signature"];//客户端加密的KEY
        $timestamp = $_GET["timestamp"];//客户端的时间戳，10位整数
        $nonce = $_GET["nonce"];//客户端生成的随机数
        		
		$tmpArr = array($this->appid, $this->appsecret, $timestamp, $nonce);   //构建一个数组
        //use SORT_STRING rule
		sort($tmpArr, SORT_STRING);   //将数组每一项作为字符串，进行升序排序
		$tmpStr = implode($tmpArr);  //将数组连接为字符串
		$tmpStr = sha1($tmpStr);   //对字符串进行sha1加密
		//签名合法
		if($tmpStr == $signature){
			return true;
		}else{
            echo ERROR_CHECK_FAILURE;
            exit;
		}
	}
}
?>