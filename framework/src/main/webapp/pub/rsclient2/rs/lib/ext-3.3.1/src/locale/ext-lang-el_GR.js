/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Greek translation
 * By thesilentman (utf8 encoding)
 * 27 Apr 2008
 *
 * Changes since previous (second) Version:
 * + added Date.shortMonthNames 
 * + added Date.getShortMonthName 
 * + added Date.monthNumbers
 * + added Ext.grid.GroupingView
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">螠蔚蟿伪蠁蠈蚁蟿蝇蟽畏 未蔚未慰渭苇谓蝇谓...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} 螘蟺喂位蔚纬渭苇谓蔚蟼 蟽蔚喂蚁苇蟼";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "螝位蔚委蟽蟿蔚 蟿慰 tab";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "韦慰 蟺蔚蚁喂蔚蠂蠈渭蔚谓慰 蟿慰蠀 蟺蔚未委慰蠀 未蔚谓 蔚委谓伪喂 伪蟺慰未蔚魏蟿蠈";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "螠蔚蟿伪蠁蠈蚁蟿蝇蟽畏 未蔚未慰渭苇谓蝇谓...";
}

Date.monthNames = [
   "螜伪谓慰蠀维蚁喂慰蟼",
   "桅蔚尾蚁慰蠀维蚁喂慰蟼",
   "螠维蚁蟿喂慰蟼",
   "螒蟺蚁委位喂慰蟼",
   "螠维喂慰蟼",
   "螜慰蠉谓喂慰蟼",
   "螜慰蠉位喂慰蟼",
   "螒蠉纬慰蠀蟽蟿慰蟼",
   "危蔚蟺蟿苇渭尾蚁喂慰蟼",
   "螣魏蟿蠋尾蚁喂慰蟼",
   "螡慰苇渭尾蚁喂慰蟼",
   "螖蔚魏苇渭尾蚁喂慰蟼"
];

Date.shortMonthNames = [
   "螜伪谓",
   "桅蔚尾",
   "螠维蚁",
   "螒蟺蚁",
   "螠维喂",
   "螜慰蠉",
   "螜慰蠉",
   "螒蠉纬",
   "危蔚蟺",
   "螣魏蟿",
   "螡慰苇",
   "螖蔚魏"
];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

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

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};


