function openProjectDownModal(){
    $("#projectDownModal").modal('show');
}
function confirmDownload(){
	$.post('/member/download',{
		'pid':pk_works_main,
		'act':'validate'
	},function(res){
		if (res.status==1) {
			window.location.href="/member/download";
		}else{
			alert_notice(res.msg);
		}
	},'json')
}
