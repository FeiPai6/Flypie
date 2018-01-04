var pk_works_main;
var mapModalEl;
var _user_view_uuid;
var _name;
var _userList;
var plugins_init_function = new Array();//接收显示时的init方法

//krpano loadcomplete调用
function showPanoBtns(sceneCount){
    if (sceneCount > 1) {
        $(".vrshow_container_3_min .img_desc_container_min:eq(0)").show();
    }else{
        $(".vrshow_container_3_min .img_desc_container_min:eq(0)").hide();
    }
    $("#panoBtns").show();
}

function fullscreen(el){
    //krpano.call("switch(fullscreen);");
    //launchFullScreen(document.documentElement);
    if($(el).hasClass('btn_fullscreen')){
        launchFullScreen(document.getElementById('fullscreenid'));
        var krpano = document.getElementById('krpanoSWFObject');
        krpano.call("skin_showthumbs(false);");
    }else{
        exitFullscreen();
    }
    toggleFullscreenBtn(el);
}

function launchFullScreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function toggleFullscreenBtn(el){
    if($(el).hasClass("btn_fullscreen")){
        $(el).removeClass("btn_fullscreen");
        $(el).addClass("btn_fullscreen_off");
    }else{
        $(el).removeClass("btn_fullscreen_off");
        $(el).addClass("btn_fullscreen");
    }
}

function toggleBtns(flag){
    if(flag){
        $("#panoBtns").show();
    }else{
        $("#panoBtns").hide();
        var krpano = document.getElementById('krpanoSWFObject');
        krpano.call('skin_showthumbs(false);');
    }
}

function showWebVR(){
    var krpano = document.getElementById('krpanoSWFObject');
    var webvr = krpano.get("webvr");
    webvr.entervr();
}



function showthumbs(){
    var krpano = document.getElementById('krpanoSWFObject');
    krpano.call("skin_showthumbs();");
}



function hidePictext() {
    $('#pictextModal').modal('hide');
    toggleBtns(true);
}

function showPictext(title,content) {
    toggleBtns(false);
    //var data = $("body").data("panoData");
    // $('#pictextWorkName').text('');
    // $('#pictextContent').text('');
    $('#pictextWorkName').text(title);
    $('#pictextContent').html(imgtext_decode(content));
    //$('#pictextContent').append(content);
    $('#pictextModal').modal("show");
}

//krpano调用 初始化高级设置
function initAdvancedSetting(sceneName){
    //initViewSetting(sceneName);
    initEffectSetting(sceneName);
    initHotspotSetting(sceneName);
    initSandTableSetting(sceneName);
    initTourGuideSetting(sceneName);
    //作者信息 TODO
    // initAuthourInfo(sceneName);
}

function initTourGuideSetting(sceneName){
    var krpano = document.getElementById('krpanoSWFObject');
    var tourGuideObj = $("body").data("panoData").tour_guide;
    if(tourGuideObj.points.length > 0){
        $('#pano .vrshow_tour_btn').show();
    }else{
        $('#pano .vrshow_tour_btn').hide();
    }
}

var lsTourGuideObj = null;
function startTourGuide(){
    toggleBtns(false);
    lsTourGuideObj = $("body").data("panoData").tour_guide;
    var krpano = document.getElementById('krpanoSWFObject');
    //krpano.call('showlog(true)');
    var curSceneName = krpano.get('xml.scene');
    var firstPoint = lsTourGuideObj.points[0];
    if(lsTourGuideObj.useStartImg){
        krpano.call('show_tour_guide_alert('+lsTourGuideObj.startImgUrl+');');
    }
    if(this.sceneName != curSceneName){
        krpano.call('loadscene('+firstPoint.sceneName+', null, MERGE);');
    }
    var curfov = krpano.get('view.fov');
    krpano.call('lookto('+firstPoint.ath+','+firstPoint.atv+','+curfov+',smooth(720,-720,720),true,true,js(looktoCallBack('+1+')));');
}

