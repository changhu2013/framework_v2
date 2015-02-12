/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Croatian translation
 * By Ylodi (utf8 encoding)
 * 8 May 2007
 *
 * By Stjepan at gmail dot com (utf8 encoding)
 * 17 May 2008
 */
 
Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">U膷itavanje...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} odabranih redova";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zatvori ovaj tab";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Unesena vrijednost u ovom polju je neispravna";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "U膷itavanje...";
}

Date.monthNames = [
   "Sije膷anj",
   "Velja膷a",
   "O啪ujak",
   "Travanj",
   "Svibanj",
   "Lipanj",
   "Srpanj",
   "Kolovoz",
   "Rujan",
   "Listopad",
   "Studeni",
   "Prosinac"
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
   "Nedjelja",
   "Ponedjeljak",
   "Utorak",
   "Srijeda",
   "膶etvrtak",
   "Petak",
   "Subota"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

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
      minText           : "Taj datum je prije najmanjeg datuma",
      maxText           : "Taj datum je poslije najve膰eg datuma",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : 'Slijede膰i mjesec (Control+Desno)',
      prevText          : 'Prethodni mjesec (Control+Lijevo)',
      monthYearText     : 'Odaberite mjesec (Control+Gore/Dolje za promjenu godine)',
      todayTip          : "{0} (Razmaknica)",
      format            : "d.m.y",
      okText            : "&#160;U redu&#160;",
      cancelText        : "Odustani",      
      startDay 		: 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Stranica",
      afterPageText  : "od {0}",
      firstText      : "Prva stranica",
      prevText       : "Prethodna stranica",
      nextText       : "Slijede膰a stranica",
      lastText       : "Posljednja stranica",
      refreshText    : "Obnovi",
      displayMsg     : "Prikazujem {0} - {1} od {2}",
      emptyMsg       : 'Nema podataka za prikaz'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Minimalna du啪ina za ovo polje je {0}",
      maxLengthText : "Maksimalna du啪ina za ovo polje je {0}",
      blankText     : "Ovo polje je obavezno",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Minimalna vrijednost za ovo polje je {0}",
      maxText : "Maksimalna vrijednost za ovo polje je {0}",
      nanText : "{0} nije ispravan broj"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Neaktivno",
      disabledDatesText : "Neaktivno",
      minText           : "Datum u ovom polje mora biti poslije {0}",
      maxText           : "Datum u ovom polju mora biti prije {0}",
      invalidText       : "{0} nije ispravan datum - mora biti u obliku {1}",
      format            : "d.m.y",
      startDay 		: 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "U膷itavanje...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Ovdje mo啪ete unijeti samo e-mail adresu u obliku "korisnik@domena.com"',
      urlText      : 'Ovdje mo啪ete unijeti samo URL u obliku "http:/'+'/www.domena.com"',
      alphaText    : 'Ovo polje mo啪e sadr啪avati samo slova i znak _',
      alphanumText : 'Ovo polje mo啪e sadr啪avati samo slova, brojeve i znak _'
   });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Unesite URL za link:',
    buttonTips : {
      bold : {
        title: 'Podebljano (Ctrl+B)',
        text: 'Podebljavanje ozna膷enog teksta.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Kurziv (Ctrl+I)',
        text: 'Pretvaranje ozna膷enog tekst u kurziv',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Podcrtano (Ctrl+U)',
        text: 'Potcrtavanje ozna膷enog teksta',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Pove膰anje teksta',
        text: 'Pove膰avanje veli膷ine fonta.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Smanjivanje teksta',
        text: 'Smanjivanje veli膷ine fonta.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Boja ozna膷enog teksta',
        text: 'Promjena boje pozadine ozna膷enog teksta.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Boja fonta',
        text: 'Promjena boje ozna膷enog teksta.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Lijevo poravnanje teksta',
        text: 'Poravnanje teksta na lijevu stranu.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Centriranje teksta',
        text: 'Centriranje teksta u ure胆iva膷u teksta.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Desno poravnanje teksta',
        text: 'Poravnanje teksta na desnu stranu.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Ozna膷ena lista',
        text: 'Zapo膷injanje ozna膷ene liste.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Numerirana lista',
        text: 'Zapo膷injanje numerirane liste.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Hiperveza',
        text: 'Stvaranje hiperveze od ozna膷enog teksta.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Ure胆ivanje izvornog koda',
        text: 'Prebacivanje u na膷in rada za ure胆ivanje izvornog koda.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Sortiraj rastu膰im redoslijedom",
      sortDescText : "Sortiraj padaju膰im redoslijedom",
      lockText     : "Zaklju膷aj stupac",
      unlockText   : "Otklju膷aj stupac",
      columnsText  : "Stupci"
   });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(Ni拧ta)',
    groupByText    : 'Grupiranje po ovom polju',
    showGroupsText : 'Prikaz u grupama'
  });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Naziv",
      valueText  : "Vrijednost",
      dateFormat : "d.m.Y"
   });
}

if(Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Povuci za promjenu veli膷ine.",
      collapsibleSplitTip : "Povuci za promjenu veli膷ine. Dvostruki klik za skrivanje."
   });
}
