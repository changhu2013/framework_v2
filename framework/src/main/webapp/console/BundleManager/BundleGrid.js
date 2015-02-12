Rs.define('com.riambsoft.console.BundleGrid', {

	extend : Ext.grid.GridPanel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {

		Ext.QuickTips.init();

		var store = new Ext.data.Store({
			autoLoad : true ,
			reader : new Ext.data.JsonReader({
				idProperty : 'id',
				root : 'bundles',
				fields: [{
					name : 'id', 
					type : 'number'
				}, 'symbolicName', 'version', 'state', 'location','lastModification',
				         'registeredServices','importedPackages','exportedPackages',
				         'importingBundles','formedRS'] 
			})
		});
		
		store.on("load", this.onStoreLoad, this);
		
		var expander = new Rs.ext.grid.RowExpander({
	        tpl : new Ext.Template(
	            '<p><b>Last Modification:</b> {lastModification}</p><br>',
	            '<p><b>Registered Services:</b> {formedRS}</p><br>',
	            '<p><b>Imported Packages:</b> {importedPackages}</p><br>',
	            '<p><b>Exported Packages:</b> {exportedPackages}</p><br>',
	            '<p><b>Importing Bundles:</b> {importingBundles}</p><br>'
	        )
	    });

		config = Rs.apply(config || {}, {
			store : store,
			view : new Ext.grid.GridView({markDirty:false}),
			plugins : expander,
			tbar : [{
				text : '安装',
				scope : this,
				handler : this.installBundle
			}],
			colModel : new Ext.grid.ColumnModel({
				defaults : {
					width : 120,
					sortable : true
				},
				columns : [ expander, {
					xtype : 'actioncolumn',
					header : '操作',
					width : 100,
	                align : 'center',
	                items: [{
	                    iconCls : 'rs-action-bstop',
	                    tooltip : 'stop',
	                    getClass : function(v,metadata,r){
	                    	var state = r.get('state');
	                    	if(state!='32'){
	                    		return 'rs-button-hide';
	                    	} else{
	                    		metadata.css=metadata.css.replace(/(\s|\b)rs-button-hide(\s|\b)/,'');
	                    	}
	                    },
	                    handler : this.stopBundle,
	                    scope : this
	                },{
	                	iconCls : 'rs-action-bstart',
	                    tooltip : 'start',
	                    getClass : function(v,metadata,r){
	                    	var state = r.get('state');
	                    	if(state=='32'){
	                    		return 'rs-button-hide';
	                    	} else{
	                    		metadata.css=metadata.css.replace(/(\s|\b)rs-button-hide(\s|\b)/,'');
	                    	}
	                    },
	                    handler : this.startBundle,
	                    scope : this
	                },{
	                	iconCls : 'rs-action-brefresh',
	                    tooltip : 'refresh',
	                    handler : this.refreshBundle,
	                    scope : this
	                },{
	                	iconCls : 'rs-action-bupdate',
	                    tooltip : 'update',
	                    handler : this.updateBundle,
	                    scope : this
	                }/*
						 * ,{ iconCls : 'rs-action-buninstall', tooltip :
						 * 'uninstall', handler : this.uninstallBundle, scope :
						 * this }
						 */]
				}, {
					header : 'ID',
					width : 50,
					sortable : true,
					align : 'center',
					dataIndex : 'id'
				}, {
					header : '名称',
					dataIndex : 'symbolicName',
					width : 250
				}, {
					header : '版本',
					dataIndex : 'version',
					width : 150
				}, {
					header : '状态',
					dataIndex : 'state',
					width : 70,
					align : 'center',
					renderer : function(v){
						if(v == '2'){
							return 'installed';
						} else if(v == '32'){
							return 'active';
						} else {
							return 'resolved';
						}
					}
				}, {
					header : '位置',
					dataIndex : 'location',
					width : 550
				}]
			}),
		});

		com.riambsoft.console.BundleGrid.superclass.constructor.apply(this,
				arguments);
		
		Rs.Service.call({
			url : '../console/bundle.rsc',
			method : 'getAllBundles',
			accept : 'json'
		}, function(succ, bs) {
			store.loadData(bs);
		}, this);
	},
	
	onStoreLoad : function(store, records, options){
		if(records.length>0){
			var rs;
			for(var i = 0; i < records.length; i++){
				rs = records[i].get("registeredServices");
				if(rs=='None'){
					records[i].set("formedRS",rs);
				} else{
					var info = '';
					for(var j = 0; j < rs.length; j++){
						info += '<br/>';
						for(var k = 0; k < rs[j].length; k++){
							info += rs[j][k]+'<br/>';
						}
					}
					records[i].set("formedRS",info);
				}
			}
		}
	},
	
	stopBundle : function(comp, index){
		var record = comp.store.getAt(index);
		var bundleId = record.get('id');
		Rs.Service.call({
			params : { id : bundleId},
			url : '../console/bundle.rsc',
			method : 'stopBundle',
			accept : 'json'
		},function(succ, bs) {
			if(succ === true){
				record.set("state","4");
			} else{
				alert('stop failed');
			}
		});		
	},
	
	startBundle : function(comp, index){
		var record = comp.store.getAt(index);
		var bundleId = record.get('id');
		Rs.Service.call({
			params : { id : bundleId},
			url : '../console/bundle.rsc',
			method : 'startBundle',
			accept : 'json'
		},function(succ, bs) {
			if(succ === true){
				record.set("state","32");
			} else{
				alert('start failed');
			}
		});		
	},
	
	refreshBundle : function(comp, index){
		var record = comp.store.getAt(index);
		var bundleId = record.get('id');
		Rs.Service.call({
			params : { id : bundleId},
			url : '../console/bundle.rsc',
			method : 'refreshBundle',
			accept : 'json'
		},function(succ, bs) {
			if(succ === true){
				alert('refresh succed');
			} else{
				alert('refresh failed');
			}
		});		
	},
	
	/**
	 * 更新该Bundle，需要上传新版本的Bundle jar包
	 */
	updateBundle : function(comp, index){
		var record = comp.store.getAt(index);
		var bundleId = record.get('id');
		
		this.selectBundle('updateBundle', {id : bundleId});	
	},
	
	installBundle : function(o){
		this.selectBundle('installBundle');
	},
	
	selectBundle : function(method, params){
		var p = new Ext.Panel({
				layout : 'column',
				buttonAlign : 'center',
				items : [new Rs.ext.form.FormPanel({
					width : '100%',
					autoHeight : true,
					border : false,
					submitMethod : method,
					url:'bundle.rsc',
					padding : '40px 0px 0px 0px',
					fileUpload : true,
					labelAlign : 'right',
					items : [this.selectField = new Rs.ext.form.SingleUploadField({
							fieldLabel : 'Bundle文件' ,
							width : 260,
							buttonText : '选择',
							listeners : {
								fileselected : function(field , v){
									if(v.indexOf('.jar')>-1){
										this.cbutton.enable();
									} else{
										Ext.Msg.alert("警告","请选择jar文件");
										return;
									}
								}, 
								scope : this
							}
					})]
				})],
				buttons : [this.cbutton = new Ext.Button({
					text : '确定',
					scope : this,
					disabled : true,
					handler : this.bundleSelected.createDelegate(this, [params])
				}),{
					text : '取消',
					scope : this,
					handler : function(){
						this.installBundleWindow.close();
					}
					
				}]
			});
			this.installBundleWindow = new Ext.Window({
				title : '安装',
				modal : true,
				resizable : false,
				width : 400,
				height : 200,
				layout : 'fit',
				items : [p]
			});
		this.installBundleWindow.show();
	},
	
	bundleSelected : function(params){
		this.selectField.ownerCt.getForm().submit({
			params : params,
			clientValidation : false , 
			waitMsg: '正在上传...',
			success: function(field, o){
				if(o.result.success){
					Ext.MessageBox.alert('恭喜您', '上传成功！');
				}
			},
			failure : function(field, o){
				Ext.MessageBox.alert('提示', '上传失败！');	
			}
		});
		this.installBundleWindow.hide();
	},
	
	uninstallBundle : function(comp, index){
		var record = comp.store.getAt(index);
		var bundleId = record.get('id');
		Rs.Service.call({
			params : { id : bundleId},
			url : '../console/bundle.rsc',
			method : 'uninstallBundle',
			accept : 'json'
		},function(succ, bs) {
			if(succ === true){
				comp.store.removeAt(index);
			} else{
				alert('uninstall failed');
			}
		});		
	}
});