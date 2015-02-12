R = (function() {
	return {

		name : '控制面板',
		
		objCfg : {
			
			clazz : 'Rs.app.LittleEngine',
			
			cfg : {
				shell : 'tab',
				apps : [ {
					folder : 'ApplicationManager',
					region : 'tab'
				}, {
					folder : 'BUILDINS/theme',
					region : 'tab'
				} ]
			}
		}
	};
})();