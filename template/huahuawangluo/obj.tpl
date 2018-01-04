<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <title>{$obj.name}</title>
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta content="no-cache, no-store, must-revalidate" http-equiv="Cache-Control" />
    <meta content="no-cache" http-equiv="Pragma" />
    <meta content="0" http-equiv="Expires" />
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <link rel="stylesheet" href="/template/{$_lang.moban}/css/redefine.css">
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
<div id="pano" style="width:100%; height:100%;">
    <noscript><table style="width:100%;height:100%;"><tr style="valign:middle;"><td><div style="text-align:center;">ERROR:<br/><br/>Javascript not activated<br/><br/></div></td></tr></table></noscript>
    <script>
        {literal}
        embedpano({swf:"/tour/tour.swf", xml:"/tour/object_preview.xml", target:"pano", html5:"auto", passQueryParameters:true});
        {/literal}
    </script>
</div>
<script type="text/javascript">
//组装分享的参数
//title
_title = '{$obj.name}';
_content = '';
_imgUrl = '{$obj.thumb_path}';
</script>
<script language="JavaScript" type="text/javascript" src="/static/js/jquery-1.9.1.js"></script>
<script language="JavaScript" type="text/javascript" src="/static/js/kr/object.js"></script>
<script language="JavaScript" type="text/javascript" src="/static/js/kr/jssdk.js"></script>
<script>
    $(function(){
       $.post('/obj.php',{
            'act':'init_obj',
            'oid':{$obj.id}
        },function(res){
            var krpano = document.getElementById('krpanoSWFObject');
            var imgs = res.imgs;
                for(var i=0 ; i<imgs.length; i++){
                var fname = 'frame'+i;
                krpano.call('addplugin('+fname+');'+
                         'plugin['+fname+'].loadstyle(frame);'+
                         'set(plugin['+fname+'].url,'+imgs[i].imgsrc+');');
                }
            krpano.call("set(currentframe,0);set(framecount,"+imgs.length+");set(oldmousex,0);showframe(0);");
        },'json')
    })
</script>
</body>


</html>