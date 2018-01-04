var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i)=="micromessenger") {
     var currentUrl = location.href.split('#')[0];
    //Ajax
    $.post('/tour.php?act=jssdk', {'currentUrl':currentUrl}, function (data) {
        //jsSdk
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId:  data.appId, // 必填，公众号的唯一标识
            timestamp:  data.timestamp, // 必填，生成签名的时间戳
            nonceStr:   data.nonceStr,  // 必填，生成签名的随机串
            signature:  data.signature , // 必填，签名，见附录1
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {
            //title
            //_title = $('body').data('panoData').name;
			//_content = $('body').data('panoData').profile;
			//_imgUrl = $('body').data('panoData').thumb_path;
            if(!_content){
                _content ='';
            }
            wx.onMenuShareTimeline({
                title: _title, // 分享标题
                link: location.href.split('#')[0], // 分享链接
                imgUrl: _imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }

            });
            wx.onMenuShareAppMessage({
                title: _title, // 分享标题
                desc: _content, // 分享描述
                link: location.href.split('#')[0], // 分享链接
                imgUrl: _imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: _title, // 分享标题
                desc: _content, // 分享描述
                link: location.href.split('#')[0], // 分享链接
                imgUrl: _imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: _title, // 分享标题
                desc: _content, // 分享描述
                link: location.href.split('#')[0], // 分享链接
                imgUrl: _imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQZone({
                title: _title, // 分享标题
                desc: _content, // 分享描述
                link: location.href.split('#')[0], // 分享链接
                imgUrl: _imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

        });
    });
}
