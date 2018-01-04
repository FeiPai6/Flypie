//基于zui封装的前台分页算法 
// notice : 页面必须先引用zui.css  页数索引从1开始
function Page(fnc,pageCount,start) {//初始化属性
        this.fnc = fnc;//对象名称
        this.page = start;//当前页数
        this.pageCount = pageCount;//总页数
        this.argName = 'p';//参数名
        // this.fpn = '首页';//首页显示名称
        this.ppn = '«';//上一页显示名称
        this.npn = '»';//下一页显示名称
        // this.lpn = '尾页';//尾页显示名称
        // this.pl = pageLength;//每页显示条数
    }
 
Page.prototype.checkPages = function() {//进行当前页数和总页数的验证
    if(isNaN(parseInt(this.page)))
        this.page = 1;
    if(isNaN(parseInt(this.pageCount)))
        this.pageCount = 1;
    if(this.page < 1)
        this.page = 1;
    if(this.pageCount < 1)
        this.pageCount = 1;
    if(this.page > this.pageCount)
        this.page = this.pageCount;
    this.page = parseInt(this.page);
    this.pageCount = parseInt(this.pageCount);
}
Page.prototype.createHtml = function(mode) {//生成html代码
    var strHtml = '', prevPage = this.page - 1, nextPage = this.page + 1;
    strHtml +='<div class="pager_wrap"><ul class="pager">';

    if(prevPage < 1) {
        strHtml += '<li class="previous disabled"><a> '+this.ppn+'</a> </li>';
    } else {
        strHtml += '<li class="previous"><a href="javascript:' + this.fnc + '(' + prevPage + ');"> '+this.ppn+' </a></li>';
    }
    if(this.page != 1)
        strHtml += '<li><a href="javascript:' + this.fnc + '(1);">1</a></li>';
    if(this.page >= 5)
        strHtml += '<li><a>...</a></li>';
    if(this.pageCount > this.page + 2) {
        var endPage = this.page + 2;
    } else {
        var endPage = this.pageCount;
    }
    for(var i = this.page - 2; i <= endPage; i++) {
        if(i > 0) {
            if(i == this.page) {
                strHtml += '<li class="active"><a>'+i+'</a></li>';
            } else {
                if(i != 1 && i != this.pageCount) {
                    strHtml += '<li><a href="javascript:' + this.fnc + '(' + i + ');">'+i+'</a></li>';
                }
            }
        }
    }
    if(this.page + 3 < this.pageCount)
        strHtml += '<li><a>...</a></li>';
    if(this.page != this.pageCount)
        strHtml += '<li><a href="javascript:' + this.fnc + '(' + this.pageCount + ');">' + this.pageCount + '</a></li>';
    if(nextPage > this.pageCount) {
        strHtml += '<li  class="next disabled"><a>'+this.npn+'</a></li>';
    } else {
        strHtml += '<li  class="next"><a href="javascript:' + this.fnc + '(' + nextPage + ');"> '+this.npn+' </a></li>';
    }
    strHtml +='</ul></div>';
    return strHtml;
}
Page.prototype.printHtml = function(mode) {//显示html代码
    this.checkPages();
    return this.createHtml(mode);
}