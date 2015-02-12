/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Korean Translations By nicetip
 * 05 September 2007
 * Modify by techbug / 25 February 2008
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">搿滊敥欷?..</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} 臧滉皜 靹犿儩霅橃棃鞀惦媹雼?";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "雼赴";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "鞓皵毳?臧挂澊 鞎勲嫏雼堧嫟.";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "搿滊敥欷?..";
}

Date.monthNames = [
   "1鞗?,
   "2鞗?,
   "3鞗?,
   "4鞗?,
   "5鞗?,
   "6鞗?,
   "7鞗?,
   "8鞗?,
   "9鞗?,
   "10鞗?,
   "11鞗?,
   "12鞗?
];

Date.dayNames = [
   "鞚?,
   "鞗?,
   "顸?,
   "靾?,
   "氇?,
   "旮?,
   "韱?
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "顸曥澑",
      cancel : "旆唽",
      yes    : "鞓?,
      no     : "鞎勲媹鞓?
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "m/d/Y");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "鞓る姌",
      minText           : "斓涤唽 雮犾氩旍渼毳?雱橃棃鞀惦媹雼?",
      maxText           : "斓滊寑 雮犾氩旍渼毳?雱橃棃鞀惦媹雼?",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : '雼れ潓雼?旎姼搿ろ偆+鞓るジ飒?顸旍偞响?',
      prevText          : '鞚挫爠雼?(旎姼搿ろ偆+鞕检” 顸旍偞响?',
      monthYearText     : '鞗旍潉 靹犿儩顷挫＜靹胳殧. (旎姼搿ろ偆+鞙?鞎勲灅 顸旍偞响?',
      todayTip          : "{0} (鞀ろ帢鞚挫姢氚?",
      format            : "m/d/y",
      okText            : "顸曥澑",
      cancelText        : "旆唽",
      startDay          : 0
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "韼橃澊歆€",
      afterPageText  : "/ {0}",
      firstText      : "觳?韼橃澊歆€",
      prevText       : "鞚挫爠 韼橃澊歆€",
      nextText       : "雼れ潓 韼橃澊歆€",
      lastText       : "毵堨毵?韼橃澊歆€",
      refreshText    : "靸堧瓿犾龚",
      displayMsg     : "鞝勳泊 {2} 欷?{0} - {1}",
      emptyMsg       : '响涤嫓顷?雿办澊韯瓣皜 鞐嗢姷雼堧嫟.'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "斓涤唽旮胳澊电?{0}鞛呺媹雼?",
      maxLengthText : "斓滊寑旮胳澊电?{0}鞛呺媹雼?",
      blankText     : "臧挂潉 鞛呺牓顷挫＜靹胳殧.",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "斓涤唽臧挂潃 {0}鞛呺媹雼?",
      maxText : "斓滊寑臧挂潃 {0}鞛呺媹雼?",
      nanText : "{0}电?鞓皵毳?靾瀽臧€ 鞎勲嫏雼堧嫟."
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "牍勴櫆靹?,
      disabledDatesText : "牍勴櫆靹?,
      minText           : "{0}鞚?鞚错泟鞐暭 顷╇媹雼?",
      maxText           : "{0}鞚?鞚挫爠鞚挫柎鞎?顷╇媹雼?",
      invalidText       : "{0}电?鞓皵毳?雮犾顺曥嫕鞚?鞎勲嫏雼堧嫟. - 雼れ潓瓿?臧榄潃 顺曥嫕鞚挫柎鞎?顷╇媹雼? {1}",
      format            : "m/d/y",
      startDay          : 0
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "搿滊敥欷?..",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '鞚措鞚?欤检唽 顺曥嫕鞐?毵炾矊 鞛呺牓顷挫暭顷╇媹雼? (鞓? "user@example.com")',
      urlText      : 'URL 顺曥嫕鞐?毵炾矊 鞛呺牓顷挫暭顷╇媹雼? (鞓? "http:/'+'/www.example.com")',
      alphaText    : '鞓侂, 氚戬(_)毵?鞛呺牓顷?靾?鞛堨姷雼堧嫟.',
      alphanumText : '鞓侂, 靾瀽, 氚戬(_)毵?鞛呺牓顷?靾?鞛堨姷雼堧嫟.'
   });
}

