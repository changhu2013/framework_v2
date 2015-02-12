/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Serbian Latin Translation
 * by Atila Hajnal (latin, utf8 encoding)
 * sr
 * 14 Sep 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">U膷itavam...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "Ne postoji ni jedan slog";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} izabranih redova";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zatvori 芯vu 禄karticu芦";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Une拧ena vrednost nije pravilna";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "U膷itavam...";
}

Date.monthNames = [
   "Januar",
   "Februar",
   "Mart",
   "April",
   "袦邪褬",
   "Jun",
   "袌ul",
   "Avgust",
   "Septembar",
   "Oktobar",
   "Novembar",
   "Decembar"
];

Date.dayNames = [
   "Nedelja",
   "Ponedeljak",
   "Utorak",
   "Sreda",
   "膶etvrtak",
   "Petak",
   "Subota"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "U redu",
      cancel : "Odustani",
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
      todayText         : "Danas",
      minText           : "Datum 褬械 ispred najmanjeg dozvoljenog datuma",
      maxText           : "Datum 褬械 nakon najve膰eg dozvoljenog datuma",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : 'Slede膰i mesec (Control+Desno)',
      prevText          : 'Prethodni mesec (Control+Levo)',
      monthYearText     : 'Izaberite mesec (Control+Gore/Dole za izbor godine)',
      todayTip          : "{0} (Razmaknica)",
      format            : "d.m.y",
      startDay 		: 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Strana",
      afterPageText  : "od {0}",
      firstText      : "Prva strana",
      prevText       : "Prethodna strana",
      nextText       : "Slede膰a strana",
      lastText       : "Poslednja strana",
      refreshText    : "Osve啪i",
      displayMsg     : "Prikazana {0} - {1} od {2}",
      emptyMsg       : 'Nemam 拧ta prikazati'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Minimalna du啪ina ovog polja 褬械 {0}",
      maxLengthText : "Maksimalna du啪ina ovog polja 褬械 {0}",
      blankText     : "Polje 褬械 obavezno",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Minimalna vrednost u polju 褬械 {0}",
      maxText : "Maksimalna vrednost u polju 褬械 {0}",
      nanText : "{0} nije pravilan broj"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Pasivno",
      disabledDatesText : "Pasivno",
      minText           : "Datum u ovom polju mora biti nakon {0}",
      maxText           : "Datum u ovom polju mora biti pre {0}",
      invalidText       : "{0} nije pravilan datum - zahtevani oblik je {1}",
      format            : "d.m.y",
      altFormats        : "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d",
      startDay 		: 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "U膷itavam...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Ovo polje prihavata e-mail adresu isklju膷ivo u obliku "korisnik@domen.com"',
      urlText      : 'Ovo polje prihavata URL adresu isklju膷ivo u obliku "http:/'+'/www.domen.com"',
      alphaText    : 'Ovo polje mo啪e sadr啪ati isklju膷ivo slova i znak _',
      alphanumText : 'Ovo polje mo啪e sadr啪ati 褋邪屑芯 slova, brojeve i znak _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Rastu膰i redosled",
      sortDescText : "Opadaju膰i redosled",
      lockText     : "Zaklju膷aj kolonu",
      unlockText   : "Otklju膷aj kolonu",
      columnsText  : "Kolone"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Naziv",
      valueText  : "Vrednost",
      dateFormat : "d.m.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Povu膰i za izmenu veli膷ine.",
      collapsibleSplitTip : "Povu膰i za izmenu veli膷ine. Dvostruku klik za sakrivanje."
   });
}
