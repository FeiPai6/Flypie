<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <title></title>
    <meta name="renderer" content="webkit">
	<meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta content="no-cache, no-store, must-revalidate" http-equiv="Cache-Control" />
    <meta content="no-cache" http-equiv="Pragma" />
    <meta content="0" http-equiv="Expires" />
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <link rel="stylesheet" href="/template/{$_lang.moban}/css/redefine.css">
    <link rel="stylesheet" href="/static/css/alivideo.css" />
    <script language="JavaScript" type="text/javascript" src="/static/js/kr/uhweb.js"></script>
    <script language="JavaScript" type="text/javascript" src="/static/js/kr/vrshow.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <style>
        @-ms-viewport { width:device-width; }
        @media only screen and (min-device-width:800px) { html { overflow:hidden; } }
        html { height:100%; }
        body { height:100%; overflow:hidden; margin:0; padding:0; font-family:microsoft yahei, Helvetica, sans-serif;  background-color:#000000; }
    </style>
</head>
<body>

    <script language="JavaScript" type="text/javascript" src="/tour/tour.js"></script>
    <div id="fullscreenid" style="position:relative;width:100%; height:100%;">
        <div id="panoBtns" style="display:none;">
            <div class="vrshow_container_logo">
                <img id="logoImg" src="/plugin/custom_logo/images/custom_logo.png" style="display: none;"  onclick="javascript:window.open('{$_lang.host}')">

                <div class="vrshow_logo_title" id="user_name_wrap"  >
                    <div id="authorDiv" style="display: none;">作者：<span id="user_nickName">{$pro.nickname}</span></div>
                    <div style="clear:both;"></div>

                </div>
                {foreach $plugins as $k=>$v}
                    {if $v.enable eq 1 AND $v.view_container eq "left_top"}
                        {include file="plugin/$k/template/view.lbi"}
                    {/if}
                {/foreach}

            </div>

            <div class="vrshow_container_1_min">
                <div class="btn_fullscreen" onClick="fullscreen(this)" title="" style="display:none"></div>
                <!-- <div class="btn_bgmusic" onClick="pauseMusic(this)" style="display:none"></div> -->
                {foreach $plugins as $k=>$v}
                    {if $v.enable eq 1 AND $v.view_container eq "right_top"}
                        {include file="plugin/$k/template/view.lbi"}
                    {/if}
                {/foreach}
                <!-- <div class="btn_music" style="display:none" onClick="pauseSpeech(this)"></div> -->
                <!-- <div class="btn_gyro" onClick="toggleGyro(this)"></div> -->
                <!--<a class="btn_music" onclick="showthumbs()"></a>-->
                <!--<a class="btn_comment" onclick="addHotSpot()"></a>-->
                <!--<a class="btn_comment" onclick="openGyro()"></a>-->
            </div>
            <div class="vrshow_radar_btn" onClick="toggleKrpSandTable()">
                <!-- <span class="btn_sand_table_text">沙盘</span> -->
            </div>
            <div class="vrshow_tour_btn" onClick="startTourGuide()">
                <span class="btn_tour_text">一键导览</span>
            </div>
            <div class="vrshow_container_2_min">
            
                {foreach $plugins as $k=>$v}
                    {if $v.enable eq 1 AND $v.view_container eq "right_bottom"}
                        {include file="plugin/$k/template/view.lbi"}
                    {/if}
                {/foreach}
            </div>
            

            <div class="vrshow_container_3_min">
                <div class="img_desc_container_min scene-choose-width" style="display:none">
                    <img src="/static/images/skin1/vr-btn-scene.png" onClick="showthumbs()">
                    <div class="img_desc_min">场景选择</div>
                </div>
            </div>
        </div>
        
        <div id="pano" style="width:100%; height:100%;">
        </div>
		
		<div class="modal" id="pictextModal" data-backdrop="static" data-keyboard="false" style="z-index:2002">
            <div class="modal-dialog">
                <div class="modal-header text-center" >
                    <button type="button" class="close" onClick="hidePictext()"><span>&times;</span></button>
                    <span style="color: #353535;font-weight:700" id="pictextWorkName"></span>
                </div>
                <div class="modal-body" style="height:400px;overflow-y:scroll ">
                    <div class="row">                   
                        <div class="col-sm-offset-1 col-md-offset-1 col-md-10 col-sm-10 col-xs-12" id="pictextContent">
                        </div>
                    </div>
                </div>
            </div>
        </div>
		
<!--         <div class="modal" id="privacyPwdModal" data-backdrop="static" data-keyboard="false" style="z-index:2002">
            <div class="modal-dialog modal-350">
                <div class="modal-content">
                    <div class="modal-header login-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span
                                class="sr-only">关闭</span></button>
                        <img src="/static/images/logo.png">
                    </div>
                    <div class="modal-body padding-l-r">
                        <div class="row">
                            <div class="col-md-12">
                                <form class="form-horizontal" method="post" role="form">
                                    <div class="form-group">
                                        <div class="col-md-12">
                                            <h6 class="text-center" style="margin-top:0;line-height: 2;color: #666;">请输入访问密码</h6>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <input type="password" placeholder="访问密码" id="privacyPwd"
                                                       class="form-control btn-block">
                                            </div>
                                            <div class="col-md-12" style="margin-top: 20px;">
                                                <button class="btn btn-primary btn-block" type="button" id="pwdConfirmBtn">
                                                    确定
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->


        <div id="logreg">
        </div>
        {foreach $plugins as $k=>$v}
            {if $v.enable eq 1 AND $v.view_resource eq 1}
                {include file="plugin/$k/template/resource.lbi"}
            {/if}
        {/foreach}
    </div>


    <div class="modal" id="video_player_modal" data-keyboard="false" style="z-index:2002">
            <div class="modal-dialog">
                <div class="modal-body" style="padding: 0">
					<a href="javascript:;" onClick="close_video_player()" style="position:absolute;color:white;z-index:99999;right:5px;top: 3px;">关闭</a>
                    <div class="prism-player" id="J_prismPlayer" ></div>
                </div>
            </div>
        </div>
    

</body>
<script type="text/javascript">
//组装分享的参数
//title
_title = '{$pro.name}';
_content = '{$pro.profile}';
_imgUrl = '{$pro.thumb_path}';
</script>

<script language="JavaScript" type="text/javascript" src="/static/js/kr/object.js"></script>
<script language="JavaScript" type="text/javascript" src="/static/js/kr/jssdk.js"></script>
<script type="text/javascript" src="/static/js/alivideo.js"></script>
</html>