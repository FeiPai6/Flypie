//评论相关代码
var comment_list = new Array(); 
var is_show_comment = true;
var css = {     
      display:"block"
};
var sname = '';
var ath = 0;
var atv = 0;
//显示评论窗
function show_comment(){
     var krpano = document.getElementById('krpanoSWFObject');
   //ajax判断用户是否微信授权
    $.post("/plugin/comment/weixin.php",{"act":"wxcomment","step":"check"},function(result){
        var data = eval('('+result+')');
       krpano.call("js(update_comm_ele(get(xml.scene),get(view.hlookat),get(view.vlookat)))");
		//update_comm_ele();
        if (data.ret==0) {
            $("#usercomm").attr('placeholder','请点击此处使用微信登录后评论！').bind("click",function(){
                window.location.href="/plugin/comment/weixin.php?act=wxcomment&project="+work_view_uuid+"&scene="+krpano.get("xml.scene");
            });
        }else{
           $("#usercomm").attr('placeholder','拖动头像就可以发表说一说到指定位置哦！').unbind("click");
           krpano.call(
                "addhotspot(commname);"+
                "set(hotspot[commname].url,/plugin/comment/images/comm-hide-icon.png);"+
                "set(hotspot[commname].ath,get(view.hlookat));"+
                "set(hotspot[commname].atv,get(view.vlookat));"+
                "set(hotspot[commname].edge,bottom);"+
                "set(hotspot[commname].zoom,false);"+   
                "set(hotspot[commname].ondown,dragcommenthotspot());"+
                "set(hotspot[commname].onup,js(update_comm_ele(get(xml.scene),get(ath),get(atv))));"+
                "addplugin(commname_txt);"+
                "set(plugin[commname_txt].parent, 'hotspot[commname]');"+
                "set(plugin[commname_txt].url,'%SWFPATH%/plugins/textfield.swf');"+
                "set(plugin[commname_txt].align,righttop);"+
                "set(plugin[commname_txt].edge,lefttop);"+
                "set(plugin[commname_txt].x,-5);"+
                "set(plugin[commname_txt].autowidth,true);"+
                "set(plugin[commname_txt].height,30);"+
                "set(plugin[commname_txt].background,true);"+
                "set(plugin[commname_txt].backgroundcolor,0x000000);"+
                "set(plugin[commname_txt].roundedge,5);"+
                "set(plugin[commname_txt].backgroundalpha,0.8);"+
                "set(plugin[commname_txt].css,'text-align:center;color:#FFFFFF;font-size:14px;line-height:25px;padding:0 5px;font-family:microsoft yahei;');"+
                "set(plugin[commname_txt].html,拖动头像到你要评论的位置);"+
                "set(plugin[commname_txt].enabled,true);"+
                "addplugin(commname_avatar);"+
                "set(plugin[commname_avatar].url,%SWFPATH%/plugins/textfield.swf);"+
                "set(plugin[commname_avatar].parent,'hotspot[commname]');"+
                "set(plugin[commname_avatar].width,30);"+
                "set(plugin[commname_avatar].height,30);"+
                "set(plugin[commname_avatar].align,lefttop);"+
                "set(plugin[commname_avatar].edge,lefttop);"+
                "set(plugin[commname_avatar].roundedge,3);"+
                "set(plugin[commname_avatar].enabled,false);"+
                "set(plugin[commname_avatar].css,'margin:0;width:30px;height:30px;background:url("+data.img+") 0 0 no-repeat;background-size:30px');"
        );
        }
    });

   switch_show_comment(true);
   $(".vrshow_comment").css(css);
   krpano.call("set(layer[skin_layer].visible,false)"); 
}


