var qn_token ={} ; 
var params ={};
var obj_token = {};
var obj_params={};
$(function(){
	$("#pic_chosen").chosen({
		 no_results_text: "没有找到",
		max_selected_options:3,
		width:"100%"
	});
	$('.update_div').on('shown.zui.tab', function(e) {
		$(".chosen-select").chosen({
			 no_results_text: "没有找到",
			 max_selected_options:3,
			 width:"100%"
		});
	});
	
	$("#imgUpload").fileinput({
	    language: 'zh',
	    showUpload: false,
	    showRemove: false,
	    showCancel: false,
	    showUploadedThumbs:false,
	    maxFileCount: 30,
	    previewFileType: "image",
	    allowedFileExtensions: ["jpg","tif", "tiff"],
	    msgInvalidFileExtension: '不支持文件类型"{name}"。只支持扩展名为"{extensions}"的文件。',
	    browseClass: "btn btn-primary",
	    browseLabel: "选择本地全景图片",
	    browseIcon: "<i class=\"icon icon-picture\"></i> ",
	    removeClass: "btn btn-danger",
	    removeLabel: "删除",
	    removeIcon: "<i class=\"icon icon-trash\"></i> ",
	    uploadUrl: up_url,
	    uploadAsync: true,
	    previewSettings: {
	        image: {width: "auto", height: "100px"}
	    },
	    fileActionSettings: {},
	    dropZoneTitle: "拖拽一组/单幅图片或点击下面按钮上传",
	    textEncoding: "UTF-8",
	   	uploadExtraData: get_token
	}).on('filepreajax',function(event,previewId,index){
		var files =  $('#imgUpload').fileinput('getFileStack');
		//构造每次请求的key
		var extraData = $("#imgUpload").fileinput('uploadExtraData');
		var name =files[index].name;
		extraData.key = qn_token.prefix+generic_name()+name.substr(name.lastIndexOf("."));
		$("#"+previewId).data("imgname",name);
		$("#"+previewId).data("imgsrc",extraData.key);

	}).on("fileuploaded",function(event, data, previewId, index){
		//单个上传成功，保存key
	}).on("filebatchuploadcomplete",function(){
		//全部上传成功
		qn_token = {};
		commit();
		
	}).on('fileloaded', function(event, file, previewId, index, reader) {
	    if(file.name.substr(file.name.lastIndexOf("."))=='.tiff' || file.name.substr(file.name.lastIndexOf("."))=='.tif'){
	        var tiff = new Tiff({buffer: reader.result});
	        var width = tiff.width();
	        var height = tiff.height();
	        checkImgWidthAndHeight(width,height,previewId);
	        return ;
	    }
	    var objUrl = window.URL || window.webkitURL;
	    var url = objUrl.createObjectURL(file);
	    var img = new Image();
	    img.src = url;
	    img.onload = function(){
	        checkImgWidthAndHeight(img.naturalWidth,img.naturalHeight,previewId);
	        objUrl.revokeObjectURL(url);
	    }
	});     

$("#publish_img").click(function(){
	$(".input-group").removeClass("has-error");
	params.pname = $.trim($("#pname").val());
	if (params.pname =="") {
		showerr("项目名称不能为空",$("#pname"));
		return false;
	}
	params.pic_tags = $("#pic_chosen").val();
	if (params.pic_tags == null) {
		showerr("请选择标签");
		return false;
	}
	var files =  $('#imgUpload').fileinput('getFileStack');
	if(files.length<=0){
		$('#imgUpload').fileinput('_showError','请先上传文件');
		return false;
	}
	$(this).addClass("disabled");
	$("#imgUpload").fileinput("upload");
})

$("#publish_video").click(function(){
	videoParams.vname = $.trim($("#vname").val());
	if (videoParams.vname==""||videoParams.vname.length>30) {
		alert_notice("视频名称在1到30位之间");
		return false;
	}
	videoParams.video_tags = $("#video_chosen").val();
	if (videoParams.video_tags == null) {
		alert_notice("请选择标签");
		return false;
	}
	videoParams.profile = $("#profile").val();
	video_up.start();
})
$("#publish_obj").click(function(){
	$(".input-group").removeClass("has-error");
	obj_params.oname = $.trim($("#oname").val());
	if (obj_params.oname =="") {
		showerr("项目名称不能为空",$("#oname"));
		return false;
	}
	obj_params.flag_publish = $("#flag_publish").is(':checked')?1:0;
	
	var files =  $('#objImgUpload').fileinput('getFileStack');
	if(files.length<=0){
		$('#objImgUpload').fileinput('_showError','请先上传文件');
		return false;
	}
	
	$(this).addClass("disabled");
	obj_params.imgs=new Array();
	$("#objImgUpload").fileinput("upload");
})
	//环物3d上传
 $("#objImgUpload").fileinput({
	    language: 'zh',
	    showUpload: false,
	    showRemove: false,
	    showCancel: false,
	    showUploadedThumbs:false,
	    maxFileCount: 50,
	    previewFileType: "image",
	    allowedFileExtensions: ["jpg","jpeg", "png"],
	    msgInvalidFileExtension: '不支持文件类型"{name}"。只支持扩展名为"{extensions}"的文件。',
	    browseClass: "btn btn-primary",
	    browseLabel: "选择本地环物图片",
	    browseIcon: "<i class=\"icon icon-picture\"></i> ",
	    removeClass: "btn btn-danger",
	    removeLabel: "删除",
	    removeIcon: "<i class=\"icon icon-trash\"></i> ",
	    uploadUrl: up_url,
	    uploadAsync: true,
	    previewSettings: {
	        image: {width: "auto", height: "100px"}
	    },
	    fileActionSettings: {},
	    dropZoneTitle: "拖拽一组/单幅图片或点击下面按钮上传",
	    textEncoding: "UTF-8",
	   uploadExtraData: get_obj_token
	}).on('filepreajax',function(event,previewId,index){
		var files =  $('#objImgUpload').fileinput('getFileStack');
		//构造每次请求的key
		var extraData = $("#objImgUpload").fileinput('uploadExtraData');
		var name =files[index].name;
		extraData.key = obj_token.prefix+generic_name()+name.substr(name.lastIndexOf("."));
		// $("#"+previewId).data("imgname",name);
		$("#"+previewId).data("imgsrc",extraData.key);

	}).on("fileuploaded",function(event, data, previewId, index){
		//单个上传成功，保存key
		var obj = {};
		obj.index = index;
		obj.filename = data.files[index].name;
		obj.imgsrc = $("#"+previewId).data("imgsrc");
		obj_params.imgs.push(obj);
	}).on("filebatchuploadcomplete",function(){
		//全部上传成功
		obj_token = {};
		obj_commit();
		
	}).on('fileloaded', function(event, file, previewId, index, reader) {
		  var type = file.type;
        if (type!="image/jpeg"&&type!="image/png"){
        	$.zui.messager.show("请选择格式为jpg,png的图片", {placement: 'center', type: 'success', time: '3000', icon: 'check'});
            $("#imgUpload").fileinput("clear");
        }
	}); 


})

