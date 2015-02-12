<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>RS10</title>
<link rel="stylesheet" type="text/css"
	href="/framework/pub/rsclient2/rs/resources/css/rs-all.css" />
<script src="/framework/pub/rsclient2/rs/rs-debug.js"></script>
</head>
<body>
</body>
<script type="text/javascript">
	Rs.engine({
		shell : 'border',
		onBeforeInitialize : function() {
			Rs.BASE_PATH = '/framework/pub/rsclient2/rs';
		},
		environment : {
			type : 'development',
			config : {
				clearCache : false,
				monitor : false
			}
		},
		libraries : [ 'ext-3.3.1' ],
		apps : [ {
			folder : 'Login',
			name : "登录",
			autoRun : true,
			region : {
				modal : true,
				resizable : false,
				draggable : false,
				maximizable : false,
				minimizable : false,
				closable : false,
				x : 400,
				y : 100,
				width : 400,
				height : 180
			}
		} ]
	});
</script>
</html>
