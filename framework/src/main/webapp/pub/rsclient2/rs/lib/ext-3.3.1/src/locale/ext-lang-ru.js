/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
锘?*
 * Russian translation
 * By ZooKeeper (utf-8 encoding)
 * 6 November 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">袠写械褌 蟹邪谐褉褍蟹泻邪...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} 胁褘斜褉邪薪薪褘褏 褋褌褉芯泻";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "袟邪泻褉褘褌褜 褝褌褍 胁泻谢邪写泻褍";
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "袟薪邪褔械薪懈械 胁 褝褌芯屑 锌芯谢械 薪械胁械褉薪芯械";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "袟邪谐褉褍蟹泻邪...";
}

Date.monthNames = [
    "携薪胁邪褉褜",
    "肖械胁褉邪谢褜",
    "袦邪褉褌",
    "袗锌褉械谢褜",
    "袦邪泄",
    "袠褞薪褜",
    "袠褞谢褜",
    "袗胁谐褍褋褌",
    "小械薪褌褟斜褉褜",
    "袨泻褌褟斜褉褜",
    "袧芯褟斜褉褜",
    "袛械泻邪斜褉褜"
];

Date.shortMonthNames = [
  "携薪胁",
  "肖械胁褉",
  "袦邪褉褌",
  "袗锌褉",
  "袦邪泄",
  "袠褞薪褜",
  "袠褞谢褜",
  "袗胁谐",
  "小械薪褌",
  "袨泻褌",
  "袧芯褟斜",
  "袛械泻"
];

Date.getShortMonthName = function(month) {
  return Date.shortMonthNames[month];
};

