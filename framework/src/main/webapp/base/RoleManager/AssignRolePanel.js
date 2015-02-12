Rs.define('com.riambsoft.base.roleManager.AssignRolePanel', {

	extend : Ext.Panel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {

		this.basePanel = new Ext.form.FormPanel({
			height : 100,
			region : 'north',
			padding : '20px 30px 0px 30px',
			items : [this.codeField = new Ext.form.TextField({
				fieldLabel : '角色编码*',
				width : '100%',
				readOnly : true
			}),this.nameField = new Ext.form.TextField({
				fieldLabel : '角色名称*',
				width : '100%',
				readOnly : true
			}),this.remarkField = new Ext.form.TextField({
				fieldLabel : '角色描述',
				width : '100%',
				readOnly : true
			})]
		});
		
		this.userPanel = new com.riambsoft.base.userManager.UserGrid({
			title : '可选用户',
			region : 'west',
			tbar :[],
			width : '52%',
			viewConfig : {
		        forceFit: true
			}
		});
		
		this.userPanel.setConfig(this.userPanel.colModel.config.splice(1,1));
		
		
		this.selUserPanel = new com.riambsoft.base.userManager.UserGrid({
			title : '已选用户',
			store : new Rs.ext.data.Store({
				autoLoad : false,
				autoDestroy : true,
				idProperty : 'id',
				root : 'users',
				fields : [ 'id', 'name', 'code', 'remark']
			}),
			tbar :[],
			bbar : [],
			region : 'east',
			width : '42%',
			viewConfig : {
		        forceFit: true
			}
		});
		this.selUserPanel.setConfig(this.selUserPanel.colModel.config.splice(1,1));
		//this.selectedRoles.remove(this.selectedRoles.getTopToolbar());
		
		this.opPanel = new Ext.Panel({
            region : 'center',
            width : '6%',
            frame : true,
            border : true,
            items : [new Ext.Button({
                tooltip : '添加',
                style : 'margin:100px 5px 20px 5px',
                iconCls : 'rs-action-goright',
                handler : this.onAppend,
                scope : this
            }), new Ext.Button({
                tooltip : '移除',
                style : 'margin:20px 5px 20px 5px',
                iconCls : 'rs-action-goleft',
                handler : this.onRemove,
                scope : this
            })
        ]
        });
		
		config = Rs.apply(config || {}, {
			layout : 'border',
			items : [this.basePanel, this.userPanel, this.selUserPanel, this.opPanel]
		});
		
		com.riambsoft.base.roleManager.AssignRolePanel.superclass.constructor.apply(this, arguments);
	},
	
	setRole : function(r){
		if(r){
			this.codeField.setValue(r.get('code'));
			this.nameField.setValue(r.get('name'));
			this.remarkField.setValue(r.get('remark'));
			Rs.Service.call({
				url : '../base/user.rsc',
				method : 'getUsersbyRole',
				params : {
					roleId : r.get('id')
				},
				accept : 'json'
			}, function(bs, result) {
				this.selUserPanel.getStore().loadData(result);        
			}, this);
    	} else{
    		this.codeField.reset();
    		this.nameField.reset();
    		this.remarkField.reset();
    		this.selUserPanel.getStore().removeAll();
    	}
	},
	
	onAppend : function(){
		var sm = this.userPanel.getSelectionModel();
		var selections = sm.getSelections();
		if(selections.length>0){
			this.selUserPanel.getStore().add(selections);
			sm.clearSelections();
		}else{
			Ext.Msg.alert("提示","请选择用户");
		}
	},
	
	onRemove : function(){
		var selections = this.selUserPanel.getSelectionModel().getSelections();
		if(selections.length>0){
			this.selUserPanel.getStore().remove(selections);
		} else{
			Ext.Msg.alert("提示","请选择要移除的角色");
		}
	},
	
	getSelUsers : function(){
		var store = this.selUserPanel.getStore(), selUsers = [];
		store.each(function(r){
			selUsers.push(r.get('id'));
		}, this);
		return selUsers;
	}


});