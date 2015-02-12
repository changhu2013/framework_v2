Rs.define('com.riambsoft.weibo.UserGrid', {

	extend : Ext.grid.GridPanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {

		var store = new Ext.data.Store({
			//autoLoad : true ,
			//url : 
			reader : new Ext.data.JsonReader({
				idProperty : 'id',
				root : 'users',
				fields: ['id', 'code','name','password','email'] 
			})
		});

		config = Rs.apply(config || {}, {
			store : store,
			view : new Ext.grid.GridView({markDirty:false}),
			colModel : new Ext.grid.ColumnModel({
				defaults : {
					width : 120,
					sortable : true
				},
				columns : [ {
					header : 'id',
					width : 100,
					sortable : true,
					dataIndex : 'id'
				}, {
					header : 'code',
					dataIndex : 'code',
					width : 150
				}, {
					header : 'name',
					dataIndex : 'name',
					width : 150
				}, {
					header : 'password',
					dataIndex : 'password',
					width : 150
				}, {
					header : 'email',
					dataIndex : 'email',
					width : 150
				}]
			}),
		});

		com.riambsoft.weibo.UserGrid.superclass.constructor.apply(this,
				arguments);

		Rs.Service.call({
			url : 'user.rsc',
			method : 'getAllUser',
			accept : 'json'
		}, function(bs) {
			store.loadData(bs);
		}, this);
	}
});