function looktoCallBack(idx){
    var krpano = document.getElementById('krpanoSWFObject');
    if(idx < lsTourGuideObj.points.length){
        var pointObj = lsTourGuideObj.points[idx];
        var curSceneName = krpano.get('xml.scene');
        var curfov = krpano.get('view.fov');
        if(pointObj.sceneName != curSceneName){
            krpano.call('loadscene('+pointObj.sceneName+', null, MERGE);');
            krpano.call('lookto('+pointObj.ath+','+pointObj.atv+','+curfov+',smooth(720,-720,720),true,true,js(looktoCallBack('+(parseInt(idx)+1)+')));');
        }else{
            krpano.call('lookto('+pointObj.ath+','+pointObj.atv+','+curfov+',tween(easeInOutQuad,'+parseInt(pointObj.moveTime)+'),true,true,js(looktoCallBack('+(parseInt(idx)+1)+')));');
        }
    }else{
        if(lsTourGuideObj.useEndImg){
            krpano.call('show_tour_guide_alert('+lsTourGuideObj.endImgUrl+');');
        }
        toggleBtns(true);
    }
}

function initSandTableSetting(sceneName){
    var krpano = document.getElementById('krpanoSWFObject');
    var sandTableObj = $("body").data("panoData").sand_table;
    var existFlag = false;
    $(sandTableObj.sandTables).each(function(idx){
        if(this.sceneOpt[sceneName]){
            //设置背景图片
            krpano.set("layer[map].url",this.imgPath);
            $.each(this.sceneOpt,function(sceneName,value){
                var spotName = 'spot_'+sceneName;
                addRadarSpot(spotName,value.krpLeft,value.krpTop);
            });
            var hlookatIncre = krpano.get('view.hlookat') - this.sceneOpt[sceneName].hlookat;
            krpano.call('activatespot('+(parseFloat(this.sceneOpt[sceneName].rotate)+parseFloat(hlookatIncre))+');');
            existFlag = true;
            return false;
        }
    });
    if(!existFlag){
        $('.vrshow_radar_btn').hide();
        krpano.set('layer[mapcontainer].visible',false);
    }else{
        $('.vrshow_radar_btn').show();
        if(sandTableObj.isOpen){
            krpano.set('layer[mapcontainer].visible',true);
        }
    }
}

function toggleKrpSandTable(){
    var krpano = document.getElementById('krpanoSWFObject');
    var isVisible = krpano.get('layer[mapcontainer].visible');
    if(isVisible){
        krpano.set('layer[mapcontainer].visible',false);
    }else{
        krpano.set('layer[mapcontainer].visible',true);
    }
}

function addRadarSpot(name,x,y){
    //console.log(x+','+y);
    var krpano = document.getElementById('krpanoSWFObject');
    krpano.call('addlayer('+name+');');
    krpano.set('layer['+name+'].style','spot');
    krpano.set('layer['+name+'].x',x);
    krpano.set('layer['+name+'].y',y);
    krpano.set('layer['+name+'].parent','radarmask');
    krpano.call('layer['+name+'].loadstyle(spot);');
    //krpano.set('layer['+name+'].keep','true');
    //krpano.set('layer['+name+'].visible','true');
}

function initHotspotSetting(sceneName){
    var krpano = document.getElementById('krpanoSWFObject');
    var hotspotObj = ($("body").data("panoData").hotspot)[sceneName];
    if(hotspotObj){
        $.each(hotspotObj,function(key,value){
            if(key == 'scene'){
                $(value).each(function(idx){
                    krpano.call('addSceneChangeHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+this.linkedscene+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true)');
                });
            }else if(key == 'link'){
                $(value).each(function(idx){
                    krpano.call('addLinkHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+html_encode(this.hotspotTitle)+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true,'+this.link+','+this.isShowSpotName+')');
                });
            }else if(key == 'image'){
                $(value).each(function(idx){
                    krpano.call('addImgHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+html_encode(this.hotspotTitle)+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true,'+this.galleryName+','+this.isShowSpotName+')');
                });
            }else if(key == 'text'){
                $(value).each(function(idx){
                    krpano.call('addWordHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+html_encode(this.hotspotTitle)+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true,'+html_encode(this.wordContent)+','+this.isShowSpotName+')');
                });
            }else if(key == 'voice'){
                $(value).each(function(idx){
                    krpano.call('addVoiceHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+html_encode(this.hotspotTitle)+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true,'+this.musicSrc+','+this.isShowSpotName+')');
                });
            }else if(key == 'around'){
                $(value).each(function(idx){
                    krpano.call('addAroundHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+html_encode(this.hotspotTitle)+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true,'+this.aroundPath+','+this.fileCount+','+this.isShowSpotName+')');
                });
            }else if(key == 'imgtext'){
                $(value).each(function(idx){
                    krpano.call('addImgTextHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+html_encode(this.hotspotTitle)+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true,'+imgtext_encode(this.imgtext_wordContent)+','+this.isShowSpotName+')');
                });
            }else if(key == 'obj'){
                $(value).each(function(idx){
                    krpano.call('addObjHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+html_encode(this.hotspotTitle)+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true,'+this.objid+','+this.isShowSpotName+')');
                });
            }else if(key == 'video'){
                $(value).each(function(idx){
                    krpano.call('addVideoHotSpot("'+this.imgPath+'","'+ (this.name) +'",'+html_encode(this.hotspotTitle)+','+(this.ath)+','+(this.atv)+','+this.isDynamic+',false,true,'+this.location+','+this.isShowSpotName+')');
                });
            }
        });
    }
}

