/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Greek (Old Version) Translations by Vagelis
 * 03-June-2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">脰眉帽么霉贸莽...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} 氓冒茅毛氓茫矛脻铆莽(氓貌) 茫帽谩矛矛脼(脻貌)";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "脢毛氓脽贸么氓 谩玫么脼 么莽铆 锚谩帽么脻毛谩";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "脟 么茅矛脼 贸么茂 冒氓盲脽茂 盲氓铆 氓脽铆谩茅 脻茫锚玫帽莽";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "脰眉帽么霉贸莽...";
}

Date.monthNames = [
   "脡谩铆茂玫脺帽茅茂貌",
   "脰氓芒帽茂玫脺帽茅茂貌",
   "脤脺帽么茅茂貌",
   "脕冒帽脽毛茅茂貌",
   "脤脺茅茂貌",
   "脡茂媒铆茅茂貌",
   "脡茂媒毛茅茂貌",
   "脕媒茫茂玫贸么茂貌",
   "脱氓冒么脻矛芒帽茅茂貌",
   "睃锚么镁芒帽茅茂貌",
   "脥茂脻矛芒帽茅茂貌",
   "胫氓锚脻矛芒帽茅茂貌"
];

Date.dayNames = [
   "脢玫帽茅谩锚脼",
   "胫氓玫么脻帽谩",
   "脭帽脽么莽",
   "脭氓么脺帽么莽",
   "脨脻矛冒么莽",
   "脨谩帽谩贸锚氓玫脼",
   "脱脺芒芒谩么茂"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "脜铆么脺卯氓茅",
      cancel : "脕锚媒帽霉贸莽",
      yes    : "脥谩茅",
      no     : "录梅茅"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "矛/莽/脜");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "脱脼矛氓帽谩",
      minText           : "脟 莽矛氓帽茂矛莽铆脽谩 谩玫么脼 氓脽铆谩茅 冒帽茅铆 么莽铆 矛茅锚帽眉么氓帽莽 莽矛氓帽茂矛莽铆脽谩",
      maxText           : "脟 莽矛氓帽茂矛莽铆脽谩 谩玫么脼 氓脽铆谩茅 矛氓么脺 么莽铆 矛氓茫谩毛媒么氓帽莽 莽矛氓帽茂矛莽铆脽谩",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : '脜冒眉矛氓铆茂貌 脤脼铆谩貌 (Control+Right)',
      prevText          : '脨帽茂莽茫茂媒矛氓铆茂貌 脤脼铆谩貌 (Control+Left)',
      monthYearText     : '脜冒茅毛脻卯么氓 脤脼铆谩 (Control+Up/Down 茫茅谩 矛氓么谩锚脽铆莽贸莽 贸么谩 脻么莽)',
      todayTip          : "{0} (Spacebar)",
      format            : "矛/莽/脜"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "脱氓毛脽盲谩",
      afterPageText  : "谩冒眉 {0}",
      firstText      : "脨帽镁么莽 贸氓毛脽盲谩",
      prevText       : "脨帽茂莽茫茂媒矛氓铆莽 贸氓毛脽盲谩",
      nextText       : "脜冒眉矛氓铆莽 贸氓毛脽盲谩",
      lastText       : "脭氓毛氓玫么谩脽谩 贸氓毛脽盲谩",
      refreshText    : "脕铆谩铆脻霉贸莽",
      displayMsg     : "脜矛枚脺铆茅贸莽 {0} - {1} 谩冒眉 {2}",
      emptyMsg       : '胫氓铆 芒帽脻猫莽锚谩铆 氓茫茫帽谩枚脻貌 茫茅谩 氓矛枚脺铆茅贸莽'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "脭茂 氓毛脺梅茅贸么茂 矛脻茫氓猫茂貌 茫茅谩 谩玫么眉 么茂 冒氓盲脽茂 氓脽铆谩茅 {0}",
      maxLengthText : "脭茂 矛脻茫茅贸么茂 矛脻茫氓猫茂貌 茫茅谩 谩玫么眉 么茂 冒氓盲脽茂 氓脽铆谩茅 {0}",
      blankText     : "脭茂 冒氓盲脽茂 谩玫么眉 氓脽铆谩茅 玫冒茂梅帽氓霉么茂锚眉",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "脟 氓毛脺梅茅贸么莽 么茅矛脼 茫茅谩 谩玫么眉 么茂 冒氓盲脽茂 氓脽铆谩茅 {0}",
      maxText : "脟 矛脻茫茅贸么莽 么茅矛脼 茫茅谩 谩玫么眉 么茂 冒氓盲脽茂 氓脽铆谩茅 {0}",
      nanText : "{0} 盲氓铆 氓脽铆谩茅 脻茫锚玫帽茂貌 谩帽茅猫矛眉貌"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "脕冒氓铆氓帽茫茂冒茂茅莽矛脻铆茂",
      disabledDatesText : "脕冒氓铆氓帽茫茂冒茂茅莽矛脻铆茂",
      minText           : "脟 莽矛氓帽茂矛莽铆脽谩 贸' 谩玫么眉 么茂 冒氓盲脽茂 冒帽脻冒氓茅 铆谩 氓脽铆谩茅 矛氓么脺 谩冒眉 {0}",
      maxText           : "脟 莽矛氓帽茂矛莽铆脽谩 贸' 谩玫么眉 么茂 冒氓盲脽茂 冒帽脻冒氓茅 铆谩 氓脽铆谩茅 冒帽茅铆 谩冒眉 {0}",
      invalidText       : "{0} 盲氓铆 氓脽铆谩茅 脻茫锚玫帽莽 莽矛氓帽茂矛莽铆脽谩 - 冒帽脻冒氓茅 铆谩 氓脽铆谩茅 么莽貌 矛茂帽枚脼貌 {1}",
      format            : "矛/莽/脜"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "脰眉帽么霉贸莽...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '脕玫么眉 么茂 冒氓盲脽茂 冒帽脻冒氓茅 铆谩 氓脽铆谩茅 e-mail address 么莽貌 矛茂帽枚脼貌 "user@example.com"',
      urlText      : '脕玫么眉 么茂 冒氓盲脽茂 冒帽脻冒氓茅 铆谩 氓脽铆谩茅 矛茅谩 盲茅氓媒猫玫铆贸莽 URL 么莽貌 矛茂帽枚脼貌 "http:/'+'/www.example.com"',
      alphaText    : '脕玫么眉 么茂 冒氓盲脽茂 冒帽脻冒氓茅 铆谩 冒氓帽茅脻梅氓茅 茫帽脺矛矛谩么谩 锚谩茅 _',
      alphanumText : '脕玫么眉 么茂 冒氓盲脽茂 冒帽脻冒氓茅 铆谩 冒氓帽茅脻梅氓茅 茫帽脺矛矛谩么谩, 谩帽茅猫矛茂媒貌 锚谩茅 _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "脕媒卯茂玫贸谩 脭谩卯茅铆眉矛莽贸莽",
      sortDescText : "脰猫脽铆茂玫贸谩 脭谩卯茅铆眉矛莽贸莽",
      lockText     : "脢毛氓脽盲霉矛谩 贸么脼毛莽貌",
      unlockText   : "脦氓锚毛氓脽盲霉矛谩 贸么脼毛莽貌",
      columnsText  : "脱么脼毛氓貌"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "录铆茂矛谩",
      valueText  : "脭茅矛脼",
      dateFormat : "矛/莽/脜"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "脱媒帽氓么氓 茫茅谩 谩毛毛谩茫脼 矛氓茫脻猫茂玫貌.",
      collapsibleSplitTip : "脱媒帽氓么氓 茫茅谩 谩毛毛谩茫脼 矛氓茫脻猫茂玫貌. Double click 茫茅谩 谩冒眉锚帽玫酶莽."
   });
}
