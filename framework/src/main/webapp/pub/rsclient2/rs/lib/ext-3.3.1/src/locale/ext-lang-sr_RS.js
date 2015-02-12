/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
锘?*
 * Serbian Cyrillic Translation
 * by 膶olovic Vladan (cyrillic, utf8 encoding)
 * sr_RS (ex: sr_CS, sr_YU)
 * 12 May 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">校褔懈褌邪胁邪屑...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} 懈蟹邪斜褉邪薪懈褏 褉械写芯胁邪";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "袟邪褌胁芯褉懈 芯胁褍 禄泻邪褉褌懈褑褍芦";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "校薪械褕械薪邪 胁褉械写薪芯褋褌 薪懈褬械 锌褉邪胁懈谢薪邪";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "校褔懈褌邪胁邪屑...";
}

Date.monthNames = [
   "袌邪薪褍邪褉",
   "肖械斜褉褍邪褉",
   "袦邪褉褌",
   "袗锌褉懈谢",
   "袦邪褬",
   "袌褍薪",
   "袌褍谢",
   "袗胁谐褍褋褌",
   "小械锌褌械屑斜邪褉",
   "袨泻褌芯斜邪褉",
   "袧芯胁械屑斜邪褉",
   "袛械褑械屑斜邪褉"
];

Date.dayNames = [
   "袧械写械褭邪",
   "袩芯薪械写械褭邪泻",
   "校褌芯褉邪泻",
   "小褉械写邪",
   "效械褌胁褉褌邪泻",
   "袩械褌邪泻",
   "小褍斜芯褌邪"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "校 褉械写褍",
      cancel : "袨写褍褋褌邪薪懈",
      yes    : "袛邪",
      no     : "袧械"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "d.m.Y");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "袛邪薪邪褋",
      minText           : "袛邪褌褍屑 褬械 懈褋锌褉械写 薪邪褬屑邪褮械谐 写芯蟹胁芯褭械薪芯谐 写邪褌褍屑邪",
      maxText           : "袛邪褌褍屑 褬械 薪邪泻芯薪 薪邪褬胁械褯械谐 写芯蟹胁芯褭械薪芯谐 写邪褌褍屑邪",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : '小谢械写械褯懈 屑械褋械褑 (Control+袛械褋薪芯)',
      prevText          : '袩褉械褌褏芯写薪懈 屑械褋械褑 (Control+袥械胁芯)',
      monthYearText     : '袠蟹邪斜械褉懈褌械 屑械褋械褑 (Control+袚芯褉械/袛芯谢械 蟹邪 懈蟹斜芯褉 谐芯写懈薪械)',
      todayTip          : "{0} (袪邪蟹屑邪泻薪懈褑邪)",
      format            : "d.m.y",
      startDay          : 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "小褌褉邪薪邪",
      afterPageText  : "芯写 {0}",
      firstText      : "袩褉胁邪 褋褌褉邪薪邪",
      prevText       : "袩褉械褌褏芯写薪邪 褋褌褉邪薪邪",
      nextText       : "小谢械写械褯邪 褋褌褉邪薪邪",
      lastText       : "袩芯褋谢械写褮邪 褋褌褉邪薪邪",
      refreshText    : "袨褋胁械卸懈",
      displayMsg     : "袩褉懈泻邪蟹邪薪邪 {0} - {1} 芯写 {2}",
      emptyMsg       : '袧械屑邪屑 褕褌邪 锌褉懈泻邪蟹邪褌懈'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "袦懈薪懈屑邪谢薪邪 写褍卸懈薪邪 芯胁芯谐 锌芯褭邪 褬械 {0}",
      maxLengthText : "袦邪泻褋懈屑邪谢薪邪 写褍卸懈薪邪 芯胁芯谐 锌芯褭邪 褬械 {0}",
      blankText     : "袩芯褭械 褬械 芯斜邪胁械蟹薪芯",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "袦懈薪懈屑邪谢薪邪 胁褉械写薪芯褋褌 褍 锌芯褭褍 褬械 {0}",
      maxText : "袦邪泻褋懈屑邪谢薪邪 胁褉械写薪芯褋褌 褍 锌芯褭褍 褬械 {0}",
      nanText : "{0} 薪懈褬械 锌褉邪胁懈谢邪薪 斜褉芯褬"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "袩邪褋懈胁薪芯",
      disabledDatesText : "袩邪褋懈胁薪芯",
      minText           : "袛邪褌褍屑 褍 芯胁芯屑 锌芯褭褍 屑芯褉邪 斜懈褌懈 薪邪泻芯薪 {0}",
      maxText           : "袛邪褌褍屑 褍 芯胁芯屑 锌芯褭褍 屑芯褉邪 斜懈褌懈 锌褉械 {0}",
      invalidText       : "{0} 薪懈褬械 锌褉邪胁懈谢邪薪 写邪褌褍屑 - 蟹邪褏褌械胁邪薪懈 芯斜谢懈泻 褬械 {1}",
      format            : "d.m.y",
      startDay          : 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "校褔懈褌邪胁邪屑...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '袨胁芯 锌芯褭械 锌褉懈褏胁邪褌邪 e-mail 邪写褉械褋褍 懈褋泻褭褍褔懈胁芯 褍 芯斜谢懈泻褍 "korisnik@domen.com"',
      urlText      : '袨胁芯 锌芯褭械 锌褉懈褏胁邪褌邪 URL 邪写褉械褋褍 懈褋泻褭褍褔懈胁芯 褍 芯斜谢懈泻褍 "http:/'+'/www.domen.com"',
      alphaText    : '袨胁芯 锌芯褭械 屑芯卸械 褋邪写褉卸邪褌懈 懈褋泻褭褍褔懈胁芯 褋谢芯胁邪 懈 蟹薪邪泻 _',
      alphanumText : '袨胁芯 锌芯褭械 屑芯卸械 褋邪写褉卸邪褌懈 褋邪屑芯 褋谢芯胁邪, 斜褉芯褬械胁械 懈 蟹薪邪泻 _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "袪邪褋褌褍褯懈 褉械写芯褋谢械写",
      sortDescText : "袨锌邪写邪褬褍褯懈 褉械写芯褋谢械写",
      lockText     : "袟邪泻褭褍褔邪褬 泻芯谢芯薪褍",
      unlockText   : "袨褌泻褭褍褔邪褬 泻芯谢芯薪褍",
      columnsText  : "袣芯谢芯薪械"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "袧邪蟹懈胁",
      valueText  : "袙褉械写薪芯褋褌",
      dateFormat : "d.m.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "袩芯胁褍褯懈 蟹邪 懈蟹屑械薪褍 胁械谢懈褔懈薪械.",
      collapsibleSplitTip : "袩芯胁褍褯懈 蟹邪 懈蟹屑械薪褍 胁械谢懈褔懈薪械. 袛胁芯褋褌褉褍泻懈 泻谢懈泻 蟹邪 褋邪泻褉懈胁邪褮械."
   });
}
