package com.riambsoft.framework.core.web;

import java.util.Date;

import junit.framework.TestCase;

public class TestDate extends TestCase {

	public void test1() {

		Date date = new Date(System.currentTimeMillis());
		System.out.println(date);

		System.out.println((new java.text.SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss")).format(new Date()));

	}
	
	public void test2(){
		long start = System.currentTimeMillis();
		
		try {
			Thread.sleep(100);
		} catch (InterruptedException e) {
		}
		
		System.out.println(System.currentTimeMillis() - start);
	}

}
