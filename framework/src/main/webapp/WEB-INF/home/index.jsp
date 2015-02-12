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
	var service = new Rs.data.Service({
		url : 'login.rsc'
	});
	//获取用户信息
	service.call({
		method : 'getUserInfo'
	}, function(succ, result, code, msg) {
		//用户已经登陆并且成功获取到用户信息
		if (succ === true) {
			USERINFO = result;
			//获取用户有权限的WebApps列表
			service.call({
				method : 'getWebApps'
			}, function(succ, webapps, code, msg) {

				
				
				
				//获取到用户有权的应用信息成功
				if (succ === true) {
					
					/**************************/
					//此处先写死的安装应用程序，当用户管理、角色管理、
					//以及应用程序管理控制台等模块开发
					//完成后在修改此处代码
					
					Rs.engine({
						shell : 'window',
						onBeforeInitialize : function() {
							Rs.BASE_PATH = '../pub/rsclient2/rs';
						},
						environment : {
							type : 'development',
							config : {
								clearCache : false,
								monitor : true
							}
						},
						libraries : [ 'ext-3.3.1-debug' ],
						apps : [ {
							folder : 'Logout',
							autoRun : false,
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
						}, {
							folder : 'ControlCenter',
							autoRun : false,
							region : {
								width : 800,
								height : 600
							}
						}, {
							folder : '../console/BundleManager',
							autoRun : false,
							region : {
								width : 800,
								height : 600
							}
						}, {
							folder : '../base/RoleManager',
							autoRun : false,
							region : {
								width : 800,
								height : 600
							}
						}, {
							folder : '../base/UserManager',
							autoRun : false,
							region : {
								width : 800,
								height : 600
							}
						}]
					});
					
					/**************************/
				} else {
					window.location.href = 'login.jsp';
				}
			}, this);
		} else {
			window.location.href = 'login.jsp';
		}
	}, this);
</script>
</html>