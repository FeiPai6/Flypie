(function ($) {

    $.fn.loadPage = function (options) {
        var ms_html, isOpen = false;
        var settings = {
            submit: null,
            container: '',
            title: "弹出窗品",
            width: "400px",
            height: "300px",
            url: null,
            ns: ''
        };
        if (options) {
            $.extend(settings, options);
        }
        if (settings.container == '') {
            isOpen = true;
        }
        function initialise() {
            initContent();
            initEvent();
        }

        function initEvent() {
            if (isOpen) {
                $("#j_img_close").click(function () {
                    if (settings.onclose) {
                        settings.onclose();
                    }
                    ms_html.remove();
                });
                $("#j_btn_close").click(function () {
                    if (settings.onclose) {
                        settings.onclose();
                    }
                    ms_html.remove();
                });
                $("#j_btn_close").hover(function () {
                    $(this).css("background-color", "rgb(200, 200, 200)");
                }, function () {
                    $(this).css("background-color", "#FBFDFE");
                });
            }
        }

        function initContent() {
            if (isOpen) {
                var _h = $(document).height(), _w = $(document).width(), _nh = parseInt(settings.height) - 57;
                var html = [];
                html.push('<div style="position: absolute;top:0;left:0;width:100%;background:#333;filter: alpha(opacity=50); opacity:0.5; z-index: 1998; height:'
                    + _h
                    + 'px"></div><div class="winbox" style="display:block;width:'
                    + settings.width
                    + ';height:'
                    + settings.height
                    + '; position: absolute; z-index: 1999;">');
                html.push('<table width="100%"  cellpadding="0" cellspacing="0"><tr><td class="win_t_l"></td><td class="win_t">'
                    + settings.title
                    + '</td><td class="win_t_r"><span class="img_close" id="j_img_close"></span></td></tr></table>');
                html.push('<div class="winbox_nl" id="j_winbox_nl"><div class="win_n');
                if (settings.url != null) {
                    html.push(' win_dl');
                }
                html.push('" id="j_win_n" style="height:' + _nh
                    + 'px"></div><input style="margin-left:47%;background-color: #FBFDFE;color: rgb(12, 12, 12);border-width: 1px;border-color:rgb(83, 83, 83);border-style: solid;" type="button" value="关闭" class="input_b" id="j_btn_close"/></div>');
                html.push('</div>');
                ms_html = $(html.join("")).appendTo('body');
                var h = (_h - parseInt(settings.height)) / 2;
                var w = (_w - parseInt(settings.width)) / 2;
                $('.winbox').css({
                    'top': h,
                    'left': w
                });
                if (settings.backgroundcolor) {
                    $("#j_winbox_nl").css("background-color",
                        settings.backgroundcolor);
                } else {
                    $("#j_winbox_nl").addClass("winbox_bg")
                }

            }
            var c = isOpen ? $('#j_win_n') : $('#' + settings.container);
            loadPage$Data(settings.ns, c, settings.url, settings.submit,
                settings.initData);
        }

        // 装载界面片段,以及重新Load数据
        // 参数依次为1.页面容器,2.页面片段路径 2.提交组件
        var loadPage$Data = function (ns, container, pageurl, submit, initData) {
            /*
             * if(_U.cache[pageurl]) { container.empty().addClass('win_dl');
             * container.html(_U.cache[pageurl]); return; }
             */
            $.ajax({
                    url: pageurl,
                    dataType: 'html',
                    beforeSend: function () {
                        // 使用html('')置空会产生IE兼容性问题，需要使用empty()方法。
                        _U.cache[pageurl] = container.html();
                        container.empty();
                        if (submit != null && submit != '') {
                            container.addClass('win_dl');
                        }
                    },
                    success: function (result) {
                        container.html(result);
                        if ($("#UhwebPageData").length > 0)
                            $.each($.parseJSON($("#UhwebPageData").attr("data")).data, function (i, value) {
                                switch (value.uhweb) {
                                    case 'UhwebForm':
                                        _U.initForm(value);
                                        break;
                                    case 'UhwebGrid':
                                        _U.initTable(value);
                                        break;
                                    default:
                                        _U.initAttr(value);
                                        break;
                                }
                            });
                        if (submit != null && submit != '') {
                            submit.submit(function () {
                            }, function (data) {
                                // 调用命名空间的方法.
                                if ($.fn[ns]) {
                                    var func = $.fn[ns].initPage;
                                    if (func) {
                                        func(data);
                                    }
                                    if (initData) {
                                        if (func) {
                                            func(initData);
                                        }

                                    }
                                }
                                container.removeClass('win_dl');
                            });
                        } else if ($.fn[ns]) {
                            var func = $.fn[ns].initPage;
                            if (func && initData) {
                                func(initData);
                            } else {
                                func($.parseJSON($("#UhwebPageData").attr(
                                    "data")));
                            }
                        }
                        container.removeClass('win_dl');
                    },
                    complete: function () {
                        container.removeClass('win_dl');
                    }
                });
        };
        initialise();
    };


    //-------Begin-----------
    //高德地图标记插件

    var MapMarkModal = function (options) {
        this.options = options;
        this.map = null;
        this.autoComplete = null;
        this.marker = null;
        this.locationArr = {};
        this.initPage();
    };

    MapMarkModal.prototype.bindEvents = function () {
        var self = this;
        $("#mapSearchLocationInput").on('keyup', function (e) {
            var inputVal = $("#mapSearchLocationInput").val();
            if (inputVal) {
                self.autoComplete.search(inputVal, function (status, result) {
                    $("#mapMarkModal .map-sug-custom").html("");
                    $(result.tips).each(function (idx) {
                        var htmlStr = '<div class="ivr-auto-item" id="amap-sug' + idx + '">' + this.name + '<span class="ivr-auto-item-span">' + this.district + '</span></div>';
                        self.locationArr['amap-sug' + idx + ''] = this.location;
                        $("#mapMarkModal .map-sug-custom").append(htmlStr);
                    });
                    $("#mapMarkModal .map-sug-custom").show();
                });
            } else {
                $("#mapMarkModal .map-sug-custom").hide();
            }
        });

        $(document).on('click', '#mapMarkModal .map-sug-custom .ivr-auto-item', function (e) {
            if (self.locationArr[$(this).attr("id")]) {
                self.map.setZoom(15);
                self.map.setCenter(self.locationArr[$(this).attr("id")]);
            }
        });

        $(document).on('click.mapsearch', function (e) {
            $("#mapMarkModal .map-sug-custom").hide();
        });

        $("#mapMarkModal .modal-footer button:eq(0)").click(function () {
            var position = null;
            if (self.marker) {
                position = self.marker.getPosition();
            }
            self.options.callback(position);
            $("#mapMarkModal").modal('hide');
        });

        $("#mapMarkModal .modal-footer button:eq(1)").click(function () {
            if (self.marker) {
                self.marker.setMap(null);
                self.marker = null;
                //$("#mapMarkModal .modal-footer button:eq(0)").attr("disabled",true);
                $("#mapMarkModal .modal-footer button:eq(1)").attr("disabled", true);
            }
        });

        $("#mapMarkModal .map-mark-search-div button").click(function () {
            var location = $("#mapSearchLocationInput").val();
            var placeSearch = new AMap.PlaceSearch({
                pageSize: 1,
            });
            placeSearch.search(location, function (status, result) {
                if (result.poiList.pois && result.poiList.pois.length > 0) {
                    self.map.setZoom(15);
                    self.map.setCenter(result.poiList.pois[0].location);
                }
            });
        });
    };

    MapMarkModal.prototype.initPage = function () {
        var self = this;
        _U.loadScript("http://webapi.amap.com/maps?v=1.3&key=44d7d8e71882e45bb882456e817394b0", function () {
        });
        $.get(
            "/static/map/mapmodal.html",
            {},
            function (data) {
                $("body").append(data);
                $("#mapMarkModal").data(name, self);
                self.bindEvents();
            },
            "html"
        );
    }

    MapMarkModal.prototype.resetModal = function (markLocationData) {
        $("#mapSearchLocationInput").val('');
        if (this.map) {
            if (markLocationData) {
                this.map.setZoom(15);
                this.map.setCenter([markLocationData.lng, markLocationData.lat]);
                if (this.marker) {
                    this.marker.setPosition([markLocationData.lng, markLocationData.lat]);
                } else {
                    this.marker = new AMap.Marker({ //添加自定义点标记
                        map: this.map,
                        position: [markLocationData.lng, markLocationData.lat], //基点位置
                        draggable: true,  //是否可拖动
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
                    });
                }
                $("#mapMarkModal .modal-footer button:eq(0)").attr("disabled", false);
                $("#mapMarkModal .modal-footer button:eq(1)").attr("disabled", false);
            } else {
                if (this.marker) {
                    this.marker.setMap(null);
                    this.marker = null;
                }
                this.map.setZoom(13);
                this.map.setCenter([116.397428, 39.90923]);
                $("#mapMarkModal .modal-footer button:eq(0)").attr("disabled", true);
                $("#mapMarkModal .modal-footer button:eq(1)").attr("disabled", true);
            }
        }
    }

    MapMarkModal.prototype.openModal = function (markLocationData,readonly) {
        var self = this;
        if (!self.map) {
            self.map = new AMap.Map('mapMarkContainer', {
                resizeEnable: true,
                center: [116.397428, 39.90923],//地图中心点
                zoom: 13 //地图显示的缩放级别
            });
            AMap.service('AMap.PlaceSearch', function () {
            });
            AMap.plugin('AMap.Autocomplete', function () {
                self.autoComplete = new AMap.Autocomplete({});
            });
            //为地图注册click事件获取鼠标点击出的经纬度坐标
            var clickEventListener = self.map.on('click', function (e) {
                if (self.marker) {
                    self.marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()]); //更新点标记位置
                    return;
                }
                self.marker = new AMap.Marker({ //添加自定义点标记
                    map: self.map,
                    position: [e.lnglat.getLng(), e.lnglat.getLat()], //基点位置
                    draggable: true,  //是否可拖动
                    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
                });
                $("#mapMarkModal .modal-footer button:eq(0)").attr("disabled", false);
                $("#mapMarkModal .modal-footer button:eq(1)").attr("disabled", false);
            });
        }
        self.resetModal(markLocationData);
        if(readonly){
            $('#mapMarkModal .modal-footer > button:eq(0)').hide();
            $('#mapMarkModal .modal-footer > button:eq(1)').hide();
        }else{
            $('#mapMarkModal .modal-footer > button:eq(0)').show();
            $('#mapMarkModal .modal-footer > button:eq(1)').show();
        }
        $("#mapMarkModal").modal('show');
    }

    var name = "MapMark";

    var mapMark = function (options) {
        var $this = $("#mapMarkModal");
        var data = $("#mapMarkModal").data(name);
        var options = typeof options == 'object' && options;

        if (!data) (data = new MapMarkModal(options));

        return data;
    }

    mapMark.constructor = MapMarkModal;
    //-------End-----------


    _U
        .mix({

            cache: {},
            getResData: function (name, data) {
                var reData;
                $(data.data).each(function (index) {
                    if (this.name == name) {
                        reData = this;
                    }
                });
                return reData;
            },
            jsArray: {},
            loadScript: function (scriptName, callback) {
                if (!_U.jsArray[scriptName]) {
                    _U.jsArray[scriptName] = true;
                    var body = document.getElementsByTagName('body')[0],
                        script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = scriptName;
                    script.onload = callback;
                    body.appendChild(script);
                } else if (callback) {
                    callback();
                }

            },
            toggleErrorMsg:function(selector,msg,switchFlag){
                if(switchFlag){
                    $(selector).parent().addClass('has-error');
                    if($(selector).next('.input-error-msg').length == 0){
                        $(selector).after("<span class='input-error-msg'>"+msg+"</span>");
                    }else{
                        $(selector).next('.input-error-msg').text(msg);
                    }
                }else{
                    $(selector).parent().removeClass('has-error');
                    $(selector).next('.input-error-msg').remove();
                }
            },
            mapMarkModal: mapMark
        });

})(jQuery);
