var obj_token = {};
var obj_up_params=new Array();
$(function(){
    $('#sortableList').sortable({selector:'.col-md-3'});
    $('.copyable').zclip({
        path: '/static/zclip/ZeroClipboard.swf',
        copy: function(){//复制内容
            console.log( $(this).parent().prev().find('input').val());
            return $(this).parent().prev().find('input').val();
        },
        afterCopy: function(){//复制成功
            $.zui.messager.show('复制成功', {placement: 'center', type: 'success', time: '3000', icon: 'check'});
        }
    });
    $("#objUpload").fileinput({
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
        uploadExtraData: get_obj_token
    }).on("filebatchselected", function (event, files) {
        var type = files[0].type;
        if (type=="image/jpeg"||type=="image/png"){
             $("#objUpload").fileinput("upload");
        }else{
             $.zui.messager.show("请选择格式为jpg,png的图片", {placement: 'center', time: '3000'});
            $("#objUpload").fileinput("clear");
        }
    }).on('filepreajax',function(event,previewId,index){
        var files =  $('#objUpload').fileinput('getFileStack');
        //构造每次请求的key
        var extraData = $("#objUpload").fileinput('uploadExtraData');
        var name =files[index].name;
        extraData.key = obj_token.prefix+generic_name()+name.substr(name.lastIndexOf("."));
        $("#"+previewId).data("imgsrc",extraData.key);
    }).on("fileuploaded",function(event, data, previewId, index){
        //单个上传成功，保存key
         var o = {};
        o.name = data.files[index].name;
        o.imgsrc = $("#"+previewId).data("imgsrc");
        obj_up_params.push(o);

    }).on('filebatchuploadcomplete', function () {
        $.zui.messager.show('图片上传成功', {placement: 'center', type: 'success', time: '3000', icon: 'check'});
        $("#objUpload").fileinput("clear");
        addObjImg();
    });
})
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
function addObjImg(){
    var html='';
    for(var i=0 ; i<obj_up_params.length; i++){
        var o=obj_up_params[i];
        var index = generic_radom_str(5);
        var imgsrc = cdn_host+o.imgsrc;
        html+=' <div class="col-md-3" id="pic_'+index+'" data-imgsrc="'+imgsrc+'" data-filename="'+o.name+'">'+
              '    <div class="card">'+
              '        <div class="media-wrapper">'+
               '         <img alt="" src="'+imgsrc+'">'+
              '        </div>'+
              '        <div class="card-heading">'+
              '            <span class="pull-right">'+
              '                <a href="javascript:void(0);" onclick="deletepic(\''+index+'\');">'+
               '                  <i class="icon-remove-circle"></i>删除'+
               '               </a>'+
               '           </span>'+
              '            <span class="card-scene-name">'+o.name+'</span>'+
              '        </div>'+
              '    </div>'+
             ' </div>';
    }
    $("#obj_up").modal('hide');
    $("#sortableList").append(html);
   $('#sortableList').sortable({selector:'.col-md-3'});
}
function update_obj(oid){
    var params = {};
    params.id = oid;
    params.name = $.trim($("#oname").val());
    if (!params.name||params.name.length>100) {
        alert_notice('请输入1到100字符的名字');
        return false;
    }
    params.thumb_path = $("#thumbpath").attr('src');
    if (!params.thumb_path) {
        alert_notice("请选择封面");
        return false;
    }
    params.flag_publish = $("#flag_publish").is(':checked')?1:0;
    params.imgs = new Array();
    $("#sortableList .col-md-3").each(function(idx){
        var img = {};
        img.index = idx;
        img.filename = $(this).data('filename');
        img.imgsrc = $(this).data('imgsrc');
        params.imgs.push(img);
    });
   $.post('/edit/object_around',{
        'act':'edit',
        'params':params
   },function(res){
        if (res.status == 1) {
            alert_notice('更新成功','success');
        }else{
            alert_notice(res.msg);
        }
   },'json')
}
function preview_obj(url){
    window.open(url);
}
function deletepic(idx){
    $("#pic_"+idx).remove();
}
function showUpBox(){
    $("#obj_up").modal('show');
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