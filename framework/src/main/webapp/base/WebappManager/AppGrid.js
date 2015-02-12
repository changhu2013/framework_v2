/**
 * 
 */
Rs.define('com.riambsoft.base.webappManager.AppGrid', {

	extend : Ext.grid.GridPanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {
		this.store = new Rs.ext.data.Store({
			autoLoad : false,
			autoDestroy : true,
			url : '../base/webapp.rsc',
			root : 'apps',
			idProperty : 'id',
			fields : [ 'id', 'name', 'code', 'remark',
					'type','system']
		});
		
		config = Rs.apply(config||{},{
			defaults : {
				width : 120,
				sortable : true
			},
			tbar : [{
				text : '同步',
				handler : this.synchronize,
				scope : this
			}],
			colModel : new Ext.grid.ColumnModel({
				columns : [{
					header : '应用名称',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'name'
				},{
					header : '系统名称',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'system'
				},{
					header : '类型',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'type'
				},{
					header : '备注',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'remark'
				}]
			}),
			
			store : this.store,
			
			bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 20,
                hasSlider : true,
                store : this.store,
                displayInfo : true
            })
		});

		com.riambsoft.base.webappManager.AppGrid.superclass.constructor.apply(
				this, arguments);
		
		this.store.load();
	},
	
	synchronize : function(){
		Rs.Service.call({
			url : '../base/webapp.rsc',
			method : 'appSynchronize',
			accept : 'json'
		}, function(succ, result) {
			this.store.loadData(result);
		}, this);
	}
});