var cubeGroupIdx = 0;
var cubeGroupFiles = {};
function sixImgChoose(){
    var files = $('#sixUpload')[0].files;
    $(files).each(function(idx){
        checkImgWidthAndHeight1v1(this);
    });
    if(!_alreadyShowError){
        var sixImgGroups = {};
        if(files.length >= 6){
            $(files).each(function(idx){
                var fullName = this.name.substring(0,this.name.lastIndexOf('.'));
                var nameArr = fullName.split('_');
                if(nameArr.length == 2){
                    if(!sixImgGroups[nameArr[0]]){
                        sixImgGroups[nameArr[0]] = {};
                    }
                    sixImgGroups[nameArr[0]][nameArr[1]] = this;
                }else{
                     if(!sixImgGroups['']){
                        sixImgGroups[''] = {};
                    }
                    sixImgGroups[''][nameArr[0]] = this;
                }
            });
            //校验每个分组中的六个面命名是否规范
            var validateMsg = '';
            $.each(sixImgGroups,function(groupName,groupObj){
                var size = Object.getOwnPropertyNames(groupObj).length;
                if(size == 6){
                    if(validateCubeImgs(groupObj)){
                        //var cubeGroupIdx = Object.getOwnPropertyNames($('#imgUpload').fileinput('_getCubeFiles')).length;
                        var cubeGroupId = 'cube'+cubeGroupIdx++;
                        $('#imgUpload').fileinput('_appendCubeFiles',cubeGroupId,groupObj);
                        addCubePreview(cubeGroupId,groupName,groupObj);
                    }else{
                        validateMsg += '组（'+groupName+')的图片方位命名不符合规范，请参考命名规范。\n';
                        return false;
                    }
                }else{
                    validateMsg += '组（'+groupName+')的图片数量不为6，当前数量'+size+'张\n';
                    return false;
                }
            });
            if(validateMsg != ''){
                $.zui.messager.show(validateMsg, {placement: 'center',  time: '5000', icon: 'exclamation-sign'});
            }
        }else{
            $.zui.messager.show('需要6张1:1图片组成六面体，当前只有'+files.length+'张', {placement: 'center',  time: '5000', icon: 'exclamation-sign'});
        }
    }
}
var _alreadyShowError = false;
function checkImgWidthAndHeight1v1(file){
    var objUrl = window.URL || window.webkitURL;
    var url = objUrl.createObjectURL(file);
    var img = new Image();
    img.onload = function(){
        if(img.naturalWidth != img.naturalHeight){
            //$('#imgUpload').fileinput('_showError','六面体全景图片必须为1:1比例');
            $.zui.messager.show('六面体全景图片必须为1:1比例', {placement: 'center',  time: '5000', icon: 'exclamation-sign'});
            _alreadyShowError = true;
            objUrl.revokeObjectURL(url);
        }else{
            _alreadyShowError = false;
        }
    };
    img.src = url;
}
function validateCubeImgs(groupObj){
    if(groupObj.f && groupObj.b && groupObj.l && groupObj.r && groupObj.u && groupObj.d){
        return true;
    }
    return false;
}
function addCubePreview(cubeGroupId,groupName,groupObj){
    var html = '';
    var imgFile = groupObj.f ? groupObj.f : '';
    var objUrl = window.URL || window.webkitURL;
    var url = objUrl.createObjectURL(imgFile);
    html += '<div class="file-preview-frame" data-fileindex="1" data-cubeid="'+cubeGroupId+'">'+
        '<img class="file-preview-image" style="width:auto;height:100px;" alt="'+groupName+'"' +
        ' title="'+groupName+'" src="'+url+'">'+
        '<div class="file-thumbnail-footer">'+
        '<div class="file-footer-caption" title="'+groupName+'">'+groupName+'</div>'+
        '<div class="file-thumb-progress hide">'+
        '<div class="progress">'+
        '<div class="progress-bar progress-bar-success progress-bar-striped active" style="width:0%;" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar"> 0% </div>'+
        '</div>'+
        '</div>'+
        '<div class="file-actions">'+
        '<div class="file-footer-buttons">'+
        '<button class="kv-file-remove2 btn btn-xs btn-default" title="删除文件" type="button">'+
        '<i class="icon icon-trash text-danger"></i>'+
        '</button>'+
        '</div>'+
        '<div class="clearfix"></div>'+
        '</div>'+
        '</div>'+
        '</div>';
    var files = $('#imgUpload').fileinput('getFileStack');
    if (files.length == 0){
        $(".file-preview").find(".file-drop-zone-title").remove();
        if($("#myContainer").length == 0){
            $(".file-preview").find(".file-preview-thumbnails").before("<div id = 'myContainer'></div>");
        }
        $("#myContainer").append(html);
    }else{
        $(".file-preview").find(".file-preview-thumbnails").append(html);
    }
}

