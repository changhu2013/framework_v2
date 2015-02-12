/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
锘?**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 *
 * Hungarian Translations (utf-8 encoded)
 * by Amon <amon@theba.hu> (27 Apr 2008)
 * encoding fixed by Vili (17 Feb 2009)
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Bet枚lt茅s...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} kiv谩lasztott sor";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "F眉l bez谩r谩sa";
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "Hib谩s 茅rt茅k!";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "Bet枚lt茅s...";
}

Date.monthNames = [
  "Janu谩r",
  "Febru谩r",
  "M谩rcius",
  "脕prilis",
  "M谩jus",
  "J煤nius",
  "J煤lius",
  "Augusztus",
  "Szeptember",
  "Okt贸ber",
  "November",
  "December"
];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  'Jan' : 0,
  'Feb' : 1,
  'M谩r' : 2,
  '脕pr' : 3,
  'M谩j' : 4,
  'J煤n' : 5,
  'J煤l' : 6,
  'Aug' : 7,
  'Sze' : 8,
  'Okt' : 9,
  'Nov' : 10,
  'Dec' : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
  "Vas谩rnap",
  "H茅tf艖",
  "Kedd",
  "Szerda",
  "Cs眉t枚rt枚k",
  "P茅ntek",
  "Szombat"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "OK",
    cancel : "M茅gsem",
    yes    : "Igen",
    no     : "Nem"
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "Y m d");
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "Mai nap",
    minText           : "A d谩tum kor谩bbi a megengedettn茅l",
    maxText           : "A d谩tum k茅s艖bbi a megengedettn茅l",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : 'K枚v. h贸nap (CTRL+Jobbra)',
    prevText          : 'El艖z艖 h贸nap (CTRL+Balra)',
    monthYearText     : 'V谩lassz h贸napot (脡vv谩laszt谩s: CTRL+Fel/Le)',
    todayTip          : "{0} (Sz贸k枚z)",
    format            : "y-m-d",
    okText            : "&#160;OK&#160;",
    cancelText        : "M茅gsem",
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Oldal",
    afterPageText  : "a {0}-b贸l/b艖l",
    firstText      : "Els艖 oldal",
    prevText       : "El艖z艖 oldal",
    nextText       : "K枚vetkez艖 oldal",
    lastText       : "Utols贸 oldal",
    refreshText    : "Friss铆t茅s",
    displayMsg     : "{0} - {1} sorok l谩that贸k a {2}-b贸l/b艖l",
    emptyMsg       : 'Nincs megjelen铆thet艖 adat'
  });
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "A mez艖 tartalma legal谩bb {0} hossz煤 kell legyen",
    maxLengthText : "A mez艖 tartalma legfeljebb {0} hossz煤 lehet",
    blankText     : "K枚telez艖en kit枚ltend艖 mez艖",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "A mez艖 tartalma nem lehet kissebb, mint {0}",
    maxText : "A mez艖 tartalma nem lehet nagyobb, mint {0}",
    nanText : "{0} nem sz谩m"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "Nem v谩laszthat贸",
    disabledDatesText : "Nem v谩laszthat贸",
    minText           : "A d谩tum nem lehet kor谩bbi, mint {0}",
    maxText           : "A d谩tum nem lehet k茅s艖bbi, mint {0}",
    invalidText       : "{0} nem megfelel艖 d谩tum - a helyes form谩tum: {1}",
    format            : "Y m d",
    altFormats        : "Y-m-d|y-m-d|y/m/d|m/d|m-d|md|ymd|Ymd|d",
    startDay          : 0
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "Bet枚lt茅s...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : 'A mez艖 email c铆met tartalmazhat, melynek form谩tuma "felhaszn谩l贸@szolg谩ltat贸.hu"',
    urlText      : 'A mez艖 webc铆met tartalmazhat, melynek form谩tuma "http:/'+'/www.weboldal.hu"',
    alphaText    : 'A mez艖 csak bet疟ket 茅s al谩h煤z谩st (_) tartalmazhat',
    alphanumText : 'A mez艖 csak bet疟ket, sz谩mokat 茅s al谩h煤z谩st (_) tartalmazhat'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Add meg a webc铆met:',
    buttonTips : {
      bold : {
        title: 'F茅lk枚v茅r (Ctrl+B)',
        text: 'F茅lk枚v茅rr茅 teszi a kijel枚lt sz枚veget.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'D艖lt (Ctrl+I)',
        text: 'D艖lt茅 teszi a kijel枚lt sz枚veget.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Al谩h煤z谩s (Ctrl+U)',
        text: 'Al谩h煤zza a kijel枚lt sz枚veget.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Sz枚veg nagy铆t谩s',
        text: 'N枚veli a sz枚vegm茅retet.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Sz枚veg kicsiny铆t茅s',
        text: 'Cs枚kkenti a sz枚vegm茅retet.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'H谩tt茅rsz铆n',
        text: 'A kijel枚lt sz枚veg h谩tt茅rsz铆n茅t m贸dos铆tja.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Sz枚vegsz铆n',
        text: 'A kijel枚lt sz枚veg sz铆n茅t m贸dos铆tja.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Balra z谩rt',
        text: 'Balra z谩rja a sz枚veget.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'K枚z茅pre z谩rt',
        text: 'K枚z茅pre z谩rja a sz枚veget.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Jobbra z谩rt',
        text: 'Jobbra z谩rja a sz枚veget.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Felsorol谩s',
        text: 'Felsorol谩st kezd.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Sz谩moz谩s',
        text: 'Sz谩mozott list谩t kezd.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Hiperlink',
        text: 'A kijel枚lt sz枚veget linkk茅 teszi.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Forr谩s n茅zet',
        text: 'Forr谩s n茅zetbe kapcsol.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "N枚vekv艖 rendez茅s",
    sortDescText : "Cs枚kken艖 rendez茅s",
    lockText     : "Oszlop z谩rol谩s",
    unlockText   : "Oszlop felold谩s",
    columnsText  : "Oszlopok"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(Nincs)',
    groupByText    : 'Oszlop szerint csoportos铆t谩s',
    showGroupsText : 'Csoportos n茅zet'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "N茅v",
    valueText  : "脡rt茅k",
    dateFormat : "Y m j"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "脕tm茅retez茅s h煤z谩sra.",
    collapsibleSplitTip : "脕tm茅retez茅s h煤z谩sra. Elt眉ntet茅s duplaklikk."
  });
}
