/**
 * 
 */
Rs.define('com.riambsoft.base.roleManager.RoleGrid', {

	extend : Ext.grid.GridPanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {
		this.store = new Rs.ext.data.Store({
			autoLoad : true,
			autoDestroy : true,
			url : '../base/role.rsc',
			root : 'roles',
			idProperty : 'id',
			fields : [ 'id', 'name', 'code', 'remark'],
		});
		
		var sm = new Ext.grid.CheckboxSelectionModel({});
		
		config = Rs.applyIf(config||{},{
			defaults : {
				width : 120,
				sortable : true
			},
			tbar : [{
				text : '新增',
				handler : this.editRole,
				scope : this
			}],
			sm : sm,
			colModel : new Ext.grid.ColumnModel({
				columns : [sm, {
					xtype : 'actioncolumn',
					header : '操作',
					width : 100,
					align : 'center',
					items : [ {
						iconCls : 'rs-action-modify',
						tooltip : '授权',
						handler : this.editRole,
						scope : this
					},{
						iconCls : 'rs-action-auth',
						tooltip : '分配',
						handler : this.assignRole,
						scope : this
					} ]
				},{
					header : '角色编码',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'code'
				},{
					header : '角色名称',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'name'
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

		com.riambsoft.base.roleManager.RoleGrid.superclass.constructor.apply(
				this, arguments);
	},
	
	editRole : function(grid, index){
		if(grid && grid.getStore){
			this.role = grid.getStore().getAt(index);
		} else{
			this.role = null;
		}
		if(!this.addRoleWin){
			this.addRoleWin = new Ext.Window({
	            title : '角色定义',
	            width : 800,
	            height : 600,
	            layout : 'fit',
	            modal : true,
	            draggable : false,
	            resizable: false,
	            closeAction : 'hide',
	            items : [this.roleDefPanel = new com.riambsoft.base.roleManager.CreateRolePanel({
	            	doType : 'create'
	            })],
	            buttonAlign : 'center',
	            buttons : [{
	            	text : '确定',
	                handler : this.doConfirm,
	                scope : this
	            }, {
	                text : '取消',
	                handler : function(){
	            		this.addRoleWin.hide();
	            	},
	                scope : this
	            }]
	        });
		}
		this.addRoleWin.show();
		this.roleDefPanel.setRole(this.role);
	},
	
	assignRole : function(grid, index){
		this.arole = grid.getStore().getAt(index);
		if(!this.assignRoleWin){
			this.assignRoleWin = new Ext.Window({
	            title : '角色定义',
	            width : 800,
	            height : 600,
	            layout : 'fit',
	            modal : true,
	            draggable : false,
	            resizable: false,
	            closeAction : 'hide',
	            items : [this.assginPanel = new com.riambsoft.base.roleManager.AssignRolePanel({
	            	doType : 'create'
	            })],
	            buttonAlign : 'center',
	            buttons : [{
	            	text : '确定',
	                handler : this.doAssign,
	                scope : this
	            }, {
	                text : '取消',
	                handler : function(){
	            		this.assginPanel.hide();
	            	},
	                scope : this
	            }]
	        });
		}
		this.assignRoleWin.show();
		this.assginPanel.setRole(this.arole);
	},
	
	doAssign : function(){
		Rs.Service.call({
			url : '../base/role.rsc',
			method : 'saveRofRoleUser',
			params : {
				roleId : this.arole.get('id'),
				users : this.assginPanel.getSelUsers()
			},
			accept : 'json'
		}, function(succ, result) {
			
		}, this);
		this.assignRoleWin.hide();
	},
	
	doConfirm : function(){
		if(this.role){
			Rs.Service.call({
				url : '../base/role.rsc',
				method : 'saveRights',
				params : {
					roleId : this.role.get('id'),
					rights : this.roleDefPanel.getSelections()
				},
				accept : 'json'
			}, function(succ, result) {
				
			}, this);
			this.addRoleWin.hide();
			return;
		}
		
		var code = this.roleDefPanel.getCode();
		var name = this.roleDefPanel.getName();
		if(!code || !name){
			Ext.Msg.alert("提示","带*号的为必输 项");
			return;
		} 
		
		Rs.Service.call({
			url : '../base/role.rsc',
			method : 'isExist',
			params : {
				roleId : code
			},
			accept : 'json'
		}, function(succ, result){
			if(!result.exist){
				Rs.Service.call({
					url : '../base/role.rsc',
					method : 'saveRole',
					params : {
						role : {
							name : name,
							code : code,
							remark : this.roleDefPanel.getRemark()
						},
						rights : this.roleDefPanel.getSelections()
					},
					accept : 'json'
				}, function(succ, result) {
					if(result.role){
						this.store.reload();
					}
					this.addRoleWin.close();
				}, this);
			} else{
				Ext.Msg.alert("提示","角色已存在，请修改角色编码");
			}
		}, this);
		this.addRoleWin.hide();
	}
});