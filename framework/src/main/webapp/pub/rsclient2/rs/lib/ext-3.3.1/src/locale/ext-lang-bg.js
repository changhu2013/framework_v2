/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Bulgarian Translation
 *
 * By 袚械芯褉谐懈 袣芯褋褌邪写懈薪芯胁, 袣邪谢谐邪褉懈, 袣邪薪邪写邪
 * 10 October 2007
 * By Nedko Penev 
 * 26 October 2007
 *
 * (utf-8 encoding)
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">袟邪褉械卸写邪薪械...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} 懈蟹斜褉邪薪懈 泻芯谢芯薪懈";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "袟邪褌胁芯褉懈 褌邪斜";
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "袧械胁邪谢懈写薪邪 褋褌芯泄薪芯褋褌 薪邪 锌芯谢械褌芯";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "袟邪褉械卸写邪薪械...";
}

Date.monthNames = [
  "携薪褍邪褉懈",
  "肖械胁褉褍邪褉懈",
  "袦邪褉褌",
  "袗锌褉懈谢",
  "袦邪泄",
  "挟薪懈",
  "挟谢懈",
  "袗胁谐褍褋褌",
  "小械锌褌械屑胁褉懈",
  "袨泻褌芯屑胁褉懈",
  "袧芯械屑胁褉懈",
  "袛械泻械屑胁褉懈"
];

Date.monthNumbers = {
  Jan : 0,
  Feb : 1,
  Mar : 2,
  Apr : 3,
  May : 4,
  Jun : 5,
  Jul : 6,
  Aug : 7,
  Sep : 8,
  Oct : 9,
  Nov : 10,
  Dec : 11
};