Date.dayNames = [
   "螝蠀蚁喂伪魏萎",
   "螖蔚蠀蟿苇蚁伪",
   "韦蚁委蟿畏",
   "韦蔚蟿维蚁蟿畏",
   "螤苇渭蟺蟿畏",
   "螤伪蚁伪蟽魏蔚蠀萎",
   "危维尾尾伪蟿慰"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "螁魏蠀蚁慰",
      yes    : "螡伪喂",
      no     : "螌蠂喂"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "d/m/Y");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "危萎渭蔚蚁伪",
      minText           : "螚 螚渭蔚蚁慰渭畏谓委伪 蔚委谓伪喂 蟺蚁慰纬蔚谓苇蟽蟿蔚蚁畏 伪蟺蠈 蟿畏谓 蟺伪位伪喂蠈蟿蔚蚁畏 伪蟺慰未蔚魏蟿萎",
      maxText           : "螚 螚渭蔚蚁慰渭畏谓委伪 蔚委谓伪喂 渭蔚蟿伪纬蔚谓苇蟽蟿蔚蚁畏 伪蟺蠈 蟿畏谓 谓蔚蠈蟿蔚蚁畏 伪蟺慰未蔚魏蟿萎",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames  : Date.monthNames,
      dayNames    : Date.dayNames,
      nextText          : '螘蟺蠈渭蔚谓慰蟼 螠萎谓伪蟼 (Control+螖蔚尉委 螔苇位慰蟼)',
      prevText          : '螤蚁慰畏纬慰蠉渭蔚谓慰蟼 螠萎谓伪蟼 (Control + 螒蚁喂蟽蟿蔚蚁蠈 螔苇位慰蟼)',
      monthYearText     : '螘蟺喂位慰纬萎 螠畏谓蠈蟼 (Control + 螘蟺维谓蝇/螝维蟿蝇 螔苇位慰蟼 纬喂伪 渭蔚蟿伪尾慰位萎 蔚蟿蠋谓)',
      todayTip          : "{0} (螤蚂萎魏蟿蚁慰 螖喂伪蟽蟿萎渭伪蟿慰蟼)",
      format            : "d/m/y"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "危蔚位委未伪",
      afterPageText  : "伪蟺蠈 {0}",
      firstText      : "螤蚁蠋蟿畏 危蔚位委未伪",
      prevText       : "螤蚁慰畏纬慰蠉渭蔚谓畏 危蔚位委未伪",
      nextText       : "螘蟺蠈渭蔚谓畏 危蔚位委未伪",
      lastText       : "韦蔚位蔚蠀蟿伪委伪 危蔚位委未伪",
      refreshText    : "螒谓伪谓苇蝇蟽畏",
      displayMsg     : "螘渭蠁维谓喂蟽畏 {0} - {1} 伪蟺蠈 {2}",
      emptyMsg       : '螖蔚谓 蠀蟺维蚁蠂慰蠀谓 未蔚未慰渭苇谓伪'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "韦慰 渭喂魏蚁蠈蟿蔚蚁慰 伪蟺慰未蔚魏蟿蠈 渭萎魏慰蟼 纬喂伪 蟿慰 蟺蔚未委慰 蔚委谓伪喂 {0}",
      maxLengthText : "韦慰 渭蔚纬伪位蠉蟿蔚蚁慰 伪蟺慰未蔚魏蟿蠈 渭萎魏慰蟼 纬喂伪 蟿慰 蟺蔚未委慰 蔚委谓伪喂 {0}",
      blankText     : "韦慰 蟺蔚未委慰 蔚委谓伪喂 蠀蟺慰蠂蚁蔚蝇蟿喂魏蠈",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "螚 渭喂魏蚁蠈蟿蔚蚁畏 蟿喂渭萎 蟿慰蠀 蟺蔚未委慰蠀 蔚委谓伪喂 {0}",
      maxText : "螚 渭蔚纬伪位蠉蟿蔚蚁畏 蟿喂渭萎 蟿慰蠀 蟺蔚未委慰蠀 蔚委谓伪喂 {0}",
      nanText : "{0} 未蔚谓 蔚委谓伪喂 伪蟺慰未蔚魏蟿蠈蟼 伪蚁喂胃渭蠈蟼"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "螒谓蔚谓蔚蚁纬蠈",
      disabledDatesText : "螒谓蔚谓蔚蚁纬蠈",
      minText           : "螚 畏渭蔚蚁慰渭畏谓委伪 伪蠀蟿慰蠉 蟿慰蠀 蟺蔚未委慰蠀 蟺蚁苇蟺蔚喂 谓伪 蔚委谓伪喂 渭蔚蟿维 蟿畏谓 {0}",
      maxText           : "螚 畏渭蔚蚁慰渭畏谓委伪 伪蠀蟿慰蠉 蟿慰蠀 蟺蔚未委慰蠀 蟺蚁苇蟺蔚喂 谓伪 蔚委谓伪喂 蟺蚁喂谓 蟿畏谓 {0}",
      invalidText       : "{0} 未蔚谓 蔚委谓伪喂 苇纬魏蠀蚁畏 畏渭蔚蚁慰渭畏谓委伪 - 蟺蚁苇蟺蔚喂 谓伪 蔚委谓伪喂 蟽蟿畏 渭慰蚁蠁萎 {1}",
      format            : "d/m/y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "螠蔚蟿伪蠁蠈蚁蟿蝇蟽畏 未蔚未慰渭苇谓蝇谓...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '韦慰 蟺蔚未委慰 未苇蠂蔚蟿伪喂 渭蠈谓慰 未喂蔚蠀胃蠉谓蟽蔚喂蟼 Email 蟽蔚 渭慰蚁蠁萎 "user@example.com"',
      urlText      : '韦慰 蟺蔚未委慰 未苇蠂蔚蟿伪喂 渭蠈谓慰 URL 蟽蔚 渭慰蚁蠁萎 "http:/'+'/www.example.com"',
      alphaText    : '韦慰 蟺蔚未委慰 未苇蠂蔚蟿伪喂 渭蠈谓慰 蠂伪蚁伪魏蟿萎蚁蔚蟼 魏伪喂 _',
      alphanumText : '韦慰 蟺蔚未委慰 未苇蠂蔚蟿伪喂 渭蠈谓慰 蠂伪蚁伪魏蟿萎蚁蔚蟼, 伪蚁喂胃渭慰蠉蟼 魏伪喂 _'
   });
}

