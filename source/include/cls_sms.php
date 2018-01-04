<?php
/**
 * 云通讯短信类
 * @author  
**/
if(!defined('IN_T'))
{
   die('禁止访问！');
}

class Sms_yuntongxun{
    
	//开发者账号
	private $AccountSid;
	//开发者Token
	private $AccountToken;
	//应用id
	private $AppId;
	//短信模板id
	private $TemplateId;
	//请求地址，格式如下，不需要写https://
	//private $ServerIp='sandboxapp.cloopen.com';   //开发环境url
    private $ServerIP='app.cloopen.com';  //生产环境url
    //请求端口 
    private $ServerPort='8883';
    //REST版本号
    private $SoftVersion='2013-12-26';
	//当前时间
    private $Batch;
	
	/**
	 * 构造
	 */
	function __construct($accountsid,$accounttoken,$appid,$tempid){
	   $this->AccountSid = $accountsid; 
	   $this->AccountToken = $accounttoken;
	   $this->AppId = $appid;
	   $this->TemplateId = $tempid;
	   $this->Batch = date('YmdHis',time());
	}

	/**
	 * 发送短信
	 */ 
	public function sendMsg($to,$datas)
    {
        // 拼接请求包体
        $data="";
        for($i=0;$i<count($datas);$i++){
           $data = $data. "'".$datas[$i]."',"; 
        }
        $body= "{'to':'$to','templateId':'".$this->TemplateId."','appId':'$this->AppId','datas':[".$data."]}";
      
        // 大写的sig参数 
        $sig =  strtoupper(md5($this->AccountSid . $this->AccountToken . $this->Batch));
        // 生成请求URL        
        $url="https://$this->ServerIP:$this->ServerPort/$this->SoftVersion/Accounts/$this->AccountSid/SMS/TemplateSMS?sig=$sig";
        // 生成授权：主帐户Id + 英文冒号 + 时间戳。
        $authen = base64_encode($this->AccountSid . ":".$this->Batch);
        // 生成包头  
        $header = array("Accept:application/json","Content-Type:application/json;charset=utf-8","Authorization:$authen");
        // 发送请求
        $result = $this->curl_post($url,$body,$header);
        //print_r($result);
        $datas=json_decode($result); 
        /* 
        if($datas == FALSE){
           $datas = new stdClass();
           $datas->statusCode = '172003';
           $datas->statusMsg = '返回包体错误'; 
        }
		*/
        //重新装填数据
        if($datas->statusCode==0){
           $datas->TemplateSMS =$datas->templateSMS;
           unset($datas->templateSMS);   
        }
        return $datas; 
    } 
	
	/**
     * 发起HTTPS请求
     */
    private function curl_post($url,$data,$header,$post=1)
    {
       //初始化curl
       $ch = curl_init();
       //参数设置  
       $res= curl_setopt ($ch, CURLOPT_URL,$url);  
       curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
       curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
       curl_setopt ($ch, CURLOPT_HEADER, 0);
       curl_setopt($ch, CURLOPT_POST, $post);
       if($post)
          curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
       curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
       curl_setopt($ch,CURLOPT_HTTPHEADER,$header);
       $result = curl_exec ($ch);
       curl_close($ch);
       return $result;
    } 
}
/**
 * 应用实例
//主帐号
$accountSid= '8a48b5514e8a7522014e99d3a2cc13ad';
//主帐号Token
$accountToken= 'aaa312d1b1ea4e06bccb4d9ec9343e53';
//应用Id
$appId='8a48b5514e8a7522014e99f6eb6e140b';
$Sms_yuntongxun = new Sms_yuntongxun($accountSid,$accountToken,$appId);
print_r($Sms_yuntongxun->sendMsg('13628026066',array(273262,'注册新用户',15),27560));
*/
?>