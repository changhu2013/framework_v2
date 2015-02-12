/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Lithuanian Translations (UTF-8)
 * Vladas Saulis (vladas at prodata dot lt),  03-29-2009
 * Vladas Saulis (vladas at prodata dot lt),  10-18-2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Kraunasi...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.DataView){
  Ext.DataView.prototype.emptyText = "";
}
if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} pa啪ym臈t懦 eilu膷i懦";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "U啪daryti 拧i膮 u啪skland膮";
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "艩io lauko reik拧m臈 neteisinga";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "Kraunasi...";
}

Date.monthNames = [
  "Sausis",
  "Vasaris",
  "Kovas",
  "Balandis",
  "Gegu啪臈",
  "Bir啪elis",
  "Liepa",
  "Rugpj奴tis",
  "Rugs臈jis",
  "Spalis",
  "Lapkritis",
  "Gruodis"
];

Date.getShortMonthName = function(month) {
    // Uncommons
    if (month == 7) return "Rgp";
    if (month == 8) return "Rgs";
    if (month == 11) return "Grd";
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  Sau : 0,
  Vas : 1,
  Kov : 2,
  Bal : 3,
  Geg : 4,
  Bir : 5,
  Lie : 6,
  Rgp : 7,
  Rgs : 8,
  Spa : 9,
  Lap : 10,
  Grd : 11
};

Date.getMonthNumber = function(name) {

    // Some uncommons
    if (name == "Rugpj奴tis") return 7;
    if (name == "Rugs臈jis") return 8;
    if (name == "Gruodis") return 11;
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
  "Sekmadienis",
  "Pirmadienis",
  "Antradienis",
  "Tre膷iadienis",
  "Ketvirtadienis",
  "Penktadienis",
  "艩e拧tadienis"
];

Date.parseCodes.S.s = "(?:as|as|as|as)";

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "Gerai",
    cancel : "Atsisakyti",
    yes    : "Taip",
    no     : "Ne"
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
    todayText         : "艩iandien",
    minText           : "艩i data yra ma啪esn臈 u啪 leistin膮",
    maxText           : "艩i data yra didesn臈 u啪 leistin膮",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : 'Kitas m臈nuo (Control+Right)',
    prevText          : 'Ankstesnis m臈nuo (Control+Left)',
    monthYearText     : 'Pasirinkti m臈nes寞 (Control+Up/Down per臈jimui tarp met懦)',
    todayTip          : "{0} (Tarpas)",
    format            : "y-m-d",
    okText            : "&#160;Gerai&#160;",
    cancelText        : "Atsisaktyi",
    startDay          : 1
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Puslapis",
    afterPageText  : "i拧 {0}",
    firstText      : "Pirmas puslapis",
    prevText       : "Ankstesnis pusl.",
    nextText       : "Kitas puslapis",
    lastText       : "Pakutinis pusl.",
    refreshText    : "Atnaujinti",
    displayMsg     : "Rodomi 寞ra拧ai {0} - {1} i拧 {2}",
    emptyMsg       : 'N臈ra duomen懦'
  });
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "Minimalus 拧io lauko ilgis yra {0}",
    maxLengthText : "Maksimalus 拧io lauko ilgis yra {0}",
    blankText     : "艩is laukas yra privalomas",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "Minimalus 拧io lauko ilgis yra {0}",
    maxText : "Maksimalus 拧io lauko ilgis yra {0}",
    nanText : "{0} yra neleistina reik拧m臈"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "Neprieinama",
    disabledDatesText : "Neprieinama",
    minText           : "艩iame lauke data turi b奴ti didesn臈 u啪 {0}",
    maxText           : "艩iame lauke data turi b奴ti ma啪esn臈臈 u啪 {0}",
    invalidText       : "{0} yra neteisinga data - ji turi b奴ti 寞vesta formatu {1}",
    format            : "y-m-d",
    altFormats        : "y-m-d|y/m/d|Y-m-d|m/d|m-d|md|ymd|Ymd|d|Y-m-d",
    startDay          : 1
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "Kraunasi...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : '艩iame lauke turi b奴ti el.pa拧to adresas formatu "user@example.com"',
    urlText      : '艩iame lauke turi b奴ti nuoroda (URL) formatu "http:/'+'/www.example.com"',
    alphaText    : '艩iame lauke gali b奴ti tik raid臈s ir 啪enklas "_"',
    alphanumText : '艩iame lauke gali b奴ti tik raid臈s, skai膷iai ir 啪enklas "_"'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : '漠veskite URL 拧iai nuorodai:',
    buttonTips : {
      bold : {
        title: 'Bold (Ctrl+B)',
        text: 'Teksto pary拧kinimas.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Italic (Ctrl+I)',
        text: 'Kursyvinis tekstas.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Underline (Ctrl+U)',
        text: 'Teksto pabraukimas.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Padidinti 拧rift膮',
        text: 'Padidinti 拧rifto dyd寞.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Suma啪inti 拧rift膮',
        text: 'Suma啪inti 拧rifto dyd寞.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Nuspalvinti teksto fon膮',
        text: 'Pakeisti teksto fono spalv膮.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Teksto spalva',
        text: 'Pakeisti pa啪ym臈to teksto spalv膮.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'I拧lyginti kairen',
        text: 'I拧lyginti tekst膮 寞 kair臋.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Centruoti tekst膮',
        text: 'Centruoti tekt膮 redaktoriaus lange.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'I拧lyginti de拧in臈n',
        text: 'I拧lyginti tekst膮 寞 de拧in臋.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Paprastas s膮ra拧as',
        text: 'Prad臈ti neorganizuot膮 s膮ra拧膮.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Numeruotas s膮ra拧as',
        text: 'Prad臈ti numeruot膮 s膮ra拧膮.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Nuoroda',
        text: 'Padaryti pa啪ym臈ta tekst膮 nuoroda.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'I拧eities tekstas',
        text: 'Persijungti 寞 i拧eities teksto koregavimo re啪im膮.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.form.BasicForm){
  Ext.form.BasicForm.prototype.waitTitle = "Palaukite...";
}
  
if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "R奴拧iuoti did臈jan膷ia tvarka",
    sortDescText : "R奴拧iuoti ma啪臈jan膷ia tvarka",
    lockText     : "U啪fiksuoti stulpel寞",
    unlockText   : "Atlaisvinti stulpel寞",
    columnsText  : "Stulpeliai"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(N臈ra)',
    groupByText    : 'Grupuoti pagal 拧寞 lauk膮',
    showGroupsText : 'Rodyti grup臈se'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Pavadinimas",
    valueText  : "Reik拧m臈",
    dateFormat : "Y-m-d"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "Patraukite juostel臋.",
    collapsibleSplitTip : "Patraukite juostel臋 arba Paspauskite dvigubai kad pasl臈pti."
  });
}

if(Ext.form.TimeField){
  Ext.apply(Ext.form.TimeField.prototype, {
    minText : "Laikas turi buti lygus arba v臈lesnis u啪 {0}",
    maxText : "Laikas turi b奴ti lygus arba ankstesnis u啪 {0}",
    invalidText : "{0} yra neteisingas laikas",
    format : "H:i",
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
  });
}
			
if(Ext.form.CheckboxGroup){
  Ext.apply(Ext.form.CheckboxGroup.prototype, {
    blankText : "J奴s turite padaryti bent vien膮 pasirinkim膮 拧ioje grup臈je"
  });
}
	
if(Ext.form.RadioGroup){
  Ext.apply(Ext.form.RadioGroup.prototype, {
      blankText : "J奴s turite padaryti bent vien膮 pasirinkim膮 拧ioje grup臈je"
  });
}
