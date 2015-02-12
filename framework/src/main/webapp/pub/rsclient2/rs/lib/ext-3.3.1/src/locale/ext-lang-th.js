/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * List compiled by KillerNay on the extjs.com forums.
 * Thank you KillerNay!
 *
 * Thailand Translations
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">隆脱脜修搂芒唇脜沤...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} 脿脜脳脥隆谩脜茅脟路修茅搂唇脕沤谩露脟";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "禄脭沤谩路莽潞鹿脮茅";
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "钪捖⒚嵚嵚姑暶┟っ伱睹榇÷得┟嵚?;
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "隆脱脜修搂芒唇脜沤...";
}

Date.monthNames = [
  "脕隆脙脪钪?,
  "隆脴脕鸥脪脱鸥修鹿啪矛",
  "脕脮鹿脪钪?,
  "脿脕脡脪脗鹿",
  "鸥胫脡脌脪钪?,
  "脕脭露脴鹿脪脗鹿",
  "隆胫隆炉脪钪?,
  "脢脭搂唇脪钪?,
  "隆修鹿脗脪脗鹿",
  "碌脴脜脪钪?,
  "鸥胫脠拧脭隆脪脗鹿",
  "啪修鹿脟脪钪?
];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  "脕钪? : 0,
  "隆鸥" : 1,
  "脕脮钪? : 2,
  "脿脕脗" : 3,
  "鸥钪? : 4,
  "脕脭脗" : 5,
  "隆钪? : 6,
  "脢钪? : 7,
  "隆脗" : 8,
  "碌钪? : 9,
  "鸥脗" : 10,
  "啪钪? : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
  "脥脪路脭碌脗矛",
  "拧修鹿路脙矛",
  "脥修搂钪捗?,
  "鸥脴脳啪",
  "鸥胫唇修脢潞沤脮",
  "脠脴隆脙矛",
  "脿脢脪脙矛"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "碌隆脜搂",
    cancel : "脗隆脿脜脭隆",
    yes    : "茫陋猫",
    no     : "盲脕猫茫陋猫"
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "m/d/Y");
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "脟修鹿鹿脮茅",
    minText           : "This date is before the minimum date",
    maxText           : "This date is after the maximum date",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : '脿沤脳脥鹿露修沤盲禄 (Control+Right)',
    prevText          : '脿沤脳脥鹿隆猫脥鹿唇鹿茅脪 (Control+Left)',
    monthYearText     : '脿脜脳脥隆脿沤脳脥鹿 (Control+Up/Down to move years)',
    todayTip          : "{0} (Spacebar)",
    format            : "m/d/y",
    okText            : "&#160;碌隆脜搂&#160;",
    cancelText        : "脗隆脿脜脭隆",
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "唇鹿茅脪",
    afterPageText  : "of {0}",
    firstText      : "唇鹿茅脪谩脙隆",
    prevText       : "隆猫脥鹿唇鹿茅脪",
    nextText       : "露修沤盲禄",
    lastText       : "唇鹿茅脪脢脴沤路茅脪脗",
    refreshText    : "脙脮脿驴脙陋",
    displayMsg     : "隆脱脜修搂谩脢沤搂 {0} - {1} 拧脪隆 {2}",
    emptyMsg       : '盲脕猫脕脮垄茅脥脕脵脜谩脢沤搂'
  });
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "The minimum length for this field is {0}",
    maxLengthText : "The maximum length for this field is {0}",
    blankText     : "This field is required",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "The minimum value for this field is {0}",
    maxText : "The maximum value for this field is {0}",
    nanText : "{0} is not a valid number"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "禄脭沤",
    disabledDatesText : "禄脭沤",
    minText           : "The date in this field must be after {0}",
    maxText           : "The date in this field must be before {0}",
    invalidText       : "{0} is not a valid date - it must be in the format {1}",
    format            : "m/d/y",
    altFormats        : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
    startDay          : 0
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "隆脱脜修搂芒唇脜沤...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : 'This field should be an e-mail address in the format "user@example.com"',
    urlText      : 'This field should be a URL in the format "http:/'+'/www.example.com"',
    alphaText    : 'This field should only contain letters and _',
    alphanumText : 'This field should only contain letters, numbers and _'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Please enter the URL for the link:',
    buttonTips : {
      bold : {
        title: 'Bold (Ctrl+B)',
        text: 'Make the selected text bold.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Italic (Ctrl+I)',
        text: 'Make the selected text italic.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Underline (Ctrl+U)',
        text: 'Underline the selected text.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Grow Text',
        text: 'Increase the font size.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Shrink Text',
        text: 'Decrease the font size.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Text Highlight Color',
        text: 'Change the background color of the selected text.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Font Color',
        text: 'Change the color of the selected text.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Align Text Left',
        text: 'Align text to the left.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Center Text',
        text: 'Center text in the editor.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Align Text Right',
        text: 'Align text to the right.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Bullet List',
        text: 'Start a bulleted list.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Numbered List',
        text: 'Start a numbered list.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Hyperlink',
        text: 'Make the selected text a hyperlink.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Source Edit',
        text: 'Switch to source editing mode.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "Sort Ascending",
    sortDescText : "Sort Descending",
    lockText     : "Lock Column",
    unlockText   : "Unlock Column",
    columnsText  : "Columns"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(None)',
    groupByText    : 'Group By This Field',
    showGroupsText : 'Show in Groups'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Name",
    valueText  : "Value",
    dateFormat : "m/j/Y"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "Drag to resize.",
    collapsibleSplitTip : "Drag to resize. Double click to hide."
  });
}
