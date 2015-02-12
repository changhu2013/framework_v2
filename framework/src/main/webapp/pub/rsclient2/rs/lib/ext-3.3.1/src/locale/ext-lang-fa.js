/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Farsi (Persian) translation
 * By Mohaqa
 * 03-10-2007, 06:23 PM
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">丿乇 丨丕賱 亘丕乇诏匕丕乇蹖 ...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} 乇讴賵乇丿 丕賳鬲禺丕亘 卮丿赖";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "亘爻鬲賳";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "賲賯丿丕乇 賮蹖賱丿 氐丨蹖丨 賳蹖爻鬲";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "丿乇 丨丕賱 亘丕乇诏匕丕乇蹖 ...";
}

Date.monthNames = [
   "跇丕賳賵蹖赖",
   "賮賵乇蹖赖",
   "賲丕乇爻",
   "丌倬乇蹖賱",
   "賲蹖",
   "跇賵卅賳",
   "噩賵賱丕蹖",
   "丌诏賵爻鬲",
   "爻倬鬲丕賲亘乇",
   "丕讴鬲亘乇",
   "賳賵丕賲亘乇",
   "丿爻丕賲亘乇"
];

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

Date.dayNames = [
   "蹖讴卮賳亘赖",
   "丿賵卮賳亘赖",
   "爻赖 卮賳亘赖",
   "趩赖丕乇卮賳亘赖",
   "倬賳噩卮賳亘赖",
   "噩賲毓赖",
   "卮賳亘赖"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "鬲丕蹖蹖丿",
      cancel : "亘丕夭诏卮鬲",
      yes    : "亘賱赖",
      no     : "禺蹖乇"
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
    todayText         : "丕賲乇賵夭",
    minText           : "丕蹖賳 鬲丕乇蹖禺 賯亘賱 丕夭 賲丨丿賵丿赖 賲噩丕夭 丕爻鬲",
    maxText           : "丕蹖賳 鬲丕乇蹖禺 倬爻 丕夭 賲丨丿賵丿赖 賲噩丕夭 丕爻鬲",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : '賲丕赖 亘毓丿 (Control + Right)',
    prevText          : '賲丕赖 賯亘賱 (Control+Left)',
    monthYearText     : '蹖讴 賲丕赖 乇丕 丕賳鬲禺丕亘 讴賳蹖丿 (Control+Up/Down 亘乇丕蹖 丕賳鬲賯丕賱 丿乇 爻丕賱)',
    todayTip          : "{0} (Spacebar)",
    format            : "y/m/d",
    okText            : "&#160;OK&#160;",
    cancelText        : "Cancel",
    startDay          : 0
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "氐賮丨赖",
      afterPageText  : "丕夭 {0}",
      firstText      : "氐賮丨赖 丕賵賱",
      prevText       : "氐賮丨赖 賯亘賱",
      nextText       : "氐賮丨赖 亘毓丿",
      lastText       : "氐賮丨赖 丌禺乇",
      refreshText    : "亘丕夭禺賵丕賳蹖",
      displayMsg     : "賳賲丕蹖卮 {0} - {1} of {2}",
      emptyMsg       : '丿丕丿赖 丕蹖 亘乇丕蹖 賳賲丕蹖卮 賵噩賵丿 賳丿丕乇丿'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "丨丿丕賯賱 胤賵賱 丕蹖賳 賮蹖賱丿 亘乇丕亘乇 丕爻鬲 亘丕 {0}",
      maxLengthText : "丨丿丕讴孬乇 胤賵賱 丕蹖賳 賮蹖賱丿 亘乇丕亘乇 丕爻鬲 亘丕 {0}",
      blankText     : "丕蹖賳 賮蹖賱丿 亘丕蹖丿 賲賯丿丕乇蹖 丿丕卮鬲赖 亘丕卮丿",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "丨丿丕賯賱 賲賯丿丕乇 丕蹖賳 賮蹖賱丿 亘乇丕亘乇 丕爻鬲 亘丕 {0}",
      maxText : "丨丿丕讴孬乇 賲賯丿丕乇 丕蹖賳 賮蹖賱丿 亘乇丕亘乇 丕爻鬲 亘丕 {0}",
      nanText : "{0} 蹖讴 毓丿丿 賳蹖爻鬲"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "睾蹖乇賮毓丕賱",
      disabledDatesText : "睾蹖乇賮毓丕賱",
      minText           : "鬲丕乇蹖禺 亘丕蹖丿 倬爻 丕夭 {0} 亘丕卮丿",
      maxText           : "鬲丕乇蹖禺 亘丕蹖丿 倬爻 丕夭 {0} 亘丕卮丿",
      invalidText       : "{0} 鬲丕乇蹖禺 氐丨蹖丨蹖 賳蹖爻鬲 - 賮乇賲鬲 氐丨蹖丨 {1}",
      format            : "y/m/d",
      startDay          : 0
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "丿乇 丨丕賱 亘丕乇诏匕丕乇蹖 ...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '賲賯丿丕乇 丕蹖賳 賮蹖賱丿 亘丕蹖丿 蹖讴 丕蹖賲蹖賱 亘丕 丕蹖賳 賮乇賲鬲 亘丕卮丿 "user@example.com"',
      urlText      : '賲賯丿丕乇 丕蹖賳 丌丿乇爻 亘丕蹖丿 蹖讴 丌丿乇爻 爻丕蹖鬲 亘丕 丕蹖賳 賮乇賲鬲 亘丕卮丿 "http:/'+'/www.example.com"',
      alphaText    : '賲賯丿丕乇 丕蹖賳 賮蹖賱丿 亘丕蹖丿 賮賯胤 丕夭 丨乇賵賮 丕賱賮亘丕 賵 _ 鬲卮讴蹖賱 卮丿赖 亘丕卮丿 ',
      alphanumText : '賲賯丿丕乇 丕蹖賳 賮蹖賱丿 亘丕蹖丿 賮賯胤 丕夭 丨乇賵賮 丕賱賮亘丕貙 丕毓丿丕丿 賵 _ 鬲卮讴蹖賱 卮丿赖 亘丕卮丿'
   });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : '賱胤賮丕 丌丿乇爻 賱蹖賳讴 乇丕 賵丕乇丿 讴賳蹖丿:',
    buttonTips : {
      bold : {
        title: '鬲蹖乇赖 (Ctrl+B)',
        text: '賲鬲賳 丕賳鬲禺丕亘 卮丿赖 乇丕 鬲蹖乇赖 賲蹖 讴賳丿.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: '丕蹖鬲丕賱蹖讴 (Ctrl+I)',
        text: '賲鬲賳 丕賳鬲禺丕亘 卮丿赖 乇丕 丕蹖鬲丕賱蹖讴 賲蹖 讴賳丿.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: '夭蹖乇禺胤 (Ctrl+U)',
        text: '夭蹖乇 赖乇 賳賵卮鬲赖 蹖讴 禺胤 賳賲丕蹖卮 賲蹖 丿赖丿.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: '丕賮夭丕蹖卮 丕賳丿丕夭赖',
        text: '丕賳丿丕夭赖 賮賵賳鬲 乇丕 丕賮夭丕蹖卮 賲蹖 丿赖丿.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: '讴丕赖卮 丕賳丿丕夭赖',
        text: '丕賳丿丕夭赖 賲鬲賳 乇丕 讴丕赖卮 賲蹖 丿赖丿.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: '乇賳诏 夭賲蹖賳赖 賲鬲賳',
        text: '亘乇丕蹖 鬲睾蹖蹖乇 乇賳诏 夭賲蹖賳赖 賲鬲賳 丕爻鬲賮丕丿赖 賲蹖 卮賵丿.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: '乇賳诏 賯賱賲',
        text: '乇賳诏  賯賱賲 賲鬲賳 乇丕 鬲睾蹖蹖乇 賲蹖 丿赖丿.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: '趩蹖丿賳 賲鬲賳 丕夭 爻賲鬲 趩倬',
        text: '賲鬲賳 丕夭 爻賲鬲 趩倬 趩蹖丿赖 卮丿赖 賲蹖 卮賵丿.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: '賲鬲賳 丿乇 賵爻胤 ',
        text: '賳賲丕蹖卮 賲鬲賳 丿乇 賯爻賲鬲 賵爻胤 氐賮丨赖 賵 乇毓丕亘鬲 爻賲鬲 趩倬 賵 乇丕爻鬲.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: '趩蹖丿賳 賲鬲賳 丕夭 爻賲鬲 乇丕爻鬲',
        text: '賲鬲賳 丕夭 爻賲鬲 乇丕爻鬲 倬蹖丿赖 禺賵丕赖丿 卮丿.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: '賱蹖爻鬲 赖賲乇丕赖 亘丕 毓賱丕賲鬲',
        text: '蹖讴 賱蹖爻鬲 噩丿蹖丿 丕蹖噩丕丿 賲蹖 讴賳丿.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: '賱蹖爻鬲 毓丿丿蹖',
        text: '蹖讴 賱蹖爻鬲 毓丿丿蹖 丕蹖噩丕丿 賲蹖 讴賳丿. ',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: '賱蹖賳讴',
        text: '賲鬲賳 丕賳鬲禺丕亘 卮丿赖 乇丕 亘赖 賱蹖賳讴 鬲亘丿蹖賱 讴賳蹖丿.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: '賵蹖乇丕蹖卮 爻賵乇爻',
        text: '乇賮鬲賳 亘赖 丨丕賱鬲 賵蹖乇丕蹖卮 爻賵乇爻.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "賲乇鬲亘 爻丕夭蹖 丕賮夭丕蹖卮蹖",
      sortDescText : "賲乇鬲亘 爻丕夭蹖 讴丕赖卮蹖",
      lockText     : "賯賮賱 爻鬲賵賳 赖丕",
      unlockText   : "亘丕夭讴乇丿賳 爻鬲賵賳 赖丕",
      columnsText  : "爻鬲賵賳 赖丕"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "賳丕賲",
      valueText  : "賲賯丿丕乇",
      dateFormat : "Y/m/d"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "丿乇诏 亘乇丕蹖 鬲睾蹖蹖乇 丕賳丿丕夭赖.",
      collapsibleSplitTip : "亘乇丕蹖 鬲睾蹖蹖乇 丕賳丿丕夭赖 丿乇诏 讴賳蹖丿."
   });
}
