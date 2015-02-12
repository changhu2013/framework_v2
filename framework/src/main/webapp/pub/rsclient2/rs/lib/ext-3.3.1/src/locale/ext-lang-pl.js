/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Polish Translations
 * By vbert 17-April-2007
 * Updated by mmar 16-November-2007
 * Encoding: utf-8
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Wczytywanie danych...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} wybrano wiersze(y)";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zamknij zak艂adk臋";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Warto橹膰 tego pola jest niew艂a橹ciwa";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "Wczytywanie danych...";
}

Date.monthNames = [
    "Stycze艅",
    "Luty",
    "Marzec",
    "Kwiecie艅",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpie艅",
    "Wrzesie艅",
    "Pa藕dziernik",
    "Listopad",
    "Grudzie艅"
];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  Sty : 0,
  Lut : 1,
  Mar : 2,
  Kwi : 3,
  Maj : 4,
  Cze : 5,
  Lip : 6,
  Sie : 7,
  Wrz : 8,
  Pa藕 : 9,
  Lis : 10,
  Gru : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
    "Niedziela",
    "Poniedzia艂ek",
    "Wtorek",
    "艢roda",
    "Czwartek",
    "Pi膮tek",
    "Sobota"
];

Date.getShortDayName = function(day) {
	switch(day) {
		case 0: return 'ndz';
		case 1: return 'pon';
		case 2: return 'wt';
		case 3: return '橹r';
		case 4: return 'czw';
		case 5: return 'pt';				
		case 6: return 'sob';
                default: return '';
	}
};

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Anuluj",
      yes    : "Tak",
      no     : "Nie"
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
		todayText			: "Dzisiaj",
		minText				: "Data jest wcze橹niejsza od daty minimalnej",
		maxText				: "Data jest p贸藕niejsza od daty maksymalnej",
		disabledDaysText	: "",
		disabledDatesText	: "",
		monthNames			: Date.monthNames,
		dayNames			: Date.dayNames,
		nextText			: "Nast臋pny miesi膮c (Control+Strza艂kaWPrawo)",
		prevText			: "Poprzedni miesi膮c (Control+Strza艂kaWLewo)",
		monthYearText		: "Wybierz miesi膮c (Control+Up/Down aby zmieni膰 rok)",
		todayTip			: "{0} (Spacja)",
		format				: "Y-m-d",
		okText            	: "&#160;OK&#160;",
    	cancelText        	: "Anuluj",
    	startDay          	: 1
	});
}

if(Ext.PagingToolbar){
	Ext.apply(Ext.PagingToolbar.prototype, {
		beforePageText	: "Strona",
		afterPageText	: "z {0}",
		firstText		: "Pierwsza strona",
	    prevText		: "Poprzednia strona",
		nextText		: "Nast臋pna strona",
	    lastText		: "Ostatnia strona",
		refreshText		: "Od橹wie偶",
	    displayMsg		: "Wy橹wietlono {0} - {1} z {2}",
		emptyMsg		: "Brak danych do wy橹wietlenia"
	});
}

if(Ext.form.TextField){
	Ext.apply(Ext.form.TextField.prototype, {
	    minLengthText	: "Minimalna ilo橹膰 znak贸w dla tego pola to {0}",
		maxLengthText	: "Maksymalna ilo橹膰 znak贸w dla tego pola to {0}",
	    blankText		: "To pole jest wymagane",
		regexText		: "",
	    emptyText		: null
	});
}

if(Ext.form.NumberField){
	Ext.apply(Ext.form.NumberField.prototype, {
	    minText	: "Minimalna warto橹膰 dla tego pola to {0}",
	    maxText	: "Maksymalna warto橹膰 dla tego pola to {0}",
		nanText	: "{0} to nie jest w艂a橹ciwa warto橹膰"
	});
}

if(Ext.form.DateField){
	Ext.apply(Ext.form.DateField.prototype, {
	    disabledDaysText	: "Wy艂膮czony",
	    disabledDatesText	: "Wy艂膮czony",
		minText				: "Data w tym polu musi by膰 p贸藕niejsza od {0}",
	    maxText				: "Data w tym polu musi by膰 wcze橹niejsza od {0}",
		invalidText			: "{0} to nie jest prawid艂owa data - prawid艂owy format daty {1}",
	    format				: "Y-m-d",
    	altFormats    	    : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
    	startDay            : 1
	});
}

if(Ext.form.ComboBox){
	Ext.apply(Ext.form.ComboBox.prototype, {
		loadingText       : "Wczytuj臋...",
		valueNotFoundText : undefined
	});
}

if(Ext.form.VTypes){
	Ext.apply(Ext.form.VTypes, {
	    emailText		: 'To pole wymaga podania adresu e-mail w formacie: "nazwa@domena.pl"',
	    urlText			: 'To pole wymaga podania adresu strony www w formacie: "http:/'+'/www.domena.pl"',
		alphaText		: 'To pole wymaga podania tylko liter i _',
		alphanumText	: 'To pole wymaga podania tylko liter, cyfr i _'
	});
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Wprowad藕 adres URL strony:',
    buttonTips : {
      bold : {
        title: 'Pogrubienie (Ctrl+B)',
        text: 'Ustaw styl zaznaczonego tekstu na pogrubiony.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Kursywa (Ctrl+I)',
        text: 'Ustaw styl zaznaczonego tekstu na kursyw臋.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Podkre橹lenie (Ctrl+U)',
        text: 'Podkre橹l zaznaczony tekst.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Zwi臋ksz czcionk臋',
        text: 'Zwi臋ksz rozmiar czcionki.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Zmniejsz czcionk臋',
        text: 'Zmniejsz rozmiar czcionki.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Wyr贸偶nienie',
        text: 'Zmie艅 kolor wyr贸偶nienia zaznaczonego tekstu.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Kolor czcionki',
        text: 'Zmie艅 kolor zaznaczonego tekstu.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Do lewej',
        text: 'Wyr贸wnaj tekst do lewej.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Wy橹rodkuj',
        text: 'Wyr贸wnaj tekst do 橹rodka.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Do prawej',
        text: 'Wyr贸wnaj tekst do prawej.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Lista wypunktowana',
        text: 'Rozpocznij list臋 wypunktowan膮.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Lista numerowana',
        text: 'Rozpocznij list臋 numerowan膮.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Hiper艂膮cze',
        text: 'Przekszta艂膰 zaznaczony tekst w hiper艂膮cze.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Edycja 藕r贸d艂a',
        text: 'Prze艂膮cz w tryb edycji 藕r贸d艂a.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
	Ext.apply(Ext.grid.GridView.prototype, {
	    sortAscText		: "Sortuj rosn膮co",
	    sortDescText	: "Sortuj malej膮co",
		lockText		: "Zablokuj kolumn臋",
	    unlockText		: "Odblokuj kolumn臋",
		columnsText		: "Kolumny"
	});
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(None)',
    groupByText    : 'Grupuj po tym polu',
    showGroupsText : 'Poka偶 w grupach'
  });
}

if(Ext.grid.PropertyColumnModel){
	Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
	    nameText	: "Nazwa",
	    valueText	: "Warto橹膰",
		dateFormat	: "Y-m-d"
	});
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
	Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
	    splitTip			: "Przeci膮gnij aby zmieni膰 rozmiar.",
		collapsibleSplitTip	: "Przeci膮gnij aby zmieni膰 rozmiar. Kliknij dwukrotnie aby ukry膰."
	});
}
