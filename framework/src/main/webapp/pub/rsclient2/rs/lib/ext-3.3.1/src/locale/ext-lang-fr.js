/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
锘?*
 * France (France) translation
 * By Thylia
 * 09-11-2007, 02:22 PM
 * updated by disizben (22 Sep 2008)
 * updated by Thylia (20 Apr 2010)
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">En cours de chargement...</div>';

if(Ext.DataView){
   Ext.DataView.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} ligne{1} s茅lectionn茅e{1}";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "En cours de chargement...";
}

Date.shortMonthNames = [
   "Janv",
   "F茅vr",
   "Mars",
   "Avr",
   "Mai",
   "Juin",
   "Juil",
   "Ao没t",
   "Sept",
   "Oct",
   "Nov",
   "D茅c"
];

Date.getShortMonthName = function(month) {
  return Date.shortMonthNames[month];
};

Date.monthNames = [
   "Janvier",
   "F茅vrier",
   "Mars",
   "Avril",
   "Mai",
   "Juin",
   "Juillet",
   "Ao没t",
   "Septembre",
   "Octobre",
   "Novembre",
   "D茅cembre"
];

Date.monthNumbers = {
  "Janvier" : 0,
  "F茅vrier" : 1,
  "Mars" : 2,
  "Avril" : 3,
  "Mai" : 4,
  "Juin" : 5,
  "Juillet" : 6,
  "Ao没t" : 7,
  "Septembre" : 8,
  "Octobre" : 9,
  "Novembre" : 10,
  "D茅cembre" : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[Ext.util.Format.capitalize(name)];
};

Date.dayNames = [
   "Dimanche",
   "Lundi",
   "Mardi",
   "Mercredi",
   "Jeudi",
   "Vendredi",
   "Samedi"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

Date.parseCodes.S.s = "(?:er)";

Ext.override(Date, {
    getSuffix : function() {
        return (this.getDate() == 1) ? "er" : "";
    }
});

if(Ext.MessageBox){
    Ext.MessageBox.buttonText = {
        ok     : "OK",
        cancel : "Annuler",
        yes    : "Oui",
        no     : "Non"
    };
}

if(Ext.util.Format){
    Ext.util.Format.date = function(v, format){
        if(!v) return "";
        if(!Ext.isDate(v)) v = new Date(Date.parse(v));
        return v.dateFormat(format || "d/m/Y");
    };
    Ext.util.Format.plural = function(v, s, p) {
        return v + ' ' + (v <= 1 ? s : (p ? p : s + 's'));
    };
}

if(Ext.DatePicker){
    Ext.apply(Ext.DatePicker.prototype, {
        todayText         : "Aujourd'hui",
        minText           : "Cette date est ant茅rieure 脿 la date minimum",
        maxText           : "Cette date est post茅rieure 脿 la date maximum",
        disabledDaysText  : "",
        disabledDatesText : "",
        monthNames        : Date.monthNames,
        dayNames          : Date.dayNames,
        nextText          : 'Mois suivant (CTRL+Fl猫che droite)',
        prevText          : "Mois pr茅c茅dent (CTRL+Fl猫che gauche)",
        monthYearText     : "Choisissez un mois (CTRL+Fl猫che haut ou bas pour changer d'ann茅e.)",
        todayTip          : "{0} (Barre d'espace)",
        okText            : "&#160;OK&#160;",
        cancelText        : "Annuler",
        format            : "d/m/y",
        startDay          : 1
    });
}

if(Ext.PagingToolbar){
    Ext.apply(Ext.PagingToolbar.prototype, {
        beforePageText : "Page",
        afterPageText  : "sur {0}",
        firstText      : "Premi猫re page",
        prevText       : "Page pr茅c茅dente",
        nextText       : "Page suivante",
        lastText       : "Derni猫re page",
        refreshText    : "Actualiser la page",
        displayMsg     : "Page courante {0} - {1} sur {2}",
        emptyMsg       : 'Aucune donn茅e 脿 afficher'
    });
}

if(Ext.form.BasicForm){
    Ext.form.BasicForm.prototype.waitTitle = "Veuillez patienter...";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "La valeur de ce champ est invalide";
}

if(Ext.form.TextField){
    Ext.apply(Ext.form.TextField.prototype, {
        minLengthText : "La longueur minimum de ce champ est de {0} caract猫re(s)",
        maxLengthText : "La longueur maximum de ce champ est de {0} caract猫re(s)",
        blankText     : "Ce champ est obligatoire",
        regexText     : "",
        emptyText     : null
    });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      decimalSeparator : ",",
      decimalPrecision : 2,
      minText : "La valeur minimum de ce champ doit 锚tre de {0}",
      maxText : "La valeur maximum de ce champ doit 锚tre de {0}",
      nanText : "{0} n'est pas un nombre valide"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "D茅sactiv茅",
      disabledDatesText : "D茅sactiv茅",
      minText           : "La date de ce champ ne peut 锚tre ant茅rieure au {0}",
      maxText           : "La date de ce champ ne peut 锚tre post茅rieure au {0}",
      invalidText       : "{0} n'est pas une date valide - elle doit 锚tre au format suivant: {1}",
      format            : "d/m/y",
      altFormats        : "d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d",
      startDay          : 1
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "En cours de chargement...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Ce champ doit contenir une adresse email au format: "usager@example.com"',
      urlText      : 'Ce champ doit contenir une URL au format suivant: "http:/'+'/www.example.com"',
      alphaText    : 'Ce champ ne peut contenir que des lettres et le caract猫re soulign茅 (_)',
      alphanumText : 'Ce champ ne peut contenir que des caract猫res alphanum茅riques ainsi que le caract猫re soulign茅 (_)'
   });
}

