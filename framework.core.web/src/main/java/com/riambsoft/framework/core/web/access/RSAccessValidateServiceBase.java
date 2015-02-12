package com.riambsoft.framework.core.web.access;

import java.util.Iterator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.riambsoft.framework.core.web.ServiceController;
import com.riambsoft.framework.core.web.ServiceControllerManager;

public class RSAccessValidateServiceBase {

	private Log logger = LogFactory.getLog(RSAccessValidateServiceBase.class);

	private RSAccessValidatorBase accessValidator;

	public RSAccessValidateServiceBase(RSAccessValidatorBase accessValidator) {
		super();
		this.accessValidator = accessValidator;
	}

	public void init() {
		if (accessValidator == null) {
			logger.error("未能找到权限管理服务");
			return;
		}
		logger.info("注册权限验证服务:" + accessValidator);
		ServiceControllerManager manager = ServiceControllerManager
				.getInstance();
		for (Iterator<String> iter = manager.getServiceControllerNameIterator(); iter
				.hasNext();) {
			String temp = iter.next();
			ServiceController controller = manager.getServiceController(temp);
			controller.setRsAccessValidator(accessValidator);
			logger.debug("给控制器:" + controller + "注册权限验证服务:" + accessValidator);
		}
	}

	public void destroy() {
		if (accessValidator != null) {
			logger.info("卸载权限验证服务:" + accessValidator);
			ServiceControllerManager manager = ServiceControllerManager
					.getInstance();
			for (Iterator<String> iter = manager
					.getServiceControllerNameIterator(); iter.hasNext();) {
				String temp = iter.next();
				ServiceController controller = manager
						.getServiceController(temp);
				controller.setRsAccessValidator(null);
				logger.debug("从控制器:" + controller + "中卸载权限验证服务:"
						+ accessValidator);
			}
		}
	}

}
