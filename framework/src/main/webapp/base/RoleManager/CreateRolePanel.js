Rs.define('com.riambsoft.base.roleManager.CreateRolePanel', {

	extend : Ext.Panel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {

		this.basePanel = new Ext.form.FormPanel({
			height : 100,
			region : 'north',
			padding : '20px 30px 0px 30px',
			items : [this.codeField = new Ext.form.TextField({
				fieldLabel : '角色编码*',
				width : '100%'
			}),this.nameField = new Ext.form.TextField({
				fieldLabel : '角色名称*',
				width : '100%'
			}),this.remarkField = new Ext.form.TextField({
				fieldLabel : '角色描述',
				width : '100%'
			})]
		});
		
		this.appPanel = new com.riambsoft.base.webappManager.AppGroupingPanel({
			region : 'west',
			width : '45%'
		});
				
		this.rsMethodGrid = new com.riambsoft.base.roleManager.RsMethodPanel({
			region : 'east',
			width : '45%',
			viewConfig : {
		        forceFit: true
			}
		});
		
		this.blankPanel = new Ext.Panel({
            region : 'center',
            width : '%1',
            frame : true,
            border : true
        });
		
		config = Rs.apply(config || {}, {
			layout : 'border',
			items : [this.basePanel, this.appPanel, this.blankPanel, this.rsMethodGrid]
		});
		
		com.riambsoft.base.roleManager.CreateRolePanel.superclass.constructor.apply(this, arguments);
		
		/*this.appPanel.sm.on('rowselect', function(sm, rowIndex, r){
			this.rsMethodGrid.onAppSelect(r.get('id'));
		}, this);*/
		
		this.appPanel.getSelectionModel().on('rowdeselect', function(sm, rowIndex, r){
			this.rsMethodGrid.onAppDeselect(r.get('id'));
		}, this);
		
		this.appPanel.on('appbind', function(p, appId){
			this.rsMethodGrid.bindApp(appId);
		}, this);
		this.appPanel.on('appunbind', function(p, appId){
			this.rsMethodGrid.unbindApp(appId);
		}, this);
	},

	onNodeClick : function(node, e){
		this.currentNode = node;
		node.clicked = true;
    	if(node.leaf && node.getUI().isChecked() && node.attributes.services && node.attributes.services.length>0){
    		var services = [];
    		for(var i=0; i<node.attributes.services.length; i++){
    			services[i]=node.attributes.services[i].id;
    		}
    		Rs.Service.call({
    			url : 'role.rsc',
    			method : 'getRightPoint',
    			params : {
    				services : services
    			},
    			accept : 'json'
    		}, function(bs) {
    			this.rightPointStore.loadData(bs); 
        		this.sm.selectAll();              
    		}, this);
    	} else{
    		this.rightPointStore.loadData({rightpoints : []}); 
    	}
    },
    
    getSelections : function(){
    	/*var selectedApps = this.appPanel.getSelections();
    	if(selectedApps[0] && selectedApps[0]=='all'){
    		return selectedApps;
    	}
    	var flag = false;
    	for(var j=0; j<selectedApps.length; j++){
    		for(var i=0; i<this.selections.length; i++){
    			if(this.selections[i].indexOf(selectedApps[j])>-1){
    				flag=true;
    			}
    		}    		
    		if(!flag){
    			this.selections.push(selectedApps[j]);
    		}else{
    			flag = false;
    		}
    	}*/
    	
    	var apps = this.appPanel.getSelections();
    	if(!apps){
    		return null;
    	}
    	return {
    		selectedApps : apps,
    		deselectMethods : this.rsMethodGrid.getDeselections()
    	};
    },
    
    onRowSelect : function(sm, rowIndex, r){
    	this.selections.push(this.currentNode.attributes.path+"/"+r.get("id"));
    },
    
    onRowDeselect : function(sm, rowIndex, r){
    	for(var i=0; i<this.selections.length; i++){
    		if(this.selections[i]==this.currentNode.attributes.path+"/"+r.get("id")){
    			this.selections.splice(i,1);
    			this.appPanel.deselectRoot();
    		}
    	}
    },
    
    getCode : function(){
    	return this.codeField.getValue();
    },
    
    getName : function(){
    	return this.nameField.getValue();
    },
    
    getRemark : function(){
    	return this.remarkField.getValue();
    },
    
    setRole : function(role){
    	this.currentRole = role;
    	this.rsMethodGrid.setRole(role);
    	this.appPanel.setRole(role);
    	if(role){
    		this.codeField.setValue(role.get('code'));
    		this.nameField.setValue(role.get('name'));
    		this.remarkField.setValue(role.get('remark'));
    	} else{
    		this.codeField.reset();
    		this.nameField.reset();
    		this.remarkField.reset();
    	}
    }
    
    

});