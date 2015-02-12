/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Swedish translation (utf8-encoding)
 * By Erik Andersson, Monator Technologies
 * 24 April 2007
 * Changed by Cariad, 29 July 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Laddar...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} markerade rad(er)";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "St盲ng denna flik";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "V盲rdet i detta f盲lt 盲r inte till氓tet";
}

if(Ext.LoadMask){
   Ext.LoadMask.prototype.msg = "Laddar...";
}

Date.monthNames = [
   "januari",
   "februari",
   "mars",
   "april",
   "maj",
   "juni",
   "juli",
   "augusti",
   "september",
   "oktober",
   "november",
   "december"
];

Date.dayNames = [
   "s枚ndag",
   "m氓ndag",
   "tisdag",
   "onsdag",
   "torsdag",
   "fredag",
   "l枚rdag"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Avbryt",
      yes    : "Ja",
      no     : "Nej"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "Y-m-d");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "Idag",
      minText           : "Detta datum intr盲ffar f枚re det tidigast till氓tna",
      maxText           : "Detta datum intr盲ffar efter det senast till氓tna",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : 'N盲sta m氓nad (Ctrl + h枚gerpil)',
      prevText          : 'F枚reg氓ende m氓nad (Ctrl + v盲nsterpil)',
      monthYearText     : 'V盲lj en m氓nad (Ctrl + upp氓tpil/ner氓tpil f枚r att 盲ndra 氓rtal)',
      todayTip          : "{0} (mellanslag)",
      format            : "Y-m-d",
      startDay          : 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Sida",
      afterPageText  : "av {0}",
      firstText      : "F枚rsta sidan",
      prevText       : "F枚reg氓ende sida",
      nextText       : "N盲sta sida",
      lastText       : "Sista sidan",
      refreshText    : "Uppdatera",
      displayMsg     : "Visar {0} - {1} av {2}",
      emptyMsg       : 'Det finns ingen data att visa'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Minsta till氓tna l盲ngd f枚r detta f盲lt 盲r {0}",
      maxLengthText : "St枚rsta till氓tna l盲ngd f枚r detta f盲lt 盲r {0}",
      blankText     : "Detta f盲lt 盲r obligatoriskt",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Minsta till氓tna v盲rde f枚r detta f盲lt 盲r {0}",
      maxText : "St枚rsta till氓tna v盲rde f枚r detta f盲lt 盲r {0}",
      nanText : "{0} 盲r inte ett till氓tet nummer"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Inaktiverad",
      disabledDatesText : "Inaktiverad",
      minText           : "Datumet i detta f盲lt m氓ste intr盲ffa efter {0}",
      maxText           : "Datumet i detta f盲lt m氓ste intr盲ffa f枚re {0}",
      invalidText       : "{0} 盲r inte ett till氓tet datum - datum ska anges i formatet {1}",
      format            : "Y-m-d",
      startDay          : 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Laddar...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Detta f盲lt ska inneh氓lla en e-post adress i formatet "anv盲ndare@dom盲n.se"',
      urlText      : 'Detta f盲lt ska inneh氓lla en l盲nk (URL) i formatet "http:/'+'/www.dom盲n.se"',
      alphaText    : 'Detta f盲lt f氓r bara inneh氓lla bokst盲ver och "_"',
      alphanumText : 'Detta f盲lt f氓r bara inneh氓lla bokst盲ver, nummer och "_"'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Sortera stigande",
      sortDescText : "Sortera fallande",
      lockText     : "L氓s kolumn",
      unlockText   : "L氓s upp kolumn",
      columnsText  : "Kolumner"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Namn",
      valueText  : "V盲rde",
      dateFormat : "Y-m-d"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Dra f枚r att 盲ndra storleken.",
      collapsibleSplitTip : "Dra f枚r att 盲ndra storleken. Dubbelklicka f枚r att g枚mma."
   });
}
