Rs.define('rs.home.applicationManager.ApplicationGridPanel', {

	extend : Ext.grid.GridPanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {
		
		rs.home.applicationManager.ApplicationGridPanel.superclass.constructor
				.apply(this, arguments);
	}

});