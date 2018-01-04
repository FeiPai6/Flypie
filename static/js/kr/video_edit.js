$(function(){
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
    $('[data-toggle="tooltip"]').tooltip();
    $("#video_chosen").chosen({
         no_results_text: "没有找到",
        max_selected_options:3,
        width:"100%"
    });
})

function delete_source(index){
        bootbox.confirm({
        message:"确定要删除一个分类吗?",
        buttons: {  
            confirm: {  
                label: '确认',  
                className: 'btn-primary'  
            },  
            cancel: {  
                label: '取消',  
                className: 'btn-default'  
            }  
        },
        title:"提示：",
        callback:function(result) {
            if(result){
               $("#source_"+index).remove();
            }
        }
    });
        
}
function update_videos(vid){
    // $("#save_btn").attr({"disabled":"disabled"});
    var sources = new Array();
    var flag = false;
    var tags = $("#video_chosen").val();
    if (tags==null || tags.length>3) {
         alert_notice("请选择3个以内的标签");
        return false;
    }
    $("#source_wrap input").each(function(){
        var source = {};
        source.location = $(this).data("location");
        source.progressive = $(this).val();
        if(!source.progressive){
            $(this).parent("div").addClass("has-error");
            flag = true;
            return false;
        }
        sources.push(source);
    });
    if(flag){
        alert_notice("请输入清晰度");
        return false;
    }

    if (sources.length==0) {
        alert_notice("不能没有视频，请重新刷新页面");
        return false;
    }
    $.post("/edit/video",
        {
           "act" : "update",
           "vname": $.trim($("#vname").val()),
           "profile":$.trim($("#profile").val()),
           "sources":JSON.stringify(sources),
           "tags":JSON.stringify(tags),
           "flag_publish":$("#flag_publish").is(':checked')?1:0,
           "thumbpath":$("#thumbpath").attr('src'),
           "vid":vid
        },function(result){
             // $("#save_btn").removeAttr("disabled");
            result = eval("("+result+")");
            if (result.flag) {
                alert_notice("修改成功","success");
            }else{
                alert_notice(result.msg);
            }
        })
}
function preview_videos(vid){
    window.open(cdn_host+"video/play.html?vid="+vid);
}

