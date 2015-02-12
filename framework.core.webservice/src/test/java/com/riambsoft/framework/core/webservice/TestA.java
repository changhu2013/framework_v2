package com.riambsoft.framework.core.webservice;

import java.io.IOException;

import javax.jws.WebService;

public class TestA {

	public static void main(String[] args) {

		Foo f = new Foo();
		SOAPServiceAbstract s = new SOAPServiceAbstract(f) {

			@Override
			public void debug(String msg) {
				System.out.println(msg);
			}

		};

		s.init();

		try {
			System.in.read();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}

@WebService
class Foo {

	public void f() {

	}
}
