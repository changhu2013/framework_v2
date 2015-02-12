/**
 * 
 */
Rs.define('com.riambsoft.base.roleManager.RsMethodPanel', {

	extend : Ext.grid.GridPanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {
		this.store = new Rs.ext.data.Store({
			autoLoad : false,
			autoDestroy : true,
			autoSave : false,
			url : '../base/rsmethod.rsc',
			root : 'methods',
			idProperty : 'id',
			fields : [ 'id', 'controller', 'service', 'method', 'remark'],
		});
		
		this.selModel = new Ext.grid.CheckboxSelectionModel({});
		
		config = Rs.apply(config||{},{
			defaults : {
				width : 120,
				sortable : true
			},
			sm : this.selModel,
			colModel : new Ext.grid.ColumnModel({
				columns : [this.selModel, {
					header : '方法',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'method'
				}, {
					header : '方法名称',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'remark'
				},{
					header : '控制器',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'controller'
				},{
					header : '服务',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'service'
				}]
			}),
			
			store : this.store/*,
			
			bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 20,
                hasSlider : true,
                store : this.store,
                displayInfo : true
            })*/
		});

		com.riambsoft.base.roleManager.RsMethodPanel.superclass.constructor.apply(
				this, arguments);
		
		this.currentApp = null;
		this.deselections = {};
		this.selModel.on('rowselect', this.onRowSelect, this);
		this.selModel.on('rowdeselect', this.onRowDeselect, this);
	},
	
	onAppDeselect : function(appId){
		if(this.deselections.appId){
			delete this.deselections.appId;
		}
	},
	
	onRowSelect : function(sm, rowIndex, r){
		var methods = this.deselections[this.currentApp];
		for(var i=0; i<methods.length; i++){
			if(methods[i]==r.get('id')){
				methods.splice(i,1);
				break;
			}
		}
	},
	
	onRowDeselect : function(sm, rowIndex, r){
		var methods = this.deselections[this.currentApp]
		if(!methods){
			methods = [];
		}
		methods.push(r.get('id'));
		this.deselections[this.currentApp] = methods;
	},
	
	bindApp : function(appId){
		this.currentApp = appId;

		var service = new Rs.data.Service({
			url : '../base/rsmethod.rsc'
		});
		service.call({
			method : 'getMethodsByApp',
			params : {
				appId : appId
			},
			accept : 'json'
		}, function(succ, result) {
			this.store.loadData(result);
			this.selModel.suspendEvents();
			this.selModel.selectAll();
			this.selModel.resumeEvents();
			if(this.currentRole){
				service.call({
					method : 'getMethodsByAppRole',
					params : {
						appId : appId,
						roleId : this.currentRole.get('id')
					},
					accept : 'json'
				}, function(succ, result) {
					var methods = result.methods;
					if(result.methods){
						for(var i=0; i<methods.length; i++){
							this.store.each(function(r){
								if(r.get('id') = methods[i].id){
									this.selModel.deselectRow(this.store.indexOf(r));
								}
							}, this);
						}
					}
				})
			}
		}, this);
	},
	
	unbindApp : function(appId){
		if(this.currentApp == appId){
			this.suspendEvents();
			this.store.removeAll();
			this.resumeEvents();
		} 
		delete this.deselections.appId;
	},
	
	getDeselections : function(){
		return this.deselections;
	},
	
	setRole : function(role){
		if(role!=null && this.currentRole == role){
			return;
		}
		this.clear();
		this.currentRole = role;
	},
	
	clear : function(){
		this.store.removeAll();
		this.deselections = {};
		this.currentRole = null;
		this.currentApp = null;
	}
});