/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
锘?**
 * List compiled by Tewodros Wondimu on the extjs.com forums Oct 18, 2010.
 *
 * Amharic Translations
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">釆メ嫬釄滇寛酽?釆愥媺...</div>';

if(Ext.DataView){
  Ext.DataView.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} 釄浊埈释?釄ㄡ嫷厘?{1}";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "釆メ嫬釄滇寛酽?釆愥媺...";
}

Date.shortMonthNames = [
   "釄樶埖釆?,
   "释メ墔釄?,
   "釄呩妩釄?,
   "酽翅垍釄?,
   "释メ埈",
   "釈ㄡ姭酽?,
   "釄樶寝酽?,
   "釄氠嫬釈?,
   "释嶀姇酽?,
   "釄搬姅",
   "釄愥垵釄?,
   "釆愥垉釄?,
   "释丰实釄?
];


Date.monthNames = [
  "釄樶埖釆ㄡ埁釄?,
  "释メ墔釄浊壍",
  "釄呩妩釄?,
  "酽翅垍釄翅埖",
  "释メ埈",
  "釈ㄡ姭酽册壍",
  "釄樶寝酽⑨壍",
  "釄氠嫬釈氠嫬",
  "释嶀姇酽︶壍",
  "釄搬姅",
  "釄愥垵釄?,
  "釆愥垉釄?,
  "释丰实釄?
];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  "釄樶埖釆ㄡ埁釄? : 0,
  "释メ墔釄浊壍" : 1,
  "釄呩妩釄? : 2,
  "酽翅垍釄翅埖" : 3,
  "释メ埈" : 4,
  "釈ㄡ姭酽册壍" : 5,
  "釄樶寝酽⑨壍" : 6,
  "釄氠嫬釈氠嫬" : 7,
  "释嶀姇酽︶壍" : 8,
  "釄搬姅" : 9,
  "釄愥垵釄? : 10,  
  "釆愥垉釄? : 11,
  "释丰实釄? : 12
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
  "釆メ垇釈?,
  "釄搬姙",
  "釄涐姯釄搬姙",
  "釈抚埉酽?,
  "釄愥垯釄?,
  "釆犪埈酽?,
  "酽呩妩釄?
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

Date.parseCodes.S.s = "(?:st|nd|rd|th)";

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "釈垇釆?,
    cancel : "釄搬埈釈?,
    yes    : "釆犪嫀",
    no     : "釈ㄡ垐釄?/ 釆犪嫮"
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "釈?酽€/釆?);
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "釈涐埇",
    minText           : "釈垊 酽€釆? 釆ㄡ垬释ㄡ埁釄?酽滇姇釄?酽€釆?酽犪崐酽?釆愥媺",
    maxText           : "釈垊 酽€釆?釆ㄡ垬释ㄡ埁釄?酽滇垗酽?酽€釆?酽犪崐酽?釆愥媺",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : '釈ㄡ垰酽€释メ垐釈?釈堘埈(釄樶墕释ａ专釄嫬  酽佱垵厘?酽€釆?',
    prevText          : '釈垐厘堘媺 釈堘埈(釄樶墕释ａ专釄嫬  酽佱垵厘?释嶀埆)',
    monthYearText     : '釈堘埈 釄浊埁释?(釆犪垬酽?釄堘垬釄堘媹释?釄樶墕释ａ专釄嫬  酽佱垵厘?釈堘嫲釄嬦嫮/釈堘嫲酽翅壗)',
    todayTip          : "{0} (釈ㄡ墙酽?酽佱垗厘?",
    format            : "d/m/Y",
    okText            : "釈垇釆?,
    cancelText        : "釄搬埈釈?,
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "释堘垗释?,
    afterPageText  : "釈?{0}",
    firstText      : "釈ㄡ垬释€釄樶埅釈媺 释堘垗释?,
    prevText       : "釈垐厘堘媺 释堘垗释?,
    nextText       : "釈ㄡ垰酽€释メ垐釈?释堘垗释?,
    lastText       : "釈ㄡ垬释ㄡ埁釄会媺 释堘垗释?,
    refreshText    : "釆ㄡ垗釄?,
    displayMsg     : "{0} - {1} 釄册嫬釄翅嫮 釆?{2}",
    emptyMsg       : '釈ㄡ垰酽翅嫮 釈翅壋 釈ㄡ垐釄?
  });
}