function initEffectSetting(sceneName){
    var krpano = document.getElementById('krpanoSWFObject');
    var effectObj = null;
    var effectData = $("body").data("panoData").special_effects;
    $(effectData.effectSettings).each(function(idx){
        if(this.sceneName == sceneName){
            effectObj = this;
            return false;
        }
    });
    if(effectObj){
        if(effectObj.isOpen){
            if(effectObj.effectType == 'sunshine'){
                //krpano.set('lensflares[obj].item[lensitemobj].scene',sceneName);
                //krpano.set('lensflares[obj].item[lensitemobj].ath',effectObj.ath);
                //krpano.set('lensflares[obj].item[lensitemobj].atv',effectObj.atv);
                krpano.call('addLensflares('+effectObj.ath+','+effectObj.atv+')');
            }else{
                krpano.call('addEffect("'+effectObj.effectType+'","'+effectObj.effectImgPath+'")');
            }
        }
    }
}

function littlePlaneOpen(sceneName){
    var krpano = document.getElementById('krpanoSWFObject');
    var lookatObj = null;
    var angleData = $("body").data("panoData").angle_of_view;
    $(angleData.viewSettings).each(function(idx){
        if(this.sceneName == sceneName){
            lookatObj = this;
            return false;
        }
    });
    if(lookatObj){
        krpano.set('view.vlookat',lookatObj.vlookat);
        krpano.set('view.hlookat',lookatObj.hlookat);
        krpano.set('view.fov',lookatObj.fov);
        krpano.set('view.fovmax',lookatObj.fovmax);
        if(lookatObj.hlookatmin){
            krpano.set('view.hlookatmin',lookatObj.hlookatmin);
        }
        if(lookatObj.hlookatmax){
            krpano.set('view.hlookatmax',lookatObj.hlookatmax);
        }
        krpano.call('skin_setup_littleplanetintro('+lookatObj.fovmin+','+(-1*lookatObj.vlookatmax)+','+(-1*lookatObj.vlookatmin)+','+(lookatObj.keepView ? "off" : "0.0")+');');
    }else{
        krpano.call('skin_setup_littleplanetintro(5,-90,90,"0.0");');
    }
}

//场景载入时加载视角设置
function initViewSetting(sceneName){
    var krpano = document.getElementById('krpanoSWFObject');
    var lookatObj = null;
    var angleData = $("body").data("panoData").angle_of_view;
    $(angleData.viewSettings).each(function(idx){
        if(this.sceneName == sceneName){
            lookatObj = this;
            return false;
        }
    });
    if(lookatObj){
        krpano.set('view.vlookat',lookatObj.vlookat);
        krpano.set('view.hlookat',lookatObj.hlookat);
        krpano.set('view.fov',lookatObj.fov);
        krpano.set('view.fovmin',lookatObj.fovmin);
        krpano.set('view.fovmax',lookatObj.fovmax);
        krpano.set('view.vlookatmin',-1*lookatObj.vlookatmax);
        krpano.set('view.vlookatmax',-1*lookatObj.vlookatmin);
        krpano.set('autorotate.horizon',lookatObj.keepView ? "off" : "0.0");
        if(lookatObj.hlookatmin){
            krpano.set('view.hlookatmin',lookatObj.hlookatmin);
        }
        if(lookatObj.hlookatmax){
            krpano.set('view.hlookatmax',lookatObj.hlookatmax);
        }
    }
}

function loadGallery(){
    var krpano = document.getElementById('krpanoSWFObject');
    var hotspotObj = $("body").data("panoData").hotspot;
    //var xmlStr = '';
    $.each(hotspotObj,function(sceneName,value){
        if(value){
            $(value.image).each(function(idx){
                var xmlStr = '<gallery name="'+this.galleryName+'" title="">';
                $(this.imgs).each(function(idx){
                    xmlStr += '<img name="img'+idx+'" url="'+this.src+'" title="" />';
                });
                xmlStr += '</gallery>';
                krpano.call('loadxml('+xmlStr+');');
            });
        }
    });
}

