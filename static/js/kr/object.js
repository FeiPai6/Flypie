//flag 标识是否从预览页打开 true
function obj_buildframes(oid){
	$.post('/obj.php',{
		'act':'init_obj',
		'oid':oid
	},function(res){
		var krpano = document.getElementById('krpanoSWFObject');
		var imgs = res.imgs;
			for(var i=0 ; i<imgs.length; i++){
			var fname = 'frame'+i;
			krpano.call('addplugin('+fname+');'+
					 'plugin['+fname+'].loadstyle(frame);'+
					 'set(plugin['+fname+'].url,'+imgs[i].imgsrc+');');
			}
		 toggleBtns(false);
		krpano.call("set(currentframe,0);set(framecount,"+imgs.length+");set(oldmousex,0);showframe(0);");
	},'json')
}