Date.monthNumbers = {
  '携薪胁': 0,
  '肖械胁': 1,
  '袦邪褉': 2,
  '袗锌褉': 3,
  '袦邪泄': 4,
  '袠褞薪': 5,
  '袠褞谢': 6,
  '袗胁谐': 7,
  '小械薪': 8,
  '袨泻褌': 9,
  '袧芯褟': 10,
  '袛械泻': 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
  "袙芯褋泻褉械褋械薪褜械",
  "袩芯薪械写械谢褜薪懈泻",
  "袙褌芯褉薪懈泻",
  "小褉械写邪",
  "效械褌胁械褉谐",
  "袩褟褌薪懈褑邪",
  "小褍斜斜芯褌邪"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "OK",
    cancel : "袨褌屑械薪邪",
    yes    : "袛邪",
    no     : "袧械褌"
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
    todayText          : "小械谐芯写薪褟",
    minText            : "协褌邪 写邪褌邪 褉邪薪褜褕械 屑懈薪懈屑邪谢褜薪芯泄 写邪褌褘",
    maxText            : "协褌邪 写邪褌邪 锌芯蟹卸械 屑邪泻褋懈屑邪谢褜薪芯泄 写邪褌褘",
    disabledDaysText   : "",
    disabledDatesText  : "",
    monthNames         : Date.monthNames,
    dayNames           : Date.dayNames,
    nextText           : '小谢械写褍褞褖懈泄 屑械褋褟褑 (Control+袙锌褉邪胁芯)',
    prevText           : '袩褉械写褘写褍褖懈泄 屑械褋褟褑 (Control+袙谢械胁芯)',
    monthYearText      : '袙褘斜芯褉 屑械褋褟褑邪 (Control+袙胁械褉褏/袙薪懈蟹 写谢褟 胁褘斜芯褉邪 谐芯写邪)',
    todayTip           : "{0} (袩褉芯斜械谢)",
    format             : "d.m.y",
    okText             : "&#160;OK&#160;",
    cancelText         : "袨褌屑械薪邪",
    startDay           : 1
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "小褌褉邪薪懈褑邪",
    afterPageText  : "懈蟹 {0}",
    firstText      : "袩械褉胁邪褟 褋褌褉邪薪懈褑邪",
    prevText       : "袩褉械写褘写褍褖邪褟 褋褌褉邪薪懈褑邪",
    nextText       : "小谢械写褍褞褖邪褟 褋褌褉邪薪懈褑邪",
    lastText       : "袩芯褋谢械写薪褟褟 褋褌褉邪薪懈褑邪",
    refreshText    : "袨斜薪芯胁懈褌褜",
    displayMsg     : "袨褌芯斜褉邪卸邪褞褌褋褟 蟹邪锌懈褋懈 褋 {0} 锌芯 {1}, 胁褋械谐芯 {2}",
    emptyMsg       : '袧械褌 写邪薪薪褘褏 写谢褟 芯褌芯斜褉邪卸械薪懈褟'
  });
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "袦懈薪懈屑邪谢褜薪邪褟 写谢懈薪邪 褝褌芯谐芯 锌芯谢褟 {0}",
    maxLengthText : "袦邪泻褋懈屑邪谢褜薪邪褟 写谢懈薪邪 褝褌芯谐芯 锌芯谢褟 {0}",
    blankText     : "协褌芯 锌芯谢械 芯斜褟蟹邪褌械谢褜薪芯 写谢褟 蟹邪锌芯谢薪械薪懈褟",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "袟薪邪褔械薪懈械 褝褌芯谐芯 锌芯谢褟 薪械 屑芯卸械褌 斜褘褌褜 屑械薪褜褕械 {0}",
    maxText : "袟薪邪褔械薪懈械 褝褌芯谐芯 锌芯谢褟 薪械 屑芯卸械褌 斜褘褌褜 斜芯谢褜褕械 {0}",
    nanText : "{0} 薪械 褟胁谢褟械褌褋褟 褔懈褋谢芯屑"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "袧械 写芯褋褌褍锌薪芯",
    disabledDatesText : "袧械 写芯褋褌褍锌薪芯",
    minText           : "袛邪褌邪 胁 褝褌芯屑 锌芯谢械 写芯谢卸薪邪 斜褘褌褜 锌芯蟹写械 {0}",
    maxText           : "袛邪褌邪 胁 褝褌芯屑 锌芯谢械 写芯谢卸薪邪 斜褘褌褜 褉邪薪褜褕械 {0}",
    invalidText       : "{0} 薪械 褟胁谢褟械褌褋褟 锌褉邪胁懈谢褜薪芯泄 写邪褌芯泄 - 写邪褌邪 写芯谢卸薪邪 斜褘褌褜 褍泻邪蟹邪薪邪 胁 褎芯褉屑邪褌械 {1}",
    format            : "d.m.y",
    altFormats        : "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d",
    startDay           : 1
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "袟邪谐褉褍蟹泻邪...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText     : '协褌芯 锌芯谢械 写芯谢卸薪芯 褋芯写械褉卸邪褌褜 邪写褉械褋 褝谢械泻褌褉芯薪薪芯泄 锌芯褔褌褘 胁 褎芯褉屑邪褌械 "user@example.com"',
    urlText       : '协褌芯 锌芯谢械 写芯谢卸薪芯 褋芯写械褉卸邪褌褜 URL 胁 褎芯褉屑邪褌械 "http:/'+'/www.example.com"',
    alphaText     : '协褌芯 锌芯谢械 写芯谢卸薪芯 褋芯写械褉卸邪褌褜 褌芯谢褜泻芯 谢邪褌懈薪褋泻懈械 斜褍泻胁褘 懈 褋懈屑胁芯谢 锌芯写褔械褉泻懈胁邪薪懈褟 "_"',
    alphanumText  : '协褌芯 锌芯谢械 写芯谢卸薪芯 褋芯写械褉卸邪褌褜 褌芯谢褜泻芯 谢邪褌懈薪褋泻懈械 斜褍泻胁褘, 褑懈褎褉褘 懈 褋懈屑胁芯谢 锌芯写褔械褉泻懈胁邪薪懈褟 "_"'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : '袩芯卸邪谢褍泄褋褌邪 胁胁械写懈褌械 邪写褉械褋:',
    buttonTips : {
      bold : {
        title: '袩芯谢褍卸懈褉薪褘泄 (Ctrl+B)',
        text: '袩褉懈屑械薪械薪懈械 锌芯谢褍卸懈褉薪芯谐芯 薪邪褔械褉褌邪薪懈褟 泻 胁褘写械谢械薪薪芯屑褍 褌械泻褋褌褍.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: '袣褍褉褋懈胁 (Ctrl+I)',
        text: '袩褉懈屑械薪械薪懈械 泻褍褉褋懈胁薪芯谐芯 薪邪褔械褉褌邪薪懈褟 泻 胁褘写械谢械薪薪芯屑褍 褌械泻褋褌褍.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: '袩芯写褔褢褉泻薪褍褌褘泄 (Ctrl+U)',
        text: '袩芯写褔褢褉泻懈胁邪薪懈械 胁褘写械谢械薪薪芯谐芯 褌械泻褋褌邪.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: '校胁械谢懈褔懈褌褜 褉邪蟹屑械褉',
        text: '校胁械谢懈褔械薪懈械 褉邪蟹屑械褉邪 褕褉懈褎褌邪.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: '校屑械薪褜褕懈褌褜 褉邪蟹屑械褉',
        text: '校屑械薪褜褕械薪懈械 褉邪蟹屑械褉邪 褕褉懈褎褌邪.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: '袟邪谢懈胁泻邪',
        text: '袠蟹屑械薪械薪懈械 褑胁械褌邪 褎芯薪邪 写谢褟 胁褘写械谢械薪薪芯谐芯 褌械泻褋褌邪 懈谢懈 邪斜蟹邪褑邪.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: '笑胁械褌 褌械泻褋褌邪',
        text: '袠蟹屑械薪懈械 褑胁械褌邪 褌械泻褋褌邪.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: '袙褘褉芯胁薪褟褌褜 褌械泻褋褌 锌芯 谢械胁芯屑褍 泻褉邪褞',
        text: '袙褘褉芯胁薪懈胁邪薪懈械 褌械泻褋褌邪 锌芯 谢械胁芯屑褍 泻褉邪褞.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: '袩芯 褑械薪褌褉褍',
        text: '袙褘褉芯胁薪懈胁邪薪懈械 褌械泻褋褌邪 锌芯 褑械薪褌褉褍.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: '袙褘褉芯胁薪褟褌褜 褌械泻褋褌 锌芯 锌褉邪胁芯屑褍 泻褉邪褞',
        text: '袙褘褉芯胁薪懈胁邪薪懈械 褌械泻褋褌邪 锌芯 锌褉邪胁芯屑褍 泻褉邪褞.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: '袦邪褉泻械褉褘',
        text: '袧邪褔邪褌褜 屑邪褉泻懈褉芯胁邪薪薪褘泄 褋锌懈褋芯泻.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: '袧褍屑械褉邪褑懈褟',
        text: '袧邪褔邪褌褜 薪褍屑械褉薪芯胁邪薪薪褘泄 褋锌懈褋芯泻.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: '袙褋褌邪胁懈褌褜 谐懈锌械褉褋褋褘谢泻褍',
        text: '小芯蟹写邪薪懈械 褋褋褘谢泻懈 懈蟹 胁褘写械谢械薪薪芯谐芯 褌械泻褋褌邪.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: '袠褋褏芯写薪褘泄 泻芯写',
        text: '袩械褉械泻谢褞褔懈褌褜褋褟 薪邪 懈褋褏芯写薪褘泄 泻芯写.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.form.BasicForm){
  Ext.form.BasicForm.prototype.waitTitle = "袩芯卸邪谢褍泄褋褌邪 锌芯写芯卸写懈褌械...";
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "小芯褉褌懈褉芯胁邪褌褜 锌芯 胁芯蟹褉邪褋褌邪薪懈褞",
    sortDescText : "小芯褉褌懈褉芯胁邪褌褜 锌芯 褍斜褘胁邪薪懈褞",
    lockText     : "袟邪泻褉械锌懈褌褜 褋褌芯谢斜械褑",
    unlockText   : "小薪褟褌褜 蟹邪泻褉械锌谢械薪懈械 褋褌芯谢斜褑邪",
    columnsText  : "小褌芯谢斜褑褘"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(袩褍褋褌芯)',
    groupByText    : '袚褉褍锌锌懈褉芯胁邪褌褜 锌芯 褝褌芯屑褍 锌芯谢褞',
    showGroupsText : '袨褌芯斜褉邪卸邪褌褜 锌芯 谐褉褍锌锌邪屑'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "袧邪蟹胁邪薪懈械",
    valueText  : "袟薪邪褔械薪懈械",
    dateFormat : "d.m.Y"
  });
}

if(Ext.SplitLayoutRegion){
  Ext.apply(Ext.SplitLayoutRegion.prototype, {
    splitTip            : "孝褟薪懈褌械 写谢褟 懈蟹屑械薪械薪懈褟 褉邪蟹屑械褉邪.",
    collapsibleSplitTip : "孝褟薪懈褌械 写谢褟 懈蟹屑械薪械薪懈褟 褉邪蟹屑械褉邪. 袛胁芯泄薪芯泄 褖械谢褔芯泻 褋锌褉褟褔械褌 锌邪薪械谢褜."
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "孝褟薪懈褌械 写谢褟 懈蟹屑械薪械薪懈褟 褉邪蟹屑械褉邪.",
    collapsibleSplitTip : "孝褟薪懈褌械 写谢褟 懈蟹屑械薪械薪懈褟 褉邪蟹屑械褉邪. 袛胁芯泄薪芯泄 褖械谢褔芯泻 褋锌褉褟褔械褌 锌邪薪械谢褜."
  });
}
