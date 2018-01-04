var defaultShadeName = "系统补地";
var defaultShade = "/plugin/shade_sky_floor/images/shade_sky_floor.png";
$(function(){
	plugins_init_function.push(shade_sky_floor_init);
	plugins_config_get_function.push(bulid_shade_sky_floor);
	$('#skyModal').on('show.zui.modal', function (e) {
	    chooseMediaResCallBack = changeShadeImg;
	});
	$(".allSingle label").click(function () {
	    var k = $(this).index();
	    $(".sky_content>div").eq(k).show();
	    $(".sky_content>div").eq(k).siblings().hide();
	});
	$(document).on("click", ".label_radio .radio", function () {
	    var i = $(this).index();
	    if (i == 0) {
	        $(this).parent().parent().next().next().hide();
	    }
	    else if (i == 1) {
	        $(this).parent().parent().next().next().find("img").attr("src", defaultShade);
	        $(this).parent().parent().next().next().show();
	    }
	});
})
function openSky() {
    $("#skyModal").modal('show');
}
function shade_sky_floor_init(){
	data = panoConfig.sky_land_shade;
	$("#pics > div").each(function (idx) {
	    var htmlStr = '<div class="row" data-viewuuid="' + $(this).attr("data-viewuuid") + '">' +
	        '<div class="col-md-2" style="width:200px;">' +
	        '<div class="singImg"><img src="' + $(this).find("img").attr("src") + '"><label style="width:109px;text-overflow:ellipsis;overflow:hidden;">' + $(this).find(".card-heading span:last").text() + '</label></div>' +
	        '</div>' +
	        '<div class="label_radio">' +
	        '<div class="col-md-4">' +
	        '<div class="radio">' +
	        '<label><input type="radio" name="radioUse' + idx + '" value="0" checked> 不使用遮罩</label>' +
	        '</div>' +
	        '<div class="radio">' +
	        '<label><input type="radio" name="radioUse' + idx + '" value="1">使用系统默认全景遮罩</label>' +
	        '</div>' +
	        '</div>' +
	        '</div>' +
	        '<div class="col-md-2" style="width:150px;">' +
	        '<a data-modalid="#media_icon" data-imgtype="custom" href="javascript:void(0);" class="icon_media">从媒体库选择图片</a>' +
	        '</div>' +
	        '<div class="use_around clearfix" style="display:none">' +
	        '<div class="col-md-1" style="width:61px;padding:0">' +
	        '<img style="height:61px;width:61px" src="' + defaultShade + '">' +
	        '</div>' +
	        '<div class="col-md-3 clearfix" style="width:150px;height:61px">' +
	        '<div style="line-height:31px;text-overflow: ellipsis;overflow:hidden;height:31px" name="oneRowShadeName">' + defaultShadeName + '</div>' +
	        '<div class="radio" style="margin:0;height:30px">' +
	        '<label style="height:30px;line-height:30px"><input type="radio" name="radioLocation' + idx + '" value="0" style="height:25px;">天空</label>' +
	        '<label style="height:30px;line-height:30px"><input type="radio" name="radioLocation' + idx + '" value="1" style="height:25px;" checked>地面</label>' +
	        '</div>' +
	        '</div>' +
	        '</div>' +
	        '</div>';
	    $(".sky_content > div:eq(1)").append(htmlStr);
	});
	if (data.isWhole) {
	    $("#shadeWholeSetting").click();
	    if (data.useShade) {
	        if (data.shadeSetting.isDefault) {
	            $("#wholeDiv .label_radio .radio:last input").click();
	        } else {
	            $("#wholeDiv .use_around").show();
	            $("#wholeDiv .label_radio .radio input").prop("checked", false);
	        }
	        $("#wholeDiv .use_around img").attr("src", data.shadeSetting.imgPath);
	        $("#wholeDiv .use_around input:eq(" + data.shadeSetting.location + ")").click();
	        $("#wholeDiv .use_around label:first").text(data.shadeSetting.imgName);
	    } else {
	        $("#wholeDiv .radio input[name=radio1]:first").click();
	    }
	} else {
	    $("#shadeOneSetting").click();
	    $("#wholeDiv .radio input[name=radio1]:first").click();
	    $(data.shadeSetting).each(function (idx) {
	        var rowDiv = $("#oneDiv > div[data-viewuuid=" + this.imgUuid + "]");
	        if (this.useShade) {
	            if (this.isDefault) {
	                $(rowDiv).find(".label_radio .radio:last input").click();
	            } else {
	                $(rowDiv).find(".use_around").show();
	                $(rowDiv).find(".label_radio .radio input").prop("checked", false);
	            }
	            $(rowDiv).find(".use_around img").attr("src", this.imgPath);
	            $(rowDiv).find(".use_around input:eq(" + this.location + ")").click();
	            $(rowDiv).find(".use_around div[name=oneRowShadeName]").text(this.imgName);
	        } else {
	            $(rowDiv).find(".radio input:first").click();
	        }
	    });
	}
}

function bulid_shade_sky_floor(panoConfig){
	var shadeObj = {};
	var isWhole = ($("input[name=radioOptionsExample]:checked").val() == '0');
	shadeObj.isWhole = isWhole;
	if (isWhole) {
	    var useShade = !($("input[name=radio1]:checked").val() == '0');
	    shadeObj.useShade = useShade;
	    shadeObj.shadeSetting = {};
	    if (useShade) {
	        var isDefault = ($("input[name=radio1]:checked").val() == '1');
	        shadeObj.shadeSetting.isDefault = isDefault;
	        shadeObj.shadeSetting.imgPath = $("#wholeDiv .use_around img").attr("src");
	        shadeObj.shadeSetting.location = parseInt($("#wholeDiv .use_around input[name=radio]:checked").val());
	        shadeObj.shadeSetting.imgName = $("#wholeDiv .use_around label:first").text();
	    }
	} else {
	    shadeObj.shadeSetting = [];
	    $("#oneDiv > div").each(function (idx) {
	        var setting = {};
	        setting.useShade = !($(this).find(".radio input[name=radioUse" + idx + "]:checked").val() == '0');
	        if (setting.useShade) {
	            setting.isDefault = ($(this).find(".radio input[name=radioUse" + idx + "]:checked").val() == '1');
	            setting.imgPath = $(this).find(".use_around img").attr("src");
	            setting.location = parseInt($(this).find(".use_around input[name=radioLocation" + idx + "]:checked").val());
	            setting.imgName = $(this).find(".use_around div[name=oneRowShadeName]").text();
	            setting.imgUuid = $(this).attr("data-viewuuid");
	        }
	        shadeObj.shadeSetting.push(setting);
	    });
	}
	panoConfig.sky_land_shade = shadeObj;
}