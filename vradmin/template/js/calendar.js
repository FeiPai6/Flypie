/*
	[Destoon B2B System] Copyright (c) 2008-2013 Destoon.COM
	This is NOT a freeware, use is subject to license.txt
*/
var isIE = (document.all && window.ActiveXObject && !window.opera) ? true : false;
//定义语言变量
var L = new Array();
L['Sun']					= '日';
L['Mon']					= '一';
L['Tue']					= '二';
L['Wed']					= '三';
L['Thu']					= '四';
L['Fri']					= '五';
L['Sat']					= '六';
L['prev_year']				= '前一年';
L['next_year']				= '后一年';
L['prev_month']				= '上一月';
L['next_month']				= '下一月';

var d_date, c_year, c_month, t_year, t_month, t_day, v_year, v_month, v_day, ca_sep, ca_id, ca_interval, ca_timeout;
var today = new Date();
t_year = today.getYear();
t_year = (t_year > 200) ? t_year : 1900 + t_year;
t_month = today.getMonth()+1;
t_day = today.getDate();
var ca_htm = '';
ca_htm += '<table width="100%" cellpadding="0" cellspacing="0" style="background:#E44E4E;"><tr>';
ca_htm += '<td style="color:#FFFFFF;-moz-user-select:none;" height="20" onselectstart="return false">&nbsp; <span onclick="ca_prev_year();" onmousedown="ca_setInterval(\'ca_prev_year\');" onmouseup="ca_clearInterval();" style="font-weight:bold;cursor:pointer;" title="'+L['prev_year']+'">&laquo;</span> <input type="text" maxlength="4" style="width:35px;border:none;color:#FFFFFF;text-align:center;background:#E44E4E;padding:0 0 2px 0;" id="ca_year" onblur="ca_this_year();" ondblclick="this.value=\'\';"/> <span onclick="ca_next_year();" onmousedown="ca_setInterval(\'ca_next_year\');" onmouseup="ca_clearInterval();" style="font-weight:bold;cursor:pointer;" title="'+L['next_year']+'">&raquo;</span>  &nbsp;&nbsp; <span onclick="ca_prev_month();" onmousedown="ca_setInterval(\'ca_prev_month\');" onmouseup="ca_clearInterval();" style="font-weight:bold;cursor:pointer;" title="'+L['prev_month']+'">&laquo;</span> <input type="text" maxlength="2" style="width:16px;border:none;color:#FFFFFF;text-align:center;background:#E44E4E;padding:0 0 2px 0;" id="ca_month" onblur="ca_this_month();" ondblclick="this.value=\'\';"/> <span onclick="ca_next_month();" onmousedown="ca_setInterval(\'ca_next_month\');" onmouseup="ca_clearInterval();" style="font-weight:bold;cursor:pointer;" title="'+L['next_month']+'">&raquo;</span> </td>';
ca_htm += '<td align="right" style="color:#FFFFFF;font-weight:bold;cursor:pointer;" onclick="ca_close();" title="Close">&#215;&nbsp;</td></tr></table>';
ca_htm += '<div id="d_ca_show" style="text-align:center;"></div>';
function get_days (year, month) {
	d_date = new Date(year, month, 1);
	d_date = new Date(d_date - (24*60*60*1000));
	return d_date.getDate();
}
function get_start (year, month) {
	d_date = new Date(year, month-1, 1);
	return d_date.getDay();
}
function ca_setInterval(func) {
	ca_timeout=setTimeout(function(){ca_interval=setInterval(func+'()',200);},100);
}
function ca_clearInterval () {
	clearTimeout(ca_timeout);clearInterval(ca_interval);
}
function ca_this_year () {
	if(Dd('ca_year').value.match(/^(\d{4})$/)) {
		c_year = parseInt(Dd('ca_year').value); ca_setup(c_year, c_month);
	} else {
		Dd('ca_year').value = c_year;
	}
}
function ca_next_year () {c_year = parseInt(c_year) + 1; ca_setup(c_year, c_month);}
function ca_prev_year () {c_year = parseInt(c_year) - 1; ca_setup(c_year, c_month);}
function ca_this_month () {
	if(Dd('ca_month').value.match(/^(\d{1,2})$/)) {
		c_month = parseInt(Dd('ca_month').value); ca_setup(c_year, c_month);
	} else {
		Dd('ca_month').value = c_month;
	}
}
function ca_next_month () {
	if(c_month == 12) {
		c_year = parseInt(c_year) + 1; c_month = 1;
	} else {
		c_month = parseInt(c_month) + 1;
	}
	ca_setup(c_year, c_month);
}
function ca_prev_month () {
	if(c_month == 1) {
		c_year = parseInt(c_year) - 1; c_month = 12;
	} else {
		c_month = parseInt(c_month) - 1;
	}
	ca_setup(c_year, c_month);
}
function ca_setup(year, month) {
	if(year > 9999) year = 9999;
	if(year < 1970) year = 1970;
	if(month > 12) month = 12;
	if(month < 1) month = 1;
	c_year = year;
	c_month = month;
	var days = get_days(year, month);
	var start = get_start(year, month);
	var end = 7 - (days + start)%7;
	if(end == 7 ) end = 0;
	var calendar = '';
	var weeks = [L['Sun'],L['Mon'],L['Tue'],L['Wed'],L['Thu'],L['Fri'],L['Sat']];
	var cells = new Array;
	var j = i = l = 0;
	Dd('ca_year').value = year;
	Dd('ca_month').value = month;
	if(start) for(i = 0; i < start; i++) {cells[j++] = 0;}
	for(i = 1; i<= days; i++) {cells[j++] = i;}
	if(end) for(i = 0; i < end; i++) {cells[j++] = 0;}
	calendar += '<table cellpadding="0" cellspacing="0" width="100%" title="Destoon Calendar Powered By Destoon.COM"><tr>';
	for(i = 0; i < 7; i++) {calendar += '<td width="26" height="24" bgcolor="#F1F1F1"><strong>'+(weeks[i])+'</strong></td>';}
	calendar += '</tr>';
	l = cells.length
	for(i = 0; i < l; i++) {
		if(i%7 == 0) calendar += '<tr height="24">';
		if(cells[i]) {
			calendar += '<td style="cursor:pointer;font-size:11px;border-top:#CCCCCC 1px solid;'+(i%7 == 6 ? '' : 'border-right:#CCCCCC 1px solid;')+'';
			if(year+'-'+month+'-'+cells[i] == v_year+'-'+v_month+'-'+v_day) {
				calendar += 'background:#FFFF00;"';
			} else if(year+'-'+month+'-'+cells[i] == t_year+'-'+t_month+'-'+t_day) {
				calendar += 'font-weight:bold;color:#FF0000;"';
			} else {
				calendar += 'background:#FFFFFF;" onmouseover="this.style.backgroundColor=\'#FFCC99\';" onmouseout="this.style.backgroundColor=\'#FFFFFF\';"';
			}
			calendar += 'title="'+year+'.'+month+'.'+cells[i]+'" onclick="ca_select('+year+','+month+','+cells[i]+')"> '+cells[i]+' </td>';
		} else {
			calendar += '<td style="border-top:#CCCCCC 1px solid;'+(i%7 == 6 ? '' : 'border-right:#CCCCCC 1px solid;')+'">&nbsp;</td>';
		}
		if(i%7 == 6) calendar += '</tr>';
	}
	calendar += '</table>';
	Dd('d_ca_show').innerHTML = calendar;
}
function ca_show(id, obj, sep) {
	Eh();
	if(Dd('d_calendar') == null) {
		var d_ca_div = document.createElement("div");
		with(d_ca_div.style) {zIndex = 9999; position = 'absolute'; display = 'none'; width = '196px'; padding = '1px'; top = 0; left = 0; border = '#A0A0A0 1px solid'; backgroundColor = '#FFFFFF';}
		d_ca_div.id = 'd_calendar';
		document.body.appendChild(d_ca_div);
	}
	var aTag = obj;
	var leftpos = toppos = 0;
	do {aTag = aTag.offsetParent; leftpos += aTag.offsetLeft; toppos += aTag.offsetTop;
	} while(aTag.offsetParent != null);
	ca_sep = sep;
	ca_id = id;
	if(Dd(id).value) {
		if(sep) {
			var arr = Dd(id).value.split(sep);
			c_year = v_year = arr[0];
			c_month = v_month = ca_cutzero(arr[1]);
			v_day = ca_cutzero(arr[2]);
		} else {
			c_year = v_year = Dd(id).value.substring(0, 4);
			c_month = v_month = ca_cutzero(Dd(id).value.substring(4, 6));
			v_day = ca_cutzero(Dd(id).value.substring(6, 8));
		}
	} else {
		c_year = t_year;
		c_month = t_month;
	}
	Dd('d_calendar').style.left = (obj.offsetLeft + leftpos) + 'px';
	Dd('d_calendar').style.top = (obj.offsetTop + toppos + 20) + 'px';
	Dd('d_calendar').innerHTML = ca_htm;
	Dd('d_calendar').style.display = '';
	ca_setup(c_year, c_month);

}
function ca_select(year, month, day) {
	month = ca_padzero(month);
	day = ca_padzero(day);
	Dd(ca_id).value = year+ca_sep+month+ca_sep+day;
	ca_hide();
}
function ca_padzero(num) {return (num	< 10)? '0' + num : num ;}
function ca_cutzero(num) {return num.substring(0, 1) == '0' ? num.substring(1, num.length) : num;}
function ca_hide() {Dd('d_calendar').style.display = 'none'; Es();}
function ca_close() {ca_hide();}
function Dd(i) {return document.getElementById(i);}
function Eh(t) {
	var t = t ? t : 'select';
	if(isIE) {
		var arVersion = navigator.appVersion.split("MSIE"); var IEversion = parseFloat(arVersion[1]);		
		if(IEversion >= 7 || IEversion < 5) return;
		var ss = document.body.getElementsByTagName(t);					
		for(var i=0;i<ss.length;i++) {ss[i].style.visibility = 'hidden';}
	}
}
function Es(t) {
	var t = t ? t : 'select';
	if(isIE) {
		var arVersion = navigator.appVersion.split("MSIE"); var IEversion = parseFloat(arVersion[1]);		
		if(IEversion >= 7 || IEversion < 5) return;
		var ss = document.body.getElementsByTagName(t);					
		for(var i=0;i<ss.length;i++) {ss[i].style.visibility = 'visible';}
	}
}