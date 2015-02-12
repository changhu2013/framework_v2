R = (function() {
	
	return {

		name : '应用管理',

		js : [ 'AppGrid.js', 'AppGroupingPanel.js'],
		
		type : 'WEBAPP',
		
		css : ['resource/css/main.css'],
		
		objCfg : 'com.riambsoft.base.webappManager.AppGrid',
		
		services : ['base_webapp_appSynchronize']

	};

})();