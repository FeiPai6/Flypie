/**
 *UHWEB JS
 */
(function (w, d, undefined) {
    /*
     *生成全局遮罩层
     */
    //document.writeln('<div id="div_Mask" style="width:100%;position:absolute; z-index:99999; top:0; left:0; background:#E6E6E6; height:' + 0/*document.documentElement.clientHeight*/ + 'px;"><div style="z-index:99999;font-size:12px;color: #ce8f22;position:absolute;top:0px;right:0px;padding:2px 10px 2px 10px;">' +
    //    '加载中,请稍候......</div></div>');
    //document.close();

    /**
     * 定义全局作用域变量UHWEB
     */
    w.UHWEB = (function (w, d, undefined) {
        /**
         *是否是IE浏览器
         */
        var isIE = (navigator.userAgent.toLowerCase().indexOf('msie') != -1),
            /**
             * 创建UHWEB对象的临时变量
             */
            U,
            /**
             * 缓存document.getElementsByTagName
             */
            queryTag = function (tag) {
                return this.getElementsByTagName(tag);
            },
            /**
             * 缓存document.createElement
             */
            createEl = function (tag) {
                return this.createElement(tag);
            },
            /**
             * 是否是服务器模式,uhweb可在静态环境和服务器环境运行
             */
            isServer = !(d.domain == ''),
            /**
             * 业务js,就是定义在uhweb.js的script节点上的bizjs属性
             */
            bizJs,
            /**
             *业务css,就是定义在uhweb.js的script节点上的bizcss属性
             */
            bizCss,
            /**
             * 是否是客户端缓存服务端
             */
            clientCache,
            isLoginPage = "false",

        /*
         * 调试模式,静态模式或者服务器模式下在url后拼接uhweb-debug=true即可开启调试模式.
         * 要查看调试信息,请开启浏览器控制台
         */
            _DEBUG = false;
        if (!isServer || w.location.search.indexOf('uhweb-debug=true') > 0) {
            _DEBUG = true;
        }

        /**
         * 获取uhweb所在的根目录
         * @return {String}
         */
        var getRoot = function () {
            var s = queryTag.call(d, 'script'),
                /**
                 * 某些情况时需要添加例外
                 */
                id = 0;
            var p = s[id].src, sign = "uhweb.js", realpath = "uhweb/uhweb.js";
            if (p.lastIndexOf(sign) > 0) {
                bizJs = s[id].getAttribute('bizjs');
                isLoginPage = s[id].getAttribute('isLoginPage');
                bizCss = s[id].getAttribute('bizcss');
                clientCache = s[id].getAttribute('CacheServer');
                return p.replace(realpath, '');
            } else {
                throw '引入的uhweb.js的script节点必须放在页面引用的第一个script节点上!';
            }
        };
        var head = queryTag.call(d, 'HEAD').item(0),
        //静态运行时加载js
            local = function (url, func) {
                var s = createEl.call(d, 'script');
                s.language = 'javascript';
                s.type = 'text/javascript';
                s.async = false;
                s['src'] = url;
                s.onload = s.onreadystatechange = function () {
                    var st = this.readyState;
                    if (!st || st == 'loaded' || st == 'complete') {
                        _U.log('finishLoad js file ' + url);
                        s.onload = s.onreadystatechange = null;
                        if (func) {
                            func.delay(10);
                        }
                    }
                };
                head.appendChild(s);
                return s;
            },
        //服务器模式时加载js
            server = function (url, func) {
                var req = ((w.ActiveXObject) ? new ActiveXObject('MsXml2.XmlHttp') : new XMLHttpRequest());
                req.open('get', url, false);
                req.setRequestHeader('Content-Type', 'text/plain;charset=gb2312');
                req.send(null);
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        if (req.responseText != '') {
                            if (isIE) {
                                execScript(req.responseText);
                            } else {
                                w.eval(req.responseText);
                            }
                            if (func)func();
                        }
                    }
                }
            };
        U = {
            //版本号
            ver: 'V1.0',
            //全局根目录
            root: getRoot(),
            isLoginPage : isLoginPage,
            //是否是开发模式
            isDev: (typeof jQuery === 'undefined'),
            //是否是服务器端运行
            isServer: isServer,
            //调试开关
            debug: _DEBUG,
            //加载js
            loadJs: function (url, f) {
                (isServer) ? server(url, f) : local(url, f);
            },
            //加载css
            loadCss: function (url) {
                var link = createEl.call(d, 'link');
                link.href = url;
                link.type = 'text/css';
                link.rel = 'stylesheet';
                head.appendChild(link);
            },
            //初始化配置文件
            initCfg: function (cfg) {
                var me = this;
                me.config = cfg;
                if (me.process) {
                    me.process();
                } else {
                    _U.loadCss('../uhweb/styles/' + _U.getCfg('style').sys_style + '/uhweb_min.css');
                }
                //加载业务js文件
                var bizjs = (bizJs) ? eval(bizJs) : [], url, bizcss = (bizCss) ? eval(bizCss) : [];
                for (i = 0; i < bizjs.length; i++) {
                    url = me.root + bizjs[i];
                    _U.log('add bizjs ' + url, 'uhweb');
                    me.loadJs(url);
                }
                for (i = 0; i < bizcss.length; i++) {
                    url = me.root + bizcss[i];
                    _U.log('add bizcss ' + url, 'uhweb');
                    me.loadCss(url);
                }
            },
            //获取配置信息
            getCfg: function (name) {
                return this.config[name];
            }
        };
        //实现默认的浅拷贝
        U.mix = function (o) {
            var me = this;
            for (var k in o) {
                if (me[k]) {
                    me.warn('UHWEB对象已经有属性[' + k + ']!', 'uhweb');
                } else {
                    me[k] = o[k];
                }
            }
        };
        U.getParamFromUrl = function (param) {
            var query = window.location.search;
            var v = query.match(new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i"));
            if (v != null) {
                v = unescape(v[2]);
            }
            return v;
        };
        //全局屏蔽一些按键
        U.shielding = function () {
            var s = _U.getCfg('shields');
            $(window).addEvent((Browser.firefox) ? 'keypress' : 'keydown', function (e) {
                var k = e.key, c = e.control, el = $(e.target);
                if ((k == 'f5' || (c && k == 'r')) && s.f5) {
                    e.stop();
                    return false;
                } else if (k == 'backspace' && s.backspace) {
                    var type = el.get('type') || el.get('tag');
                    if (!['button', 'text', 'password', 'textarea', 'submit'].contains(type)) {
                        e.stop();
                        return false;
                    }
                }
            });
            if (s.contextMenu) {
                $(document).oncontextmenu = function (e) {
                    return false;
                }
            }
        };
        //统一处理iframe的初始化以及跳转
        //解决按下backspace或者浏览器回退键会使iframe变为空白的问题
        U.setIfrSrc = function (ifr, src) {
            ifr.src = src;
            ifr.contentWindow.location.replace(src);
            /*//要注意跨域的问题.可能无跨域问题
             Function.attempt(function () {
             }, function () {

             })*/
        };
        return U;
    })(w, d, undefined);
    /**
     * 新增一个别名,减少字符开销
     */
    var _U = w._U = w.Uhweb = w.UHWEB,
        /**
         *日志输出级别,为兼容,暂支持4种级别
         */
        mtd = ['log', 'warn', 'error', 'info'];
    /**
     * 隐藏蒙版,框架启动加载完毕之后会调用
     */
    for (var k = 0; k < mtd.length; k++) {
        _U[mtd[k]] = (function (c) {
            return function (msg, src) {
                U_LOG(msg, c, src);
            }
        })(mtd[k]);
    }
    /**
     * 日志输出
     * @param msg 要输出的信息
     * @param cat 级别
     * @param src 信息来源
     */
    function U_LOG(msg, cat, src) {
        if (_U.debug) {
            msg = ((src) ? src : 'SYSTEM') + ': ' + msg;
            if (w['console'] !== undefined && console.log) {
                console[cat && console[cat] ? cat : 'log'](msg);
            }
        }
    }

    _U.process = function () {

    };

    //加载子界面.
    _U.initSubPage = function (ns, func) {
        $.fn[ns] = {};
        func($, $.fn[ns], _U);
    };
})(window, document, undefined);
