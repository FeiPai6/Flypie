// JavaScript Document
function sendSms(act, phone, pic_captcha){
   // var phone = $("#phone").val();
   // var captcha =$("#pic_captcha").val();
   $("#send_btn").text("正在发送...");
   $.post("/sms.php", {act: act, phone: phone, captcha: pic_captcha}, function(data){
	var data = eval("("+data+")");
	if(data.status==0){
	   alert(data.msg);
	   $("#send_btn").text("发送验证码");
	   return false;
	}
	//操作成功
	if(data.status==1){
	        var step = 59;
            $('#send_btn').text('重新发送60');
            var _res = setInterval(function()
            {   
                $("#send_btn").attr("disabled", true);//设置disabled属性
                $('#send_btn').text('重新发送'+step);
                step-=1;
                if(step <= 0){
                $("#send_btn").removeAttr("disabled"); //移除disabled属性
                $('#send_btn').text('发送验证码');
                clearInterval(_res);//清除setInterval
                }
            },1000);
	}
  }); 
}