if(Ext.form.BasicForm){
    Ext.form.BasicForm.prototype.waitTitle = "釆メ墸釆嫀釆?釈尃酽メ墎..."
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "釈ㄡ嫐釄?釄樶埖釆?釆メ埓酽?釈ㄡ壈釄翅埑酽?釆愥媺";
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "釈ㄡ嫐釄?釄樶埖釆?釈ㄡ垬释ㄡ埁釄?酽滇姇釄?釄嫕釄樶壍 {0} 釆愥媺",
    maxLengthText : "釈ㄡ嫐釄?釄樶埖釆?釈ㄡ垬释ㄡ埁釄?酽滇垗酽?釄嫕釄樶壍 {0} 釆愥媺",
    blankText     : "釈垊 釄樶埖釆?釆犪埖厘堘垕释?釆愥媺",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    decimalSeparator : ".",
    decimalPrecision : 2,
    minText : "釈ㄡ嫐釄?釄樶埖釆?釈ㄡ垬释ㄡ埁釄?酽滇姇釄?釆メ埓酽?{0} 釆愥媺",
    maxText : "釈ㄡ嫐釄?釄樶埖釆?釈ㄡ垬释ㄡ埁釄?酽滇垗酽?釆メ埓酽?{0} 釆愥媺",
    nanText : "{0} 釈ㄡ壈釄翅埑酽?酽佱尌釄?釆愥媺"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "酽︶嫕釆椺垗 / 釄滇埆 釆犪墎釄热垗",
    disabledDatesText : "酽︶嫕釆椺垗 / 釄滇埆 釆犪墎釄热垗",
    minText           : "釆メ嫐 釆メ埓酽?釈夅埖释?釈垐釈?酽€釆?釆▄0} 酽犪垜釆犪垕 釄樶垎釆?釆犪垐酽犪壍",
    maxText           : "釆メ嫐 釆メ埓酽?釈夅埖释?釈垐釈?酽€釆?釆▄0} 酽犪崐酽?釄樶垎釆?釆犪垐酽犪壍",
    invalidText       : "{0} 釈ㄡ壈釄翅埑酽?酽€釆?釆愥媺 - 酽犪嫐釄?酽呩埈厘€酽?釄樶垎釆?釆犪垐酽犪壍 {1}",
    format            : "d/m/y",
    altFormats        : "d/m/Y|d/m/y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d",
    startDay          : 0
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "釆メ嫬釄滇寛酽?釆愥媺...",
    valueNotFoundText : "釆犪垗酽搬媹釄搬姁釄?
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : '釈垊 釆メ埓酽?釆⑨垳釈垗 釄樶垎釆?釆犪垐酽犪壍 - 酽犪嫐釄?酽呩埈厘€酽?釄樶垎釆?釆犪垐酽犪壍 "user@example.com"',
    urlText      : '釈垊 釆メ埓酽? 釈┽姞釄姢釆?釄樶垎釆?釆犪垐酽犪壍 - 酽犪嫐釄?酽呩埈厘€酽?釄樶垎釆?釆犪垐酽犪壍 "http:/'+'/www.example.com"',
    alphaText    : '釈垊 釆メ埓酽?釄樶嫬釈?釈垐酽犪壍 酽冡垕酽滇姄 _ 酽メ壔 釆愥媺',
    alphanumText : '釈垊 釆メ埓酽?釄樶嫬釈?釈垐酽犪壍 酽冡垕酽滇崵 酽佱尌釄姄 _ 酽メ壔 釆愥媺'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : '釆メ墸釆壍釆?釄堘嫐 釈┽姞釄姢釆?釆犪寛釆抚姖 釆犪埖释堘墸:',
    buttonTips : {
      bold : {
        title: '釈搬垱酽?(釄樶墕释ａ专釄嫬  酽佱垵厘?B)',
        text: '釈ㄡ壈釄樶埁释犪媺釆?释结垇厘?釆犪嫷釄浊墔::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      italic : {
        title: '釄搬嫬厘?(釄樶墕释ａ专釄嫬  酽佱垵厘?I)',
        text: '釈ㄡ壈釄樶埁释犪媺釆?释结垇厘?釄搬嫬厘?釆犪嫷釄实::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      underline : {
        title: '釄樶埖釄樶埁释嶀埈释?(釄樶墕释ａ专釄嫬  酽佱垵厘?U)',
        text: '釈ㄡ壈釄樶埁释犪媺釆?释结垇厘?釆ㄡ实釄寣 釆犪埖釄浊埈::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      increasefontsize : {
        title: '释结垇厘夅姇 釆犪埑釈滇实',
        text: '酽呩埈释?酽佱垵厘?釆犪埑釈滇寛释?:',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      decreasefontsize : {
        title: '释结垇厘夅姇 釆犪埑釆暧埖',
        text: '酽呩埈释?酽佱垵厘?釆犪埑釆暧埖::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      backcolor : {
        title: '释结垇厘?釄浊埁释?酽€釄堘垵',
        text: '釈ㄡ壈釄樶埁释犪媺釆?释结垇厘?釈翅埆 酽€釄堘垵 釄堘媺释?:',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      forecolor : {
        title: '酽呩埈释?酽佱垵厘?酽€釄堘垵',
        text: '釈ㄡ壈釄樶埁释犪媺釆?释结垇厘?酽€釄堘垵 釄堘媺释?:',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      justifyleft : {
        title: '释结垇厘?释嶀埆 釆犪埌釄嶀崓',
        text: '释结垇厘夅姇 釈堘嫲释嶀埆 釆犪埌釄嶀崓::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      justifycenter : {
        title: '释结垇厘?釆犪垱釆垗',
        text: '釆犪埈酽翅姠釈?釄嬦嫮 释结垇厘夅姇 釆犪垱釆垗::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      justifyright : {
        title: '释结垇厘?酽€釆?釆犪埌釄嶀崓',
        text: '释结垇厘夅姇 釈堘嫲酽€釆?釆犪埌釄嶀崓::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      insertunorderedlist : {
        title: '釆愥尌酽?釄浊垗釆壍 釈浊埈釈浊埈',
        text: '釆愥尌酽?釄浊垗釆壍 釈浊埈釈浊埈 释€釄浊埈::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      insertorderedlist : {
        title: '酽佱尌釄媻 釈浊埈釈浊埈',
        text: '酽佱尌釄媻 釈浊埈釈浊埈 释€釄浊埈::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      createlink : {
        title: '释堘崊 釆犪寛釆抚姖',
        text: '釈ㄡ壈釄樶埁释犪媺釆?释结垇厘?释堘崊 釆犪寛釆抚姖 釆犪嫷釄实::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      },
      sourceedit : {
        title: '釄浊姇释?釆犪埈酽滇姤',
        text: '釈堘嫲 釄浊姇释?釆犪埈酽滇姤 釄佱姁酽?酽€釈埈::',
        cls: '釆め姯釄?釆め壗酽册姢釄浊姢釄?釆犪埈酽翅姠-释犪墐釄?釄浊姯釄?
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "釄结墔酽?釈搬埈釈滇埈",
    sortDescText : "酽佱垗酽佱垗 釈搬埈釈滇埈",
    columnsText  : "釆犪垵釈夺壗"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(釄涐姇釄?',
    groupByText    : '酽犪嫐 釄樶埖釆?酽︶嫷釆?,
    showGroupsText : '酽犪墶釈滇姇 釆犪埑釈?
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "釄滇垵",
    valueText  : "釆メ埓酽?",
    dateFormat : "m/j/Y",
    trueText: "釆メ垯釆?,
    falseText: "釄愥埌酽?
  });
}

if(Ext.grid.BooleanColumn){
   Ext.apply(Ext.grid.BooleanColumn.prototype, {
      trueText  : "釆メ垯釆?,
      falseText : "釄愥埌酽?,
      undefinedText: '&#160;'
   });
}

if(Ext.grid.NumberColumn){
    Ext.apply(Ext.grid.NumberColumn.prototype, {
        format : '0,000.00'
    });
}

if(Ext.grid.DateColumn){
    Ext.apply(Ext.grid.DateColumn.prototype, {
        format : 'm/d/Y'
    });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "釄樶尃釆?釄堘垬酽€釈埈 释庒壍酽?:",
    collapsibleSplitTip : "釄樶尃釆?釄堘垬酽€釈埈 释庒壍酽?: 釄堘垬釈搬墵酽?釄佱垐酽?释犪墔 釆犪嫷釄实::"
  });
}

if(Ext.form.TimeField){
  Ext.apply(Ext.form.TimeField.prototype, {
    minText : "釆メ嫐釄?釄樶埖釆?釈夅埖释?釈垐釈?釄搬嫇酽?釆▄0} 釆メ侄釄?釈堘嫮釄?酽犪妬釄?釄樶垎釆?釆犪垐酽犪壍",
    maxText : "釆メ嫐釄?釄樶埖釆?釈夅埖释?釈垐釈?釄搬嫇酽?釆▄0} 釆メ侄釄?釈堘嫮釄?酽犪崐酽?釄樶垎釆?釆犪垐酽犪壍",
    invalidText : "{0} 釈ㄡ壈釄翅埑酽?釄搬嫇酽?釆愥媺",
    format : "g:i A",
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
  });
}

if(Ext.form.CheckboxGroup){
  Ext.apply(Ext.form.CheckboxGroup.prototype, {
    blankText : "釆メ嫐釄?酽♂嫷釆?釈夅埖释?酽⑨嫬釆暧埖 釆犪姇釈?釈抚嫮釆愥壍 釄樶垵釄ㄡ尌 釆犪垐酽メ垍"
  });
}

if(Ext.form.RadioGroup){
  Ext.apply(Ext.form.RadioGroup.prototype, {
    blankText : "釆メ嫐釄?酽♂嫷釆?釈夅埖释?酽⑨嫬釆暧埖 釆犪姇釈?釈抚嫮釆愥壍 釄樶垵釄ㄡ尌 釆犪垐酽メ垍"
  });
}
