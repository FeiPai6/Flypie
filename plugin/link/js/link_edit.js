$(function(){
	plugins_init_function.push(link_init);
	 plugins_config_get_function.push(bulid_link);
    $('#myLinkModal').on('show.zui.modal', function (e) {
        chooseMediaResCallBack = changeLinkImg;
    });
})
function link_init(){
	initUrlPhoneNvg(panoConfig.url_phone_nvg);
}
function openLink() {
    $("#myLinkModal").modal('show');
}
function initUrlPhoneNvg(data) {
    $(data.linkSettings).each(function (idx) {
        if (this.type == '1') {
            addLinkOrPhoneNumRow();
            $("#myLinkModal .modal-body .link-row:last input:eq(1)").val(this.content);
        } else {
            addMapRow();
            $("#myLinkModal .modal-body .link-row:last a.map-mark-a").data("locationData", this.content);
            $("#myLinkModal .modal-body .link-row:last a.map-mark-a").prev().text("已设置导航终点");
        }
        $("#myLinkModal .modal-body .link-row:last img").attr('src', this.imgPath);
        $("#myLinkModal .modal-body .link-row:last input:first").val(this.title);
    });
}
function addLinkOrPhoneNumRow() {
    if (hasThreeRow()) {
        $.zui.messager.show('可添加数量已达上限', {placement: 'center', type: 'warning', time: '3000', icon: 'warning-sign'});
        return;
    }
    var linkStr = '<div class="row link-row">' +
        '<div class="col-md-3 clearfix">' +
        '<img src="/static/images/skin1/iconfont-link.png">' +
        '<div class="img-right-a">' +
        '<a data-modalid="#media_icon" data-imgtype="system" data-subtype="2" href="javascript:void(0);">系统图标</a>' +
        '<a data-modalid="#media_icon" data-imgtype="custom" href="javascript:void(0);">媒体库图标</a>' +
        '</div>' +
        '</div>' +
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
    $("#myLinkModal .modal-body").append(linkStr);
}
function hasThreeRow() {
    return $("#myLinkModal .link-row").length == 3;
}
function addMapRow() {
    if (hasThreeRow()) {
        $.zui.messager.show('可添加数量已达上限', {placement: 'center', type: 'warning', time: '3000', icon: 'warning-sign'});
        return;
    }
    var mapStr = '<div class="row link-row">' +
        '<div class="col-md-3 clearfix">' +
        '<img src="/static/images/skin1/iconfont-link.png">' +
        '<div class="img-right-a">' +
        '<a data-modalid="#media_icon" data-imgtype="system" data-subtype="2" href="javascript:void(0);">系统图标</a>' +
        '<a data-modalid="#media_icon" data-imgtype="custom" href="javascript:void(0);">媒体库图标</a>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-3">' +
        '<input type="text" class="form-control" placeholder="输入名称">' +
        '</div>' +
        '<div class="col-md-4">' +
        '<span class="text-muted">未设置导航终点</span>' +
        '<a class="map-mark-a" href="javascript:void(0);" onclick="openMapModal(this)">设置</a>' +
        '</div>' +
        '<div class="col-md-2">' +
        '<button class="btn" onclick="deleteLinkRow(this)">删除</button>' +
        '</div>' +
        '</div>';
    $("#myLinkModal .modal-body").append(mapStr);
}
function linkOkClick() {
    var flag = true;
    $("#myLinkModal .link-row").each(function (idx) {
        var msg = '';
        $(this).find("input,a.map-mark-a").each(function (idx) {
            if ($(this).hasClass("map-mark-a")) {
                if (!$(this).data("locationData")) {
                    msg = '请设置导航终点';
                    flag = false;
                    return false;
                }
            } else {
                if (!$(this).val()) {
                    msg = '请填写必要信息';
                    flag = false;
                    return false;
                }
            }
        });
        if (!flag) {
            $.zui.messager.show(msg, {placement: 'center', type: 'warning', time: '3000', icon: 'warning-sign'});
            return false;
        }
    });
    if (flag) {
        $("#myLinkModal").modal("hide");
    }
}

function deleteLinkRow(el) {
    $(el).parent().parent().remove();
}

function changeLinkImg(data) {
    $(openMediaResObj).parent().prev().attr("src", data.src);
}

function bulid_link(panoConfig){
	var linkJson = {};
	linkJson.linkSettings = [];
	if ($("#myLinkModal .modal-body .link-row").length > 0) {
	    $("#myLinkModal .modal-body .link-row").each(function (idx) {
	        var linkObj = {};
	        linkObj.imgPath = $(this).find("img").attr("src");
	        linkObj.title = $(this).find("input:eq(0)").val();
	        if ($(this).find(".map-mark-a").length > 0) {
	            linkObj.type = '0';//地图标记类型
	            linkObj.content = $(this).find(".map-mark-a").data("locationData");
	        } else {
	            linkObj.type = '1';//电话或网站链接类型
	            var url = $(this).find("input:eq(1)").val();
	            linkObj.content = url;
	        }
	        linkJson.linkSettings.push(linkObj);
	    });
	    // $('.vrshow_container_3_min [data-toggle=tooltip]').tooltip({});
	}
	panoConfig.url_phone_nvg = linkJson;
}