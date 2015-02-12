/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Ukrainian translations for ExtJS (UTF-8 encoding)
 *
 * Original translation by zlatko
 * 3 October 2007
 *
 * Updated by dev.ashevchuk@gmail.com
 * 01.09.2009
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">袟邪胁邪薪褌邪卸械薪薪褟...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "<袩芯褉芯卸薪褜芯>";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} 芯斜褉邪薪懈褏 褉褟写泻褨胁";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "袟邪泻褉懈褌懈 褑褞 胁泻谢邪写泻褍";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "啸懈斜薪械 蟹薪邪褔械薪薪褟";
}

if(Ext.LoadMask){
   Ext.LoadMask.prototype.msg = "袟邪胁邪薪褌邪卸械薪薪褟...";
}

Date.monthNames = [
   "小褨褔械薪褜",
   "袥褞褌懈泄",
   "袘械褉械蟹械薪褜",
   "袣胁褨褌械薪褜",
   "孝褉邪胁械薪褜",
   "效械褉胁械薪褜",
   "袥懈锌械薪褜",
   "小械褉锌械薪褜",
   "袙械褉械褋械薪褜",
   "衮芯胁褌械薪褜",
   "袥懈褋褌芯锌邪写",
   "袚褉褍写械薪褜"
];

Date.dayNames = [
   "袧械写褨谢褟",
   "袩芯薪械写褨谢芯泻",
   "袙褨胁褌芯褉芯泻",
   "小械褉械写邪",
   "效械褌胁械褉",
   "袩钬樱徰傂叫秆哟?,
   "小褍斜芯褌邪"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "袙褨写屑褨薪邪",
      yes    : "孝邪泻",
      no     : "袧褨"
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
      todayText         : "小褜芯谐芯写薪褨",
      minText           : "笑褟 写邪褌邪 屑械薪褜褕邪 蟹邪 屑褨薪褨屑邪谢褜薪褍 写芯锌褍褋褌懈屑褍 写邪褌褍",
      maxText           : "笑褟 写邪褌邪 斜褨谢褜褕邪 蟹邪 屑邪泻褋懈屑邪谢褜薪褍 写芯锌褍褋褌懈屑褍 写邪褌褍",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : '袧邪褋褌褍锌薪懈泄 屑褨褋褟褑褜 (Control+袙锌褉邪胁芯)',
      prevText          : '袩芯锌械褉械写薪褨泄 屑褨褋褟褑褜 (Control+袙谢褨胁芯)',
      monthYearText     : '袙懈斜褨褉 屑褨褋褟褑褟 (Control+袙胁械褉褏/袙薪懈蟹 写谢褟 胁懈斜芯褉褍 褉芯泻褍)',
      todayTip          : "{0} (袩褉芯斜褨谢)",
      format            : "d.m.y",
      okText            : "&#160;OK&#160;",
      cancelText        : "袙褨写屑褨薪邪",
      startDay          : 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "小褌芯褉褨薪泻邪",
      afterPageText  : "蟹 {0}",
      firstText      : "袩械褉褕邪 褋褌芯褉褨薪泻邪",
      prevText       : "袩芯锌械褉械写薪褟 褋褌芯褉褨薪泻邪",
      nextText       : "袧邪褋褌褍锌薪邪 褋褌芯褉褨薪泻邪",
      lastText       : "袨褋褌邪薪薪褟 褋褌芯褉褨薪泻邪",
      refreshText    : "袨褋胁褨卸懈褌懈",
      displayMsg     : "袙褨写芯斜褉邪卸械薪薪褟 蟹邪锌懈褋褨胁 蟹 {0} 锌芯 {1}, 胁褋褜芯谐芯 {2}",
      emptyMsg       : '袛邪薪褨 写谢褟 胁褨写芯斜褉邪卸械薪薪褟 胁褨写褋褍褌薪褨'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "袦褨薪褨屑邪谢褜薪邪 写芯胁卸懈薪邪 褑褜芯谐芯 锌芯谢褟 {0}",
      maxLengthText : "袦邪泻褋懈屑邪谢褜薪邪 写芯胁卸懈薪邪 褑褜芯谐芯 锌芯谢褟 {0}",
      blankText     : "笑械 锌芯谢械 褦 芯斜芯胁钬樱徯沸盒拘残感?写谢褟 蟹邪锌芯胁薪械薪薪褟",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "袟薪邪褔械薪薪褟 褍 褑褜芯屑褍 锌芯谢褨 薪械 屑芯卸械 斜褍褌懈 屑械薪褜褕械 {0}",
      maxText : "袟薪邪褔械薪薪褟 褍 褑褜芯屑褍 锌芯谢褨 薪械 屑芯卸械 斜褍褌懈 斜褨谢褜褕械 {0}",
      nanText : "{0} 薪械 褦 褔懈褋谢芯屑"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "袧械 写芯褋褌褍锌薪芯",
      disabledDatesText : "袧械 写芯褋褌褍锌薪芯",
      minText           : "袛邪褌邪 褍 褑褜芯屑褍 锌芯谢褨 锌芯胁懈薪薪邪 斜褍褌懈 斜褨谢褜褕邪 {0}",
      maxText           : "袛邪褌邪 褍 褑褜芯屑褍 锌芯谢褨 锌芯胁懈薪薪邪 斜褍褌懈 屑械薪褜褕邪 {0}",
      invalidText       : "{0} 褏懈斜薪邪 写邪褌邪 - 写邪褌邪 锌芯胁懈薪薪邪 斜褍褌懈 胁泻邪蟹邪薪邪 褍 褎芯褉屑邪褌褨 {1}",
      format            : "d.m.y",
      startDay          : 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "袟邪胁邪薪褌邪卸械薪薪褟...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '笑械 锌芯谢械 锌芯胁懈薪薪芯 屑褨褋褌懈褌懈 邪写褉械褋褍 械谢械泻褌褉芯薪薪芯褩 锌芯褕褌懈 褍 褎芯褉屑邪褌褨 "user@example.com"',
      urlText      : '笑械 锌芯谢械 锌芯胁懈薪薪芯 屑褨褋褌懈褌懈 URL 褍 褎芯褉屑邪褌褨 "http:/'+'/www.example.com"',
      alphaText    : '笑械 锌芯谢械 锌芯胁懈薪薪芯 屑褨褋褌懈褌懈 胁懈泻谢褞褔薪芯 谢邪褌懈薪褋褜泻褨 谢褨褌械褉懈 褌邪 褋懈屑胁芯谢 锌褨写泻褉械褋谢械薪薪褟 "_"',
      alphanumText : '笑械 锌芯谢械 锌芯胁懈薪薪芯 屑褨褋褌懈褌懈 胁懈泻谢褞褔薪芯 谢邪褌懈薪褋褜泻褨 谢褨褌械褉懈, 褑懈褎褉懈 褌邪 褋懈屑胁芯谢 锌褨写泻褉械褋谢械薪薪褟 "_"'
   });
}

