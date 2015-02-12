Rs.define('com.riambsoft.home.LogoutPanel', {

	extend : Ext.Panel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {

		config = Rs.apply(config || {}, {
			buttons : [ {
				xtype : 'button',
				text : '登出',
				handler : this.logout,
				scope : this
			}, {
				xtype : 'button',
				text : '取消',
				handler : this.cancel.createDelegate(this, [ this ]),
				scope : this
			} ]
		});

		com.riambsoft.home.LogoutPanel.superclass.constructor.apply(this,
				arguments);
	},

	// 登出
	logout : function() {
		var service = new Rs.data.Service({
			url : 'login.rsc'
		});
		service.call({
			method : 'logout'
		}, function(succ, result, code, msg) {
			if (succ === true) {
				window.location.href = 'login.jsp'
			} else {
				alert('错误编码:' + code + ' ' + msg);
			}
		}, this);
	},

	// 取消
	cancel : function() {

	}
});
