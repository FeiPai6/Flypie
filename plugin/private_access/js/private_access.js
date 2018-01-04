$(function(){
	//向main_edit.js 注册初始化方法
	plugins_init_function.push(privacyWord_init);
	plugins_works_get_function.push(privacyWord_get);
})
function privacyWord_init(){
	$("#privacy_password").val(worksmain.privacy_password);
}
function privacyWord_get(worksMaindata){
	var privacyWord = $.trim($("#privacy_password").val());
	var reg = /^[A-Za-z0-9]+$/;
	if (!(reg.test(privacyWord))) {
		alert_notice('请输入数字和英文');
		return;
	}
	worksMaindata.privacy_password = privacyWord;
}

function openPrivacyWordModal(){
    $("#PrivacyWordModal").modal('show');
}
function confirmPrivacyWord(){
	var privacyWord = $.trim($("#privacy_password").val());
	if(privacyWord.length > 0){
		var reg = /^[A-Za-z0-9]+$/;
		if (!(reg.test(privacyWord))) {
			alert_notice('请输入数字和英文');
			return;
		}
		if(privacyWord.length<3||privacyWord.length>20){
			alert_notice('请输入20个字符的密码');
			return;
		}
	}
	$("#PrivacyWordModal").modal('hide');
}
