// JavaScript Document

/**
 * 解析json数据
 */
function json_decode(data){
   return eval('('+data+')');	
}

//提取cookie
document.getCookie = function(sName)
{
  // cookies are separated by semicolons
  var aCookie = document.cookie.split("; ");
  for (var i=0; i < aCookie.length; i++)
  {
    // a name/value pair (a crumb) is separated by an equal sign
    var aCrumb = aCookie[i].split("=");
    if (sName == aCrumb[0])
      return decodeURIComponent(aCrumb[1]);
  }
  // a cookie with the requested name does not exist
  return null;
}

//赋值cookie
document.setCookie = function(sName, sValue, sExpires)
{
  var sCookie = sName + "=" + encodeURIComponent(sValue);
  if (sExpires != null)
  {
    sCookie += "; expires=" + sExpires;
  }

  document.cookie = sCookie;
}

//删除cookie
document.removeCookie = function(sName,sValue)
{
  document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
}

//全选，全不选
function setCheck(ele, chk){ 
 if(ele.checked){ 
   $("input[name='"+chk+"']").each(function(){this.checked=true;}); 
 }else{ 
   $("input[name='"+chk+"']").each(function(){this.checked=false;}); 
 } 
} 
function generic_radom_str(len) {
    if (len<=0) {
      return;
    }
　　var $chars = 'abcdefghijklmnopqrstwxyz0123456789';  
　　var maxPos = $chars.length;
　　var str = '';
　　for (i = 0; i < len; i++) {
　　　　str += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return str;
}
//通用弹出提示信息
function alert_notice(msg,type,position,time){
    var msg_obj;
    if($.zui){
      msg_obj = new $.zui.Messager(msg, {
          type: type ,
          placement: position==null?'top':position,
          time:time==null?'3000':time
      });
      msg_obj.show();
    }else{
      alert(msg);
    }
    return msg_obj;
}

/**
 * Jquery提交表单
 *
 * @param id：form表单id，jumpDirectly：是否直接跳转
 */
function ajaxFormSubmit(id, sub_btn, jumpDirectly){
  if(sub_btn==null) sub_btn = 'sub_btn';
  $('#'+sub_btn).attr('disabled',"true");
  var msg_obj = alert_notice("正在提交中,请稍等....",'success','top',0);
  $("#"+id).ajaxSubmit({
  	 type:'post',
  	 success:function(data){

    if(msg_obj) msg_obj.hide();
	 var data = json_decode(data);
	 //提示错误
	 if(data.status == 0)
	 { 
		alert_notice(data.msg,'default','top');
		$('#'+sub_btn).removeAttr("disabled"); 
		return;
	 }
	 //提示正确
	 if(data.status == 1)
	 { 
       	if(jumpDirectly) //直接跳转，不弹出提示信息
	    {
	       window.location.href = data.href;	 
	    }
		else { 
           if(data.href)  //指定跳转到某个页面
		   { 
			  alert_notice(data.msg,'success','top');
			  setTimeout(function(){window.location.href=data.href},1000);
		   }
           else   //本页刷新
		   {
			  alert_notice(data.msg,'success','top');
		      setTimeout("window.location.reload();",1000);
		   }
		}
		return false;
	 }  
   }
 });		
}
function html_encode(str)
  {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\(/g, "（");
    s = s.replace(/\)/g, "）");
    s = s.replace(/,/g, "，");
    return s;
  }
function imgtext_encode(str){
     var s = "";
    if (str.length == 0) return "";
    s = str.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\(/g, "（");
    s = s.replace(/\)/g, "）");
    s = s.replace(/\,/g,"%2C");
    return s;
}
function imgtext_decode(str){
     var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&quot;/g, "\"");
     s = s.replace(/%2C/g,",");
    return s;
}