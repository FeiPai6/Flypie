$(function(){
	plugins_init_function.push(bgvoice_init);
    plugins_config_get_function.push(buildBgVoice);
    $('#voiceModal').on('hide.zui.modal', function (e) {
        pauseAudioMusic();
    });
    $('#voiceModal').on('show.zui.modal', function (e) {
        chooseMediaResCallBack = changeVoiceMusic;
    });
    $("#voiceModal .voice .radio>label").click(function () {
        var n = $(this).index();
        $("#voiceModal .voice_content>div").eq(n).show();
        $("#voiceModal .voice_content>div").eq(n).siblings().hide();
    });
})
function openVoice() {
    $("#voiceModal").modal('show');
}
function bgvoice_init(){
	$("#pics > div").each(function (idx) {
        appendSpeechScene(this);
    });
    data = panoConfig.speech_explain;
    if (data.isWhole=='1') {
        $("#voiceModal .voice input[name=radioSpeak]:eq(0)").click();
        var row = $("#voiceModal .voice_content > div:eq(0) > .row");
        if (data.useSpeech=='1') {
            row.children(':eq(0)').find('label').text(data.mediaTitle);
            row.find('audio').attr('src', data.mediaUrl);
            row.find('.btn-group button').attr('disabled', false);
        } else {
            row.find('.btn-group button').attr('disabled', true);
        }
    } else {
        $("#voiceModal .voice_content > div:eq(0) > .row .btn-group button").attr('disabled', true);
        $("#voiceModal .voice input[name=radioSpeak]:eq(1)").click();
        $(data.sceneSettings).each(function (idx) {
            var row = $("#voiceModal .voice_content > div:eq(1) > .row[data-viewuuid=" + this.imgUuid + "]");
            if (this.useSpeech=='1') {
                row.children(':eq(1)').find('label').text(this.mediaTitle);
                row.find('audio').attr('src', this.mediaUrl);
                row.find('.btn-group button').attr('disabled', false);
            } else {
                row.find('.btn-group button').attr('disabled', true);
            }
        });
    }
}

function buildBgVoice(panoConfig){
    var speechObj = {};
    var isWhole = $('input[name=radioSpeak]:checked').val() == '0'?1:0;
    speechObj.isWhole = isWhole;
    if (isWhole) {
        var audioTag = $('#voiceModal .voice_content > div:eq(0) audio');
        var useSpeech = audioTag.attr('src') ? 1 : 0;
        speechObj.useSpeech = useSpeech;
        if (useSpeech) {
            speechObj.mediaUrl = audioTag.attr('src');
            speechObj.mediaTitle = audioTag.parent().parent().prev().prev().children().text();
        }
    } else {
        speechObj.sceneSettings = [];
        $('#voiceModal .voice_content > div:eq(1) > div.row').each(function (idx) {
            var setting = {};
            var audioTag = $(this).find('audio');
            var useSpeech = audioTag.attr('src') ? 1 : 0;
            setting.useSpeech = useSpeech;
            setting.imgUuid = $(this).attr("data-viewuuid");
            if (useSpeech) {
                setting.mediaUrl = audioTag.attr('src');
                setting.mediaTitle = audioTag.parent().parent().prev().prev().children().text();
            }
            speechObj.sceneSettings.push(setting);
        });
    }
    panoConfig.speech_explain =  speechObj;
}
function changeVoiceMusic(data) {
    $(openMediaResObj).parent().next().find("audio").attr("src", data.src);
    $(openMediaResObj).parent().prev().children().text(data.title);
    $(openMediaResObj).parent().next().find('button').attr('disabled', false);
}