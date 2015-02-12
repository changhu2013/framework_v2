/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Romanian translations for ExtJS 2.1
 * First released by Lucian Lature on 2007-04-24
 * Changed locale for Romania (date formats) as suggested by keypoint
 * on ExtJS forums: http://www.extjs.com/forum/showthread.php?p=129524#post129524
 * Removed some useless parts
 * Changed by: Emil Cazamir, 2008-04-24
 * Fixed some errors left behind
 * Changed by: Emil Cazamir, 2008-09-01
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">脦nc膬rcare...</div>';

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} r芒nd(uri) selectate";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "脦nchide acest tab";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Valoarea acestui c芒mp este invalid膬";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "脦nc膬rcare...";
}

Date.monthNames = [
   "Ianuarie",
   "Februarie",
   "Martie",
   "Aprilie",
   "Mai",
   "Iunie",
   "Iulie",
   "August",
   "Septembrie",
   "Octombrie",
   "Noiembrie",
   "Decembrie"
];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  Ian : 0,
  Feb : 1,
  Mar : 2,
  Apr : 3,
  Mai : 4,
  Iun : 5,
  Iul : 6,
  Aug : 7,
  Sep : 8,
  Oct : 9,
  Noi : 10,
  Dec : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
   "Duminic膬",
   "Luni",
   "Mar牛i",
   "Miercuri",
   "Joi",
   "Vineri",
   "S芒mb膬t膬"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Renun牛膬",
      yes    : "Da",
      no     : "Nu"
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
    todayText         : "Ast膬zi",
    minText           : "Aceast膬 dat膬 este anterioar膬 datei minime",
    maxText           : "Aceast膬 dat膬 este ulterioar膬 datei maxime",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : 'Luna urm膬toare (Control+Dreapta)',
    prevText          : 'Luna precedent膬 (Control+St芒nga)',
    monthYearText     : 'Alege o lun膬 (Control+Sus/Jos pentru a parcurge anii)',
    todayTip          : "{0} (Bara spa葲iu)",
    format            : "d.m.Y",
    okText            : "&#160;OK&#160;",
    cancelText        : "Renun葲膬",
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Pagina",
    afterPageText  : "din {0}",
    firstText      : "Prima pagin膬",
    prevText       : "Pagina anterioar膬",
    nextText       : "Pagina urm膬toare",
    lastText       : "Ultima pagin膬",
    refreshText    : "脦mprosp膬teaz膬",
    displayMsg     : "Afi药are 卯nregistr膬rile {0} - {1} din {2}",
    emptyMsg       : 'Nu sunt date de afi药at'
  });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Lungimea minim膬 pentru acest c芒mp este de {0}",
      maxLengthText : "Lungimea maxim膬 pentru acest c芒mp este {0}",
      blankText     : "Acest c芒mp este obligatoriu",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Valoarea minim膬 permis膬 a acestui c芒mp este {0}",
      maxText : "Valaorea maxim膬 permis膬 a acestui c芒mp este {0}",
      nanText : "{0} nu este un num膬r valid"
   });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "Indisponibil",
    disabledDatesText : "Indisponibil",
    minText           : "Data din aceast膬 caset膬 trebuie s膬 fie dup膬 {0}",
    maxText           : "Data din aceast膬 caset膬 trebuie s膬 fie inainte de {0}",
    invalidText       : "{0} nu este o dat膬 valid膬, trebuie s膬 fie 卯n formatul {1}",
    format            : "d.m.Y",
    altFormats        : "d-m-Y|d.m.y|d-m-y|d.m|d-m|dm|d|Y-m-d",
    startDay          : 0
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "脦nc膬rcare...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Acest c芒mp trebuie s膬 con牛in膬 o adres膬 de e-mail 卯n formatul "user@domeniu.com"',
      urlText      : 'Acest c芒mp trebuie s膬 con牛in膬 o adres膬 URL 卯n formatul "http:/'+'/www.domeniu.com"',
      alphaText    : 'Acest c芒mp trebuie s膬 con牛in膬 doar litere 艧i _',
      alphanumText : 'Acest c芒mp trebuie s膬 con牛in膬 doar litere, cifre 艧i _'
   });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'V膬 rug膬m introduceti un URL pentru aceast膬 leg膬tur膬 web:',
    buttonTips : {
      bold : {
        title: '脦ngro艧at (Ctrl+B)',
        text: '脦ngro艧ati caracterele textului selectat.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: '脦nclinat (Ctrl+I)',
        text: '脦nclina牛i caracterele textului selectat.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Subliniat (Ctrl+U)',
        text: 'Sublinia牛i caracterele textului selectat.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'M膬rit',
        text: 'M膬re艧te dimensiunea fontului.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Mic艧orat',
        text: 'Mic艧oreaz膬 dimensiunea textului.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Culoarea fundalului',
        text: 'Schimb膬 culoarea fundalului pentru textul selectat.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Culoarea textului',
        text: 'Schimb膬 culoarea textului selectat.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Aliniat la st芒nga',
        text: 'Aliniaz膬 textul la st芒nga.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Centrat',
        text: 'Centreaz膬 textul 卯n editor.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Aliniat la dreapta',
        text: 'Aliniaz膬 textul la dreapta.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'List膬 cu puncte',
        text: 'Insereaz膬 list膬 cu puncte.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'List膬 numerotat膬',
        text: 'Insereaz膬 o list膬 numerotat膬.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Leg膬tur膬 web',
        text: 'Transform膬 textul selectat 卯n leg膬tur膬 web.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Editare surs膬',
        text: 'Schimb膬 pe modul de editare al codului HTML.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}


if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Sortare ascendent膬",
      sortDescText : "Sortare descendent膬",
      lockText     : "Blocheaz膬 coloana",
      unlockText   : "Deblocheaz膬 coloana",
      columnsText  : "Coloane"
   });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(F膬r膬)',
    groupByText    : 'Grupeaz膬 dup膬 aceast膬 coloan膬',
    showGroupsText : 'Afi药eaz膬 grupat'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Nume",
    valueText  : "Valoare",
    dateFormat : "d.m.Y"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Trage pentru redimensionare.",
      collapsibleSplitTip : "Trage pentru redimensionare. Dublu-click pentru ascundere."
   });
}
