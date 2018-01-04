<?php
/**
 * TOP SDK 入口文件
 * 请不要修改这个文件，除非你知道怎样修改以及怎样恢复
 * @author xuteng.xt
 */

/**
 * 定义常量开始
 * 在include("TopSdk.php")之前定义这些常量，不要直接修改本文件，以利于升级覆盖
 */
/**
 * SDK工作目录
 * 存放日志，TOP缓存数据
 */
if (!defined("TOP_SDK_WORK_DIR"))
{
	define("TOP_SDK_WORK_DIR", "/tmp/");
}

/**
 * 是否处于开发模式
 * 在你自己电脑上开发程序的时候千万不要设为false，以免缓存造成你的代码修改了不生效
 * 部署到生产环境正式运营后，如果性能压力大，可以把此常量设定为false，能提高运行速度（对应的代价就是你下次升级程序时要清一下缓存）
 */
if (!defined("TOP_SDK_DEV_MODE"))
{
	define("TOP_SDK_DEV_MODE", true);
}

if (!defined("TOP_AUTOLOADER_PATH"))
{
	define("TOP_AUTOLOADER_PATH", dirname(__FILE__));
}

/**
* 注册autoLoader,此注册autoLoader只加载top文件
* 不要删除，除非你自己加载文件。
**/
require("Autoloader.php");

/**
 * 封装发送短信的方法
 *@param mobile:接收手机号
 *@param content:发送内容
*/
function sendSMS($appkey, $secretkey, $freesignname, $templatecode, $mobile, $content)
{
	//配置阿里大鱼 
    $c = new TopClient;
    $c->appkey = $appkey;
    $c->secretKey = $secretkey;
    $req = new AlibabaAliqinFcSmsNumSendRequest;
    $req->setSmsType("normal");
    $req->setSmsFreeSignName($freesignname);
    $req->setSmsParam("{\"code\":\"".$content."\"}");
    $req->setRecNum($mobile);
    $req->setSmsTemplateCode($templatecode);
    $resp = $c->execute($req);
 
    //var_dump($resp);
    if($resp->result->success)
    {
        return true;
    }
    else
    {
        return false;
    }
}