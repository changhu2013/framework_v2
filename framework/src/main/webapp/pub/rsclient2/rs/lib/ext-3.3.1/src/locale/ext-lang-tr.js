/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 *
 * Turkish translation by Alper YAZGAN
 * 2008-01-24, 10:29 AM 
 * 
 * Updated to 2.2 by YargicX
 * 2008-10-05, 06:22 PM
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Y眉kleniyor ...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.Grid){
  Ext.grid.Grid.prototype.ddText = "Se莽ili sat媒r say媒s媒 : {0}";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "Sekmeyi kapat";
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "Bu alandaki de冒er ge莽ersiz";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "Y眉kleniyor ...";
}

Date.monthNames = [
  "Ocak",
  "脼啪ubat",
  "Mart",
  "Nisan",
  "May媒s",
  "Haziran",
  "Temmuz",
  "A冒ustos",
  "Eyl眉l",
  "Ekim",
  "Kas媒m",
  "Aral媒k"
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
  "Pazar",
  "Pazartesi",
  "Sal媒",
  "脟钬r镁鸥amba",
  "Per镁鸥embe",
  "Cuma",
  "Cumartesi"
];

Date.shortDayNames = [
  "Paz",
  "Pzt",
  "Sal",
  "脟r镁鸥",
  "Pr镁",
  "Cum",
  "Cmt"
];

Date.getShortDayName = function(day) {
  return Date.shortDayNames[day];
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "Tamam",
    cancel : "胫掳ptal",
    yes    : "Evet",
    no     : "Hay媒r"
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "d/m/Y");
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "Bug眉n",
    minText           : "Bu tarih izin verilen en k眉莽眉k tarihten daha 枚nce",
    maxText           : "Bu tarih izin verilen en b眉y眉k tarihten daha sonra",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : 'Gelecek Ay (Control+Right)',
    prevText          : '脙钬搉ceki Ay (Control+Left)',
    monthYearText     : 'Bir ay s鸥e莽iniz (Y媒l媒 art媒rmak/azaltmak i莽in Control+Up/Down)',
    todayTip          : "{0} (Bo镁鸥luk Tu镁鸥u - Spacebar)",
    format            : "d/m/Y",
    okText            : "&#160;Tamam&#160;",
    cancelText        : "胫掳ptal",
    startDay          : 1
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Sayfa",
    afterPageText  : " / {0}",
    firstText      : "胫掳lk Sayfa",
    prevText       : "脙钬搉ceki Sayfa",
    nextText       : "Sonraki Sayfa",
    lastText       : "Son Sayfa",
    refreshText    : "Yenile",
    displayMsg     : "G枚sterilen {0} - {1} / {2}",
    emptyMsg       : 'G枚sterilebilecek veri yok'
  });
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "Girilen verinin uzunlu冒u en az {0} olabilir",
    maxLengthText : "Girilen verinin uzunlu冒u en fazla {0} olabilir",
    blankText     : "Bu alan bo镁鸥 b媒rak媒lamaz",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "En az {0} girilebilir",
    maxText : "En 莽ok {0} girilebilir",
    nanText : "{0} ge莽ersiz bir say媒d媒r"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "Disabled",
    disabledDatesText : "Disabled",
    minText           : "Bu tarih, {0} tarihinden daha sonra olmal媒d媒r", 
    maxText           : "Bu tarih, {0} tarihinden daha 枚nce olmal媒d媒r",
    invalidText       : "{0} ge莽ersiz bir tarihdir - tarih format媒 {1} 镁鸥eklinde olmal媒d媒r",
    format            : "d/m/Y",
    altFormats        : "d.m.y|d.m.Y|d/m/y|d-m-Y|d-m-y|d.m|d/m|d-m|dm|dmY|dmy|d|Y.m.d|Y-m-d|Y/m/d",
    startDay          : 1
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "Y眉kleniyor ...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
	Ext.form.VTypes["emailText"]='Bu alan "user@example.com" 镁鸥eklinde elektronik posta format媒nda olmal媒d媒r';
	Ext.form.VTypes["urlText"]='Bu alan "http://www.example.com" 镁鸥eklinde URL adres format媒nda olmal媒d媒r';
	Ext.form.VTypes["alphaText"]='Bu alan sadece harf ve _ i莽ermeli';
	Ext.form.VTypes["alphanumText"]='Bu alan sadece harf, say媒 ve _ i莽ermeli';
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'L眉tfen bu ba冒lant媒 i莽in gerekli URL adresini giriniz:',
    buttonTips : {
      bold : {
        title: 'Kal媒n(Bold) (Ctrl+B)',
        text: '脼啪e莽ili yaz媒y媒 kal媒n yapar.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: '胫掳talik(Italic) (Ctrl+I)',
        text: '脼啪e莽ili yaz媒y媒 italik yapar.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Alt 脙钬zgi(Underline) (Ctrl+U)',
        text: '脼啪e莽ili yaz媒n媒n alt媒n媒 莽izer.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Fontu b眉y眉lt',
        text: 'Yaz媒 fontunu b眉y眉t眉r.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Fontu k眉莽眉lt',
        text: 'Yaz媒 fontunu k眉莽眉lt眉r.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Arka Plan Rengi',
        text: 'Se莽ili yaz媒n媒n arka plan rengini de冒i镁鸥tir.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Yaz媒 Rengi',
        text: 'Se莽ili yaz媒n媒n rengini de冒i镁鸥tir.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Sola Daya',
        text: 'Yaz媒y媒 sola daya.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Ortala',
        text: 'Yaz媒y媒 edit枚rde ortala.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Sa冒a daya',
        text: 'Yaz媒y媒 sa冒a daya.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Noktal媒 Liste',
        text: 'Noktal媒 listeye ba镁鸥la.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Numaral媒 Liste',
        text: 'Numaral媒 lisyeye ba镁鸥la.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Web Adresi(Hyperlink)',
        text: 'Se莽ili yaz媒y媒 web adresi(hyperlink) yap.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Kaynak kodu D眉zenleme',
        text: 'Kaynak kodu d眉zenleme moduna ge莽.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "Artan s媒rada s媒rala",
    sortDescText : "Azalan s媒rada s媒rala",
    lockText     : "Kolonu kilitle",
    unlockText   : "Kolon kilidini kald媒r",
    columnsText  : "Kolonlar"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(Yok)',
    groupByText    : 'Bu Alana G枚re Grupla',
    showGroupsText : 'Gruplar Halinde G枚ster'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Ad",
    valueText  : "De冒er",
    dateFormat : "d/m/Y"
  });
}

if(Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "Yeniden boyutland媒rmak i莽in s眉r眉kle.",
    collapsibleSplitTip : "Yeniden boyutland媒rmak i莽in s眉r眉kle. Saklamak i莽in 莽ift t媒kla."
  });
}
