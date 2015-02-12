/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Finnish Translations
 * <tuomas.salo (at) iki.fi>
 * '盲' should read as lowercase 'a' with two dots on top (&auml;)
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Ladataan...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} rivi(盲) valittu";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "Sulje t盲m盲 v盲lilehti";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "Ladataan...";
}

Date.monthNames = [
  "tammikuu",
  "helmikuu",
  "maaliskuu",
  "huhtikuu",
  "toukokuu",
  "kes盲kuu",
  "hein盲kuu",
  "elokuu",
  "syyskuu",
  "lokakuu",
  "marraskuu",
  "joulukuu"
];

Date.getShortMonthName = function(month) {
  //return Date.monthNames[month].substring(0, 3);
  return (month+1) + ".";
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
  if(name.match(/^(1?\d)\./)) {
	return -1+RegExp.$1;
  } else {
	return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
  }
};

Date.dayNames = [
  "sunnuntai",
  "maanantai",
  "tiistai",
  "keskiviikko",
  "torstai",
  "perjantai",
  "lauantai"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 2);
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "OK",
    cancel : "Peruuta",
    yes    : "Kyll盲",
    no     : "Ei"
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "j.n.Y");
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "T盲n盲盲n",
    minText           : "T盲m盲 p盲iv盲m盲盲r盲 on aikaisempi kuin ensimm盲inen sallittu",
    maxText           : "T盲m盲 p盲iv盲m盲盲r盲 on my枚h盲isempi kuin viimeinen sallittu",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : 'Seuraava kuukausi (Control+oikealle)',
    prevText          : 'Edellinen kuukausi (Control+vasemmalle)',
    monthYearText     : 'Valitse kuukausi (vaihda vuotta painamalla Control+yl枚s/alas)',
    todayTip          : "{0} (v盲lily枚nti)",
    format            : "j.n.Y",
    okText            : "&#160;OK&#160;",
    cancelText        : "Peruuta",
    startDay          : 1 // viikko alkaa maanantaista
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Sivu",
    afterPageText  : "/ {0}",
    firstText      : "Ensimm盲inen sivu",
    prevText       : "Edellinen sivu",
    nextText       : "Seuraava sivu",
    lastText       : "Viimeinen sivu",
    refreshText    : "P盲ivit盲",
    displayMsg     : "N盲ytet盲盲n {0} - {1} / {2}",
    emptyMsg       : 'Ei tietoja'
  });
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "T盲m盲n kent盲n arvo ei kelpaa";
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "T盲m盲n kent盲n minimipituus on {0}",
    maxLengthText : "T盲m盲n kent盲n maksimipituus on {0}",
    blankText     : "T盲m盲 kentt盲 on pakollinen",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "T盲m盲n kent盲n pienin sallittu arvo on {0}",
    maxText : "T盲m盲n kent盲n suurin sallittu arvo on {0}",
    nanText : "{0} ei ole numero"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "Ei k盲yt枚ss盲",
    disabledDatesText : "Ei k盲yt枚ss盲",
    minText           : "T盲m盲n kent盲n p盲iv盲m盲盲r盲n tulee olla {0} j盲lkeen",
    maxText           : "T盲m盲n kent盲n p盲iv盲m盲盲r盲n tulee olla ennen {0}",
    invalidText       : "P盲iv盲m盲盲r盲 {0} ei ole oikeassa muodossa - kirjoita p盲iv盲m盲盲r盲 muodossa {1}",
    format            : "j.n.Y",
    altFormats        : "j.n.|d.m.|mdy|mdY|d|Y-m-d|Y/m/d",
    startDay          : 1 // viikko alkaa maanantaista
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "Ladataan...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : 'Sy枚t盲 t盲h盲n kentt盲盲n s盲hk枚postiosoite, esim. "etunimi.sukunimi@osoite.fi"',
    urlText      : 'Sy枚t盲 t盲h盲n kentt盲盲n URL-osoite, esim. "http:/'+'/www.osoite.fi"',
    alphaText    : 'Sy枚t盲 t盲h盲n kentt盲盲n vain kirjaimia (a-z, A-Z) ja alaviivoja (_)',
    alphanumText : 'Sy枚t盲 t盲h盲n kentt盲盲n vain kirjaimia (a-z, A-Z), numeroita (0-9) ja alaviivoja (_)'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Anna linkin URL-osoite:',
    buttonTips : {
      bold : {
        title: 'Lihavoi (Ctrl+B)',
        text: 'Lihavoi valittu teksti.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Kursivoi (Ctrl+I)',
        text: 'Kursivoi valittu teksti.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Alleviivaa (Ctrl+U)',
        text: 'Alleviivaa valittu teksti.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Suurenna teksti盲',
        text: 'Kasvata tekstin kirjasinkokoa.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Pienenn盲 teksti盲',
        text: 'Pienenn盲 tekstin kirjasinkokoa.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Tekstin korostusv盲ri',
        text: 'Vaihda valitun tekstin taustav盲ri盲.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Tekstin v盲ri',
        text: 'Vaihda valitun tekstin v盲ri盲.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Tasaa vasemmalle',
        text: 'Tasaa teksti vasempaan reunaan.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Keskit盲',
        text: 'Keskit盲 teksti.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Tasaa oikealle',
        text: 'Tasaa teksti oikeaan reunaan.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Luettelo',
        text: 'Luo luettelo.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Numeroitu luettelo',
        text: 'Luo numeroitu luettelo.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Linkki',
        text: 'Tee valitusta tekstist盲 hyperlinkki.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'L盲hdekoodin muokkaus',
        text: 'Vaihda l盲hdekoodin muokkausn盲kym盲盲n.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.form.BasicForm){
  Ext.form.BasicForm.prototype.waitTitle = "Odota...";
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "J盲rjest盲 A-脰",
    sortDescText : "J盲rjest盲 脰-A",
    lockText     : "Lukitse sarake",
    unlockText   : "Vapauta sarakkeen lukitus",
    columnsText  : "Sarakkeet"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(ei mit盲盲n)',
    groupByText    : 'Ryhmittele t盲m盲n kent盲n mukaan',
    showGroupsText : 'N盲yt盲 ryhmiss盲'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Nimi",
    valueText  : "Arvo",
    dateFormat : "j.m.Y"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "Muuta kokoa vet盲m盲ll盲.",
    collapsibleSplitTip : "Muuta kokoa vet盲m盲ll盲. Piilota kaksoisklikkauksella."
  });
}
