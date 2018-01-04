$(function(){
	plugins_init_function.push(custom_right_init);
	plugins_config_get_function.push(bulidCustomRight);
    // $('#myLinkModal').on('show.zui.modal', function (e) {
    //     chooseMediaResCallBack = changeLinkImg;
    // });
})
function custom_right_init(){
	//initUrlPhoneNvg(panoConfig.url_phone_nvg);
    var data = panoConfig.custom_right_button;
    $(data.linkSettings).each(function (idx) {
        addCustomRightItem();
        $("#myCustomRightModal .modal-body .link-row:last input:eq(1)").val(this.content);
        $("#myCustomRightModal .modal-body .link-row:last input:first").val(this.title);
    });
}
function open_custom_right() {
    $("#myCustomRightModal").modal('show');
}

function addCustomRightItem() {
    if (c_r_hasThreeRow()) {
        $.zui.messager.show('可添加数量已达上限', {placement: 'center', type: 'warning', time: '3000', icon: 'warning-sign'});
        return;
    }
    var linkStr = '<div class="row link-row">' +
        '<div class="col-md-3">' +
        '<input type="text" class="form-control" placeholder="输入名称">' +
        '</div>' +
        '<div class="col-md-4">' +
        '<input type="text" class="form-control" placeholder="输入链接地址或电话">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<button class="btn" onclick="deleteLinkRow(this)">删除</button>' +
        '</div>' +
        '</div>';
    $("#myCustomRightModal .modal-body").append(linkStr);
}
function c_r_hasThreeRow() {
    return $("#myCustomRightModal .link-row").length == 3;
}

function customRightOkClick() {
    var flag = true;
    $("#myCustomRightModal .link-row").each(function (idx) {
        var msg = '';
        $(this).find("input,a.map-mark-a").each(function (idx) {
               if (!$(this).val()) {
                   msg = '请填写必要信息';
                   flag = false;
                   return false;
               }
        });
        if (!flag) {
            $.zui.messager.show(msg, {placement: 'center', type: 'warning', time: '3000', icon: 'warning-sign'});
            return false;
        }
    });
    if (flag) {
        $("#myCustomRightModal").modal("hide");
    }
}

function deleteCustomRightRow(el) {
    $(el).parent().parent().remove();
}

function bulidCustomRight(panoConfig){
	var customRightJson = {};
	customRightJson.linkSettings = [];
	if ($("#myCustomRightModal .modal-body .link-row").length > 0) {
	    $("#myCustomRightModal .modal-body .link-row").each(function (idx) {
	        var linkObj = {};
	        linkObj.title = $(this).find("input:eq(0)").val();
            linkObj.content = $(this).find("input:eq(1)").val();;
	        customRightJson.linkSettings.push(linkObj);
	    });
	}
	panoConfig.custom_right_button = customRightJson;
}