//取消评论
function cancel_comment(){
     var krpano = document.getElementById('krpanoSWFObject');
    $("#usercomm").val('');
    $("#doComm").addClass("disabled");
    $(".vrshow_comment").hide();
    krpano.call("removehotspot(commname);removeplugin(commname_avatar);set(layer[skin_layer].visible,true);");
}
//更新sname,ath,atv
function update_comm_ele(s,ah,av){
    sname = s;
    ath = ah;
    atv = av;
  //  console.log(s+"  "+ah+"  "+av);
	// var krpano = document.getElementById('krpanoSWFObject');
 //    sname = krpano.get("scene[get(xml.scene)].name");
 //    ath = krpano.get("view.hlookat");
 //    atv =  krpano.get("view.vlookat");
}
//取得某个scene的评论
function getComment(s) {
    
   var krpano = document.getElementById('krpanoSWFObject');
    //取得当前scene
     var s = krpano.get("scene[get(xml.scene)].name");
    $.post('/plugin/comment/comment.php',{pid:pk_works_main,sname:s,act:'list_comment'},function(data){
        comment_list = eval('('+data+')');
        if(comment_list){
            // comment_list = data.list;
            for(var i=0;i<comment_list.length;i++){
                var commname = "userComm_"+comment_list[i].id;
                var commname_txt = commname+"_txt";
                var commname_avatar = commname+"_avatar";
                var head_img = comment_list[i].head_img
                krpano.call(
                "addhotspot("+commname+");"+
                "set(hotspot["+commname+"].url,/plugin/comment/images/comm-hide-icon.png);"+
                "set(hotspot["+commname+"].ath,"+comment_list[i].ath+");"+
                "set(hotspot["+commname+"].atv,"+comment_list[i].atv+");"+
                "set(hotspot["+commname+"].edge,bottom);"+
                "set(hotspot["+commname+"].zoom,false);"+   
                "set(hotspot["+commname+"].visible,true);"+
                "addplugin("+commname_txt+");"+
                "set(plugin["+commname_txt+"].parent, 'hotspot["+commname+"]');"+
                "set(plugin["+commname_txt+"].url,'%SWFPATH%/plugins/textfield.swf');"+
                "set(plugin["+commname_txt+"].align,righttop);"+
                "set(plugin["+commname_txt+"].edge,lefttop);"+
                "set(plugin["+commname_txt+"].x,-5);"+
                "set(plugin["+commname_txt+"].autowidth,true);"+
                "set(plugin["+commname_txt+"].height,30);"+
                "set(plugin["+commname_txt+"].background,true);"+
                "set(plugin["+commname_txt+"].backgroundcolor,0x000000);"+
                "set(plugin["+commname_txt+"].roundedge,5);"+
                "set(plugin["+commname_txt+"].backgroundalpha,0.8);"+
                "set(plugin["+commname_txt+"].css,'text-align:center;color:#FFFFFF;font-size:14px;line-height:25px;padding:0 5px;font-family:microsoft yahei;');"+
                "set(plugin["+commname_txt+"].html,"+comment_list[i].content+");"+
                "set(plugin["+commname_txt+"].enabled,false);"+
                "addplugin("+commname_avatar+");"+
                "set(plugin["+commname_avatar+"].url,%SWFPATH%/plugins/textfield.swf);"+
                "set(plugin["+commname_avatar+"].parent,'hotspot["+commname+"]');"+
                "set(plugin["+commname_avatar+"].width,30);"+
                "set(plugin["+commname_avatar+"].height,30);"+
                "set(plugin["+commname_avatar+"].align,lefttop);"+
                "set(plugin["+commname_avatar+"].edge,lefttop);"+
                "set(plugin["+commname_avatar+"].keep,false);"+
                "set(plugin["+commname_avatar+"].roundedge,3);"+
                "set(plugin["+commname_avatar+"].css,'margin:0;width:30px;height:30px;background:url("+head_img+") 0 0 no-repeat;background-size:30px');"
                );
            }
        }
    });
}
//隐藏评论
//param status:要设置的状态 true 显示 false 隐藏
function switch_show_comment(status){
     var krpano = document.getElementById('krpanoSWFObject');
 
    if(status&&!is_show_comment){
        for(var i=0;i<comment_list.length;i++){
          krpano.call("set(hotspot[userComm_"+comment_list[i].id+"].visible,true);set(layer[skin_co_btn_ico].url,/plugin/comment/images/comment.png);");
        }
        is_show_comment = true; 
    }else if(!status&&is_show_comment) {
        for(var i=0;i<comment_list.length;i++){
          krpano.call("set(hotspot[userComm_"+comment_list[i].id+"].visible,false);set(layer[skin_co_btn_ico].url,/plugin/comment/images/no_comment.png);");
        }
        is_show_comment = false;
        cancel_comment();
    }
 
}
function comment_init(data){
    //是否显示说一说
    if (data.comment=='0') {
        $('#comment_div').hide();
    }else{
        $('#comment_div').show();
    }
}
//监听
$(function() {
    plugins_init_function.push(comment_init);
    $("#usercomm").keyup(function(){  
		var krpano = document.getElementById('krpanoSWFObject');						  
        var content = $.trim($("#usercomm").val());
        var curLength = content.length;   
        krpano.call("set(plugin[commname_txt].html,"+content+");");
        if(curLength>0){
            $("#doComm").removeClass("disabled");
        }
        else{
            krpano.call("set(plugin[commname_txt].html,拖动头像到你要评论的位置);");
            //$("#doComm").css({cursor:"not-allowed",backgroundColor:"#aaaaaa"});
        } 
    });
    $("#doComm").click(function(){
        if($.trim($("#usercomm").val()).length<1){
            return false;
        }
        $.post("/plugin/comment/comment.php",{pid:pk_works_main,sname:sname,ath:ath,atv:atv,content:$("#usercomm").val(),act:"add_comment"},function(data){
            if(data==1){
                //todo
                cancel_comment();
                getComment(sname);
            }
            else{
                alert('添加评论失败！');
            }
        });
    });
})  
