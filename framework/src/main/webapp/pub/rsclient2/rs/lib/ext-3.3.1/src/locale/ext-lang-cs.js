/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Czech Translations
 * Translated by Tom谩拧 Kor膷谩k (72)
 * 2008/02/08 18:02, Ext-2.0.1
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Pros铆m 膷ekejte...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} vybran媒ch 艡谩dk暖";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zav艡铆t z谩lo啪ku";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Hodnota v tomto poli je neplatn谩";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "Pros铆m 膷ekejte...";
}

Date.monthNames = [
   "Leden",
   "脷nor",
   "B艡ezen",
   "Duben",
   "Kv臎ten",
   "膶erven",
   "膶ervenec",
   "Srpen",
   "Z谩艡铆",
   "艠铆jen",
   "Listopad",
   "Prosinec"
];

Date.shortMonthNames = {
    "Leden"     : "Led",
    "脷nor"      : "脷no",
    "B艡ezen"    : "B艡e",
    "Duben"     : "Dub",
    "Kv臎ten"    : "Kv臎",
    "膶erven"    : "膶er",
    "膶ervenec"  : "膶vc",
    "Srpen"     : "Srp",
    "Z谩艡铆"      : "Z谩艡",
    "艠铆jen"     : "艠铆j",
    "Listopad"  : "Lis",
    "Prosinec"  : "Pro"
};


Date.getShortMonthName = function(month) {
  return Date.shortMonthNames[Date.monthNames[month]];
};

Date.monthNumbers = {
   "Leden"      : 0,
   "脷nor"       : 1,
   "B艡ezen"     : 2,
   "Duben"      : 3,
   "Kv臎ten"     : 4,
   "膶erven"     : 5,
   "膶ervenec"   : 6,
   "Srpen"      : 7,
   "Z谩艡铆"       : 8,
   "艠铆jen"      : 9,
   "Listopad"   : 10,
   "Prosinec"   : 11
};


Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase()];
};

Date.dayNames = [
   "Ned臎le",
   "Pond臎l铆",
   "脷ter媒",
   "St艡eda",
   "膶tvrtek",
   "P谩tek",
   "Sobota"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Storno",
      yes    : "Ano",
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
      todayText         : "Dnes",
      minText           : "Datum nesm铆 b媒t star拧铆 ne啪 je minim谩ln铆",
      maxText           : "Datum nesm铆 b媒t d艡铆v臎j拧铆 ne啪 je maxim谩ln铆",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : 'N谩sleduj铆c铆 m臎s铆c (Control+Right)',
      prevText          : 'P艡edch谩zej铆c铆 m臎s铆c (Control+Left)',
      monthYearText     : 'Zvolte m臎s铆c (ke zm臎n臎 let pou啪ijte Control+Up/Down)',
      todayTip          : "{0} (Spacebar)",
      format            : "d.m.Y",
      okText            : "&#160;OK&#160;",
      cancelText        : "Storno",
      startDay          : 1
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Strana",
      afterPageText  : "z {0}",
      firstText      : "Prvn铆 strana",
      prevText       : "P艡ech谩zej铆c铆 strana",
      nextText       : "N谩sleduj铆c铆 strana",
      lastText       : "Posledn铆 strana",
      refreshText    : "Aktualizovat",
      displayMsg     : "Zobrazeno {0} - {1} z celkov媒ch {2}",
      emptyMsg       : '沤谩dn茅 z谩znamy nebyly nalezeny'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Pole nesm铆 m铆t m茅n臎 {0} znak暖",
      maxLengthText : "Pole nesm铆 b媒t del拧铆 ne啪 {0} znak暖",
      blankText     : "This field is required",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Hodnota v tomto poli nesm铆 b媒t men拧铆 ne啪 {0}",
      maxText : "Hodnota v tomto poli nesm铆 b媒t v臎t拧铆 ne啪 {0}",
      nanText : "{0} nen铆 platn茅 膷铆slo"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Neaktivn铆",
      disabledDatesText : "Neaktivn铆",
      minText           : "Datum v tomto poli nesm铆 b媒t star拧铆 ne啪 {0}",
      maxText           : "Datum v tomto poli nesm铆 b媒t nov臎j拧铆 ne啪 {0}",
      invalidText       : "{0} nen铆 platn媒m datem - zkontrolujte zda-li je ve form谩tu {1}",
      format            : "d.m.Y",
      altFormats        : "d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d",
      startDay          : 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Pros铆m 膷ekejte...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'V tomto poli m暖啪e b媒t vypln臎na pouze emailov谩 adresa ve form谩tu "u啪ivatel@dom茅na.cz"',
      urlText      : 'V tomto poli m暖啪e b媒t vypln臎na pouze URL (adresa internetov茅 str谩nky) ve form谩tu "http:/'+'/www.dom茅na.cz"',
      alphaText    : 'Toto pole m暖啪e obsahovat pouze p铆smena abecedy a znak _',
      alphanumText : 'Toto pole m暖啪e obsahovat pouze p铆smena abecedy, 膷铆sla a znak _'
   });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Zadejte URL adresu odkazu:',
    buttonTips : {
      bold : {
        title: 'Tu膷n茅 (Ctrl+B)',
        text: 'Ozna膷铆 vybran媒 text tu膷n臎.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Kurz铆va (Ctrl+I)',
        text: 'Ozna膷铆 vybran媒 text kurz铆vou.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Podtr啪en铆 (Ctrl+U)',
        text: 'Podtrhne vybran媒 text.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Zv臎t拧it p铆smo',
        text: 'Zv臎t拧铆 velikost p铆sma.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Z煤啪it p铆smo',
        text: 'Zmen拧铆 velikost p铆sma.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Barva zv媒razn臎n铆 textu',
        text: 'Ozna膷铆 vybran媒 text tak, aby vypadal jako ozna膷en媒 zv媒raz艌ova膷em.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Barva p铆sma',
        text: 'Zm臎n铆 barvu textu.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Zarovnat text vlevo',
        text: 'Zarovn谩 text doleva.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Zarovnat na st艡ed',
        text: 'Zarovn谩 text na st艡ed.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Zarovnat text vpravo',
        text: 'Zarovn谩 text doprava.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Odr谩啪ky',
        text: 'Za膷ne seznam s odr谩啪kami.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: '膶铆slov谩n铆',
        text: 'Za膷ne 膷铆slovan媒 seznam.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Internetov媒 odkaz',
        text: 'Z vybran茅ho textu vytvo艡铆 internetov媒 odkaz.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Zdrojov媒 k贸d',
        text: 'P艡epne do m贸du 煤pravy zdrojov茅ho k贸du.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "艠adit vzestupn臎",
      sortDescText : "艠adit sestupn臎",
      lockText     : "Ukotvit sloupec",
      unlockText   : "Uvolnit sloupec",
      columnsText  : "Sloupce"
   });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(沤谩dn谩 data)',
    groupByText    : 'Seskupit dle tohoto pole',
    showGroupsText : 'Zobrazit ve skupin臎'
  });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "N谩zev",
      valueText  : "Hodnota",
      dateFormat : "j.m.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Tahem zm臎nit velikost.",
      collapsibleSplitTip : "Tahem zm臎nit velikost. Dvojklikem skr媒t."
   });
}
