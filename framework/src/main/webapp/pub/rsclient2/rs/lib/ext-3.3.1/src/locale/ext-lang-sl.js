/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Slovenian translation by Matja啪 (UTF-8 encoding)
 * 25 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Nalagam...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} izbranih vrstic";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zapri zavihek";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Neveljavna vrednost";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "Nalagam...";
}

Date.monthNames = [
   "Januar",
   "Februar",
   "Marec",
   "April",
   "Maj",
   "Junij",
   "Julij",
   "Avgust",
   "September",
   "Oktober",
   "November",
   "December"
];

Date.dayNames = [
   "Nedelja",
   "Ponedeljek",
   "Torek",
   "Sreda",
   "膶etrtek",
   "Petek",
   "Sobota"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "V redu",
      cancel : "Prekli膷i",
      yes    : "Da",
      no     : "Ne"
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
      todayText         : "Danes",
      minText           : "Navedeni datum je pred spodnjim datumom",
      maxText           : "Navedeni datum je za zgornjim datumom",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : 'Naslednji mesec (Control+Desno)',
      prevText          : 'Prej拧nji mesec (Control+Levo)',
      monthYearText     : 'Izberite mesec (Control+Gor/Dol za premik let)',
      todayTip          : "{0} (Preslednica)",
      format            : "d.m.y",
      startDay          : 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Stran",
      afterPageText  : "od {0}",
      firstText      : "Prva stran",
      prevText       : "Prej拧nja stran",
      nextText       : "Naslednja stran",
      lastText       : "Zadnja stran",
      refreshText    : "Osve啪i",
      displayMsg     : "Prikazujem {0} - {1} od {2}",
      emptyMsg       : 'Ni podatkov za prikaz'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Minimalna dol啪ina tega polja je {0}",
      maxLengthText : "Maksimalna dol啪ina tega polja je {0}",
      blankText     : "To polje je obvezno",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Minimalna vrednost tega polja je {0}",
      maxText : "Maksimalna vrednost tega polja je {0}",
      nanText : "{0} ni veljavna 拧tevilka"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Onemogo膷en",
      disabledDatesText : "Onemogo膷en",
      minText           : "Datum mora biti po {0}",
      maxText           : "Datum mora biti pred {0}",
      invalidText       : "{0} ni veljaven datum - mora biti v tem formatu {1}",
      format            : "d.m.y",
      startDay          : 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Nalagam...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'To polje je e-mail naslov formata "ime@domena.si"',
      urlText      : 'To polje je URL naslov formata "http:/'+'/www.domena.si"',
      alphaText    : 'To polje lahko vsebuje samo 膷rke in _',
      alphanumText : 'To polje lahko vsebuje samo 膷rke, 拧tevilke in _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Sortiraj nara拧膷ajo膷e",
      sortDescText : "Sortiraj padajo膷e",
      lockText     : "Zakleni stolpec",
      unlockText   : "Odkleni stolpec",
      columnsText  : "Stolpci"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Ime",
      valueText  : "Vrednost",
      dateFormat : "j.m.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Potegni za raz拧iritev.",
      collapsibleSplitTip : "Potegni za raz拧iritev. Dvojni klik, 膷e 啪elite skriti."
   });
}
