package com.riambsoft.framework.core.webservice;

import javax.jws.WebService;

import org.apache.cxf.endpoint.Server;
import org.apache.cxf.interceptor.LoggingInInterceptor;
import org.apache.cxf.interceptor.LoggingOutInterceptor;
import org.apache.cxf.jaxws.JaxWsServerFactoryBean;

public abstract class SOAPServiceAbstract {

	private Server server;

	private Object service;

	public SOAPServiceAbstract(Object service) {
		this.service = service;
	}

	public abstract void debug(String msg);

	public void init() {
		if (service == null) {
			debug("SOAPService is null");
			return;
		}
		Class<?> clazz = getWebServiceClass(service.getClass());
		if (clazz != null) {
			debug("SOAPService " + clazz.getName() + " init");
			JaxWsServerFactoryBean factory = new JaxWsServerFactoryBean();
			factory.setServiceClass(service.getClass());
			String addr = clazz.getName().toLowerCase().replaceAll("\\.", "/");
			factory.setAddress("/" + addr);
			factory.setServiceBean(service);
			factory.getInInterceptors().add(new LoggingInInterceptor());
			factory.getOutInterceptors().add(new LoggingOutInterceptor());
			server = factory.create();
			server.start();
			debug("注册SOAP服务:" + service.getClass().getName());
		}
	}

	public void destroy() {
		if (server != null) {
			debug("SOAPService " + service.getClass().getName() + " destroy");
			server.stop();
			server.destroy();
		}
	}

	private Class<?> getWebServiceClass(Class<?> clazz) {
		if (Object.class.equals(clazz)) {
			return null;
		}
		if (clazz.isAnnotationPresent(WebService.class)) {
			return clazz;
		}
		Class<?>[] interfaces = clazz.getInterfaces();
		for (Class<?> inters : interfaces) {
			Class<?> c = getWebServiceClass(inters);
			if (c != null) {
				return c;
			}
		}
		return getWebServiceClass(clazz.getSuperclass());
	}

}