function reloadGallery(gallery){
    var krpano = document.getElementById('krpanoSWFObject');
    var ua = window.navigator.userAgent.toLowerCase();
    if(typeof(wx)!='undefined' && ua.match(/MicroMessenger/i) == 'micromessenger'){
        //整合gallery的图片到数组 
        var urls = new Array();
        for(var i=0; i<krpano.get('gallery['+gallery+'].img.count'); i++){
            urls.push(krpano.get('gallery['+gallery+'].img['+i+'].url'));
        }
        wx.previewImage({
            current: krpano.get('gallery['+gallery+'].img[0].url'), // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        }); 
    }
    else{
        toggleBtns();
        krpano.call('show_gallery('+gallery+')');   
    }
}

function getWorkPrivacyFlag(){
    var privacy_flag = '0';

    return privacy_flag;
}



function initPano(){//TODO
   
   if(data.pk_works_main == undefined){
       window.location.href = '/404.html';
       return ;
   }
   //微信分享
   // initWxConfig(data);
   // initQQShare(data);
   //存储作者的信息
   // _user_view_uuid = data.user_view_uuid;
   _user_view_uuid = "admin";

   _name = data.name;
   document.title = _name;
   //$("#thumb_img").attr("src",data.absolutelocation);
   //var descContent='';
   //if(data.profile){
   //    descContent = data.profile;
   //}else{
   //    descContent = data.name;
   //}
   //$("head").append('<meta name="description" content="'+descContent+'"/>');

   $("body").data("panoData",data);
   pk_works_main = data.pk_works_main;
   var settings = {};
   settings["events[skin_events].onloadcomplete"] = "skin_showloading(false);";
   settings["onstart"] = '';
   
   //是否开始时弹出场景选择
   if (data.scenechoose=='1') {
       settings["events[skin_events].onloadcomplete"] += "open_show_scene_thumb();";
   }
   
   //统计人气
   if(data.browsing_num!='0'){
       $("#user_viewNum").text(parseInt(data.browsing_num)+1);
   }else{
       $("#user_viewNum").text("1");
   }
   //启动画面
   var loadingObj = data.loading_img;
   if (loadingObj && loadingObj.useLoading) {
       settings["onstart"] += "showloadingimg('" + loadingObj.loadingImgPathWebsite + "','" + loadingObj.loadingImgPathMobile + "');";
   }
   for(var i=0 ; i<plugins_init_function.length;i++){
        plugins_init_function[i](data,settings);
   }
   if(data.scene_group.sceneGroups.length>0) {
         $(".vrshow_container_3_min .img_desc_container_min:eq(0) img").attr('src',data.scene_group.sceneGroups[0].imgPath);
    }
   settings['skin_settings.littleplanetintro'] = data.littleplanet=="1" ? true : false;

   settings['autorotate.enabled'] = data.autorotate=="1" ? true : false;
   embedpano({
       swf: "tour.swf",
       xml: "tour.xml",
       target: "pano",
       html5:'prefer',
       //flash:'only',
       wmode:'opaque-flash',
       mobilescale:0.7,
       vars: settings
   });
}
function html_encode(str)
  {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\(/g, "（");
    s = s.replace(/\)/g, "）");
    s = s.replace(/,/g, "，");
    return s;
  }
function imgtext_encode(str){
     var s = "";
    if (str.length == 0) return "";
    s = str.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\(/g, "（");
    s = s.replace(/\)/g, "）");
    s = s.replace(/\,/g,"%2C");
    return s;
}
function imgtext_decode(str){
     var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&quot;/g, "\"");
     s = s.replace(/%2C/g,",");
    return s;
}

function showFullscreenBtn(){
    $(".btn_fullscreen").show();
}



function radarRotate(sceneName,hlookat){

}

function openSpeechVoiceBtn(){
    var voiceOff = $('.btn_music_off');
    voiceOff.removeClass('btn_music_off');
    voiceOff.addClass('btn_music');
}
var player ;
function playvideo(url){
   var location = window.location.href;
   url = location.substring(0,location.lastIndexOf("\/")+1)+url;
   player = new prismplayer({
      id: "J_prismPlayer", // 容器id
      source:url,
      autoplay: true,      // 自动播放
      width: "100%",       // 播放器宽度
      height: "400px"      // 播放器高度
    });
   $("#video_player_modal").modal('show');
}
function close_video_player(){
    player.pause();
    $("#video_player_modal").modal('hide');
}