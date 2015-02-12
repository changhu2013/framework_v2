Rs.define('com.riambsoft.base.userManager.UserGrid', {

	extend : Ext.grid.GridPanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {

		var store = new Rs.ext.data.Store({
			autoLoad : true,
			autoDestroy: true,
			url : '../base/user.rsc',
			root : 'users',
			fields : [ 'id', 'code', 'name', 'remark']
		});
		
		var sm = new Ext.grid.CheckboxSelectionModel({});

		config = Rs.applyIf(config || {}, {
			store : store,
			tbar : [ {
				text : '新增',
				scope : this,
				handler : this.authorize
			} ],
			sm : sm,
			colModel : new Ext.grid.ColumnModel({
				defaults : {
					width : 120,
					sortable : true
				},
				columns : [ sm, {
					xtype : 'actioncolumn',
					header : '操作',
					width : 100,
					align : 'center',
					items : [ {
						iconCls : 'rs-action-auth',
						tooltip : '授权',
						handler : this.authorize,
						scope : this
					} ]
				}, {
					header : '编号',
					width : 100,
					sortable : true,
					align : 'center',
					dataIndex : 'code'
				}, {
					header : '名称',
					dataIndex : 'name',
					width : 100
				}, {
					header : '备注',
					dataIndex : 'remark',
					width : 250
				} ]
			})
		});

		com.riambsoft.base.userManager.UserGrid.superclass.constructor.apply(
				this, arguments);
	},
	
	authorize : function(grid, index){
		if(grid && grid.getStore){
			this.currentUser = grid.getStore().getAt(index);
		} else{
			this.currentUser = null;
		}
		if(!this.authWin){
			this.authWin = new Ext.Window({
                title : '用户授权',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                draggable : false,
                resizable: false,
                closeAction : 'hide',
                items : [this.authPanel = new com.riambsoft.base.userManager.AuthPanel({
                })],
                buttonAlign : 'center',
                buttons : [{
                    text : '确定',
                    handler : this.doConfirm,
                    scope : this
                },{
                    text : '取消',
                    handler : this.doCancel,
                    scope : this
                }]
            });
		}
        this.authWin.show();
        this.authPanel.setUser(this.currentUser);
	},
	
	doConfirm : function(){
		Rs.Service.call({
			url : '../base/user.rsc',
			method : 'saveRofUserRole',
			params : {
				roles : this.authPanel.getSelRoles(),
				userId : this.currentUser.get('id')
			},
			accept : 'json'
		}, function(succ, result) {
			
		}, this);
		this.authWin.hide();
	},
	
	doCancel : function(){
		this.authWin.hide();
	}
	

});