if(Ext.form.HtmlEditor){
   Ext.apply(Ext.form.HtmlEditor.prototype, {
      createLinkText : "Veuillez entrer l'URL pour ce lien:",
          buttonTips : {
              bold : {
                  title: 'Gras (Ctrl+B)',
                  text: 'Met le texte s茅lectionn茅 en gras.',
                  cls: 'x-html-editor-tip'
              },
              italic : {
                  title: 'Italique (Ctrl+I)',
                  text: 'Met le texte s茅lectionn茅 en italique.',
                  cls: 'x-html-editor-tip'
              },
              underline : {
                  title: 'Soulign茅 (Ctrl+U)',
                  text: 'Souligne le texte s茅lectionn茅.',
                  cls: 'x-html-editor-tip'
              },
              increasefontsize : {
                  title: 'Agrandir la police',
                  text: 'Augmente la taille de la police.',
                  cls: 'x-html-editor-tip'
              },
              decreasefontsize : {
                  title: 'R茅duire la police',
                  text: 'R茅duit la taille de la police.',
                  cls: 'x-html-editor-tip'
              },
              backcolor : {
                  title: 'Couleur de surbrillance',
                  text: 'Modifie la couleur de fond du texte s茅lectionn茅.',
                  cls: 'x-html-editor-tip'
              },
              forecolor : {
                  title: 'Couleur de police',
                  text: 'Modifie la couleur du texte s茅lectionn茅.',
                  cls: 'x-html-editor-tip'
              },
              justifyleft : {
                  title: 'Aligner 脿 gauche',
                  text: 'Aligne le texte 脿 gauche.',
                  cls: 'x-html-editor-tip'
              },
              justifycenter : {
                  title: 'Centrer',
                  text: 'Centre le texte.',
                  cls: 'x-html-editor-tip'
              },
              justifyright : {
                  title: 'Aligner 脿 droite',
                  text: 'Aligner le texte 脿 droite.',
                  cls: 'x-html-editor-tip'
              },
              insertunorderedlist : {
                  title: 'Liste 脿 puce',
                  text: 'D茅marre une liste 脿 puce.',
                  cls: 'x-html-editor-tip'
              },
              insertorderedlist : {
                  title: 'Liste num茅rot茅e',
                  text: 'D茅marre une liste num茅rot茅e.',
                  cls: 'x-html-editor-tip'
              },
              createlink : {
                  title: 'Lien hypertexte',
                  text: 'Transforme en lien hypertexte.',
                  cls: 'x-html-editor-tip'
              },
              sourceedit : {
                  title: 'Code source',
                  text: 'Basculer en mode 茅dition du code source.',
                  cls: 'x-html-editor-tip'
              }
        }
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Tri croissant",
      sortDescText : "Tri d茅croissant",
      columnsText  : "Colonnes"
   });
}

if(Ext.grid.GroupingView){
   Ext.apply(Ext.grid.GroupingView.prototype, {
      emptyGroupText : '(Aucun)',
      groupByText    : 'Grouper par ce champ',
      showGroupsText : 'Afficher par groupes'
   });
}

if(Ext.grid.PropertyColumnModel){
    Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
        nameText   : "Propri茅t茅",
        valueText  : "Valeur",
        dateFormat : "d/m/Y",
        trueText   : "vrai",
        falseText  : "faux"
    });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Cliquer et glisser pour redimensionner le panneau.",
      collapsibleSplitTip : "Cliquer et glisser pour redimensionner le panneau. Double-cliquer pour le cacher."
   });
}

if(Ext.form.TimeField){
   Ext.apply(Ext.form.TimeField.prototype, {
      minText     : "L'heure de ce champ ne peut 锚tre ant茅rieure 脿 {0}",
      maxText     : "L'heure de ce champ ne peut 锚tre post茅rieure 脿 {0}",
      invalidText : "{0} n'est pas une heure valide",
      format      : "H:i",
      altFormats  : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|h a|g a|g A|gi|hi|Hi|gia|hia|g|H"
   });
}

if(Ext.form.CheckboxGroup){
  Ext.apply(Ext.form.CheckboxGroup.prototype, {
    blankText : "Vous devez s茅lectionner au moins un 茅l茅ment dans ce groupe"
  });
}

if(Ext.form.RadioGroup){
  Ext.apply(Ext.form.RadioGroup.prototype, {
    blankText : "Vous devez s茅lectionner au moins un 茅l茅ment dans ce groupe"
  });
}
