/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Latvian Translations
 * By salix 17 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Notiek iel腻de...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} iez墨m脓tu rindu";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Aizver 拧o z墨mni";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "V脓rt墨ba 拧aj腻 lauk腻 nav pareiza";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "Iel腻d脓...";
}

Date.monthNames = [
   "Janv腻ris",
   "Febru腻ris",
   "Marts",
   "Apr墨lis",
   "Maijs",
   "J奴nijs",
   "J奴lijs",
   "Augusts",
   "Septembris",
   "Oktobris",
   "Novembris",
   "Decembris"
];

Date.dayNames = [
   "Sv脓tdiena",
   "Pirmdiena",
   "Otrdiena",
   "Tre拧diena",
   "Ceturtdiena",
   "Piektdiena",
   "Sestdiena"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "Labi",
      cancel : "Atcelt",
      yes    : "J腻",
      no     : "N脓"
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
      todayText         : "艩odiena",
      minText           : "Nor腻d墨tais datums ir maz腻ks par minim腻lo datumu",
      maxText           : "Nor腻d墨tais datums ir liel腻ks par maksim腻lo datumu",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : 'N腻kamais m脓nesis (Control+pa labi)',
      prevText          : 'Iepriek拧脓jais m脓nesis (Control+pa kreisi)',
      monthYearText     : 'M脓ne拧a izv脓le (Control+uz aug拧u/uz leju lai p腻rsl脓gtu gadus)',
      todayTip          : "{0} (Tuk拧umz墨me)",
      format            : "d.m.Y",
      startDay          : 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Lapa",
      afterPageText  : "no {0}",
      firstText      : "Pirm腻 lapa",
      prevText       : "iepriek拧脓j腻 lapa",
      nextText       : "N腻kam腻 lapa",
      lastText       : "P脓d脓j腻 lapa",
      refreshText    : "Atsvaidzin腻t",
      displayMsg     : "R腻da no {0} l墨dz {1} ierakstiem, kop腻 {2}",
      emptyMsg       : 'Nav datu, ko par腻d墨t'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Minim腻lais garums 拧im laukam ir {0}",
      maxLengthText : "Maksim腻lais garums 拧im laukam ir {0}",
      blankText     : "艩is ir oblig腻ts lauks",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Minim腻lais garums 拧im laukam ir  {0}",
      maxText : "Maksim腻lais garums 拧im laukam ir  {0}",
      nanText : "{0} nav pareizs skaitlis"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Atsp脓jots",
      disabledDatesText : "Atsp脓jots",
      minText           : "Datumam 拧aj腻 lauk腻 j腻b奴t liel腻kam k腻 {0}",
      maxText           : "Datumam 拧aj腻 lauk腻 j腻b奴t maz腻kam k腻 {0}",
      invalidText       : "{0} nav pareizs datums - tam j腻b奴t 拧腻d腻 form腻t腻: {1}",
      format            : "d.m.Y",
      startDay          : 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Iel腻d脓...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '艩aj腻 lauk腻 j腻ieraksta e-pasta adrese form腻t腻 "lietot腻s@dom脓ns.lv"',
      urlText      : '艩aj腻 lauk腻 j腻ieraksta URL form腻t腻 "http:/'+'/www.dom脓ns.lv"',
      alphaText    : '艩is lauks dr墨kst satur脓t tikai burtus un _ z墨mi',
      alphanumText : '艩is lauks dr墨kst satur脓t tikai burtus, ciparus un _ z墨mi'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "K腻rtot pieaugo拧腻 sec墨b腻",
      sortDescText : "K腻rtot dilsto拧腻 sec墨b腻",
      lockText     : "Nosl脓gt kolonnu",
      unlockText   : "Atsl脓gt kolonnu",
      columnsText  : "Kolonnas"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Nosaukums",
      valueText  : "V脓rt墨ba",
      dateFormat : "j.m.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Velc, lai main墨tu izm脓ru.",
      collapsibleSplitTip : "Velc, lai main墨tu izm脓ru. Dubultklik拧姆is nosl脓pj apgabalu."
   });
}
