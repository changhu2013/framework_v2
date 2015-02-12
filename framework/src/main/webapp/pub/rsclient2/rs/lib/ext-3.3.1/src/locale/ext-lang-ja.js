/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Japanese translation
 * By tyama
 * 04-08-2007, 05:49 AM
 *
 * update based on English Translations by Condor (8 Aug 2008)
 * By sakuro (30 Aug 2008)
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">瑾伩杈笺伩涓?..</div>';

if(Ext.DataView){
  Ext.DataView.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} 琛岄夫鎶?;
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "瑾伩杈笺伩涓?..";
}

Date.monthNames = [
  '1链?,
  '2链?,
  '3链?,
  '4链?,
  '5链?,
  '6链?,
  '7链?,
  '8链?,
  '9链?,
  '10链?,
  '11链?,
  '12链?
];

Date.getShortMonthName = function(month) {
  return "" + (month + 1);
};

Date.monthNumbers = {
  "1" : 0,
  "2" : 1,
  "3" : 2,
  "4" : 3,
  "5" : 4,
  "6" : 5,
  "7" : 6,
  "8" : 7,
  "9" : 8,
  "10" : 9,
  "11" : 10,
  "12" : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, name.length - 1)];
  // or simply parseInt(name.substring(0, name.length - 1)) - 1
};

Date.dayNames = [
  "镞ユ洔镞?,
  "链堟洔镞?,
  "鐏洔镞?,
  "姘存洔镞?,
  "链ㄦ洔镞?,
  "閲戞洔镞?,
  "鍦熸洔镞?
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 1); // just remove "镟沧棩" suffix
};

