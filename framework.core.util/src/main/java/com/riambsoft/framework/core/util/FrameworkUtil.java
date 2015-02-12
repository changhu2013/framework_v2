package com.riambsoft.framework.core.util;

public class FrameworkUtil {

	/**
	 * 获取Framework的类加载器
	 * 
	 * @return
	 */
	public static ClassLoader getFrameworkClassLoader() {
		return FrameworkUtil.class.getClassLoader();
	}

}