if(Ext.form.HtmlEditor){
   Ext.apply(Ext.form.HtmlEditor.prototype, {
   createLinkText : 'URL鞚?鞛呺牓顷挫＜靹胳殧:',
   buttonTips : {
            bold : {
               title: '甑店矊 (Ctrl+B)',
               text: '靹犿儩顷?韰嶌姢韸鸽ゼ 甑店矊 响涤嫓顷╇媹雼?',
               cls: 'x-html-editor-tip'
            },
            italic : {
               title: '旮办毟鞛劢即 (Ctrl+I)',
               text: '靹犿儩顷?韰嶌姢韸鸽ゼ 旮办毟鞛劢即搿?响涤嫓顷╇媹雼?',
               cls: 'x-html-editor-tip'
            },
            underline : {
               title: '氚戬 (Ctrl+U)',
               text: '靹犿儩顷?韰嶌姢韸胳棎 氚戬鞚?响涤嫓顷╇媹雼?',
               cls: 'x-html-editor-tip'
           },
           increasefontsize : {
               title: '旮€昙错伂旮?电橂',
               text: '旮€昙?韥赴毳?韥矊 顷╇媹雼?',
               cls: 'x-html-editor-tip'
           },
           decreasefontsize : {
               title: '旮€昙错伂旮?欷勳瀯',
               text: '旮€昙?韥赴毳?鞛戗矊 顷╇媹雼?',
               cls: 'x-html-editor-tip'
           },
           backcolor : {
               title: '韰嶌姢韸?臧曥“ 靸?,
               text: '靹犿儩顷?韰嶌姢韸胳潣 氚瓣步靸夓潉 氤€瓴巾暕雼堧嫟.',
               cls: 'x-html-editor-tip'
           },
           forecolor : {
               title: '旮€昙挫俦',
               text: '靹犿儩顷?韰嶌姢韸胳潣 靸夓潉 氤€瓴巾暕雼堧嫟.',
               cls: 'x-html-editor-tip'
           },
           justifyleft : {
               title: '韰嶌姢韸?鞕检 毵烄钉',
               text: '鞕检鞐?韰嶌姢韸鸽ゼ 毵烄顶雼堧嫟.',
               cls: 'x-html-editor-tip'
           },
           justifycenter : {
               title: '臧€鞖措嵃 毵烄钉',
               text: '臧€鞖措嵃鞐?韰嶌姢韸鸽ゼ 毵烄顶雼堧嫟.',
               cls: 'x-html-editor-tip'
           },
           justifyright : {
               title: '韰嶌姢韸?鞓るジ飒?毵烄钉',
               text: '鞓るジ飒届棎 韰嶌姢韸鸽ゼ 毵烄顶雼堧嫟.',
               cls: 'x-html-editor-tip'
           },
           insertunorderedlist : {
               title: '旮€毹鸽Μ 旮绊樃',
               text: '旮€毹鸽Μ 旮绊樃 氇╇鞚?鞁涤澜顷╇媹雼?',
               cls: 'x-html-editor-tip'
           },
           insertorderedlist : {
               title: '氩堩樃 毵り赴旮?,
               text: '氩堩樃 毵り赴旮?氇╇鞚?鞁涤澜顷╇媹雼?',
               cls: 'x-html-editor-tip'
           },
           createlink : {
               title: '顷橃澊韵茧韥?,
               text: '靹犿儩顷?韰嶌姢韸胳棎 顷橃澊韵茧韥ゼ 毵岆摥雼堧嫟.',
               cls: 'x-html-editor-tip'
           },
           sourceedit : {
               title: '靻岇姢韼胳',
               text: '靻岇姢韼胳 氇摐搿?氤€顸橅暕雼堧嫟.',
               cls: 'x-html-editor-tip'
           }
        }
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "鞓る彀垳 鞝曤牞",
      sortDescText : "雮措彀垳 鞝曤牞",
      lockText     : "旃茧熂 鞛犼笀",
      unlockText   : "旃茧熂 鞛犼笀顷挫牅",
      columnsText  : "旃茧熂 氇╇"
   });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(None)',
    groupByText    : '顺勳灛 顷勲摐搿?攴鸽９顷戫暕雼堧嫟.',
    showGroupsText : '攴鸽９鞙茧 氤挫棳欤缄赴'

  });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "顷",
      valueText  : "臧?,
      dateFormat : "m/j/Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "韥赴氤€瓴届潉 鞙勴暣 霌滊灅攴疙晿靹胳殧.",
      collapsibleSplitTip : "韥赴氤€瓴届潉 鞙勴暣 霌滊灅攴? 靾赴旮?鞙勴暣 雿旊笖韥措Ν 顷橃劯鞖?"
   });
}

