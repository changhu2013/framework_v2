package com.riambsoft.framework.core;

public interface ServiceEngineInterface {

	public Variable invoke(Object service, String methodName, VariablePool pool);

}
