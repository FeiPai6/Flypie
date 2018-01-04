(function (u, $) {
    var tid = null, ctrl = null, page = null, isContinue = true, data = [], postType = null, types = ['form', 'download'], async = true, url = 'ajax.uhweb';
    u.mix({
        getSubmit: function (_url, _data, _postType, _async) {
            tid = null;
            ctrl = null;
            page = null;
            isContinue = true;
            data = {};
            postType = null;
            types = ['form', 'download'];
            async = true;
            url = _url;
            //if (_tid.indexOf('Ctrl') > -1) {
            //    ctrl = _tid;
            //} else {
            //    tid = _tid;
            //}
            data = _data || data;
            postType = _postType;
            async = !_async;
            this.setTid = _setTid;
            this.setCtrl = _setCtrl;
            this.pushData = _pushData;
            this.submit = _submit;
            this.formData = _formData;
            this.gridData = _gridData;
            this.stop = _stop;
            return this;
        },
        load : function(info) {
            var _h = $(document).height(info);
            $('body').append(
                //'<div id="mengban" style="position: absolute;top:0;left:0;width:100%;background:#333;filter: alpha(opacity=50); opacity:0.5; z-index: 1998; height:100%">'+
                //"<div style='height:168px;width:128px;position: fixed;margin:auto;top:0;bottom:0;right : 0;left : 0;z-index: 999;'>"+
                //"<img src='/uhweb/common/image/loading.gif' style='height:128px;width:128px;'/>"+
                //"<div style='color:white;width:128px;height:40px;text-align: center;line-height:40px'>"+
                //(info ? info : '')+
                //'</div>'+
                //'</div>'+
                //'</div>'
                '<div id="mengban" style="position: absolute;top:0;left:0;width:100%;background:#333;filter: alpha(opacity=50); opacity:0.5; z-index: 1998; height:100%">'+
                '<div class="icon icon-spin loader icon-spinner-indicator"></div>'+
                '</div>'
            );

            /*
             * $('body').append('<div id="mengban" class="win_dl"
             * style="position:
             * absolute;top:0;left:0;width:100%;background:#333;filter:
             * alpha(opacity=50); opacity:0.5; z-index: 1998;
             * height:1000px">' + "<div class='load-container load1'
             * style='margin-top: 20%'>" + "<div
             * class='loader'>Loading...</div>" + "</div>"+ '</div>');
             */
        },
        loadOver : function() {
            $("#mengban").remove();
        }
    });
    var _setTid = function (t) {
            tid = t;
        }, _setCtrl = function (c) {
            ctrl = c;
        }, _pushData = function (k, v) {
            var pd = {};
            if (arguments.length == 2) {
                if (!v)v = ''; //解决 如果数字时候后台会报错的问题
                //var sd = {};
                //sd[k] = v + '';
                //pd.push(sd);
                pd[k] = v;
            } else {
                if ($.isPlainObject(k)) {
                    pd = k;
                }
                //else if ($.isArray(k)) {
                //    pd = k;
                //}
            }
            //for (var i = 0; i < pd.length; i++) {
            //    if (!pd[i]["uhweb"]) {
            //        pd[i]["uhweb"] = "attr";
            //    }
            //}
            //$.merge(data, pd);
            data = $.extend({}, data, pd);
            return this;
        }, _formData = function (name, data) {
            var d = {'uhweb': 'UhwebForm', 'name': name, 'data': {}};
            $.each(data, function (i, n) {
                d.data[i] = {'value': n};
            });
            return d;
        }, _gridData = function (name, data) {
            var d = {'uhweb': 'UhwebGrid', 'name': name, 'trs': []}, tds;
            $.each(data, function (i, n) {
                d.trs.push({'tds': _formData(null, n).data});
            });
            return d;
        }, _stop = function () {

        },
        _submit = function (beforeEvent, afterEvent,hideLoadding) {
            var request = JSON.stringify(data);
            // request = request.replace(/&/g, "#*^@^*#");
            request = request.replace(/%/g, "%25");
            request = request.replace(/[+]+/g, '%2B');
            $.ajax({
                'type': "POST",
                'url': url,
                'data': request,
                'dataType': 'json',
                'async':async,
                //'contentType':"text/html;charset=UTF-8",
                'contentType': "application/json;charset=UTF-8",

                //发送请求前可修改 XMLHttpRequest 对象的函数
                'beforeSend': function () {
                    if(!hideLoadding){
                        _U.load();
                    }
                    if (beforeEvent)
                        beforeEvent();
                    //return isContinue;
                },
                //请求成功后的回调函数
                'success': function (data, textStatus, jqXHR) {
                    //自动填充数据
                    //$.each(data.data, function(i, value)
                    //{
                    //    switch(value.uhweb)
                    //    {
                    //        case 'UhwebForm' : _U.initForm(value); break;
                    //        case 'UhwebGrid' : _U.initTable(value); break;
                    //        default : _U.initAttr(value); break;
                    //    }
                    //});
                    if(!hideLoadding) {
                        _U.loadOver();
                    }
                    if (data.error) {
                        console.log(data.exceptionContent);
                        window.location.href = '';
                    } else {
                        if (afterEvent) {
                            afterEvent(data);
                        }
                    }
                },
                //(默认: 自动判断 (xml 或 html)) 请求失败时调用此函数
                //timeout, error, notmodified 和 parsererror
                'error': function (XMLHttpRequest, textStatus, errorThrown) {
                    //debugger;
                    if(!hideLoadding){
                        _U.loadOver();
                    }
                },
                //请求完成后回调函数 (请求成功或失败之后均调用)
                'complete': function (XMLHttpRequest, textStatus) {
                    // debugger;
                    if(!hideLoadding){
                        _U.loadOver();
                    }
                }
            });
        }
})(_U, jQuery);
