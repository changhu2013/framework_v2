Rs.define('com.riambsoft.home.LoginPanel', {

	extend : Ext.Panel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {

		var width = 280;

		this.company = new Ext.form.ComboBox({
			fieldLabel : '公司',
			labelSeparator : ':',
			width : width,
			editable : false,
			allowBlank : false,
			selectOnFocus : true,
			allowBlank : false,
			displayField : 'name',
			valueField : 'code',
			emptyText : '请选择公司',
			mode : 'local',
			triggerAction : 'all',
			store : new Ext.data.Store({
				autoLoad : false,
				reader : this.companyStore = new Ext.data.JsonReader({
					idProperty : 'code',
					root : 'company',
					fields : [ 'code', 'name' ]
				})
			})
		});

		this.userCode = new Ext.form.TextField({
			fieldLabel : '用户名',
			labelSeparator : ':',
			width : width,
			allowBlank : false,
			invalidText : '用户名不能为空!'
		});

		this.password = new Ext.form.TextField({
			fieldLabel : '密码 ',
			labelSeparator : ':',
			width : width,
			allowBlank : false,
			invalidText : '密码不能为空!',
			inputType : 'password',
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == Ext.EventObject.ENTER) {
						this.login();
					}
				},
				scope : this
			}
		});

		this.message = new Ext.form.Label({
			width : width,
			hidden : true,
			style : 'color:red;padding-left:65px;font-size:12px;'
		});

		config = Rs.apply(config || {},
				{
					xtype : 'panel',
					layout : 'form',
					labelAlign : 'right',
					labelWidth : 60,
					items : [ {
						style : 'margin-top:20px;',
						border : false
					}, /* this.company, */this.userCode, this.password,
							this.message ],
					buttonAlign : 'center',
					buttons : [ {
						xtype : 'button',
						text : '登录',
						handler : this.login,
						scope : this
					}, {
						xtype : 'button',
						text : '重置',
						handler : this.reset,
						scope : this
					} ]
				});

		com.riambsoft.home.LoginPanel.superclass.constructor.apply(this,
				arguments);
	},

	login : function() {

		if (!this.userCode.validate() || !this.password.validate()) {
			return;
		}

		var service = new Rs.data.Service({
			url : 'login.rsc',
			method : 'login'
		});

		var uc = this.userCode.getValue(), ps = this.password.getValue();

		service.call({
			params : {
				userCode : uc,
				password : ps
			}
		}, function(succ, result, code, msg) {
			if (succ === true) {
				window.location.href = 'index.jsp'
			} else {
				this.message.setText(msg + ' 错误编码:' + code)
				this.message.show();
			}
		}, this);
	},

	reset : function() {
		this.userCode.reset();
		this.password.reset();
		this.message.setText('')
		this.message.hide();
		if (this.companyStore.getCount() > 0) {
			var company = this.companyStore.getAt(0);
			var companyCode = company.get('code');
			this.company.setValue(companyCode);
		}
	}
});