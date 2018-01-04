<!DOCTYPE html>
<html lang="zh-ch">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport" />
<title>{if $title}{$title}-{$_lang.title}{else}{$_lang.title}-{$_lang.subtitle}{/if}</title>
<link rel="stylesheet" href="/static/css/zui.min.css">
<link rel="stylesheet" href="/static/css/zui-theme.css">
<script language="JavaScript" type="text/javascript" src="/static/js/jquery-1.9.1.js"></script>
<script language="JavaScript" type="text/javascript" src="/static/js/zui.js"></script>
<script language="JavaScript" type="text/javascript" src="/static/js/common.js"></script>
</head>

<body>


<div class="modal fade in" data-backdrop="static" data-keyboard="false" aria-hidden="false" style="display: block;">
    <div class="modal-dialog" style="margin-top: 68.3333px;">
        <div class="modal-content" style="min-height: 200px">
            <div class="modal-header">
                <h4 class="modal-title text-center">请输入3到20位访问密码</h4>
            </div>
            <div class="modal-body">
                <div class="row" style="margin-top:20px">
                    <div class="col-md-6 col-md-offset-3 ">
                        <input type="text" class="form-control" value="" id="pwd" placeholder="只能输入英文和数字">
                    </div>
                </div>
                <div class="row" style="margin-top:20px">
                    <div class="col-md-6 col-md-offset-3 ">
                         <a class="btn btn-block btn-primary" target="_blank" href="javascript:;" onclick="javascript:privacySubmit();">确  定</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
function privacySubmit(){
	var pwd = $.trim($("#pwd").val());
	if(pwd.length<3||pwd.length>20){
		alert_notice("请输入3到20位密码");
		return;
	}
	$.post("/tour.php",{
		'act':'privacyAccess',
		'pid':{$pid},
		'pwd':pwd
	},function(res){
		if(res.status==1){
			window.location.href = res.url;
		}else{
			alert_notice(res.msg);
		}
	},'json')
}
</script>
</body>
</html>