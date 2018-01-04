$(function(){
	plugins_init_function.push(custom_user_init);
    plugins_config_get_function.push(build_custom_user);
})
function custom_user_init(){
	data = panoConfig.custom_logo;
	if(data && data.user){
	    $('#userModal .modal-body input[name="user"]').val(data.user);
	    $('#userModal .modal-body button:last').show();
	}
}
function openUserModal(){
    $("#userModal").modal('show');
}
function changeLogoImg(data) {
    $(openMediaResObj).parent().prev().find('img').attr("src", data.src);
    $(openMediaResObj).parent().prev().find('img').data("usecustomlogo", true);
    $('#userModal .modal-body button:last').show();
}

function build_custom_user(panoConfig){
	var logoObj ;
	if(panoConfig.custom_logo)
		logoObj = panoConfig.custom_logo;
	else 
		logoObj = {};
	var user = $('#userModal .modal-body input[name="user"]').val();
	logoObj.user = user;
	panoConfig.custom_logo = logoObj;
}