$(function(){
	plugins_init_function.push(custom_log_init);
    plugins_config_get_function.push(build_custom_logo);
    $('#logoModal').on('show.zui.modal', function (e) {
        chooseMediaResCallBack = changeLogoImg;
    });
})
function custom_log_init(){
	data = panoConfig.custom_logo;
	if(data){
		if (data.useCustomLogo=='1') {
			$('#logoModal .modal-body img').attr('src',data.logoImgPath);
	    	$('#logoModal .modal-body img').data('usecustomlogo',data.useCustomLogo);
	    	$('#logoModal .modal-body button:last').show();
		}
	    if(data.logoLink)
	    	$('#logoModal .modal-body input[name="logolink"]').val(data.logoLink);
	    
	}
}
function openLogo(){
    $("#logoModal").modal('show');
}
function changeLogoImg(data) {
    $(openMediaResObj).parent().prev().find('img').attr("src", data.src);
    $(openMediaResObj).parent().prev().find('img').data("usecustomlogo", 1);
    $('#logoModal .modal-body button:last').show();
}
function removeLogoImg(){
    $('#logoModal .modal-body img').attr('src','/plugin/custom_logo/images/custom_logo.png');
    $('#logoModal .modal-body img').data('usecustomlogo',0);
    $('#logoModal .modal-body input.form-control').val('');
    $('#logoModal .modal-body button:last').hide();
}
function build_custom_logo(panoConfig){
	var logoObj ;
	if(panoConfig.custom_logo)
		logoObj = panoConfig.custom_logo;
	else 
		logoObj = {};
	var usecustomlogo = $('#logoModal .modal-body img').data('usecustomlogo');
	logoObj.useCustomLogo = usecustomlogo ? 1 : 0;
	logoObj.logoImgPath = $('#logoModal .modal-body img').attr('src');
	var link = $('#logoModal .modal-body input[name="logolink"]').val();
	if(link){
		if(link.indexOf('http://') != 0||link.indexOf('https://') != 0){
			link = 'http://' + link;
		}
	    //link = 'http://' + link;
	    logoObj.logoLink = link;
	}
	panoConfig.custom_logo = logoObj;
}