Date.formatCodes.a = "(this.getHours() < 12 ? '鍗埚墠' : '鍗埚缌')";
Date.formatCodes.A = "(this.getHours() < 12 ? '鍗埚墠' : '鍗埚缌')"; // no case difference

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "OK",
    cancel : "銈儯銉炽偦銉?,
    yes    : "銇亜",
    no     : "銇勩亜銇?
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "Y/m/d");
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "浠婃棩",
    minText           : "阆告姙銇椼仧镞ヤ粯銇渶灏忓€や互涓嬨仹銇欍€?,
    maxText           : "阆告姙銇椼仧镞ヤ粯銇渶澶у€や互涓娿仹銇欍€?,
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : '娆℃湀銇?(銈炽兂銉堛儹銉笺俪+鍙?',
    prevText          : '鍓嶆湀銇?(銈炽兂銉堛儹銉笺俪+宸?',
    monthYearText     : '链堥夫鎶?(銈炽兂銉堛儹銉笺俪+涓?涓嬨仹骞寸Щ鍕?',
    todayTip          : "{0} (銈广儦銉笺偣銈兖)",
    format            : "Y/m/d",
    okText            : "OK",
    cancelText        : "銈儯銉炽偦銉?,
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "銉氥兖銈?,
    afterPageText  : "/ {0}",
    firstText      : "链€鍒濄伄銉氥兖銈?,
    prevText       : "鍓嶃伄銉氥兖銈?,
    nextText       : "娆°伄銉氥兖銈?,
    lastText       : "链€寰屻伄銉氥兖銈?,
    refreshText    : "镟存柊",
    displayMsg     : "{2} 浠朵腑 {0} - {1} 銈掕〃绀?,
    emptyMsg       : '琛ㄧず銇欍倠銉囥兖銈裤亴銇伞倞銇俱仜銈撱€?
  });
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "銉曘偅銉笺俪銉夈伄链ゃ亴涓嶆銇с仚銆?;
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "銇撱伄銉曘偅銉笺俪銉夈伄链€灏忓€ゃ伅 {0} 銇с仚銆?,
    maxLengthText : "銇撱伄銉曘偅銉笺俪銉夈伄链€澶у€ゃ伅 {0} 銇с仚銆?,
    blankText     : "蹇呴爤阕呯洰銇с仚銆?,
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    decimalSeparator : ".",
    decimalPrecision : 2,
    minText : "銇撱伄銉曘偅銉笺俪銉夈伄链€灏忓€ゃ伅 {0} 銇с仚銆?,
    maxText : "銇撱伄銉曘偅銉笺俪銉夈伄链€澶у€ゃ伅 {0} 銇с仚銆?,
    nanText : "{0} 銇暟链ゃ仹銇亗銈娿伨銇涖倱銆?
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "铹″姽",
    disabledDatesText : "铹″姽",
    minText           : "銇撱伄銉曘偅銉笺俪銉夈伄镞ヤ粯銇€?{0} 浠ラ檷銇棩浠朴伀瑷畾銇椼仸銇忋仩銇曘亜銆?,
    maxText           : "銇撱伄銉曘偅銉笺俪銉夈伄镞ヤ粯銇€?{0} 浠ュ墠銇棩浠朴伀瑷畾銇椼仸銇忋仩銇曘亜銆?,
    invalidText       : "{0} 銇枔阆曘仯銇熸棩浠桦叆锷涖仹銇欍€?- 鍏ュ姏褰㈠纺銇€寋1}銆嶃仹銇欍€?,
    format            : "Y/m/d",
    altFormats        : "y/m/d|m/d/y|m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
    startDay          : 0
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "瑾伩杈笺伩涓?..",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : '銉°兖銉偄銉夈罗銈广倰"user@example.com"銇舰寮忋仹鍏ュ姏銇椼仸銇忋仩銇曘亜銆?,
    urlText      : 'URL銈?http:/'+'/www.example.com"銇舰寮忋仹鍏ュ姏銇椼仸銇忋仩銇曘亜銆?,
    alphaText    : '鍗婅鑻卞瓧銇?_"銇伩銇с仚銆?,
    alphanumText : '鍗婅鑻辨暟銇?_"銇伩銇с仚銆?
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : '銉兂銈伄URL銈掑叆锷涖仐銇︺亸銇犮仌銇?',
    buttonTips : {
      bold : {
        title: '澶瓧 (銈炽兂銉堛儹銉笺俪+B)',
        text: '阆告姙銉嗐偔銈广儓銈掑お瀛椼伀銇椼伨銇欍€?,
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: '鏂滀綋 (銈炽兂銉堛儹銉笺俪+I)',
        text: '阆告姙銉嗐偔銈广儓銈掓枩浣撱伀銇椼伨銇欍€?,
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: '涓嬬窔 (銈炽兂銉堛儹銉笺俪+U)',
        text: '阆告姙銉嗐偔銈广儓銇笅绶氥倰寮曘亶銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: '鏂囧瓧銈掑ぇ銇嶃亸',
        text: '銉曘偐銉炽儓銈点偆銈恒倰澶с亶銇忋仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: '鏂囧瓧銈掑皬銇曘亸',
        text: '銉曘偐銉炽儓銈点偆銈恒倰灏忋仌銇忋仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: '鏂囧瓧銇儚銈ゃ儵銈ゃ儓',
        text: '阆告姙銉嗐偔銈广儓銇儗鏅壊銈掑镟淬仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: '鏂囧瓧銇壊',
        text: '阆告姙銉嗐偔銈广儓銇壊銈掑镟淬仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: '宸︽弮銇?,
        text: '銉嗐偔銈广儓銈掑乏鎻冦亪銇仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: '涓ぎ鎻冦亪',
        text: '銉嗐偔銈广儓銈掍腑澶弮銇堛伀銇椼伨銇欍€?,
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: '鍙虫弮銇?,
        text: '銉嗐偔銈广儓銈掑彸鎻冦亪銇仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: '鐣佛銇仐绠囨浔镟搞亶',
        text: '鐣佛銇仐绠囨浔镟搞亶銈掗枊濮嬨仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: '鐣佛浠朴亶绠囨浔镟搞亶',
        text: '鐣佛浠朴亶绠囨浔镟搞亶銈掗枊濮嬨仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: '銉忋偆銉戙兖銉兂銈?,
        text: '阆告姙銉嗐偔銈广儓銈掋儚銈ゃ儜銉笺儶銉炽偗銇仐銇俱仚銆?,
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: '銈姐兖銈圭法板?,
        text: '銈姐兖銈圭法板嗐儮銉笺俦銇垏銈婃浛銇堛伨銇欍€?,
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "鏄囬爢",
    sortDescText : "闄嶉爢",
    columnsText  : "銈儵銉?
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(銇仐)',
    groupByText    : '銇撱伄銈儵銉犮仹銈般俪銉笺偿銉炽偘',
    showGroupsText : '銈般俪銉笺偿銉炽偘'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "鍚岖О",
    valueText  : "链?,
    dateFormat : "Y/m/d"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "銉夈儵銉冦偘銇欍倠銇ㄣ儶銈点偆銈恒仹銇嶃伨銇欍€?,
    collapsibleSplitTip : "銉夈儵銉冦偘銇с儶銈点偆銈恒€?銉€銉栥俪銈儶銉冦偗銇ч殸銇欍€?
  });
}

if(Ext.form.TimeField){
  Ext.apply(Ext.form.TimeField.prototype, {
    minText : "銇撱伄銉曘偅銉笺俪銉夈伄鏅傚埢銇€?{0} 浠ラ檷銇檪鍒汇伀瑷畾銇椼仸銇忋仩銇曘亜銆?,
    maxText : "銇撱伄銉曘偅銉笺俪銉夈伄鏅傚埢銇€?{0} 浠ュ墠銇檪鍒汇伀瑷畾銇椼仸銇忋仩銇曘亜銆?,
    invalidText : "{0} 銇枔阆曘仯銇熸檪鍒诲叆锷涖仹銇欍€?,
    format : "g:i A",
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
  });
}

if(Ext.form.CheckboxGroup){
  Ext.apply(Ext.form.CheckboxGroup.prototype, {
    blankText : "銇撱伄銈般俪銉笺儣銇嬨倝链€浣庯紤銇ゃ伄銈偆銉嗐儬銈掗夫鎶炪仐銇亼銈屻伆銇倞銇俱仜銈撱€?
  });
}

if(Ext.form.RadioGroup){
  Ext.apply(Ext.form.RadioGroup.prototype, {
    blankText : "銇撱伄銈般俪銉笺儣銇嬨倝锛戙仱銇偄銈ゃ傧銉犮倰阆告姙銇椼仾銇戙倢銇般仾銈娿伨銇涖倱銆?
  });
}
