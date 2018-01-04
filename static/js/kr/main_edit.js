var chooseMediaResCallBack;
var openMediaResObj;
var mapModalEl;
var hotSpotModalTitle = ["添加全景切换热点","添加超链接热点","添加图册","添加文本热点","添加音乐","添加图文热点","添加视频热点","添加分组"];
var hotSpotDataKey = ["scene","link","image","text","voice","imgtext","obj",'video'];
var _user_view_uuid;
var hotspotIdx = 0;

var tourPointIdx = 1;

var ex1Slider;
var ex2Slider;
var ex3Slider;
var ex4Slider;
var imgtext_editor;

var plugins_init_function = new Array();          //接收插件注册的初始化方法
var plugins_works_get_function = new Array();     //接收插件注册的更新时获取work配置的方法
var plugins_config_get_function = new Array();    //接收插件注册的更新时获取panoconfig配置的方法
$(function () {
    //图标搜索当前页
    $('#searchMediaInput').on('keyup', function (e) {
        var searchStr = $("#searchMediaInput").val().toLowerCase();
        if (searchStr == "" || searchStr == null || searchStr == undefined) {
            $("[name='medias']").show();
        } else {
            var index = $("#myTab .active").index();
            if(index == 1){
                $("#pic [name='media_name']").each(function (row, num) {
                    var text = $(num).attr("title").toLowerCase();
                    if (text.indexOf(searchStr) != -1) {
                        $(num).parents("[name='medias']").show();
                    } else {
                        $(num).parents("[name='medias']").hide();
                    }
                });
            }else if(index == 0){
                $("#music [name='media_name']").each(function (row, num) {
                    var text = $(num).text().toLowerCase();
                    if (text.indexOf(searchStr) != -1) {
                        $(num).parents("[name='medias']").show();
                    } else {
                        $(num).parents("[name='medias']").hide();
                    }
                });
            }
        }
    });

    $('#worksname').on('keyup', function (evt, params) {
        if($(this).val() != ''){
            _U.toggleErrorMsg('#worksname','',false);
        }else{
            _U.toggleErrorMsg('#worksname','',true);
        }
    });

    $('select.secret').on('change', function(evt, params){
        if ($(this).val() == '1'){
            $("#privacyDiv").show();
        }else{
            $("#privacyDiv").hide();
        }
    });
    //初始化拍摄日期
    $(".form-date").datetimepicker(
        {
            language:  "zh-CN",
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            format: "yyyy-mm-dd"
        }
    );
    $(".chosen-select").chosen({
         no_results_text: "没有找到",
        max_selected_options:3,
        width:"100%"
    });
    $('.copyable').zclip({
        path: '/static/zclip/ZeroClipboard.swf',
        copy: function(){//复制内容
            return $(this).parent().prev().find('input').val();
        },
        afterCopy: function(){//复制成功
            $.zui.messager.show('复制成功', {placement: 'center', type: 'success', time: '3000', icon: 'check'});
        }
    });

    $( ".imghotspot-sortable").sortable();
    $( "#groupbyul" ).sortable({
        placeholder: "ui-state-highlight"
    });

    //初始化kindeditor
    imgtext_editor = KindEditor.create('#imgtext_editor', {
        basePath: '/static/kindeditor/',
        bodyClass : 'article-content',
        resizeType : 1,
        allowPreviewEmoticons : false,
        allowImageUpload : false,
		allowMediaUpload : false,
		allowFlashUpload : false,
		allowFileManager : false,
        items : [
            'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
            'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
            'insertunorderedlist', '|', 'emoticons', 'image', 'flash', 'media', 'link','baidumap','|','fullscreen'
        ],
        afterBlur: function(){
            imgtext_editor.sync();
            img_text_done();
        }  
    });
    imgtext_editor.clickToolbar('image', function() {
        chooseMediaResCallBack = choose_imgtext_ok;
        pauseAudioMusic();
        var imgType = "custom";
        $("#pic").html("");
        $("#music").html("");
        //查询图片媒体资源
        var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
        sb.pushData("act", 'list');
        sb.pushData("type", imgType);
        sb.pushData("media_type", '0');
        sb.submit(function () {

        }, function (data) {
            toggleMediaTab('image');
            addImageMediaRes(data);
            openMediaResObj=null;
            $("#upload_tab").show();
        });
        $("#searchMediaInput").val("");
        $("#media_icon").modal('show');
        return false;
        //editor.exec('bold');
    });
    //初始化页面数据
    init();
    //$('.container_works').css('rotate', 45);
    //$('.lyf-center-point').bind('mouseover',function(){$("#lyftest").animate({width:$(this).width()*2,height:$(this).height()*2},2000);});
    //$('.lyf-center-point').bind('mouseout',function(){$("#lyftest").animate({width:$(this).width()/2,height:$(this).height()/2},2000);});


    $('[data-toggle="tooltip"]').tooltip({});

    $('#previewModal').on('hide.zui.modal', function () {
        removepano("krpanoSWFObject");
        $('.vrshow_comment').hide();
    });

    $('#panoSettingModal').on('hide.zui.modal', function () {
        removepano("panoSettingObject");
    });

    $("input[name=switch_checkbox]").bootstrapSwitch({size: "small"});
    $('select.chosen-select').chosen({
        no_results_text: '没有找到',    // 当检索时没有找到匹配项时显示的提示文本
        disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
        search_contains: true,         // 从任意位置开始检索
        max_selected_options: 3
    });

    //重命名场景图片
    $(document).on("click", "#pics .card-heading span.card-scene-name", function (e) {
        $(this).hide();
        var value = $(this).text();
        $(this).after('<input class="form-control" type="text"/>');
        $(this).next().val(value);
        $(this).next().focus();
    });
    $(document).on("blur", "#pics .card-heading input", function (e) {
        var value = $(this).val();
        if(!value){
            _U.toggleErrorMsg(this,"不能为空",true);
            $(this).focus();
            return;
        }else{
            _U.toggleErrorMsg(this,null,false);
        }
        var resutl = renameImg($(this).parents(".col-md-3").attr('id'), $(this).val());
        if (resutl.flag) {

            var sceneGroup = $('.group-by').data('scenegroup');

            if(sceneGroup&&sceneGroup.sceneGroups && sceneGroup.sceneGroups.length > 0){
                var groups = sceneGroup.sceneGroups;
                var uuid = $(this).parents(".col-md-3").data('viewuuid');
                var flag = false;
                for(var i=0 ; i<groups.length ; i++){
                    var scenes = groups[i].scenes;
                    if(scenes&&scenes.length>0){
                        for(var j = 0 ; j<scenes.length ; j++){
                            var s = scenes[j];
                            if(s.viewuuid == uuid){
                                s.sceneTitle = value;
                                flag = true;
                                $('.group-by').data('scenegroup',sceneGroup);
                                break;
                            }
                        }
                    }
                    if(flag){
                        //重新初始化scenegroup
                        reloadSceneGroup(sceneGroup);
                        break;
                    }
                }
            }

            // for(var i = 0 ; i<scenegroup)

            var span = $(this).prev();
            $(this).remove();
            span.text(value);
            span.show();

            _U.toggleErrorMsg(this,null,false);
        } else {
            _U.toggleErrorMsg(this,result.msg==""?"重命名失败":result.msg,true);
        }
    });

    //全景图片素材点击事件
    $(document).on("click", "#panoImgList .col-sm-4", function (e) {
        console.debug(this);
        var img = $(this).find("img");
        if ($(img).hasClass("material-active")) {
            $(img).removeClass("material-active");
            $(img).prev().prop("checked", false);
        } else {
            $(img).addClass("material-active");
            $(img).prev().prop("checked", true);
        }
        var chooseNum = $("#myLgModal .modal-body > div img.material-active").length;
        console.log(chooseNum);
        $('#myLgModal .modal-footer > span > em').text(chooseNum);
    });
    //选择图片素材点击
    $(document).on("click", "#pic span img", function (e) {
        var multiselect = $(openMediaResObj).data('multiselect');
        if (!$(this).hasClass("img-selected")) {
            if(!multiselect){
                $("#pic span img.img-selected").removeClass("img-selected");
            }
            $(this).addClass("img-selected");
        }else{
            if(multiselect){
                $(this).removeClass("img-selected");
            }
        }
    });

    $(document).on("click", "[data-modalid]", function (e) {
        openMediaResObj = e.target;
        pauseAudioMusic();
        var mediaType = $(openMediaResObj).attr("data-mediatype");
        var imgType = $(openMediaResObj).attr("data-imgtype");
        $("#pic").html("");
        $("#music").html("");
        //查询图片媒体资源
        var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
        sb.pushData("act", 'list');
        sb.pushData("type", imgType);
        if(imgType == 'system'){
            sb.pushData("media_type", $(openMediaResObj).data('subtype'));
        }else{
            sb.pushData("media_type", mediaType ? mediaType : '0');
        }
        sb.submit(function () {

        }, function (data) {
            if (mediaType == '1') {
                toggleMediaTab('music');
                addMusicMediaRes(data);
            } else {
                toggleMediaTab('image');
                if (imgType == 'system') {
                    addDefMediaRes(data);
                    $("#upload_tab").hide();
                } else if (imgType == 'custom') {
                    addImageMediaRes(data);
                    $("#upload_tab").show();
                }
            }
        });
        $("#searchMediaInput").val("");
        $($(this).attr('data-modalid')).modal('show');
    });

    $("#imgUpload").fileinput({
        language: 'zh',
        showUpload: false, // hide upload button
        showRemove: false, // hide remove button
        showCancel: false,
        showPreview: true,
        showCaption: false,
        //allowedFileTypes:['image','audio'],
        allowedFileExtensions: ["jpg", "png", "mp3"],
        browseClass: "btn btn-primary",
        browseLabel: "选择音乐/图片文件",
        browseIcon: "<i class=\"icon icon-file-o\"></i> ",
        uploadUrl: up_url,
        uploadAsync: true,
        textEncoding: "UTF-8",
        layoutTemplates: {
            //progress: ''
            actions: ''
        },
        //browseClass:"btn-block",
        uploadExtraData: buildExtraData
    }).on("filebatchselected", function (event, files) {
        var mediaType = $(openMediaResObj).attr("data-mediatype");
        if(mediaType && mediaType == '1'){
            if (!checkFileAlowedExtensions(["mp3"], files[0])){
                $.zui.messager.show("请选择格式为mp3的音乐", {placement: 'center', type: 'success', time: '3000', icon: 'check'});
                $("#imgUpload").fileinput("clear");
            }else{
                $("#imgUpload").fileinput("upload");
            }
        } else {
            if (!checkFileAlowedExtensions(["jpg", "png"], files[0])){
                $.zui.messager.show("请选择格式为jpg,png的图片", {placement: 'center', type: 'success', time: '3000', icon: 'check'});
                $("#imgUpload").fileinput("clear");
            }else{
                $("#imgUpload").fileinput("upload");
            }
        }

    }).on('filebatchpreupload', function (event, data, id, index) {
        //$('#kv-success-2').html('<h4>Upload Status</h4><ul></ul>').hide();
    }).on('filebatchuploadcomplete', function () {
       
        var mediaType = $(openMediaResObj).attr("data-mediatype");
        var msg = '';
        if (mediaType == '1') {
            msg = '音乐上传成功';
            addMusicMediaRes(polist,true);
        } else {
            msg = '图片上传成功';
            addImageMediaRes(polist,true);
        }
        $.zui.messager.show(msg, {placement: 'center', type: 'success', time: '3000', icon: 'check'});
         $("#imgUpload").fileinput("clear");
        uploadFlag = true;
    });

    $('#media_icon').on('show.zui.modal', function (e) {

    });

    $('#media_icon').on('hide.zui.modal', function (e) {
        pauseAudioMusic();
    });

    $('#timeModal').on('show.zui.modal', function (e) {
        chooseMediaResCallBack = changeTimeLineMusic;
    });

    $('#firstImgModal').on('show.zui.modal', function (e) {
        chooseMediaResCallBack = changeTourGuideStartEndImg;
    });
    $('#workCover').on('click', function (e) {
        chooseMediaResCallBack = resetWorkCover;
    });

    $('#allAroundModal').on('show.zui.modal', function (e) {

    });

    $('#allAroundModal').on('hide.zui.modal', function (e) {
        slideShowTab(null);
        resetAllInput();
    });

    ex1Slider = $("#ex1").slider({tooltip: "hide"});
    ex2Slider = $("#ex2").slider({
        tooltip: 'hide'
    });
    ex3Slider = $("#ex3").slider({
        tooltip: 'hide'
    });
    ex4Slider = $("#ex4").slider({
        tooltip: 'hide'
    });

    ex1Slider.on("slide", function (data) {
        fovSlide(data.value);
    });

    ex1Slider.on("slideStop", function (data) {
        fovSlide(data.value);
        firstEyeBtnReset();
        overWriteViewSetting();
    });

    ex2Slider.on("slide", function (data) {
        fovRangeSlide(data.value);
    });

    ex2Slider.on("slideStop", function (data) {
        fovRangeSlide(data.value);
        firstEyeBtnReset();
        overWriteViewSetting();
    });

    ex3Slider.on("slide", function (data) {
        vlookatSlide(data.value);
    });

    ex3Slider.on("slideStop", function (data) {
        vlookatSlide(data.value);
        verticalEyeBtnReset();
    });

    ex4Slider.on("slide", function (data) {
        vlookatRangeSlide(data.value);
    });

    ex4Slider.on("slideStop", function (data) {
        vlookatRangeSlide(data.value);
        verticalEyeBtnReset();
        overWriteViewSetting();
    });

     //场景分组div选中
     $(document).on('click','.group-item-body>li',function(){
         $('.scene-group img:last').attr('src',$(this).find("img").attr("src"));
         var viewuuid = $(this).data("viewuuid");
         var sceneName = 'scene_'+viewuuid.toLowerCase();
         var krpano = document.getElementById('panoSettingObject');
         if(sceneName != krpano.get('xml.scene')){
             krpano.call('loadscene('+sceneName+', null, MERGE);');
         }
         $('.group-item-body>li.checked-primary').removeClass('checked-primary');
         $(this).addClass('checked-primary');
     });
    //添加全景切换热点--1-2
    $(document).on("click",".icon_text .row a",function(){
        $(this).css({"border":"2px solid #fde428"});
        $(this).addClass("icon_clicked");
        $(this).parent().siblings().find("a").css({"border":"1px solid rgba(109, 104, 104, 0.21)"});
        $(this).parent().siblings().find("a").removeClass("icon_clicked");
        $(".all-next").removeClass("btn-default").addClass("btn-primary");
        $(".all-next").attr('disabled',false);
    });

    $(document).on('click','.edit-item .caption > span',function(e){
        var self = this;
        var idx = $(e.target).index();
        var hotspotName = $(this).parents(".edit-item").data('respk');
        var krpano = document.getElementById('panoSettingObject');
        if($(this).hasClass('group-location-icon')){//定位
            var curFov = krpano.get('view.fov');
            krpano.call('looktohotspot('+hotspotName+','+curFov+')');
        }else if($(this).hasClass('group-delte')){//删除热点
            krpano.call('removehotspot('+hotspotName+');');
            krpano.call('removeplugin(' + ('tooltip_' + hotspotName) + ',true);');
            var hotspotIdx = $(e.target).parents('.btn_content').index();
            removeHotSpotData(hotspotName,hotspotIdx);
            $(this).parents(".edit-item").remove();
            resetHotspotSum();
        }else{
            if($("#allAroundModal .icon_text > div.row div.col-md-1").length == 0){
                //查询图片媒体资源
                var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
                sb.pushData("act", 'list');
                sb.pushData("type", 'system');
                sb.pushData("media_type", '0,1');
                sb.submit(function () {
                    $("#allAroundModal .icon_text > div.row").html('');
                }, function (data) {
                    addDefMediaHotSpotRes(data);
                    modifySpanClick(self);
                });
            }else{
                modifySpanClick(self);
            }
        }
    });

    //场景分组修改按钮
    $(document).on('click','.group-item .caption > span',function(e){
        var self = this;
        if($(this).hasClass('group-delte')){//删除
            if($('#groupbyul > li').length == 1){
                $.zui.messager.show('至少需要一个场景分组', {placement: 'center', type: 'warning', time: '3000', icon: 'warning-sign'});
                return;
            }
            var liIdx = $(this).parents('.group-item').index();
            var appendToObj = null;
            if(liIdx > 0){
                appendToObj = $('#groupbyul > li:eq('+(liIdx-1)+') .group-item-body');
            }else{
                appendToObj = $('#groupbyul > li:eq('+(liIdx+1)+') .group-item-body');
            }
            $(this).parents('.group-item').find('ul.group-item-body > li').each(function(){
                $(this).appendTo(appendToObj);
            });
            $('#groupbyul > li:eq('+liIdx+')').remove();
        }else{
            if($("#allAroundModal .icon_text > div.row div.col-md-1").length == 0){
                //查询图片媒体资源
                var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
                sb.pushData("act", 'list');
                sb.pushData("type", 'system');
                sb.pushData("media_type", '2');
                sb.submit(function () {
                    $("#allAroundModal .icon_text > div.row").html('');
                }, function (data) {
                    addDefMediaHotSpotRes(data);
                    sceneGroupModifySpanClick(self);
                });
            }else{
                sceneGroupModifySpanClick(self);
            }
        }
    });

    $(".all-next").click(function () {
        var isFinish = $(this).data('flag');
        if(isFinish){
            $(this).attr('disabled',true);
            var ismodify = $(this).data('ismodify');
            var idx = $('#allAroundModal').data('hotspotidx');
            if(ismodify){
                if(idx == 6){
                    modifySceneGroup();
                }else{
                    modifyHotSpotData(idx);
                }
            }else{
                newHotSpot(idx);
            }
            $("#allAroundModal").modal('hide');
        }else{
            var curStep = $('.allAround ul.hot-nav:visible > li.liclick');
            curStep.data('finish',true);
            curStep.next().click();
        }
    });

    $(".allAround .hot-nav li").click(function(e){
        if($(this).index() != 0){
            var prevStepFinishFlag = $(this).prev().data('finish');
            if(!prevStepFinishFlag){
                return;
            }
        }
        var id = $(this).data('showid');
        //if($(id).hasClass('tabshow')){
        //    return;
        //}
        slideShowTab(id);
        $(".all-next").removeClass("btn-primary").addClass("btn-default");
        $('.all-next').attr('disabled',true);
        if(($(this).index()+1) == $(this).parent().children().length || $('.all-next').data('ismodify')){//点击的li是最后一个步骤 或 是修改模式
            $('.all-next').text('完成');
            $('.all-next').data('flag',true);
        }else{
            $('.all-next').text('下一步');
            $('.all-next').data('flag',false);
        }

        $(this).css({'background':'#fde428'},200);
        $(this).siblings('.liclick').removeClass('liclick');
        $(this).addClass('liclick');
        $(this).siblings().css({'background':'#494A51'});
    });

    $(document).on('click',".scene>div",function () {
        $(this).css({'outline': '2px solid #fde428'});
        $(this).addClass('scene_clicked');
        $(this).siblings().css({'outline': 'none'});
        $(this).siblings().removeClass('scene_clicked');
        $(".all-next").removeClass("btn-default").addClass("btn-primary");
        $('.all-next').attr('disabled',false);
    });

    $("#hot_name input.form-control").keyup(function(e){
        var hotspotName = $("#hot_name input.form-control:eq(0)").val();
        var link = $("#hot_name input.form-control:eq(1)").val();
        if(hotspotName && link){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    });

    $("#word_name .form-control").keyup(function(e){
        var title = $("#word_name input.form-control").val();
        var content = $("#word_name textarea.form-control").val();
        if(title && content){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    });

    function img_text_done(){
        var title = $("#img_text_name input.form-control").val();
        var content = $("#img_text_name textarea.form-control").val();
        if(title && content){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    }
    //新增图文热点
    $("#img_text_name .form-control").keyup(function(e){
           img_text_done();
    });

    $("#speak_name .form-control").keyup(function(e){
        var title = $("#speak_name input.form-control").val();
        if(title){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    });

    $("#obj_name .form-control").keyup(function(e){
        var title = $("#obj_name input.form-control").val();
        if(title){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    });

    $("#video_name .form-control").keyup(function(e){
        var title = $("#video_name input.form-control").val();
        if(title){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    });

    $("#img_name .form-control").keyup(function(e){
        var title = $("#img_name input.form-control").val();
        if(title){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    });

    $("#group-name .form-control").keyup(function(e){
        var title = $("#group-name input.form-control").val();
        if(title){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    });

    $(".icon_text .row a").click(function(){
        $(this).css({"border":"2px solid #fde428"});
        $(this).parent().siblings().find("a").css({"border":"1px solid rgba(109, 104, 104, 0.21)"});
        $(".img-next").removeClass("btn-default").addClass("btn-primary");
        //$(".link-next").removeClass("btn-default").addClass("btn-primary").click(function(){
        //        $("#imgModal").modal('hide');
        //    });
    });

    $("#keep_eye input").click(function(){
        overWriteViewSetting();
    });

    $("#home3 input[name=special]").click(function(){
        $('#home3 input.start').prop('checked',true);
        var effectType = $(this).val();
        var krpano = document.getElementById('panoSettingObject');
        if(effectType == 'custom'){
            krpano.call('removeSunset();removeplugin(snow);');
            chooseMediaResCallBack = changeEffectImg;
        }else if(effectType == 'sunshine'){
            krpano.set("curscreen_x", $('#settingPano').width() / 2);
            krpano.set("curscreen_y", $('#settingPano').height() / 2 - 200);
            krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
            krpano.call('removeplugin(snow);removeSunset();addSunset(get(curscreen_ath),get(curscreen_atv));');
            putEffectSetting(krpano.get('xml.scene'),true,effectType,krpano.get('curscreen_ath'),krpano.get('curscreen_atv'));
        }else{
            if(isBtnClicked(3)){
                krpano.call('removeSunset();addEffect("'+effectType+'");');
            }
            putEffectSetting(krpano.get('xml.scene'),true,effectType);
        }
        resetEffectBtn();
    });


    $('#home3 input.start').click(function(){
        var krpano = document.getElementById('panoSettingObject');
        var isChecked = $(this).is(':checked');
        if(isChecked){
            $("#home3 input[name=special][value=defaultsnow]").click();
        }else{
            krpano.call('removeplugin(snow)');
            $("#home3 input[name=special]:checked").prop("checked",false);
        }
        putEffectSetting(krpano.get('xml.scene'),isChecked,$("#home3 input[name=special]:checked").val());
        resetEffectBtn();
    });

    $(document).on('click','.radar-control > .radar-control-img',function(e){
        closeRadarCircle();
        $(this).next().show();
        $(this).hide();
        var sceneName = $(this).data('scenename');
        var krpano = document.getElementById('panoSettingObject');
        if(sceneName != krpano.get('xml.scene')){
            krpano.call('loadscene('+sceneName+', null, MERGE);');
        }
    });

    $(".sandtable-window .sandtable-img-margin").click(function(e){
        if($(e.target).hasClass('sandtable-window-img')){
            var img = $(".radar-control > .radar-control-img");
            img.show();
            img.next().hide();
        }
    });

    $(document).on('mousedown','.radar-center-point',function(event){
        dragElm = event.target;
        $(document).mousemove(moveRadar);
        $(document).mouseup(moveRadarEnd);
    });

    //场景分组div选中
    $(document).on('click','#chooseSceneModal .choose-scene-col',function(){
        $("#chooseSceneModal .choose-scene-col").css({"outline":"none"});
        $("#chooseSceneModal .scene-clicked").removeClass('scene-clicked');
        $(this).css({"outline":"3px solid #fde428"});
        $(this).addClass('scene-clicked');
        $('#chooseSceneModal .modal-footer button:eq(0)').addClass('btn-primary');
        $('#chooseSceneModal .modal-footer button:eq(0)').attr('disabled',false);
    });

    //沙盘图删除
    $(document).on('click','.sand-img-cont .delete a',function(e){
        toggleSandTable(false);
        $(this).parents('.sand-img-cont').remove();
        var sandImgNum = $('#sandImg > div.sand-img-cont').length;
        if(sandImgNum == 0){
            $('#sandDesc').show();
        }
        e.stopPropagation();
    });

    //图片热点图片删除
    $(document).on('click','.imghotspot-sortable .delete a',function(e){
        $(this).parents('li').remove();
        if($('.imghotspot-sortable li').length == 0){
            toggleAllNextBtn(false);
        }
        e.stopPropagation();
    });

    //沙盘图点击
    $(document).on('click','#sandImg .sand-img-cont',function(e){
        $('#sandImg .sand-img-clicked').removeClass('sand-img-clicked');
        $(this).addClass('sand-img-clicked');
        var imgSrc = $(this).find('img').attr('src');
        $('.sandTable .sandtable-window-img').attr('src',imgSrc);
        $('.sandTable .sandtable-window-img').data('respk',$(this).data('respk'));
        initRadarCircle();
        toggleSandTable(true);
    });

    $(document).on('click','#group-scene .row .scene-group-content' ,function(e){
        if($(this).hasClass('scene-group-choosed')){
            $(this).removeClass('scene-group-choosed');
        }else{
            $(this).addClass('scene-group-choosed');
        }
        var hasChoose = $('#group-scene .row .scene-group-choosed').length > 0 ? true : false;
        if(hasChoose){
            toggleAllNextBtn(true);
        }else{
            toggleAllNextBtn(false);
        }
    });
    //语音解说设置 上传时隐藏选择按钮
    $('#myTab a[data-toggle="tab"]').on('shown.zui.tab', function (e) {
        if(e.target.text == '上传'){
           $(".confirm-choose").hide();
        }else{
            $(".confirm-choose").show();
        }
    })
    $(document).on('click',"#modal_obj #object_list .col-md-3",function(){
        var html = "";
        var type = $("#modal_obj").data('type');
        if ( type=='obj' ) {
            html =' <div class="col-md-3" id="obj_choose_ok" '+
                      '   data-objid="'+$(this).data('objid')+'" data-thumb="'+$(this).data('thumb')+'"'+
                      '  <div class="card">'+
                      '    <div class="media-wrapper">'+
                      '      <img src="'+$(this).data('thumb')+'">'+
                      '     </div>'+
                      '  </div>'+
                      ' </div>';
            $("#obj_choose_ok_wrap").html(html);
        }else if(type=='video'){
            html="您已经选择了视频："+$(this).data('name');
            $("#video_choose_ok_wrap").data('location',$(this).data('location'));
            $("#video_choose_ok_wrap").html(html);
        }
        
        $("#modal_obj").modal('hide');
        toggleAllNextBtn(true);
    })

});

function renameImg(pk_img_main, new_img_name) {
    var result = false;
    var sb = _U.getSubmit("/edit/pic", null, "ajax", true);
    sb.pushData("act","renameImg")
    sb.pushData("pk_img_main", pk_img_main);
    sb.pushData("filename", new_img_name);
    sb.submit(function () {
    }, function (data) {
        result = data;
    });
    return result;
}

function modifySpanClick(el){
    var liindex = parseInt($(el).data('liindex'));
    var hotspotidx = $(el).data('hotspotidx');
    if(liindex != undefined && hotspotidx != undefined){
        $('#allAroundModal').data('hotspotidx',hotspotidx);
        $('#allAroundModal .modal-header h3').text(hotSpotModalTitle[hotspotidx]);
        toggleHotSpotUL(hotspotidx);//显示步骤菜单
        //设置所有步骤完成
        $('.allAround ul.hot-nav:eq('+hotspotidx+') > li').data('finish',true);
        //设置修改模式
        $('.all-next').data('ismodify',true);
        //点击要更改的信息菜单项
        $('.allAround ul.hot-nav:eq('+hotspotidx+') > li:eq('+liindex+')').click();
        //将已存在的热点信息填入页面
        var hotspotName = $(el).parents('.edit-item').data('respk');
        $('.all-next').data('hotspotname',hotspotName);
        initHotSpotDataToPage(hotspotidx,hotspotName);

        $('#allAroundModal').modal('show');
    }
}

function sceneGroupModifySpanClick(el){
    var liindex = parseInt($(el).data('liindex'));
    var titleidx = $(el).data('titleidx');
    if(liindex != undefined && titleidx != undefined){
        $('#allAroundModal').data('hotspotidx',titleidx);
        $('#allAroundModal .modal-header h3').text(hotSpotModalTitle[titleidx]);
        toggleHotSpotUL(titleidx);//显示步骤菜单
        //设置所有步骤完成
        $('.allAround ul.hot-nav:eq('+titleidx+') > li').data('finish',true);
        //设置修改模式
        $('.all-next').data('ismodify',true);
        $('.all-next').data('scenegroupidx',$(el).parents('.group-item').index());
        //点击要更改的信息菜单项
        $('.allAround ul.hot-nav:eq('+titleidx+') > li:eq('+liindex+')').click();
        var imgObj = $(el).parents('.group-item-header').find('.group-item-title > img');
        var iconType = imgObj.data('icontype');
        var imgPath = imgObj.attr('src');
        var groupName = imgObj.next().text();
        if(iconType == 'system'){
            $('#allAroundModal .icon_choose input[name=radioOptionsExample]:eq(0)').click();
            //选中热点图标
            $("#icon_style .icon_text > .row a:has(img[src='"+imgPath+"'])").click();
        }else{
            $('#allAroundModal .icon_choose input[name=radioOptionsExample]:eq(1)').click();
            $("#icon_style .icon_text .media_icons img").attr('src',imgPath);
        }
        resetSceneGroupInput({groupName:groupName});

        $('#allAroundModal').modal('show');
    }
}

function newHotSpot(idx){
    switch(idx){
        case 0:
            addSceneHotSpotFinish(idx);
            break;
        case 1:
            addLinkHotSpotFinish(idx);
            break;
        case 2:
            addImgHotSpotFinish(idx);
            break;
        case 3:
            addWordHotSpotFinish(idx);
            break;
        case 4:
            addVoiceHotSpotFinish(idx);
            break;
        case 5:
           addImgTextHotSpotFinish(idx);
            break;
        case 6:
            addSceneGroupFinish(idx);
            break;
        case 7:
            addObjHotSpotFinish(idx);
            break;
        case 8:
            addVideoHotSpotFinish(idx);
            break;
    }
}

function modifyHotSpotData(hotspotidx){
    if (hotspotidx>5) --hotspotidx;
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    var hotspotName = $('.all-next').data('hotspotname');
    var data = $('#panoSettingModal .hot').data(sceneName);
    var param = {};
    getHotSpotIconData(param);
    $(data[hotSpotDataKey[hotspotidx]]).each(function(idx){
        var self = this;
        if(this.name == hotspotName){
            var hsTitle = '';
            switch(hotspotidx){
                case 0:
                    var sceneImgSrc = $('.scene > div.scene_clicked img').attr('src');
                    var imguuid = $('.scene > div.scene_clicked').data('viewuuid');
                    var sceneTitle = $('.scene > div.scene_clicked span').text();
                    param.linkedscene = imguuid==null?self.linkedscene:'scene_'+imguuid.toLowerCase();
                    param.sceneTitle = sceneTitle==""?self.sceneTitle:sceneTitle;
                    param.sceneImg = sceneImgSrc==undefined?self.sceneImg:sceneImgSrc;
                    //设置场景图片和名称
                    $('#panoSettingModal .hot .btn_content .edit-item[data-respk='+hotspotName+']').find('.group-item-title img:eq(0)').attr('src',param.sceneImg);
                    hsTitle = param.sceneTitle;
                    break;
                case 1:
                    var hotspotTitle = $('#hot_name input.form-control:eq(0)').val();
                    var link = $('#hot_name input.form-control:eq(1)').val();
                    if(link.indexOf('http://') != 0 || link.indexOf('https://') != 0){
                        link = 'http://' + link;
                    }
                    var isShowSpotName = $('#hot_name input[type=checkbox]:eq(1)').is(':checked');
                    param.hotspotTitle = hotspotTitle;
                    param.link = link;
                    param.isShowSpotName = isShowSpotName;
                    hsTitle = param.hotspotTitle;
                    break;
                case 2:
                    var hotspotTitle = $('#img_name input.form-control').val();
                    var isShowSpotName = $('#img_name input[type=checkbox]').is(':checked');
                    param.hotspotTitle = hotspotTitle;
                    param.galleryName = 'glr'+hotspotName;
                    param.isShowSpotName = isShowSpotName;
                    param.imgs = buildGalleryImgData();
                    hsTitle = param.hotspotTitle;
                    break;
                case 3:
                    var wordTitle = $('#word_name input.form-control').val();
                    var wordContent = $('#word_name textarea.form-control').val();
                    var isShowSpotName = $('#word_name input[type=checkbox]').is(':checked');
                    param.hotspotTitle = wordTitle;
                    param.wordContent = wordContent;
                    param.isShowSpotName = isShowSpotName;
                    hsTitle = param.hotspotTitle;
                    break;
                case 4:
                    var hotspotTitle = $('#speak_name input.form-control').val();
                    var musicSrc = $('#music_style p').data('musicsrc');
                    var isShowSpotName = $('#speak_name input[type=checkbox]').is(':checked');
                    param.hotspotTitle = hotspotTitle;
                    param.musicSrc = musicSrc;
                    param.isShowSpotName = isShowSpotName;
                    hsTitle = param.hotspotTitle;
                    break;
                case 5:
                    var wordTitle = $('#img_text_name input.form-control').val();
                    var wordContent = $('#img_text_name textarea.form-control').val();
                    var isShowSpotName = $('#img_text_name input[type=checkbox]').is(':checked');
                    param.hotspotTitle = wordTitle;
                    param.imgtext_wordContent = wordContent;
                    param.isShowSpotName = isShowSpotName;
                    hsTitle = param.hotspotTitle;
                    break;
                case 6:
                    var hotspotTitle = $('#obj_name input.form-control').val();
                    var objid = $('#obj_choose_ok').data('objid');
                    var isShowSpotName = $('#obj_name input[type=checkbox]').is(':checked');
                    param.hotspotTitle = hotspotTitle;
                    param.objid = objid;
                    param.thumb =  $('#obj_choose_ok').data('thumb');
                    param.isShowSpotName = isShowSpotName;
                    hsTitle = param.hotspotTitle;
                    break;
                case 7:
                    var hotspotTitle = $('#video_name input.form-control').val();
                    var isShowSpotName = $('#video_name input[type=checkbox]').is(':checked');
                    param.hotspotTitle = hotspotTitle;
                    param.objid = objid;
                    param.location =  $('#video_choose_ok_wrap').data('location');
                    param.isShowSpotName = isShowSpotName;
                    hsTitle = param.hotspotTitle;
                    break;
            }
            $.each(param,function(key,value){
                self[key] = value;
            });
            krpano.call('removehotspot('+self.name+');');
            switch(hotspotidx){
                case 0:
                    krpano.call('addSceneChangeHotSpot("'+self.imgPath+'","'+ (self.name) +'",'+self.linkedscene+','+(self.ath)+','+(self.atv)+','+self.isDynamic+',true,true)');
                    break;
                case 1:
                    krpano.call('addLinkHotSpot("'+self.imgPath+'","'+ (self.name) +'",'+html_encode(self.hotspotTitle)+','+(self.ath)+','+(self.atv)+','+self.isDynamic+',true,true,'+self.link+','+self.isShowSpotName+')');
                    break;
                case 2:
                    krpano.call('addImgHotSpot("'+self.imgPath+'","'+ (self.name) +'",'+html_encode(self.hotspotTitle)+','+(self.ath)+','+(self.atv)+','+self.isDynamic+',true,true,'+self.galleryName+','+self.isShowSpotName+')');
                    break;
                case 3:
                    krpano.call('addWordHotSpot("'+self.imgPath+'","'+ (self.name) +'",'+html_encode(self.hotspotTitle)+','+(self.ath)+','+(self.atv)+','+self.isDynamic+',true,true,'+html_encode(self.wordContent)+','+self.isShowSpotName+')');
                    break;
                case 4:
                    krpano.call('addVoiceHotSpot("'+self.imgPath+'","'+ (self.name) +'",'+html_encode(self.hotspotTitle)+','+(self.ath)+','+(self.atv)+','+self.isDynamic+',true,true,'+self.musicSrc+','+self.isShowSpotName+')');
                    break;
                case 5:
                    krpano.call('addImgTextHotSpot("'+self.imgPath+'","'+ (self.name) +'",'+html_encode(self.hotspotTitle)+','+(self.ath)+','+(self.atv)+','+self.isDynamic+',true,true,'+imgtext_encode(self.imgtext_wordContent)+','+self.isShowSpotName+')');
                    break;
                case 6:
                    krpano.call('addObjHotSpot("'+self.imgPath+'","'+ (self.name) +'",'+html_encode(self.hotspotTitle)+','+(self.ath)+','+(self.atv)+','+self.isDynamic+',true,true,'+self.objid+','+self.isShowSpotName+')');
                    break;
                case 7:
                    krpano.call('addObjHotSpot("'+self.imgPath+'","'+ (self.name) +'",'+html_encode(self.hotspotTitle)+','+(self.ath)+','+(self.atv)+','+self.isDynamic+',true,true,'+self.location+','+self.isShowSpotName+')');
                    break;
            }
            $('#panoSettingModal .hot .btn_content .edit-item[data-respk='+hotspotName+']').find('.group-item-title img.thumbimg').attr('src',param.thumbPath);
            $('#panoSettingModal .hot .btn_content .edit-item[data-respk='+hotspotName+']').find('.group-item-title span').text(hsTitle);
            return false;
        }
    });
}

function initHotSpotDataToPage(hotspotidx,hotspotName){
    if (hotspotidx>5) --hotspotidx;
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    var data = $('#panoSettingModal .hot').data(sceneName);
    var hotspotArr = data[hotSpotDataKey[hotspotidx]];
    $(hotspotArr).each(function(idx){
        if(this.name == hotspotName){
            if(this.iconType == 'system'){
                $('#allAroundModal .icon_choose input[name=radioOptionsExample]:eq(0)').click();
                //选中热点图标
                $("#icon_style .icon_text > .row a:has(img[src='"+this.thumbPath+"'])").click();
            }else{
                $('#allAroundModal .icon_choose input[name=radioOptionsExample]:eq(1)').click();
                $("#icon_style .icon_text .media_icons img").attr('src',this.imgPath);
            }
            switch(hotspotidx){
                case 0:
                    addSceneChangeHotSpotSceneArr();
                    //选中场景
                    var viewuuid = (this.linkedscene.split('_'))[1].toUpperCase();
                    $('#purpose .scene > div[data-viewuuid='+viewuuid+']').click();
                    break;
                case 1:
                    resetLinkInput(this);
                    break;
                case 2:
                    resetImgsInput(this);
                    break;
                case 3:
                    resetWordInput(this);
                    break;
                case 4:
                    resetVoiceInput(this);
                    break;
                case 5:
                    resetImgTextInput(this);
                    break;
                case 6:
                    resetObjInput(this);
                    break;
                case 7:
                    resetVideoInput(this);
                    break;
            }
            return false;
        }
    });
}

function getHotSpotIconData(param){
    var iconType = $('#icon_style .icon_choose input[name=radioOptionsExample]:checked').val();
    var hotspotType,imgSrc,imgpath;
    if(iconType == 'system'){
        hotspotType = $('.icon_text .row a.icon_clicked').data('hstype');
        imgpath = $('.icon_text .row a.icon_clicked').data('imgpath');
        //var respk = $('.icon_text .row a.icon_clicked').data('respk');
        imgSrc = $('.icon_text .row a.icon_clicked img').attr('src');
    }else{
        hotspotType = 0;
        imgpath = $('#icon_style .media_icons img').attr('src');
        imgSrc = imgpath;
    }
    param.iconType = iconType;
    param.imgPath = imgpath;
    param.thumbPath = imgSrc;
    param.isDynamic = hotspotType;
}

function addSceneHotSpotFinish(idx){
    var param = {};
    var hotspotName = getHotSpotName();
    getHotSpotIconData(param);
    var sceneImgSrc = $('.scene > div.scene_clicked img').attr('src');
    var imguuid = $('.scene > div.scene_clicked').data('viewuuid');
    var sceneTitle = $('.scene > div.scene_clicked span').text();
    var sceneName = 'scene_'+imguuid.toLowerCase();
    var krpano = document.getElementById('panoSettingObject');
    krpano.set("curscreen_x", $('#settingPano').width() / 2);
    krpano.set("curscreen_y", $('#settingPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    param.ath = krpano.get("curscreen_ath");
    param.atv = krpano.get("curscreen_atv");
    param.name = hotspotName;
    param.linkedscene = sceneName;
    param.sceneTitle = sceneTitle;
    param.sceneImg = sceneImgSrc;
    initSceneHotSpot(krpano,param,true,idx);
    putSceneChangeHotSpotData(param,idx);
}

function addLinkHotSpotFinish(idx){
    var krpano = document.getElementById('panoSettingObject');
    var param = {};
    var hotspotName = getHotSpotName();
    getHotSpotIconData(param);
    var hotspotTitle = $('#hot_name input.form-control:eq(0)').val();
    var link = $('#hot_name input.form-control:eq(1)').val();
    if(link.indexOf('http://') != 0||link.indexOf('https://')!=0){
        link = 'http://' + link;
    }
    var isShowSpotName = $('#hot_name input[type=checkbox]:eq(1)').is(':checked');
    krpano.set("curscreen_x", $('#settingPano').width() / 2);
    krpano.set("curscreen_y", $('#settingPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    param.ath = krpano.get("curscreen_ath");
    param.atv = krpano.get("curscreen_atv");
    param.name = hotspotName;
    param.hotspotTitle = hotspotTitle;
    param.link = link;
    param.isShowSpotName = isShowSpotName;
    initSceneHotSpot(krpano,param,true,idx);
    putSceneChangeHotSpotData(param,idx);
}

function addObjHotSpotFinish(idx){
    var krpano = document.getElementById('panoSettingObject');
    var param = {};
    var hotspotName = getHotSpotName();
    getHotSpotIconData(param);
    var hotspotTitle = $('#obj_name input.form-control').val();
    var isShowSpotName = $('#obj_name input[type=checkbox]').is(':checked');
    var objid = $('#obj_choose_ok').data('objid');
    krpano.set("curscreen_x", $('#settingPano').width() / 2);
    krpano.set("curscreen_y", $('#settingPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    param.ath = krpano.get("curscreen_ath");
    param.atv = krpano.get("curscreen_atv");
    param.name = hotspotName;
    param.hotspotTitle = hotspotTitle;
    param.objid = objid;
    param.thumb = $('#obj_choose_ok').data('thumb');
    param.isShowSpotName = isShowSpotName;
    initSceneHotSpot(krpano,param,true,idx);
    putSceneChangeHotSpotData(param,idx);
}
function addVideoHotSpotFinish(idx){
    var krpano = document.getElementById('panoSettingObject');
    var param = {};
    var hotspotName = getHotSpotName();
    getHotSpotIconData(param);
    var hotspotTitle = $('#video_name input.form-control').val();
    var isShowSpotName = $('#video_name input[type=checkbox]').is(':checked');
    krpano.set("curscreen_x", $('#settingPano').width() / 2);
    krpano.set("curscreen_y", $('#settingPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    param.ath = krpano.get("curscreen_ath");
    param.atv = krpano.get("curscreen_atv");
    param.name = hotspotName;
    param.hotspotTitle = hotspotTitle;
    param.location = $("#video_choose_ok_wrap").data('location');
    param.isShowSpotName = isShowSpotName;
    initSceneHotSpot(krpano,param,true,idx);
    putSceneChangeHotSpotData(param,idx);
}
function addWordHotSpotFinish(idx){
    var krpano = document.getElementById('panoSettingObject');
    var param = {};
    var hotspotName = getHotSpotName();
    getHotSpotIconData(param);
    var wordTitle = $('#word_name input.form-control').val();
    var wordContent = $('#word_name textarea.form-control').val();
    var isShowSpotName = $('#word_name input[type=checkbox]').is(':checked');
    krpano.set("curscreen_x", $('#settingPano').width() / 2);
    krpano.set("curscreen_y", $('#settingPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    param.ath = krpano.get("curscreen_ath");
    param.atv = krpano.get("curscreen_atv");
    param.name = hotspotName;
    param.hotspotTitle = wordTitle;
    param.wordContent = wordContent;
    param.isShowSpotName = isShowSpotName;
    initSceneHotSpot(krpano,param,true,idx);
    putSceneChangeHotSpotData(param,idx);
}

function addImgTextHotSpotFinish(idx){
    var krpano = document.getElementById('panoSettingObject');
    var param = {};
    var hotspotName = getHotSpotName();
    getHotSpotIconData(param);
    var wordTitle = $('#img_text_name input.form-control').val();
    var wordContent = $('#img_text_name textarea.form-control').val();
     // var content = imgtext_editor.html();
    // var wordContent = imgtext_editor.html();

    var isShowSpotName = $('#img_text_name input[type=checkbox]').is(':checked');
    krpano.set("curscreen_x", $('#settingPano').width() / 2);
    krpano.set("curscreen_y", $('#settingPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    param.ath = krpano.get("curscreen_ath");
    param.atv = krpano.get("curscreen_atv");
    param.name = hotspotName;
    param.hotspotTitle = wordTitle;
    param.imgtext_wordContent = wordContent;
    param.isShowSpotName = isShowSpotName;
    initSceneHotSpot(krpano,param,true,idx);
   putSceneChangeHotSpotData(param,idx);
}

function addVoiceHotSpotFinish(idx){
    var krpano = document.getElementById('panoSettingObject');
    var param = {};
    var hotspotName = getHotSpotName();
    getHotSpotIconData(param);
    var hotspotTitle = $('#speak_name input.form-control').val();
    var musicSrc = $('#music_style p').data('musicsrc');
    var musicTitle = $('#music_style p span:eq(1)').text();
    var isShowSpotName = $('#speak_name input[type=checkbox]').is(':checked');
    krpano.set("curscreen_x", $('#settingPano').width() / 2);
    krpano.set("curscreen_y", $('#settingPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    param.ath = krpano.get("curscreen_ath");
    param.atv = krpano.get("curscreen_atv");
    param.name = hotspotName;
    param.hotspotTitle = hotspotTitle;
    param.musicSrc = musicSrc;
    param.musicTitle = musicTitle;
    param.isShowSpotName = isShowSpotName;
    initSceneHotSpot(krpano,param,true,idx);
    putSceneChangeHotSpotData(param,idx);
}

function addImgHotSpotFinish(idx){
    var krpano = document.getElementById('panoSettingObject');
    var param = {};
    var hotspotName = getHotSpotName();
    getHotSpotIconData(param);
    var hotspotTitle = $('#img_name input.form-control').val();
    //var musicSrc = $('#music_style p').data('musicsrc');
    var isShowSpotName = $('#img_name input[type=checkbox]').is(':checked');
    krpano.set("curscreen_x", $('#settingPano').width() / 2);
    krpano.set("curscreen_y", $('#settingPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    param.ath = krpano.get("curscreen_ath");
    param.atv = krpano.get("curscreen_atv");
    param.name = hotspotName;
    param.hotspotTitle = hotspotTitle;
    param.galleryName = 'glr'+hotspotName;
    param.isShowSpotName = isShowSpotName;
    param.imgs = buildGalleryImgData();
    initSceneHotSpot(krpano,param,true,idx);
    putSceneChangeHotSpotData(param,idx);
}

function buildGalleryImgData(){
    var imgs = new Array();
    $('#imgChoose ul.imghotspot-sortable li').each(function(idx){
        var imgObj = {};
        imgObj.src = $(this).find('img').attr('src');
        imgs.push(imgObj);
    });
    return imgs;
}

function toggleAllNextBtn(flag){
    if(flag){
        $(".all-next").removeClass("btn-default").addClass("btn-primary");
        $(".all-next").attr('disabled',false);
    }else{
        $(".all-next").removeClass("btn-primary").addClass("btn-default");
        $(".all-next").attr('disabled',true);
    }
}

function slideShowTab(id){
    var showObj = $('#allAroundModal .tab-content1 > .tabshow');
    if(!id){
        showObj.css('left','105%');
        showObj.removeClass('tabshow');
        return;
    }
    showObj.animate({left:'-105%'},function(){
        showObj.css('left','105%');
    });
    showObj.removeClass('tabshow');
    $(id).animate({left:"0"});
    $(id).addClass('tabshow');
}

function initRadarCircle(){
    $('.sandtable-window .sandtable-img-margin > img.sandtable-window-img').nextAll().remove();
    var data = $('#sandImg .sand-img-clicked').data('sand-table-data');
    if(data){
        $.each(data,function(i,value){
            appendRadarCircle(i,value.sceneTitle);
            var krpano = document.getElementById('panoSettingObject');
            var sceneName =  $('.radar-control img.radar-control-img:last').data('scenename');
            if(sceneName == krpano.get('xml.scene')){
                $('.radar-control img.radar-control-img:last').click();
            }
            radarRotate(i,krpano.get('view.hlookat'));
            $('.sandtable-window .sandtable-img-margin .radar-control:last').css('top',value.top);
            $('.sandtable-window .sandtable-img-margin .radar-control:last').css('left',value.left);
        });
    }

}

function closeRadarCircle(){
    var img = $(".radar-control > .radar-control-img");
    img.show();
    img.next().hide();
}

function moveRadar(ev){
    var containerOffset = $('.sandtable-window-img').offset();
    var offsetX = containerOffset['left'];
    var offsetY = containerOffset['top'];
    var mouseX = ev.pageX - offsetX;//计算出鼠标相对于画布顶点的位置,无pageX时用clientY + body.scrollTop - body.clientTop代替,可视区域y+body滚动条所走的距离-body的border-top,不用offsetX等属性的原因在于，鼠标会移出画布
    var mouseY = ev.pageY - offsetY;
    var containerWidth = $('.sandtable-window-img').outerWidth();
    var containerHeight = $('.sandtable-window-img').outerHeight();
    if(mouseX > 10 && mouseX < (containerWidth-10)){
        $(dragElm).parents('.radar-control').css('left',(mouseX-30)+'px');
    }else if(mouseX < 10){
        $(dragElm).parents('.radar-control').css('left','-20px');
    }else if(mouseX > (containerWidth-10)){
        $(dragElm).parents('.radar-control').css('left',(containerWidth-10-30)+'px');
    }
    if(mouseY > 10 && mouseY < (containerHeight-10)){
        $(dragElm).parents('.radar-control').css('top',(mouseY-30)+'px');
    }else if(mouseY < 10){
        $(dragElm).parents('.radar-control').css('top','-20px');
    }else if(mouseY > (containerHeight-10)){
        $(dragElm).parents('.radar-control').css('top',(containerHeight-10-30)+'px');
    }
}

function percentNum(num, total) {
    return (Math.round(num / total * 10000) / 100.00 + "%"); //小数点后两位百分比
}

function moveRadarEnd(e){
    var leftPx = $(dragElm).parents('.radar-control').position().left;
    var topPx = $(dragElm).parents('.radar-control').position().top;
    var krpano = document.getElementById('panoSettingObject');
    putSandTableData(krpano.get('xml.scene'),null,null,null,topPx,leftPx);
    $(document).unbind('mousemove',moveRadar);
    $(document).unbind('mouseup',moveRadarEnd);
}

function openSandTable(){
    chooseMediaResCallBack = chooseSandTableImg;
}

function toggleSandtableWindowSize(increase){
    setRadarCirclePosition();
    var window = $(".sandTable .sandtable-window");
    var isBig = window.hasClass("big-window");
    if(isBig){
        var img = window.find('.sandtable-img-margin');
        $(img).css('width',$(img).outerWidth()-increase);
        $(img).css('height',$(img).outerHeight()-increase);
        var lowWidth = window.outerWidth()-increase;
        window.css('width',lowWidth);
        window.css('top',240);
        window.css('left',0);
        window.removeClass('big-window');
        window.find('a').text("放大");
    }else{
        var bigWidth = window.outerWidth()+increase;
        window.css('width',bigWidth);
        window.css('top',0);
        window.css('left',(bigWidth+10)*-1);
        var img = window.find('.sandtable-img-margin');
        $(img).css('width',$(img).outerWidth()+increase);
        $(img).css('height',$(img).outerHeight()+increase);
        window.addClass('big-window');
        window.find('a').text("缩小");
    }
}

//转化雷达偏移量为百分比
function setRadarCirclePosition(){
    var data = $('.sand-img-clicked').data('sand-table-data');
    $.each(data,function(sceneName,value){
        $('.radar-control-img[data-scenename='+sceneName+']').parent().css('top',value.top);
        $('.radar-control-img[data-scenename='+sceneName+']').parent().css('left',value.left);
    });
}

function removeHotSpotData(hotspotName,idx){
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    var data = $('#panoSettingModal .hot').data(sceneName);
    if(data){
        var arr = data[hotSpotDataKey[idx]];
        for(var i=0;i<arr.length;i++){
            if(arr[i].name == hotspotName){
                arr.splice(i,1);
                i--;
            }
        }
    }
}

function getHotSpotName(){
    var name = 'schp_'+randomString(10);
    var krpano = document.getElementById('panoSettingObject');
    var hotspot = krpano.get('hotspot['+name+']');
    if(hotspot){
        name = getHotSpotName();
    }
    return name;
}

function putSceneChangeHotSpotData(hotspotObj,idx){
    if (idx>5) --idx;
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    var data = $('#panoSettingModal .hot').data(sceneName);
    if(!data){
        data = {
            scene:[],
            link:[],
            image:[],
            text:[],
            voice:[],
            imgtext:[],
            obj:[],
            video:[]
        };
        $("#panoSettingModal .hot").data(sceneName, data);
    }
    if (!data[hotSpotDataKey[idx]]) {
        data[hotSpotDataKey[idx]] = [];
    }
    
    data[hotSpotDataKey[idx]].push(hotspotObj);
}

function resetHotspotSum(idx){
    if(idx){
        $(".content_index > div.btn_content:eq("+idx+") > h5 > label").text($('div.all-edit:eq('+idx+')').find('.edit-item').length);
        var sum = $('div.all-edit:eq('+idx+')').find('.edit-item').length;
        if(sum == 0){
            $('div.all-edit:eq('+idx+')').prev().show();
        }
    }else{
        $(".content_index > div.btn_content").each(function(index){
            $(this).find('h5 > label').text($('div.all-edit:eq('+index+')').find('.edit-item').length);
            var sum = $('div.all-edit:eq('+index+')').find('.edit-item').length;
            if(sum == 0){
                $('div.all-edit:eq('+index+')').prev().show();
            }
        });
    }
}

//添加场景跳转热点
function openAddHotSpot(idx){
    $('#allAroundModal').data('hotspotidx',idx);
    //查询图片媒体资源
    var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
    sb.pushData("type", 'system');
    sb.pushData("media_type", '0,1');
    sb.pushData("act", 'list');
    sb.submit(function () {
        $("#allAroundModal .icon_text > div.row").html('');
    }, function (data) {
        $('#allAroundModal .icon_choose input[name=radioOptionsExample]:eq(0)').click();
        addDefMediaHotSpotRes(data);
        addSceneChangeHotSpotSceneArr();
        resetHotSpotCustomIcon();
        $('#allAroundModal .modal-header h3').text(hotSpotModalTitle[idx]);
        toggleHotSpotUL(idx);
        $('.all-next').data('ismodify',false);
        $(".allAround ul.hot-nav:eq("+idx+")>li:nth-child(1)").click();
        $(".allAround ul.hot-nav:eq("+idx+")>li").data('finish',false);
        $('#allAroundModal').modal('show');
    });
     // $('#allAroundModal').modal('show');
}

function resetHotSpotCustomIcon(){
    $('#icon_style .media_icons img').attr('src',"/static/images/kr/default2-120x120.png");
}

function resetAllInput(){
    $('#purpose .scene').html('');
    $('#group-scene .scenegrouprow').html('');
    resetLinkInput();
    resetWordInput();
    resetVoiceInput();
    resetImgsInput();
    resetSceneGroupInput();
    resetImgTextInput();
    resetObjInput();
    resetVideoInput();
}

function resetSceneGroupInput(data){
    if(data){
        $('#group-name input.form-control').val(data.groupName);
    }else{
        $('#group-name input.form-control').val('');
    }
}

function resetLinkInput(data){
    if(data){
        $('#hot_name input.form-control:eq(0)').val(data.hotspotTitle);
        $('#hot_name input.form-control:eq(1)').val(data.link);
        $('#hot_name input[type=checkbox]:eq(0)').prop('checked',true);
        $('#hot_name input[type=checkbox]:eq(1)').prop('checked',data.isShowSpotName);
    }else{
        $('#hot_name input.form-control').val('');
        $('#hot_name input[type=checkbox]:eq(0)').prop('checked',true);
        $('#hot_name input[type=checkbox]:eq(1)').prop('checked',false);
    }
}

function resetWordInput(data){
    if(data){
        $('#word_name input.form-control').val(data.hotspotTitle);
        $('#word_name textarea.form-control').val(data.wordContent);
        $('#word_name input[type=checkbox]').prop('checked',data.isShowSpotName);
    }else{
        $('#word_name .form-control').val('');
        $('#word_name input[type=checkbox]').prop('checked',false);
    }
}

function resetImgTextInput(data){
    if(data){
        $('#img_text_name input.form-control').val(data.hotspotTitle);
        $('#img_text_name textarea.form-control').val(data.wordContent);
        imgtext_editor.html(data.imgtext_wordContent);
        $('#img_text_name input[type=checkbox]').prop('checked',data.isShowSpotName);
    }else{
        $('#img_text_name .form-control').val('');
        $('#img_text_name input[type=checkbox]').prop('checked',false);
        imgtext_editor.html("");
    }
}
function resetVoiceInput(data){
    if(data){
        $('#speak_name input.form-control').val(data.hotspotTitle);
        $('#speak_name input[type=checkbox]').prop('checked',data.isShowSpotName);
        $('#music_style p span:eq(0)').text('已选择音乐：');
        $('#music_style p span:eq(1)').text(data.musicTitle);
        $('#music_style p').data('musicsrc',data.musicSrc);
    }else{
        $('#speak_name input.form-control').val('');
        $('#speak_name input[type=checkbox]').prop('checked',false);
        $('#music_style p span:eq(0)').text('还未选择音乐');
        $('#music_style p span:eq(1)').text('');
        $('#music_style p').data('musicsrc',null);
    }
}

function resetObjInput(data){
    if(data){
        $('#obj_name input.form-control').val(data.hotspotTitle);
        $('#obj_name input[type=checkbox]').prop('checked',data.isShowSpotName);
          var html =' <div class="col-md-3" id="obj_choose_ok" style="margin-top:10px;margin-left:-10px;" '+
                  '   data-objid="'+data.objid+'" data-thumb="'+data.thumb+'"'+
                  '  <div class="card">'+
                  '    <div class="media-wrapper">'+
                  '      <img src="'+data.thumb+'">'+
                  '     </div>'+
                  '  </div>'+
                  ' </div>';
        $("#obj_choose_ok_wrap").html(html);
    }else{
        $('#obj_name input.form-control').val('');
        $('#obj_name input[type=checkbox]').prop('checked',false);
        $("#obj_choose_ok_wrap").html("");
    }
}
function resetVideoInput(data){
    if(data){
        $('#video_name input.form-control').val(data.hotspotTitle);
        $('#video_name input[type=checkbox]').prop('checked',data.isShowSpotName);
        html="您已经选择了视频："+data.name;
        $("#video_choose_ok_wrap").data('location',data.location);
        $("#video_choose_ok_wrap").html(html);
    }else{
        $('#video_name input.form-control').val('');
        $('#video_name input[type=checkbox]').prop('checked',false);
        $("#video_choose_ok_wrap").html("");
    }
}
function resetImgsInput(data){
    if(data){
        $('#img_name input.form-control').val(data.hotspotTitle);
        $('#img_name input[type=checkbox]').prop('checked',data.isShowSpotName);
        $(data.imgs).each(function(idx){
            var html = '<li>'+
                '<img src="'+this.src+'">'+
                '<span class="delete"><a href="javascript:void(0)">删除</a></span>'+
                '</li>';
            $('#imgChoose ul.imghotspot-sortable').append(html);
        });
    }else{
        $('#img_name input.form-control').val('');
        $('#img_name input[type=checkbox]').prop('checked',false);
        $('#imgChoose ul.imghotspot-sortable').html('');
    }
}

function toggleHotSpotUL(idx){
    $(".allAround ul.hot-nav-show").hide();
    $(".allAround ul.hot-nav-show").removeClass('hot-nav-show');
    $(".allAround ul.hot-nav:eq("+idx+")").show();
    $(".allAround ul.hot-nav:eq("+idx+")").addClass('hot-nav-show');
}

//添加超链接热点
function openLinkHotSpot(){
    //查询图片媒体资源
    var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
    sb.pushData("act", 'list');
    sb.pushData("type", 'system');
    sb.pushData("media_type", '0,1');
    sb.submit(function () {
        $("#allAroundModal .icon_text > div.row").html('');
        $('#purpose .scene').html('');
    }, function (data) {
        $('#allAroundModal .icon_choose input[name=radioOptionsExample]:eq(0)').click();
        addDefMediaHotSpotRes(data);
        addSceneChangeHotSpotSceneArr();
        $(".allAround .hot-nav>div:nth-child(1)").click();
        $('#allAroundModal').modal('show');
    });
}

function addSceneChangeHotSpotSceneArr(){
    $("#pics > div").each(function (idx) {
        var htmlStr = '<div class="col col-md-3" data-viewuuid="' + $(this).attr("data-viewuuid") + '">'+
            '<div><img src="'+$(this).find("img").attr("src")+'">&nbsp;&nbsp;<span>'+$(this).find(".card-heading > span:eq(1)").text()+'</span></div>'+
            '</div>';
        $('#purpose .scene').append(htmlStr);
        var sceneGroupStr = '<div class="col-md-4">'+
            '<div class="scene-group-content" data-viewuuid="'+$(this).attr("data-viewuuid")+'">'+
            '<img src="'+$(this).find("img").attr("src")+'">'+
            '<div class="scenetitle">'+$(this).find(".card-heading > span:eq(1)").text()+'</div>'+
            '</div>'+
            '</div>';
        $('#group-scene .scenegrouprow').append(sceneGroupStr);
    });
}

function addDefMediaHotSpotRes(data) {
    $(data).each(function (idx) {
        var type = this.type;
        var htmlStr = '<div class="col-md-1" style="padding-top:5px;padding-bottom:5px" title="' + (this.title + this.suffix) + '">'+
            '<a href="javascript:void(0)" data-hstype="'+type+'" data-imgpath="'+this.absolutelocation+'" data-respk="' + this.pk_defmedia_main + '" >'+
            '<img alt="..." src="' + (type != '1' ? this.absolutelocation : this.thumb_path) + '" width="100%" height="100%">'+
            '</a>'+
            '</div>';
        $("#allAroundModal .icon_text > div.row").append(htmlStr);
    });
}


function putEffectSetting(sceneName,isOpen,effectType,effectImgPath,ath,atv){
    var effectObj = {};
    effectObj.sceneName = sceneName;
    effectObj.isOpen = isOpen;
    if(isOpen){
        effectObj.effectType = effectType;
        if(effectImgPath){
            effectObj.effectImgPath = effectImgPath;
        }
        if(effectType == 'sunshine'){
            effectObj.ath = ath;
            effectObj.atv = atv;
        }
    }
    $("#panoSettingModal .specialEffect").data(sceneName,effectObj);
}
function overWriteViewSetting(){
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    putLookatSetting(sceneName,null,null);
}
 function fovSlide(value) {
    var min = $("#first_eye input.form-control:eq(1)").val();
    var max = $("#first_eye input.form-control:eq(2)").val();
    if (value < min) {
        value = min;
        ex1Slider.slider("setValue", parseInt(value));
    } else if (value > max) {
        value = max;
        ex1Slider.slider("setValue", parseInt(value));
    }
    $("#first_eye input.form-control:eq(0)").val(value);
    var krpano = document.getElementById('panoSettingObject');
    krpano.set("view.fov", value);
}

function fovRangeSlide(rangeArr) {
    var fov = parseInt($("#first_eye input.form-control:eq(0)").val());
    var min = rangeArr[0];
    var max = rangeArr[1];
    if (fov < min) {
        min = fov;
        ex2Slider.slider("setValue", [min, max]);
    } else if (fov > max) {
        max = fov;
        ex2Slider.slider("setValue", [min, max]);
    }
    $("#first_eye input.form-control:eq(1)").val(min);
    $("#first_eye input.form-control:eq(2)").val(max);
    var krpano = document.getElementById('panoSettingObject');
    krpano.set("view.fovmin", min);
    krpano.set("view.fovmax", max);
}

function fovOnBlur(el) {
    var val = parseInt($(el).val());
    var rangeData = ex2Slider.slider("getValue");
    if (val < rangeData[0]) {
        val = rangeData[0];
        $(el).val(val);
    } else if (val > rangeData[1]) {
        val = rangeData[1];
        $(el).val(val);
    }
    ex1Slider.slider("setValue", val, true);
    firstEyeBtnReset();
    overWriteViewSetting();
}

function fovRangeOnBlur(el, isMin) {
    var fov = ex1Slider.slider("getValue");
    var val = parseInt($(el).val());
    var rangeData = ex2Slider.slider("getValue");
    if (isMin) {
        if (val > fov) {
            val = fov;
            $(el).val(val);
        }
        ex2Slider.slider("setValue", [val, rangeData[1]], true);
    } else {
        if (val < fov) {
            val = fov;
            $(el).val(val);
        }
        ex2Slider.slider("setValue", [rangeData[0], val], true);
    }
    firstEyeBtnReset();
    overWriteViewSetting();
}

function vlookatSlide(value) {
    var min = $("#vertical_eye input.form-control:eq(1)").val();
    var max = $("#vertical_eye input.form-control:eq(2)").val();
    if (value < min) {
        value = min;
        ex3Slider.slider("setValue", parseInt(value));
    } else if (value > max) {
        value = max;
        ex3Slider.slider("setValue", parseInt(value));
    }
    $("#vertical_eye input.form-control:eq(0)").val(value);
    var krpano = document.getElementById('panoSettingObject');
    krpano.set("view.vlookat", value * -1);
}

function vlookatRangeSlide(rangeArr) {
    var fov = parseInt($("#vertical_eye input.form-control:eq(0)").val());
    var min = rangeArr[0];
    var max = rangeArr[1];
    if (fov < min) {
        min = fov;
        ex4Slider.slider("setValue", [min, max]);
    } else if (fov > max) {
        max = fov;
        ex4Slider.slider("setValue", [min, max]);
    }
    $("#vertical_eye input.form-control:eq(1)").val(min);
    $("#vertical_eye input.form-control:eq(2)").val(max);
    var krpano = document.getElementById('panoSettingObject');
    krpano.set("view.vlookatmax", -1 * min);
    krpano.set("view.vlookatmin", -1 * max);
}

function vlookatOnBlur(el) {
    var val = parseInt($(el).val());
    var rangeData = ex4Slider.slider("getValue");
    if (val < rangeData[0]) {
        val = rangeData[0];
        $(el).val(val);
    } else if (val > rangeData[1]) {
        val = rangeData[1];
        $(el).val(val);
    }
    ex3Slider.slider("setValue", val, true);
    verticalEyeBtnReset();
}

function vlookatRangeOnBlur(el, isMin) {
    var fov = ex3Slider.slider("getValue");
    var val = parseInt($(el).val());
    var rangeData = ex4Slider.slider("getValue");
    if (isMin) {
        if (val > fov) {
            val = fov;
            $(el).val(val);
        }
        ex4Slider.slider("setValue", [val, rangeData[1]], true);
    } else {
        if (val < fov) {
            val = fov;
            $(el).val(val);
        }
        ex4Slider.slider("setValue", [rangeData[0], val], true);
    }
    verticalEyeBtnReset();
    overWriteViewSetting();
}

function pauseAudioMusic() {
    $("audio").each(function (idx) {
        this.pause();
    });
    $("button.voice-music-play").text('试听');
}

function toggleMediaTab(mediaType) {
    if (mediaType == 'image') {
        $('#media_icon #myTab > li:eq(0)').hide();
        $('#media_icon #myTab > li:eq(1)').show();
        $('#media_icon #myTab > li:eq(1) > a').click();
        $('#imgUpload').prev().text("选择图片文件");
        $('#mediaTyPrompt').text("上传文件格式：图片：png、jpg格式。");
        $('#imgUpload').attr("accept","image/jpeg,image/png");
    } else {
        $('#media_icon #myTab > li:eq(0)').show();
        $('#media_icon #myTab > li:eq(1)').hide();
        $('#media_icon #myTab > li:eq(0) > a').click();
        $('#imgUpload').prev().text("选择音乐文件");
        $('#mediaTyPrompt').text("上传文件格式：音乐：MP3格式。");
        $('#imgUpload').attr("accept","audio/*");
    }
}

function changeShadeImg(data) {
    $(openMediaResObj).parent().next().find("img").attr("src", data.src);
    $(openMediaResObj).parent().next().children("div:last").children(":first").text(data.title);
    $(openMediaResObj).parent().next().show();
    $(openMediaResObj).parent().prev().find("input").prop("checked", false);
}

function changeEffectImg(data){
    var krpano = document.getElementById('panoSettingObject');
    krpano.call('addEffect("custom","'+data.src+'")');
    putEffectSetting(krpano.get('xml.scene'),true,'custom',data.src);
}


function addImageMediaRes(data,isPreAppend) {
    $(data).each(function (idx) {
       var thumbnail = global_storage=='qiniu'?"":"?x-oss-process=image/resize,m_lfit,h_100,w_100";
        var html = '<span name = "medias"><img src="' + this.absolutelocation +thumbnail+ '" ' +
            'data-key="'+this.media_path+'" ' +
            'data-respk="' + this.pk_media_res + '" ' +
            'title="' + (this.media_name +  this.media_suffix) + '"' +
            'name = "media_name"></span>';
        if(isPreAppend){
            $("#pic").prepend(html);
        }else{
            $("#pic").append(html);
        }

    });
}

function addMusicMediaRes(data,isPreAppend) {
    $(data).each(function (idx) {
        var html = '<div class="row link-row" name="medias">' + '<div class="col-md-1">' +
            '<input type="radio" name="musicChooseRadio" style="margin-top:20px">' +
            '</div>' +
            '<label class="col-md-3 control-label" name="media_name">' + (this.media_name +  this.media_suffix) + '</label>' +
            '<div class="col-md-8">' +
            '<audio controls="controls" src="' + this.absolutelocation + '" preload="none" onplay="pauseOther(this)"></audio>' +
            '</div>' +
            '</div>';
        if(isPreAppend){
            $("#music").prepend(html);
        }else{
            $("#music").append(html);
        }
    });
}
function pauseOther(obj){
    $("audio").each(function (idx) {
        if(this!=obj)
        this.pause();
    });
    //obj.play();
}
function addDefMediaRes(data) {
    $(data).each(function (idx) {
        var html = '<span name="medias"><img src="' + this.absolutelocation + '" ' +
            'data-respk="' + this.pk_defmedia_main + '" ' +
            'title="' + (this.title +  this.media_suffix) + '"' +
            'name = "media_name"></span>';
        $("#pic").append(html);
    });
}
var pic_tokenObj = {};
function buildExtraData_pic() {
    if (pic_tokenObj.token) {
        return pic_tokenObj;
    }
    var sb = _U.getSubmit('', null, 'ajax', true);
    sb.pushData("pk_works_main", pk_works_main);
    sb.submit(function () {
    }, function (data) {
        var token = data.token;
        pic_tokenObj.token = token;
        pic_tokenObj.key = data.key;
        pic_tokenObj.bucket = data.bucket;
        $("#thumbpath").attr("data-location", data.worksMainPO.absolutelocation);
    });
    return pic_tokenObj;
}

var tokenObj = {};
var polist = [];
var uploadFlag = false;
function buildExtraData() {
    if (tokenObj.key || uploadFlag) {
        //已经上传成功
        if (uploadFlag) {
            tokenObj = {};
            polist = [];
            uploadFlag = false;
        }
        return tokenObj;
    }
    var files = $('#imgUpload').fileinput('getFileStack');
    if (files.length>0) {
        var sb = _U.getSubmit('/get_token.php', null, 'ajax', true);
        var name = files[0].name;
        var size = files[0].size;
        var mediaType = $(openMediaResObj).attr("data-mediatype");
        sb.pushData("mediaType", $(openMediaResObj).attr("data-mediatype")?$(openMediaResObj).attr("data-mediatype"):'0');
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
            polist = data.medias;
            $("#headPortrait").attr("data-key", data.prefix);
        });
        return tokenObj;
    }
}

function addTourGuidePoint(sceneName, sceneTitle, tourpointName, idx ,moveTime,musicTitle,musicSrc,ath,atv) {
    if ($("#home5>div").length > 0) {
        var lastSceneName = $('#home5 .circle_blue:last').data('scenename');
        if (lastSceneName == sceneName) {
            $("#home5").append('<div class="line_add"><div class="square_blue" data-target="#timeLineSetting" data-toggle="popover" data-placement="top" data-trigger="manual" data-container="#panoSettingObject"></div></div>');
        } else {
            $("#home5").append('<div class="line_add"><div class="square_red" data-target="#tourSceneSkip" data-toggle="popover" data-placement="top" data-trigger="manual" data-container="#panoSettingObject"></div></div>');
        }
    }
    $("#home5").append('<div class="circle_blue" data-target="#clickDelete" data-toggle="popover" data-placement="top" data-trigger="manual" data-container="#panoSettingObject" data-scenename="' + sceneName + '" data-scenetitle="' + sceneTitle + '" data-tourpointname="' + tourpointName + '" data-movetime="'+moveTime+'" data-musictitle="'+musicTitle+'">' + (idx) + '</div>');
    if(musicSrc){
        $('#home5 .circle_blue:last').data('musicsrc',musicSrc);
    }
    if(ath){
        $('#home5 .circle_blue:last').data('ath',ath);
    }
    if(atv){
        $('#home5 .circle_blue:last').data('atv',atv);
    }
    $("[data-toggle='popover']").popover();
}

$(document).ready(function () {
    _U.mapMarkModal({
        callback: function (data) {
            if (data) {
                $(mapModalEl).prev().text("已设置导航终点");
            } else {
                $(mapModalEl).prev().text("未设置导航终点");
            }
            $(mapModalEl).data("locationData", data);
        }
    });

    $(".remove").click(function () {
        $(this).parent().parent().siblings().toggle();
        $(this).parent().toggle();
    });
    $(".labels>div").click(function () {
        var num = $(this).index();
        $(this).parent().siblings().children().eq(num).css("display", "block");
        $(this).parent().hide();
    });
    //未知作用
    // $('.add_link img').click(function () {
    //     $("#system_icon").modal('show');
    //     $("#myLinkModal").modal('hide');
    // });
    // $("#system_icon p").click(function () {
    //     $("#system_icon").modal('toggle');
    //     $("#myLinkModal").modal('show');
    // });
    // $(".icon_word").click(function () {
    //     $("#system_icon").modal('show');
    //     $("#myLinkModal").modal('hide');
    // });
    $(document).on("click", ".icon_media", function () {
        $("#media_icon").modal('show');
    });
    $("#upload_tab").click(function () {
        $(".find").hide();
    });
    $("#music_tab").click(function () {
        $(".find").show();
    });
    $(".img_tab").click(function () {
        $(".find").show();
    });

    $(".check").click(function () {
        $(this).parent().siblings().children("input").attr("checked", false);
    })
    $(".inputChoose .icon").click(function () {
        $(this).toggleClass(function () {
            return 'icon icon-pause'
        });
    });

    $(".pano-setting-container button").click(function () {
        var n = $(this).index();
        var objM = $(".pano-setting-content>div").eq(n);
        objM.siblings().animate({right: '-320px'}, 1);
        objM.animate({right: '180px'}, "fast");
        objM.animate({right: '160px'}, "fast");
        //$(this).css({'background-color': '#fde428'});
        //$(this).siblings().css({'background': '#222'});
        $(this).siblings('.setting-btn-clicked').removeClass('setting-btn-clicked');
        $(this).addClass('setting-btn-clicked');
        if (n == 0) {
            $(".square_eye").show();
            $(".eyes a:eq(0)").click();
        }else {
            $(".square_eye").hide();
        }
        var krpano = document.getElementById("panoSettingObject");
        var sceneName = krpano.get('xml.scene');
        if(n == 1){
            toggleHotSpot(true);//显示热点
        }else{
            toggleHotSpot(false);//隐藏热点
        }
        if(n == 3){
            //打开特效
            var effectObj = $("#panoSettingModal .specialEffect").data(sceneName);
            // if(effectObj.isOpen){
            //     krpano.call('addEffect('+effectObj.effectType+')');
            // }
            if(effectObj.isOpen){
                if(effectObj.effectType == 'sunshine'){
                    krpano.call('addSunset('+effectObj.ath+','+effectObj.atv+')');
                }else{
                    krpano.call('addEffect('+effectObj.effectType+')');
                }
            }
        }else{
            //关闭特效
            var krpano = document.getElementById("panoSettingObject");
            krpano.call('removeplugin(snow)');
        }
        if (n == 4) {
            $(".timer").show();
            //显示导览热点
            toggleTourGuideHotSpot(true);
        }else {
            $(".timer").hide();
            $("#home5 .circle_blue").popover('hide');
            //隐藏导览热点
            toggleTourGuideHotSpot(false);
        }
    });

    $(".eyes a").click(function () {
        var href = $(this).attr("href");
        if (href == '#keep_eye') {
            $(".square_eye").show();
        } else {
            $(".square_eye").hide();
        }
    });

    $("#home1>button").click(function () {
        var i = $(this).index();
        var objI = $(".content_index>div").eq(i - 1);
        objI.siblings().css({'top': '0', 'opacity': '0'});
        objI.animate({top: '280px', opacity: '0.2'}, 100);
        objI.animate({top: '310px', opacity: '1'}, 100);
    });
    //系统图标和媒体图标
    $(".icon_choose>.radio").click(function () {
        var m = $(this).index();
        //if(m == 0){
        //    $(".icon_text .row a.icon_clicked").removeClass("icon_clicked");
        //}
        $(".icon_text>div").eq(m).show();
        $(".icon_text>div").eq(m).siblings().hide();
    });
    //点击导览节点
    $(document).on("click", ".circle_blue", function (e) {
        $(e.target).siblings('.circle_blue').popover('hide');
        var scenetitle = $(e.target).data('scenetitle');
        $('#clickDelete .popover-title span').text(scenetitle);
        $(e.target).popover('show');
        $(".tour-clicked").css('background','white');
        var krpano = document.getElementById('panoSettingObject');
        var lastTourpointname = $(".tour-clicked").data('tourpointname');
        krpano.set('layer[tooltip_'+lastTourpointname+'].background',false);
        $('.tour-clicked').removeClass('tour-clicked');
        $(e.target).css({"background": "#005fcc"});
        $(e.target).addClass('tour-clicked');
        //切换场景、移动视角
        var sceneName = krpano.get('xml.scene');
        var clickSceneName = $(e.target).data('scenename');
        var tourpointname = $(e.target).data('tourpointname');
        krpano.set('layer[tooltip_'+tourpointname+'].background',true);
        if(sceneName != clickSceneName){
            krpano.call('loadscene('+clickSceneName+', null, MERGE);');
        }else{
            var curFov = krpano.get('view.fov');
            krpano.call('looktohotspot('+tourpointname+','+curFov+'))');
        //,tween(easeInOutQuad,'+parseInt($(e.target).data('movetime'))+'
        }

        //$('#confirmModal').modal('show');
        //var numo = $(this).find("label");
        //var divo = $(this)
        //var divo_next = $(this).next().next();
        //var div0_pre = $(this).prev();
        //$("#yes").click(function () {
        //    divo.remove();
        //    divo_next.remove();
        //    if (divo_next.length == 0) {
        //        div0_pre.remove();
        //    }
        //    $("#home5>div:last").css({'background': '#005fcc'});
        //});
    });
    $("#cancel").click(function () {
        var circle = $(".circle_blue");
        for (var i = 0; i < circle.length; i++) {
            circle[i].style.backgroundColor = 'white';
        }
        $("#home5>div:last").css({'background': '#005fcc'});

    });
    //时间线限制
    $(document).on("click", "#home5 .square_blue", function (e) {
        var circleBlue = $(e.target).parent().next('.circle_blue');
        var movetime = circleBlue.data('movetime');
        var musictitle = circleBlue.data('musictitle');
        var musicsrc = circleBlue.data('musicsrc');
        $('#timeModal').data('musicsrc',musicsrc);
        $('#timeModal .modal-body input').val(movetime);
        $('#timeModal .modal-body .time-line-music').text(musictitle);
        $('#timeModal').data('circleblue',circleBlue);
        if(musicsrc){
            $('#timeModal .modal-body .timelinemusicdelete').show();
        }else{
            $('#timeModal .modal-body .timelinemusicdelete').hide();
        }
        $("#timeModal").modal('show');
    });
    //添加节点

    $(document).on("click", "#add_node", function () {
        var krpano = document.getElementById('panoSettingObject');
        var sceneName = krpano.get('xml.scene');
        var sceneTitle = krpano.get('scene[get(xml.scene)].title');
        var tourpointName = 'tourpoint_'+tourPointIdx;
        addTourGuidePoint(sceneName, sceneTitle, tourpointName, tourPointIdx,5,'无',null,null,null);
        //添加导览热点到场景
        addTourGuideHotSpot(krpano,tourpointName,null,null,tourPointIdx,true);
        $('#home5 .circle_blue:last').click();
        tourPointIdx++;
        $("[data-toggle='tooltip']").tooltip();
    });

    //应用场景特效
    $(".applicate").click(function(){
        var html_new='<label style="color: #005fcc" class="applicate">已应用到全部场景</label>';
        $(this).replaceWith(html_new);
        $(".start").click(function () {
            var html_old = '<label class="applicate">应用到全部场景</label>';
            $(this).siblings().replaceWith(html_old);
            $(".applicate").click(function () {
                var html_new = '<label style="color: #005fcc" class="applicate">已应用到全部场景</label>';
                $(this).replaceWith(html_new);
            })
        });
    });

    $(document).on('mouseover','#home5 .square_blue', function (e) {
        var circleBlue = $(e.target).parent().next('.circle_blue');
        var movetime = circleBlue.data('movetime');
        var musictitle = circleBlue.data('musictitle');
        $('#timeLineSetting .popover-content span:eq(0)').text(movetime);
        $('#timeLineSetting .popover-content span:eq(1)').text(musictitle);
        $(e.target).popover('show');
    });

    $(document).on('mouseout','#home5 .square_blue', function (e) {
        $(e.target).popover('hide');
    });

    $(document).on('mouseover','#home5 .square_red', function (e) {
        var prevSceneName = $(e.target).parent().prev('.circle_blue').data('scenetitle');
        var nextSceneName = $(e.target).parent().next('.circle_blue').data('scenetitle');
        $('#tourSceneSkip .popover-content span:eq(0)').text(prevSceneName);
        $('#tourSceneSkip .popover-content span:eq(1)').text(nextSceneName);
        $(e.target).popover('show');
    });

    $(document).on('mouseout','#home5 .square_red', function (e) {
        $(e.target).popover('hide');
    });
});

function toggleHotSpot(flag){
    var krpano = document.getElementById("panoSettingObject");
    var sceneName = krpano.get("xml.scene");
    var data = $('#panoSettingModal .hot').data(sceneName);
    $.each(data,function(hotspotType,hotspotArr){
        $(hotspotArr).each(function(idx){
            krpano.set('hotspot['+this.name+'].visible',flag);
        });
    });
}

function toggleTourGuideHotSpot(flag){
    var krpano = document.getElementById("panoSettingObject");
    var sceneName = krpano.get("xml.scene");
    $('.circle_blue[data-scenename='+sceneName+']').each(function(idx){
        var tourpointname = $(this).data('tourpointname');
        krpano.set('hotspot['+tourpointname+'].visible',flag);
    });
}

function krpTourPointClick(tourpointname){
    $('.circle_blue[data-tourpointname='+tourpointname+']').click();
}

function putTourGuideLocation(tourpointname,ath,atv){
    //alert(tourpointname+','+ath+','+atv);
    $('.circle_blue[data-tourpointname='+tourpointname+']').data('ath',ath);
    $('.circle_blue[data-tourpointname='+tourpointname+']').data('atv',atv);
}

function addTourGuideHotSpot(krpano,tourpointName,ath,atv,idx,visible){
    if(!ath || !atv){
        krpano.set("curscreen_x", $('#settingPano').width() / 2);
        krpano.set("curscreen_y", $('#settingPano').height() / 2);
        krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
        ath = krpano.get("curscreen_ath");
        atv = krpano.get("curscreen_atv");
        $("#home5 .circle_blue:last").data('ath',ath);
        $("#home5 .circle_blue:last").data('atv',atv);
    }
    krpano.call('addTourGuidePoint('+tourpointName+','+ath+','+atv+','+idx+','+visible+')');
}


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
var headimg;
var pk_works_main = GetQueryString('pid');
var works_view_uuid;
function init() {
    // var id = $("#modelatlasid").val();
    var sb = _U.getSubmit("/edit/pic", null, "ajax", false);
    // var name = $("#modelatlasname").val();
    sb.pushData("pid", pk_works_main);
    sb.pushData("act","update_init");
    sb.submit(function () {

    }, function (data) {
        initSceneGroupContainerHeight();
        initPage(data);
    });

}

function initSceneGroupContainerHeight(){
    var allHeight = $(window).height();
    $('#groupbyul').height(allHeight-77-30);
}

var worksmain;
var panoConfig;
var _cityArr = [];
function initPage(data) {

    worksmain = data.worksmain;
    panoConfig = data.panoConfig;
    works_view_uuid = worksmain.view_uuid;
    $("#worksnameshow").text($.trim(worksmain.name));
    $("#worksname").val($.trim(worksmain.name));
    $("#workcomment").val(worksmain.profile);
    $("#user_viewNum").text(worksmain.browsing_num);
    $("#thumbpath").attr("src", worksmain.thumb_path+"?imageView2/1/w/250/h/250");
    $("#thumbpath").error(function(){
        $(this).attr("src","/static/images/kr/default2-120x120.png");
    });
    $("#flag_publish").bootstrapSwitch('state', worksmain.flag_publish == '1' ? true : false);

    var atlasmain = data.atlasmain;
    $("#atlasname").text(atlasmain.name);
    
    //是否允许显示到首页
    $("#flag_allowed_recomm").bootstrapSwitch('state', worksmain.flag_allowed_recomm=='1'?true:false);

    //初始化标签框
    var tag_list = data.tag_list;
    var tags = data.tags;
    var pic_chosen_html = "";
    for(var i =0 ; i<tag_list.length;i++){
        var flag = false;
        for(var j=0 ;j<tags.length;j++){
            if (tags[j].tag_id==tag_list[i].id) {
                flag = true;
                break;
            }
        }
        pic_chosen_html +='<option  value="'+tag_list[i].id+'" '+(flag?"selected=\"selected\"":"")+'>'+tag_list[i].name+'</option>';
    }
    $("#pic_chosen").html(pic_chosen_html);
    $("#pic_chosen").trigger('chosen:updated');

    var imgsmain = data.imgsmain;
    imgsmain.forEach(function (row, num) {

        var location = row.location;
        var picname = row.filename;

        var html =
            '<div class="col-md-3" flag="nostatus" id="' + row.pk_img_main + '" data-viewuuid="' + row.view_uuid + '">' +
            '<div class="card">' +
            '<div class="media-wrapper"><img alt="" src="' + row.thumb_path + '"></div>' +
            '<div class="card-heading">' +
            '<span class="pull-right"><a href="javascript:void(0);" onclick="deletepic(this);"><i class="icon-remove-circle"></i>' + '删除' + '</a></span>' +
            '<span class="card-scene-name">' + picname + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';

        $("#pics").append(html);
        // if(row.lng && row.lat){
        //     $("#pics > div:last").data('locationdata',{lng:row.lng,lat:row.lat});
        // }

    });

    if(data.userInfo!=undefined){
        _user_view_uuid = data.userInfo.view_uuid;
        $("#user_nickName").text(data.userInfo.nickname);
    }
    $("#praisedNum").text(worksmain.praised_num);
    headimg = data.headimg;
    initPanoConfig(data.panoConfig);
    initWorkUseAndShare();
    initSelect(data);
    for(var i=0 ; i<plugins_init_function.length;i++){
        plugins_init_function[i]();
    }

}

function initSelect(data){



    //初始化组件
    $('select.tab1class').chosen({
        no_results_text: '没有找到',    // 当检索时没有找到匹配项时显示的提示文本
        disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
        search_contains: true,         // 从任意位置开始检索
        max_selected_options: 3
    });
    //设置省市

}

function initWorkUseAndShare() {
    //$("#knowledge").val("作品版权协议");
    var workslocation = "http://" + window.location.host + "/tour/" + worksmain.view_uuid;
    $("#workslocation").val(workslocation);
    $("#workslocationA").attr("href",workslocation);
    var website = '<iframe src="' + workslocation + '" frameborder="no" border="0" style="width: 1000px;height: 600px;"></iframe>';
    var forum = '<iframe width="100%" height="600px" src="' + workslocation + '" frameborder=0 border=0></iframe>';
    $("#website").val(website);
    $("#forum").val(forum);
    $("#qrimg").attr("src",'/qrcode.php?viewid='+works_view_uuid);
}

function initPanoConfig(panoConfig) {
    $("#gyro").bootstrapSwitch('state', panoConfig.gyro=='1'?true:false);
    $("#littleplanet").bootstrapSwitch('state', panoConfig.littleplanet=='1'?true:false);
    $("#scenechoose").bootstrapSwitch('state', panoConfig.scenechoose=='1'?true:false);
    $("#autorotate").bootstrapSwitch('state', panoConfig.autorotate=='1'?true:false);
    initAngleOfView(panoConfig.angle_of_view);
    initSpecialEffect(panoConfig.special_effects);
    initHotSpot(panoConfig.hotspot);
    initSandTable(panoConfig.sand_table);
    initTourGuide(panoConfig.tour_guide);
    initSceneGroup(panoConfig.scene_group);
}
function initSceneGroup(data){
    if(!data){
        data = {};
    }
    if(!data.sceneGroups){
        data.sceneGroups = new Array();
    }
    $('.group-by').data('scenegroup',data);
}

function initTourGuide(data){
    $('#home4 .start-end-img img:eq(0)').data('useimg',data.useStartImg);
    $('#home4 .start-end-img img:eq(1)').data('useimg',data.useEndImg);
    if(data.useStartImg){
        $('#home4 .start-end-img img:eq(0)').attr('src',data.startImgUrl);
    }
    if(data.useEndImg){
        $('#home4 .start-end-img img:eq(1)').attr('src',data.endImgUrl);
    }
    $(data.points).each(function(idx){
        addTourGuidePoint(this.sceneName, this.sceneTitle, 'tourpoint_'+tourPointIdx, tourPointIdx ,this.moveTime,this.musicTitle,this.musicSrc,this.ath,this.atv);
        tourPointIdx++;
    });
}

function initSandTable(data){
    $('.sandtable-window input[type=checkbox]').prop('checked',data.isOpen);
    $(data.sandTables).each(function(idx){
        $('#sandDesc').hide();
        addSandTableImg(this.imgPath);
        $('#sandImg .sand-img-cont:last').data('sand-table-data',this.sceneOpt);
    });
}

function initHotSpot(data){
    if(!$.isEmptyObject(data)){
        $.each(data,function(i,value){
            $("#panoSettingModal .hot").data(i, value);
        });
    }else{
        $("#pics > div").each(function (idx) {
            var imgUuid = $(this).attr("data-viewuuid");
            var sceneName = "scene_" + imgUuid.toLowerCase();
            var hotspotObj = {
                scene:[],
                link:[],
                image:[],
                text:[],
                voice:[],
                imgtext:[],
                obj:[]
            };
            $("#panoSettingModal .hot").data(sceneName, hotspotObj);
        });
    }
}

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd.toLowerCase();
}

function initSpecialEffect(data){
    var effectSettings = data.effectSettings;
    if(effectSettings && effectSettings.length > 0){
        $(effectSettings).each(function(idx){
            $("#panoSettingModal .specialEffect").data(this.sceneName, this);
        });
    }else{
        $("#pics > div").each(function (idx) {
            var imgUuid = $(this).attr("data-viewuuid");
            var sceneName = "scene_" + imgUuid.toLowerCase();
            var effectObj = {};
            effectObj.sceneName = sceneName;
            effectObj.isOpen = false;
            $("#panoSettingModal .specialEffect").data(sceneName, effectObj);
        });
    }
}

function initAngleOfView(data){
    var viewSettings = data.viewSettings;
    if(viewSettings && viewSettings.length > 0){
        $(viewSettings).each(function(idx){
            $("#panoSettingModal .eyes").data(this.sceneName, this);
        });
    }else{
        $("#pics > div").each(function (idx) {
            var imgUuid = $(this).attr("data-viewuuid");
            var sceneName = "scene_" + imgUuid.toLowerCase();
            var lookatObj = {};
            lookatObj.sceneName = sceneName;
            lookatObj.hlookat = 0;
            lookatObj.vlookat = 0;
            lookatObj.fov = 90;
            lookatObj.fovmin = 5;
            lookatObj.fovmax = 120;
            lookatObj.vlookatmin = -90;
            lookatObj.vlookatmax = 90;
            lookatObj.keepView = 0;
            $("#panoSettingModal .eyes").data(sceneName, lookatObj);
        });
    }
}

function appendSpeechScene(sceneEl){
    var htmlStr = '<div class="row" data-viewuuid="' + $(sceneEl).attr("data-viewuuid") + '">' +
        '<div class="col-md-4"><img class="voice-img" src="' + $(sceneEl).find("img").attr("src") + '"><div class="voice-scene-name">' + $(sceneEl).find(".card-heading span:last").text() + '</div></div>' +
        '<div class="col-md-2"><label>还未选择语音</label></div>' +
        '<div class="col-md-3"><a data-modalid="#media_icon" data-mediatype="1" data-imgtype="custom" href="javascript:void(0);" class="icon_media">从媒体库选择音乐</a></div>' +
        '<div class="col-md-3">' +
        '<div class="btn-group" style="margin-top:20px;">' +
        '<button class="btn voice-music-play" disabled="disabled" onclick="playVoice(this)">试听</button>' +
        '<button class="btn" disabled="disabled" onclick="removeVoice(this)">移除</button>' +
        '<audio src="" style="display:none" preload="none" onplay="pauseOther(this)"></audio>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#voiceModal .voice_content > div:eq(1)").append(htmlStr);
}

function appendMusicScene(sceneEl){
    var htmlStr = '<div class="row" data-viewuuid="' + $(sceneEl).attr("data-viewuuid") + '">' +
        '<div class="col-md-4"><img class="voice-img" src="' + $(sceneEl).find("img").attr("src") + '"><div class="voice-scene-name">' + $(sceneEl).find(".card-heading span:last").text() + '</div></div>' +
        '<div class="col-md-2"><label>还未选择音乐</label></div>' +
        '<div class="col-md-3">'+
        '<a data-modalid="#media_icon" data-mediatype="1" data-imgtype="custom" href="javascript:void(0);" class="icon_media">个人媒体库音乐</a>&nbsp;&nbsp;'+
        '<a data-modalid="#media_icon" data-mediatype="1" data-imgtype="system" data-subtype="def_msc" href="javascript:void(0);" class="icon_media">系统音乐</a>'+
        '</div>' +
        '<div class="col-md-3">' +
        '<div class="btn-group" >' +
        '<button class="btn voice-music-play" disabled="disabled" onclick="playVoice(this)">试听</button>' +
        '<button class="btn" disabled="disabled" onclick="removeVoice(this)">移除</button>' +
        '<audio src="" style="display:none" preload="none" onplay="pauseOther(this)"></audio>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#bgMusicModal .voice_content > div:eq(1)").append(htmlStr);
}


function deletepic(obj) {
    var pkImgMain = $(obj).parents(".col-md-3").attr("id");
    var viewUuid = $(obj).parents(".col-md-3").data("viewuuid");
    deleteFromSceneGroup(viewUuid);
    $(obj).parents(".col-md-3").remove();
    $('#voiceModal .voice_content div.row[data-viewuuid='+viewUuid+']').remove();
    $('#bgMusicModal .voice_content div.row[data-viewuuid='+viewUuid+']').remove();
}

function deleteFromSceneGroup(viewuuid){
    var sceneGroup = $('.group-by').data('scenegroup');
    if(sceneGroup.sceneGroups && sceneGroup.sceneGroups.length > 0){
        $(sceneGroup.sceneGroups).each(function(){
            var flag = false;
            var selfArr = this.scenes;
            $(selfArr).each(function(idx){
                if(this.viewuuid == viewuuid){
                    flag = true;
                    selfArr.splice(idx,1);
                    return false;
                }
            });
            if(flag){
                reloadSceneGroup(sceneGroup);
                return false;
            }
        });
    }
}

function checkWorkInfo(){
    var flag = true;
    if ($("#worksname").val()==''){
        _U.toggleErrorMsg('#worksname','',true);
        flag = false;
    }
    if($("#privacy").val()=='1' ){//如果是隐私
        if($("#privacy_password").val()==''){
            _U.toggleErrorMsg('#privacy_password','',true);
            flag = false;
        }
    }

    return flag;
}
/**
 * 更新作品集
 */
function updateWorks() {

    if(!checkWorkInfo()){
        return ;
    }
    //TODO
    var sb = _U.getSubmit("/edit/pic", null, "ajax", false);
    var nostatusPics = $("#pics").children('[flag="nostatus"]');
    var nostatuspicids = [];
    nostatusPics.each(function (num, row) {
        var id = $(row).attr("id");
        nostatuspicids.push(id);
    });
    sb.pushData("nostatusPics", nostatuspicids);
    sb.pushData("act","update_works");
    var worksMaindata = {};
    worksMaindata.name = $("#worksname").val();
    worksMaindata.profile = $("#workcomment").val();
    worksMaindata.pk_works_main = pk_works_main;
    worksMaindata.flag_publish = $("#flag_publish").bootstrapSwitch('state') ? 1 : 0;
    worksMaindata.tags = $("#pic_chosen").val();
    worksMaindata.privacy_flag = $("#privacy").val();
    if($("#privacy").val() == '1'){
        worksMaindata.privacy_password = $("#privacy_password").val();
    }else{
        worksMaindata.privacy_password = "";
    }
    //是否允许显示到首页
    var flag_allowed_recomm = $("#flag_allowed_recomm").bootstrapSwitch('state')?1:0;
    worksMaindata.flag_allowed_recomm = flag_allowed_recomm;
    for(var i=0 ; i<plugins_works_get_function.length;i++){
        plugins_works_get_function[i](worksMaindata);
    }
    sb.pushData("works", worksMaindata);
    //panoConfig
    var panoConfig = {};
    panoConfig.gyro = $("#gyro").bootstrapSwitch('state')?1:0;
    panoConfig.littleplanet = $("#littleplanet").bootstrapSwitch('state')?1:0;
    panoConfig.scenechoose = $("#scenechoose").bootstrapSwitch('state')?1:0;
    panoConfig.autorotate = $("#autorotate").bootstrapSwitch('state')?1:0;
    panoConfig.scene_group = buildSceneGroupSetting();
    for(var i=0 ; i<plugins_config_get_function.length;i++){
        plugins_config_get_function[i](panoConfig);
    }
    sb.pushData("panoConfig", panoConfig);

    var imgsArr = buildImgsData();
    sb.pushData("imgs", imgsArr);
    
    sb.submit(function () {

    }, function (data) {
        if (data.flag) {
            $.zui.messager.show('操作成功', {placement: 'center', type: 'success', time: '3000', icon: 'check'});
            if(imgsArr.length==0)
                window.location.href="/member/project";
        }else{
              $.zui.messager.show('操作失败: '+data.msg, {placement: 'center', type: 'success', time: '3000', icon: 'check'});
        }
    });
}

function showPhotoConfig() {


}


function openVR() {
    var path = "img/vtour/tour.html";
    window.open(path, "_blank");
}

function getCheckbox() {
    alert($("#notification1").bootstrapSwitch().state());
}

function previewPano() {
    window.open("/tour/"+works_view_uuid);
}

function addRadarSpot(name,x,y){
    var krpano = document.getElementById('krpanoSWFObject');
    krpano.call('addlayer('+name+');');
    krpano.set('layer['+name+'].style','spot');
    krpano.set('layer['+name+'].x',x);
    krpano.set('layer['+name+'].y',y);
    krpano.set('layer['+name+'].parent','radarmask');
    krpano.call('layer['+name+'].loadstyle(spot);');
}

//krpano loadcomplete调用
function showPanoBtns(sceneCount) {
    if (sceneCount > 1) {
        $(".vrshow_container_3_min .img_desc_container_min:eq(0)").show();
    }else{
        $(".vrshow_container_3_min .img_desc_container_min:eq(0)").hide();
    }
    $("#panoBtns").show();
}

function fullscreen(el) {
    if ($(el).hasClass('btn_fullscreen')) {
        launchFullScreen(document.getElementById('fullscreenid'));
        var krpano = document.getElementById('krpanoSWFObject');
        krpano.call("skin_showthumbs(false);");
    } else {
        exitFullscreen();
    }
    toggleFullscreenBtn(el);
}

function launchFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
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

function toggleFullscreenBtn(el) {
    if ($(el).hasClass("btn_fullscreen")) {
        $(el).removeClass("btn_fullscreen");
        $(el).addClass("btn_fullscreen_off");
    } else {
        $(el).removeClass("btn_fullscreen_off");
        $(el).addClass("btn_fullscreen");
    }
}


function showWebVR() {
    var krpano = document.getElementById('krpanoSWFObject');
    var webvr = krpano.get("webvr");
	webvr.entervr();
}

function addHotSpot() {
    toggleBtns(false);
    $('#comment_content').val('');
    commentChange();
    $('.vrshow_comment:eq(0)').show();

    var krpano = document.getElementById('krpanoSWFObject');
    krpano.call('toggle_all_comment(true)');
    krpano.set("curscreen_x", $('#previewPano').width() / 2);
    krpano.set("curscreen_y", $('#previewPano').height() / 2);
    krpano.call("screentosphere(curscreen_x, curscreen_y, curscreen_ath, curscreen_atv);");
    krpano.set("hotspot[newcomment].ath", krpano.get("curscreen_ath"));
    krpano.set("hotspot[newcomment].atv", krpano.get("curscreen_atv"));
    krpano.set("hotspot[newcomment].visible", true);
    //krpano.set("layer[head_newcomment].url",headimg);
}

// function showProfile() {
//     toggleBtns(false);
//     $('#profileWorkName').text('');
//     $('#profileProfile').text('');
//     $('#profileWorkName').text($("#worksname").val());
//     $('#profileProfile').text($("#workcomment").val());
//     $('.vrshow_comment:eq(1)').show();
// }

// function commentChange() {
//     var value = $('#comment_content').val();
//     var krpano = document.getElementById('krpanoSWFObject');
//     if (value) {
//         $('#sayBtn').removeClass('disabled');
//         krpano.set("layer[tooltip_newcomment].html", "[b]" + value + "[/b]");
//     } else {
//         $('#sayBtn').addClass('disabled');
//         krpano.set("layer[tooltip_newcomment].html", "[b]拖动头像到想要评论的位置[/b]");
//     }

// }

// function hideComment() {
//     $('.vrshow_comment').hide();
//     var krpano = document.getElementById('krpanoSWFObject');
//     krpano.set("hotspot[newcomment].visible", false);
//     toggleBtns(true);
// }

// function hideProfile() {
//     $('.vrshow_comment').hide();
//     toggleBtns(true);
// }

function toggleBtns(flag) {
    if (flag) {
        $("#panoBtns").show();
    } else {
        $("#panoBtns").hide();
        var krpano = document.getElementById('krpanoSWFObject');
        krpano.call('skin_showthumbs(false);');
    }
}

// function pauseMusic(el) {
//     var krpano = document.getElementById('krpanoSWFObject');
//     krpano.call("pausesoundtoggle(bgmusic);pausesoundtoggle(bgm);");
//     toggleMusic(el);
// }

// function pauseSpeech(el) {
//     var krpano = document.getElementById('krpanoSWFObject');
//     krpano.call("pausesoundtoggle(bgspeech);pausesoundtoggle(bgs);");
//     toggleSpeech(el);
// }

function toggleGyro(el) {
    var krpano = document.getElementById('krpanoSWFObject');
    if ($(el).hasClass("btn_gyro")) {
        krpano.set("plugin[skin_gyro].enabled", "false");
        $(el).removeClass("btn_gyro");
        $(el).addClass("btn_gyro_off");
    } else {
        krpano.set("plugin[skin_gyro].enabled", "true");
        $(el).removeClass("btn_gyro_off");
        $(el).addClass("btn_gyro");
    }
}

//krpano调用
function showGyroBtn() {
    if ($("#gyro").bootstrapSwitch('state')) {
        $("#btn_gyro_off").show();
    }
}

function openGyro() {
    var krpano = document.getElementById('krpanoSWFObject');
    //krpano.set("plugin[skin_gyro].enabled","true");
    alert(krpano.get("plugin[skin_gyro].isavailable"));
}

function showthumbs() {
    var krpano = document.getElementById('krpanoSWFObject');
    krpano.call("skin_showthumbs();");
}

function showthumbsTest() {
    var krpano = document.getElementById('panoSettingObject');
    krpano.call("skin_showthumbs();");
}

// function toggleMusic(el) {
//     if ($(el).hasClass("btn_bgmusic")) {
//         $(el).removeClass("btn_bgmusic");
//         $(el).addClass("btn_bgmusic_off");
//     } else {
//         $(el).removeClass("btn_bgmusic_off");
//         $(el).addClass("btn_bgmusic");
//     }
// }

// function toggleSpeech(el) {
//     if ($(el).hasClass("btn_music")) {
//         $(el).removeClass("btn_music");
//         $(el).addClass("btn_music_off");
//     } else {
//         $(el).removeClass("btn_music_off");
//         $(el).addClass("btn_music");
//     }
// }

// function openSpeechVoiceBtn(){
//     var voiceOff = $('.btn_music_off');
//     voiceOff.removeClass('btn_music_off');
//     voiceOff.addClass('btn_music');
// }

// function openMusicVoiceBtn(){
//     var musicOff = $('.btn_bgmusic_off');
//     musicOff.removeClass('btn_bgmusic_off');
//     musicOff.addClass('btn_bgmusic');
// }


//krpano切换场景时调用
// function getShade(sceneName) {
//     var imgUuid = sceneName.substring(sceneName.indexOf('_') + 1).toUpperCase();
//     var row = $("#oneDiv > div[data-viewuuid=" + imgUuid + "]");
//     var idx = $("#oneDiv > div[data-viewuuid=" + imgUuid + "]").index();
//     var useShade = !($(row).find(".radio input[name=radioUse" + idx + "]:checked").val() == '0');
//     if (useShade) {
//         var imgPath = $(row).find(".use_around img").attr("src");
//         var location = parseInt($(row).find(".use_around input[name=radioLocation" + idx + "]:checked").val());
//         if (location == 0) {
//             location = -90;
//         } else {
//             location = 90;
//         }
//         var krpano = document.getElementById('krpanoSWFObject');
//         krpano.call("addShade('" + imgUuid + "','" + imgPath + "'," + location + ");");
//     }
// }

function addSceneClick() {
    $("#panoImgList #panoImgList_wrap").html('');
    $('#myLgModal .modal-footer > span > em').text('0');
    list_pano_img(1);
    //var sb = _U.getSubmit("/member/project", null, "ajax", false);
    //sb.pushData("act","list_scenes");
    //TODO
    //sb.pushData("pk_works_main",pk_works_main);
    //sb.pushData("pk_img_main",sceneName);
    //sb.submit(function () {
    //
    //}, function (data) {
    //    $(data).each(function (idx) {
    //        var checked = false;
    //        var pkImgMain = this.pk_img_main;
    //        $("#pics").children().each(function (idx) {
    //            if ($(this).attr("id") == pkImgMain) {
    //                checked = true;
    //            }
    //        });
    //        if (checked) {
    //            return true;
    //        }
    //        var htmlStr = '<div class="col-sm-4" name="allItems"><input type="checkbox" ' + (checked ? "checked" : "") + ' data-imgpk="' + this.pk_img_main + '" data-imguuid="'+ this.view_uuid +'"><img class="' + (checked ? 'material-active' : "") + '" src="' + this.thumb_path + '"><span name="searchname" title="'+this.filename+'">' + subFileName(this.filename) + '</span></div>';
    //        $("#panoImgList").append(htmlStr);
    //    });
    //});
    $("#myLgModal").modal("show");
}
function list_pano_img(_page){
    var obj = alert_notice("页面加载中...",'success');
    $.post('/member/project', { "act":"list_scenes","page":_page}, function(data){
        _pageCount = data.pageCount;
        _currentPage = data.currentPage;
        var pg = new Page('list_pano_img',_pageCount,_currentPage);
        dataEach(data.list);
        $("#pager_wrap").html(pg.printHtml());
        obj.hide();
    },'json');
}
//遍历
function dataEach(data){
    var htmlStr="";
    $.each(data,function (idx) {
        var checked = false;
        var pkImgMain = this.pk_img_main;
        $("#pics").children().each(function (idx) {
            if ($(this).attr("id") == pkImgMain) {
                checked = true;
            }
        });
        if (checked) {
            return true;
        }
         htmlStr += '<div class="col-sm-4" name="allItems"><input type="checkbox" ' + (checked ? "checked" : "") + ' data-imgpk="' + this.pk_img_main + '" data-imguuid="'+ this.view_uuid +'"><img class="' + (checked ? 'material-active' : "") + '" src="' + this.thumb_path + '"><span name="searchname" title="'+this.filename+'">' + subFileName(this.filename) + '</span></div>';
    });
    $("#panoImgList #panoImgList_wrap").html(htmlStr + '<div style="clear:both;"></div>');
}
function subFileName(filename) {
    if(filename && filename!=null){
        if (get_length(filename) > 10) {
            return cut_str(filename, 10)+"..";
        }
        return filename;
    }
    return "";

}


function get_length(s){
    var char_length = 0;
    for (var i = 0; i < s.length; i++){
        var son_char = s.charAt(i);
        encodeURI(son_char).length > 2 ? char_length += 1 : char_length += 0.5;
    }
    return char_length;
}
function cut_str(str, len){
    var char_length = 0;
    for (var i = 0; i < str.length; i++){
        var son_str = str.charAt(i);
        encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
        if (char_length >= len){
            var sub_len = char_length == len ? i+1 : i;
            return str.substr(0, sub_len);
            break;
        }
    }
}

function saveWorkImg() {
    var checkedArr = [];
    $("#panoImgList input[type=checkbox]:checked").each(function (idx) {
        var imgObj = {};
        imgObj.pk_img_main = $(this).attr("data-imgpk");
        imgObj.view_uuid = $(this).attr("data-imguuid");
        imgObj.pk_works_main = pk_works_main;
        imgObj.location = $(this).next().attr("src");
        imgObj.filename = $(this).next().next().text();
        checkedArr.push(imgObj);
    });
    if (checkedArr.length > 0) {
        addPic(checkedArr);
        addToSceneGroup(checkedArr);
        $("#myLgModal").modal("hide");
        //});
    } else {
        $("#myLgModal").modal("hide");
    }
}

function addToSceneGroup(checkedArr){
    var sceneGroup = $('.group-by').data('scenegroup');
    if(sceneGroup.sceneGroups && sceneGroup.sceneGroups.length > 0){
        $(checkedArr).each(function(){
            var sceneObj = {};
            sceneObj.sceneName = 'scene_'+this.view_uuid.toLowerCase();
            sceneObj.viewuuid = this.view_uuid;
            sceneObj.imgPath = this.location;
            sceneObj.sceneTitle = this.filename;
            sceneGroup.sceneGroups[0].scenes.push(sceneObj);
        });
        reloadSceneGroup(sceneGroup);
    }
}

function addPic(picArr) {
    $(picArr).each(function (idx) {
        var html =
            '<div class="col-md-3" flag="nostatus" id="' + this.pk_img_main + '" data-viewuuid="' + this.view_uuid + '">' +
            '<div class="card">' +
            '<div class="media-wrapper"><img alt="" src="' + this.location + '"></div>' +
            '<div class="card-heading">' +
            '<span class="pull-right"><a href="javascript:void(0);" onclick="deletepic(this);"><i class="icon-remove-circle"></i>' + '删除' + '</a></span>' +
            '<span class="card-scene-name">' + this.filename + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
        $("#pics").append(html);
        appendSpeechScene($("#pics > div:last")[0]);
        appendMusicScene($("#pics > div:last")[0]);
    });

}

function openPanoSetting() {
   var settings = {};
    settings["onstart"] = 'js(initPanoSetting());';
    embedpano({
        id: "panoSettingObject",
        swf: "/tour/tour.swf",
        xml: "/tour/tour.xml.php?view="+works_view_uuid ,
        target: "settingPano",
        html5:'auto',
       // flash:'only',
        wmode:'opaque-flash',
        mobilescale:0.7,
        vars:settings,
        webglsettings:{preserveDrawingBuffer:true}
    });
    initPanoSettingSceneChoose();
   
    $("#panoSettingModal").modal('show');
}

function initPanoSetting(){
    $('.group-item-body .row:first').click();
    $(".pano-setting-container button:eq(0)").click();
}

function initPanoSettingSceneChoose(){
    $('#groupbyul').html('');
    var sceneGroup = $('.group-by').data('scenegroup');
    if(sceneGroup.sceneGroups && sceneGroup.sceneGroups.length > 0){
        $(sceneGroup.sceneGroups).each(function(idx){
            addOneSceneGroup(this.groupName,this.imgPath,this.iconType);
            $(this.scenes).each(function(idx){
                addOneScene(this.viewuuid,this.imgPath,this.sceneTitle);
            });
        });
    }
    else{
        var sceneGroupTitle = "场景选择";
        var sceneGroupImageSrc = "/static/images/skin1/vr-btn-scene.png";
        var imgType = "system";
        addOneSceneGroup(sceneGroupTitle,sceneGroupImageSrc,imgType);
        $("#pics > div").each(function (idx) {
            addOneScene($(this).attr("data-viewuuid"),$(this).find("img").attr("src"),$(this).find(".card-heading > span:eq(1)").text());
        });
    }
    $( ".group-item-body" ).sortable({
        connectWith: ".group-item-body",
        placeholder: "ui-state-highlight"
    });
    $('.scene-group img:last').attr('src',$('#pics > div img:first').attr("src"));
}

function addOneScene(viewuuid,imgsrc,sceneTitle,isNew){
    var htmlStr = '<li class="row" data-viewuuid="' + viewuuid + '">'+
        '<div class="col-md-12"> <img src="'+imgsrc+'"><span>'+sceneTitle+'</span></div>'+
        '</li>';
    if(isNew){
        $('.group-by .group-item-body:first').append(htmlStr);
    }else{
        $('.group-by .group-item-body:last').append(htmlStr);
    }
}

function addOneSceneGroup(sceneGroupTitle,sceneGroupImageSrc,imgType){
    var htmlStr = '<li class="group-item">'+
        '<div class="group-item-header">'+
        '<div class="group-item-title">'+
        '<img src="'+sceneGroupImageSrc+'" data-icontype="'+imgType+'">'+
        '<span>'+sceneGroupTitle+'</span>'+
        '</div>'+
        '<a class="card">'+
        '<span class="caption"><span class="group-change-icon" data-liindex="1" data-titleidx="6">更换图标</span>&nbsp;&nbsp;<span class="group-rename" data-liindex="0" data-titleidx="6">重命名&nbsp;&nbsp;</span><span class="group-delte">删除</span></span>'+
    '</a>'+
        '</div>'+
        '<ul class="group-item-body">'+
    '</ul>'+
    '</li>';
    $('#groupbyul').append(htmlStr);
}
function reloadSceneGroup(sceneGroup){
    $('#groupbyul').html('');
    $(sceneGroup.sceneGroups).each(function(idx){
        addOneSceneGroup(this.groupName,this.imgPath,this.iconType);
        $(this.scenes).each(function(idx){
            addOneScene(this.viewuuid,this.imgPath,this.sceneTitle);
        });
    });
}
function chooseMediaResImg() {
    var mediaData = {};
    var mediaType = $(openMediaResObj).attr("data-mediatype");
    if (mediaType == '1') {
        var checkedRadio = $("input[name=musicChooseRadio]:checked");
        mediaData.title = checkedRadio.parent().next().text();
        mediaData.src = checkedRadio.parent().next().next().find('audio').attr('src');
    } else {
        var multiselect = $(openMediaResObj).data('multiselect');
        if(multiselect){
            var mediaArr = new Array();
            $("#pic img.img-selected").each(function(idx){
                var mediaObj = {};
                mediaObj.title = $(this).attr("title");
                mediaObj.pkMediaRes = $(this).attr("data-respk");
                mediaObj.src = $(this).attr("src");
                mediaArr.push(mediaObj);
            });
            mediaData.imgs = mediaArr;
        }else{
            var usetype = $(openMediaResObj).attr("data-usetype");
            if(usetype == 'workCover'){
                mediaData.key = $("#pic img.img-selected").attr("data-key");
            }
            mediaData.title = $("#pic img.img-selected").attr("title");
            mediaData.pkMediaRes = $("#pic img.img-selected").attr("data-respk");
            mediaData.src = $("#pic img.img-selected").attr("src");
        }
    }
    chooseMediaResCallBack(mediaData);
    $("#media_icon").modal("hide");
}

function openMapModal(el,readonly) {
    mapModalEl = el;
    _U.mapMarkModal().openModal($(mapModalEl).data("locationData"),readonly);
}

function changeTimeLineMusic(data) {
    $("#timeModal").data("musicsrc", data.src);
    //$("#timeModal").data("musictitle",data.title);
    $("#timeModal .modal-body .time-line-music").text(data.title);
    $("#timeModal .modal-body .timelinemusicdelete").show();
}

function removeTimeLineMusic(){
    $("#timeModal").data("musicsrc", null);
    $("#timeModal .modal-body .time-line-music").text('无');
    $("#timeModal .modal-body .timelinemusicdelete").hide();
}

function timeLineSettingOK(){
    var circleBlue = $("#timeModal").data("circleblue");
    circleBlue.data('musicsrc',$("#timeModal").data("musicsrc"));
    circleBlue.data('musictitle',$("#timeModal .modal-body .time-line-music").text());
    circleBlue.data('movetime',$("#timeModal .modal-body input").val());
    $("#timeModal").modal('hide');
}

function chooseSandTableImg(data){
    $('#sandDesc').hide();
    addSandTableImg(data.src);
    //toggleSandTable(false);
    //$('.sandTable .sandtable-window-img').attr('src',data.src);
    //toggleSandTable(true);
    $('#sandImg .sand-img-cont:last').click();
}

function addSandTableImg(imgPath){
    var htmlStr = '<div class="sand-img-cont">'+
        '<img src="'+imgPath+'">'+
        '<span class="delete"><a href="javascript:void(0)">删除</a></span>'+
        '</div>';
    $('#sandImg').append(htmlStr);
}

function toggleSandTable(open){
    var objI = $(".sandTable .sandtable-window");
    if(open){
        objI.animate({top: '250px', opacity: '0.2'}, 100);
        objI.animate({top: '240px', opacity: '1'}, 100);
    }else{
        objI.animate({top: '0', opacity: '0'}, 100);
    }
}

function playVoice(el) {
    if ($(el).data('playFlag')) {
        $(el).siblings('audio').each(function () {
            this.pause();
        });
        $(el).text('试听');
        $(el).data('playFlag', false);
    } else {
        $(el).siblings('audio').each(function () {
            this.play();
        });
        $(el).text('暂停');
        $(el).data('playFlag', true);
    }
}

function removeVoice(el) {
    $(el).siblings('audio').each(function () {
        this.pause();
        $(this).attr('src', '');
    });
    $(el).prev().text('试听');
    $(el).prev().data('playFlag', false);
    $(el).parent().parent().prev().prev().children().text('还未选择语音');
    $(el).attr('disabled', true);
    $(el).prev().attr('disabled', true);
}

function toggleSpeechBtn(sceneName) {
    var speechObj = buildSpeechExplain();
    if (speechObj.isWhole) {
        if (speechObj.useSpeech) {
            $('.btn_music,.btn_music_off').show();
        } else {
            $('.btn_music,.btn_music_off').hide();
        }
    } else {
        $(speechObj.sceneSettings).each(function (idx) {
            var imgUuid = sceneName.substring(sceneName.indexOf("_") + 1, sceneName.length).toUpperCase();
            if (imgUuid == this.imgUuid) {
                if (this.useSpeech) {
                    $('.btn_music,.btn_music_off').show();
                } else {
                    $('.btn_music,.btn_music_off').hide();
                }
            }
        });
    }
}

function setInitView() {
    setInitAngleImg();
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    var hlookat = krpano.get("view.hlookat");
    var vlookat = krpano.get("view.vlookat");
    putLookatSetting(sceneName,hlookat,vlookat);
    $.zui.messager.show("初始视角已设置", {placement: 'top', type: 'success', time: '3000', icon: 'check'});
}

function setInitAngleImg(){
    //html2canvas($("#panoSettingObject > div:eq(0) > div:eq(0) > canvas")[0], {
    //    width: 150,
    //    height: 75,
    //    logging: true
    //}).then(function(canvas) {
    //    $("#initViewCont").html(canvas);
    //});
    var mycanvas = $("#panoSettingObject > div:eq(0) > div:eq(0) > canvas")[0];
    //var ctx=mycanvas.getContext("webgl",{preserveDrawingBuffer:true});
    //var pixels = new Uint8Array(ctx.drawingBufferWidth * ctx.drawingBufferHeight * 4);
    //ctx.readPixels(0, 0, ctx.drawingBufferWidth , ctx.drawingBufferHeight, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);
    //var c=document.getElementById("testCanvas");
    //var ctx2=c.getContext("2d");
    //var ImgData = ctx2.createImageData(ctx.drawingBufferWidth , ctx.drawingBufferHeight);
    //ImgData.data.set( pixels, 0, pixels.length );
    //ctx2.putImageData(ImgData,0,0);
    var url = getDataURL(mycanvas,"image/png",150,100);
    $("#keep_eye img").attr("src",url);
}

function putLookatSetting(sceneName,hlookat,vlookat){
    var lookatObj = $("#panoSettingModal .eyes").data(sceneName);
    if(!lookatObj){
        lookatObj = {};
        lookatObj.sceneName = sceneName;
        lookatObj.hlookat = 0;
        lookatObj.vlookat = 0;
    }
    if(hlookat){
        lookatObj.hlookat = hlookat;
    }
    if(vlookat){
        lookatObj.vlookat = vlookat;
    }
    lookatObj.fov = ex1Slider.slider("getValue");
    var fovRange = ex2Slider.slider("getValue");
    lookatObj.fovmin = fovRange[0];
    lookatObj.fovmax = fovRange[1];
    var vlookatRange = ex4Slider.slider("getValue");
    lookatObj.vlookatmin = vlookatRange[0];
    lookatObj.vlookatmax = vlookatRange[1];
    lookatObj.keepView = $("#keep_eye input").is(":checked")?1:0;
    $("#panoSettingModal .eyes").data(sceneName, lookatObj);
    
}

function putWholeFov(el){
    //全局fov设置
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    var sceneObj = krpano.get('scene');
    var sceneArr = sceneObj.getArray ? sceneObj.getArray() : sceneObj.indexmap;
    $(sceneArr).each(function(idx){
        if(this.name != sceneName){
            var lookatObj = $("#panoSettingModal .eyes").data(this.name);
            lookatObj.fov = ex1Slider.slider("getValue");
            var fovRange = ex2Slider.slider("getValue");
            lookatObj.fovmin = fovRange[0];
            lookatObj.fovmax = fovRange[1];
            $("#panoSettingModal .eyes").data(this.name,lookatObj);
        }
    });
    $(el).button('loading');
}

function putWholeVlookat(el){
    //全局垂直视角设置
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    var sceneObj = krpano.get('scene');
    var sceneArr = sceneObj.getArray ? sceneObj.getArray() : sceneObj.indexmap;
    $(sceneArr).each(function(idx){
        if(this.name != sceneName){
            var lookatObj = $("#panoSettingModal .eyes").data(this.name);
            var vlookatRange = ex4Slider.slider("getValue");
            lookatObj.vlookatmin = vlookatRange[0];
            lookatObj.vlookatmax = vlookatRange[1];
            $("#panoSettingModal .eyes").data(this.name,lookatObj);
        }
    });
    $(el).button('loading');
}

function putWholeEffect(el){
    //全局特效设置
    var krpano = document.getElementById('panoSettingObject');
    var sceneName = krpano.get('xml.scene');
    var sceneObj = krpano.get('scene');
    var sceneArr = sceneObj.getArray ? sceneObj.getArray() : sceneObj.indexmap;
    var effectObj = $("#panoSettingModal .specialEffect").data(sceneName);
    $(sceneArr).each(function(idx){
        if(this.name != sceneName){
            var effectType = $("#home3 input[name=special]:checked").val();
            var ath,atv,customImgPath;
            if(effectType == 'sunshine'){
                ath = effectObj.ath;
                atv = effectObj.atv;
            }
            if(effectType == 'custom'){
                customImgPath = effectObj.effectImgPath;
            }
            putEffectSetting(this.name,$('#home3 input.start').is(':checked'),effectType,customImgPath,ath,atv);
        }
    });
    $(el).button('loading');
}
function scaleCanvas (canvas, width, height) {
    var w = canvas.width,
        h = canvas.height;
    if (width == undefined) {
        width = w;
    }
    if (height == undefined) {
        height = h;
    }

    var retCanvas = document.createElement('canvas');
    var retCtx = retCanvas.getContext('2d');
    retCanvas.width = width;
    retCanvas.height = height;
    retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
    return retCanvas;
}

function getDataURL (canvas, type, width, height) {
    canvas = scaleCanvas(canvas, width, height);
    return canvas.toDataURL(type);
}

function intValidate(el) {
    var val = $(el).val();
    var reg = /^-?\d{0,}$/;
    if (!reg.test(val)) {
        $(el).val("");
    }
}

function savePanoSetting() {
    var sb = _U.getSubmit("/edit/pic", null, "ajax", false);
    sb.pushData("act","save_panosetting");
    sb.pushData("pk_works_main",pk_works_main);
    sb.pushData("angle_of_view", buildAngleSetting());
    sb.pushData("special_effects", buildEffectSetting());
    sb.pushData("hotspot", buildHotspotSetting());
    sb.pushData("sand_table", buildSandTableSetting());
    sb.pushData("tour_guide", buildTourGuideSetting());
    var sceneGroupData = buildSceneGroupSetting();
    sb.pushData("scene_group", sceneGroupData);
    var imgsArr = buildImgsData();
    sb.pushData("imgs", imgsArr);

    sb.submit(function () {

    }, function (data) {
        $('.group-by').data('scenegroup',sceneGroupData);
        if (data.flag) {
            $.zui.messager.show('操作成功', {placement: 'center', type: 'success', time: '3000', icon: 'check'});
        }else{
            $.zui.messager.show('操作失败:'+data.msg, {placement: 'center', type: 'success', time: '3000', icon: 'check'});
        }
    });
}

function buildImgsData(){
    var checkedArr = new Array();
    $('#pics > div').each(function(idx){
        var imgObj = {};
        imgObj.pk_img_main = $(this).attr("id");
        imgObj.view_uuid = $(this).data("viewuuid");
        imgObj.pk_works_main = pk_works_main;
        imgObj.location = $(this).find('.media-wrapper img').attr("src");
        imgObj.filename = $(this).find('.card-scene-name').text();
        checkedArr.push(imgObj);
    });
    return checkedArr;
}

function buildTourGuideSetting(){
    var tourGuideObj = {};
    tourGuideObj.useStartImg = false;
    tourGuideObj.useEndImg = false;
    tourGuideObj.points = new Array();
    var points = $('#home5 .circle_blue');
    if(points.length != 0){
        if($('#home4 .start-end-img img:eq(0)').data('useimg')){
            tourGuideObj.useStartImg = true;
            tourGuideObj.startImgUrl = $('#home4 .start-end-img img:eq(0)').attr('src');
        }
        if($('#home4 .start-end-img img:eq(1)').data('useimg')){
            tourGuideObj.useEndImg = true;
            tourGuideObj.endImgUrl = $('#home4 .start-end-img img:eq(1)').attr('src');
        }
        points.each(function(idx){
            var point = {};
            point.sceneName =  $(this).data('scenename');
            point.sceneTitle =  $(this).data('scenetitle');
            point.ath =  $(this).data('ath');
            point.atv =  $(this).data('atv');
            point.moveTime =  $(this).data('movetime');
            if($(this).data('musicsrc')){
                point.musicSrc =  $(this).data('musicsrc');
            }
            point.musicTitle =  $(this).data('musictitle');
            tourGuideObj.points.push(point);
        });
    }
    return tourGuideObj;
}

function buildSandTableSetting(){
    var sandTableObj = {};
    sandTableObj.isOpen = $(".sandtable-window input[type='checkbox']").is(':checked')?1:0;
    var sandTables = new Array();
    sandTableObj.sandTables = sandTables;
    $('#sandImg .sand-img-cont').each(function(idx){
        var sandTable = {};
        sandTable.imgPath = $(this).find('img').attr('src');
        sandTable.sceneOpt = $(this).data('sand-table-data');
        //console.log(sandTable.sceneOpt);
        if(!$.isEmptyObject(sandTable.sceneOpt)){
            sandTables.push(sandTable);
        }
    });
    return sandTableObj;
}

function buildHotspotSetting(){
    var krpano = document.getElementById('panoSettingObject');
    if(!krpano){
        krpano = document.getElementById('krpanoSWFObject');
    }
    var sceneObj = krpano.get('scene');
    var sceneArr = sceneObj.getArray ? sceneObj.getArray() : sceneObj.indexmap;
    var hotspotObj = {};
    $(sceneArr).each(function(idx){
        hotspotObj[this.name] = $("#panoSettingModal .hot").data(this.name);
    });
    return hotspotObj;
}

function buildAngleSetting(){
    var krpano = document.getElementById('panoSettingObject');
    var sceneObj = krpano.get('scene');
    var sceneArr = sceneObj.getArray ? sceneObj.getArray() : sceneObj.indexmap;
    var viewObj = {};
    viewObj.viewSettings = new Array();
    $(sceneArr).each(function(idx){
        viewObj.viewSettings.push($("#panoSettingModal .eyes").data(this.name));
    });
    return viewObj;
}

function buildEffectSetting(){
    var krpano = document.getElementById('panoSettingObject');
    var sceneObj = krpano.get('scene');
    var sceneArr = sceneObj.getArray ? sceneObj.getArray() : sceneObj.indexmap;
    var effectObj = {};
    effectObj.effectSettings = new Array();
    $(sceneArr).each(function(idx){
        effectObj.effectSettings.push($("#panoSettingModal .specialEffect").data(this.name));
    });
    return effectObj;
}

function isBtnClicked(idx){
    var flag = $('.pano-setting-container button:eq('+idx+')').hasClass("setting-btn-clicked");
    return flag;
}

//krpano调用 初始化高级设置
function initAdvancedSetting(sceneName){
    initEffectSetting(sceneName);
    initSandTableSetting(sceneName);
    initTourGuideSetting(sceneName);
}

function initTourGuideSetting(sceneName){
    var krpano = document.getElementById('panoSettingObject');
    var settingFlag = true;
    if(!krpano){
        krpano = document.getElementById('krpanoSWFObject');
        settingFlag = false;
    }
    if(settingFlag){
        var isClicked = isBtnClicked(4);
        $('.circle_blue[data-scenename='+sceneName+']').each(function(idx){
            var idx = $(this).text();
            var tourpointname = $(this).data('tourpointname');
            var ath = $(this).data('ath');
            var atv = $(this).data('atv');
            addTourGuideHotSpot(krpano,tourpointname,ath,atv,idx,isClicked);
        });
        var curTourpointname = $('.tour-clicked').data('tourpointname');
        krpano.set('layer[tooltip_'+curTourpointname+'].background',true);
        if(isClicked){
            var curFov = krpano.get('view.fov');
            krpano.call('looktohotspot('+curTourpointname+','+curFov+')');
        }
    }else{
        var tourGuideObj = buildTourGuideSetting();
        if(tourGuideObj.points.length > 0){
            $('#previewPano .vrshow_tour_btn').show();
        }else{
            $('#previewPano .vrshow_tour_btn').hide();
        }
    }
}

function initSandTableSetting(sceneName){
    var krpano = document.getElementById('panoSettingObject');
    var settingFlag = true;
    if(!krpano){
        krpano = document.getElementById('krpanoSWFObject');
        settingFlag = false;
    }
    if(settingFlag){
        closeRadarCircle();
        $('.radar-control img.radar-control-img[data-scenename='+sceneName+']').click();
    }else{
        var sandTableObj = buildSandTableSetting();
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
            if(sandTableObj.isOpen=='1'){
                krpano.set('layer[mapcontainer].visible',true);
            }
        }
    }
}

function initHotspotSetting(sceneName){
    clearHotspotList();
    var krpano = document.getElementById('panoSettingObject');
    var settingFlag = true;
    if(!krpano){
        krpano = document.getElementById('krpanoSWFObject');
        settingFlag = false;
    }
    var hotspotObj = $("#panoSettingModal .hot").data(sceneName);
    if(hotspotObj){
        $.each(hotspotObj,function(key,value){
            if(key == 'scene'){
                $(value).each(function(idx){
                    initSceneHotSpot(krpano,this,settingFlag,0);
                });
            }else if(key == 'link'){
                $(value).each(function(idx){
                    initSceneHotSpot(krpano,this,settingFlag,1);
                });
            }else if(key == 'image'){
                $(value).each(function(idx){
                    initSceneHotSpot(krpano,this,settingFlag,2);
                });
            }else if(key == 'text'){
                $(value).each(function(idx){
                    initSceneHotSpot(krpano,this,settingFlag,3);
                });
            }else if(key == 'voice'){
                $(value).each(function(idx){
                    initSceneHotSpot(krpano,this,settingFlag,4);
                });
            }else if(key == 'imgtext'){
                $(value).each(function(idx){
                    initSceneHotSpot(krpano,this,settingFlag,5);
                });
            }else if(key == 'obj'){
                $(value).each(function(idx){
                    initSceneHotSpot(krpano,this,settingFlag,7);
                });
            }else if(key == 'video'){
                 $(value).each(function(idx){
                    initSceneHotSpot(krpano,this,settingFlag,8);
                });
            }
        });
    }else{

    }
}

function initSceneHotSpot(krpano,param,settingFlag,idx){

    if(settingFlag){
        var mthml = '';
        switch(idx){
            case 0:
            //console.log('addSceneChangeHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+param.linkedscene+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+')');
                krpano.call('addSceneChangeHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.linkedscene)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+')');
                mthml = '<div class="edit-item" data-respk="'+param.name+'">' +
                    '<a class="card">' +
                    '<span class="caption">' +
                    '<span class="group-location-icon">定位</span><span class="group-change-icon" data-liindex="0" data-hotspotidx="0">更换图标</span>&nbsp;&nbsp;<span class="group-rename" data-liindex="1" data-hotspotidx="0">场景&nbsp;&nbsp;</span><span class="group-delte">删除</span>' +
                    '</span> </a> ' +
                    '<div class="group-item-title"> ' +
                    '<img src="'+param.sceneImg+'"><span>'+html_encode(param.sceneTitle)+'</span><img class="thumbimg" src="'+param.thumbPath+'"> </div> ' +
                    '</div>';
                break;
            case 1:
                krpano.call('addLinkHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+','+param.link+','+param.isShowSpotName+')');
                mthml = '<div class="edit-item" data-respk="'+param.name+'">' +
                    '<a class="card">' +
                    '<span class="caption">' +
                    '<span class="group-location-icon">定位</span><span class="group-change-icon" data-liindex="0" data-hotspotidx="1">编辑链接</span><span class="group-rename" data-liindex="1" data-hotspotidx="1">编辑图标</span><span class="group-delte">删除</span>' +
                    '</span> </a> ' +
                    '<div class="group-item-title"> ' +
                    '<img class="thumbimg" src="'+param.thumbPath+'"><span>'+html_encode(param.hotspotTitle)+'</span></div> ' +
                    '</div>';
                break;
            case 2:
                krpano.call('addImgHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+','+param.galleryName+','+param.isShowSpotName+')');
                mthml = '<div class="edit-item" data-respk="'+param.name+'">' +
                    '<a class="card">' +
                    '<span class="caption">' +
                    '<span class="group-location-icon">定位</span><span class="group-change-icon" data-liindex="0" data-hotspotidx="2">编辑标题</span><span class="group-rename" data-liindex="1" data-hotspotidx="2">图片</span><span data-liindex="2" data-hotspotidx="2">图标</span><span class="group-delte">删除</span>' +
                    '</span> </a> ' +
                    '<div class="group-item-title"> ' +
                    '<img class="thumbimg" src="'+param.thumbPath+'"><span>'+html_encode(param.hotspotTitle)+'</span></div> ' +
                    '</div>';
                break;
            case 3:
                krpano.call('addWordHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+','+html_encode(param.wordContent)+','+param.isShowSpotName+')');
                mthml = '<div class="edit-item" data-respk="'+param.name+'">' +
                    '<a class="card">' +
                    '<span class="caption">' +
                    '<span class="group-location-icon">定位</span><span class="group-change-icon" data-liindex="0" data-hotspotidx="3">编辑内容</span><span class="group-rename" data-liindex="1" data-hotspotidx="3">编辑图标</span><span class="group-delte">删除</span>' +
                    '</span> </a> ' +
                    '<div class="group-item-title"> ' +
                    '<img class="thumbimg" src="'+param.thumbPath+'"><span>'+html_encode(param.hotspotTitle)+'</span></div> ' +
                    '</div>';
                break;
            case 4:
                krpano.call('addVoiceHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+','+param.musicSrc+','+param.isShowSpotName+')');
                mthml = '<div class="edit-item" data-respk="'+param.name+'">' +
                    '<a class="card">' +
                    '<span class="caption">' +
                    '<span class="group-location-icon">定位</span><span class="group-change-icon" data-liindex="0" data-hotspotidx="4">编辑标题</span><span class="group-rename" data-liindex="1" data-hotspotidx="4">音频</span><span data-liindex="2" data-hotspotidx="4">图标</span><span class="group-delte">删除</span>' +
                    '</span> </a> ' +
                    '<div class="group-item-title"> ' +
                    '<img class="thumbimg" src="'+param.thumbPath+'"><span>'+html_encode(param.hotspotTitle)+'</span></div> ' +
                    '</div>';
                break;
            case 5:
                krpano.call('addImgTextHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+','+imgtext_encode(param.imgtext_wordContent)+','+param.isShowSpotName+')');
                mthml = '<div class="edit-item" data-respk="'+param.name+'">' +
                    '<a class="card">' +
                    '<span class="caption">' +
                    '<span class="group-location-icon">定位</span><span class="group-change-icon" data-liindex="0" data-hotspotidx="5">编辑内容</span><span class="group-rename" data-liindex="1" data-hotspotidx="5">编辑图标</span><span class="group-delte">删除</span>' +
                    '</span> </a> ' +
                    '<div class="group-item-title"> ' +
                    '<img class="thumbimg" src="'+param.thumbPath+'"><span>'+html_encode(param.hotspotTitle)+'</span></div> ' +
                    '</div>';
                break;
            case 7:
                krpano.call('addObjHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+','+param.objid+','+param.isShowSpotName+')');
                mthml = '<div class="edit-item" data-respk="'+param.name+'">' +
                    '<a class="card">' +
                    '<span class="caption">' +
                    '<span class="group-location-icon">定位</span><span class="group-change-icon" data-liindex="0" data-hotspotidx="7">编辑内容</span><span class="group-change-icon" data-liindex="1" data-hotspotidx="7">环物</span><span class="group-rename" data-liindex="2" data-hotspotidx="7">图标</span><span class="group-delte">删除</span>' +
                    '</span> </a> ' +
                    '<div class="group-item-title"> ' +
                    '<img class="thumbimg" src="'+param.thumbPath+'"><span>'+html_encode(param.hotspotTitle)+'</span></div> ' +
                    '</div>';
                break;
            case 8:
                krpano.call('addVideoHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+','+isBtnClicked(1)+','+param.location+','+param.isShowSpotName+')');
                mthml = '<div class="edit-item" data-respk="'+param.name+'">' +
                    '<a class="card">' +
                    '<span class="caption">' +
                    '<span class="group-location-icon">定位</span><span class="group-change-icon" data-liindex="0" data-hotspotidx="8">标题</span><span class="group-change-icon" data-liindex="1" data-hotspotidx="8">视频</span><span class="group-rename" data-liindex="2" data-hotspotidx="8">图标</span><span class="group-delte">删除</span>' +
                    '</span> </a> ' +
                    '<div class="group-item-title"> ' +
                    '<img class="thumbimg" src="'+param.thumbPath+'"><span>'+html_encode(param.hotspotTitle)+'</span></div> ' +
                    '</div>';
                break;
        }
        if (idx>5) --idx;
        $('div.all-edit:eq('+idx+')').prev().hide();
        $('div.all-edit:eq('+idx+')').append(mthml);
        resetHotspotSum(idx);
    }else{
        switch(idx){
            case 0:
                krpano.call('addSceneChangeHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+param.linkedscene+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+',true)');
                break;
            case 1:
                krpano.call('addLinkHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+',true,'+param.link+','+param.isShowSpotName+')');
                break;
            case 2:
                krpano.call('addImgHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+',true,'+param.galleryName+','+param.isShowSpotName+')');
                break;
            case 3:
                krpano.call('addWordHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+',true,'+html_encode(param.wordContent)+','+param.isShowSpotName+')');
                break;
            case 4:
                krpano.call('addVoiceHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+',true,'+param.musicSrc+','+param.isShowSpotName+')');
                break;
            case 5:
                krpano.call('addImgTextHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+',true,'+imgtext_encode(param.imgtext_wordContent)+','+param.isShowSpotName+')');
                break;
            case 7:
                krpano.call('addObjHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+',true,'+param.objid+','+param.isShowSpotName+')');
                break;
            case 8:
                krpano.call('addVideoHotSpot("'+param.imgPath+'","'+ (param.name) +'",'+html_encode(param.hotspotTitle)+','+(param.ath)+','+(param.atv)+','+param.isDynamic+','+settingFlag+',true,'+param.location+','+param.isShowSpotName+')');
                break;
        }
    }
}

function initEffectSetting(sceneName){
    var krpano = document.getElementById('panoSettingObject');
    var settingFlag = true;
    if(!krpano){
        krpano = document.getElementById('krpanoSWFObject');
        settingFlag = false;
    }
    krpano.set('lensflares[obj].item[lensitemobj].scene',null);
    var effectObj = $("#panoSettingModal .specialEffect").data(sceneName);
    if(effectObj){
        if(settingFlag){
            if(effectObj.isOpen){
                if(effectObj.effectType == 'custom'){
                    $('#home3 input.start').prop('checked',true);
                    $("#home3 input[name=special][value=custom]").prop("checked",true);
                    if(isBtnClicked(3)){
                        krpano.call('addEffect("'+effectObj.effectType+'","'+effectObj.effectImgPath+'")');
                    }
                }else if(effectObj.effectType == 'sunshine'){
                    $('#home3 input.start').prop('checked',true);
                    $("#home3 input[name=special][value=sunshine]").prop("checked",true);
                    if(isBtnClicked(3)){
                        krpano.call('addSunset('+effectObj.ath+','+effectObj.atv+')');
                    }
                }else{
                    $('#home3 input[name=special][value='+effectObj.effectType+']').click();
                }
            }else{
                resetEffectSetting();
            }
        }else{
            if(effectObj.isOpen){
                if(effectObj.effectType == 'sunshine'){
                    krpano.set('lensflares[obj].item[lensitemobj].scene',sceneName);
                    krpano.set('lensflares[obj].item[lensitemobj].ath',effectObj.ath);
                    krpano.set('lensflares[obj].item[lensitemobj].atv',effectObj.atv);
                }else{
                    krpano.call('addEffect("'+effectObj.effectType+'","'+effectObj.effectImgPath+'")');
                }
            }
        }
    }else{
        resetEffectSetting();
    }
}



function resetEffectSetting(){
    $('#home3 input.start').prop('checked',false);
    $("#home3 input[name=special]:checked").prop("checked",false);
    resetEffectBtn();
}

function resetEffectBtn(){
    $('#home3 button').button('reset');
    $('#home3 button').prop('disabled',false);
}

function littlePlaneOpen(sceneName){
    var krpano = document.getElementById('panoSettingObject');
    var settingFlag = true;
    if(!krpano){
        krpano = document.getElementById('krpanoSWFObject');
        settingFlag = false;
    }
    if(!sceneName){
        sceneName = krpano.get('startscene');
    }
    var lookatObj = $("#panoSettingModal .eyes").data(sceneName);
    if(!settingFlag){
        if(lookatObj){
            krpano.set('view.vlookat',lookatObj.vlookat);
            krpano.set('view.hlookat',lookatObj.hlookat);
            krpano.set('view.fov',lookatObj.fov);
            krpano.set('view.fovmax',lookatObj.fovmax);
            krpano.call('skin_setup_littleplanetintro('+lookatObj.fovmin+','+(-1*lookatObj.vlookatmax)+','+(-1*lookatObj.vlookatmin)+','+(lookatObj.keepView=='1' ? "off" : "0.0")+');');
        }else{
            krpano.call('skin_setup_littleplanetintro(5,-90,90,"0.0");');
        }
    }
}

//场景载入时加载视角设置
function initViewSetting(sceneName){
    var krpano = document.getElementById('panoSettingObject');
    var settingFlag = true;
    if(!krpano){
        krpano = document.getElementById('krpanoSWFObject');
        settingFlag = false;
    }
    var lookatObj = $("#panoSettingModal .eyes").data(sceneName);
    if(lookatObj){
        if(settingFlag){
            krpano.set('view.vlookat',(-1*lookatObj.vlookat));
            krpano.set('view.hlookat',lookatObj.hlookat);
            krpano.set('view.fov',lookatObj.fov);
            krpano.set('view.fovmin',lookatObj.fovmin);
            krpano.set('view.fovmax',lookatObj.fovmax);
            krpano.set('view.vlookatmin',-1*lookatObj.vlookatmax);
            krpano.set('view.vlookatmax',-1*lookatObj.vlookatmin);
            krpano.set('autorotate.horizon',lookatObj.keepView=='1' ? "off" : "0.0");
            ex1Slider.slider("setValue",lookatObj.fov,true);
            ex2Slider.slider("setValue",[lookatObj.fovmin,lookatObj.fovmax],true);
            ex3Slider.slider("setValue",-1*lookatObj.vlookat,true);
            ex4Slider.slider("setValue",[lookatObj.vlookatmin,lookatObj.vlookatmax],true);
            $("#keep_eye input").prop('checked',lookatObj.keepView=='1');
        }else{
            krpano.set('view.vlookat',lookatObj.vlookat);
            krpano.set('view.hlookat',lookatObj.hlookat);
            krpano.set('view.fov',lookatObj.fov);
            krpano.set('view.fovmin',lookatObj.fovmin);
            krpano.set('view.fovmax',lookatObj.fovmax);
            krpano.set('view.vlookatmin',-1*lookatObj.vlookatmax);
            krpano.set('view.vlookatmax',-1*lookatObj.vlookatmin);
            krpano.set('autorotate.horizon',lookatObj.keepView=='1' ? "off" : "0.0");
        }

        //krpano.set('events[skin_events].onxmlcomplete,js(initViewSetting(get(xml.scene)));');
    }
    if(settingFlag){
        firstEyeBtnReset();
        verticalEyeBtnReset();
    }
}

function firstEyeBtnReset(){
    $("#first_eye button").button('reset');
    $("#first_eye button").attr("disabled",false);
}

function verticalEyeBtnReset(){
    $("#vertical_eye button").button('reset');
    $("#vertical_eye button").attr("disabled",false);
}

//krpano调用 场景载入完成时获取初始视角截图
function setInitAngle(){
    if($("#panoSettingObject").length > 0){
        setInitAngleImg();
    }
}
function searchOnPage() {
    var searchStr = $("#search").val().toLowerCase();
    if (searchStr == "" || searchStr == null || searchStr == undefined) {
        //$("[name='allItems']").each(function(row,num){
        //    $(num).show();
        //});
        $("[name='allItems']").show();
    } else {
        $("[name='searchname']").each(function (row, num) {
            var text = $(num).text().toLowerCase();
            if (text.indexOf(searchStr) != -1) {
                $(num).parents("[name='allItems']").show();

            } else {
                $(num).parents("[name='allItems']").hide();
            }
        });
    }
}
function clearHotspotList(){
    $('div.all-edit').prev().show();
    $('div.all-edit').html('');
    resetHotspotSum();
}

function updateHotSpotData(sceneName,hsName,ath,atv,hotspotType){
    var data = $('#panoSettingModal .hot').data(sceneName);
    $(data[hotspotType]).each(function(idx){
        if(this.name == hsName){
            this.ath = ath;
            this.atv = atv;
            return false;
        }
    });
}

function calcAngle(ev){
    var containerOffset = $('.sandtable-window-img').offset();
    var offsetX = containerOffset['left'];
    var offsetY = containerOffset['top'];
    //var offsetX = 0;
    //var offsetY = 0;
    var mouseX = ev.pageX - offsetX;//计算出鼠标相对于画布顶点的位置,无pageX时用clientY + body.scrollTop - body.clientTop代替,可视区域y+body滚动条所走的距离-body的border-top,不用offsetX等属性的原因在于，鼠标会移出画布
    var mouseY = ev.pageY - offsetY;
    var cx = $(dragElm).parents(".radar-control").position().left + 30;
    var cy = $(dragElm).parents(".radar-control").position().top + 30;
    var ox = mouseX - cx;//cx,cy为圆心
    var oy = mouseY - cy;
    var to = Math.abs( ox/oy );
    var angle = Math.atan( to )/( 2 * Math.PI ) * 360;//鼠标相对于旋转中心的角度
    if( ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系
    {
        angle = -angle;
    }else if( ox < 0 && oy > 0)//左下角,3象限
    {
        angle = -( 180 - angle )
    }else if( ox > 0 && oy < 0)//右上角，1象限
    {
        angle = angle;
    }else if( ox > 0 && oy > 0)//右下角，2象限
    {
        angle = 180 - angle;
    }
    //console.log(angle);
    $(dragElm).parent(".radar-circle").css('rotate', angle);
}

var dragElm;
function dragStart(event){
    dragElm = event.target;
    $(document).mousemove(calcAngle);
    $(document).mouseup(dragEnd);
}

function dragEnd(e){
    //记录雷达初始角度偏移量
    var rotate = $(dragElm).parent(".radar-circle").css('rotate');
    $(dragElm).parent(".radar-circle").data('rotate',rotate);
    var krpano = document.getElementById('panoSettingObject');
    var hlookat = krpano.get('view.hlookat');
    $(dragElm).parent(".radar-circle").data('hlookat',hlookat);
    var sceneTitle = $(dragElm).parent(".radar-circle").prev().data('original-title');
    putSandTableData(krpano.get('xml.scene'),sceneTitle,rotate,hlookat);
    $(document).unbind('mousemove',calcAngle);
    $(document).unbind('mouseup',dragEnd);
}

function addRadarControl(){
    $('#chooseSceneModal .modal-body .row').html('');
    $("#pics > div").each(function (idx) {
        var htmlStr = '<div class="col-md-3">'+
            '<div class="choose-scene-col" data-viewuuid="' + $(this).attr("data-viewuuid") + '">'+
            '<img src="'+$(this).find("img").attr("src")+'">'+
            '<span>'+$(this).find(".card-heading > span:eq(1)").text()+'</span>'+
            '</div>'+
            '</div>';
        $('#chooseSceneModal .modal-body .row').append(htmlStr);
    });
    $('#chooseSceneModal .modal-footer button.btn-primary').removeClass('btn-primary');
    $('#chooseSceneModal .modal-footer button:eq(0)').attr('disabled',true);
    $('#chooseSceneModal').modal('show');
}

function addRadarControlOk(){
    var imguuid = $('#chooseSceneModal .scene-clicked').data('viewuuid');
    var sceneTitle = $('#chooseSceneModal .scene-clicked span').text();
    var sceneName = 'scene_' + imguuid.toLowerCase();
    var existObj = $('.radar-control img.radar-control-img[data-scenename='+sceneName+']');
    if(existObj.length > 0){
        existObj.parent().remove();
    }
    deleteRadarData(sceneName);
    putSandTableData(sceneName,sceneTitle,0,0);
    appendRadarCircle(sceneName,sceneTitle);
    $('.radar-control img.radar-control-img:last').click();
    $('#chooseSceneModal').modal('hide');
}

function appendRadarCircle(sceneName,sceneTitle){
    var htmlStr = '<div class="radar-control">'+
        '<img class="radar-control-img" src="/static/images/kr/radar-out.png" data-toggle="tooltip" title="'+sceneTitle+'" data-container="#panoSettingModal" ondragstart="return false;" data-scenename="'+sceneName+'">'+
        '<div class="radar-circle">'+
        '<div class="radar-point" onmousedown="dragStart(event)" ></div>'+
        '<div class="radar-center-point"></div>'+
        '</div>'+
        '</div>';
    $('.sandtable-window .sandtable-img-margin').append(htmlStr);
    $('img.radar-control-img[data-toggle="tooltip"]:last').tooltip({});
}

function putSandTableData(sceneName,sceneTitle,rotate,hlookat,topPx,leftPx){
    var sandData = $('#sandImg .sand-img-clicked').data('sand-table-data');
    if(!sandData){
        sandData = {};
        sandData[sceneName] = {};
        sandData[sceneName].rotate = 0;
        sandData[sceneName].hlookat = 0;
        sandData[sceneName].top = '40%';
        sandData[sceneName].left = '40%';
        sandData[sceneName].krpTop = '48%';
        sandData[sceneName].krpLeft = '48%';
    }else{
        if(!sandData[sceneName]){
            sandData[sceneName] = {};
            sandData[sceneName].rotate = 0;
            sandData[sceneName].hlookat = 0;
            sandData[sceneName].top = '40%';
            sandData[sceneName].left = '40%';
            sandData[sceneName].krpTop = '48%';
            sandData[sceneName].krpLeft = '48%';
        }
    }

    if(rotate)sandData[sceneName].rotate = rotate;
    if(hlookat)sandData[sceneName].hlookat = hlookat;
    if(sceneTitle)sandData[sceneName].sceneTitle = sceneTitle;
    if(topPx){
        var imgHeight = $('.sandtable-img-margin').height();
        var top = percentNum(topPx,imgHeight);
        var krpTop = percentNum(topPx+20,imgHeight);
        sandData[sceneName].top = top;
        sandData[sceneName].krpTop = krpTop;
    }
    if(leftPx){
        var imgWidth = $('.sandtable-img-margin').width();
        var left = percentNum(leftPx,imgWidth);
        var krpLeft = percentNum(leftPx+20,imgWidth);
        sandData[sceneName].left = left;
        sandData[sceneName].krpLeft = krpLeft;
    }
    $('#sandImg .sand-img-clicked').data('sand-table-data',sandData);
}

function radarRotate(sceneName,hlookat){
    var obj = $('.radar-control img.radar-control-img[data-scenename='+sceneName+']');
    if(obj.length > 0){
        var sandData = $('#sandImg .sand-img-clicked').data('sand-table-data');
        var rotate = sandData[sceneName].rotate;
        var lastHlookat = sandData[sceneName].hlookat;
        var hlookatIncre = hlookat - (lastHlookat ? lastHlookat : 0);
        obj.next().css('rotate',parseFloat(hlookatIncre) + parseFloat(rotate ? rotate : 0));
    }
}

function deleteRadarControl(){
    var radar = $('.radar-control .radar-circle:visible');
    if(radar.length > 0){
        radar.parent().remove();
        deleteRadarData(radar.prev().data('scenename'));
    }else{
        $.zui.messager.show('请先点击选择热点后再删除', {placement: 'center', type: 'warning', time: '3000', icon: 'warning-sign'});
    }
}

function deleteRadarData(sceneName){
    //如果data中有该雷达数据，则清除
    $('.sand-img-cont').each(function(idx){
        var data = $(this).data('sand-table-data');
        if(data && data[sceneName]){
            delete data[sceneName];
            return false;
        }
    });
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

function openFirstImgModal(el){
    var img = $(el).prev('img');
    $('#firstImgModal').data('element',img);
    $('#firstImgModal .modal-body img').attr('src',img.attr('src'));
    var useImg = img.data('useimg');
    if(useImg){
        $('#firstImgModal .modal-body button:eq(1)').show();
    }else{
        $('#firstImgModal .modal-body button:eq(1)').hide();
    }
    $('#firstImgModal').data('useimg',useImg);
    $('#firstImgModal').modal('show');
}

function changeTourGuideStartEndImg(data) {
    $('#firstImgModal .modal-body img').attr('src',data.src);
    $('#firstImgModal').data('useimg',true);
    $('#firstImgModal .modal-body button:eq(1)').show();
}

function tourGuideImgOK(){
    var img = $('#firstImgModal').data('element');
    img.attr('src',$('#firstImgModal .modal-body img').attr('src'));
    img.data('useimg',$('#firstImgModal').data('useimg'));
    $('#firstImgModal').modal('hide');
}

var defaultImageUrl = '/static/images/kr/default2-120x120.png';
function removeTourGuideStartEndImg(el){
    $('#firstImgModal .modal-body img').attr('src',defaultImageUrl);
    $('#firstImgModal').data('useimg',false);
    $(el).hide();
}

function deleteTourGuideNode(){
    var clickedObj = $('#home5 .tour-clicked');
    clickedObj.popover('hide');
    var tourpointname = clickedObj.data('tourpointname');
    var krpano = document.getElementById('panoSettingObject');
    krpano.call('removehotspot('+tourpointname+')');
    krpano.call('removelayer('+'tooltip_'+tourpointname+')');
    if(clickedObj.prev().length == 0){
        clickedObj.next().remove();
    }else{
        clickedObj.prev().remove();
    }
    clickedObj.remove();
}

var lsTourGuideObj = null;
function startTourGuide(){
    toggleBtns(false);
    lsTourGuideObj = buildTourGuideSetting();
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

compare = function (input, str, exact) {
    return input !== undefined && (exact ? input === str : input.match(str));
};
function checkFileAlowedExtensions(fileExt,file){
    var fileExtExpr = new RegExp('\\.(' + fileExt.join('|') + ')$', 'i');
    var chk = compare(slug(file.name), fileExtExpr);
    var pass = isEmpty(chk) ? 0 : chk.length;
    return pass != 0;
}
function slug (text){
    return isEmpty(text) ? '' : String(text).replace(/[\-\[\]\/\{}:;#%=\(\)\*\+\?\\\^\$\|<>&"']/g, '_');
}
function isEmpty(text){
    if(text == undefined || text == ''){
        return true;
    }
    return false;
}


function chooseVoiceHotSpot(){
    chooseMediaResCallBack = chooseVoiceHotSpotOK;
}

function chooseVoiceHotSpotOK(data){
    $(openMediaResObj).prev().data("musicsrc", data.src);
    $(openMediaResObj).prev().find('span:eq(0)').text('已选择音乐：');
    $(openMediaResObj).prev().find('span:eq(1)').text(data.title);
    toggleAllNextBtn(true);
}

function chooseAtlasImg(){
    chooseMediaResCallBack = chooseAtlasImgOK;
}

function chooseAtlasImgOK(data){
    $(data.imgs).each(function(idx){
        var html = '<li>'+
        '<img src="'+this.src+'">'+
            '<span class="delete"><a href="javascript:void(0)">删除</a></span>'+
        '</li>';
        $('#imgChoose ul.imghotspot-sortable').append(html);
    });
    toggleAllNextBtn(true);
}

function loadGallery(){
    var krpano = document.getElementById('krpanoSWFObject');
    if(krpano){
        var hotspotObj = buildHotspotSetting();
        var xmlStr = '<krpano>';
        $.each(hotspotObj,function(sceneName,value){
            if(value){
                $(value.image).each(function(idx){
                    xmlStr += '<gallery name="'+this.galleryName+'" title="">';
                    $(this.imgs).each(function(idx){
                        xmlStr += '<img name="img'+idx+'" url="'+this.src+'" title="" />';
                    });
                    xmlStr += '</gallery>';
                });
            }
        });
        xmlStr += '</krpano>';
        krpano.call('loadxml('+xmlStr+',null,MERGE);');
    }
}

function chooseSceneHotSpotIcon(){
    chooseMediaResCallBack = chooseSceneHotSpotIconOK;
}

function chooseSceneHotSpotIconOK(data){
    $(openMediaResObj).parent().prev().attr("src", data.src);
    toggleAllNextBtn(true);
}

function provChange(evt, params, city_id) {
    //alert(JSON.stringify(params));
    var prov = params.selected;
    var cityHtml = '<option value=""></option>';
    for (var i = 0; i < _cityArr.length; i++) {
        var city = _cityArr[i];
        if (city.pcode == prov) {
            cityHtml += '<option value="' + city.code + '">' + city.name + '</option>';
        }
    }
    $("#" + city_id).html(cityHtml);
    $('#' + city_id).trigger('chosen:updated');
}

function showFullscreenBtn(){
    $(".btn_fullscreen").show();
}

//添加场景跳转热点
function openCreateSceneGroup(idx){
    $('#allAroundModal').data('hotspotidx',idx);
    //查询图片媒体资源
    var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
    sb.pushData("act", 'list');
    sb.pushData("type", 'system');
    sb.pushData("media_type", '2');
    sb.submit(function () {
        $("#allAroundModal .icon_text > div.row").html('');
    }, function (data) {
        $('#allAroundModal .icon_choose input[name=radioOptionsExample]:eq(0)').click();
        addDefMediaHotSpotRes(data);
        addSceneChangeHotSpotSceneArr();
        resetHotSpotCustomIcon();
        $('#allAroundModal .modal-header h3').text(hotSpotModalTitle[idx]);
        toggleHotSpotUL(idx);
        $('.all-next').data('ismodify',false);
        $(".allAround ul.hot-nav:eq("+idx+")>li:nth-child(1)").click();
        $(".allAround ul.hot-nav:eq("+idx+")>li").data('finish',false);
        $('#allAroundModal').modal('show');
    });
}

function addSceneGroupFinish(idx){
    var param = {};
    param.scenes = new Array();
    var groupName = $('#group-name input.form-control').val();
    //param.groupName = groupName;
    getHotSpotIconData(param);
    addOneSceneGroup(groupName,param.imgPath,param.iconType);
    $('#group-scene .row .scene-group-choosed').each(function(idx){
        //var sceneObj = {};
        var viewuuid = $(this).data('viewuuid');
        //sceneObj.sceneName = 'scene_'+viewuuid.toLowerCase();
        //sceneObj.viewuuid = viewuuid;
        //sceneObj.imgPath = $(this).find('img').attr('src');
        //sceneObj.sceneTitle = $(this).find('.scenetitle').text();
        //param.scenes.push(sceneObj);
        $('#groupbyul .group-item-body li[data-viewuuid='+viewuuid+']').appendTo($('#groupbyul .group-item-body:last'));
    });
    $( ".group-item-body:last" ).sortable({
        connectWith: ".group-item-body",
        placeholder: "ui-state-highlight"
    });
    //var sceneGroupData = $('.group-by').data('scenegroup');
    //sceneGroupData.sceneGroups.push(param);
}

function buildSceneGroupSetting(){
    // var sceneGroup = $('.group-by').data('scenegroup');
    // if(sceneGroup.sceneGroups && sceneGroup.sceneGroups.length > 0 && $('#groupbyul > li').length == 0){
    //     return sceneGroup;
    // }
    var sceneGroupObj = {};
    sceneGroupObj.sceneGroups = new Array();
    $('#groupbyul > li').each(function(idx){
        if($(this).find('.group-item-body > li').length == 0){
            return true;
        }
        var groupObj = {};
        groupObj.iconType = $(this).find('.group-item-title > img').data('icontype');
        groupObj.imgPath = $(this).find('.group-item-title > img').attr('src');
        groupObj.groupName = $(this).find('.group-item-title > span').text();
        groupObj.scenes = new Array();
        $(this).find('.group-item-body > li').each(function(idx){
            var sceneObj = {};
            var viewuuid = $(this).data('viewuuid');
            sceneObj.sceneName = 'scene_'+viewuuid.toLowerCase();
            sceneObj.viewuuid = viewuuid;
            sceneObj.imgPath = $(this).find('img').attr('src');
            sceneObj.sceneTitle = $(this).find('span').text();
            groupObj.scenes.push(sceneObj);
        });
        sceneGroupObj.sceneGroups.push(groupObj);
    });
    return sceneGroupObj;
}

function modifySceneGroup(){
    var param = {};
    getHotSpotIconData(param)
    var sceneGroupIdx = $('.all-next').data('scenegroupidx');
    var imgObj = $('#groupbyul > li:eq('+sceneGroupIdx+') .group-item-title img');
    imgObj.data('icontype',param.iconType);
    if(param.imgPath)
        imgObj.attr('src',param.imgPath);
    imgObj.next().text($('#group-name input.form-control').val());
}

function hideShareAndFootmarkBtn(){
    $(".vrshow_container_2_min .img_desc_container_min:eq(0)").hide();
    $(".vrshow_container_2_min .img_desc_container_min:eq(2)").hide();
}

function showWebvrBtn(){
    $('.btn_vrmode').show();
}

function hideAllCommentHotspot(){
    var krpano = document.getElementById('krpanoSWFObject');
    krpano.call('toggle_all_comment(false)');
    hideComment();
}

function resetWorkCover(mediaData){
    var img = new Image();
    img.src = mediaData.src;
    img.onload = function(){
        if(img.naturalWidth < 450 || img.naturalHeight < 450 ){
            $("#errorMsg").text("图片尺寸小于450*450像素");
            $("#errorMsgDiv").show();
            return;
        }
        $("#errorMsgDiv").hide();
        //修改封面
        replaceWorkCover(mediaData);
    }
}

function replaceWorkCover(mediaData){
    var sb = _U.getSubmit('/edit/pic', null, 'ajax', true);
    sb.pushData("act","replaceWorkCover");
    sb.pushData("pk_works_main", pk_works_main);
    sb.pushData("thumb_path",mediaData.key);
    sb.submit(function () {
    }, function (data) {
        if(data.flag){
            $.zui.messager.show('修改成功', {placement: 'center', type: 'success', time: '3000', icon: 'check'});
            
            $("#thumbpath").attr("src", data.absolutelocation);
        }else{
            $.zui.messager.show('修改失败', {placement: 'center', type: 'success', time: '3000', icon: 'check'});
        }
    });
}

function choose_imgtext_ok(mediaData){
    imgtext_editor.appendHtml("<img src='"+mediaData.src+"' width='200px' />");
    // imgtext_editor.exec('insertimage', mediaData.src, 'title', 200, 100, 1, 'right');
}

function build_common_modal(type){
    $('#modal_obj #object_list').html("");

    if (type == 'obj' ) {
        //加载环物
        choose_objs();
    }else if(type == 'video'){
        //加载视频素材
        choose_videos();
    }
    $('#modal_obj').data('type',type);
    $('#modal_obj').modal('show');
}

function choose_objs(){
    $.post('/edit/object_around',{
        'act':'list',
    },function(res){
        var html  = "";
        for(var i =0 ; i<res.length ; i++){
            var o = res[i];
            html+=' <div class="col-md-3" data-objname="'+o.name+'" data-objid="'+o.id+'" data-thumb="'+o.thumb_path+'">'+
                  '  <div class="card">'+
                  '    <div class="media-wrapper">'+
                  '      <img src="'+o.thumb_path+'" style="height:120px">'+
                  '     </div>'+
                  '    <div class="card-heading">'+
                  '         <span class="card-scene-name">'+o.name+'</span>'+
                  '     </div>'+
                  '  </div>'+
                  ' </div>';
        }
        $('#modal_obj .modal-header h3').html('请选择环物项目');
        $('#modal_obj #object_list').html(html);
    },'json');
}

function choose_videos(){

    var sb = _U.getSubmit("/member/mediares", null, "ajax", false);
    sb.pushData("act", 'list');
    sb.pushData("type", 'custom');
    sb.pushData("media_type", '2');
    sb.submit(function () {

    }, function (res) {
       var html  = "";
       for(var i =0 ; i<res.length ; i++){
           var o = res[i];
           html+=' <div class="col-md-3" data-name="'+o.media_name+'" data-id="'+o.pk_media_res+'" data-location="'+o.absolutelocation+'">'+
                 '  <div class="card">'+
                 '    <div class="media-wrapper" style="height: 130px;padding-top: 26px;">'+
                 '      <img src="/static/images/play.png" >'+
                 '     </div>'+
                 '    <div class="card-heading">'+
                 '         <span class="card-scene-name">'+o.media_name+'</span>'+
                 '     </div>'+
                 '  </div>'+
                 ' </div>';
       }
       $('#modal_obj .modal-header h3').html('请选择视频素材');
       $('#modal_obj #object_list').html(html);
    });
}