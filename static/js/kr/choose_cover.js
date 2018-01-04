var uploadFlag = false;
var tokenObj={};
var  polist =  new Array();
$(function(){
    
    $("#workCover").click(function(){
         $("#media_icon").modal('show');   
        list_mediares();
    });
      //选择图片素材点击
    $(document).on("click", "#pic span img", function (e) {
        if (!$(this).hasClass("img-selected")) {
            $("#pic span img.img-selected").removeClass("img-selected");
            $(this).addClass("img-selected");
        }
    });

    $("#imgUpload").fileinput({
        language: 'zh',
        showUpload: false, 
        showRemove: false, 
        showCancel: false,
        showPreview: true,
        showCaption: false,
        allowedFileExtensions: ["jpg", "png"],
        browseClass: "btn btn-primary",
        browseLabel: "选择音乐/图片文件",
        browseIcon: "<i class=\"icon icon-file-o\"></i> ",
        uploadUrl: up_url,
        uploadAsync: true,
        textEncoding: "UTF-8",
        layoutTemplates: {
            actions: ''
        },
        uploadExtraData: buildExtraData
    }).on("filebatchselected", function (event, files) {
        var type = files[0].type;
        if (type=="image/jpeg"||type=="image/png"){
             $("#imgUpload").fileinput("upload");
        }else{
             $.zui.messager.show("请选择格式为jpg,png的图片", {placement: 'center', time: '3000', icon: 'check'});
            $("#imgUpload").fileinput("clear");
        }
    }).on('filebatchuploadcomplete', function () {
        $.zui.messager.show('图片上传成功', {placement: 'center', type: 'success', time: '3000', icon: 'check'});
        $("#imgUpload").fileinput("clear");
        addMediaRes(polist,true);
        uploadFlag = true;
    });

})
function buildExtraData() {
    if (tokenObj.key || uploadFlag) {
        //已经上传成功
        if (uploadFlag) {
            tokenObj = {};
            polist =  new Array();
            uploadFlag = false;
        }
        return tokenObj;
    }
    var files = $('#imgUpload').fileinput('getFileStack');
    if (files.length>0) {
        var sb = _U.getSubmit('/get_token.php', null, 'ajax', true);
        var name = files[0].name;
        var size = files[0].size;
        sb.pushData("mediaType", '0');
        sb.pushData("filename", name);
        sb.pushData("filesize", size + "");
        sb.pushData("act","media_resource");
        sb.submit(function () {
        }, function (data) {
            if(data.token){
                tokenObj.token = data.token;
                tokenObj.key = data.key;
            }else if(data.policy){
                tokenObj.key = data.key;
                tokenObj.policy = data.policy;
                tokenObj.signature = data.signature;
                tokenObj.OSSAccessKeyId = data.accessid;
                tokenObj.host = data.host;
            }
            polist.push(data.medias);
        });
        return tokenObj;
    }
}
function list_mediares(){
    var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
    sb.pushData("act", 'list');
    sb.pushData("type", 'custom');
    sb.pushData("media_type", '0');
    sb.submit(function () {
    }, function (data) {
        addMediaRes(data , false);
    });
}
function confirmChoseCover(){
    $("#thumbpath").attr('src',$("#pic span img.img-selected").data('key'));
     $("#media_icon").modal('hide'); 
}
function addMediaRes(data,isPre){
    var html="";
    for(var i=0 ; i<data.length; i++){
        var p = data[i];
        html += '<span name = "medias"><img src="' + p.absolutelocation + '" ' +
        'data-key="'+p.absolutelocation+'" ' +
        'title="' + (p.media_name +  p.media_suffix) + '"' +
        'name = "media_name"></span>';
    }
    if(html != ""){
     if(isPre)
        $("#pic").prepend(html);
     else
        $("#pic").html(html);   
    }
    
}
