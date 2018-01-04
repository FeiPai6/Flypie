<?php
/*
 * 微信类：微信登录等
 * @author  9.19.2014
*/
if(!defined('IN_T'))
{
   die('禁止访问！');
}

class Weixin{
	private $appid;
	private $appsecret;
	private $token;

    //构造方法
	//实例化必要的微信参数
    function __construct($appid,$appsecret,$token){
		$this->appid = $appid;
		$this->appsecret = $appsecret;
		$this->token = $token;
	}
	
    //验证signature
	//@param $first:是否设置微信第一次访问
	//@return boolean
	public function valid($first)
    {
        $echoStr = $_GET["echostr"];
        //valid signature , option
        if($this->checkSignature()){
		    //设置微信接口时，直接输出，终止程序
			if($first){
				echo $echoStr;
				exit;
			}
			return true;
        }
		return false;
    }
	
	//微信网页登录
	//@param array('scope'=>必传,'redirect_uri'=>必传,'state'=>选传);
	//@param scope:snsapi_base,snsapi_userinfo,snsapi_login
	//@param snsapi_login为微信网页专用
	//@return state原样返回
	public function loginWeixin($param){	
		//返回了code
	    if(!empty($_GET['code'])){			
			$code = trim($_GET['code']);
			$state = trim($_GET['state']);
			$url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$this->appid.
				   "&secret=".$this->appsecret."&code=$code&grant_type=authorization_code";
			$res = Curl::callWebServer($url);
			//只取openid
			if($param['scope']=='snsapi_base'){
				$res['state'] = $state;
				return $res;
			}
			//根据openid取用户信息
			else{	
				$url = "https://api.weixin.qq.com/sns/userinfo?access_token=".$res['access_token']."&openid=".$res['openid']."&lang=zh_CN";		
				$res = Curl::callWebServer($url);
				$res['state'] = $state;
				return $res;
			}
		}
		else{
			$param['redirect_uri'] = urlencode($param['redirect_uri']);	
			//跳转到授权页面，snsapi_login为网页授权，否则为微信公众号
			//若只取openid不会显示页面
			$url = $param['scope']=="snsapi_login" ? 
			       "https://open.weixin.qq.com/connect/qrconnect?" : 
				   "https://open.weixin.qq.com/connect/oauth2/authorize?";
			$url .= "appid=".$this->appid.
			        "&redirect_uri=".$param['redirect_uri'].
					"&response_type=code&scope=".$param['scope'].
					"&state=".$param['state']."#wechat_redirect";			 
			header("Location:$url");
		}
	}
	
	//验证signature	
	//仅针对微信公众号
	private function checkSignature()
	{        
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        		
		$tmpArr = array($this->token, $timestamp, $nonce);
        // use SORT_STRING rule
		sort($tmpArr, SORT_STRING);
		$tmpStr = implode( $tmpArr );
		$tmpStr = sha1( $tmpStr );
		
		if( $tmpStr == $signature ){
			return true;
		}else{
			return false;
		}
	}
}
?>