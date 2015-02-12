package com.riambsoft.framework.core.web.access;

import java.util.Map;

public interface RSAccessValidatorBase {

	/**
	 * 该业务方法是否访问控制
	 */
	public boolean isAccessControl(String controllerName, String serviceName,
			String methodName) throws RSAccessException;

	/**
	 * 验证该用户是否具有执行该业务方法的权限
	 * 
	 * @param user
	 * @return
	 */
	public boolean validate(Object user, String controllerName,
			String serviceName, String methodName) throws RSAccessException;

	/**
	 * 获取用户权限信息
	 * 
	 * @param user
	 * @return
	 * @throws RSAccessException
	 */
	public Map<String, ?> getAccessControlMessage(Object user,
			String controllerName) throws RSAccessException;
}
