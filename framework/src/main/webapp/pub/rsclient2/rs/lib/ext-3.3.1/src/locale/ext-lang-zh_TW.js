/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
锘?*
 * Traditional Chinese translation
 * By hata1234
 * 09 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">璁€鍙栦腑...</div>';

if(Ext.View){
    Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
    Ext.grid.GridPanel.prototype.ddText = "阆告搰浜?{0} 琛?;
}

if(Ext.TabPanelItem){
    Ext.TabPanelItem.prototype.closeText = "闂滈枆姝ゆ绫?;
}

if(Ext.form.Field){
    Ext.form.Field.prototype.invalidText = "鏁稿€间笉绗﹀悎娆勪綅瑕忓畾";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "璁€鍙栦腑...";
}

Date.monthNames = [
    "涓€链?,
    "浜屾湀",
    "涓夋湀",
    "锲涙湀",
    "浜旀湀",
    "鍏湀",
    "涓冩湀",
    "鍏湀",
    "涔濇湀",
    "鍗佹湀",
    "鍗佷竴链?,
    "鍗佷簩链?
];

Date.dayNames = [
    "镞?,
    "涓€",
    "浜?,
    "涓?,
    "锲?,
    "浜?,
    "鍏?
];

if(Ext.MessageBox){
    Ext.MessageBox.buttonText = {
        ok : "纰哄畾",
        cancel : "鍙栨秷",
        yes : "鏄?,
        no : "鍚?
    };
}

if(Ext.util.Format){
    Ext.util.Format.date = function(v, format){
       if(!v) return "";
       if(!(v instanceof Date)) v = new Date(Date.parse(v));
       return v.dateFormat(format || "Y/m/d");
    };
}

if(Ext.DatePicker){
    Ext.apply(Ext.DatePicker.prototype, {
       todayText         : "浠婂ぉ",
       minText           : "镞ユ湡蹇呴爤澶ф柤链€灏忓瑷辨棩链?,
       maxText           : "镞ユ湡蹇呴爤灏忔柤链€澶у瑷辨棩链?,
       disabledDaysText  : "",
       disabledDatesText : "",
       monthNames        : Date.monthNames,
       dayNames          : Date.dayNames,
       nextText          : "涓嫔€嬫湀 (Ctrl+鍙虫柟鍚戦嵉)",
       prevText          : "涓婂€嬫湀 (Ctrl+宸︽柟鍚戦嵉)",
       monthYearText     : "阆告搰链堜唤 (Ctrl+涓?涓嬫柟鍚戦嵉阆告搰骞翠唤)",
       todayTip          : "{0} (绌虹槠閸?",
       format            : "y/m/d",
       okText            : "纭畾",
       cancelText        : "鍙栨秷"
    });
}

if(Ext.PagingToolbar){
    Ext.apply(Ext.PagingToolbar.prototype, {
       beforePageText : "绗?,
       afterPageText  : "阕侊紝鍏眦0}阕?,
       firstText      : "绗竴阕?,
       prevText       : "涓娄竴阕?,
       nextText       : "涓嬩竴阕?,
       lastText       : "链€寰岄爜",
       refreshText    : "閲嶆柊鏁寸悊",
       displayMsg     : "椤ず{0} - {1}绛?鍏眦2}绛?,
       emptyMsg       : '娌掓湁浠讳綍璩囨枡'
    });
}

if(Ext.form.TextField){
    Ext.apply(Ext.form.TextField.prototype, {
       minLengthText : "姝ゆ瑒浣嶆渶灏戣杓稿叆 {0} 链嫔瓧",
       maxLengthText : "姝ゆ瑒浣嶆渶澶氲几鍏?{0} 链嫔瓧",
       blankText     : "姝ゆ瑒浣岖偤蹇呭～",
       regexText     : "",
       emptyText     : null
    });
}

if(Ext.form.NumberField){
    Ext.apply(Ext.form.NumberField.prototype, {
       minText : "姝ゆ瑒浣崭箣鏁稿€煎繀阕埚ぇ鏂?{0}",
       maxText : "姝ゆ瑒浣崭箣鏁稿€煎繀阕埚皬鏂?{0}",
       nanText : "{0} 涓嶆槸鍚堟硶镄勬暩瀛?
    });
}

if(Ext.form.DateField){
    Ext.apply(Ext.form.DateField.prototype, {
       disabledDaysText  : "铹℃硶浣跨敤",
       disabledDatesText : "铹℃硶浣跨敤",
       minText           : "姝ゆ瑒浣崭箣镞ユ湡蹇呴爤鍦?{0} 涔嫔缌",
       maxText           : "姝ゆ瑒浣崭箣镞ユ湡蹇呴爤鍦?{0} 涔嫔墠",
       invalidText       : "{0} 涓嶆槸姝ｇ⒑镄勬棩链熸牸寮?- 蹇呴爤镀忔槸 銆?{1} 銆?阃欐ǎ镄勬牸寮?,
       format            : "Y/m/d"
    });
}

if(Ext.form.ComboBox){
    Ext.apply(Ext.form.ComboBox.prototype, {
       loadingText       : "璁€鍙栦腑 ...",
       valueNotFoundText : undefined
    });
}

if(Ext.form.VTypes){
    Ext.apply(Ext.form.VTypes, {
       emailText    : '姝ゆ瑒浣嶅繀阕堣几鍏ュ儚 "user@example.com" 涔婨-Mail镙煎纺',
       urlText      : '姝ゆ瑒浣嶅繀阕堣几鍏ュ儚 "http:/'+'/www.example.com" 涔嬬恫鍧€镙煎纺',
       alphaText    : '姝ゆ瑒浣嶅儏鑳借几鍏ュ崐褰㈣嫳鏂囧瓧姣嶅强搴旷窔( _ )绗﹁櫉',
       alphanumText : '姝ゆ瑒浣嶅儏鑳借几鍏ュ崐褰㈣嫳鏂囧瓧姣嶃€佹暩瀛楀强搴旷窔( _ )绗﹁櫉'
    });
}

if(Ext.grid.GridView){
    Ext.apply(Ext.grid.GridView.prototype, {
       sortAscText  : "姝ｅ悜鎺掑簭",
       sortDescText : "鍙嶅悜鎺掑簭",
       lockText     : "阉栧畾娆勪綅",
       unlockText   : "瑙ｉ枊娆勪綅阉栧畾",
       columnsText  : "娆勪綅"
    });
}

if(Ext.grid.PropertyColumnModel){
    Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
       nameText   : "鍚岖ū",
       valueText  : "鏁稿€?,
       dateFormat : "Y/m/d"
    });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
    Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
       splitTip            : "鎷栨洺绺斁澶у皬.",
       collapsibleSplitTip : "鎷栨洺绺斁澶у皬. 婊戦紶板欐搳闅辫棌."
    });
}
