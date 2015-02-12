/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
锘?**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 */

/**
 * Vietnamese translation
 * By bpmtri
 * 12-April-2007 04:06PM
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">膼ang t岷...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} d貌ng 胆瓢峄 ch峄峮";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "膼贸ng th岷?n脿y";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Gi谩 tr峄?c峄 么 n脿y kh么ng h峄 l峄?";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "膼ang t岷...";
}

Date.monthNames = [
   "Th谩ng 1",
   "Th谩ng 2",
   "Th谩ng 3",
   "Th谩ng 4",
   "Th谩ng 5",
   "Th谩ng 6",
   "Th谩ng 7",
   "Th谩ng 8",
   "Th谩ng 9",
   "Th谩ng 10",
   "Th谩ng 11",
   "Th谩ng 12"
];

Date.dayNames = [
   "Ch峄?nh岷玺",
   "Th峄?hai",
   "Th峄?ba",
   "Th峄?t瓢",
   "Th峄?n膬m",
   "Th峄?s谩u",
   "Th峄?b岷"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "膼峄搉g 媒",
      cancel : "H峄 b峄?,
      yes    : "C贸",
      no     : "Kh么ng"
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
      todayText         : "H么m nay",
      minText           : "Ng脿y n脿y nh峄?h啤n ng脿y nh峄?nh岷",
      maxText           : "Ng脿y n脿y l峄沶 h啤n ng脿y l峄沶 nh岷",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : 'Th谩ng sau (Control+Right)',
      prevText          : 'Th谩ng tr瓢峄沜 (Control+Left)',
      monthYearText     : 'Ch峄峮 m峄檛 th谩ng (Control+Up/Down 胆峄?thay 胆峄昳 n膬m)',
      todayTip          : "{0} (Spacebar - Ph铆m tr岷痭g)",
      format            : "d/m/y"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Trang",
      afterPageText  : "of {0}",
      firstText      : "Trang 胆岷",
      prevText       : "Trang tr瓢峄沜",
      nextText       : "Trang sau",
      lastText       : "Trang cu峄慽",
      refreshText    : "T岷 l岷",
      displayMsg     : "Hi峄僴 th峄?{0} - {1} c峄 {2}",
      emptyMsg       : 'Kh么ng c贸 d峄?li峄嘘 胆峄?hi峄僴 th峄?
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Chi峄乽 d脿i t峄慽 thi峄僽 c峄 么 n脿y l脿 {0}",
      maxLengthText : "Chi峄乽 d脿i t峄慽 胆a c峄 么 n脿y l脿 {0}",
      blankText     : "脭 n脿y c岷 ph岷 nh岷璸 gi谩 tr峄?,
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Gi谩 tr峄?nh峄?nh岷 c峄 么 n脿y l脿 {0}",
      maxText : "Gi谩 tr峄?l峄沶 nh岷 c峄 么 n脿y l脿  {0}",
      nanText : "{0} h么ng ph岷 l脿 m峄檛 s峄?h峄 l峄?
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "V么 hi峄嘘",
      disabledDatesText : "V么 hi峄嘘",
      minText           : "Ng脿y nh岷璸 trong 么 n脿y ph岷 sau ng脿y {0}",
      maxText           : "Ng脿y nh岷璸 trong 么 n脿y ph岷 tr瓢峄沜 ng脿y {0}",
      invalidText       : "{0} kh么ng ph岷 l脿 m峄檛 ng脿y h峄 l峄?- ph岷 c贸 d岷g {1}",
      format            : "d/m/y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "膼ang t岷...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Gi谩 tr峄?c峄 么 n脿y ph岷 l脿 m峄檛 胆峄媋 ch峄?email c贸 d岷g nh瓢 "ten@abc.com"',
      urlText      : 'Gi谩 tr峄?c峄 么 n脿y ph岷 l脿 m峄檛 胆峄媋 ch峄?web(URL) h峄 l峄? c贸 d岷g nh瓢 "http:/'+'/www.example.com"',
      alphaText    : '脭 n脿y ch峄?胆瓢峄 nh岷璸 c谩c k铆 t峄?v脿 g岷h d瓢峄沬(_)',
      alphanumText : '脭 n脿y ch峄?胆瓢峄 nh岷璸 c谩c k铆 t峄? s峄?v脿 g岷h d瓢峄沬(_)'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "T膬ng d岷",
      sortDescText : "Gi岷 d岷",
      lockText     : "Kh贸a c峄檛",
      unlockText   : "B峄?kh贸a c峄檛",
      columnsText  : "C谩c c峄檛"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "T锚n",
      valueText  : "Gi谩 tr峄?,
      dateFormat : "j/m/Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "K茅o gi峄?chu峄檛 胆峄?thay 胆峄昳 k铆ch th瓢峄沜.",
      collapsibleSplitTip : "K茅o gi峄?chu峄檛 胆峄?thay 胆峄昳 k铆ch th瓢峄沜. Nh岷 胆煤p 胆峄?岷﹏ 胆i."
   });
}