if(Ext.form.HtmlEditor){
   Ext.apply(Ext.form.HtmlEditor.prototype, {
        createLinkText : '螖蠋蟽蟿蔚 蟿畏 未喂蔚蠉胃蠀谓蟽畏 (URL) 纬喂伪 蟿慰 蟽蠉谓未蔚蟽渭慰 (link):',
        buttonTips : {
            bold : {
               title: '螆谓蟿慰谓伪 (Ctrl+B)',
               text: '螝维谓蔚蟿蔚 蟿慰 蟺蚁慰蔚蟺喂位蔚纬渭苇谓慰 魏蔚委渭蔚谓慰 苇谓蟿慰谓慰.',
               cls: 'x-html-editor-tip'
            },
            italic : {
               title: '螤位维纬喂伪 (Ctrl+I)',
               text: '螝维谓蔚蟿蔚 蟿慰 蟺蚁慰蔚蟺喂位蔚纬渭苇谓慰 魏蔚委渭蔚谓慰 蟺位维纬喂慰.',
               cls: 'x-html-editor-tip'
            },
            underline : {
               title: '违蟺慰纬蚁维渭渭喂蟽畏 (Ctrl+U)',
               text: '违蟺慰纬蚁伪渭渭委味蔚蟿蔚 蟿慰 蟺蚁慰蔚蟺喂位蔚纬渭苇谓慰 魏蔚委渭蔚谓慰.',
               cls: 'x-html-editor-tip'
           },
           increasefontsize : {
               title: '螠蔚纬苇胃蠀谓蟽畏 魏蔚喂渭苇谓慰蠀',
               text: '螠蔚纬伪位蠋谓蔚蟿蔚 蟿畏 纬蚁伪渭渭伪蟿慰蟽蔚喂蚁维.',
               cls: 'x-html-editor-tip'
           },
           decreasefontsize : {
               title: '危渭委魏蚁蠀谓蟽畏 魏蔚喂渭苇谓慰蠀',
               text: '螠喂魏蚁伪委谓蔚蟿蔚 蟿畏 纬蚁伪渭渭伪蟿慰蟽蔚喂蚁维.',
               cls: 'x-html-editor-tip'
           },
           backcolor : {
               title: '围蚁蠋渭伪 桅蠈谓蟿慰蠀 螝蔚喂渭苇谓慰蠀',
               text: '螒位位维味蔚蟿蔚 蟿慰 蠂蚁蠋渭伪 蟽蟿慰 蠁蠈谓蟿慰 蟿慰蠀 蟺蚁慰蔚蟺喂位蔚纬渭苇谓慰蠀 魏蔚喂渭苇谓慰蠀.',
               cls: 'x-html-editor-tip'
           },
           forecolor : {
               title: '围蚁蠋渭伪 螕蚁伪渭渭伪蟿慰蟽蔚喂蚁维蟼',
               text: '螒位位维味蔚蟿蔚 蟿慰 蠂蚁蠋渭伪 蟽蟿畏 纬蚁伪渭渭伪蟿慰蟽蔚喂蚁维 蟿慰蠀 蟺蚁慰蔚蟺喂位蔚纬渭苇谓慰蠀 魏蔚喂渭苇谓慰蠀.',               
               cls: 'x-html-editor-tip'
           },
           justifyleft : {
               title: '螒蚁喂蟽蟿蔚蚁萎 危蟿慰委蠂喂蟽畏 螝蔚喂渭苇谓慰蠀',
               text: '危蟿慰喂蠂委味蔚蟿蔚 蟿慰 魏蔚委渭蔚谓慰 蟽蟿伪 伪蚁喂蟽蟿蔚蚁维.',
               cls: 'x-html-editor-tip'
           },
           justifycenter : {
               title: '螝蔚谓蟿蚁维蚁喂蟽渭伪 螝蔚喂渭苇谓慰蠀',
               text: '危蟿慰喂蠂委味蔚蟿蔚 蟿慰 魏蔚委渭蔚谓慰 蟽蟿慰 魏苇谓蟿蚁慰.',
               cls: 'x-html-editor-tip'
           },
           justifyright : {
               title: '螖蔚尉喂维 危蟿慰委蠂喂蟽畏 螝蔚喂渭苇谓慰蠀',
               text: '危蟿慰喂蠂委味蔚蟿蔚 蟿慰 魏蔚委渭蔚谓慰 蟽蟿伪 未蔚尉喂维.',
               cls: 'x-html-editor-tip'
           },
           insertunorderedlist : {
               title: '螘喂蟽伪纬蝇纬萎 蚂委蟽蟿伪蟼 螝慰蠀魏委未蝇谓',
               text: '萤蔚魏喂谓萎蟽蟿蔚 渭喂伪 位委蟽蟿伪 渭蔚 魏慰蠀魏委未蔚蟼.',
               cls: 'x-html-editor-tip'
           },
           insertorderedlist : {
               title: '螘喂蟽伪纬蝇纬萎 蚂委蟽蟿伪蟼 螒蚁委胃渭畏蟽畏蟼',
               text: '萤蔚魏喂谓萎蟽蟿蔚 渭喂伪 位委蟽蟿伪 渭蔚 伪蚁委胃渭畏蟽畏.',
               cls: 'x-html-editor-tip'
           },
           createlink : {
               title: 'Hyperlink',
               text: '螠蔚蟿伪蟿蚁苇蟺蔚蟿蔚 蟿慰 蟺蚁慰蔚蟺喂位蔚纬渭苇谓慰 魏蔚委渭蔚谓慰 蟽蔚 Link.',
               cls: 'x-html-editor-tip'
           },
           sourceedit : {
               title: '螘蟺蔚尉蔚蚁纬伪蟽委伪 螝蠋未喂魏伪',
               text: '螠蔚蟿伪尾伪委谓蔚蟿蔚 蟽蟿畏 位蔚喂蟿慰蠀蚁纬委伪 蔚蟺蔚尉蔚蚁纬伪蟽委伪蟼 魏蠋未喂魏伪.',
               cls: 'x-html-editor-tip'
           }
        }
   });
}