if(Ext.form.HtmlEditor){
   Ext.apply(Ext.form.HtmlEditor.prototype, {
     createLinkText : '袘褍写褜-谢邪褋泻邪 胁胁械写褨褌褜 邪写褉械褋褍:',
     buttonTips : {
            bold : {
               title: '袧邪锌褨胁卸懈褉薪懈泄 (Ctrl+B)',
               text: '袟褉芯斜懈褌懈 薪邪锌褨胁卸懈褉薪懈屑 胁懈写褨谢械薪懈泄 褌械泻褋褌.',
               cls: 'x-html-editor-tip'
            },
            italic : {
               title: '袣褍褉褋懈胁 (Ctrl+I)',
               text: '袟褉芯斜懈褌懈 泻褍褉褋懈胁芯屑 胁懈写褨谢械薪懈泄 褌械泻褋褌.',
               cls: 'x-html-editor-tip'
            },
            underline : {
               title: '袩褨写泻褉械褋谢械薪懈泄 (Ctrl+U)',
               text: '袟褉芯斜懈褌懈 锌褨写泻褉械褋谢械薪懈屑 胁懈写褨谢械薪懈泄 褌械泻褋褌.',
               cls: 'x-html-editor-tip'
           },
           increasefontsize : {
               title: '袟斜褨谢褜褕懈褌懈 褉芯蟹屑褨褉',
               text: '袟斜褨谢褜褕懈褌懈 褉芯蟹屑褨褉 褕褉懈褎褌邪.',
               cls: 'x-html-editor-tip'
           },
           decreasefontsize : {
               title: '袟屑械薪褜褕懈褌懈 褉芯蟹屑褨褉',
               text: '袟屑械薪褜褕懈褌懈 褉芯蟹屑褨褉 褕褉懈褎褌邪.',
               cls: 'x-html-editor-tip'
           },
           backcolor : {
               title: '袟邪谢懈胁泻邪',
               text: '袟屑褨薪懈褌懈 泻芯谢褨褉 褎芯薪褍 写谢褟 胁懈写褨谢械薪芯谐芯 褌械泻褋褌褍 邪斜芯 邪斜蟹邪褑褍.',
               cls: 'x-html-editor-tip'
           },
           forecolor : {
               title: '袣芯谢褨褉 褌械泻褋褌褍',
               text: '袟屑褨薪懈褌懈 泻芯谢褨褉 胁懈写褨谢械薪芯谐芯 褌械泻褋褌褍 邪斜芯 邪斜蟹邪褑褍.',
               cls: 'x-html-editor-tip'
           },
           justifyleft : {
               title: '袙懈褉褨胁薪褟褌懈 褌械泻褋褌 锌芯 谢褨胁芯屑褍 锌芯谢褞',
               text: '袙懈褉褨胁薪褞胁邪薪薪褟 褌械泻褋褌褍 锌芯 谢褨胁芯屑褍 锌芯谢褞.',
               cls: 'x-html-editor-tip'
           },
           justifycenter : {
               title: '袙懈褉褨胁薪褟褌懈 褌械泻褋褌 锌芯 褑械薪褌褉褍',
               text: '袙懈褉褨胁薪褞胁邪薪薪褟 褌械泻褋褌褍 锌芯 褑械薪褌褉褍.',
               cls: 'x-html-editor-tip'
           },
           justifyright : {
               title: '袙懈褉褨胁薪褟褌懈 褌械泻褋褌 锌芯 锌褉邪胁芯屑褍 锌芯谢褞',
               text: '袙懈褉褨胁薪褞胁邪薪薪褟 褌械泻褋褌褍 锌芯 锌褉邪胁芯屑褍 锌芯谢褞.',
               cls: 'x-html-editor-tip'
           },
           insertunorderedlist : {
               title: '袦邪褉泻械褉懈',
               text: '袩芯褔邪褌懈 屑邪褉泻芯胁邪薪懈泄 褋锌懈褋芯泻.',
               cls: 'x-html-editor-tip'
           },
           insertorderedlist : {
               title: '袧褍屑械褉邪褑褨褟',
               text: '袩芯褔邪褌懈 薪褍屑械褉薪芯胁邪薪懈泄 褋锌懈褋芯泻.',
               cls: 'x-html-editor-tip'
           },
           createlink : {
               title: '袙褋褌邪胁懈褌懈 谐褨锌械褉锌芯褋懈谢邪薪薪褟',
               text: '小褌胁芯褉械薪薪褟 锌芯褋懈谢邪薪薪褟 褨蟹 胁懈写褨谢械薪芯谐芯 褌械泻褋褌褍.',
               cls: 'x-html-editor-tip'
           },
           sourceedit : {
               title: '袛卸械褉械谢褜薪懈泄 泻芯写',
               text: '袪械卸懈屑 褉械写邪谐褍胁邪薪薪褟 写卸械褉械谢褜薪芯谐芯 泻芯写褍.',
               cls: 'x-html-editor-tip'
           }
        }
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "小芯褉褌褍胁邪褌懈 锌芯 蟹褉芯褋褌邪薪薪褞",
      sortDescText : "小芯褉褌褍胁邪褌懈 锌芯 褋锌邪写邪薪薪褞",
      lockText     : "袟邪泻褉褨锌懈褌懈 褋褌芯胁锌械褑褜",
      unlockText   : "袙褨写泻褉褨锌懈褌懈 褋褌芯胁锌械褑褜",
      columnsText  : "小褌芯胁锌褑褨"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "袧邪蟹胁邪",
      valueText  : "袟薪邪褔械薪薪褟",
      dateFormat : "j.m.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "孝褟谐薪褨褌褜 写谢褟 蟹屑褨薪懈 褉芯蟹屑褨褉褍.",
      collapsibleSplitTip : "孝褟谐薪褨褌褜 写谢褟 蟹屑褨薪懈 褉芯蟹屑褨褉褍. 袩芯写胁褨泄薪懈泄 泻谢褨泻 褋褏芯胁邪褦 锌邪薪械谢褜."
   });
}

