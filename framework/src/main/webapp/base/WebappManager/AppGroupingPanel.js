/**
 * 
 */
/**
 * 
 */
Rs.define('com.riambsoft.base.webappManager.AppGroupingPanel', {

	extend : Ext.grid.GridPanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {
		this.store = new Rs.ext.data.GroupingStore({
			autoLoad : false,
			autoDestroy : true,
			url : '../base/webapp.rsc',
			root : 'apps',
			idProperty : 'id',
			fields : [ 'id', 'name', 'code', 'remark', 'type', 'system'],
            groupField : 'system'
		});
		
		this.selModel = new Ext.grid.CheckboxSelectionModel({
			checkOnly : true
		});
		
		config = Rs.apply(config||{},{
			defaults : {
				width : 120,
				sortable : true
			},
			sm : this.selModel,
			colModel : new Ext.grid.ColumnModel({
				columns : [this.selModel, {
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

	        view: new Ext.grid.GroupingView({
	            forceFit:true,
	            groupTextTpl: '{text}'
	        })/*,
			
			bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 20,
                hasSlider : true,
                store : this.store,
                displayInfo : true
            })*/
		});

		com.riambsoft.base.webappManager.AppGroupingPanel.superclass.constructor.apply(
				this, arguments);
		
		this.store.on('load', this.setRights, this);
		this.store.load();
		this.currentApp = null;
		this.on('rowclick', this.onRowClick, this);
		this.selModel.on('rowselect', this.onAppSelect, this);
		this.selModel.on('rowdeselect', this.onAppDeselect, this);
		this.addEvents(['appunbind','appbind']);
	},

	onRowClick : function(grid, rowIndex, e){
	    if(grid.getSelectionModel().isSelected(rowIndex)){
	    	this.setCurrentApp(grid, rowIndex);
	    }
	},

	onAppSelect : function(sm, rowIndex, r){
	    this.setCurrentApp(sm.grid, rowIndex);
	},
	
	onAppDeselect : function(sm, rowIndex, r){
    	this.fireEvent('appunbind', this, r.get('id'));
	    if(this.currentApp == r.get('id')){
	    	this.currentApp = null;
	    }
	    this.getView().removeRowClass(rowIndex, 'rs-grid-rowclick');
	},
	
	setCurrentApp : function(grid, rowIndex){
		var newApp = grid.getStore().getAt(rowIndex).get('id'),
		view = grid.getView();
	    if(this.currentApp!==null){
	    	view.removeRowClass(this.currentApp, 'rs-grid-rowclick');
	    }
	    this.currentApp = newApp;
	    view.addRowClass(rowIndex, 'rs-grid-rowclick');
	    this.fireEvent('appbind', this, this.currentApp);
	},
	
	getSelections : function(){
		var selections = this.selModel.getSelections(),
		apps = [];
		if(!selections || selections.length<1){
			return null;
		}
		for(var i=0; i< selections.length; i++){
			apps.push(selections[i].get('id'));
		}
		return apps;
	},
	
	setRole : function(role){
		if(role!=null && this.currentRole == role){
			return;
		}
		this.clear();
		this.currentRole = role;
		this.setRights();
	},
	
	setRights : function(){
		if(this.currentRole){
			var service = new Rs.data.Service({
				url : '../base/webapp.rsc'
			});
			service.call({
				method : 'getAppsByRole',
				params : {
					roleId :this.currentRole.get('id')
				},
				accept : 'json'
			}, function(succ, result) {
				var apps = result.apps;
				if(apps){
					for(var i=0; i<apps.length; i++){
						this.store.each(function(r){
							if(r.get('id')==apps[i].id){
								this.selModel.selectRecords([r],true);
							}
						}, this);
					}
				}
			}, this);
		}
	},
	
	clear : function(){
		this.selModel.clearSelections();
		this.currentRole = null;
		this.currentApp = null;
		//this.store.load();
	}
});