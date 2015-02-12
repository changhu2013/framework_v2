/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Hebrew Translations
 * By spartacus (from forums) 06-12-2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">...锟斤拷锟斤拷</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷 {0}";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷";
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷 锟斤拷锟斤拷";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "...锟斤拷锟斤拷";
}

Date.monthNames = [
  "锟斤拷锟斤拷锟?,
  "锟斤拷锟斤拷锟斤拷",
  "锟斤拷锟?,
  "锟斤拷锟斤拷锟?,
  "锟斤拷锟?,
  "锟斤拷锟斤拷",
  "锟斤拷锟斤拷",
  "锟斤拷锟斤拷锟斤拷",
  "锟斤拷锟斤拷锟斤拷",
  "锟斤拷锟斤拷锟斤拷锟?,
  "锟斤拷锟斤拷锟斤拷",
  "锟斤拷锟斤拷锟?
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
  "锟?,
  "锟?,
  "锟?,
  "锟?,
  "锟?,
  "锟?,
  "锟?
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "锟斤拷锟斤拷锟?,
    cancel : "锟斤拷锟斤拷锟?,
    yes    : "锟斤拷",
    no     : "锟斤拷"
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
    todayText         : "锟斤拷锟斤拷",
    minText           : ".锟斤拷锟斤拷锟?锟斤拷 锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
    maxText           : ".锟斤拷锟斤拷锟?锟斤拷 锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : '(Control+Right) 锟斤拷锟斤拷锟?锟斤拷锟?,
    prevText          : '(Control+Left) 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
    monthYearText     : '(锟斤拷锟斤拷锟斤拷 锟斤拷锟?Control+Up/Down) 锟斤拷锟?锟斤拷锟斤拷',
    todayTip          : "锟斤拷锟?锟斤拷锟斤拷) {0})",
    format            : "d/m/Y",
    okText            : "&#160;锟斤拷锟斤拷锟?#160;",
    cancelText        : "锟斤拷锟斤拷锟?,
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "锟斤拷锟斤拷",
    afterPageText  : "{0} 锟斤拷锟斤拷",
    firstText      : "锟斤拷锟斤拷 锟斤拷锟斤拷锟?,
    prevText       : "锟斤拷锟斤拷 锟斤拷锟斤拷",
    nextText       : "锟斤拷锟斤拷 锟斤拷锟?,
    lastText       : "锟斤拷锟斤拷 锟斤拷锟斤拷锟?,
    refreshText    : "锟斤拷锟斤拷",
    displayMsg     : "锟斤拷锟斤拷 {0} - {1} 锟斤拷锟斤拷 {2}",
    emptyMsg       : '锟斤拷锟?锟斤拷锟斤拷 锟斤拷锟斤拷锟?
  });
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "{0} 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷锟斤拷锟?锟斤拷锟斤拷 锟斤拷 锟斤拷锟?,
    maxLengthText : "{0} 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷 锟斤拷锟?,
    blankText     : "锟斤拷锟?锟斤拷 锟斤拷锟斤拷锟?,
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "{0} 锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷锟斤拷锟?锟斤拷锟斤拷 锟斤拷 锟斤拷锟?,
    maxText : "{0} 锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷 锟斤拷锟?,
    nanText : "锟斤拷锟?锟斤拷 锟斤拷锟斤拷 {0}"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "锟斤拷锟斤拷锟斤拷",
    disabledDatesText : "锟斤拷锟斤拷锟斤拷",
    minText           : "{0} 锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷",
    maxText           : "{0} 锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷",
    invalidText       : "{1} 锟斤拷锟?锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷 - 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷 {0}",
    format            : "m/d/y",
    altFormats        : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
    startDay          : 0
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "...锟斤拷锟斤拷",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : '"user@example.com" 锟斤拷锟?锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷',
    urlText      : '"http:/'+'/www.example.com" 锟斤拷锟?锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷',
    alphaText    : '_锟斤拷锟?锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷 锟斤拷锟斤拷锟斤拷 锟?,
    alphanumText : '_锟斤拷锟?锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷 锟斤拷锟斤拷锟斤拷, 锟斤拷锟斤拷锟斤拷 锟?
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : ':锟斤拷锟?锟斤拷锟斤拷 锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷',
    buttonTips : {
      bold : {
        title: '(Ctrl+B) 锟斤拷锟斤拷锟?,
        text: '.锟斤拷锟斤拷 锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: '(Ctrl+I) 锟斤拷锟斤拷',
        text: '.锟斤拷锟?锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: '(Ctrl+U) 锟斤拷 锟斤拷锟斤拷',
        text: '.锟斤拷锟斤拷 锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: '锟斤拷锟斤拷 锟斤拷锟斤拷',
        text: '.锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: '锟斤拷锟斤拷 锟斤拷锟斤拷',
        text: '.锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: '锟斤拷锟?锟斤拷锟?锟斤拷锟斤拷锟?,
        text: '.锟斤拷锟?锟斤拷 锟斤拷锟?锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: '锟斤拷锟?锟斤拷锟斤拷',
        text: '.锟斤拷锟?锟斤拷 锟斤拷锟?锟斤拷锟斤拷锟?锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: '锟斤拷锟斤拷 锟斤拷锟斤拷锟?,
        text: '.锟斤拷锟?锟斤拷锟斤拷锟?锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: '锟斤拷锟斤拷 锟斤拷锟斤拷锟?,
        text: '.锟斤拷锟?锟斤拷锟斤拷锟?锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: '锟斤拷锟斤拷 锟斤拷锟斤拷锟?,
        text: '.锟斤拷锟?锟斤拷锟斤拷锟?锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: '锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷',
        text: '.锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: '锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷锟?,
        text: '.锟斤拷锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷锟?,
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: '锟斤拷锟斤拷锟?,
        text: '.锟斤拷锟斤拷 锟斤拷 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: '锟斤拷锟斤拷锟?锟斤拷锟?锟斤拷锟斤拷',
        text: '.锟斤拷锟?锟斤拷锟?锟斤拷锟斤拷',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷",
    sortDescText : "锟斤拷锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷",
    lockText     : "锟斤拷锟?锟斤拷锟斤拷锟?,
    unlockText   : "锟斤拷锟斤拷 锟斤拷锟斤拷锟?,
    columnsText  : "锟斤拷锟斤拷锟斤拷"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(锟斤拷锟?',
    groupByText    : '锟斤拷锟?锟斤拷锟斤拷锟斤拷锟?锟斤拷锟?锟斤拷锟?锟斤拷',
    showGroupsText : '锟斤拷锟?锟斤拷锟斤拷锟斤拷锟?
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "锟斤拷",
    valueText  : "锟斤拷锟?,
    dateFormat : "m/j/Y"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : ".锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷",
    collapsibleSplitTip : ".锟斤拷锟斤拷 锟斤拷锟斤拷锟斤拷 锟斤拷锟斤拷. 锟斤拷锟斤拷锟?锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷"
  });
}
