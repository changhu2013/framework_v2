/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Macedonia translation
 * By PetarD petar.dimitrijevic@vorteksed.com.mk (utf8 encoding)
 * 23 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">袙褔懈褌褍胁邪屑...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} 懈蟹斜褉邪薪懈 褉械写懈褑懈";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "袟邪褌胁芯褉懈 tab";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "袙褉械写薪芯褋褌邪 胁芯 芯胁邪 锌芯谢械 械 薪械胁邪谢懈写薪邪";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "袙褔懈褌褍胁邪屑...";
}

Date.monthNames = [
   "袌邪薪褍邪褉懈",
   "肖械胁褉褍邪褉懈",
   "袦邪褉褌",
   "袗锌褉懈谢",
   "袦邪褬",
   "袌褍薪懈",
   "袌褍谢懈",
   "袗胁谐褍褋褌",
   "小械锌褌械屑胁褉懈",
   "袨泻褌芯屑胁褉懈",
   "袧芯械屑胁褉懈",
   "袛械泻械屑胁褉懈"
];

Date.dayNames = [
   "袧械写械谢邪",
   "袩芯薪械写械谢薪懈泻",
   "袙褌芯褉薪懈泻",
   "小褉械写邪",
   "效械褌胁褉褌芯泻",
   "袩械褌芯泻",
   "小邪斜芯褌邪"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "袩芯褌胁褉写懈",
      cancel : "袩芯薪懈褕褌懈",
      yes    : "袛邪",
      no     : "袧械"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "d.m.y");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "袛械薪械褋泻邪",
      minText           : "袨胁芯褬 写邪褌褍屑 械 锌褉械写 薪邪褬屑邪谢懈芯褌 写邪褌褍屑",
      maxText           : "袨胁芯褬 写邪褌褍屑 械 锌褉械写 薪邪褬谐芯谢械屑懈芯褌 写邪褌褍屑",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : '小谢械写械薪 屑械褋械褑 (Control+小褌褉械谢泻邪 写械褋薪芯)',
      prevText          : '袩褉械褌褏芯写械薪 屑械褋械褑 (Control+小褌褉械谢泻邪 谢械胁芯)',
      monthYearText     : '袠蟹斜械褉械褌械 屑械褋械褑 (Control+小褌褉械谢泻邪 谐芯褉械/小褌褉械谢泻邪 写械褋薪芯 蟹邪 屑械薪褍胁邪褮械 谐芯写懈薪邪)',
      todayTip          : "{0} (Spacebar)",
      format            : "d.m.y"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "小褌褉邪薪懈褑邪",
      afterPageText  : "芯写 {0}",
      firstText      : "袩褉胁邪 小褌褉邪薪懈褑邪",
      prevText       : "袩褉械褌褏芯写薪邪 小褌褉邪薪懈褑邪",
      nextText       : "小谢械写薪邪 小褌褉邪薪懈褑邪",
      lastText       : "袩芯褋谢械写薪邪 小褌褉邪薪懈褑邪",
      refreshText    : "袨褋胁械卸懈",
      displayMsg     : "袩褉懈泻邪卸褍胁邪屑 {0} - {1} 芯写 {2}",
      emptyMsg       : '袧械屑邪 锌芯写邪褌芯褑懈 蟹邪 锌褉懈泻邪蟹'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "袦懈薪懈屑邪谢薪邪褌邪 写芯谢卸懈薪邪 蟹邪 芯胁邪 锌芯谢械 械 {0}",
      maxLengthText : "袦邪泻褋懈屑邪谢薪邪褌邪 写芯谢卸懈薪邪 蟹邪 芯胁邪 锌芯谢械 械 {0}",
      blankText     : "袩芯写邪褌芯褑懈褌械 胁芯 芯胁邪 锌芯谢械 褋械 锌芯褌褉械斜薪懈",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "袦懈薪懈屑邪谢薪邪褌邪 胁褉械写薪芯褋褌 蟹邪 芯胁邪 锌芯谢械 械 {0}",
      maxText : "袦邪泻褋懈屑邪谢薪邪褌邪 胁褉械写薪芯褋褌 蟹邪 芯胁邪 锌芯谢械 械 {0}",
      nanText : "{0} 薪械 械 胁邪谢懈写械薪 斜褉芯褬"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "袧械邪泻褌懈胁薪芯",
      disabledDatesText : "袧械邪泻褌懈胁薪芯",
      minText           : "袛邪褌褍屑芯褌 胁芯 芯胁邪 锌芯谢械 屑芯褉邪 写邪 斜懈写械 锌褉械写 {0}",
      maxText           : "袛邪褌褍屑芯褌 胁芯 芯胁邪 锌芯谢械 屑芯褉邪 写邪 斜懈写械 锌芯 {0}",
      invalidText       : "{0} 薪械 械 胁邪谢懈写械薪 写邪褌褍屑 - 屑芯褉邪 写邪 斜懈写械 胁芯 褎芯褉屑邪褌 {1}",
      format            : "d.m.y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "袙褔懈褌褍胁邪屑...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '袨胁邪 锌芯谢械 褌褉械斜邪 写邪 斜懈写械 e-mail 邪写褉械褋邪 胁芯 褎芯褉屑邪褌 "user@example.com"',
      urlText      : '袨胁邪 锌芯谢械 褌褉械斜邪 写邪 斜懈写械 URL 胁芯 褎芯褉屑邪褌 "http:/'+'/www.example.com"',
      alphaText    : '袨胁邪 锌芯谢械 褌褉械斜邪 写邪 褋芯写褉卸懈 褋邪屑芯 斜褍泻胁懈 懈 _',
      alphanumText : '袨胁邪 锌芯谢械 褌褉械斜邪 写邪 褋芯写褉卸懈 褋邪屑芯 斜褍泻胁懈, 斜褉芯褬泻懈 懈 _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "小芯褉褌懈褉邪褬 袪邪褋褌械褔泻懈",
      sortDescText : "小芯褉褌懈褉邪褬 袨锌邪褤邪褔泻懈",
      lockText     : "袟邪泻谢褍褔懈 袣芯谢芯薪邪",
      unlockText   : "袨褌泻谢褍褔懈 泻芯谢芯薪邪",
      columnsText  : "袣芯谢芯薪懈"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "袠屑械",
      valueText  : "袙褉械写薪芯褋褌",
      dateFormat : "m.d.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "袩芯胁谢械褔械褌械 蟹邪 屑械薪褍胁邪褮械 薪邪 谐芯谢械屑懈薪邪褌邪.",
      collapsibleSplitTip : "袩芯胁谢械褔械褌械 蟹邪 屑械薪褍胁邪褮械 薪邪 谐芯谢械屑懈薪邪褌邪. 袛褍锌谢懈 泻谢懈泻 蟹邪 泻褉懈械褮械."
   });
}