if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "螒蠉尉慰蠀蟽伪 蟿伪尉喂谓蠈渭畏蟽畏",
      sortDescText : "桅胃委谓慰蠀蟽伪 蟿伪尉喂谓蠈渭畏蟽畏",
      lockText     : "螝位蔚委未蝇渭伪 蟽蟿萎位畏蟼",
      unlockText   : "萤蔚魏位蔚委未蝇渭伪 蟽蟿萎位畏蟼",
      columnsText  : "危蟿萎位蔚蟼"
   });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
  emptyGroupText : '(螝伪渭渭委伪)',
  groupByText    : '螣渭伪未慰蟺慰委畏蟽畏 尾维蟽蔚喂 伪蠀蟿慰蠉 蟿慰蠀 蟺蔚未委慰蠀',
  showGroupsText : '螡伪 蔚渭蠁伪谓委味蔚蟿伪喂 蟽蟿喂蟼 慰渭维未蔚蟼'
  });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "螌谓慰渭伪",
      valueText  : "螤蔚蚁喂蔚蠂蠈渭蔚谓慰",
      dateFormat : "d/m/Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "危蠉蚁蔚蟿蔚 纬喂伪 伪位位伪纬萎 渭蔚纬苇胃慰蠀蟼.",
      collapsibleSplitTip : "危蠉蚁蔚蟿蔚 纬喂伪 伪位位伪纬萎 渭蔚纬苇胃慰蠀蟼. 螖喂蟺位蠈 魏位喂魏 纬喂伪 伪蟺蠈魏蚁蠀蠄畏."
   });
}

