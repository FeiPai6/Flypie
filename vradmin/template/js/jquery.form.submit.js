/*
 * Ajax模拟form表单提交
 * @author yuanjaing And v09052014
*/

/**
 * Jquery提交表单
 *
 * @param id：form表单id，jumpDirectly：是否直接跳转
 */
function ajaxFormSubmit(id, name, jumpDirectly, wrong_text, sub_btn){
  if(wrong_text==null) wrong_text = 'wrong_text';
  if(sub_btn==null) sub_btn = 'sub_btn';
  $("#"+wrong_text).css('display','none'); 
  $("#"+sub_btn).val('正在'+name+'...');
  $('#'+sub_btn).attr('disabled',"true");
  $("#"+id).ajaxSubmit({success:function(data){ 
	 var data = json_decode(data);
	 if(data.status == 0)
	 { 
	    $("#"+wrong_text).html(data.msg);
		$("#"+wrong_text).css("display","inline-block");
		$("#"+sub_btn).val('确认'+name);
		$('#'+sub_btn).removeAttr("disabled"); 
		return;
	 }
	 if(data.status == 1)
	 { 
       	if(jumpDirectly == true) //直接跳转，不弹出提示信息
	    {
	       window.location.href = data.href;	 
	    }
		else 
		{ 
          if(data.href)  //指定跳转到某个页面
		  { 
			  $("#"+sub_btn).val(data.msg);
			  setTimeout(function(){window.location.href=data.href},1000);
		  }
          else   //本页刷新
		  {
			  $("#"+sub_btn).val(data.msg);
		      setTimeout("window.location.reload();",1000);
		  }
		}
		return;
	 }  
   }
 });		
}