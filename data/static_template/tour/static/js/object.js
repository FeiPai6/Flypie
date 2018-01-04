//flag 标识是否从预览页打开 true
function obj_buildframes(oid,sceneName){
	var krpano = document.getElementById('krpanoSWFObject');
	var objs = getObj(oid,sceneName);
	for(var i=0 ; i<objs.length; i++){
		var fname = 'frame'+i;
		krpano.call('addplugin('+fname+');'+
				 'plugin['+fname+'].loadstyle(frame);'+
				 'set(plugin['+fname+'].url,'+objs[i].imgsrc+');');
	}
	toggleBtns(false);
	krpano.call("set(currentframe,0);set(framecount,"+objs.length+");set(oldmousex,0);showframe(0);");
}
function getObj(oid,sceneName){
	var objs = data.hotspot[sceneName]['obj'];
	for(var i= 0 ; i< objs.length;i++){
		var o = objs[i];
		if (o.objid == oid) {
			return o.objs;
		}
	}
}