function showCubeError(msg){
    $.zui.messager.show('六面体全景图片必须为1:1比例', {placement: 'center', type: 'danger', time: '5000', icon: 'exclamation-sign'});

}

function checkImgWidthAndHeight(width,height,previewId){
	if(width != 2*height){
	    $('#imgUpload').fileinput('_showError','球面全景图片必须为2:1比例');
	    return false;
	}
	return true;
}
function get_token() {
	if (qn_token.prefix) {
		return qn_token;
	}
	  $.ajax({
	  	url:'/get_token.php',
	  	method:'post',
	  	async: false,
	  	data:{'act':"qj_img"},
	  	success:function(res){
			var obj = eval ("(" + res + ")");
			qn_token.prefix= obj.prefix;
			if (obj.token) 
				qn_token.token = obj.token;
			else if(obj.policy){
				qn_token.policy = obj.policy;
				qn_token.OSSAccessKeyId = obj.accessid;
				qn_token.host = obj.host;
				qn_token.signature = obj.signature;
			}
	 	return qn_token;
	  	}
	  })
}
function get_obj_token() {
	if (obj_token.prefix) {
		return obj_token;
	}
	  $.ajax({
	  	url:'/get_token.php',
	  	method:'post',
	  	async: false,
	  	data:{'act':"obj_img"},
	  	success:function(res){
			var obj = eval ("(" + res + ")");
			obj_token.prefix= obj.prefix;
			if (obj.token) 
				obj_token.token = obj.token;
			else if(obj.policy){
				obj_token.policy = obj.policy;
				obj_token.OSSAccessKeyId = obj.accessid;
				obj_token.host = obj.host;
				obj_token.signature = obj.signature;
			}
	 	return obj_token;
	  	}
	  })
}
function generic_name() {
　　var $chars = 'abcdefghijklmnopqrstwxyz0123456789';  
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < 3; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return new Date().getTime()+pwd;
}
function commit(){
	$("#myModal").modal({
		  keyboard : false,
		  show     : true,
		  position : 'center',
		  backdrop : 'static'
		});
	params.imgs=new Array();
	 $(".file-preview-success").each(function(){
	 	var img={};
	 	img.imgsrc = $(this).data("imgsrc");
	 	img.imgname = $(this).data("imgname");
	 	params.imgs.push(img);
	 });
	 params.atlas_id = $("#atlas").val();
	 params.allow_recomm = $("#allow_recomm").is(':checked')?1:0;
	 var heartTimer = setInterval(function(){
				$.get("/add/pic",{'act':'keep_alive'});
		},60000);
	 $.post("/add/pic",{
	 	"act":"doAdd",
	 	"params":JSON.stringify(params)
	 },function(data){
	 	clearInterval(heartTimer);
	 	var data = eval("("+data+")");
	 	if(data.flag){
	 		$("#myModal .modal-body").html("<p class='text-success'><img src='/static/images/right.gif'>　图片上传成功</p>");
	 	}else{
	 		$("#myModal .modal-body").html("<p class='text-danger'>"+data.msg+"</p>");
	 	}
	 	$("#myModal .modal-footer button").show();
	 	$("#publish_img").removeClass("disabled");
	 })
}
function obj_commit(){
	var notice = alert_notice('物体环视生成中...','success');
	$.post("/add/object_around",{
		"act":"doAdd",
		"params":obj_params
	},function(data){
		notice.hide();
		if (data.flag) {
			alert_notice('创建成功','success');
			window.location.href="/member/object_around";
		}else{
			alert_notice(data.msg);
		}
	},'json')
}
function showerr(content,obj){
	alert_notice(content,'default','top');
	if(obj!=null){
		$(obj).parent(".input-group").addClass("has-error");
	}
}