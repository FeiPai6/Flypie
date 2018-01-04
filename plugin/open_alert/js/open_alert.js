$(function(){
	plugins_init_function.push(open_alert_init);
	plugins_config_get_function.push(build_open_alert);
	$('#openModal').on('show.zui.modal', function (e) {
	    chooseMediaResCallBack = changeOpenAlertImg;
	});
	$("#radioOptionsExample1").click(function () {
	    toggleOpenAlertRatio(false);
	});
	$("#radioOptionsExample2").click(function () {
	    toggleOpenAlertRatio(true);
	});
})
function openOpen() {
    $("#openModal").modal('show');
}
function open_alert_init(){
	data = panoConfig.open_alert;
	if (data.useAlert=='1') {
	    if (data.isDefault='1') {
	        $("#radioOptionsExample2").prop("checked", true);
	    } else {
	        $("#radioOptionsExample1").prop("checked", false);
	        $("#radioOptionsExample2").prop("checked", false);
	        $(".prompt_choose").children("label").hide();
	    }
	    $(".prompt_choose").children("img").show();
	    $(".prompt_choose img").attr("src", data.imgPath);
	} else {
	    $("#radioOptionsExample1").prop("checked", true);
	    toggleOpenAlertRatio(false);
	}
}
function toggleOpenAlertRatio(flag) {
    if (flag) {
        $(".prompt_choose").children("img").attr("src", "/plugin/open_alert/images/openalert.png");
        $(".prompt_choose").children("img").show();
        $(".prompt_choose").children("label").show();
    } else {
        $(".prompt_choose").children("img").hide();
        $(".prompt_choose").children("label").hide();
    }
}
function changeOpenAlertImg(data) {
    $(".prompt_choose img").attr("src", data.src);
    $(".prompt_choose img").show();
    $(".prompt_choose").children("label").hide();
    $("#radioOptionsExample1").prop("checked", false);
    $("#radioOptionsExample2").prop("checked", false);
}
function build_open_alert(panoConfig){
	panoConfig.open_alert = {
        "useAlert": $("input[name=radioDefault]:checked").val() == '0'?0:1,
        "isDefault": $("input[name=radioDefault]:checked").val() == '1'?1:0,
        "imgPath": $(".prompt_choose img").attr("src")
    };
}