Rs.define('com.riambsoft.base.userManager.AuthPanel', {

	extend : Ext.Panel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {

		this.basePanel = new Ext.form.FormPanel({
			height : 100,
			region : 'north',
			padding : '20px 30px 0px 30px',
			items : [this.codeField = new Ext.form.TextField({
				fieldLabel : '用户编码*',
				width : '100%'
			}),this.nameField = new Ext.form.TextField({
				fieldLabel : '用户名称*',
				width : '100%'
			}),this.remarkField = new Ext.form.TextField({
				fieldLabel : '用户描述',
				width : '100%'
			})]
		});
		
		this.rolesPanel = new com.riambsoft.base.roleManager.RoleGrid({
			title : '可选角色',
			region : 'west',
			tbar :[],
			width : '52%',
			viewConfig : {
		        forceFit: true
			}
		});
		
		this.rolesPanel.setConfig(this.rolesPanel.colModel.config.splice(1,1));
		
		
		this.selRolesPanel = new com.riambsoft.base.roleManager.RoleGrid({
			title : '已选角色',
			store : new Rs.ext.data.Store({
				autoLoad : false,
				autoDestroy : true,
				idProperty : 'id',
				root : 'roles',
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
		this.selRolesPanel.setConfig(this.selRolesPanel.colModel.config.splice(1,1));
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
			items : [this.basePanel, this.rolesPanel, this.selRolesPanel, this.opPanel]
		});
		
		com.riambsoft.base.userManager.AuthPanel.superclass.constructor.apply(this, arguments);
	},
	
	setUser : function(user){
		if(user){
			this.codeField.setValue(user.get('code'));
			this.nameField.setValue(user.get('name'));
			this.remarkField.setValue(user.get('remark'));
			Rs.Service.call({
				url : '../base/role.rsc',
				method : 'getRolesbyUser',
				params : {
					userId : user.get('id')
				},
				accept : 'json'
			}, function(bs, result) {
				this.selRolesPanel.getStore().loadData(result);        
			}, this);
    	} else{
    		this.codeField.reset();
    		this.nameField.reset();
    		this.remarkField.reset();
    		this.selRolesPanel.getStore().removeAll();
    	}
	},
	
	onAppend : function(){
		var sm = this.rolesPanel.getSelectionModel();
		var selections = sm.getSelections();
		if(selections.length>0){
			this.selRolesPanel.getStore().add(selections);
			sm.clearSelections();
		}else{
			Ext.Msg.alert("提示","请选择角色");
		}
	},
	
	onRemove : function(){
		var selections = this.selRolesPanel.getSelectionModel().getSelections();
		if(selections.length>0){
			this.selRolesPanel.getStore().remove(selections);
		} else{
			Ext.Msg.alert("提示","请选择要移除的角色");
		}
	},
	
	getSelRoles : function(){
		var store = this.selRolesPanel.getStore(), selRoles = [];
		store.each(function(r){
			selRoles.push(r.get('id'));
		}, this);
		return selRoles;
	}


});