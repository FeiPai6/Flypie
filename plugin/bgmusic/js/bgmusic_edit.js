$(function(){
	plugins_init_function.push(bgmusic_init);
    plugins_config_get_function.push(buildBgMusic);
    $('#bgMusicModal').on('hide.zui.modal', function (e) {
        pauseAudioMusic();
    });
     $('#bgMusicModal').on('show.zui.modal', function (e) {
         chooseMediaResCallBack = changeVoiceMusic;
     });
     $("#bgMusicModal .voice .radio>label").click(function () {
         var n = $(this).index();
         $("#bgMusicModal .voice_content>div").eq(n).show();
         $("#bgMusicModal .voice_content>div").eq(n).siblings().hide();
     });
     
})
function openMusic() {
    $("#bgMusicModal").modal('show');
}
function bgmusic_init(){
	$("#pics > div").each(function (idx) {
	    appendMusicScene(this);
	});
	var data = panoConfig.bg_music;
	if (data.isWhole=='1') {
	    $("#bgMusicModal .voice input[name=radioMusic]:eq(0)").click();
	    var row = $("#bgMusicModal .voice_content > div:eq(0) > .row");
	    if (data.useMusic=='1') {
	        row.children(':eq(0)').find('label').text(data.mediaTitle);
	        row.find('audio').attr('src', data.mediaUrl);
	        row.find('.btn-group button').attr('disabled', false);
	    } else {
	        row.find('.btn-group button').attr('disabled', true);
	    }
	} else {
	    $("#bgMusicModal .voice_content > div:eq(0) > .row .btn-group button").attr('disabled', true);
	    $("#bgMusicModal .voice input[name=radioMusic]:eq(1)").click();
	    $(data.sceneSettings).each(function (idx) {
	        var row = $("#bgMusicModal .voice_content > div:eq(1) > .row[data-viewuuid=" + this.imgUuid + "]");
	        if (this.useMusic) {
	            row.children(':eq(1)').find('label').text(this.mediaTitle);
	            row.find('audio').attr('src', this.mediaUrl);
	            row.find('.btn-group button').attr('disabled', false);
	        } else {
	            row.find('.btn-group button').attr('disabled', true);
	        }
	    });
	}
}
function buildBgMusic(panoConfig) {
    var musicObj = {};
    var isWhole = $('input[name=radioMusic]:checked').val() == '0'?1:0;
    musicObj.isWhole = isWhole;
    if (isWhole) {
        var audioTag = $('#bgMusicModal .voice_content > div:eq(0) audio');
        var useMusic = audioTag.attr('src') ? 1 : 0;
        musicObj.useMusic = useMusic;
        if (useMusic) {
            musicObj.mediaUrl = audioTag.attr('src');
            musicObj.mediaTitle = audioTag.parent().parent().prev().prev().children().text();
        }
    } else {
        musicObj.sceneSettings = [];
        $('#bgMusicModal .voice_content > div:eq(1) > div.row').each(function (idx) {
            var setting = {};
            var audioTag = $(this).find('audio');
            var useMusic = audioTag.attr('src') ? 1 : 0;
            setting.useMusic = useMusic;
            setting.imgUuid = $(this).attr("data-viewuuid");
            if (useMusic) {
                setting.mediaUrl = audioTag.attr('src');
                setting.mediaTitle = audioTag.parent().parent().prev().prev().children().text();
            }
            musicObj.sceneSettings.push(setting);
        });
    }
    panoConfig.bg_music = musicObj;
}