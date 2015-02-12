package com.riambsoft.framework.core.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import junit.framework.TestCase;

public class JSONParserTest extends TestCase {

	public void test1() throws ParserException {
		JSONParser p = new JSONParser();
		String bean = "['a', 'b', 'c']";
		List list = (List) p.marshal(bean, ArrayList.class);
		
		System.out.println("最终结果 ：" + list + "    "+ list.getClass());
		
		for (Iterator iter = list.iterator(); iter.hasNext();) {
			System.out.println(iter.next());
		}
	}

	public void test2() throws ParserException {
		JSONParser p = new JSONParser();
		String bean = "['a', 'b', 1000]";
		// 注意：如果想要获取数组,返回值只能是Object[]数组,不能是String数组
		Object[] obj = (Object[]) p.marshal(bean, String[].class);
		
		System.out.println("最终结果 ：" + obj + "    "+ obj.getClass());
		
		for (Object o : obj) {
			System.out.println(o + " " + o.getClass());
		}
	}

	public void test3() throws ParserException {
		JSONParser p = new JSONParser();
		String bean = "['a', 'b', {c:'ccc', d : 'ddd'}]";
		Object[] os = (Object[]) p.marshal(bean, Object[].class);
		
		System.out.println("最终结果 ：" + os + "    "+ os.getClass());
		
		for(Object o : os){
			System.out.println(o + " " + o.getClass());
		}
	}
	
	public void test4() throws ParserException{
		String bean = "{'metaData':{'paramNames':{'start':'start','limit':'limit','sort':'sort','dir':'dir'},'idProperty':'id','root':'users','fields':[{'name':'id','type':'number'},'code','name','remark'],'successProperty':'success','totalProperty':'total'},'xaction':'read'}";
		
		JSONParser p = new JSONParser();
		
		Object obj = p.marshal(bean, HashMap.class);
		
		System.out.println("最终结果 ：" + obj + "    "+ obj.getClass());
	}
	
	public void test5(){
		
		System.out.println(List.class.isAssignableFrom(ArrayList.class));
		System.out.println(ArrayList.class.isAssignableFrom(List.class));
		
	}
	
	
	
}