Date.dayNames = [
  "袧械写械谢褟",
  "袩芯薪械写械谢薪懈泻",
  "袙褌芯褉薪懈泻",
  "小褉褟写邪",
  "效械褌胁褗褉褌褗泻",
  "袩械褌褗泻",
  "小褗斜芯褌邪"
];

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "OK",
    cancel : "袨褌屑械薪懈",
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
    todayText         : "袛薪械褋",
    minText           : "孝邪蟹懈 写邪褌邪 械 锌褉械写懈 屑懈薪懈屑邪谢薪邪褌邪",
    maxText           : "孝邪蟹懈 写邪褌邪 械 褋谢械写 屑邪泻褋懈屑邪谢薪邪褌邪",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : '小谢械写胁邪褖 屑械褋械褑 (Control+Right)',
    prevText          : '袩褉械写懈褕械薪 屑械褋械褑 (Control+Left)',
    monthYearText     : '袠蟹斜械褉懈 屑械褋械褑 (Control+Up/Down 蟹邪 锌褉械屑械褋褌胁邪薪械 锌芯 谐芯写懈薪懈)',
    todayTip          : "{0} (Spacebar)",
    format            : "d.m.y",
    okText            : "&#160;OK&#160;",
    cancelText        : "袨褌屑械薪懈",
    startDay          : 1
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "小褌褉邪薪懈褑邪",
    afterPageText  : "芯褌 {0}",
    firstText      : "袩褗褉胁邪 褋褌褉邪薪懈褑邪",
    prevText       : "袩褉械写懈褕薪邪 褋褌褉邪薪懈褑邪",
    nextText       : "小谢械写胁邪褖邪 褋褌褉邪薪懈褑邪",
    lastText       : "袩芯褋谢械写薪邪 褋褌褉邪薪懈褑邪",
    refreshText    : "袩褉械蟹邪褉械写懈",
    displayMsg     : "袩芯泻邪蟹胁邪泄泻懈 {0} - {1} 芯褌 {2}",
    emptyMsg       : '袧褟屑邪 写邪薪薪懈 蟹邪 锌芯泻邪蟹胁邪薪械'
  });
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "袦懈薪懈屑邪谢薪邪褌邪 写褗谢卸懈薪邪 薪邪 褌芯胁邪 锌芯谢械 械 {0}",
    maxLengthText : "袦邪泻褋懈屑邪谢薪邪褌邪 写褗谢卸懈薪邪 薪邪 褌芯胁邪 锌芯谢械 械 {0}",
    blankText     : "孝芯胁邪 锌芯谢械 械 蟹邪写褗谢卸懈褌械谢薪芯",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "袦懈薪懈屑邪谢薪邪褌邪 褋褌芯泄薪芯褋褌 蟹邪 褌芯胁邪 锌芯谢械 械 {0}",
    maxText : "袦邪泻褋懈屑邪谢薪邪褌邪 褋褌芯泄薪芯褋褌 蟹邪 褌芯胁邪 锌芯谢械 械 {0}",
    nanText : "{0} 薪械 械 胁邪谢懈写薪芯 褔懈褋谢芯"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "袧械写芯褋褌褗锌械薪",
    disabledDatesText : "袧械写芯褋褌褗锌械薪",
    minText           : "袛邪褌邪褌邪 胁 褌芯胁邪 锌芯谢械 褌褉褟斜胁邪 写邪 械 褋谢械写 {0}",
    maxText           : "袛邪褌邪褌邪 胁 褌芯胁邪 锌芯谢械 褌褉褟斜胁邪 写邪 械 锌褉械写懈 {0}",
    invalidText       : "{0} 薪械 械 胁邪谢懈写薪邪 写邪褌邪 - 褌褉褟斜胁邪 写邪 斜褗写械 胁褗胁 褎芯褉屑邪褌 {1}",
    format            : "d.m.y",
    altFormats        : "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d",
    startDay          : 1
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "袟邪褉械卸写邪薪械...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : '孝芯胁邪 锌芯谢械 褌褉褟斜胁邪 写邪 斜褗写械 械屑械泄谢 胁褗胁 褎芯褉屑邪褌 "user@example.com"',
    urlText      : '孝芯胁邪 锌芯谢械 褌褉褟斜胁邪 写邪 斜褗写械 URL 胁褗胁 褎芯褉屑邪褌 "http:/'+'/www.example.com"',
    alphaText    : '孝芯胁邪 锌芯谢械 褌褉褟斜胁邪 写邪 褋褗写褗褉卸邪 褋邪屑芯 斜褍泻胁懈 懈 _',
    alphanumText : '孝芯胁邪 锌芯谢械 褌褉褟斜胁邪 写邪 褋褗写褗褉卸邪 褋邪屑芯 斜褍泻胁懈, 褑懈褎褉懈 懈 _'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : '袦芯谢褟, 胁褗胁械写械褌械 URL 蟹邪 胁褉褗蟹泻邪褌邪:',
    buttonTips : {
      bold : {
        title: 'Bold (Ctrl+B)',
        text: '校写械斜械谢褟胁邪 懈蟹斜褉邪薪懈褟 褌械泻褋褌.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Italic (Ctrl+I)',
        text: '袩褉邪胁懈 懈蟹斜褉邪薪懈褟 褌械泻褋褌 泻褍褉褋懈胁.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Underline (Ctrl+U)',
        text: '袩芯写褔械褉褌邪胁邪 懈蟹斜褉邪薪懈褟 褌械泻褋褌.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: '校谐芯谢械屑懈 褌械泻褋褌邪',
        text: '校谐芯谢械屑褟胁邪 褉邪蟹屑械褉邪 薪邪 褕褉懈褎褌邪.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: '袧邪屑邪谢懈 褌械泻褋褌邪',
        text: '袧邪屑邪谢褟胁邪 褉邪蟹屑械褉邪 薪邪 褕褉懈褎褌邪.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: '笑胁褟褌 薪邪 屑邪褉泻懈褉邪薪懈褟 褌械泻褋褌',
        text: '袩褉芯屑械薪褟 褎芯薪芯胁懈褟 褑胁褟褌 薪邪 懈蟹斜褉邪薪懈褟 褌械泻褋褌.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: '笑胁褟褌 薪邪 褕褉懈褎褌邪',
        text: '袩褉芯屑械薪褟 褑胁械褌邪 薪邪 懈蟹斜褉邪薪懈褟 褌械泻褋褌.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: '袥褟胁芯 锌芯写褉邪胁薪褟胁邪薪械',
        text: '袩芯写褉邪胁薪褟胁邪 褌械泻褋褌邪 薪邪 谢褟胁芯.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: '笑械薪褌褉懈褉邪薪械',
        text: '笑械薪褌褉懈褉邪 褌械泻褋褌邪.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: '袛褟褋薪芯 锌芯写褉邪胁薪褟胁邪薪械',
        text: '袩芯写褉邪胁薪褟胁邪 褌械泻褋褌邪 薪邪 写褟褋薪芯.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: '袧械薪芯屑械褉懈褉邪薪 褋锌懈褋褗泻',
        text: '袟邪锌芯褔胁邪 薪械薪芯屑械褉懈褉邪薪 褋锌懈褋褗泻.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: '袧芯屑械褉懈褉邪薪 褋锌懈褋褗泻',
        text: '袟邪锌芯褔胁邪 薪芯屑械褉懈褉邪薪 褋锌懈褋褗泻.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: '啸懈锌械褉胁褉褗蟹泻邪',
        text: '袩褉械胁褉褗褖邪 懈蟹斜褉邪薪懈褟 褌械泻褋褌 胁 褏懈锌械褉胁褉褗蟹泻邪.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: '袪械写邪泻褌懈褉邪薪械 薪邪 泻芯写邪',
        text: '袩褉械屑懈薪邪胁邪薪械 胁 褉械卸懈屑 薪邪 褉械写邪泻褌懈褉邪薪械 薪邪 泻芯写邪.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "袩芯写褉械写懈 胁 薪邪褉邪褋褌胁邪褖 褉械写",
    sortDescText : "袩芯写褉械写懈 胁 薪邪屑邪谢褟胁邪褖 褉械写",
    lockText     : "袟邪泻谢褞褔懈 泻芯谢芯薪邪",
    unlockText   : "袨褌泻谢褞褔懈 泻芯谢芯薪邪",
    columnsText  : "袣芯谢芯薪懈"
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "袠屑械",
    valueText  : "小褌芯泄薪芯褋褌",
    dateFormat : "d.m.Y"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "袙谢邪褔械褌械 褋 屑懈褕泻邪褌邪 蟹邪 写邪 锌褉芯屑械薪懈褌械 褉邪蟹屑械褉邪.",
    collapsibleSplitTip : "袙谢邪褔械褌械 褋 屑懈褕泻邪褌邪 蟹邪 写邪 锌褉芯屑械薪懈褌械 褉邪蟹屑械褉邪. 效褍泻薪械褌械 写胁邪 锌褗褌懈 蟹邪 写邪 褋泻褉懈械褌械."
  });
}
