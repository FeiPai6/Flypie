// JavaScript Document

/**
 * 解析json数据
 */
function json_decode(data){
   return eval('('+data+')');	
}

//全选，全不选
function setCheck(ele, chk){ 
 if(ele.checked){ 
   $("input[name='"+chk+"']").each(function(){this.checked=true;}); 
 }else{ 
   $("input[name='"+chk+"']").each(function(){this.checked=false;}); 
 } 
} 

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

document.setCookie = function(sName, sValue, sExpires)
{
  var sCookie = sName + "=" + encodeURIComponent(sValue);
  if (sExpires != null)
  {
    sCookie += "; expires=" + sExpires;
  }

  document.cookie = sCookie;
}

document.removeCookie = function(sName,sValue)
{
  document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
}