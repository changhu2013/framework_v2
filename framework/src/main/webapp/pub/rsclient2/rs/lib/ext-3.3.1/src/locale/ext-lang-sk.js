/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 */
 
 /*  Slovak Translation by Michal Thomka
  *  14 April 2007
  */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Nahr谩vam...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} ozna膷en媒ch riadkov";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zavrie钮 t煤to z谩lo啪ku";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Hodnota v tomto poli je nespr谩vna";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "Nahr谩vam...";
}

Date.monthNames = [
   "Janu谩r",
   "Febru谩r",
   "Marec",
   "Apr铆l",
   "M谩j",
   "J煤n",
   "J煤l",
   "August",
   "September",
   "Okt贸ber",
   "November",
   "December"
];

Date.dayNames = [
   "Nede木a",
   "Pondelok",
   "Utorok",
   "Streda",
   "艩tvrtok",
   "Piatok",
   "Sobota"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Zru拧i钮",
      yes    : "脕no",
      no     : "Nie"
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
      todayText         : "Dnes",
      minText           : "Tento d谩tum je men拧铆 ako minim谩lny mo啪n媒 d谩tum",
      maxText           : "Tento d谩tum je v盲膷拧铆 ako maxim谩lny mo啪n媒 d谩tum",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : '膸al拧铆 Mesiac (Control+Doprava)',
      prevText          : 'Predch. Mesiac (Control+Do木ava)',
      monthYearText     : 'Vyberte Mesiac (Control+Hore/Dole pre posun rokov)',
      todayTip          : "{0} (Medzern铆k)",
      format            : "d.m.Y"
   });
}


if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Strana",
      afterPageText  : "z {0}",
      firstText      : "Prv谩 Strana",
      prevText       : "Predch. Strana",
      nextText       : "膸al拧ia Strana",
      lastText       : "Posledn谩 strana",
      refreshText    : "Obnovi钮",
      displayMsg     : "Zobrazujem {0} - {1} z {2}",
      emptyMsg       : '聨iadne d谩ta'
   });
}


if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Minim谩lna d暮啪ka pre toto pole je {0}",
      maxLengthText : "Maxim谩lna d暮啪ka pre toto pole je {0}",
      blankText     : "Toto pole je povinn茅",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Minim谩lna hodnota pre toto pole je {0}",
      maxText : "Maxim谩lna hodnota pre toto pole je {0}",
      nanText : "{0} je nespr谩vne 膷铆slo"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Zablokovan茅",
      disabledDatesText : "Zablokovan茅",
      minText           : "D谩tum v tomto poli mus铆 by钮 a啪 po {0}",
      maxText           : "D谩tum v tomto poli mus铆 by钮 pred {0}",
      invalidText       : "{0} nie je spr谩vny d谩tum - mus铆 by钮 vo form谩te {1}",
      format            : "d.m.Y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Nahr谩vam...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Toto pole mus铆 by钮 e-mailov谩 adresa vo form谩te "user@example.com"',
      urlText      : 'Toto pole mus铆 by钮 URL vo form谩te "http:/'+'/www.example.com"',
      alphaText    : 'Toto pole mo啪e obsahova钮 iba p铆smen谩 a znak _',
      alphanumText : 'Toto pole mo啪e obsahova钮 iba p铆smen谩, 膷铆sla a znak _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Zoradi钮 vzostupne",
      sortDescText : "Zoradi钮 zostupne",
      lockText     : "Zamkn煤钮 st木pec",
      unlockText   : "Odomkn煤钮 st木pec",
      columnsText  : "St木pce"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "N谩zov",
      valueText  : "Hodnota",
      dateFormat : "d.m.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Potiahnite pre zmenu rozmeru",
      collapsibleSplitTip : "Potiahnite pre zmenu rozmeru. Dvojklikom schov谩te."
   });
}
