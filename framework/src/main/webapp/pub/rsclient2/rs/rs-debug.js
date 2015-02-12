
/*
    http://www.JSON.org/json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
/**
 * @class Rs
 * Rs core utilities and functions.
 * @singleton
 */
Rs = {
	 /**
	 * The version of the framework
	 * @type String
	 */
    version : '0.1'
};

/**
 * Copies all the properties of config to obj.
 * @param {Object} obj The receiver of the properties
 * @param {Object} config The source of the properties
 * @param {Object} defaults A different object that will also be applied for default values
 * @return {Object} returns obj
 * @member Rs apply
 */
Rs.apply = function(o, c, defaults){
    if(defaults){
        Rs.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

(function(){
    var idSeed = 0,
        toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        DOC = document,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isIE6 = isIE && !isIE7 && !isIE8,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol),
        isSupportScriptEval = null;

    // remove css image flicker
    if(isIE6){
        try{
            DOC.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }

    //check is support script eval
    (function(){
    	var root = DOC.documentElement,
			script = DOC.createElement("script"),
			id = "script" + (new Date()).getTime();
		script.type = "text/javascript";
		try {
			script.appendChild( DOC.createTextNode( "window." + id + "=1;" ) );
		} catch(e) {}
		root.insertBefore( script, root.firstChild );
		if ( window[ id ] ) {
			isSupportScriptEval = true;
			delete window[ id ];
		} else {
			isSupportScriptEval = false;
		}
		root.removeChild( script );
		root = script = id  = null;
    })(this);
    
    Rs.apply(Rs, {
        
    	/** 
    	 * 本框架所处绝对位置
    	 */
    	BASE_PATH : "/com/rsc/rs/pub/rsclient2/rs",
    	
    	/**
         * URL to a blank file used by Rs when in secure mode for iframe src and onReady src to prevent
         * the IE insecure content warning (<tt>'about:blank'</tt>, except for IE in secure mode, which is <tt>'javascript:""'</tt>).
         * @type String
         */
    	SSL_SECURE_URL : isSecure && isIE ? 'javascript:""' : 'about:blank',
        
		/**
	     * True if the browser is in strict (standards-compliant) mode, as opposed to quirks mode
	     * @type Boolean
	     */
        isStrict : isStrict,
        
        /**
         * True if the page is running over SSL
         * @type Boolean
         */
        isSecure : isSecure,
        
        /**
         * True when the document is fully initialized and ready for action
         * @type Boolean
         */
        isReady : false,

        /**
         * True to automatically uncache orphaned Rs.Elements periodically (defaults to true)
         * @type Boolean
         */
        enableGarbageCollector : true,

        /**
         * True to automatically purge event listeners during garbageCollection (defaults to false).
         * @type Boolean
         */        
        enableListenerCollection : false,

        /**
         * EXPERIMENTAL - True to cascade listener removal to child elements when an element is removed.
         * Currently not optimized for performance.
         * @type Boolean
         */        
        enableNestedListenerRemoval : false,

        /**
         * Indicates whether to use native browser parsing for JSON methods.
         * This option is ignored if the browser does not support native JSON methods.
         * <b>Note: Native JSON methods will not work with objects that have functions.
         * Also, property names must be quoted, otherwise the data will not parse.</b> (Defaults to false)
         * @type Boolean
         */
        USE_NATIVE_JSON : false,

        /**
         * Copies all the properties of config to obj if they don't already exist.
         * @param {Object} obj The receiver of the properties
         * @param {Object} config The source of the properties
         * @return {Object} returns obj
         */
        applyIf : function(o, c){
            if(o){
                for(var p in c){
                    if(!Rs.isDefined(o[p])){
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },
        
        /**
         * Generates unique ids. If the element already has an id, it is unchanged
         * @param {Mixed} el (optional) The element to generate an id for
         * @param {String} prefix (optional) Id prefix (defaults "ext-gen")
         * @return {String} The generated Id.
         */
        id : function(el, prefix){
            return (el = Rs.getDom(el) || {}).id = el.id || (prefix || "rs-gen") + (++idSeed);
        },

        /**
         * A reusable empty function
         * @property
         * @type Function
         */
        emptyFn : function(){},
        
        
        /**
         * Utility method for validating that a value is numeric, returning the specified default value if it is not.
         * @param {Mixed} value Should be a number, but any type will be handled appropriately
         * @param {Number} defaultValue The value to return if the original value is non-numeric
         * @return {Number} Value, if numeric, else defaultValue
         */
        num : function(v, defaultValue){
            v = Number(Rs.isEmpty(v) || Rs.isArray(v) || typeof v == 'boolean' || (typeof v == 'string' && v.trim().length == 0) ? NaN : v);
            return isNaN(v) ? defaultValue : v;
        },
        
        /**
         * <p>Extends one class to create a subclass and optionally overrides members with the passed literal. This method
         * also adds the function "override()" to the subclass that can be used to override members of the class.</p>
         * <p>This function also supports a 3-argument call in which the subclass's constructor is
         * passed as an argument. In this form, the parameters are as follows:</p>
         * <div class="mdetail-params"><ul>
         * <li><code>subclass</code> : Function <div class="sub-desc">The subclass constructor.</div></li>
         * <li><code>superclass</code> : Function <div class="sub-desc">The constructor of class being extended</div></li>
         * <li><code>overrides</code> : Object <div class="sub-desc">A literal with members which are copied into the subclass's
         * prototype, and are therefore shared among all instances of the new class.</div></li>
         * </ul></div>
         *
         * @param {Function} superclass The constructor of class being extended.
         * @param {Object} overrides <p>A literal with members which are copied into the subclass's
         * prototype, and are therefore shared between all instances of the new class.</p>
         * <p>This may contain a special member named <tt><b>constructor</b></tt>. This is used
         * to define the constructor of the new class, and is returned. If this property is
         * <i>not</i> specified, a constructor is generated and returned which just calls the
         * superclass's constructor passing on its parameters.</p>
         * <p><b>It is essential that you call the superclass constructor in any provided constructor. See example code.</b></p>
         * @return {Function} The subclass constructor from the <code>overrides</code> parameter, or a generated one if not provided.
         */
        extend : function(){
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(Rs.isObject(sp)){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Rs.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Rs.override(sb, overrides);
                sb.extend = function(o){return Rs.extend(sb, o);};
                return sb;
            };
        }(),
        
        /**
         * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
         * Usage:<pre><code>
Ext.override(MyClass, {
    newMethod1: function(){
        // etc.
    },
    newMethod2: function(foo){
        // etc.
    }
});
</code></pre>
         * @param {Object} origclass The class to override
         * @param {Object} overrides The list of functions to add to origClass.  This should be specified as an object literal
         * containing one or more methods.
         * @method override
         */
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                Rs.apply(p, overrides);
                if(Rs.isIE && overrides.hasOwnProperty('toString')){
                    p.toString = overrides.toString;
                }
            }
        },
        
        /**
         * Creates namespaces to be used for scoping variables and classes so that they are not global.
         * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
         * <pre><code>
Rs.namespace('Company', 'Company.data');
Rs.namespace('Company.data'); // equivalent and preferable to above syntax
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
         * @param {String} namespace1
         * @param {String} namespace2
         * @param {String} etc
         * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
         * @method namespace
         */
        namespace : function(){
            var o, d;
            Rs.each(arguments, function(v) {
                d = v.split(".");
                o = window[d[0]] = window[d[0]] || {};
                Rs.each(d.slice(1), function(v2){
                    o = o[v2] = o[v2] || {};
                });
            });
            return o;
        },

		/**
		 * Takes an object and converts it to an encoded URL.
		 *         注意：此方法和Ext.urlEncode不同，该方法只是将传入对象的第一层属性编码。 e.g.
		 *         Rs.urlEncode({foo: 1, bar: 2, books:[1,2,3,4]}); would return
		 *         "foo=1&bar=2&books=[1,2,3,4]".
		 * 
		 * Ext.urlEncode({foo: 1, bar: 2, books:[1,2,3,4]}) would return
		 * "foo=1&bar=2&books=1&books=2&books=3&books=4".
		 * 
		 * @method urlEncode 
		 * @param {Object} o
		 * @param {String} pre (optional) A prefix to add to the url encoded string
		 * @return {String}
		 */
        urlEncode : function(o, pre) {
			var empty, buf = [],  e = encodeURIComponent; //e = encodeURI;
			Rs.iterate(o, function(key, item) {
				if((Rs.isObject(item) || Rs.isArray(item))){
					buf.push('&', e(e(key)), '=', Rs.encode(item));
				}else {
					empty = Rs.isEmpty(item);
					Rs.each(empty ? key : item, function(val) {
						if(!Rs.isEmpty(val) && (val != key || !empty)){
							if(Rs.isDate(val) || Rs.isString(val)){
								buf.push('&', e(e(key)), '=', Rs.encode(val).replace(/"/g,''));
							}else {
								buf.push('&', e(e(key)), '=', e(val));
							}
						}else {
							buf.push('&', e(e(key)), '=', '');
						}
					});
				}
			});
			if (!pre) {
				buf.shift();
				pre = '';
			}
			return pre + buf.join('');
		},
        
		 /**
         * Takes an encoded URL and and converts it to an object. Example: <pre><code>
Rs.urlDecode("foo=1&bar=2"); // returns {foo: "1", bar: "2"}
Rs.urlDecode("foo=1&bar=2&bar=3&bar=4", false); // returns {foo: "1", bar: ["2", "3", "4"]}
</code></pre>
         * @param {String} string
         * @param {Boolean} overwrite (optional) Items of the same name will overwrite previous values instead of creating an an array (Defaults to false).
         * @return {Object} A literal with members
         */
        urlDecode : function(string, overwrite){
            if(Rs.isEmpty(string)){
                return {};
            }
            var obj = {},
                pairs = string.split('&'),
                d = decodeURIComponent,
                name,
                value;
            Rs.each(pairs, function(pair) {
                pair = pair.split('=');
                name = d(d(pair[0]));
                value = d(d(pair[1]));
                obj[name] = overwrite || !obj[name] ? value :
                            [].concat(obj[name]).concat(value);
            });
            return obj;
        },
        
        /**
         * Appends content to the query string of a URL, handling logic for whether to place
         * a question mark or ampersand.
         * @param {String} url The URL to append to.
         * @param {String} s The content to append to the URL.
         * @return (String) The resulting URL
         */
        urlAppend : function(url, s){
            if(!Rs.isEmpty(s)){
                return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
            }
            return url;
        },

        /**
         * Converts any iterable (numeric indices and a length property) into a true array
         * Don't use this on strings. IE doesn't support "abc"[0] which this implementation depends on.
         * For strings, use this instead: "abc".match(/./g) => [a,b,c];
         * @param {Iterable} the iterable object to be turned into a true Array.
         * @return (Array) array
         */
        toArray : function(){
             return isIE ?
                function(a, i, j, res){
                    res = [];
                    for(var x = 0, len = a.length; x < len; x++) {
                        res.push(a[x]);
                    }
                    return res.slice(i || 0, j || res.length);
                } :
                function(a, i, j){
                    return Array.prototype.slice.call(a, i || 0, j || a.length);
                };
        }(),

        
        isIterable : function(v){
            //check for array or arguments
            if(Rs.isArray(v) || v.callee){
                return true;
            }
            //check for node list type
            if(/NodeList|HTMLCollection/.test(toString.call(v))){
                return true;
            }
            //NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
            return ((typeof v.nextNode != 'undefined' || v.item) && Rs.isNumber(v.length));
        },

        /**
         * Iterates an array calling the supplied function.
         * @param {Array/NodeList/Mixed} array The array to be iterated. If this
         * argument is not really an array, the supplied function is called once.
         * @param {Function} fn The function to be called with each item. If the
         * supplied function returns false, iteration stops and this method returns
         * the current <code>index</code>. This function is called with
         * the following arguments:
         * <div class="mdetail-params"><ul>
         * <li><code>item</code> : <i>Mixed</i>
         * <div class="sub-desc">The item at the current <code>index</code>
         * in the passed <code>array</code></div></li>
         * <li><code>index</code> : <i>Number</i>
         * <div class="sub-desc">The current index within the array</div></li>
         * <li><code>allItems</code> : <i>Array</i>
         * <div class="sub-desc">The <code>array</code> passed as the first
         * argument to <code>Ext.each</code>.</div></li>
         * </ul></div>
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
         * Defaults to the <code>item</code> at the current <code>index</code>
         * within the passed <code>array</code>.
         * @return See description for the fn parameter.
         */
        each : function(array, fn, scope){
            if(Rs.isEmpty(array, true)){
                return;
            }
            if(!Rs.isIterable(array) || Rs.isPrimitive(array)){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){
                    return i;
                };
            }
        },

        /**
         * Iterates either the elements in an array, or each of the properties in an object.
         * <b>Note</b>: If you are only iterating arrays, it is better to call {@link #each}.
         * @param {Object/Array} object The object or array to be iterated
         * @param {Function} fn The function to be called for each iteration.
         * The iteration will stop if the supplied function returns false, or
         * all array elements / object properties have been covered. The signature
         * varies depending on the type of object being interated:
         * <div class="mdetail-params"><ul>
         * <li>Arrays : <tt>(Object item, Number index, Array allItems)</tt>
         * <div class="sub-desc">
         * When iterating an array, the supplied function is called with each item.</div></li>
         * <li>Objects : <tt>(String key, Object value, Object)</tt>
         * <div class="sub-desc">
         * When iterating an object, the supplied function is called with each key-value pair in
         * the object, and the iterated object</div></li>
         * </ul></div>
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed. Defaults to
         * the <code>object</code> being iterated.
         */
        iterate : function(obj, fn, scope){
            if(Rs.isEmpty(obj)){
                return;
            }
            if(Rs.isIterable(obj)){
                Rs.each(obj, fn, scope);
                return;
            }else if(Rs.isObject(obj)){
                for(var prop in obj){
                    if(obj.hasOwnProperty(prop)){
                        if(fn.call(scope || obj, prop, obj[prop], obj) === false){
                            return;
                        };
                    }
                }
            }
        },

        /**
         * Return the dom node for the passed String (id), dom node, or Ext.Element.
         * Here are some examples:
         * <pre><code>
// gets dom node based on id
var elDom = Rs.getDom('elId');
// gets dom node based on the dom node
var elDom1 = Rs.getDom(elDom);

// If we don&#39;t know if we are working with an
// Ext.Element or a dom node use Ext.getDom
function(el){
    var dom = Ext.getDom(el);
    // do something with the dom node
}
         * </code></pre>
         * <b>Note</b>: the dom node to be found actually needs to exist (be rendered, etc)
         * when this method is called to be successful.
         * @param {Mixed} el
         * @return HTMLElement
         */
        getDom : function(el){
            if(!el || !DOC){
                return null;
            }
            return el.dom ? el.dom : (Rs.isString(el) ? DOC.getElementById(el) : el);
        },
        
        /**
         * Returns the current document body as an {@link Ext.Element}.
         * @return Rs.Element The document body
         */
        getBody : function(){
            return Rs.get(DOC.body || DOC.documentElement);
        },

        /**
         * Removes a DOM node from the document.
         * 
         * <p>Removes this element from the document, removes all DOM event listeners, and deletes the cache reference.
         * All DOM event listeners are removed from this element. If {@link Ext#enableNestedListenerRemoval} is
         * <code>true</code>, then DOM event listeners are also removed from all child nodes. The body node
         * will be ignored if passed in.</p>
         * @param {HTMLElement} node The node to remove
         */
        removeNode : isIE && !isIE8 ? function(){
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    (Rs.enableNestedListenerRemoval) ? Rs.EventManager.purgeElement(n, true) : Rs.EventManager.removeAll(n);
                    d = d || DOC.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                    delete Rs.elCache[n.id];
                }
            }
        }() : function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                (Rs.enableNestedListenerRemoval) ? Rs.EventManager.purgeElement(n, true) : Rs.EventManager.removeAll(n);
                n.parentNode.removeChild(n);
                delete Rs.elCache[n.id];
            }
        },
        
        /**
         * 抛出错误信息
         * 
         * @method error
         * @param {msg}
         */
        error : function(msg){
        	throw msg;
        },
        
        /**
         * <p>Returns true if the passed value is empty.</p>
         * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
         * <li>null</li>
         * <li>undefined</li>
         * <li>an empty array</li>
         * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
         * </ul></div>
         * @param {Mixed} value The value to test
         * @param {Boolean} allowBlank (optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         */
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || ((Rs.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },

        /**
         * Returns true if the passed value is a JavaScript array, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isArray : function(v){
            return toString.apply(v) === '[object Array]';
        },

        /**
         * Returns true if the passed object is a JavaScript date object, otherwise false.
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isDate : function(v){
            return toString.apply(v) === '[object Date]';
        },

        /**
         * Returns true if the passed value is a JavaScript Object, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isObject : function(v){
            return !!v && Object.prototype.toString.call(v) === '[object Object]';
        },

        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isPrimitive : function(v){
            return Rs.isString(v) || Rs.isNumber(v) || Rs.isBoolean(v);
        },

        /**
         * Returns true if the passed value is a JavaScript Function, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isFunction : function(v){
            return toString.apply(v) === '[object Function]';
        },

        /**
         * Returns true if the passed value is a number. Returns false for non-finite numbers.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isNumber : function(v){
            return typeof v === 'number' && isFinite(v);
        },

        /**
         * Returns true if the passed value is a string.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isString : function(v){
            return typeof v === 'string';
        },

        /**
         * Returns true if the passed value is a boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isBoolean : function(v){
            return typeof v === 'boolean';
        },

        /**
         * Returns true if the passed value is an HTMLElement
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isElement : function(v) {
            return !!v && v.tagName;
        },

        /**
         * Returns true if the passed value is not undefined.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isDefined : function(v){
            return typeof v !== 'undefined';
        },
        
        /**
         * True if the detected browser is Opera.
         * @type Boolean
         */
        isOpera : isOpera,

        /**
         * True if the detected browser uses WebKit.
         * @type Boolean
         */
        isWebKit : isWebKit,
        
        /**
         * True if the detected browser is Chrome.
         * @type Boolean
         */
        isChrome : isChrome,
        
        /**
         * True if the detected browser is Safari.
         * @type Boolean
         */
        isSafari : isSafari,
        
        /**
         * True if the detected browser is Safari 3.x.
         * @type Boolean
         */
        isSafari3 : isSafari3,
        /**
         * True if the detected browser is Safari 4.x.
         * @type Boolean
         */
        isSafari4 : isSafari4,
        /**
         * True if the detected browser is Safari 2.x.
         * @type Boolean
         */
        isSafari2 : isSafari2,
        /**
         * True if the detected browser is Internet Explorer.
         * @type Boolean
         */
        isIE : isIE,
        /**
         * True if the detected browser is Internet Explorer 6.x.
         * @type Boolean
         */
        isIE6 : isIE6,
        /**
         * True if the detected browser is Internet Explorer 7.x.
         * @type Boolean
         */
        isIE7 : isIE7,
        /**
         * True if the detected browser is Internet Explorer 8.x.
         * @type Boolean
         */
        isIE8 : isIE8,
        /**
         * True if the detected browser uses the Gecko layout engine (e.g. Mozilla, Firefox).
         * @type Boolean
         */
        isGecko : isGecko,
        /**
         * True if the detected browser uses a pre-Gecko 1.9 layout engine (e.g. Firefox 2.x).
         * @type Boolean
         */
        isGecko2 : isGecko2,
        /**
         * True if the detected browser uses a Gecko 1.9+ layout engine (e.g. Firefox 3.x).
         * @type Boolean
         */
        isGecko3 : isGecko3,
        /**
         * True if the detected browser is Internet Explorer running in non-strict mode.
         * @type Boolean
         */
        isBorderBox : isBorderBox,
        /**
         * True if the detected platform is Linux.
         * @type Boolean
         */
        isLinux : isLinux,
        /**
         * True if the detected platform is Windows.
         * @type Boolean
         */
        isWindows : isWindows,
        /**
         * True if the detected platform is Mac OS.
         * @type Boolean
         */
        isMac : isMac,
        /**
         * True if the detected platform is Adobe Air.
         * @type Boolean
         */
        isAir : isAir,
        
        /**
         * True if support script eval.
         * 
         */
        isSupportScriptEval : isSupportScriptEval
    });

    /**
     * Creates namespaces to be used for scoping variables and classes so that they are not global.
     * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
     * <pre><code>
RS.namespace('Company', 'Company.data');
Rs.namespace('Company.data'); // equivalent and preferable to above syntax
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
     * @param {String} namespace1
     * @param {String} namespace2
     * @param {String} etc
     * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
     * @method ns
     */
    Rs.ns = Rs.namespace;
})();

Rs.apply(Rs, function() {

	var DOC = document;
	
	var _isobject = function(v){
		return !!v && Object.prototype.toString.call(v) === '[object Object]';
	};
	
	var _isarray = function(v){
		return v instanceof Array;
	};
	
	var _isfunction = function(v){
		return typeof v == "function";
	};
	
	var _sortarray = function(array){
		return array.sort(function(a, b){
			return _hashcode(a) > _hashcode(b) ? 1 : -1;
		});
	};
	
	var _sortobject = function(obj){
		var ks = [], k, v, i, l, obj2 = {};
		for(k in obj){
			if(_isfunction(obj[k]) == false){
				ks.push(k);
			}
		}
		ks = ks.sort();
		for(i = 0, l = ks.length; i < l; i++){
			k = ks[i]; v = obj[k];
			obj2[k] = _sortproperty(v);
		}
		return obj2;
	};
	
	var _sortproperty = function(obj){
		if(_isarray(obj)){
			return _sortarray(obj); 
		}else if(_isobject(obj)){
			return _sortobject(obj);
		}else {
			return obj;
		}
	};
	
	var _hashcode = function(obj){
		obj = _sortproperty(obj);
		var str = JSON.stringify(obj),
			hc = _hashcodestr((typeof obj)+str);
		return hc;
	};
	
	var _hashcodestr = function(str){
		var h = 0, off = 0;
		for(var i = 0, l = str.length; i < l; i++){  
			h = 31 * h  + str.charCodeAt(off++); 
			if(h > 0x7fffffff || h < 0x80000000){
				h = h & 0xffffffff;
			}
		}
		return h;
	};
	
	//已加载资源记录缓存
	var loadedResourceCache = {};
	
	return {
		
	    /**
         * 加载js 和 css文件
         * 
         * @method loadResource
         * 
         * @param {String} src 文件资源地址，
         *          例如：src='http://pagead2.googlesyndication.com/pagead/expansion_embed.js'; 
         * 
         * @param {Function} callback
         *          资源文件加载完调用的回调方法
         *          
         * @param {Object} scope
         * 
         * @param {boolean} disableCache 是否关闭缓存
         */
        loadResource: function(url, callback, scope, disableCache) {
            var onLoad = (function(el, url, callback, scope){
                loadedResourceCache[url] = el;
                if(Rs.isFunction(callback)){
                    callback.call(scope, this);
                }
            }).createDelegate(this, [url, callback, scope], 2);
            if (url.length > 4
                && url.substring(url.length - 4) == ".css") {
                this.injectCssElement(url, onLoad, scope, disableCache);
            }else {
                this.injectScriptElement(url, onLoad, scope, disableCache);
            }
        },
        
        //private 任务队列
        taskQueue : [],
        
         //private 加载JS文件, 如果当前正在加载JS则将本次调用放入队列中,等执行加载完毕后在加载该JS
        injectScriptElement: function(url, onLoad, scope, disableCache){
            //如果是IE浏览器,则逐个加载
            if(Rs.isIE && this.loading === true){
                this.taskQueue.push({
                    url : url,
                    callback : onLoad,
                    scope : scope
                });
                return ;
            }
            
            var DOC = document,
                HEAD = DOC.getElementsByTagName("head")[0],
                script = DOC.createElement('script'),
                me = this,
                onLoadFn = function() {
                    me.cleanupScriptElement(script);
                    onLoad.call(scope, script);
                    me.loading = false;
                    me.nextTask();
                };
            script.type = 'text/javascript';
            script.src = disableCache === true?url + "?t=" + new Date().getTime():url;
            script.onload = onLoadFn;
            script.onerror = onLoadFn;
            script.onreadystatechange = function() {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    onLoadFn();
                }
            };
            this.loading = true;
            HEAD.appendChild(script);
        },
        
        //private 从队列里取出一项任务并执行
        nextTask : function(){
            if (this.taskQueue.length > 0) {
                var task = this.taskQueue.shift();
                this.injectScriptElement(task.url, task.callback, task.scope);
            }
        },
        
         //private
        cleanupScriptElement : function(script) {
            script.onload = null;
            script.onreadystatechange = null;
            script.onerror = null;
            return this;
        },
        
        //private
        injectCssElement : function(url, onLoad, scope, disableCache){
            var DOC = document,
                HEAD = DOC.getElementsByTagName("head")[0],
                link = DOC.createElement("link"),
                me = this,
                onLoadFn = function() {
                    me.cleanupCssElement(link);
                    onLoad.call(scope, link);
                };
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = disableCache === true?url + "?t=" + new Date().getTime():url;
            if(( 1 + /(?:Gecko|AppleWebKit)\/(\S*)/.test(navigator.userAgent)) == 2){
                var intervalID = setInterval(function() {
                    try {
                        clearInterval(intervalID);
                        onLoadFn();
                    }catch (ex) {}
                }, 100);
            }else {
                link.onload = onLoadFn;
            }
            HEAD.appendChild(link);
            return link;
        },
        
        //private
        cleanupCssElement : function(link){
            link.onload = null;
            return this;
        },
        
        /**
         * 删除引入的资源文件节点，如下图所示删除引入的样式文件的节点。
         * <pre><code>
    var Themes = Rs.Themes,
        oldThemeUrls, newThemeUrls;
    
    //删除原有主题样式
    oldThemeUrls = this.getThemeCssUrls(this.theme);
    Rs.each(oldThemeUrls, function(url){
        Rs.removeResource(url);
    }, this);
         * 
         * </code></pre>
         * @method removeResource
         * @param {String} url
         */
        removeResource : function(url){
            if(loadedResourceCache && loadedResourceCache[url]){
                var el = Rs.get(loadedResourceCache[url]);
                el && el.remove();
                delete loadedResourceCache[url];
            }
        },
	    
		/**
		 * 对比两个json块是否相当
		 * 
		 * @method equals
		 * 
		 * @param {Mixed} json1  第一个json块
		 * @param {Minex} json2  第二个json块
		 */
		equals : function(json1, json2){
			var hashcode1 = this.hashCode(json1),
				hashcode2 = this.hashCode(json2);
			return hashcode1 == hashcode2;
		},
		
		/**
		 * 对传入的json块求hashCode, 第一个参数为要求hashcode的对象，第二个参数以及之后的参数都是要计算hashcode的属性名称.
		 * 
		 * @method hashCode  
		 * @param {Mixed} json  要计算HashCode的对象
		 * @param {String} property1 计算hashCode的第一个属性名称，如果不存在该属性则忽略
		 * @param {String} property2 计算hashCode的第二个属性名称，如果不存在该属性则忽略
		 * @param {String} property3 计算hashCode的第三个属性名称，如果不存在该属性则忽略
<pre><code>
   var a = {
	       id : 100,
	       name : "tiger",
	       books : [{id: 120, name : 'C编程', code : 'C'},{id: 120, name : 'C++编程', code : 'c++'}]
	   }
   var b = {
		   books : [{id: 120, name : 'C++编程', code : 'c++'},{id: 120, name : 'C编程', code : 'C'}],
		   name : 'tiger',
           id : 100,
           fn : function(){
                return 1 == 1;
	       }
       }
       
 	var aa, 
 		bb;
 		
	aa = TEMP.hashcode(a);
	bb = TEMP.hashcode(b); 
   
	alert(aa == bb);
</code></pre>
		 * ...
		 */
		hashCode : function(json){
			var ids = [], k;
			for(var i = 1, l = arguments.length; i < l; i++){
				k = arguments[i];
				(json[k])?(ids.push(k)):null;
			}
			if(ids.length > 0){
				var obj = {};
				ids = ids.sort();
				for(var i = 0, l = ids.length; i < l; i++){
					k = ids[i];
					obj[k] = json[k];
				}
				return _hashcode(obj);
			}else {
				return _hashcode(json);
			}
		}
		
	};

}());

Rs.lr = Rs.loadResource;

Rs.ns("Rs.util", "Rs.lib", "Rs.data", "Rs.lib");

Rs.elCache = {};
/**
 * @class Function
 * These functions are available on every Function object (any JavaScript function).
 */
Rs.apply(Function.prototype, {
    
	 /**
     * Creates an interceptor function. The passed function is called before the original one. If it returns false,
     * the original one is not called. The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('Fred'); // alerts "Hi, Fred"

// create a new function that validates input without
// directly modifying the original function:
var sayHiToFriend = sayHi.createInterceptor(function(name){
    return name == 'Brian';
});

sayHiToFriend('Fred');  // no alert
sayHiToFriend('Brian'); // alerts "Hi, Brian"
</code></pre>
     * @param {Function} fcn The function to call before the original
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the passed function is executed.
     * <b>If omitted, defaults to the scope in which the original function is called or the browser window.</b>
     * @return {Function} The new function
     */
	createInterceptor : function(fcn, scope){
        var method = this;
        return !Rs.isFunction(fcn) ?
                this :
                function() {
                    var me = this,
                        args = arguments;
                    fcn.target = me;
                    fcn.method = method;
                    return (fcn.apply(scope || me || window, args) !== false) ?
                            method.apply(me || window, args) :
                            null;
                };
    },

    /**
     * Creates a callback that passes arguments[0], arguments[1], arguments[2], ...
     * Call directly on any function. Example: <code>myFunction.createCallback(arg1, arg2)</code>
     * Will create a function that is bound to those 2 args. <b>If a specific scope is required in the
     * callback, use {@link #createDelegate} instead.</b> The function returned by createCallback always
     * executes in the window scope.
     * <p>This method is required when you want to pass arguments to a callback function.  If no arguments
     * are needed, you can simply pass a reference to the function as a callback (e.g., callback: myFn).
     * However, if you tried to pass a function with arguments (e.g., callback: myFn(arg1, arg2)) the function
     * would simply execute immediately when the code is parsed. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// clicking the button alerts "Hi, Fred"
new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody(),
    handler: sayHi.createCallback('Fred')
});
</code></pre>
     * @return {Function} The new function
    */
    createCallback : function(/*args...*/){
        // make args available, in function below
        var args = arguments,
            method = this;
        return function() {
            return method.apply(window, args);
        };
    },

    /**
     * Creates a delegate (callback) that sets the scope to obj.
     * Call directly on any function. Example: <code>this.myFunction.createDelegate(this, [arg1, arg2])</code>
     * Will create a function that is automatically scoped to obj so that the <tt>this</tt> variable inside the
     * callback points to obj. Example usage:
     * <pre><code>
var sayHi = function(name){
    // Note this use of "this.text" here.  This function expects to
    // execute within a scope that contains a text property.  In this
    // example, the "this" variable is pointing to the btn object that
    // was passed in createDelegate below.
    alert('Hi, ' + name + '. You clicked the "' + this.text + '" button.');
}

var btn = new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody()
});

// This callback will execute in the scope of the
// button instance. Clicking the button alerts
// "Hi, Fred. You clicked the "Say Hi" button."
btn.on('click', sayHi.createDelegate(btn, ['Fred']));
</code></pre>
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Function} The new function
     */
    createDelegate : function(obj, args, appendArgs){
        var method = this;
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if (Rs.isNumber(appendArgs)){
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
    },

    /**
     * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// executes immediately:
sayHi('Fred');

// executes after 2 seconds:
sayHi.defer(2000, this, ['Fred']);

// this syntax is sometimes useful for deferring
// execution of an anonymous function:
(function(){
    alert('Anonymous');
}).defer(100);
</code></pre>
     * @param {Number} millis The number of milliseconds for the setTimeout call (if less than or equal to 0 the function is executed immediately)
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Number} The timeout id that can be used with clearTimeout
     */
    defer : function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(millis > 0){
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    }
});

/**
 * @class String
 * These functions are available on every String object.
 */
Rs.applyIf(String, {
	
	/**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
// s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
     * </code></pre>
     * @param {String} string The tokenized string to be formatted
     * @param {String} value1 The value to replace token {0}
     * @param {String} value2 Etc...
     * @return {String} The formatted string
     * @static
     */
    format : function(format){
        var args = Rs.toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    },
    
    /**
     * 字符串首尾去空格
     *  
     * @param {String} text
     */
    trim : function(text){
        return Rs.isString(text) ? text.replace(/(^\s*)|(\s*$)/g, "") : '';
    },
    
	/**
	 * 字符串包含字符串判断
	 * 
	 * @method contains
	 * @param {Stirng} substr
	 */ 
    contains : function(sub) {  
		return this.indexOf(sub) != -1;  
	}
});

Rs.trim = String.trim;

/**
 * @class Array
 */
Rs.applyIf(Array.prototype, {

	/**
     * Checks whether or not the specified object exists in the array.
     * @param {Object} o The object to check for
     * @param {Number} from (Optional) The index at which to begin the search
     * @return {Number} The index of o in the array (or -1 if it is not found)
     */
	/*indexOf : function(o, from){
        var len = this.length;
        from = from || 0;
        from += (from < 0) ? len : 0;
        for (; from < len; ++from){
            if(this[from] === o){
                return from;
            }
        }
        return -1;
    },*/

    /**
     * Removes the specified object from the array.  If the object is not found nothing happens.
     * @param {Object} o The object to remove
     * @return {Array} this array
     */
    remove : function(o){
        var index = this.indexOf(o);
        if(index != -1){
            this.splice(index, 1);
        }
        return this;
    },
    
    /**
	 * 扩展基础类 克隆复制（简单copy而已）
	 * 
	 * @method clone
	 */ 
    clone : function(){  
        var arr = [];  
        var i = 0;  
        for(; i < this.length; i++){  
            switch(typeof this[i]){  
                case 'object':  
                    var obj = {};  
                    for(key in this[i])  
                        obj[key] = this[i][key];  
                    arr.push(obj);  
                    break;  
                default:  
                    arr.push(this[i]);  
                    break;  
            }  
        }  
        return arr;  
    },
    
    /**
	 * 扩展基础类 数组添加数组
	 * 
	 * @method merge
	 */
    merge : function(arr) {  
        if(arr){  
            var i;  
            for(i = 0; i < arr.length; i++) {    
                this.push(arr[i]);  
            }    
        }  
    },
    
    /**
	 * 扩展基础类 根据值和属性获取到数组的对象下标
	 * 
	 * @method indexOf
	 * @param {value} val
	 * @param {String} field
	 */ 
    indexOf : function(val, field){  
        var i = 0;  
        for(; i < this.length; i++){  
            if(this[i] && (field ? this[i][field] == val : this[i] == val)){  
                return i;  
            }  
        }  
        return -1;  
    },
    
    /**
	 * 扩展基础类 最后一个下标
	 * 
	 * @method lastIndexOf
	 * @param {Mixed} val
	 * @param {String} field
	 */
    lastIndexOf : function(val, field){  
        var i = 0;  
        var max = -1;  
        for(; i < this.length; i++){  
            if(this[i] && (field ? this[i][field] == val : this[i] == val)){  
                max = i;  
            }  
        }  
        return max;  
    }
});

/**
 * @class Date
 */
Rs.applyIf(Date, {
	
    /**
	 * 日期相差天数
	 * 
	 * @method diff
	 * @param {Date} date
	 */
    diff : function(date){  
        return Math.ceil((this - date) / (1000 * 60 * 60 * 24));  
    },
    
    /**
     * 日期加减计算
     * 
     * @method add
     * @param {Number} days
     */
    add : function(days){  
        return new Date(this.getTime() + days * (1000 * 60 * 60 * 24));  
    },
    
    /**
     * 日期加减计算
     * 
     * @method addMonth
     * @param {Number} months
     */
    addMonth : function(months){  
        var day = this.getDate();  
        var month = this.getMonth() + 1;  
        var year = this.getFullYear();  
        month += months;    
        if(month > 12){  
            year += Math.floor(month / 12);  
            month = month % 12;  
        }  
        return Date.parse(month + '/' + day + '/' + year);  
    },
    
    getElapsed : function(A) {
    	return Math.abs((A || new Date()).getTime() - this.getTime())
    }
});

/**
 * @class Rs.util.TaskRunner
 * Provides the ability to execute one or more arbitrary tasks in a multithreaded
 * manner.  Generally, you can use the singleton {@link Ext.TaskMgr} instead, but
 * if needed, you can create separate instances of TaskRunner.  Any number of
 * separate tasks can be started at any time and will run independently of each
 * other. Example usage:
 * <pre><code>
// Start a simple clock task that updates a div once per second
var updateClock = function(){
    Rs.fly('clock').update(new Date().format('g:i:s A'));
} 
var task = {
    run: updateClock,
    interval: 1000 //1 second
}
var runner = new Ext.util.TaskRunner();
runner.start(task);

// equivalent using TaskMgr
Rs.TaskMgr.start({
    run: updateClock,
    interval: 1000
});

 * </code></pre>
 * Also see {@link Ext.util.DelayedTask}. 
 * 
 * @constructor
 * @param {Number} interval (optional) The minimum precision in milliseconds supported by this TaskRunner instance
 * (defaults to 10)
 */
Rs.util.TaskRunner = function(interval){
    interval = interval || 10;
    var tasks = [], 
    	removeQueue = [],
    	id = 0,
    	running = false,

    	// private
    	stopThread = function(){
	        running = false;
	        clearInterval(id);
	        id = 0;
	    },

    	// private
    	startThread = function(){
	        if(!running){
	            running = true;
	            id = setInterval(runTasks, interval);
	        }
	    },

    	// private
    	removeTask = function(t){
	        removeQueue.push(t);
	        if(t.onStop){
	            t.onStop.apply(t.scope || t);
	        }
	    },
	    
    	// private
    	runTasks = function(){
	    	var rqLen = removeQueue.length,
	    		now = new Date().getTime();	    			    		
	    
	        if(rqLen > 0){
	            for(var i = 0; i < rqLen; i++){
	                tasks.remove(removeQueue[i]);
	            }
	            removeQueue = [];
	            if(tasks.length < 1){
	                stopThread();
	                return;
	            }
	        }	        
	        for(var i = 0, t, itime, rt, len = tasks.length; i < len; ++i){
	            t = tasks[i];
	            itime = now - t.taskRunTime;
	            if(t.interval <= itime){
	                rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
	                t.taskRunTime = now;
	                if(rt === false || t.taskRunCount === t.repeat){
	                    removeTask(t);
	                    return;
	                }
	            }
	            if(t.duration && t.duration <= (now - t.taskStartTime)){
	                removeTask(t);
	            }
	        }
	    };

    /**
     * Starts a new task.
     * @method start
     * @param {Object} task A config object that supports the following properties:<ul>
     * <li><code>run</code> : Function<div class="sub-desc">The function to execute each time the task is run. The
     * function will be called at each interval and passed the <code>args</code> argument if specified.  If a
     * particular scope is required, be sure to specify it using the <code>scope</code> argument.</div></li>
     * <li><code>interval</code> : Number<div class="sub-desc">The frequency in milliseconds with which the task
     * should be executed.</div></li>
     * <li><code>args</code> : Array<div class="sub-desc">(optional) An array of arguments to be passed to the function
     * specified by <code>run</code>.</div></li>
     * <li><code>scope</code> : Object<div class="sub-desc">(optional) The scope (<tt>this</tt> reference) in which to execute the
     * <code>run</code> function. Defaults to the task config object.</div></li>
     * <li><code>duration</code> : Number<div class="sub-desc">(optional) The length of time in milliseconds to execute
     * the task before stopping automatically (defaults to indefinite).</div></li>
     * <li><code>repeat</code> : Number<div class="sub-desc">(optional) The number of times to execute the task before
     * stopping automatically (defaults to indefinite).</div></li>
     * </ul>
     * @return {Object} The task
     */	    
    this.start = function(task){
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };

    /**
     * Stops an existing running task.
     * @method stop
     * @param {Object} task The task to stop
     * @return {Object} The task
     */    
    this.stop = function(task){
        removeTask(task);
        return task;
    };

    /**
     * Stops all tasks that are currently running.
     * @method stopAll
     */    
    this.stopAll = function(){
        stopThread();
        for(var i = 0, len = tasks.length; i < len; i++){
            if(tasks[i].onStop){
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};

/**
 * @class Rs.TaskMgr
 * @extends Rs.util.TaskRunner
 * A static {@link Rs.util.TaskRunner} instance that can be used to start and stop arbitrary tasks.  See
 * {@link Rs.util.TaskRunner} for supported methods and task config properties.
 * <pre><code>
// Start a simple clock task that updates a div once per second
var task = {
    run: function(){
        Rs.fly('clock').update(new Date().format('g:i:s A'));
    },
    interval: 1000 //1 second
}
Rs.TaskMgr.start(task);
</code></pre>
 * @singleton
 */
Rs.TaskMgr = new Rs.util.TaskRunner();
/**
 * @class Rs.util.DelayedTask
 * <p> The DelayedTask class provides a convenient way to "buffer" the execution of a method,
 * performing setTimeout where a new timeout cancels the old timeout. When called, the
 * task will wait the specified time period before executing. If durng that time period,
 * the task is called again, the original call will be cancelled. This continues so that
 * the function is only called a single time for each iteration.</p>
 * <p>This method is especially useful for things like detecting whether a user has finished
 * typing in a text field. An example would be performing validation on a keypress. You can
 * use this class to buffer the keypress events for a certain number of milliseconds, and
 * perform only if they stop for that amount of time.  Usage:</p><pre><code>
var task = new Rs.util.DelayedTask(function(){
    alert(Ext.getDom('myInputField').value.length);
});
// Wait 500ms before calling our function. If the user presses another key 
// during that 500ms, it will be cancelled and we'll wait another 500ms.
Rs.get('myInputField').on('keypress', function(){
    task.{@link #delay}(500); 
});
 * </code></pre> 
 * <p>Note that we are using a DelayedTask here to illustrate a point. The configuration
 * option <tt>buffer</tt> for {@link Rs.util.Observable#addListener addListener/on} will
 * also setup a delayed task for you to buffer events.</p> 
 * @constructor The parameters to this constructor serve as defaults and are not required.
 * @param {Function} fn (optional) The default function to call.
 * @param {Object} scope The default scope (The <code><b>this</b></code> reference) in which the
 * function is called. If not specified, <code>this</code> will refer to the browser window.
 * @param {Array} args (optional) The default Array of arguments.
 */
Rs.util.DelayedTask = function(fn, scope, args){
    var me = this,
    	id,    	
    	call = function(){
    		clearInterval(id);
	        id = null;
	        fn.apply(scope, args || []);
	    };
	
    /**
     * Cancels any pending timeout and queues a new one
     * @param {Number} delay The milliseconds to delay
     * @param {Function} newFn (optional) Overrides function passed to constructor
     * @param {Object} newScope (optional) Overrides scope passed to constructor. Remember that if no scope
     * is specified, <code>this</code> will refer to the browser window.
     * @param {Array} newArgs (optional) Overrides args passed to constructor
     */
    me.delay = function(delay, newFn, newScope, newArgs){
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };

    /**
     * Cancel the last queued timeout
     */
    me.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};
(function(){
	var libFlyweight;
	
	function fly(el) {
        if (!libFlyweight) {
            libFlyweight = new Rs.Element.Flyweight();
        }
        libFlyweight.dom = el;
        return libFlyweight;
    }
(function(){
	var doc = document,
		isCSS1 = doc.compatMode == "CSS1Compat",
		MAX = Math.max,		
        ROUND = Math.round,
		PARSEINT = parseInt;
		
	Rs.lib.Dom = {
	    isAncestor : function(p, c) {
		    var ret = false;
			
			p = Rs.getDom(p);
			c = Rs.getDom(c);
			if (p && c) {
				if (p.contains) {
					return p.contains(c);
				} else if (p.compareDocumentPosition) {
					return !!(p.compareDocumentPosition(c) & 16);
				} else {
					while (c = c.parentNode) {
						ret = c == p || ret;	        			
					}
				}	            
			}	
			return ret;
		},
		
        getViewWidth : function(full) {
            return full ? this.getDocumentWidth() : this.getViewportWidth();
        },

        getViewHeight : function(full) {
            return full ? this.getDocumentHeight() : this.getViewportHeight();
        },

        getDocumentHeight: function() {            
            return MAX(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, this.getViewportHeight());
        },

        getDocumentWidth: function() {            
            return MAX(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, this.getViewportWidth());
        },

        getViewportHeight: function(){
	        return Rs.isIE ? 
	        	   (Rs.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
	        	   self.innerHeight;
        },

        getViewportWidth : function() {
	        return !Rs.isStrict && !Rs.isOpera ? doc.body.clientWidth :
	        	   Rs.isIE ? doc.documentElement.clientWidth : self.innerWidth;
        },
        
        getY : function(el) {
            return this.getXY(el)[1];
        },

        getX : function(el) {
            return this.getXY(el)[0];
        },

        getXY : function(el) {
            var p, 
            	pe, 
            	b,
            	bt, 
            	bl,     
            	dbd,       	
            	x = 0,
            	y = 0, 
            	scroll,
            	hasAbsolute, 
            	bd = (doc.body || doc.documentElement),
            	ret = [0,0];
            	
            el = Rs.getDom(el);

            if(el != bd){
	            if (el.getBoundingClientRect) {
	                b = el.getBoundingClientRect();
	                scroll = fly(document).getScroll();
	                ret = [ROUND(b.left + scroll.left), ROUND(b.top + scroll.top)];
	            } else {  
		            p = el;		
		            hasAbsolute = fly(el).isStyle("position", "absolute");
		
		            while (p) {
			            pe = fly(p);		
		                x += p.offsetLeft;
		                y += p.offsetTop;
		
		                hasAbsolute = hasAbsolute || pe.isStyle("position", "absolute");
		                		
		                if (Rs.isGecko) {		                    
		                    y += bt = PARSEINT(pe.getStyle("borderTopWidth"), 10) || 0;
		                    x += bl = PARSEINT(pe.getStyle("borderLeftWidth"), 10) || 0;	
		
		                    if (p != el && !pe.isStyle('overflow','visible')) {
		                        x += bl;
		                        y += bt;
		                    }
		                }
		                p = p.offsetParent;
		            }
		
		            if (Rs.isSafari && hasAbsolute) {
		                x -= bd.offsetLeft;
		                y -= bd.offsetTop;
		            }
		
		            if (Rs.isGecko && !hasAbsolute) {
		                dbd = fly(bd);
		                x += PARSEINT(dbd.getStyle("borderLeftWidth"), 10) || 0;
		                y += PARSEINT(dbd.getStyle("borderTopWidth"), 10) || 0;
		            }
		
		            p = el.parentNode;
		            while (p && p != bd) {
		                if (!Rs.isOpera || (p.tagName != 'TR' && !fly(p).isStyle("display", "inline"))) {
		                    x -= p.scrollLeft;
		                    y -= p.scrollTop;
		                }
		                p = p.parentNode;
		            }
		            ret = [x,y];
	            }
         	}
            return ret
        },

        setXY : function(el, xy) {
            (el = Rs.fly(el, '_setXY')).position();
            
            var pts = el.translatePoints(xy),
            	style = el.dom.style,
            	pos;            	
            
            for (pos in pts) {	            
	            if(!isNaN(pts[pos])) style[pos] = pts[pos] + "px"
            }
        },

        setX : function(el, x) {
            this.setXY(el, [x, false]);
        },

        setY : function(el, y) {
            this.setXY(el, [false, y]);
        }
    };
})();

Rs.lib.Event = function() {
    var loadComplete = false,
        unloadListeners = {},
        retryCount = 0,
        onAvailStack = [],
        _interval,
        locked = false,
        win = window,
        doc = document,

        // constants
        POLL_RETRYS = 200,
        POLL_INTERVAL = 20,
        EL = 0,
        TYPE = 0,
        FN = 1,
        WFN = 2,
        OBJ = 2,
        ADJ_SCOPE = 3,
        SCROLLLEFT = 'scrollLeft',
        SCROLLTOP = 'scrollTop',
        UNLOAD = 'unload',
        MOUSEOVER = 'mouseover',
        MOUSEOUT = 'mouseout',
        // private
        doAdd = function() {
            var ret;
            if (win.addEventListener) {
                ret = function(el, eventName, fn, capture) {
                    if (eventName == 'mouseenter') {
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener(MOUSEOVER, fn, (capture));
                    } else if (eventName == 'mouseleave') {
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener(MOUSEOUT, fn, (capture));
                    } else {
                        el.addEventListener(eventName, fn, (capture));
                    }
                    return fn;
                };
            } else if (win.attachEvent) {
                ret = function(el, eventName, fn, capture) {
                    el.attachEvent("on" + eventName, fn);
                    return fn;
                };
            } else {
                ret = function(){};
            }
            return ret;
        }(),
        // private
        doRemove = function(){
            var ret;
            if (win.removeEventListener) {
                ret = function (el, eventName, fn, capture) {
                    if (eventName == 'mouseenter') {
                        eventName = MOUSEOVER;
                    } else if (eventName == 'mouseleave') {
                        eventName = MOUSEOUT;
                    }
                    el.removeEventListener(eventName, fn, (capture));
                };
            } else if (win.detachEvent) {
                ret = function (el, eventName, fn) {
                    el.detachEvent("on" + eventName, fn);
                };
            } else {
                ret = function(){};
            }
            return ret;
        }();

    function checkRelatedTarget(e) {
        return !elContains(e.currentTarget, pub.getRelatedTarget(e));
    }

    function elContains(parent, child) {
       if(parent && parent.firstChild){
         while(child) {
            if(child === parent) {
                return true;
            }
            child = child.parentNode;
            if(child && (child.nodeType != 1)) {
                child = null;
            }
          }
        }
        return false;
    }

    // private
    function _tryPreloadAttach() {
        var ret = false,
            notAvail = [],
            element, i, len, v,
            tryAgain = !loadComplete || (retryCount > 0);

        if (!locked) {
            locked = true;

            for (i = 0, len = onAvailStack.length; i < len; i++) {
                v = onAvailStack[i];
                if(v && (element = doc.getElementById(v.id))){
                    if(!v.checkReady || loadComplete || element.nextSibling || (doc && doc.body)) {
                        element = v.override ? (v.override === true ? v.obj : v.override) : element;
                        v.fn.call(element, v.obj);
                        onAvailStack.remove(v);
                    } else {
                        notAvail.push(v);
                    }
                }
            }

            retryCount = (notAvail.length === 0) ? 0 : retryCount - 1;

            if (tryAgain) {
                startInterval();
            } else {
                clearInterval(_interval);
                _interval = null;
            }

            ret = !(locked = false);
        }
        return ret;
    }

    // private
    function startInterval() {
        if(!_interval){
            var callback = function() {
                _tryPreloadAttach();
            };
            _interval = setInterval(callback, POLL_INTERVAL);
        }
    }

    // private
    function getScroll() {
        var dd = doc.documentElement,
            db = doc.body;
        if(dd && (dd[SCROLLTOP] || dd[SCROLLLEFT])){
            return [dd[SCROLLLEFT], dd[SCROLLTOP]];
        }else if(db){
            return [db[SCROLLLEFT], db[SCROLLTOP]];
        }else{
            return [0, 0];
        }
    }

    // private
    function getPageCoord (ev, xy) {
        ev = ev.browserEvent || ev;
        var coord  = ev['page' + xy];
        if (!coord && coord !== 0) {
            coord = ev['client' + xy] || 0;

            if (Rs.isIE) {
                coord += getScroll()[xy == "X" ? 0 : 1];
            }
        }

        return coord;
    }

    var pub =  {
        extAdapter: true,
        onAvailable : function(p_id, p_fn, p_obj, p_override) {
            onAvailStack.push({
                id:         p_id,
                fn:         p_fn,
                obj:        p_obj,
                override:   p_override,
                checkReady: false });

            retryCount = POLL_RETRYS;
            startInterval();
        },

        // This function should ALWAYS be called from Rs.EventManager
        addListener: function(el, eventName, fn) {
            el = Rs.getDom(el);
            if (el && fn) {
                if (eventName == UNLOAD) {
                    if (unloadListeners[el.id] === undefined) {
                        unloadListeners[el.id] = [];
                    }
                    unloadListeners[el.id].push([eventName, fn]);
                    return fn;
                }
                return doAdd(el, eventName, fn, false);
            }
            return false;
        },

        // This function should ALWAYS be called from Rs.EventManager
        removeListener: function(el, eventName, fn) {
            el = Rs.getDom(el);
            var i, len, li, lis;
            if (el && fn) {
                if(eventName == UNLOAD){
                    if((lis = unloadListeners[el.id]) !== undefined){
                        for(i = 0, len = lis.length; i < len; i++){
                            if((li = lis[i]) && li[TYPE] == eventName && li[FN] == fn){
                                unloadListeners[id].splice(i, 1);
                            }
                        }
                    }
                    return;
                }
                doRemove(el, eventName, fn, false);
            }
        },

        getTarget : function(ev) {
            ev = ev.browserEvent || ev;
            return this.resolveTextNode(ev.target || ev.srcElement);
        },

        resolveTextNode : Rs.isGecko ? function(node){
            if(!node){
                return;
            }
            // work around firefox bug, https://bugzilla.mozilla.org/show_bug.cgi?id=101197
            var s = HTMLElement.prototype.toString.call(node);
            if(s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]'){
                return;
            }
            return node.nodeType == 3 ? node.parentNode : node;
        } : function(node){
            return node && node.nodeType == 3 ? node.parentNode : node;
        },

        getRelatedTarget : function(ev) {
            ev = ev.browserEvent || ev;
            return this.resolveTextNode(ev.relatedTarget ||
                    (ev.type == MOUSEOUT ? ev.toElement :
                     ev.type == MOUSEOVER ? ev.fromElement : null));
        },

        getPageX : function(ev) {
            return getPageCoord(ev, "X");
        },

        getPageY : function(ev) {
            return getPageCoord(ev, "Y");
        },


        getXY : function(ev) {
            return [this.getPageX(ev), this.getPageY(ev)];
        },

        stopEvent : function(ev) {
            this.stopPropagation(ev);
            this.preventDefault(ev);
        },

        stopPropagation : function(ev) {
            ev = ev.browserEvent || ev;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },

        preventDefault : function(ev) {
            ev = ev.browserEvent || ev;
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },

        getEvent : function(e) {
            e = e || win.event;
            if (!e) {
                var c = this.getEvent.caller;
                while (c) {
                    e = c.arguments[0];
                    if (e && Event == e.constructor) {
                        break;
                    }
                    c = c.caller;
                }
            }
            return e;
        },

        getCharCode : function(ev) {
            ev = ev.browserEvent || ev;
            return ev.charCode || ev.keyCode || 0;
        },

        //clearCache: function() {},
        // deprecated, call from EventManager
        getListeners : function(el, eventName) {
            Rs.EventManager.getListeners(el, eventName);
        },

        // deprecated, call from EventManager
        purgeElement : function(el, recurse, eventName) {
            Rs.EventManager.purgeElement(el, recurse, eventName);
        },

        _load : function(e) {
            loadComplete = true;
            var EU = Rs.lib.Event;
            if (Rs.isIE && e !== true) {
        // IE8 complains that _load is null or not an object
        // so lets remove self via arguments.callee
                doRemove(win, "load", arguments.callee);
            }
        },

        _unload : function(e) {
             var EU = Rs.lib.Event,
                i, j, l, v, ul, id, len, index, scope;


            for (id in unloadListeners) {
                ul = unloadListeners[id];
                for (i = 0, len = ul.length; i < len; i++) {
                    v = ul[i];
                    if (v) {
                        try{
                            scope = v[ADJ_SCOPE] ? (v[ADJ_SCOPE] === true ? v[OBJ] : v[ADJ_SCOPE]) :  win;
                            v[FN].call(scope, EU.getEvent(e), v[OBJ]);
                        }catch(ex){}
                    }
                }
            };

            unloadListeners = null;
            Rs.EventManager._unload();

            doRemove(win, UNLOAD, EU._unload);
        }
    };

    // Initialize stuff.
    pub.on = pub.addListener;
    pub.un = pub.removeListener;
    if (doc && doc.body) {
        pub._load(true);
    } else {
        doAdd(win, "load", pub._load);
    }
    doAdd(win, UNLOAD, pub._unload);
    _tryPreloadAttach();

    return pub;
}();
Rs.lib.Ajax = function() {     
    var activeX = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'],
       	CONTENTTYPE = 'Content-Type';
                   
    // private
    function setHeader(o) {
        var conn = o.conn,
            prop;
        
        function setTheHeaders(conn, headers){
            for (prop in headers) {
                if (headers.hasOwnProperty(prop)) {
                    conn.setRequestHeader(prop, headers[prop]);
                }
            }   
        }       
        
        if (pub.defaultHeaders) {
            setTheHeaders(conn, pub.defaultHeaders);
        }

        if (pub.headers) {
            setTheHeaders(conn, pub.headers);
            delete pub.headers;                
        }
    }    
    
    // private
    function createExceptionObject(tId, callbackArg, isAbort, isTimeout) {          
        return {
            tId : tId,
            status : isAbort ? -1 : 0,
            statusText : isAbort ? 'transaction aborted' : 'communication failure',
            isAbort: isAbort,
            isTimeout: isTimeout,
            argument : callbackArg
        };
    }  
    
    // private 
    function initHeader(label, value) {         
        (pub.headers = pub.headers || {})[label] = value;                       
    }
    
    // private
    function createResponseObject(o, callbackArg) {
        var headerObj = {},
            headerStr,              
            conn = o.conn,
            t,
            s;

        try {
            headerStr = o.conn.getAllResponseHeaders();   
            Rs.each(headerStr.replace(/\r\n/g, '\n').split('\n'), function(v){
                t = v.indexOf(':');
                if(t >= 0){
                    s = v.substr(0, t).toLowerCase();
                    if(v.charAt(t + 1) == ' '){
                        ++t;
                    }
                    headerObj[s] = v.substr(t + 1);
                }
            });
        } catch(e) {}
                    
        return {
            tId : o.tId,
            status : conn.status,
            statusText : conn.statusText,
            getResponseHeader : function(header){return headerObj[header.toLowerCase()];},
            getAllResponseHeaders : function(){return headerStr},
            responseText : conn.responseText,
            responseXML : conn.responseXML,
            argument : callbackArg
        };
    }
    
    // private
    function releaseObject(o) {
        o.conn = null;
        o = null;
    }        
    
    // private
    function handleTransactionResponse(o, callback, isAbort, isTimeout) {
        if (!callback) {
            releaseObject(o);
            return;
        }

        var httpStatus, responseObject;

        try {
            if (o.conn.status !== undefined && o.conn.status != 0) {
                httpStatus = o.conn.status;
            }
            else {
                httpStatus = 13030;
            }
        }
        catch(e) {
            httpStatus = 13030;
        }

        if ((httpStatus >= 200 && httpStatus < 300) || (Rs.isIE && httpStatus == 1223)) {
            responseObject = createResponseObject(o, callback.argument);
            if (callback.success) {
                if (!callback.scope) {
                    callback.success(responseObject);
                }
                else {
                    callback.success.apply(callback.scope, [responseObject]);
                }
            }
        }
        else {
            switch (httpStatus) {
                case 12002:
                case 12029:
                case 12030:
                case 12031:
                case 12152:
                case 13030:
                    responseObject = createExceptionObject(o.tId, callback.argument, (isAbort ? isAbort : false), isTimeout);
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        }
                        else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
                    break;
                default:
                    responseObject = createResponseObject(o, callback.argument);
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        }
                        else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
            }
        }

        releaseObject(o);
        responseObject = null;
    }  
    
    // private
    function handleReadyState(o, callback){
    callback = callback || {};
        var conn = o.conn,
            tId = o.tId,
            poll = pub.poll,
            cbTimeout = callback.timeout || null;

        if (cbTimeout) {
            pub.timeout[tId] = setTimeout(function() {
                pub.abort(o, callback, true);
            }, cbTimeout);
        }

        poll[tId] = setInterval(
            function() {
                if (conn && conn.readyState == 4) {
                    clearInterval(poll[tId]);
                    poll[tId] = null;

                    if (cbTimeout) {
                        clearTimeout(pub.timeout[tId]);
                        pub.timeout[tId] = null;
                    }

                    handleTransactionResponse(o, callback);
                }
            },
            pub.pollInterval);
    }
    
    // private
    function asyncRequest(method, uri, callback, postData) {
        var o = getConnectionObject() || null;

        if (o) {
            o.conn.open(method, uri, true);

            if (pub.useDefaultXhrHeader) {                    
                initHeader('X-Requested-With', pub.defaultXhrHeader);
            }

            if(postData && pub.useDefaultHeader && (!pub.headers || !pub.headers[CONTENTTYPE])){
                initHeader(CONTENTTYPE, pub.defaultPostHeader);
            }

            if (pub.defaultHeaders || pub.headers) {
                setHeader(o);
            }

            handleReadyState(o, callback);
            o.conn.send(postData || null);
        }
        return o;
    }
    
    // private
    function getConnectionObject() {
        var o;          

        try {
            if (o = createXhrObject(pub.transactionId)) {
                pub.transactionId++;
            }
        } catch(e) {
        } finally {
            return o;
        }
    }
       
    // private
    function createXhrObject(transactionId) {
        var http;
            
        try {
            http = new XMLHttpRequest();                
        } catch(e) {
            for (var i = 0; i < activeX.length; ++i) {              
                try {
                    http = new ActiveXObject(activeX[i]);                        
                    break;
                } catch(e) {}
            }
        } finally {
            return {conn : http, tId : transactionId};
        }
    }
         
    var pub = {
        request : function(method, uri, cb, data, options) {
            if(options){
                var me = this,              
                    xmlData = options.xmlData,
                    jsonData = options.jsonData,
                    hs;
                    
                Rs.applyIf(me, options);           
                
                if(xmlData || jsonData){
                    hs = me.headers;
                    if(!hs || !hs[CONTENTTYPE]){
                        initHeader(CONTENTTYPE, xmlData ? 'text/xml' : 'application/json');
                    }
                    data = xmlData || (!Rs.isPrimitive(jsonData) ? Rs.encode(jsonData) : jsonData);
                }
            }                       
            return asyncRequest(method || options.method || "POST", uri, cb, data);
        },

        serializeForm : function(form) {
            var fElements = form.elements || (document.forms[form] || Rs.getDom(form)).elements,
                hasSubmit = false,
                encoder = encodeURIComponent,
                element,
                options, 
                name, 
                val,                
                data = '',
                type;
                
            Rs.each(fElements, function(element) {                 
                name = element.name;                 
                type = element.type;
                
                if (!element.disabled && name){
                    if(/select-(one|multiple)/i.test(type)) {
                        Rs.each(element.options, function(opt) {
                            if (opt.selected) {
                                data += String.format("{0}={1}&", encoder(name), encoder((opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttribute('value') !== null) ? opt.value : opt.text));
                            }                               
                        });
                    } else if(!/file|undefined|reset|button/i.test(type)) {
                            if(!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)){
                                
                                data += encoder(name) + '=' + encoder(element.value) + '&';                     
                                hasSubmit = /submit/i.test(type);    
                            }                       
                    } 
                }
            });            
            return data.substr(0, data.length - 1);
        },
        
        useDefaultHeader : true,
        defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
        useDefaultXhrHeader : true,
        defaultXhrHeader : 'XMLHttpRequest',        
        poll : {},
        timeout : {},
        pollInterval : 50,
        transactionId : 0,
        
//  This is never called - Is it worth exposing this?               
//          setProgId : function(id) {
//              activeX.unshift(id);
//          },

//  This is never called - Is it worth exposing this?   
//          setDefaultPostHeader : function(b) {
//              this.useDefaultHeader = b;
//          },
        
//  This is never called - Is it worth exposing this?   
//          setDefaultXhrHeader : function(b) {
//              this.useDefaultXhrHeader = b;
//          },

//  This is never called - Is it worth exposing this?           
//          setPollingInterval : function(i) {
//              if (typeof i == 'number' && isFinite(i)) {
//                  this.pollInterval = i;
//              }
//          },
        
//  This is never called - Is it worth exposing this?
//          resetDefaultHeaders : function() {
//              this.defaultHeaders = null;
//          },
    
            abort : function(o, callback, isTimeout) {
                var me = this,
                    tId = o.tId,
                    isAbort = false;
                
                if (me.isCallInProgress(o)) {
                    o.conn.abort();
                    clearInterval(me.poll[tId]);
                    me.poll[tId] = null;
                    clearTimeout(pub.timeout[tId]);
                    me.timeout[tId] = null;
                    
                    handleTransactionResponse(o, callback, (isAbort = true), isTimeout);                
                }
                return isAbort;
            },
    
            isCallInProgress : function(o) {
                // if there is a connection and readyState is not 0 or 4
                return o.conn && !{0:true,4:true}[o.conn.readyState];           
            }
        };
        return pub;
    }();
(function(){    
    var RSLIB = Rs.lib,
        noNegatives = /width|height|opacity|padding/i,
        offsetAttribute = /^((width|height)|(top|left))$/,
        defaultUnit = /width|height|top$|bottom$|left$|right$/i,
        offsetUnit =  /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i,
        isset = function(v){
            return typeof v !== 'undefined';
        },
        now = function(){
            return new Date();    
        };
        
    RSLIB.Anim = {
        motion : function(el, args, duration, easing, cb, scope) {
            return this.run(el, args, duration, easing, cb, scope, Rs.lib.Motion);
        },

        run : function(el, args, duration, easing, cb, scope, type) {
            type = type || Rs.lib.AnimBase;
            if (typeof easing == "string") {
                easing = Rs.lib.Easing[easing];
            }
            var anim = new type(el, args, duration, easing);
            anim.animateX(function() {
                if(Rs.isFunction(cb)){
                    cb.call(scope);
                }
            });
            return anim;
        }
    };
    
    RSLIB.AnimBase = function(el, attributes, duration, method) {
        if (el) {
            this.init(el, attributes, duration, method);
        }
    };

    RSLIB.AnimBase.prototype = {
        doMethod: function(attr, start, end) {
            var me = this;
            return me.method(me.curFrame, start, end - start, me.totalFrames);
        },


        setAttr: function(attr, val, unit) {
            if (noNegatives.test(attr) && val < 0) {
                val = 0;
            }
            Rs.fly(this.el, '_anim').setStyle(attr, val + unit);
        },


        getAttr: function(attr) {
            var el = Rs.fly(this.el),
                val = el.getStyle(attr),
                a = offsetAttribute.exec(attr) || []

            if (val !== 'auto' && !offsetUnit.test(val)) {
                return parseFloat(val);
            }

            return (!!(a[2]) || (el.getStyle('position') == 'absolute' && !!(a[3]))) ? el.dom['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)] : 0;
        },


        getDefaultUnit: function(attr) {
            return defaultUnit.test(attr) ? 'px' : '';
        },

        animateX : function(callback, scope) {
            var me = this,
                f = function() {
                me.onComplete.removeListener(f);
                if (Rs.isFunction(callback)) {
                    callback.call(scope || me, me);
                }
            };
            me.onComplete.addListener(f, me);
            me.animate();
        },


        setRunAttr: function(attr) {            
            var me = this,
                a = this.attributes[attr],
                to = a.to,
                by = a.by,
                from = a.from,
                unit = a.unit,
                ra = (this.runAttrs[attr] = {}),
                end;

            if (!isset(to) && !isset(by)){
                return false;
            }

            var start = isset(from) ? from : me.getAttr(attr);
            if (isset(to)) {
                end = to;
            }else if(isset(by)) {
                if (Rs.isArray(start)){
                    end = [];
					for(var i=0,len=start.length; i<len; i++) {
						end[i] = start[i] + by[i];
					}
                }else{
                    end = start + by;
                }
            }

            Rs.apply(ra, {
                start: start,
                end: end,
                unit: isset(unit) ? unit : me.getDefaultUnit(attr)
            });
        },


        init: function(el, attributes, duration, method) {
            var me = this,
                actualFrames = 0,
                mgr = RSLIB.AnimMgr;
                
            Rs.apply(me, {
                isAnimated: false,
                startTime: null,
                el: Rs.getDom(el),
                attributes: attributes || {},
                duration: duration || 1,
                method: method || RSLIB.Easing.easeNone,
                useSec: true,
                curFrame: 0,
                totalFrames: mgr.fps,
                runAttrs: {},
                animate: function(){
                    var me = this,
                        d = me.duration;
                    
                    if(me.isAnimated){
                        return false;
                    }

                    me.curFrame = 0;
                    me.totalFrames = me.useSec ? Math.ceil(mgr.fps * d) : d;
                    mgr.registerElement(me); 
                },
                
                stop: function(finish){
                    var me = this;
                
                    if(finish){
                        me.curFrame = me.totalFrames;
                        me._onTween.fire();
                    }
                    mgr.stop(me);
                }
            });

            var onStart = function(){
                var me = this,
                    attr;
                
                me.onStart.fire();
                me.runAttrs = {};
                for(attr in this.attributes){
                    this.setRunAttr(attr);
                }

                me.isAnimated = true;
                me.startTime = now();
                actualFrames = 0;
            };


            var onTween = function(){
                var me = this;

                me.onTween.fire({
                    duration: now() - me.startTime,
                    curFrame: me.curFrame
                });

                var ra = me.runAttrs;
                for (var attr in ra) {
                    this.setAttr(attr, me.doMethod(attr, ra[attr].start, ra[attr].end), ra[attr].unit);
                }

                ++actualFrames;
            };

            var onComplete = function() {
                var me = this,
                    actual = (now() - me.startTime) / 1000,
                    data = {
                        duration: actual,
                        frames: actualFrames,
                        fps: actualFrames / actual
                    };

                me.isAnimated = false;
                actualFrames = 0;
                me.onComplete.fire(data);
            };

            me.onStart = new Rs.util.Event(me);
            me.onTween = new Rs.util.Event(me);            
            me.onComplete = new Rs.util.Event(me);
            (me._onStart = new Rs.util.Event(me)).addListener(onStart);
            (me._onTween = new Rs.util.Event(me)).addListener(onTween);
            (me._onComplete = new Rs.util.Event(me)).addListener(onComplete); 
        }
    };


    Rs.lib.AnimMgr = new function() {
        var me = this,
            thread = null,
            queue = [],
            tweenCount = 0;


        Rs.apply(me, {
            fps: 1000,
            delay: 1,
            registerElement: function(tween){
                queue.push(tween);
                ++tweenCount;
                tween._onStart.fire();
                me.start();
            },
            
            unRegister: function(tween, index){
                tween._onComplete.fire();
                index = index || getIndex(tween);
                if (index != -1) {
                    queue.splice(index, 1);
                }

                if (--tweenCount <= 0) {
                    me.stop();
                }
            },
            
            start: function(){
                if(thread === null){
                    thread = setInterval(me.run, me.delay);
                }
            },
            
            stop: function(tween){
                if(!tween){
                    clearInterval(thread);
                    for(var i = 0, len = queue.length; i < len; ++i){
                        if(queue[0].isAnimated){
                            me.unRegister(queue[0], 0);
                        }
                    }

                    queue = [];
                    thread = null;
                    tweenCount = 0;
                }else{
                    me.unRegister(tween);
                }
            },
            
            run: function(){
                var tf, i, len, tween;
                for(i = 0, len = queue.length; i<len; i++) {
                    tween = queue[i];
                    if(tween && tween.isAnimated){
                        tf = tween.totalFrames;
                        if(tween.curFrame < tf || tf === null){
                            ++tween.curFrame;
                            if(tween.useSec){
                                correctFrame(tween);
                            }
                            tween._onTween.fire();
                        }else{
                            me.stop(tween);
                        }
                    }                   
                }
            }
        });

        var getIndex = function(anim) {
            var i, len;
            for(i = 0, len = queue.length; i<len; i++) {
                if(queue[i] === anim) {
                    return i;
                }
            }
            return -1;
        };

        var correctFrame = function(tween) {
            var frames = tween.totalFrames,
                frame = tween.curFrame,
                duration = tween.duration,
                expected = (frame * duration * 1000 / frames),
                elapsed = (now() - tween.startTime),
                tweak = 0;

            if(elapsed < duration * 1000){
                tweak = Math.round((elapsed / expected - 1) * frame);
            }else{
                tweak = frames - (frame + 1);
            }
            if(tweak > 0 && isFinite(tweak)){
                if(tween.curFrame + tweak >= frames){
                    tweak = frames - (frame + 1);
                }
                tween.curFrame += tweak;
            }
        };
    };

    RSLIB.Bezier = new function() {

        this.getPosition = function(points, t) {
            var n = points.length,
                tmp = [],
                c = 1 - t, 
                i,
                j;

            for (i = 0; i < n; ++i) {
                tmp[i] = [points[i][0], points[i][1]];
            }

            for (j = 1; j < n; ++j) {
                for (i = 0; i < n - j; ++i) {
                    tmp[i][0] = c * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                    tmp[i][1] = c * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1];
                }
            }

            return [ tmp[0][0], tmp[0][1] ];

        };
    };


    RSLIB.Easing = {
        easeNone: function (t, b, c, d) {
            return c * t / d + b;
        },


        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },


        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
    };

    (function() {
        RSLIB.Motion = function(el, attributes, duration, method) {
            if (el) {
                RSLIB.Motion.superclass.constructor.call(this, el, attributes, duration, method);
            }
        };

        Rs.extend(RSLIB.Motion, Rs.lib.AnimBase);

        var superclass = RSLIB.Motion.superclass,
            proto = RSLIB.Motion.prototype,
            pointsRe = /^points$/i;

        Rs.apply(RSLIB.Motion.prototype, {
            setAttr: function(attr, val, unit){
                var me = this,
                    setAttr = superclass.setAttr;
                    
                if (pointsRe.test(attr)) {
                    unit = unit || 'px';
                    setAttr.call(me, 'left', val[0], unit);
                    setAttr.call(me, 'top', val[1], unit);
                } else {
                    setAttr.call(me, attr, val, unit);
                }
            },
            
            getAttr: function(attr){
                var me = this,
                    getAttr = superclass.getAttr;
                    
                return pointsRe.test(attr) ? [getAttr.call(me, 'left'), getAttr.call(me, 'top')] : getAttr.call(me, attr);
            },
            
            doMethod: function(attr, start, end){
                var me = this;
                
                return pointsRe.test(attr)
                        ? RSLIB.Bezier.getPosition(me.runAttrs[attr], me.method(me.curFrame, 0, 100, me.totalFrames) / 100)
                        : superclass.doMethod.call(me, attr, start, end);
            },
            
            setRunAttr: function(attr){
                if(pointsRe.test(attr)){
                    
                    var me = this,
                        el = this.el,
                        points = this.attributes.points,
                        control = points.control || [],
                        from = points.from,
                        to = points.to,
                        by = points.by,
                        DOM = RSLIB.Dom,
                        start,
                        i,
                        end,
                        len,
                        ra;
                  

                    if(control.length > 0 && !Rs.isArray(control[0])){
                        control = [control];
                    }else{
                        /*
                        var tmp = [];
                        for (i = 0,len = control.length; i < len; ++i) {
                            tmp[i] = control[i];
                        }
                        control = tmp;
                        */
                    }

                    Rs.fly(el, '_anim').position();
                    DOM.setXY(el, isset(from) ? from : DOM.getXY(el));
                    start = me.getAttr('points');


                    if(isset(to)){
                        end = translateValues.call(me, to, start);
                        for (i = 0,len = control.length; i < len; ++i) {
                            control[i] = translateValues.call(me, control[i], start);
                        }
                    } else if (isset(by)) {
                        end = [start[0] + by[0], start[1] + by[1]];

                        for (i = 0,len = control.length; i < len; ++i) {
                            control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
                        }
                    }

                    ra = this.runAttrs[attr] = [start];
                    if (control.length > 0) {
                        ra = ra.concat(control);
                    }

                    ra[ra.length] = end;
                }else{
                    superclass.setRunAttr.call(this, attr);
                }
            }
        });

        var translateValues = function(val, start) {
            var pageXY = RSLIB.Dom.getXY(this.el);
            return [val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1]];
        };
    })();
})();
(function(){
	// shortcuts to aid compression
	var abs = Math.abs,
	 	pi = Math.PI,
	 	asin = Math.asin,
	 	pow = Math.pow,
	 	sin = Math.sin,
		RSLIB = Rs.lib;
	 	
    Rs.apply(RSLIB.Easing, {
        
        easeBoth: function (t, b, c, d) {
	        return ((t /= d / 2) < 1)  ?  c / 2 * t * t + b  :  -c / 2 * ((--t) * (t - 2) - 1) + b;               
        },
        
        easeInStrong: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },

        easeOutStrong: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },

        easeBothStrong: function (t, b, c, d) {
            return ((t /= d / 2) < 1)  ?  c / 2 * t * t * t * t + b  :  -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },

        elasticIn: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            

			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
	
            return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b;
            	      
        }, 	
	
		elasticOut: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            

			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
	
            return a * pow(2, -10 * t) * sin((t * d - s) * (2 * pi) / p) + c + b;	 
        }, 	
	
        elasticBoth: function (t, b, c, d, a, p) {
            if (t == 0 || (t /= d / 2) == 2) {
                return t == 0 ? b : b + c;
            }		         	
	            
            p = p || (d * (.3 * 1.5)); 	            

            var s;
            if (a >= abs(c)) {
	            s = p / (2 * pi) * asin(c / a);
            } else {
	            a = c;
                s = p / 4;
            }

            return t < 1 ?
            	   	-.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b :
                    a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p) * .5 + c + b;
        },

        backIn: function (t, b, c, d, s) {
            s = s ||  1.70158; 	            
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },


        backOut: function (t, b, c, d, s) {
            if (!s) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },


        backBoth: function (t, b, c, d, s) {
            s = s || 1.70158; 	            

            return ((t /= d / 2 ) < 1) ?
                    c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b : 	            
            		c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },


        bounceIn: function (t, b, c, d) {
            return c - RSLIB.Easing.bounceOut(d - t, 0, c, d) + b;
        },


        bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        },


        bounceBoth: function (t, b, c, d) {
            return (t < d / 2) ?
                   RSLIB.Easing.bounceIn(t * 2, 0, c, d) * .5 + b : 
            	   RSLIB.Easing.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
})();

(function() {
    var RSLIB = Rs.lib;
	// Color Animation
	RSLIB.Anim.color = function(el, args, duration, easing, cb, scope) {
	    return RSLIB.Anim.run(el, args, duration, easing, cb, scope, RSLIB.ColorAnim);
	}
	
    RSLIB.ColorAnim = function(el, attributes, duration, method) {
        RSLIB.ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
    };

    Rs.extend(RSLIB.ColorAnim, RSLIB.AnimBase);

    var superclass = RSLIB.ColorAnim.superclass,
    	colorRE = /color$/i,
    	transparentRE = /^transparent|rgba\(0, 0, 0, 0\)$/,
        rgbRE = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
        hexRE= /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
        hex3RE = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i,
        isset = function(v){
            return typeof v !== 'undefined';
        }
         	
   	// private	
    function parseColor(s) {	
        var pi = parseInt,
            base,
            out = null,
            c;
        
	    if (s.length == 3) {
            return s;
        }
		
        Rs.each([hexRE, rgbRE, hex3RE], function(re, idx){
            base = (idx % 2 == 0) ? 16 : 10;
            c = re.exec(s);
            if(c && c.length == 4){
                out = [pi(c[1], base), pi(c[2], base), pi(c[3], base)];
                return false;
            }
        });
        return out;
    }	

    Rs.apply(RSLIB.ColorAnim.prototype, {
        getAttr : function(attr) {
            var me = this,
                el = me.el,
                val;                
            if(colorRE.test(attr)){
                while(el && transparentRE.test(val = Rs.fly(el).getStyle(attr))){
                    el = el.parentNode;
                    val = "fff";
                }
            }else{
                val = superclass.getAttr.call(me, attr);
            }
            return val;
        },

        doMethod : function(attr, start, end) {
            var me = this,
            	val,
            	floor = Math.floor,
				i, 
                len,
                v;            

            if(colorRE.test(attr)){
                val = [];
				
				for(i = 0, len = start.length; i < len; i++) {
					v = start[i];
					val[i] = superclass.doMethod.call(me, attr, v, end[i]);
				}
                val = 'rgb(' + floor(val[0]) + ',' + floor(val[1]) + ',' + floor(val[2]) + ')';
            }else{
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },

        setRunAttr : function(attr) {
            var me = this,
                a = me.attributes[attr],
                to = a.to,
                by = a.by,
                ra;
                
            superclass.setRunAttr.call(me, attr);
            ra = me.runAttrs[attr];
            if(colorRE.test(attr)){
                var start = parseColor(ra.start),
                    end = parseColor(ra.end);

                if(!isset(to) && isset(by)){
                    end = parseColor(by);
					for(var i=0,len=start.length; i<len; i++) {
						end[i] = start[i] + end[i];
					}
                }
                ra.start = start;
                ra.end = end;
            }
        }
	});
})();	

	
(function() {
	    // Scroll Animation	
    var RSLIB = Rs.lib;
	RSLIB.Anim.scroll = function(el, args, duration, easing, cb, scope) {	        
	    return RSLIB.Anim.run(el, args, duration, easing, cb, scope, RSLIB.Scroll);
	}
	
    RSLIB.Scroll = function(el, attributes, duration, method) {
        if(el){
            RSLIB.Scroll.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };

    Rs.extend(RSLIB.Scroll, RSLIB.ColorAnim);

    var superclass = RSLIB.Scroll.superclass,
    	SCROLL = 'scroll';

    Rs.apply(RSLIB.Scroll.prototype, {

        doMethod : function(attr, start, end) {
            var val,
            	me = this,
            	curFrame = me.curFrame,
            	totalFrames = me.totalFrames;

            if(attr == SCROLL){
                val = [me.method(curFrame, start[0], end[0] - start[0], totalFrames),
                       me.method(curFrame, start[1], end[1] - start[1], totalFrames)];
            }else{
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },

        getAttr : function(attr) {
            var me = this;

            if (attr == SCROLL) {
                return [me.el.scrollLeft, me.el.scrollTop];
            }else{
                return superclass.getAttr.call(me, attr);
            }
        },

        setAttr : function(attr, val, unit) {
            var me = this;

            if(attr == SCROLL){
                me.el.scrollLeft = val[0];
                me.el.scrollTop = val[1];
            }else{
                superclass.setAttr.call(me, attr, val, unit);
            }
        }
    });
})();
	if(Rs.isIE) {
        function fnCleanUp() {
            var p = Function.prototype;
            delete p.createSequence;
            delete p.defer;
            delete p.createDelegate;
            delete p.createCallback;
            delete p.createInterceptor;

            window.detachEvent("onunload", fnCleanUp);
        }
        window.attachEvent("onunload", fnCleanUp);
    }
})();
(function(){

var RSUTIL = Rs.util,
    TOARRAY = Rs.toArray,
    EACH = Rs.each,
    ISOBJECT = Rs.isObject,
    TRUE = true,
    FALSE = false;

/**
 * @class Rs.util.Observable
 * Base class that provides a common interface for publishing events. Subclasses are expected to
 * to have a property "events" with all the events defined, and, optionally, a property "listeners"
 * with configured listeners defined.<br>
 * For example:
 * <pre><code>
Employee = Rs.extend(Rs.util.Observable, {
    constructor: function(config){
        this.name = config.name;
        this.addEvents({
            "fired" : true,
            "quit" : true
        });

        // Copy configured listeners into *this* object so that the base class&#39;s
        // constructor will add them.
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        Employee.superclass.constructor.call(config)
    }
});
</code></pre>
 * This could then be used like this:<pre><code>
var newEmployee = new Employee({
    name: employeeName,
    listeners: {
        quit: function() {
            // By default, "this" will be the object that fired the event.
            alert(this.name + " has quit!");
        }
    }
});
</code></pre>
 */
RSUTIL.Observable = function(){
	 /**
     * @cfg {Object} listeners (optional) <p>A config object containing one or more event handlers to be added to this
     * object during initialization.  This should be a valid listeners config object as specified in the
     * {@link #addListener} example for attaching multiple handlers at once.</p>
     * <br><p><b><u>DOM events from ExtJs {@link Rs.Component Components}</u></b></p>
     * <br><p>While <i>some</i> ExtJs Component classes export selected DOM events (e.g. "click", "mouseover" etc), this
     * is usually only done when extra value can be added. For example the {@link Rs.DataView DataView}'s
     * <b><code>{@link Rs.DataView#click click}</code></b> event passing the node clicked on. To access DOM
     * events directly from a Component's HTMLElement, listeners must be added to the <i>{@link Rs.Component#getEl Element}</i> after the Component
     * has been rendered. A plugin can simplify this step:<pre><code>
// Plugin is configured with a listeners config object.
// The Component is appended to the argument list of all handler functions.
Rs.DomObserver = Rs.extend(Object, {
    constructor: function(config) {
        this.listeners = config.listeners ? config.listeners : config;
    },

    // Component passes itself into plugin&#39;s init method
    init: function(c) {
        var p, l = this.listeners;
        for (p in l) {
            if (Ext.isFunction(l[p])) {
                l[p] = this.createHandler(l[p], c);
            } else {
                l[p].fn = this.createHandler(l[p].fn, c);
            }
        }

        // Add the listeners to the Element immediately following the render call
        c.render = c.render.{@link Function#createSequence createSequence}(function() {
            var e = c.getEl();
            if (e) {
                e.on(l);
            }
        });
    },

    createHandler: function(fn, c) {
        return function(e) {
            fn.call(this, e, c);
        };
    }
});

var combo = new Rs.form.ComboBox({

    // Collapse combo when its element is clicked on
    plugins: [ new Rs.DomObserver({
        click: function(evt, comp) {
            comp.collapse();
        }
    })],
    store: myStore,
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all'
});
     * </code></pre></p>
     */
    var me = this, e = me.events;
    if(me.listeners){
        me.on(me.listeners);
        delete me.listeners;
    }
    me.events = e || {};
};

RSUTIL.Observable.prototype = {
    // private
    filterOptRe : /^(?:scope|delay|buffer|single)$/,
    
    /**
     * <p>Fires the specified event with the passed parameters (minus the event name).</p>
     * <p>An event may be set to bubble up an Observable parent hierarchy (See {@link Rs.Component#getBubbleTarget})
     * by calling {@link #enableBubble}.</p>
     * @param {String} eventName The name of the event to fire.
     * @param {Object...} args Variable number of parameters are passed to handlers.
     * @return {Boolean} returns false if any of the handlers return false otherwise it returns true.
     */
    fireEvent : function(){
        var a = TOARRAY(arguments),
            ename = a[0].toLowerCase(),
            me = this,
            ret = TRUE,
            ce = me.events[ename],
            q,
            c;
        if (me.eventsSuspended === TRUE) {
            if (q = me.eventQueue) {
                q.push(a);
            }
        }
        else if(ISOBJECT(ce) && ce.bubble){
            if(ce.fire.apply(ce, a.slice(1)) === FALSE) {
                return FALSE;
            }
            c = me.getBubbleTarget && me.getBubbleTarget();
            if(c && c.enableBubble) {
                if(!c.events[ename] || !Rs.isObject(c.events[ename]) || !c.events[ename].bubble) {
                    c.enableBubble(ename);
                }
                return c.fireEvent.apply(c, a);
            }
        }
        else {
            if (ISOBJECT(ce)) {
                a.shift();
                ret = ce.fire.apply(ce, a);
            }
        }
        return ret;
    },
    
    /**
     * Appends an event handler to this object.
     * @param {String}   eventName The name of the event to listen for.
     * @param {Function} handler The method the event invokes.
     * @param {Object}   scope (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to the object which fired the event.</b>
     * @param {Object}   options (optional) An object containing handler configuration.
     * properties. This may contain any of the following properties:<ul>
     * <li><b>scope</b> : Object<div class="sub-desc">The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to the object which fired the event.</b></div></li>
     * <li><b>delay</b> : Number<div class="sub-desc">The number of milliseconds to delay the invocation of the handler after the event fires.</div></li>
     * <li><b>single</b> : Boolean<div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
     * <li><b>buffer</b> : Number<div class="sub-desc">Causes the handler to be scheduled to run in an {@link Rs.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
     * <li><b>target</b> : Observable<div class="sub-desc">Only call the handler if the event was fired on the target Observable, <i>not</i>
     * if the event was bubbled up from a child Observable.</div></li>
     * </ul><br>
     * <p>
     * <b>Combining Options</b><br>
     * Using the options argument, it is possible to combine different types of listeners:<br>
     * <br>
     * A delayed, one-time listener.
     * <pre><code>
myDataView.on('click', this.onClick, this, {
single: true,
delay: 100
});</code></pre>
     * <p>
     * <b>Attaching multiple handlers in 1 call</b><br>
     * The method also allows for a single argument to be passed which is a config object containing properties
     * which specify multiple handlers.
     * <p>
     * <pre><code>
myGridPanel.on({
'click' : {
    fn: this.onClick,
    scope: this,
    delay: 100
},
'mouseover' : {
    fn: this.onMouseOver,
    scope: this
},
'mouseout' : {
    fn: this.onMouseOut,
    scope: this
}
});</code></pre>
 * <p>
 * Or a shorthand syntax:<br>
 * <pre><code>
myGridPanel.on({
'click' : this.onClick,
'mouseover' : this.onMouseOver,
'mouseout' : this.onMouseOut,
 scope: this
});</code></pre>
     */
    addListener : function(eventName, fn, scope, o){
        var me = this,
            e,
            oe,
            isF,
        ce;
        if (ISOBJECT(eventName)) {
            o = eventName;
            for (e in o){
                oe = o[e];
                if (!me.filterOptRe.test(e)) {
                    me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
                }
            }
        } else {
            eventName = eventName.toLowerCase();
            ce = me.events[eventName] || TRUE;
            if (Rs.isBoolean(ce)) {
                me.events[eventName] = ce = new RSUTIL.Event(me, eventName);
            }
            ce.addListener(fn, scope, ISOBJECT(o) ? o : {});
        }
    },

    /**
     * Removes an event handler.
     * @param {String}   eventName The type of event the handler was associated with.
     * @param {Function} handler   The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
     * @param {Object}   scope     (optional) The scope originally specified for the handler.
     */
    removeListener : function(eventName, fn, scope){
        var ce = this.events[eventName.toLowerCase()];
        if (ISOBJECT(ce)) {
            ce.removeListener(fn, scope);
        }
    },

    /**
     * Removes all listeners for this object
     */
    purgeListeners : function(){
        var events = this.events,
            evt,
            key;
        for(key in events){
            evt = events[key];
            if(ISOBJECT(evt)){
                evt.clearListeners();
            }
        }
    },

    /**
     * Adds the specified events to the list of events which this Observable may fire.
     * @param {Object/String} o Either an object with event names as properties with a value of <code>true</code>
     * or the first event name string if multiple event names are being passed as separate parameters.
     * @param {string} Optional. Event name if multiple event names are being passed as separate parameters.
     * Usage:<pre><code>
this.addEvents('storeloaded', 'storecleared');
</code></pre>
     */    
    addEvents : function(o){
        var me = this;
        me.events = me.events || {};
        if (Rs.isString(o)) {
            var a = arguments,
                i = a.length;
            while(i--) {
                me.events[a[i]] = me.events[a[i]] || TRUE;
            }
        } else {
            Rs.applyIf(me.events, o);
        }
    },

    /**
     * Checks to see if this object has any listeners for a specified event
     * @param {String} eventName The name of the event to check for
     * @return {Boolean} True if the event is being listened for, else false
     */    
    hasListener : function(eventName){
        var e = this.events[eventName];
        return ISOBJECT(e) && e.listeners.length > 0;
    },

    /**
     * Suspend the firing of all events. (see {@link #resumeEvents})
     * @param {Boolean} queueSuspended Pass as true to queue up suspended events to be fired
     * after the {@link #resumeEvents} call instead of discarding all suspended events;
     */    
    suspendEvents : function(queueSuspended){
        this.eventsSuspended = TRUE;
        if(queueSuspended && !this.eventQueue){
            this.eventQueue = [];
        }
    },

    /**
     * Resume firing events. (see {@link #suspendEvents})
     * If events were suspended using the <tt><b>queueSuspended</b></tt> parameter, then all
     * events fired during event suspension will be sent to any listeners now.
     */    
    resumeEvents : function(){
        var me = this,
            queued = me.eventQueue || [];
        me.eventsSuspended = FALSE;
        delete me.eventQueue;
        EACH(queued, function(e) {
            me.fireEvent.apply(me, e);
        });
    },
    
    /**
     * Relays selected events from the specified Observable as if the events were fired by this.
     * @param {Object} o The Observable whose events this object is to relay.
     * @param {Array} events Array of event names to relay.
     */
    relayEvents : function(o, events){
        var me = this;
        function createHandler(ename){
            return function(){
                return me.fireEvent.apply(me, [ename].concat(Array.prototype.slice.call(arguments, 0)));
            };
        }
        for(var i = 0, len = events.length; i < len; i++){
            var ename = events[i];
            me.events[ename] = me.events[ename] || true;
            o.on(ename, createHandler(ename), me);
        }
    }
};

var OBSERVABLE = RSUTIL.Observable.prototype;

/**
 * Appends an event handler to this object (shorthand for {@link #addListener}.)
 * @param {String}   eventName     The type of event to listen for
 * @param {Function} handler       The method the event invokes
 * @param {Object}   scope         (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
 * <b>If omitted, defaults to the object which fired the event.</b>
 * @param {Object}   options       (optional) An object containing handler configuration.
 * @method
 */
OBSERVABLE.on = OBSERVABLE.addListener;

/**
 * Removes an event handler (shorthand for {@link #removeListener}.)
 * @param {String}   eventName     The type of event the handler was associated with.
 * @param {Function} handler       The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
 * @param {Object}   scope         (optional) The scope originally specified for the handler.
 * @method
 */
OBSERVABLE.un = OBSERVABLE.removeListener;

/**
 * Removes <b>all</b> added captures from the Observable.
 * @param {Observable} o The Observable to release
 * @static
 */
RSUTIL.Observable.releaseCapture = function(o){
    o.fireEvent = OBSERVABLE.fireEvent;
};

function createTargeted(h, o, scope){
    return function(){
        if(o.target == arguments[0]){
            h.apply(scope, TOARRAY(arguments));
        }
    };
};

function createBuffered(h, o, l, scope){
    l.task = new RSUTIL.DelayedTask();
    return function(){
        l.task.delay(o.buffer, h, scope, TOARRAY(arguments));
    };
};

function createSingle(h, e, fn, scope){
    return function(){
        e.removeListener(fn, scope);
        return h.apply(scope, arguments);
    };
};

function createDelayed(h, o, l, scope){
    return function(){
        var task = new RSUTIL.DelayedTask();
        if(!l.tasks) {
            l.tasks = [];
        }
        l.tasks.push(task);
        task.delay(o.delay || 10, h, scope, TOARRAY(arguments));
    };
};

RSUTIL.Event = function(obj, name){
    this.name = name;
    this.obj = obj;
    this.listeners = [];
};

RSUTIL.Event.prototype = {
    addListener : function(fn, scope, options){
        var me = this,
            l;
        scope = scope || me.obj;
        if(!me.isListening(fn, scope)){
            l = me.createListener(fn, scope, options);
            if(me.firing){ // if we are currently firing this event, don't disturb the listener loop
                me.listeners = me.listeners.slice(0);
            }
            me.listeners.push(l);
        }
    },

    createListener: function(fn, scope, o){
        o = o || {}, scope = scope || this.obj;
        var l = {
            fn: fn,
            scope: scope,
            options: o
        }, h = fn;
        if(o.target){
            h = createTargeted(h, o, scope);
        }
        if(o.delay){
            h = createDelayed(h, o, l, scope);
        }
        if(o.single){
            h = createSingle(h, this, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o, l, scope);
        }
        l.fireFn = h;
        return l;
    },

    findListener : function(fn, scope){
        var list = this.listeners,
            i = list.length,
            l,
            s;
        while(i--) {
            l = list[i];
            if(l) {
                s = l.scope;
                if(l.fn == fn && (s == scope || s == this.obj)){
                    return i;
                }
            }
        }
        return -1;
    },

    isListening : function(fn, scope){
        return this.findListener(fn, scope) != -1;
    },

    removeListener : function(fn, scope){
        var index,
            l,
            k,
            me = this,
            ret = FALSE;
        if((index = me.findListener(fn, scope)) != -1){
            if (me.firing) {
                me.listeners = me.listeners.slice(0);
            }
            l = me.listeners[index];
            if(l.task) {
                l.task.cancel();
                delete l.task;
            }
            k = l.tasks && l.tasks.length;
            if(k) {
                while(k--) {
                    l.tasks[k].cancel();
                }
                delete l.tasks;
            }
            me.listeners.splice(index, 1);
            ret = TRUE;
        }
        return ret;
    },

    // Iterate to stop any buffered/delayed events
    clearListeners : function(){
        var me = this,
            l = me.listeners,
            i = l.length;
        while(i--) {
            me.removeListener(l[i].fn, l[i].scope);
        }
    },

    fire : function(){
        var me = this,
            args = TOARRAY(arguments),
            listeners = me.listeners,
            len = listeners.length,
            i = 0,
            l;

        if(len > 0){
            me.firing = TRUE;
            for (; i < len; i++) {
                l = listeners[i];
                if(l && l.fireFn.apply(l.scope || me.obj || window, args) === FALSE) {
                    return (me.firing = FALSE);
                }
            }
        }
        me.firing = FALSE;
        return TRUE;
    }
};
})();
(function() {

    var global = this,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        i;
    
    for (i in enumerablesTest) {
        enumerables = null;
    }
    
    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }
    
    if (typeof Rs === 'undefined') {
        global.Rs = {};
    }
    
    Rs.global = global;
    
    /**
     * @property Rs.enumerables
     * An array containing extra enumerables for old browsers
     * @type Array
     */
    Rs.enumerables = enumerables;

    /*
     * A very commonly used method throughout the framework. It acts as a wrapper around another method
     * which originally accepts 2 arguments for `name` and `value`.
     * The wrapped function then allows "flexible" value setting of either:
     *
     * - `name` and `value` as 2 arguments
     * - one single object argument with multiple key - value pairs
     */
    function flexSetter(fn) {
        return function(a, b) {
            var k, i;
            if (a === null) {
                return this;
            }
            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }
                if (Rs.enumerables) {
                    for (i = Rs.enumerables.length; i--;) {
                        k = Rs.enumerables[i];
                        if (a.hasOwnProperty(k)) {
                            fn.call(this, k, a[k]);
                        }
                    }
                }
            } else {
                fn.call(this, a, b);
            }
            return this;
        };
    };
    
    /*
     * Merges any number of objects recursively without referencing them or their children.
     */
    function mergeObj(source, key, value) {
        if (typeof key === 'string') {
            if (value && value.constructor === Object) {
                if (source[key] && source[key].constructor === Object) {
                    mergeObj(source[key], value);
                } else {
                    source[key] =  (function(array) {
                        return slice.call(array);
                    })(value); //Ext.clone(value);
                }
            } else {
                source[key] = value;
            }
            return source;
        }
        var i = 1, ln = arguments.length, object, property;
        for (; i < ln; i++) {
            object = arguments[i];
            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    mergeObj(source, property, object[property]);
                }
            }
        }
        return source;
    };
    
    /*
     * Capitalize the given string 
     */
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.substr(1);
    };
    
    /*
     * Converts any iterable (numeric indices and a length property) into a true array.
     */
    function toArray(iterable, start, end){
        if (!iterable || !iterable.length) {
            return [];
        }
        if (typeof iterable === 'string') {
            iterable = iterable.split('');
        }
        if (supportsSliceOnNodeList) {
            return slice.call(iterable, start || 0, end || iterable.length);
        }
        var array = [],
            i;
        start = start || 0;
        end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;
        for (i = start; i < end; i++) {
            array.push(iterable[i]);
        }
        return array;
    };
    
    /*
     * Converts a value to an array if it's not already an array; returns:
     * - An empty array if given value is `undefined` or `null`
     * - Itself if given value is already an array
     * - An array copy if given value is {@link Rs#isIterable iterable} (arguments, NodeList and alike)
     * - An array with one item which is the given value, otherwise
     */
    function fromArray(value, newReference) {
        if (value === undefined || value === null) {
            return [];
        }
        if (Rs.isArray(value)) {
            return (newReference) ? slice.call(value) : value;
        }
        if (value && value.length !== undefined && typeof value !== 'string') {
        	return toArray(value);
        }
        return [value];
	};
        
    /*
     * Get the index of the provided `item` in the given `array`, a supplement for the 
     * missing arrayPrototype.indexOf in Internet Explorer.
     */
	function indexOfArray(array, item, from) {
        if (supportsIndexOf) {
            return array.indexOf(item, from);
        }
        var i, length = array.length;
        for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    };
    
    /*
     * Replaces items in an array. This is equivalent to the splice method of Array, but
     * works around bugs in IE8's splice method. The signature is exactly the same as the
     * splice method except that the array is the first argument. All arguments following
     * removeCount are inserted in the array at index.
     */
    function splice(array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    };
        
    /*
     * Iterates through an object and invokes the given callback function for each iteration.
     * The iteration can be stopped by returning `false` in the callback function.
     */
    function eachObj(object, fn, scope) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (fn.call(scope || object, property, object[property], object) === false) {
                    return;
                }
            }
        }
    };
        
    /*
     * Adds behavior to an existing method that is executed before the
     * original behavior of the function.
     */
    function interceptBefore(object, methodName, fn) {
        var method = object[methodName] || Rs.emptyFn;
        return object[methodName] = function() {
            var ret = fn.apply(this, arguments);
            method.apply(this, arguments);

            return ret;
        };
    };
        
   
    /*
     * Create an alias to the provided method property with name `methodName` of `object`.
     * Note that the execution scope will still be bound to the provided `object` itself.
     */
    function aliasMethod(object, methodName) {
        return function() {
            return object[methodName].apply(object, arguments);
        };
    };
    
    /*
     * Returns true if this element is an ancestor of the passed element
     */
    function contains(array, item) {
        if (supportsIndexOf) {
            return array.indexOf(item) !== -1;
        }
        var i, ln;
        for (i = 0, ln = array.length; i < ln; i++) {
            if (array[i] === item) {
                return true;
            }
        }
        return false;
    };

    /*
     * Push an item into the array only if the array doesn't contain it yet
     */
    function includeArray(array, item) {
        if (!contains(array, item)) {
            array.push(item);
        }
    };
    
    /*
     * 	@class Rs.Base
     * 	The root of all classes created with {@link Rs#define}.
     * 	Rs.Base is the building block of all Rs classes. All classes in Rs inherit from Rs.Base.
     * 	All prototype and static members of this class are inherited by all other classes.
     */
    var Base = Rs.Base = function() {};

    Base.prototype = {

        $className : 'Rs.Base',

        $class : Base,

        /**
         * Get the reference to the current class from which this object was instantiated. Unlike {@link Rs.Base#statics},
         * `this.self` is scope-dependent and it's meant to be used for dynamic inheritance. See {@link Rs.Base#statics}
         * for a detailed comparison
         *
         *     Rs.define('My.Cat', {
         *         statics: {
         *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
         *         },
         *
         *         constructor: function() {
         *             alert(this.self.speciesName); / dependent on 'this'
         *
         *             return this;
         *         },
         *
         *         clone: function() {
         *             return new this.self();
         *         }
         *     });
         *
         *
         *     Rs.define('My.SnowLeopard', {
         *         extend: 'My.Cat',
         *         statics: {
         *             speciesName: 'Snow Leopard'         // My.SnowLeopard.speciesName = 'Snow Leopard'
         *         }
         *     });
         *
         *     var cat = new My.Cat();                     // alerts 'Cat'
         *     var snowLeopard = new My.SnowLeopard();     // alerts 'Snow Leopard'
         *
         *     var clone = snowLeopard.clone();
         *     alert(Rs.getClassName(clone));             // alerts 'My.SnowLeopard'
         *
         * @type Rs.Class
         * @protected
         */
        self : Base,

        // Default constructor, simply returns `this`
        constructor : function() {
            return this;
        },

        //<feature classSystem.config>
        /**
         * Initialize configuration for this class. a typical example:
         *
         *     Rs.define('My.awesome.Class', {
         *         // The default config
         *         config: {
         *             name: 'Awesome',
         *             isAwesome: true
         *         },
         *
         *         constructor: function(config) {
         *             this.initConfig(config);
         *
         *             return this;
         *         }
         *     });
         *
         *     var awesome = new My.awesome.Class({
         *         name: 'Super Awesome'
         *     });
         *
         *     alert(awesome.getName()); // 'Super Awesome'
         *
         * @protected
         * @param {Object} config
         * @return {Object} mixins The mixin prototypes as key - value pairs
         */
        initConfig : function(config) {
            if (!this.$configInited) {
                this.config = mergeObj({}, this.config || {}, config || {});
                this.applyConfig(this.config);
                this.$configInited = true;
            }
            return this;
        },

        /**
         * @private
         */
        setConfig : function(config){
            this.applyConfig(config || {});
            return this;
        },
        
        /**
         * 初始化配置
         * @private
         */
        applyConfig : flexSetter(function(name, value) {
            var setter = 'set' + capitalize(name);
            if (typeof this[setter] === 'function') {
                this[setter].call(this, value);
            }
            return this;
        }),
        
        /**
         * Call the parent's overridden method. For example:
         *
         *     Rs.define('My.own.A', {
         *         constructor: function(test) {
         *             alert(test);
         *         }
         *     });
         *
         *     Rs.define('My.own.B', {
         *         extend: 'My.own.A',
         *
         *         constructor: function(test) {
         *             alert(test);
         *
         *             this.callParent([test + 1]);
         *         }
         *     });
         *
         *     Rs.define('My.own.C', {
         *         extend: 'My.own.B',
         *
         *         constructor: function() {
         *             alert("Going to call parent's overriden constructor...");
         *
         *             this.callParent(arguments);
         *         }
         *     });
         *
         *     var a = new My.own.A(1); // alerts '1'
         *     var b = new My.own.B(1); // alerts '1', then alerts '2'
         *     var c = new My.own.C(2); // alerts "Going to call parent's overriden constructor..."
         *                              // alerts '2', then alerts '3'
         *
         * @protected
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * from the current method, for example: `this.callParent(arguments)`
         * @return {Object} Returns the result from the superclass' method
         */
        callParent : function(args) {
            var method = this.callParent.caller, 
                parentClass, 
                methodName;
            if (!method.$owner) {
                if (!method.caller) {
                    Rs.error("Attempting to call a protected method from the public scope, which is not allowed");
                }
                method = method.caller;
            }
            parentClass = method.$owner.superclass;
            methodName = method.$name;
            if (!(methodName in parentClass)) {
                Rs.error("this.callParent() was called but there's no such method (" + methodName
                	   + ") found in the parent class (" + (Rs.getClassName(parentClass) || 'Object'));
            }
            return parentClass[methodName].apply(this, args || []);
        },
        
        /**
         * Get the reference to the class from which this object was instantiated. Note that unlike {@link Rs.Base#self},
         * `this.statics()` is scope-independent and it always returns the class from which it was called, regardless of what
         * `this` points to during run-time
         *
         *     Rs.define('My.Cat', {
         *         statics: {
         *             totalCreated: 0,
         *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
         *         },
         *
         *         constructor: function() {
         *             var statics = this.statics();
         *
         *             alert(statics.speciesName);     // always equals to 'Cat' no matter what 'this' refers to
         *                                             // equivalent to: My.Cat.speciesName
         *
         *             alert(this.self.speciesName);   // dependent on 'this'
         *
         *             statics.totalCreated++;
         *
         *             return this;
         *         },
         *
         *         clone: function() {
         *             var cloned = new this.self;                      // dependent on 'this'
         *
         *             cloned.groupName = this.statics().speciesName;   // equivalent to: My.Cat.speciesName
         *
         *             return cloned;
         *         }
         *     });
         *
         *
         *     Rs.define('My.SnowLeopard', {
         *         extend: 'My.Cat',
         *
         *         statics: {
         *             speciesName: 'Snow Leopard'     // My.SnowLeopard.speciesName = 'Snow Leopard'
         *         },
         *
         *         constructor: function() {
         *             this.callParent();
         *         }
         *     });
         *
         *     var cat = new My.Cat();                 // alerts 'Cat', then alerts 'Cat'
         *
         *     var snowLeopard = new My.SnowLeopard(); // alerts 'Cat', then alerts 'Snow Leopard'
         *
         *     var clone = snowLeopard.clone();
         *     alert(Rs.getClassName(clone));         // alerts 'My.SnowLeopard'
         *     alert(clone.groupName);                 // alerts 'Cat'
         *
         *     alert(My.Cat.totalCreated);             // alerts 3
         *
         * @protected
         * @return {Rs.Class}
         */
        statics : function(){
            var method = this.statics.caller, self = this.self;
            if (!method) {
                return self;
            }
            return method.$owner;
        },

        /**
         * Call the original method that was previously overridden with {@link Rs.Base#override}
         *
         *     Rs.define('My.Cat', {
         *         constructor: function() {
         *             alert("I'm a cat!");
         *
         *             return this;
         *         }
         *     });
         *
         *     My.Cat.override({
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             var instance = this.callOverridden();
         *
         *             alert("Meeeeoooowwww");
         *
         *             return instance;
         *         }
         *     });
         *
         *     var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
         *                               // alerts "I'm a cat!"
         *                               // alerts "Meeeeoooowwww"
         *
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * @return {Object} Returns the result after calling the overridden method
         * @protected
         */
        callOverridden : function(args) {
            var method = this.callOverridden.caller;
            if (!method.$owner) {
                Rs.error("Attempting to call a protected method from the public scope, which is not allowed");
            }
            if (!method.$previous) {
                Rs.error("this.callOverridden was called in '" + method.$name
                       + "' but this method has never been overridden");
            }
            return method.$previous.apply(this, args || []);
        },

        destroy : function() {}
    };

    // These static properties will be copied to every newly created class with {@link Rs#define}
    Rs.apply(Rs.Base, {
	    
    	/**
         * Create a new instance of this Class.
         *
         *     Rs.define('My.cool.Class', {
         *         ...
         *     });
         *
         *     My.cool.Class.create({
         *         someConfig: true
         *     });
         *
         * All parameters are passed to the constructor of the class.
         *
         * @return {Object} the created instance.
         * @static
         * @inheritable
         */
        create : function() {
            return Rs.create.apply(Rs, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        /**
         * @private
         * @inheritable
         */
        own : function(name, value) {
            if (typeof value == 'function') {
                this.ownMethod(name, value);
            } else {
                this.prototype[name] = value;
            }
        },

        /**
         * @private
         * @inheritable
         */
        ownMethod : function(name, fn) {
            var originalFn;
            if (typeof fn.$owner !== 'undefined' && fn !== Rs.emptyFn) {
                originalFn = fn;
                fn = function() {
                    return originalFn.apply(this, arguments);
                };
            }
            var className;
            className = Rs.getClassName(this);
            if (className) {
                fn.displayName = className + '#' + name;
            }
            fn.$owner = this;
            fn.$name = name;
            this.prototype[name] = fn;
        },
        
        /**
         * Add / override static properties of this class.
         *
         *     Rs.define('My.cool.Class', {
         *         ...
         *     });
         *
         *     My.cool.Class.addStatics({
         *         someProperty: 'someValue',      // My.cool.Class.someProperty = 'someValue'
         *         method1: function() { ... },    // My.cool.Class.method1 = function() { ... };
         *         method2: function() { ... }     // My.cool.Class.method2 = function() { ... };
         *     });
         *
         * @param {Object} members
         * @return {Rs.Base} this
         * @static
         * @inheritable
         */
        addStatics : function(members) {
            for ( var name in members) {
                if (members.hasOwnProperty(name)) {
                    this[name] = members[name];
                }
            }
            return this;
        },
        
        /**
         * @private
         * @param {Object} members
         */
        addInheritableStatics : function(members) {
            var inheritableStatics,
                hasInheritableStatics, 
                prototype = this.prototype, 
                name, member;
            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;
            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }
            var className = Rs.getClassName(this);
            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function') {
                        member.displayName = className + '.' + name;
                    }
                    this[name] = member;
                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }
            return this;
        },

        /**
         * Add methods / properties to the prototype of this class.
         *
         *     Rs.define('My.awesome.Cat', {
         *         constructor: function() {
         *             ...
         *         }
         *     });
         *
         *      My.awesome.Cat.implement({
         *          meow: function() {
         *             alert('Meowww...');
         *          }
         *      });
         *
         *      var kitty = new My.awesome.Cat;
         *      kitty.meow();
         *
         * @param {Object} members
         * @static
         * @inheritable
         */
        implement : function(members) {
            var prototype = this.prototype, 
                enumerables = Rs.enumerables, 
                name, i, member;
            var className = Rs.getClassName(this);
            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member === 'function') {
                        member.$owner = this;
                        member.$name = name;
                        if (className) {
                            member.displayName = className + '#' + name;
                        }
                    }
                    prototype[name] = member;
                }
            }
            if (enumerables) {
                for (i = enumerables.length; i--;) {
                    name = enumerables[i];
                    if (members.hasOwnProperty(name)) {
                        member = members[name];
                        member.$owner = this;
                        member.$name = name;
                        prototype[name] = member;
                    }
                }
            }
        },
        
        /**
         * Borrow another class' members to the prototype of this class.
         *
         *     Rs.define('Bank', {
         *         money: '$$$',
         *         printMoney: function() {
         *             alert('$$$$$$$');
         *         }
         *     });
         *
         *     Rs.define('Thief', {
         *         ...
         *     });
         *
         *     Thief.borrow(Bank, ['money', 'printMoney']);
         *
         *     var steve = new Thief();
         *
         *     alert(steve.money); // alerts '$$$'
         *     steve.printMoney(); // alerts '$$$$$$$'
         *
         * @param {Rs.Base} fromClass The class to borrow members from
         * @param {String/String[]} members The names of the members to borrow
         * @return {rs.Base} this
         * @static
         * @inheritable
         */
        borrow : function(fromClass, members) {
            var fromPrototype = fromClass.prototype, 
                i, ln, member;
            members = fromArray(members);
            for (i = 0, ln = members.length; i < ln; i++) {
                member = members[i];
                this.own(member, fromPrototype[member]);
            }
            return this;
        },
        
        /**
         * Override prototype members of this class. Overridden methods can be invoked via
         * {@link Rs.Base#callOverridden}
         *
         *     Rs.define('My.Cat', {
         *         constructor: function() {
         *             alert("I'm a cat!");
         *
         *             return this;
         *         }
         *     });
         *
         *     My.Cat.override({
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             var instance = this.callOverridden();
         *
         *             alert("Meeeeoooowwww");
         *
         *             return instance;
         *         }
         *     });
         *
         *     var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
         *                               // alerts "I'm a cat!"
         *                               // alerts "Meeeeoooowwww"
         *
         * @param {Object} members
         * @return {Rs.Base} this
         * @static
         * @inheritable
         */
        override : function(members) {
            var prototype = this.prototype, 
                enumerables = Rs.enumerables, 
                name, i, member, previous;
            if (arguments.length === 2) {
                name = members;
                member = arguments[1];
                if (typeof member == 'function') {
                    if (typeof prototype[name] == 'function'){
                        previous = prototype[name];
                        member.$previous = previous;
                    }
                    this.ownMethod(name, member);
                } else {
                    prototype[name] = member;
                }
                return this;
            }
            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member === 'function') {
                        if (typeof prototype[name] === 'function') {
                            previous = prototype[name];
                            member.$previous = previous;
                        }
                        this.ownMethod(name, member);
                    } else {
                        prototype[name] = member;
                    }
                }
            }
            if (enumerables) {
                for (i = enumerables.length; i--;) {
                    name = enumerables[i];
                    if (members.hasOwnProperty(name)) {
                        if (typeof prototype[name] !== 'undefined') {
                            previous = prototype[name];
                            members[name].$previous = previous;
                        }
                        this.ownMethod(name, members[name]);
                    }
                }
            }
            return this;
        },

        //<feature classSystem.mixins>
        /**
         * Used internally by the mixins pre-processor
         * @private
         * @inheritable
         */
        mixin : function(name, cls) {
            var mixin = cls.prototype, 
                my = this.prototype, key, fn;
            for (key in mixin) {
                if (mixin.hasOwnProperty(key)) {
                    if (typeof my[key] === 'undefined'
                            && key !== 'mixins'
                            && key !== 'mixinId') {
                        if (typeof mixin[key] === 'function') {
                            fn = mixin[key];
                            if (typeof fn.$owner === 'undefined') {
                                this.ownMethod(key, fn);
                            } else {
                                my[key] = fn;
                            }
                        } else {
                            my[key] = mixin[key];
                        }
                    }
                    else if (key === 'config' && my.config && mixin.config) {
                        mergeObj(my.config, mixin.config);
                    }
                }
            }
            if (typeof mixin.onClassMixedIn !== 'undefined') {
                mixin.onClassMixedIn.call(cls, this);
            }
            if (!my.hasOwnProperty('mixins')) {
                if ('mixins' in my) {
                    my.mixins = mergeObj( {}, my.mixins);
                } else {
                    my.mixins = {};
                }
            }
            my.mixins[name] = mixin;
        },
        // </feature>

        /**
         * Get the current class' name in string format.
         *
         *     Rs.define('My.cool.Class', {
         *         constructor: function() {
         *             alert(this.self.getName()); // alerts 'My.cool.Class'
         *         }
         *     });
         *
         *     My.cool.Class.getName(); // 'My.cool.Class'
         *
         * @return {String} className
         * @static
         * @inheritable
         */
        getName : function() {
            return Rs.getClassName(this);
        },

        /**
         * Create aliases for existing prototype methods. Example:
         *
         *     Rs.define('My.cool.Class', {
         *         method1: function() { ... },
         *         method2: function() { ... }
         *     });
         *
         *     var test = new My.cool.Class();
         *
         *     My.cool.Class.createAlias({
         *         method3: 'method1',
         *         method4: 'method2'
         *     });
         *
         *     test.method3(); // test.method1()
         *
         *     My.cool.Class.createAlias('method5', 'method3');
         *
         *     test.method5(); // test.method3() -> test.method1()
         *
         * @param {String/Object} alias The new method name, or an object to set multiple aliases
         * @param {String/Object} origin The original method name
         * @static
         * @inheritable
         * @method
         */
        createAlias : flexSetter(function(alias, origin) {
            this.prototype[alias] = function() {
                return this[origin].apply(this, arguments);
            };
        })
    });
    
    /**
     * @class Rs.Class
     */
    var Class,
        Base = Rs.Base,
        baseStaticProperties = [],
        baseStaticProperty;
    
    for (baseStaticProperty in Base) {
        if (Base.hasOwnProperty(baseStaticProperty)) {
            baseStaticProperties.push(baseStaticProperty);
        }
    }
    
    /**
     * @method constructor
     * Creates new class.
     * @param {Object} classData An object represent the properties of this class
     * @param {Function} createdFn (Optional) The callback function to be 
     * executed when this class is fully created.
     * Note that the creation process can be asynchronous depending on the pre-processors used.
     * @return {Rs.Base} The newly created class
     */
    Rs.Class = Class = function(newClass, classData, onClassCreated) {
        if (typeof newClass != 'function') {
            onClassCreated = classData;
            classData = newClass;
            newClass = function() {
                return this.constructor.apply(this, arguments);
            };
        }
        if (!classData) {
            classData = {};
        }
        var preprocessorStack = classData.preprocessors || Class.getDefaultPreprocessors(),
            registeredPreprocessors = Class.getPreprocessors(),
            index = 0,
            preprocessors = [],
            preprocessor, staticPropertyName, process, i, j, ln;
        for (i = 0, ln = baseStaticProperties.length; i < ln; i++) {
            staticPropertyName = baseStaticProperties[i];
            newClass[staticPropertyName] = Base[staticPropertyName];
        }
        delete classData.preprocessors;
        for (j = 0, ln = preprocessorStack.length; j < ln; j++) {
            preprocessor = preprocessorStack[j];
            if (typeof preprocessor == 'string') {
                preprocessor = registeredPreprocessors[preprocessor];
                if (!preprocessor.always) {
                    if (classData.hasOwnProperty(preprocessor.name)) {
                        preprocessors.push(preprocessor.fn);
                    }
                }
                else {
                    preprocessors.push(preprocessor.fn);
                }
            }
            else {
                preprocessors.push(preprocessor);
            }
        }
        classData.onClassCreated = onClassCreated || Rs.emptyFn;
        classData.onBeforeClassCreated = function(cls, data) {
            onClassCreated = data.onClassCreated;
            delete data.onBeforeClassCreated;
            delete data.onClassCreated;
            cls.implement(data);
            onClassCreated.call(cls, cls);
        };
        process = function(cls, data) {
            preprocessor = preprocessors[index++];
            if (!preprocessor) {
                data.onBeforeClassCreated.apply(this, arguments);
                return;
            }
            if (preprocessor.call(this, cls, data, process) !== false) {
                process.apply(this, arguments);
            }
        };
        process.call(Class, newClass, classData);
        return newClass;
    };
    
    
    
    Rs.apply(Class, {
    
        /** @private */
        preprocessors: {},
    
        /**
         * Register a new pre-processor to be used during the class creation process
         * @member Rs.Class
         * @param {String} name The pre-processor's name
         * @param {Function} fn The callback function to be executed. Typical format:
         *
         *     function(cls, data, fn) {
         *         // Your code here
         *
         *         // Execute this when the processing is finished.
         *         // Asynchronous processing is perfectly ok
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     });
         *
         * @param {Function} fn.cls The created class
         * @param {Object} fn.data The set of properties passed in {@link Rs.Class} constructor
         * @param {Function} fn.fn The callback function that **must** to be 
         * executed when this pre-processor finishes,
         * regardless of whether the processing is synchronous or aynchronous
         *
         * @return {Rs.Class} this
         * @static
         */
        registerPreprocessor: function(name, fn, always) {
            this.preprocessors[name] = {
                name: name,
                always: always ||  false,
                fn: fn
            };
            return this;
        },
    
        /**
         * Retrieve a pre-processor callback function by its name, which has been registered before
         *
         * @param {String} name
         * @return {Function} preprocessor
         * @static
         */
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },
        
        getPreprocessors: function() {
        	return this.preprocessors;
        },
        
        /**
         * Retrieve the array stack of default pre-processors
         *
         * @return {Function[]} defaultPreprocessors
         * @static
         */
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors || [];
        },
    
        /**
         * Set the default array stack of default pre-processors
         *
         * @param {Function/Function[]} preprocessors
         * @return {Rs.Class} this
         * @static
         */
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = fromArray(preprocessors);
            return this;
        },

        /**
         * Inserts this pre-processor at a specific position in the stack, optionally relative to
         * any existing pre-processor. For example:
         *
         *     Rs.Class.registerPreprocessor('debug', function(cls, data, fn) {
         *         // Your code here
         *
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     }).setDefaultPreprocessorPosition('debug', 'last');
         *
         * @param {String} name The pre-processor name. Note that it needs to be registered with
         * {@link #registerPreprocessor registerPreprocessor} before this
         * @param {String} offset The insertion position. Four possible values are:
         * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument)
         * @param {String} relativeName
         * @return {Rs.Class} this
         * @static
         */
        setDefaultPreprocessorPosition: function(name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;
            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);
                    return this;
                } else if (offset === 'last') {
                    defaultPreprocessors.push(name);
                    return this;
                }
                offset = (offset === 'after') ? 1 : -1;
            }
            index = indexOfArray(defaultPreprocessors, relativeName);
            if (index !== -1) {
                splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }
            return this;
        }
    });
    
    /**
     * @cfg {String} extend
     * The parent class that this class extends. For example:
     *
     *     Rs.define('Person', {
     *         say: function(text) { alert(text); }
     *     });
     *
     *     Rs.define('Developer', {
     *         extend: 'Person',
     *         say: function(text) { this.callParent(["print "+text]); }
     *     });
     */
    Class.registerPreprocessor('extend', function(cls, data) {
        var extend = data.extend,
            base = Rs.Base,
            basePrototype = base.prototype,
            prototype = function() {},
            parent, i, k, ln, staticName, parentStatics,
            parentPrototype, clsPrototype;
        if (extend && extend !== Object) {
            parent = extend;
        } else {
            parent = base;
        }
        parentPrototype = parent.prototype;
        prototype.prototype = parentPrototype;
        clsPrototype = cls.prototype = new prototype();
        if (!('$class' in parent)) {
            for (i in basePrototype) {
                if (!parentPrototype[i]) {
                    parentPrototype[i] = basePrototype[i];
                }
            }
        }
        clsPrototype.self = cls;
        cls.superclass = clsPrototype.superclass = parentPrototype;
        delete data.extend;
        
        // <feature classSystem.inheritableStatics>
        // Statics inheritance
        parentStatics = parentPrototype.$inheritableStatics;
        if (parentStatics) {
            for (k = 0, ln = parentStatics.length; k < ln; k++) {
                staticName = parentStatics[k];
                if (!cls.hasOwnProperty(staticName)) {
                    cls[staticName] = parent[staticName];
                }
            }
        }
        // </feature>
        // <feature classSystem.config>
        // Merge the parent class' config object without referencing it
        if (parentPrototype.config) {
            clsPrototype.config = mergeObj({}, parentPrototype.config);
        } else {
            clsPrototype.config = {};
        }
        // </feature>
        // <feature classSystem.onClassExtended>
        if (clsPrototype.$onExtended) {
            clsPrototype.$onExtended.call(cls, cls, data);
        }
        if (data.onClassExtended) {
            clsPrototype.$onExtended = data.onClassExtended;
            delete data.onClassExtended;
        }
        // </feature>
    }, true);
    
    
    /**
     * @cfg {Object} statics
     * List of static methods for this class. For example:
     *
     *     Rs.define('Computer', {
     *          statics: {
     *              factory: function(brand) {
     *                  // 'this' in static methods refer to the class itself
     *                  return new this(brand);
     *              }
     *          },
     *
     *          constructor: function() { ... }
     *     });
     *
     *     var dellComputer = Computer.factory('Dell');
     */
    Class.registerPreprocessor('statics', function(cls, data) {
        cls.addStatics(data.statics);
        delete data.statics;
    });
    
    //<feature classSystem.inheritableStatics>
    /**
     * @cfg {Object} inheritableStatics
     * List of inheritable static methods for this class.
     * Otherwise just like {@link #statics} but subclasses inherit these methods.
     */
    Class.registerPreprocessor('inheritableStatics', function(cls, data) {
        cls.addInheritableStatics(data.inheritableStatics);
        delete data.inheritableStatics;
    });
    
    //<feature classSystem.config>
    /**
     * @cfg {Object} config
     * List of configuration options with their default values, for which automatically
     * accessor methods are generated.  For example:
     *
     *     Rs.define('SmartPhone', {
     *          config: {
     *              hasTouchScreen: false,
     *              operatingSystem: 'Other',
     *              price: 500
     *          },
     *          constructor: function(cfg) {
     *              this.initConfig(cfg);
     *          }
     *     });
     *
     *     var iPhone = new SmartPhone({
     *          hasTouchScreen: true,
     *          operatingSystem: 'iOS'
     *     });
     *
     *     iPhone.getPrice(); // 500;
     *     iPhone.getOperatingSystem(); // 'iOS'
     *     iPhone.getHasTouchScreen(); // true;
     *     iPhone.hasTouchScreen(); // true
     */
    Class.registerPreprocessor('config', function(cls, data) {
        var prototype = cls.prototype;
        eachObj(data.config, function(name) {
            var cName = name.charAt(0).toUpperCase() + name.substr(1),
                pName = name,
                apply = 'apply' + cName,
                setter = 'set' + cName,
                getter = 'get' + cName;
            if (!(apply in prototype) && !data.hasOwnProperty(apply)) {
                data[apply] = function(val) {
                    return val;
                };
            }
            if (!(setter in prototype) && !data.hasOwnProperty(setter)) {
                data[setter] = function(val) {
                    var ret = this[apply].call(this, val, this[pName]);
                    if (typeof ret != 'undefined') {
                        this[pName] = ret;
                    }
                    return this;
                };
            }
            if (!(getter in prototype) && !data.hasOwnProperty(getter)) {
                data[getter] = function() {
                    return this[pName];
                };
            }
        });
        mergeObj(prototype.config, data.config);
        delete data.config;
    });
    
    
    //<feature classSystem.mixins>
    /**
     * @cfg {Object} mixins
     * List of classes to mix into this class. For example:
     *
     *     Rs.define('CanSing', {
     *          sing: function() {
     *              alert("I'm on the highway to hell...")
     *          }
     *     });
     *
     *     Rs.define('Musician', {
     *          extend: 'Person',
     *
     *          mixins: {
     *              canSing: 'CanSing'
     *          }
     *     })
     */
    Class.registerPreprocessor('mixins', function(cls, data) {
        var mixins = data.mixins,
            name, mixin, i, ln;
        delete data.mixins;
        interceptBefore(data, 'onClassCreated', function(cls) {
            if (mixins instanceof Array) {
                for (i = 0,ln = mixins.length; i < ln; i++) {
                    mixin = mixins[i];
                    name = mixin.prototype.mixinId || mixin.$className;
                    cls.mixin(name, mixin);
                }
            } else {
                for (name in mixins) {
                    if (mixins.hasOwnProperty(name)) {
                        cls.mixin(name, mixins[name]);
                    }
                }
            }
        });
    });
    // </feature>
    
    Class.setDefaultPreprocessors([
        'extend'
        // <feature classSystem.statics>
        ,'statics'
        // </feature>
        // <feature classSystem.inheritableStatics>
        ,'inheritableStatics'
        // </feature>
        // <feature classSystem.config>
        ,'config'
        // </feature>
        // <feature classSystem.mixins>
        ,'mixins'
        // </feature>
    ]);
    
    // <feature classSystem.backwardsCompatible>
    // Backwards compatible
    /*
    Rs.extend = function(subclass, superclass, members) {
        if (arguments.length === 2 && Rs.isObject(superclass)) {
            members = superclass;
            superclass = subclass;
            subclass = null;
        }
        var cls;
    
        if (!superclass) {
            Rs.error("Attempting to extend from a class which has not been loaded on the page.");
        }
    
        members.extend = superclass;
        members.preprocessors = [
            'extend'
            // <feature classSystem.statics>
            ,'statics'
            // </feature>
            // <feature classSystem.inheritableStatics>
            ,'inheritableStatics'
            // </feature>
            // <feature classSystem.mixins>
            ,'mixins'
            // </feature>
            // <feature classSystem.config>
            ,'config'
            // </feature>
        ];
    
        if (subclass) {
            cls = new Class(subclass, members);
        }
        else {
            cls = new Class(members);
        }
    
        cls.prototype.override = function(o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };
    
        return cls;
    };
    */
    
    /**
     * @class Ext.ClassManager
     */
    /**
     * @author Jacky Nguyen <jacky@sencha.com>
     * @docauthor Jacky Nguyen <jacky@sencha.com>
     * @class Rs.ClassManager
     *
     * Rs.ClassManager manages all classes and handles mapping from string class name to
     * actual class objects throughout the whole framework. It is not generally accessed directly, rather through
     * these convenient shorthands:
     *
     * - {@link Rs#define Rs.define}
     * - {@link Rs#create Rs.create}
     * - {@link Rs#getClass Rs.getClass}
     * - {@link Rs#getClassName Rs.getClassName}
     *
     * # Basic syntax:
     *
     *     Rs.define(className, properties);
     *
     * in which `properties` is an object represent a collection of properties that apply to the class. See
     * {@link Rs.ClassManager#create} for more detailed instructions.
     *
     *     Rs.define('Person', {
     *          name: 'Unknown',
     *
     *          constructor: function(name) {
     *              if (name) {
     *                  this.name = name;
     *              }
     *
     *              return this;
     *          },
     *
     *          eat: function(foodType) {
     *              alert("I'm eating: " + foodType);
     *
     *              return this;
     *          }
     *     });
     *
     *     var aaron = new Person("Aaron");
     *     aaron.eat("Sandwich"); // alert("I'm eating: Sandwich");
     *
     * Rs.Class has a powerful set of extensible {@link Rs.Class#registerPreprocessor pre-processors} which takes care of
     * everything related to class creation, including but not limited to inheritance, mixins, configuration, statics, etc.
     *
     * # Inheritance:
     *
     *     Rs.define('Developer', {
     *          extend: 'Person',
     *
     *          constructor: function(name, isGeek) {
     *              this.isGeek = isGeek;
     *
     *              // Apply a method from the parent class' prototype
     *              this.callParent([name]);
     *
     *              return this;
     *
     *          },
     *
     *          code: function(language) {
     *              alert("I'm coding in: " + language);
     *
     *              this.eat("Bugs");
     *
     *              return this;
     *          }
     *     });
     *
     *     var jacky = new Developer("Jacky", true);
     *     jacky.code("JavaScript"); // alert("I'm coding in: JavaScript");
     *                               // alert("I'm eating: Bugs");
     *
     * See {@link Rs.Base#callParent} for more details on calling superclass' methods
     *
     * # Mixins:
     *
     *     Rs.define('CanPlayGuitar', {
     *          playGuitar: function() {
     *             alert("F#...G...D...A");
     *          }
     *     });
     *
     *     Rs.define('CanComposeSongs', {
     *          composeSongs: function() { ... }
     *     });
     *
     *     Rs.define('CanSing', {
     *          sing: function() {
     *              alert("I'm on the highway to hell...")
     *          }
     *     });
     *
     *     Rs.define('Musician', {
     *          extend: 'Person',
     *
     *          mixins: {
     *              canPlayGuitar: 'CanPlayGuitar',
     *              canComposeSongs: 'CanComposeSongs',
     *              canSing: 'CanSing'
     *          }
     *     })
     *
     *     Rs.define('CoolPerson', {
     *          extend: 'Person',
     *
     *          mixins: {
     *              canPlayGuitar: 'CanPlayGuitar',
     *              canSing: 'CanSing'
     *          },
     *
     *          sing: function() {
     *              alert("Ahem....");
     *
     *              this.mixins.canSing.sing.call(this);
     *
     *              alert("[Playing guitar at the same time...]");
     *
     *              this.playGuitar();
     *          }
     *     });
     *
     *     var me = new CoolPerson("Jacky");
     *
     *     me.sing(); // alert("Ahem...");
     *                // alert("I'm on the highway to hell...");
     *                // alert("[Playing guitar at the same time...]");
     *                // alert("F#...G...D...A");
     *
     * # Config:
     *
     *     Rs.define('SmartPhone', {
     *          config: {
     *              hasTouchScreen: false,
     *              operatingSystem: 'Other',
     *              price: 500
     *          },
     *
     *          isExpensive: false,
     *
     *          constructor: function(config) {
     *              this.initConfig(config);
     *
     *              return this;
     *          },
     *
     *          applyPrice: function(price) {
     *              this.isExpensive = (price > 500);
     *
     *              return price;
     *          },
     *
     *          applyOperatingSystem: function(operatingSystem) {
     *              if (!(/^(iOS|Android|BlackBerry)$/i).test(operatingSystem)) {
     *                  return 'Other';
     *              }
     *
     *              return operatingSystem;
     *          }
     *     });
     *
     *     var iPhone = new SmartPhone({
     *          hasTouchScreen: true,
     *          operatingSystem: 'iOS'
     *     });
     *
     *     iPhone.getPrice(); // 500;
     *     iPhone.getOperatingSystem(); // 'iOS'
     *     iPhone.getHasTouchScreen(); // true;
     *     iPhone.hasTouchScreen(); // true
     *
     *     iPhone.isExpensive; // false;
     *     iPhone.setPrice(600);
     *     iPhone.getPrice(); // 600
     *     iPhone.isExpensive; // true;
     *
     *     iPhone.setOperatingSystem('AlienOS');
     *     iPhone.getOperatingSystem(); // 'Other'
     *
     * # Statics:
     *
     *     Rs.define('Computer', {
     *          statics: {
     *              factory: function(brand) {
     *                 // 'this' in static methods refer to the class itself
     *                  return new this(brand);
     *              }
     *          },
     *
     *          constructor: function() { ... }
     *     });
     *
     *     var dellComputer = Computer.factory('Dell');
     *
     * Also see {@link Rs.Base#statics} and {@link Rs.Base#self} for more details on accessing
     * static properties within class methods
     *
     * @singleton
     */
    var slice = Array.prototype.slice;

    var Manager = Rs.ClassManager = {

		/**
		 * @property {Object} classes
		 * All classes which were defined through the ClassManager. Keys are the
		 * name of the classes and the values are references to the classes.
		 * @private
		 */
        classes: {},

        /**
         * @private
         */
        existCache: {},
        
        /**
         * @private
         */
        namespaceRewrites: [{
            from: 'rs.',
            to: {}
        }],

        /**
         * @private
         */
        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {}
        },

        /** @private */
        instantiators: [],

        // <debug>
        /** @private */
        instantiationCounts: {},

        /**
         * Checks if a class has already been created.
         *
         * @param {String} className
         * @return {Boolean} exist
         */
        isCreated: function(className) {
            var i, ln, part, root, parts;
            if (typeof className !== 'string' || className.length < 1) {
                Rs.error("Invalid classname, must be a string and must not be empty");
            }
            if (this.classes.hasOwnProperty(className) || this.existCache.hasOwnProperty(className)) {
                return true;
            }
            root = Rs.global;
            parts = this.parseNamespace(className);
            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];
                if (typeof part !== 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }
                    root = root[part];
                }
            }
            this.existCache[className] = true;
            return true;
        },

        /**
         * Supports namespace rewriting
         * @private
         */
        parseNamespace: function(namespace) {
            if (typeof namespace !== 'string') {
                Rs.error("Invalid namespace, must be a string");
            }
            var parts = [];
            parts = parts.concat(namespace.split('.'));
            return parts;
        },

        /**
         * Creates a namespace and assign the `value` to the created object
         *
         *     Rs.ClassManager.setNamespace('MyCompany.pkg.Example', someObject);
         *
         *     alert(MyCompany.pkg.Example === someObject); // alerts true
         *
         * @param {String} name
         * @param {Object} value
         */
        setNamespace: function(name, value) {
            var root = Rs.global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;
            for (i = 0; i < ln; i++) {
                part = parts[i];
                if (typeof part !== 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }
                    root = root[part];
                }
            }
            root[leaf] = value;
            return root[leaf];
        },

        /**
         * The new Rs.ns, supports namespace rewriting
         * @private
         */
        createNamespaces: function() {
            var root = Rs.global,
                parts, part, i, j, ln, subLn;
            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);
                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];
                    if (typeof part !== 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }
                        root = root[part];
                    }
                }
            }
            return root;
        },

        /**
         * Sets a name reference to a class.
         * 
         * @param {String}
         *            name
         * @param {Object}
         *            value
         * @return {Rs.ClassManager} this
         */
        set: function(name, value) {
            var targetName = this.getName(value);
            this.classes[name] = this.setNamespace(name, value);
            if (targetName && targetName !== name) {
                this.maps.alternateToName[name] = targetName;
            }
            return this;
        },

        /**
         * Retrieve a class by its name.
         * 
         * @param {String}
         *            name
         * @return {Rs.Class} class
         */
        get: function(name) {
            if (this.classes.hasOwnProperty(name)) {
                return this.classes[name];
            }
            //TODO: 考虑对未通过Rs.define方法定义的类的支持
            Rs.error('undefined class:' + name);
        },

        /**
         * Register the alias for a class.
         * 
         * @param {Rs.Class/String}
         *            cls a reference to a class or a className
         * @param {String}
         *            alias Alias to use when referring to this class
         */
        setAlias: function(cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className;
            if (typeof cls === 'string') {
                className = cls;
            } else {
                className = this.getName(cls);
            }
            if (alias && aliasToNameMap[alias] !== className) {
                if (aliasToNameMap.hasOwnProperty(alias) && Rs.isDefined(Rs.global.console)){
                    Rs.global.console.log("[Rs.ClassManager] Overriding existing alias: '" + alias + "' " +
                        "of: '" + aliasToNameMap[alias] + "' with: '" + className + "'. Be sure it's intentional.");
                }
                aliasToNameMap[alias] = className;
            }
            if (!nameToAliasesMap[className]) {
                nameToAliasesMap[className] = [];
            }
            if (alias) {
                includeArray(nameToAliasesMap[className], alias);
            }
            return this;
        },

        /**
         * Get a reference to the class by its alias.
         * 
         * @param {String}
         *            alias
         * @return {Rs.Class} class
         */
        getByAlias: function(alias) {
            return this.get(this.getNameByAlias(alias));
        },

        /**
         * Get the name of a class by its alias.
         * 
         * @param {String}
         *            alias
         * @return {String} className
         */
        getNameByAlias: function(alias) {
            return this.maps.aliasToName[alias] || '';
        },

        /**
         * Get the name of a class by its alternate name.
         * 
         * @param {String}
         *            alternate
         * @return {String} className
         */
        getNameByAlternate: function(alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        /**
         * Get the aliases of a class by the class name
         * 
         * @param {String}
         *            name
         * @return {String[]} aliases
         */
        getAliasesByName: function(name) {
            return this.maps.nameToAliases[name] || [];
        },

        /**
         * Get the name of the class by its reference or its instance.
         * 
         * {@link Rs#getClassName Rs.getClassName} is alias for
         * {@link Rs.ClassManager#getName Rs.ClassManager.getName}.
         * 
         * @param {Rs.Class/Object}
         *            object
         * @return {String} className
         */
        getName: function(object) {
            return object && object.$className || '';
        },

        /**
         * Get the class of the provided object; returns null if it's not an
         * instance of any class created with Rs.define.
         * 
         * {@link Rs#getClass Rs.getClass} is alias for
         * {@link Rs.ClassManager#getClass Rs.ClassManager.getClass}.
         * 
         * @param {Object}
         *            object
         * @return {Rs.Class} class
         */
        getClass: function(object) {
            return object && object.self || null;
        },

        /**
         * Defines a class.
         * 定义一个类
         *
         * {@link Rs#define Rs.define} and {@link Rs.ClassManager#create Rs.ClassManager.create} are almost aliases
         * of each other, with the only exception that Ext.define allows definition of {@link Rs.Class#override overrides}.
         * To avoid trouble, always use Ext.define.
         *
         *     Rs.define('My.awesome.Class', {
         *         someProperty: 'something',
         *         someMethod: function() { ... }
         *         ...
         *
         *     }, function() {
         *         alert('Created!');
         *         alert(this === My.awesome.Class); // alerts true
         *
         *         var myInstance = new this();
         *     });
         *
         * @param {String} className The class name to create in string dot-namespaced format, for example:
         * `My.very.awesome.Class`, `FeedViewer.plugin.CoolPager`. It is highly recommended to follow this simple convention:
         *
         * - The root and the class name are 'CamelCased'
         * - Everything else is lower-cased
         *
         * @param {Object} data The key-value pairs of properties to apply to this class. Property names can be of any valid
         * strings, except those in the reserved list below:
         *
         * - {@link Rs.Base#self self}
         * - {@link Rs.Class#alias alias}
         * - {@link Rs.Class#alternateClassName alternateClassName}
         * - {@link Rs.Class#config config}
         * - {@link Rs.Class#extend extend}
         * - {@link Rs.Class#inheritableStatics inheritableStatics}
         * - {@link Rs.Class#mixins mixins}
         * - {@link Rs.Class#override override} (only when using {@link Ext#define Ext.define})
         * - {@link Rs.Class#requires requires}
         * - {@link Rs.Class#singleton singleton}
         * - {@link Rs.Class#statics statics}
         * - {@link Rs.Class#uses uses}
         *
         * @param {Function} [createdFn] callback to execute after the class is created, the execution scope of which
         * (`this`) will be the newly created class itself.
         *
         * @return {Rs.Base}
         */
        create: function(className, data, createdFn) {
            var manager = this;
            if (typeof className !== 'string') {
                Rs.error("Invalid class name '" + className + "' specified, must be a non-empty string");
            }
            data.$className = className;
            return new Class(data, function() {
                var postprocessorStack = data.postprocessors || manager.defaultPostprocessors,
                    registeredPostprocessors = manager.postprocessors,
                    index = 0,
                    postprocessors = [],
                    postprocessor, process, i, ln;
                delete data.postprocessors;
                for (i = 0, ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];
                    if (typeof postprocessor === 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        if (!postprocessor.always) {
                            if (data[postprocessor.name] !== undefined) {
                                postprocessors.push(postprocessor.fn);
                            }
                        } else {
                            postprocessors.push(postprocessor.fn);
                        }
                    } else {
                        postprocessors.push(postprocessor);
                    }
                }
                process = function(clsName, cls, clsData) {
                    postprocessor = postprocessors[index++];
                    if (!postprocessor) {
                        manager.set(className, cls);
                        if (createdFn) {
                            createdFn.call(cls, cls);
                        }
                        return;
                    }
                    if (postprocessor.call(this, clsName, cls, clsData, process) !== false) {
                        process.apply(this, arguments);
                    }
                };
                process.call(manager, className, this, data);
            });
        },
        
        /**
         * Instantiate a class by its alias.
         * 
         * {@link Rs#createByAlias Rs.createByAlias} is alias for 
         * {@link Rs.ClassManager#instantiateByAlias Rs.ClassManager.instantiateByAlias}.
         *
         * @param {String} alias
         * @param {Object...} args Additional arguments after the alias will be passed to the
         * class constructor.
         * @return {Object} instance
         */
        instantiateByAlias: function() {
            var alias = arguments[0],
                args = slice.call(arguments),
                className = this.getNameByAlias(alias);
            if (!className) {
                className = this.maps.aliasToName[alias];
                if (!className) {
                    Rs.error("Cannot create an instance of unrecognized alias: " + alias);
                }
            }
            args[0] = className;
            return this.instantiate.apply(this, args);
        },
       
        /**
         * Instantiate a class by either full name, alias or alternate name.
         * 
         * {@link Rs#create Rs.create} is alias for {@link Rs.ClassManager#instantiate Rs.ClassManager.instantiate}.
         *
         * @param {String} name
         * @param {Object...} args Additional arguments after the name will be passed to the class' constructor.
         * @return {Object} instance
         */
        instantiate: function(){
            var name = arguments[0],
                args = slice.call(arguments, 1),
                alias = name,
                possibleName, cls;
            if (typeof name !== 'function') {
                if ((typeof name !== 'string' || name.length < 1)) {
                    Rs.error("Invalid class name or alias '" + name + "' specified, must be a non-empty string");
                }
                cls = this.get(name);
            } else {
                cls = name;
            }
            // No record of this class name, it's possibly an alias, so look it up
            if (!cls) {
                possibleName = this.getNameByAlias(name);
                if (possibleName) {
                    name = possibleName;
                    cls = this.get(name);
                }
            }
            // Still no record of this class name, it's possibly an alternate name, so look it up
            if (!cls) {
                possibleName = this.getNameByAlternate(name);
                if (possibleName) {
                    name = possibleName;
                    cls = this.get(name);
                }
            }
            if (!cls) {
                Rs.error("Cannot create an instance of unrecognized class name / alias: " + alias);
            }
            if (typeof cls !== 'function') {
                Rs.error("'" + name + "' is a singleton and cannot be instantiated");
            }
            //记录该类实例个数
            if (!this.instantiationCounts[name]) {
                this.instantiationCounts[name] = 0;
            }
            this.instantiationCounts[name]++;
            return this.getInstantiator(args.length)(cls, args);
        },

        /**
         * @private
         * @param name
         * @param args
         */
        dynInstantiate: function(name, args) {
            args = fromArray(args, true);
            args.unshift(name);
            return this.instantiate.apply(this, args);
        },

        /**
         * @private
         * @param length
         */
        getInstantiator: function(length) {
            if (!this.instantiators[length]) {
                var i = length,
                    args = [];

                for (i = 0; i < length; i++) {
                    args.push('a['+i+']');
                }

                this.instantiators[length] = new Function('c', 'a', 'return new c('+args.join(',')+')');
            }

            return this.instantiators[length];
        },

        /**
         * @private
         */
        postprocessors: {},

        /**
         * @private
         */
        defaultPostprocessors: [],

        /**
         * Register a post-processor function.
         * 
         * @param {String}
         *            name
         * @param {Function}
         *            postprocessor
         */
        registerPostprocessor: function(name, fn, always) {
            this.postprocessors[name] = {
                name: name,
                always: always ||  false,
                fn: fn
            };
            return this;
        },

        /**
         * Set the default post processors array stack which are applied to
         * every class.
         * 
         * @param {String/String[]}
         *            The name of a registered post processor or an array of
         *            registered names.
         * @return {Rs.ClassManager} this
         */
        setDefaultPostprocessors: function(postprocessors) {
            this.defaultPostprocessors = fromArray(postprocessors);
            return this;
        },

        /**
         * Insert this post-processor at a specific position in the stack,
         * optionally relative to any existing post-processor
         * 
         * @param {String}
         *            name The post-processor name. Note that it needs to be
         *            registered with
         *            {@link Rs.ClassManager#registerPostprocessor} before this
         * @param {String}
         *            offset The insertion position. Four possible values are:
         *            'first', 'last', or: 'before', 'after' (relative to the
         *            name provided in the third argument)
         * @param {String}
         *            relativeName
         * @return {Rs.ClassManager} this
         */
        setDefaultPostprocessorPosition: function(name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;
            if (typeof offset === 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);
                    return this;
                } else if (offset === 'last') {
                    defaultPostprocessors.push(name);
                    return this;
                }
                offset = (offset === 'after') ? 1 : -1;
            }
            index = indexOfArray(defaultPostprocessors, relativeName);
            if (index !== -1) {
                splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }
            return this;
        },

       
        /**
         * Converts a string expression to an array of matching class names. An expression can either refers to class aliases
         * or class names. Expressions support wildcards:
         *
         * @param {String} expression
         * @return {String[]} classNames
         */
        getNamesByExpression: function(expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;
            if (typeof expression !== 'string' || expression.length < 1) {
                Rs.error("Expression " + expression + " is invalid, must be a non-empty string");
            }
            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');
                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];
                        if (name.search(regex) !== -1) {
                            names.push(name);
                        } else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];
                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                possibleName = this.getNameByAlias(expression);
                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);
                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }
            return names;
        }
    };

    var defaultPostprocessors = Manager.defaultPostprocessors;
    // <feature classSystem.alias>

    /**
     * @cfg {String[]} alias
     * @member Rs.Class
     * List of short aliases for class names.
     */
    Manager.registerPostprocessor('alias', function(name, cls, data) {
        var aliases = data.alias,
            i, ln;
        delete data.alias;
        for (i = 0, ln = aliases.length; i < ln; i++) {
            alias = aliases[i];
            this.setAlias(cls, alias);
        }
    });

    /**
     * @cfg {Boolean} singleton
     * @member Rs.Class
     * When set to true, the class will be instantiated as singleton.  For example:
     *
     *     Rs.define('Logger', {
     *         singleton: true,
     *         log: function(msg) {
     *             console.log(msg);
     *         }
     *     });
     *
     *     Logger.log('Hello');
     */
    Manager.registerPostprocessor('singleton', function(name, cls, data, fn) {
        fn.call(this, name, new cls(), data);
        return false;
    });

    /**
     * @cfg {String/String[]} alternateClassName
     * @member Rs.Class
     * Defines alternate names for this class.  For example:
     *
     *     Rs.define('Developer', {
     *         alternateClassName: ['Coder', 'Hacker'],
     *         code: function(msg) {
     *             alert('Typing... ' + msg);
     *         }
     *     });
     *
     *     var joe = Rs.create('Developer');
     *     joe.code('stackoverflow');
     *
     *     var rms = Rs.create('Hacker');
     *     rms.code('hack hack');
     */
    Manager.registerPostprocessor('alternateClassName', function(name, cls, data) {
        var alternates = data.alternateClassName,
            i, ln, alternate;
        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }
        for (i = 0, ln = alternates.length; i < ln; i++) {
            alternate = alternates[i];
            if (typeof alternate !== 'string') {
                Rs.error("Invalid alternate of: '" + alternate 
                		+ "' for class: '" + name + "'; must be a valid string");
            }
            this.set(alternate, cls);
        }
    });

    Manager.setDefaultPostprocessors(['alias', 'singleton', 'alternateClassName']);

    Rs.apply(Rs, {

    	/**
         * @method
         * @member Rs
         * @alias Rs.ClassManager#instantiate
         */
        create: aliasMethod(Manager, 'instantiate'),

        /**
         * @private
         * API to be stablized
         *
         * @param {Object} item
         * @param {String} namespace
         */
        factory: function(item, namespace) {
            if (item instanceof Array) {
                var i, ln;
                for (i = 0, ln = item.length; i < ln; i++) {
                    item[i] = Rs.factory(item[i], namespace);
                }
                return item;
            }
            var isString = (typeof item === 'string');
            if (isString || (item instanceof Object && item.constructor === Object)) {
                var name, config = {};
                if (isString) {
                    name = item;
                } else {
                    name = item.className;
                    config = item;
                    delete config.className;
                }
                if (namespace !== undefined && name.indexOf(namespace) === -1) {
                    name = namespace + '.' + capitalize(name);
                }
                return Rs.create(name, config);
            }
            if (typeof item === 'function') {
                return Rs.create(item);
            }
            return item;
        },


        /**
         * @method
         * @member Rs
         * @alias Rs.ClassManager#instantiateByAlias
         */
        createByAlias: aliasMethod(Manager, 'instantiateByAlias'),

        /**
         * @cfg {String} override
         * @member Rs.Class
         * 
         * Defines an override applied to a class. Note that **overrides can only be created using
         * {@link Rs#define}.** {@link Rs.ClassManager#create} only creates classes.
         * 
         * To define an override, include the override property. The content of an override is
         * aggregated with the specified class in order to extend or modify that class. This can be
         * as simple as setting default property values or it can extend and/or replace methods.
         * This can also extend the statics of the class.
         *
         * One use for an override is to break a large class into manageable pieces.
         *
         *      Rs.define('My.app.Panel', {
         *          
         *          extend: 'Ext.Panel',
         *          
         *          constructor: function (config) {
         *              this.callSuper(arguments); // calls Ext.panel.Panel's constructor
         *              //...
         *          },
         *
         *          statics: {
         *              method: function () {
         *                  return 'abc';
         *              }
         *          }
         *      });
         *
         *      Rs.define('My.app.PanelPart2', {
         *          
         *          override: 'My.app.Panel',
         *
         *          constructor: function (config) {
         *              this.callSuper(arguments); // calls My.app.Panel's constructor
         *              //...
         *          }
         *      });
         *
         */
        
        /**
         * @method
         *
         * @member Rs
         * @alias Rs.ClassManager#create
         */
        define: function (className, data, createdFn) {
            if (!data.override) {
                return Manager.create.apply(Manager, arguments);
            }
            var overrideName = className;
            data = Rs.apply({}, data);
            delete data.override;
            return Manager.create(overrideName, {
                    isPartial: true,
                    constructor: function () {
                        throw new Error("Cannot create override '" + overrideName + "'");
                    }
                }, function () {
                    var cls = Manager.get(className);
                    if (cls.override) { // if (normal class)
                        cls.override(data);
                    } else { // else (singleton)
                        cls.self.override(data);
                    }
                    if (createdFn) {
                        // called once the override is applied and with the
                        // context of the
                        // overridden class (the override itself is a
                        // meaningless, name-only
                        // thing).
                        createdFn.call(cls);
                    }
                });
        },

        /**
         * @method
         * @member Rs
         * @alias Rs.ClassManager#getName
         */
        getClassName: aliasMethod(Manager, 'getName'),

        /**
         * Returns the displayName property or className or object.
         * When all else fails, returns "Anonymous".
         * @param {Object} object
         * @return {String}
         */
        getDisplayName: function(object) {
            if (object.displayName) {
                return object.displayName;
            }
            if (object.$name && object.$class) {
                return Rs.getClassName(object.$class) + '#' + object.$name;
            }
            if (object.$className) {
                return object.$className;
            }
            return 'Anonymous';
        },

        /**
         * @method
         * @member Rs
         * @alias Rs.ClassManager#getClass
         */
        getClass: aliasMethod(Manager, 'getClass')//,

    });

    Class.registerPreprocessor('className', function(cls, data) {
        if (data.$className) {
            cls.$className = data.$className;
            cls.displayName = cls.$className;
        }
    }, true);

    Class.setDefaultPreprocessorPosition('className', 'first');

    Class.registerPreprocessor('xtype', function(cls, data) {
        var xtypes = fromArray(data.xtype),
            aliases = fromArray(data.alias),
            i, ln, xtype;
        data.xtype = xtypes[0];
        data.xtypes = xtypes;
        aliases = data.alias = fromArray(data.alias);
        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];
            if (typeof xtype != 'string' || xtype.length < 1) {
                throw new Error("[Rs.define] Invalid xtype of: '" + xtype + "' for class: '" + name + "'; must be a valid non-empty string");
            }
        }
        data.alias = aliases;
    });

    Class.setDefaultPreprocessorPosition('xtype', 'last');

    Class.registerPreprocessor('alias', function(cls, data) {
        var aliases = fromArray(data.alias),
            xtypes = fromArray(data.xtypes),
            i, ln, alias, xtype;
        for (i = 0, ln = aliases.length; i < ln; i++) {
            alias = aliases[i];
            if (typeof alias != 'string') {
                throw new Error("[Rs.define] Invalid alias of: '" + alias + "' for class: '" + name + "'; must be a valid string");
            }
        }
        data.alias = aliases;
        data.xtypes = xtypes;
    });

    Class.setDefaultPreprocessorPosition('alias', 'last');
    
})(Rs);
/**
 * @class Rs.DomHelper
 * <p>The DomHelper class provides a layer of abstraction from DOM and transparently supports creating
 * elements via DOM or using HTML fragments. It also has the ability to create HTML fragment templates
 * from your DOM building code.</p>
 *
 * <p><b><u>DomHelper element specification object</u></b></p>
 * <p>A specification object is used when creating elements. Attributes of this object
 * are assumed to be element attributes, except for 4 special attributes:
 * <div class="mdetail-params"><ul>
 * <li><b><tt>tag</tt></b> : <div class="sub-desc">The tag name of the element</div></li>
 * <li><b><tt>children</tt></b> : or <tt>cn</tt><div class="sub-desc">An array of the
 * same kind of element definition objects to be created and appended. These can be nested
 * as deep as you want.</div></li>
 * <li><b><tt>cls</tt></b> : <div class="sub-desc">The class attribute of the element.
 * This will end up being either the "class" attribute on a HTML fragment or className
 * for a DOM node, depending on whether DomHelper is using fragments or DOM.</div></li>
 * <li><b><tt>html</tt></b> : <div class="sub-desc">The innerHTML for the element</div></li>
 * </ul></div></p>
 *
 * <p><b><u>Insertion methods</u></b></p>
 * <p>Commonly used insertion methods:
 * <div class="mdetail-params"><ul>
 * <li><b><tt>{@link #append}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #insertBefore}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #insertAfter}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #overwrite}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #createTemplate}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #insertHtml}</tt></b> : <div class="sub-desc"></div></li>
 * </ul></div></p>
 *
 * <p><b><u>Example</u></b></p>
 * <p>This is an example, where an unordered list with 3 children items is appended to an existing
 * element with id <tt>'my-div'</tt>:<br>
 <pre><code>
var dh = Rs.DomHelper; // create shorthand alias
// specification object
var spec = {
    id: 'my-ul',
    tag: 'ul',
    cls: 'my-list',
    // append children after creating
    children: [     // may also specify 'cn' instead of 'children'
        {tag: 'li', id: 'item0', html: 'List Item 0'},
        {tag: 'li', id: 'item1', html: 'List Item 1'},
        {tag: 'li', id: 'item2', html: 'List Item 2'}
    ]
};
var list = dh.append(
    'my-div', // the context element 'my-div' can either be the id or the actual node
    spec      // the specification object
);
 </code></pre></p>
 * <p>Element creation specification parameters in this class may also be passed as an Array of
 * specification objects. This can be used to insert multiple sibling nodes into an existing
 * container very efficiently. For example, to add more list items to the example above:<pre><code>
dh.append('my-ul', [
    {tag: 'li', id: 'item3', html: 'List Item 3'},
    {tag: 'li', id: 'item4', html: 'List Item 4'}
]);
 * </code></pre></p>
 *
 * <p><b><u>Templating</u></b></p>
 * <p>The real power is in the built-in templating. Instead of creating or appending any elements,
 * <tt>{@link #createTemplate}</tt> returns a Template object which can be used over and over to
 * insert new elements. Revisiting the example above, we could utilize templating this time:
 * <pre><code>
// create the node
var list = dh.append('my-div', {tag: 'ul', cls: 'my-list'});
// get template
var tpl = dh.createTemplate({tag: 'li', id: 'item{0}', html: 'List Item {0}'});

for(var i = 0; i < 5, i++){
    tpl.append(list, [i]); // use template to append to the actual node
}
 * </code></pre></p>
 * <p>An example using a template:<pre><code>
var html = '<a id="{0}" href="{1}" class="nav">{2}</a>';

var tpl = new Rs.DomHelper.createTemplate(html);
tpl.append('blog-roll', ['link1', 'http://www.jackslocum.com/', "Jack&#39;s Site"]);
tpl.append('blog-roll', ['link2', 'http://www.dustindiaz.com/', "Dustin&#39;s Site"]);
 * </code></pre></p>
 *
 * <p>The same example using named parameters:<pre><code>
var html = '<a id="{id}" href="{url}" class="nav">{text}</a>';

var tpl = new Rs.DomHelper.createTemplate(html);
tpl.append('blog-roll', {
    id: 'link1',
    url: 'http://www.jackslocum.com/',
    text: "Jack&#39;s Site"
});
tpl.append('blog-roll', {
    id: 'link2',
    url: 'http://www.dustindiaz.com/',
    text: "Dustin&#39;s Site"
});
 * </code></pre></p>
 *
 * <p><b><u>Compiling Templates</u></b></p>
 * <p>Templates are applied using regular expressions. The performance is great, but if
 * you are adding a bunch of DOM elements using the same template, you can increase
 * performance even further by {@link Rs.Template#compile "compiling"} the template.
 * The way "{@link Rs.Template#compile compile()}" works is the template is parsed and
 * broken up at the different variable points and a dynamic function is created and eval'ed.
 * The generated function performs string concatenation of these parts and the passed
 * variables instead of using regular expressions.
 * <pre><code>
var html = '<a id="{id}" href="{url}" class="nav">{text}</a>';

var tpl = new Rs.DomHelper.createTemplate(html);
tpl.compile();

//... use template like normal
 * </code></pre></p>
 *
 * <p><b><u>Performance Boost</u></b></p>
 * <p>DomHelper will transparently create HTML fragments when it can. Using HTML fragments instead
 * of DOM can significantly boost performance.</p>
 * <p>Element creation specification parameters may also be strings. If {@link #useDom} is <tt>false</tt>,
 * then the string is used as innerHTML. If {@link #useDom} is <tt>true</tt>, a string specification
 * results in the creation of a text node. Usage:</p>
 * <pre><code>
Rs.DomHelper.useDom = true; // force it to use DOM; reduces performance
 * </code></pre>
 * @singleton
 */
Rs.DomHelper = function(){
    var tempTableEl = null,
        emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
        tableRe = /^table|tbody|tr|td$/i,
        pub,
        // kill repeat to save bytes
        afterbegin = 'afterbegin',
        afterend = 'afterend',
        beforebegin = 'beforebegin',
        beforeend = 'beforeend',
        ts = '<table>',
        te = '</table>',
        tbs = ts+'<tbody>',
        tbe = '</tbody>'+te,
        trs = tbs + '<tr>',
        tre = '</tr>'+tbe;

    // private
    function doInsert(el, o, returnElement, pos, sibling, append){
        var newNode = pub.insertHtml(pos, Rs.getDom(el), createHtml(o));
        return returnElement ? Rs.get(newNode, true) : newNode;
    }

    // build as innerHTML where available
    function createHtml(o){
        var b = '',
            attr,
            val,
            key,
            keyVal,
            cn;

        if(Rs.isString(o)){
            b = o;
        } else if (Rs.isArray(o)) {
            for (var i=0; i < o.length; i++) {
                if(o[i]) {
                    b += createHtml(o[i]);
                }
            };
        } else {
            b += '<' + (o.tag = o.tag || 'div');
            Rs.iterate(o, function(attr, val){
                if(!/tag|children|cn|html$/i.test(attr)){
                    if (Rs.isObject(val)) {
                        b += ' ' + attr + '="';
                        Rs.iterate(val, function(key, keyVal){
                            b += key + ':' + keyVal + ';';
                        });
                        b += '"';
                    }else{
                        b += ' ' + ({cls : 'class', htmlFor : 'for'}[attr] || attr) + '="' + val + '"';
                    }
                }
            });
            // Now either just close the tag or try to add children and close the tag.
            if (emptyTags.test(o.tag)) {
                b += '/>';
            } else {
                b += '>';
                if ((cn = o.children || o.cn)) {
                    b += createHtml(cn);
                } else if(o.html){
                    b += o.html;
                }
                b += '</' + o.tag + '>';
            }
        }
        return b;
    }

    function ieTable(depth, s, h, e){
        tempTableEl.innerHTML = [s, h, e].join('');
        var i = -1,
            el = tempTableEl,
            ns;
        while(++i < depth){
            el = el.firstChild;
        }
//      If the result is multiple siblings, then encapsulate them into one fragment.
        if(ns = el.nextSibling){
            var df = document.createDocumentFragment();
            while(el){
                ns = el.nextSibling;
                df.appendChild(el);
                el = ns;
            }
            el = df;
        }
        return el;
    }

    /**
     * @ignore
     * Nasty code for IE's broken table implementation
     */
    function insertIntoTable(tag, where, el, html) {
        var node,
            before;

        tempTableEl = tempTableEl || document.createElement('div');

        if(tag == 'td' && (where == afterbegin || where == beforeend) ||
           !/td|tr|tbody/i.test(tag) && (where == beforebegin || where == afterend)) {
            return;
        }
        before = where == beforebegin ? el :
                 where == afterend ? el.nextSibling :
                 where == afterbegin ? el.firstChild : null;

        if (where == beforebegin || where == afterend) {
            el = el.parentNode;
        }

        if (tag == 'td' || (tag == 'tr' && (where == beforeend || where == afterbegin))) {
            node = ieTable(4, trs, html, tre);
        } else if ((tag == 'tbody' && (where == beforeend || where == afterbegin)) ||
                   (tag == 'tr' && (where == beforebegin || where == afterend))) {
            node = ieTable(3, tbs, html, tbe);
        } else {
            node = ieTable(2, ts, html, te);
        }
        el.insertBefore(node, before);
        return node;
    }


    pub = {
		/**
         * Returns the markup for the passed Element(s) config.
         * @param {Object} o The DOM object spec (and children)
         * @return {String}
         */
        markup : function(o){
            return createHtml(o);
        },
        
        /**
         * Applies a style specification to an element.
         * @param {String/HTMLElement} el The element to apply styles to
         * @param {String/Object/Function} styles A style specification string e.g. 'width:100px', or object in the form {width:'100px'}, or
         * a function which returns such a specification.
         */        
        applyStyles : function(el, styles){
            if(styles){
                var i = 0,
                    len,
                    style;

                el = Rs.fly(el);
                if(Rs.isFunction(styles)){
                    styles = styles.call();
                }
                if(Rs.isString(styles)){
                    styles = Rs.trim(styles).split(/\s*(?::|;)\s*/);
                    for(len = styles.length; i < len;){
                        el.setStyle(styles[i++], styles[i++]);
                    }
                }else if (Rs.isObject(styles)){
                    el.setStyle(styles);
                }
            }
        },

        /**
         * Inserts an HTML fragment into the DOM.
         * @param {String} where Where to insert the html in relation to el - beforeBegin, afterBegin, beforeEnd, afterEnd.
         * @param {HTMLElement} el The context element
         * @param {String} html The HTML fragment
         * @return {HTMLElement} The new node
         */        
        insertHtml : function(where, el, html){
            var hash = {},
                hashVal,
                setStart,
                range,
                frag,
                rangeEl,
                rs;

            where = where.toLowerCase();
            // add these here because they are used in both branches of the condition.
            hash[beforebegin] = ['BeforeBegin', 'previousSibling'];
            hash[afterend] = ['AfterEnd', 'nextSibling'];

            if (el.insertAdjacentHTML) {
                if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))){
                    return rs;
                }
                // add these two to the hash.
                hash[afterbegin] = ['AfterBegin', 'firstChild'];
                hash[beforeend] = ['BeforeEnd', 'lastChild'];
                if ((hashVal = hash[where])) {
                    el.insertAdjacentHTML(hashVal[0], html);
                    return el[hashVal[1]];
                }
            } else {
                range = el.ownerDocument.createRange();
                setStart = 'setStart' + (/end/i.test(where) ? 'After' : 'Before');
                if (hash[where]) {
                    range[setStart](el);
                    frag = range.createContextualFragment(html);
                    el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);
                    return el[(where == beforebegin ? 'previous' : 'next') + 'Sibling'];
                } else {
                    rangeEl = (where == afterbegin ? 'first' : 'last') + 'Child';
                    if (el.firstChild) {
                        range[setStart](el[rangeEl]);
                        frag = range.createContextualFragment(html);
                        if(where == afterbegin){
                            el.insertBefore(frag, el.firstChild);
                        }else{
                            el.appendChild(frag);
                        }
                    } else {
                        el.innerHTML = html;
                    }
                    return el[rangeEl];
                }
            }
            throw 'Illegal insertion point -> "' + where + '"';
        },

        /**
         * Creates new DOM element(s) and inserts them before el.
         * @param {Mixed} el The context element
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @param {Boolean} returnElement (optional) true to return a Ext.Element
         * @return {HTMLElement/Rs.Element} The new node
         */
        insertBefore : function(el, o, returnElement){
            return doInsert(el, o, returnElement, beforebegin);
        },

        /**
         * Creates new DOM element(s) and inserts them after el.
         * @param {Mixed} el The context element
         * @param {Object} o The DOM object spec (and children)
         * @param {Boolean} returnElement (optional) true to return a Ext.Element
         * @return {HTMLElement/Rs.Element} The new node
         */
        insertAfter : function(el, o, returnElement){
            return doInsert(el, o, returnElement, afterend, 'nextSibling');
        },

        /**
         * Creates new DOM element(s) and inserts them as the first child of el.
         * @param {Mixed} el The context element
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @param {Boolean} returnElement (optional) true to return a Ext.Element
         * @return {HTMLElement/Rs.Element} The new node
         */
        insertFirst : function(el, o, returnElement){
            return doInsert(el, o, returnElement, afterbegin, 'firstChild');
        },

        /**
         * Creates new DOM element(s) and appends them to el.
         * @param {Mixed} el The context element
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @param {Boolean} returnElement (optional) true to return a Ext.Element
         * @return {HTMLElement/Rs.Element} The new node
         */
        append : function(el, o, returnElement){
            return doInsert(el, o, returnElement, beforeend, '', true);
        },

        /**
         * Creates new DOM element(s) and overwrites the contents of el with them.
         * @param {Mixed} el The context element
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @param {Boolean} returnElement (optional) true to return a Ext.Element
         * @return {HTMLElement/Rs.Element} The new node
         */
        overwrite : function(el, o, returnElement){
            el = Rs.getDom(el);
            el.innerHTML = createHtml(o);
            return returnElement ? Rs.get(el.firstChild) : el.firstChild;
        },

        createHtml : createHtml
    };
    return pub;
}();
/**
 * @class Rs.Template
 * <p>Represents an HTML fragment template. Templates may be {@link #compile precompiled}
 * for greater performance.</p>
 * <p>For example usage {@link #Template see the constructor}.</p>
 * 
 * @constructor
 * An instance of this class may be created by passing to the constructor either
 * a single argument, or multiple arguments:
 * <div class="mdetail-params"><ul>
 * <li><b>single argument</b> : String/Array
 * <div class="sub-desc">
 * The single argument may be either a String or an Array:<ul>
 * <li><tt>String</tt> : </li><pre><code>
var t = new Rs.Template("&lt;div>Hello {0}.&lt;/div>");
t.{@link #append}('some-element', ['foo']);
 * </code></pre>
 * <li><tt>Array</tt> : </li>
 * An Array will be combined with <code>join('')</code>.
<pre><code>
var t = new Rs.Template([
    '&lt;div name="{id}"&gt;',
        '&lt;span class="{cls}"&gt;{name:trim} {value:ellipsis(10)}&lt;/span&gt;',
    '&lt;/div&gt;',
]);
t.{@link #compile}();
t.{@link #append}('some-element', {id: 'myid', cls: 'myclass', name: 'foo', value: 'bar'});
</code></pre>
 * </ul></div></li>
 * <li><b>multiple arguments</b> : String, Object, Array, ...
 * <div class="sub-desc">
 * Multiple arguments will be combined with <code>join('')</code>.
 * <pre><code>
var t = new Rs.Template(
    '&lt;div name="{id}"&gt;',
        '&lt;span class="{cls}"&gt;{name} {value}&lt;/span&gt;',
    '&lt;/div&gt;',
    // a configuration object:
    {
        compiled: true,      // {@link #compile} immediately
        disableFormats: true // See Notes below.
    } 
);
 * </code></pre>
 * <p><b>Notes</b>:</p>
 * <div class="mdetail-params"><ul>
 * <li>Formatting and <code>disableFormats</code> are not applicable for Ext Core.</li>
 * <li>For a list of available format functions, see {@link Rs.util.Format}.</li>
 * <li><code>disableFormats</code> reduces <code>{@link #apply}</code> time
 * when no formatting is required.</li>
 * </ul></div>
 * </div></li>
 * </ul></div>
 * @param {Mixed} config
 */
Rs.Template = function(html){
    var me = this,
    	a = arguments,
    	buf = [];

    if (Rs.isArray(html)) {
        html = html.join("");
    } else if (a.length > 1) {
	    Rs.each(a, function(v) {
            if (Rs.isObject(v)) {
                Rs.apply(me, v);
            } else {
                buf.push(v);
            }
        });
        html = buf.join('');
    }

    /**@private*/
    me.html = html;
    /**
     * @cfg {Boolean} compiled Specify <tt>true</tt> to compile the template
     * immediately (see <code>{@link #compile}</code>).
     * Defaults to <tt>false</tt>.
     */
    if (me.compiled) {
        me.compile();
    }
};
Rs.Template.prototype = {
    /**
     * @cfg {RegExp} re The regular expression used to match template variables.
     * Defaults to:<pre><code>
     * re : /\{([\w-]+)\}/g                                     // for Ext Core
     * re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g      // for Ext JS
     * </code></pre>
     */
    re : /\{([\w-]+)\}/g,
    /**
     * See <code>{@link #re}</code>.
     * @type RegExp
     * @property re
     */

    /**
     * Returns an HTML fragment of this template with the specified <code>values</code> applied.
     * @param {Object/Array} values
     * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
     * or an object (i.e. <code>{foo: 'bar'}</code>).
     * @return {String} The HTML fragment
     */
    applyTemplate : function(values){
		var me = this;

        return me.compiled ?
        		me.compiled(values) :
				me.html.replace(me.re, function(m, name){
		        	return values[name] !== undefined ? values[name] : "";
		        });
	},

    /**
     * Sets the HTML used as the template and optionally compiles it.
     * @param {String} html
     * @param {Boolean} compile (optional) True to compile the template (defaults to undefined)
     * @return {Rs.Template} this
     */
    set : function(html, compile){
	    var me = this;
        me.html = html;
        me.compiled = null;
        return compile ? me.compile() : me;
    },

    /**
     * Compiles the template into an internal function, eliminating the RegEx overhead.
     * @return {Rs.Template} this
     */
    compile : function(){
        var me = this,
        	sep = Rs.isGecko ? "+" : ",";

        function fn(m, name){                        
	        name = "values['" + name + "']";
	        return "'"+ sep + '(' + name + " == undefined ? '' : " + name + ')' + sep + "'";
        }
                
        eval("this.compiled = function(values){ return " + (Rs.isGecko ? "'" : "['") +
             me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
             (Rs.isGecko ?  "';};" : "'].join('');};"));
        return me;
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) as the first child of el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Rs.Element (defaults to undefined)
     * @return {HTMLElement/Rs.Element} The new node or Element
     */
    insertFirst: function(el, values, returnElement){
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) before el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Rs.Element (defaults to undefined)
     * @return {HTMLElement/Rs.Element} The new node or Element
     */
    insertBefore: function(el, values, returnElement){
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) after el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Rs.Element (defaults to undefined)
     * @return {HTMLElement/Rs.Element} The new node or Element
     */
    insertAfter : function(el, values, returnElement){
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    /**
     * Applies the supplied <code>values</code> to the template and appends
     * the new node(s) to the specified <code>el</code>.
     * <p>For example usage {@link #Template see the constructor}.</p>
     * @param {Mixed} el The context element
     * @param {Object/Array} values
     * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
     * or an object (i.e. <code>{foo: 'bar'}</code>).
     * @param {Boolean} returnElement (optional) true to return an Rs.Element (defaults to undefined)
     * @return {HTMLElement/Rs.Element} The new node or Element
     */
    append : function(el, values, returnElement){
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert : function(where, el, values, returnEl){
        el = Rs.getDom(el);
        var newNode = Rs.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Rs.get(newNode, true) : newNode;
    },

    /**
     * Applies the supplied values to the template and overwrites the content of el with the new node(s).
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Rs.Element (defaults to undefined)
     * @return {HTMLElement/Rs.Element} The new node or Element
     */
    overwrite : function(el, values, returnElement){
        el = Rs.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Rs.get(el.firstChild, true) : el.firstChild;
    }
};
/**
 * Alias for {@link #applyTemplate}
 * Returns an HTML fragment of this template with the specified <code>values</code> applied.
 * @param {Object/Array} values
 * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
 * or an object (i.e. <code>{foo: 'bar'}</code>).
 * @return {String} The HTML fragment
 * @member Rs.Template
 * @method apply
 */
Rs.Template.prototype.apply = Rs.Template.prototype.applyTemplate;

/**
 * Creates a template from the passed element's value (<i>display:none</i> textarea, preferred) or innerHTML.
 * @param {String/HTMLElement} el A DOM element or its id
 * @param {Object} config A configuration object
 * @return {Rs.Template} The created template
 * @static
 */
Rs.Template.from = function(el, config){
    el = Rs.getDom(el);
    return new Rs.Template(el.value || el.innerHTML, config || '');
};
/**
 * @class Rs.DomQuery
Provides high performance selector/xpath processing by compiling queries into reusable functions. New pseudo classes and matchers can be plugged. It works on HTML and XML documents (if a content node is passed in).
<p>
DomQuery supports most of the <a href="http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#selectors">CSS3 selectors spec</a>, along with some custom selectors and basic XPath.</p>

<p>
All selectors, attribute filters and pseudos below can be combined infinitely in any order. For example "div.foo:nth-child(odd)[@foo=bar].bar:first" would be a perfectly valid selector. Node filters are processed in the order in which they appear, which allows you to optimize your queries for your document structure.
</p>
<h4>Element Selectors:</h4>
<ul class="list">
    <li> <b>*</b> any element</li>
    <li> <b>E</b> an element with the tag E</li>
    <li> <b>E F</b> All descendent elements of E that have the tag F</li>
    <li> <b>E > F</b> or <b>E/F</b> all direct children elements of E that have the tag F</li>
    <li> <b>E + F</b> all elements with the tag F that are immediately preceded by an element with the tag E</li>
    <li> <b>E ~ F</b> all elements with the tag F that are preceded by a sibling element with the tag E</li>
</ul>
<h4>Attribute Selectors:</h4>
<p>The use of &#64; and quotes are optional. For example, div[&#64;foo='bar'] is also a valid attribute selector.</p>
<ul class="list">
    <li> <b>E[foo]</b> has an attribute "foo"</li>
    <li> <b>E[foo=bar]</b> has an attribute "foo" that equals "bar"</li>
    <li> <b>E[foo^=bar]</b> has an attribute "foo" that starts with "bar"</li>
    <li> <b>E[foo$=bar]</b> has an attribute "foo" that ends with "bar"</li>
    <li> <b>E[foo*=bar]</b> has an attribute "foo" that contains the substring "bar"</li>
    <li> <b>E[foo%=2]</b> has an attribute "foo" that is evenly divisible by 2</li>
    <li> <b>E[foo!=bar]</b> has an attribute "foo" that does not equal "bar"</li>
</ul>
<h4>Pseudo Classes:</h4>
<ul class="list">
    <li> <b>E:first-child</b> E is the first child of its parent</li>
    <li> <b>E:last-child</b> E is the last child of its parent</li>
    <li> <b>E:nth-child(<i>n</i>)</b> E is the <i>n</i>th child of its parent (1 based as per the spec)</li>
    <li> <b>E:nth-child(odd)</b> E is an odd child of its parent</li>
    <li> <b>E:nth-child(even)</b> E is an even child of its parent</li>
    <li> <b>E:only-child</b> E is the only child of its parent</li>
    <li> <b>E:checked</b> E is an element that is has a checked attribute that is true (e.g. a radio or checkbox) </li>
    <li> <b>E:first</b> the first E in the resultset</li>
    <li> <b>E:last</b> the last E in the resultset</li>
    <li> <b>E:nth(<i>n</i>)</b> the <i>n</i>th E in the resultset (1 based)</li>
    <li> <b>E:odd</b> shortcut for :nth-child(odd)</li>
    <li> <b>E:even</b> shortcut for :nth-child(even)</li>
    <li> <b>E:contains(foo)</b> E's innerHTML contains the substring "foo"</li>
    <li> <b>E:nodeValue(foo)</b> E contains a textNode with a nodeValue that equals "foo"</li>
    <li> <b>E:not(S)</b> an E element that does not match simple selector S</li>
    <li> <b>E:has(S)</b> an E element that has a descendent that matches simple selector S</li>
    <li> <b>E:next(S)</b> an E element whose next sibling matches simple selector S</li>
    <li> <b>E:prev(S)</b> an E element whose previous sibling matches simple selector S</li>
</ul>
<h4>CSS Value Selectors:</h4>
<ul class="list">
    <li> <b>E{display=none}</b> css value "display" that equals "none"</li>
    <li> <b>E{display^=none}</b> css value "display" that starts with "none"</li>
    <li> <b>E{display$=none}</b> css value "display" that ends with "none"</li>
    <li> <b>E{display*=none}</b> css value "display" that contains the substring "none"</li>
    <li> <b>E{display%=2}</b> css value "display" that is evenly divisible by 2</li>
    <li> <b>E{display!=none}</b> css value "display" that does not equal "none"</li>
</ul>
 * @singleton
 */
Rs.DomQuery = function(){
    var cache = {}, 
    	simpleCache = {}, 
    	valueCache = {},
    	nonSpace = /\S/,
    	trimRe = /^\s+|\s+$/g,
    	tplRe = /\{(\d+)\}/g,
    	modeRe = /^(\s?[\/>+~]\s?|\s|$)/,
    	tagTokenRe = /^(#)?([\w-\*]+)/,
    	nthRe = /(\d*)n\+?(\d*)/, 
    	nthRe2 = /\D/,
    	// This is for IE MSXML which does not support expandos.
	    // IE runs the same speed using setAttribute, however FF slows way down
	    // and Safari completely fails so they need to continue to use expandos.
	    isIE = window.ActiveXObject ? true : false,
	    key = 30803;
	    
    // this eval is stop the compressor from
	// renaming the variable to something shorter
	eval("var batch = 30803;");    	

    function child(p, index){
        var i = 0,
        	n = p.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == index){
                   return n;
               }
            }
            n = n.nextSibling;
        }
        return null;
    };

    function next(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return n;
    };

    function prev(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return n;
    };

    function children(d){
        var n = d.firstChild, ni = -1,
        	nx;
 	    while(n){
 	        nx = n.nextSibling;
 	        if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else{
 	            n.nodeIndex = ++ni;
 	        }
 	        n = nx;
 	    }
 	    return this;
 	};

    function byClassName(c, a, v){
        if(!v){
            return c;
        }
        var r = [], ri = -1, cn;
        for(var i = 0, ci; ci = c[i]; i++){
            if((' '+ci.className+' ').indexOf(v) != -1){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function attrValue(n, attr){
        if(!n.tagName && typeof n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return null;
        }
        if(attr == "for"){
            return n.htmlFor;
        }
        if(attr == "class" || attr == "className"){
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];

    };

    function getNodes(ns, mode, tagName){
        var result = [], ri = -1, cs;
        if(!ns){
            return result;
        }
        tagName = tagName || "*";
        if(typeof ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }
        if(!mode){
            for(var i = 0, ni; ni = ns[i]; i++){
                cs = ni.getElementsByTagName(tagName);
                for(var j = 0, ci; ci = cs[j]; j++){
                    result[++ri] = ci;
                }
            }
        }else if(mode == "/" || mode == ">"){
            var utag = tagName.toUpperCase();
            for(var i = 0, ni, cn; ni = ns[i]; i++){
                cn = ni.childNodes;
                for(var j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
                        result[++ri] = cj;
                    }
                }
            }
        }else if(mode == "+"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
                    result[++ri] = n;
                }
            }
        }else if(mode == "~"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling)){
                    if (n.nodeName == utag || n.nodeName == tagName || tagName == '*'){
                        result[++ri] = n;
                    }
                }
            }
        }
        return result;
    };

    function concat(a, b){
        if(b.slice){
            return a.concat(b);
        }
        for(var i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!tagName){
            return cs;
        }
        var r = [], ri = -1;
        tagName = tagName.toLowerCase();
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase()==tagName){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byId(cs, attr, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return cs;
        }
        var r = [], ri = -1;
        for(var i = 0,ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                r[++ri] = ci;
                return r;
            }
        }
        return r;
    };

    function byAttribute(cs, attr, value, op, custom){
        var r = [], 
            ri = -1, 
            st = custom=="{",
            f = Rs.DomQuery.operators[op],
            a,
            ih;
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType != 1){
                continue;
            }
            ih = ci.innerHTML;
            // we only need to change the property names if we're dealing with html nodes, not XML
            if(ih !== null && ih !== undefined){
                if(st){
                    a = Rs.DomQuery.getStyle(ci, attr);
                }else if(attr == "class" || attr == "className"){
                    a = ci.className;
                }else if(attr == "for"){
                    a = ci.htmlFor;
                }else if(attr == "href"){
                    a = ci.getAttribute("href", 2);
                }else{
                    a = ci.getAttribute(attr);
                }
            }else{
                a = ci.getAttribute(attr);
            }
            if((f && f(a, value)) || (!f && a)){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byPseudo(cs, name, value){
        return Rs.DomQuery.pseudos[name](cs, value);
    };

    function nodupIEXml(cs){
        var d = ++key, 
        	r;
        cs[0].setAttribute("_nodup", d);
        r = [cs[0]];
        for(var i = 1, len = cs.length; i < len; i++){
            var c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len = cs.length, c, i, r = cs, cj, ri = -1;
        if(!len || typeof cs.nodeType != "undefined" || len == 1){
            return cs;
        }
        if(isIE && typeof cs[0].selectSingleNode != "undefined"){
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else{
                r = [];
                for(var j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2){
        var d = ++key,
        	r = [];
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2){
        var len1 = c1.length,
        	d = ++key,
        	r = [];
        if(!len1){
            return c2;
        }
        if(isIE && typeof c1[0].selectSingleNode != "undefined"){
            return quickDiffIEXml(c1, c2);
        }        
        for(var i = 0; i < len1; i++){
            c1[i]._qdiff = d;
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id){
        if(ns == root){
           var d = root.ownerDocument || root;
           return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, null, id);
    }

    return {
        getStyle : function(el, name){
            return Rs.fly(el).getStyle(name);
        },

        /**
         * Compiles a selector/xpath query into a reusable function. The returned function
         * takes one parameter "root" (optional), which is the context node from where the query should start.
         * @param {String} selector The selector/xpath query
         * @param {String} type (optional) Either "select" (the default) or "simple" for a simple selector match
         * @return {Function}
         */
        compile : function(path, type){
            type = type || "select";

            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"],
            	q = path, mode, lq,
            	tk = Rs.DomQuery.matchers,
            	tklen = tk.length,
            	mm,
            	// accept leading mode switch
            	lmode = q.match(modeRe);
            
            if(lmode && lmode[1]){
                fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
                q = q.replace(lmode[1], "");
            }
            // strip leading slashes
            while(path.substr(0, 1)=="/"){
                path = path.substr(1);
            }

            while(q && lq != q){
                lq = q;
                var tm = q.match(tagTokenRe);
                if(type == "select"){
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }else if(q.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                }else{
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = byId(n, null, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = byTag(n, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }
                }
                while(!(mm = q.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < tklen; j++){
                        var t = tk[j];
                        var m = q.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){
                                                    return m[i];
                                                });
                            q = q.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    // prevent infinite loop on bad selector
                    if(!matched){
                        throw 'Error parsing selector, parsing failed at "' + q + '"';
                    }
                }
                if(mm[1]){
                    fn[fn.length] = 'mode="'+mm[1].replace(trimRe, "")+'";';
                    q = q.replace(mm[1], "");
                }
            }
            fn[fn.length] = "return nodup(n);\n}";
            eval(fn.join(""));
            return f;
        },

        /**
         * Selects a group of elements.
         * @param {String} selector The selector/xpath query (can be a comma separated list of selectors)
         * @param {Node} root (optional) The start of the query (defaults to document).
         * @return {Array} An Array of DOM elements which match the selector. If there are
         * no matches, and empty Array is returned.
         */
        select : function(path, root, type){
            if(!root || root == document){
                root = document;
            }
            if(typeof root == "string"){
                root = document.getElementById(root);
            }
            var paths = path.split(","),
            	results = [];
            for(var i = 0, len = paths.length; i < len; i++){
                var p = paths[i].replace(trimRe, "");
                if(!cache[p]){
                    cache[p] = Rs.DomQuery.compile(p);
                    if(!cache[p]){
                        throw p + " is not a valid selector";
                    }
                }
                var result = cache[p](root);
                if(result && result != document){
                    results = results.concat(result);
                }
            }
            if(paths.length > 1){
                return nodup(results);
            }
            return results;
        },

        /**
         * Selects a single element.
         * @param {String} selector The selector/xpath query
         * @param {Node} root (optional) The start of the query (defaults to document).
         * @return {Element} The DOM element which matched the selector.
         */
        selectNode : function(path, root){
            return Rs.DomQuery.select(path, root)[0];
        },

        /**
         * Selects the value of a node, optionally replacing null with the defaultValue.
         * @param {String} selector The selector/xpath query
         * @param {Node} root (optional) The start of the query (defaults to document).
         * @param {String} defaultValue
         * @return {String}
         */
        selectValue : function(path, root, defaultValue){
            path = path.replace(trimRe, "");
            if(!valueCache[path]){
                valueCache[path] = Rs.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root), v;
            n = n[0] ? n[0] : n;
            
            if (typeof n.normalize == 'function') n.normalize();
            
            v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null||v === undefined||v==='') ? defaultValue : v);
        },

        /**
         * Selects the value of a node, parsing integers and floats. Returns the defaultValue, or 0 if none is specified.
         * @param {String} selector The selector/xpath query
         * @param {Node} root (optional) The start of the query (defaults to document).
         * @param {Number} defaultValue
         * @return {Number}
         */
        selectNumber : function(path, root, defaultValue){
            var v = Rs.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },

        /**
         * Returns true if the passed element(s) match the passed simple selector (e.g. div.some-class or span:first-child)
         * @param {String/HTMLElement/Array} el An element id, element or array of elements
         * @param {String} selector The simple selector to test
         * @return {Boolean}
         */
        is : function(el, ss){
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = Rs.isArray(el),
            	result = Rs.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },

        /**
         * Filters an array of elements to only include matches of a simple selector (e.g. div.some-class or span:first-child)
         * @param {Array} el An array of elements to filter
         * @param {String} selector The simple selector to test
         * @param {Boolean} nonMatches If true, it returns the elements that DON'T match
         * the selector instead of the ones that match
         * @return {Array} An Array of DOM elements which match the selector. If there are
         * no matches, and empty Array is returned.
         */
        filter : function(els, ss, nonMatches){
            ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Rs.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

        /**
         * Collection of matching regular expressions and code snippets.
         */
        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, null, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, null, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

        /**
         * Collection of operator comparison functions. The default operators are =, !=, ^=, $=, *=, %=, |= and ~=.
         * New operators can be added as long as the match the format <i>c</i>= where <i>c</i> is any character other than space, &gt; &lt;.
         */
        operators : {
            "=" : function(a, v){
                return a == v;
            },
            "!=" : function(a, v){
                return a != v;
            },
            "^=" : function(a, v){
                return a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return (a % v) == 0;
            },
            "|=" : function(a, v){
                return a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },

        /**
         * <p>Object hash of "pseudo class" filter functions which are used when filtering selections. Each function is passed
         * two parameters:</p><div class="mdetail-params"><ul>
         * <li><b>c</b> : Array<div class="sub-desc">An Array of DOM elements to filter.</div></li>
         * <li><b>v</b> : String<div class="sub-desc">The argument (if any) supplied in the selector.</div></li>
         * </ul></div>
         * <p>A filter function returns an Array of DOM elements which conform to the pseudo class.</p>
         * <p>In addition to the provided pseudo classes listed above such as <code>first-child</code> and <code>nth-child</code>,
         * developers may add additional, custom psuedo class filters to select elements according to application-specific requirements.</p>
         * <p>For example, to filter <code>&lt;a></code> elements to only return links to <i>external</i> resources:</p>
         * <code><pre>
Rs.DomQuery.pseudos.external = function(c, v){
    var r = [], ri = -1;
    for(var i = 0, ci; ci = c[i]; i++){
//      Include in result set only if it's a link to an external resource
        if(ci.hostname != location.hostname){
            r[++ri] = ci;
        }
    }
    return r;
};</pre></code>
         * Then external links could be gathered with the following statement:<code><pre>
var externalLinks = Ext.select("a:external");
</code></pre>
         */
        pseudos : {
            "first-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "last-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nth-child" : function(c, a) {
                var r = [], ri = -1,
                	m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
                	f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Rs.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                	r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Rs.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Rs.DomQuery.select,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Rs.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Rs.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();

/**
 * Selects an array of DOM nodes by CSS/XPath selector. Shorthand of {@link Ext.DomQuery#select}
 * @param {String} path The selector/xpath query
 * @param {Node} root (optional) The start of the query (defaults to document).
 * @return {Array}
 * @member Ext
 * @method query
 */
Rs.query = Rs.DomQuery.select;
/**
 * @class Rs.EventManager
 * Registers event handlers that want to receive a normalized EventObject instead of the standard browser event and provides
 * several useful events directly.
 * See {@link Rs.EventObject} for more details on normalized event objects.
 * @singleton
 */
Rs.EventManager = function(){
    var docReadyEvent,
        docReadyProcId,
        docReadyState = false,
        E = Rs.lib.Event,
        D = Rs.lib.Dom,
        DOC = document,
        WINDOW = window,
        IEDEFERED = "ie-deferred-loader",
        DOMCONTENTLOADED = "DOMContentLoaded",
        propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
        
        specialElCache = [];

     function getId(el){
        var id = false,
            i = 0,
            len = specialElCache.length,
            id = false,
            skip = false,
            o;
        if(el){
            if(el.getElementById || el.navigator){
                // look up the id
                for(; i < len; ++i){
                    o = specialElCache[i];
                    if(o.el === el){
                        id = o.id;
                        break;
                    }
                }
                if(!id){
                    // for browsers that support it, ensure that give the el the same id
                    id = Rs.id(el);
                    specialElCache.push({
                        id: id,
                        el: el
                    });
                    skip = true;
                }
            }else{
                id = Rs.id(el);
            }
            if(!Rs.elCache[id]){
                Rs.Element.addToCache(new Rs.Element(el), id);
                if(skip){
                    Rs.elCache[id].skipGC = true;
                }
            }
        }
        return id;
     };

    /// There is some jquery work around stuff here that isn't needed in Ext Core.
    function addListener(el, ename, fn, task, wrap, scope){
        el = Rs.getDom(el);
        var id = getId(el),
            es = Rs.elCache[id].events,
            wfn;

        wfn = E.on(el, ename, wrap);
        es[ename] = es[ename] || [];

        /* 0 = Original Function,
           1 = Event Manager Wrapped Function,
           2 = Scope,
           3 = Adapter Wrapped Function,
           4 = Buffered Task
        */
        es[ename].push([fn, wrap, scope, wfn, task]);


        // this is a workaround for jQuery and should somehow be removed from Ext Core in the future
        // without breaking ExtJS.
        if(ename == "mousewheel" && el.addEventListener){ // workaround for jQuery
            var args = ["DOMMouseScroll", wrap, false];
            el.addEventListener.apply(el, args);
            Rs.EventManager.addListener(WINDOW, 'unload', function(){
                el.removeEventListener.apply(el, args);
            });
        }
        if(ename == "mousedown" && el == document){ // fix stopped mousedowns on the document
            Rs.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    };

    function fireDocReady(){
        if(!docReadyState){
            Rs.isReady = docReadyState = true;
            if(docReadyProcId){
                clearInterval(docReadyProcId);
            }
            if(Rs.isGecko || Rs.isOpera) {
                DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
            }
            if(Rs.isIE){
                var defer = DOC.getElementById(IEDEFERED);
                if(defer){
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            }
            if(docReadyEvent){
                docReadyEvent.fire();
                docReadyEvent.listeners = []; // clearListeners no longer compatible.  Force single: true?
            }
        }
    };

    function initDocReady(){
        var COMPLETE = "complete";

        docReadyEvent = new Rs.util.Event();
        if (Rs.isGecko || Rs.isOpera) {
            DOC.addEventListener(DOMCONTENTLOADED, fireDocReady, false);
        } else if (Rs.isIE){
            DOC.write("<s"+'cript id=' + IEDEFERED + ' defer="defer" src="/'+'/:"></s'+"cript>");
            DOC.getElementById(IEDEFERED).onreadystatechange = function(){
                if(this.readyState == COMPLETE){
                    fireDocReady();
                }
            };
        } else if (Rs.isWebKit){
            docReadyProcId = setInterval(function(){
                if(DOC.readyState == COMPLETE) {
                    fireDocReady();
                 }
            }, 10);
        }
        // no matter what, make sure it fires on load
        E.on(WINDOW, "load", fireDocReady);
    };

    function createTargeted(h, o){
        return function(){
            var args = Rs.toArray(arguments);
            if(o.target == Rs.EventObject.setEvent(args[0]).target){
                h.apply(this, args);
            }
        };
    };

    function createBuffered(h, o, task){
        return function(e){
            // create new event object impl so new events don't wipe out properties
            task.delay(o.buffer, h, null, [new Rs.EventObjectImpl(e)]);
        };
    };

    function createSingle(h, el, ename, fn, scope){
        return function(e){
            Rs.EventManager.removeListener(el, ename, fn, scope);
            h(e);
        };
    };

    function createDelayed(h, o, fn){
        return function(e){
            var task = new Rs.util.DelayedTask(h);
            if(!fn.tasks) {
                fn.tasks = [];
            }
            fn.tasks.push(task);
            task.delay(o.delay || 10, h, null, [new Rs.EventObjectImpl(e)]);
        };
    };

    function listen(element, ename, opt, fn, scope){
        var o = !Rs.isObject(opt) ? {} : opt,
            el = Rs.getDom(element), task;

        fn = fn || o.fn;
        scope = scope || o.scope;

        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        function h(e){
            // prevent errors while unload occurring
            if(!Rs){// !window[xname]){  ==> can't we do this?
                return;
            }
            e = Rs.EventObject.setEvent(e);
            var t;
            if (o.delegate) {
                if(!(t = e.getTarget(o.delegate, el))){
                    return;
                }
            } else {
                t = e.target;
            }
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.preventDefault) {
               e.preventDefault();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
            if (o.normalized) {
                e = e.browserEvent;
            }

            fn.call(scope || el, e, t, o);
        };
        if(o.target){
            h = createTargeted(h, o);
        }
        if(o.delay){
            h = createDelayed(h, o, fn);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn, scope);
        }
        if(o.buffer){
            task = new Rs.util.DelayedTask(h);
            h = createBuffered(h, o, task);
        }

        addListener(el, ename, fn, task, h, scope);
        return h;
    };

    var pub = {

		/**
         * Appends an event handler to an element.  The shorthand version {@link #on} is equivalent.  Typically you will
         * use {@link Rs.Element#addListener} directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The html element or id to assign the event handler to.
         * @param {String} eventName The name of the event to listen for.
         * @param {Function} handler The handler function the event invokes. This function is passed
         * the following parameters:<ul>
         * <li>evt : EventObject<div class="sub-desc">The {@link Rs.EventObject EventObject} describing the event.</div></li>
         * <li>t : Element<div class="sub-desc">The {@link Rs.Element Element} which was the target of the event.
         * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
         * <li>o : Object<div class="sub-desc">The options object from the addListener call.</div></li>
         * </ul>
         * @param {Object} scope (optional) The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.
         * @param {Object} options (optional) An object containing handler configuration properties.
         * This may contain any of the following properties:<ul>
         * <li>scope : Object<div class="sub-desc">The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.</div></li>
         * <li>delegate : String<div class="sub-desc">A simple selector to filter the target or look for a descendant of the target</div></li>
         * <li>stopEvent : Boolean<div class="sub-desc">True to stop the event. That is stop propagation, and prevent the default action.</div></li>
         * <li>preventDefault : Boolean<div class="sub-desc">True to prevent the default action</div></li>
         * <li>stopPropagation : Boolean<div class="sub-desc">True to prevent event propagation</div></li>
         * <li>normalized : Boolean<div class="sub-desc">False to pass a browser event to the handler function instead of an Ext.EventObject</div></li>
         * <li>delay : Number<div class="sub-desc">The number of milliseconds to delay the invocation of the handler after te event fires.</div></li>
         * <li>single : Boolean<div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
         * <li>buffer : Number<div class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
         * by the specified number of milliseconds. If the event fires again within that time, the original
         * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
         * <li>target : Element<div class="sub-desc">Only call the handler if the event was fired on the target Element, <i>not</i> if the event was bubbled up from a child node.</div></li>
         * </ul><br>
         * <p>See {@link Rs.Element#addListener} for examples of how to use these options.</p>
         */
        addListener : function(element, eventName, fn, scope, options){
            if(Rs.isObject(eventName)){
                var o = eventName, e, val;
                for(e in o){
                    val = o[e];
                    if(!propRe.test(e)){
                        if(Rs.isFunction(val)){
                            // shared options
                            listen(element, e, o, val, o.scope);
                        }else{
                            // individual options
                            listen(element, e, val);
                        }
                    }
                }
            } else {
                listen(element, eventName, options, fn, scope);
            }
        },

        /**
         * Removes an event handler from an element.  The shorthand version {@link #un} is equivalent.  Typically
         * you will use {@link Rs.Element#removeListener} directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The id or html element from which to remove the listener.
         * @param {String} eventName The name of the event.
         * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
         * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
         * then this must refer to the same object.
         */
        removeListener : function(el, eventName, fn, scope){
            el = Rs.getDom(el);
            var id = getId(el),
                f = el && (Rs.elCache[id].events)[eventName] || [],
                wrap, i, l, k, wf, len, fnc;

            for (i = 0, len = f.length; i < len; i++) {

                /* 0 = Original Function,
                   1 = Event Manager Wrapped Function,
                   2 = Scope,
                   3 = Adapter Wrapped Function,
                   4 = Buffered Task
                */
                if (Rs.isArray(fnc = f[i]) && fnc[0] == fn && (!scope || fnc[2] == scope)) {
                    if(fnc[4]) {
                        fnc[4].cancel();
                    }
                    k = fn.tasks && fn.tasks.length;
                    if(k) {
                        while(k--) {
                            fn.tasks[k].cancel();
                        }
                        delete fn.tasks;
                    }
                    wf = wrap = fnc[1];
                    if (E.extAdapter) {
                        wf = fnc[3];
                    }
                    E.un(el, eventName, wf);
                    f.splice(i,1);
                    if (f.length === 0) {
                        delete Rs.elCache[id].events[eventName];
                    }
                    for (k in Rs.elCache[id].events) {
                        return false;
                    }
                    Rs.elCache[id].events = {};
                    return false;
                }
            }

            // jQuery workaround that should be removed from Ext Core
            if(eventName == "mousewheel" && el.addEventListener && wrap){
                el.removeEventListener("DOMMouseScroll", wrap, false);
            }

            if(eventName == "mousedown" && el == DOC && wrap){ // fix stopped mousedowns on the document
                Rs.EventManager.stoppedMouseDownEvent.removeListener(wrap);
            }
        },

        /**
         * Removes all event handers from an element.  Typically you will use {@link Ext.Element#removeAllListeners}
         * directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
         */
        removeAll : function(el){
            el = Rs.getDom(el);
            var id = getId(el),
                ec = Rs.elCache[id] || {},
                es = ec.events || {},
                f, i, len, ename, fn, k;

            for(ename in es){
                if(es.hasOwnProperty(ename)){
                    f = es[ename];
                    /* 0 = Original Function,
                       1 = Event Manager Wrapped Function,
                       2 = Scope,
                       3 = Adapter Wrapped Function,
                       4 = Buffered Task
                    */
                    for (i = 0, len = f.length; i < len; i++) {
                        fn = f[i];
                        if(fn[4]) {
                            fn[4].cancel();
                        }
                        if(fn[0].tasks && (k = fn[0].tasks.length)) {
                            while(k--) {
                                fn[0].tasks[k].cancel();
                            }
                            delete fn.tasks;
                        }
                        E.un(el, ename, E.extAdapter ? fn[3] : fn[1]);
                    }
                }
            }
            if (Rs.elCache[id]) {
                Rs.elCache[id].events = {};
            }
        },

        getListeners : function(el, eventName) {
            el = Rs.getDom(el);
            var id = getId(el),
                ec = Rs.elCache[id] || {},
                es = ec.events || {},
                results = [];
            if (es && es[eventName]) {
                return es[eventName];
            } else {
                return null;
            }
        },

        purgeElement : function(el, recurse, eventName) {
            el = Rs.getDom(el);
            var id = getId(el),
                ec = Rs.elCache[id] || {},
                es = ec.events || {},
                i, f, len;
            if (eventName) {
                if (es && es.hasOwnProperty(eventName)) {
                    f = es[eventName];
                    for (i = 0, len = f.length; i < len; i++) {
                        Rs.EventManager.removeListener(el, eventName, f[i][0]);
                    }
                }
            } else {
                Rs.EventManager.removeAll(el);
            }
            if (recurse && el && el.childNodes) {
                for (i = 0, len = el.childNodes.length; i < len; i++) {
                    Rs.EventManager.purgeElement(el.childNodes[i], recurse, eventName);
                }
            }
        },

        _unload : function() {
            var el;
            for (el in Rs.elCache) {
                Rs.EventManager.removeAll(el);
            }
        },

        /**
         * Adds a listener to be notified when the document is ready (before onload and before images are loaded). Can be
         * accessed shorthanded as Rs.onReady().
         * @param {Function} fn The method the event invokes.
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
         * @param {boolean} options (optional) Options object as passed to {@link Rs.Element#addListener}. It is recommended that the options
         * <code>{single: true}</code> be used so that the handler is removed on first invocation.
         */
        onDocumentReady : function(fn, scope, options){
            if(docReadyState){ // if it already fired
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.listeners = []; // clearListeners no longer compatible.  Force single: true?
            } else {
                if(!docReadyEvent) initDocReady();
                options = options || {};
                options.delay = options.delay || 1;
                docReadyEvent.addListener(fn, scope, options);
            }
        }
    };
    
    /**
     * Appends an event handler to an element.  Shorthand for {@link #addListener}.
     * @param {String/HTMLElement} el The html element or id to assign the event handler to
     * @param {String} eventName The name of the event to listen for.
     * @param {Function} handler The handler function the event invokes.
     * @param {Object} scope (optional) (<code>this</code> reference) in which the handler function executes. <b>Defaults to the Element</b>.
     * @param {Object} options (optional) An object containing standard {@link #addListener} options
     * @member Rs.EventManager
     * @method on
     */
    pub.on = pub.addListener;

    /**
     * Removes an event handler from an element.  Shorthand for {@link #removeListener}.
     * @param {String/HTMLElement} el The id or html element from which to remove the listener.
     * @param {String} eventName The name of the event.
     * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #on} call.</b>
     * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
     * then this must refer to the same object.
     * @member Rs.EventManager
     * @method un
     */
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Rs.util.Event();
    return pub;
}();

/**
 * Adds a listener to be notified when the document is ready (before onload and before images are loaded). Shorthand of {@link Ext.EventManager#onDocumentReady}.
 * @param {Function} fn The method the event invokes.
 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
 * @param {boolean} options (optional) Options object as passed to {@link Rs.Element#addListener}. It is recommended that the options
 * <code>{single: true}</code> be used so that the handler is removed on first invocation.
 * @member Rs
 * @method onReady
 */
Rs.onReady = Rs.EventManager.onDocumentReady;

/**
 * @class Rs.EventObject
 * Just as {@link Rs.Element} wraps around a native DOM node, Ext.EventObject
 * wraps the browser's native event-object normalizing cross-browser differences,
 * such as which mouse button is clicked, keys pressed, mechanisms to stop
 * event-propagation along with a method to prevent default actions from taking place.
 * <p>For example:</p>
 * <pre><code>
function handleClick(e, t){ // e is not a standard event object, it is a Rs.EventObject
    e.preventDefault();
    var target = e.getTarget(); // same as t (the target HTMLElement)
    ...
}
var myDiv = {@link Rs#get Rs.get}("myDiv");  // get reference to an {@link Rs.Element}
myDiv.on(         // 'on' is shorthand for addListener
    "click",      // perform an action on click of myDiv
    handleClick   // reference to the action handler
);
// other methods to do the same:
Rs.EventManager.on("myDiv", 'click', handleClick);
RS.EventManager.addListener("myDiv", 'click', handleClick);
 </code></pre>
 * @singleton
 */
Rs.EventObject = function(){
    var E = Rs.lib.Event,
        // safari keypress events for special keys return bad keycodes
        safariKeys = {
            3 : 13, // enter
            63234 : 37, // left
            63235 : 39, // right
            63232 : 38, // up
            63233 : 40, // down
            63276 : 33, // page up
            63277 : 34, // page down
            63272 : 46, // delete
            63273 : 36, // home
            63275 : 35  // end
        },
        // normalize button clicks
        btnMap = Rs.isIE ? {1:0,4:1,2:2} :
                (Rs.isWebKit ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Rs.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };

    Rs.EventObjectImpl.prototype = {
           /** @private */
        setEvent : function(e){
            var me = this;
            if(e == me || (e && e.browserEvent)){ // already wrapped
                return e;
            }
            me.browserEvent = e;
            if(e){
                // normalize buttons
                me.button = e.button ? btnMap[e.button] : (e.which ? e.which - 1 : -1);
                if(e.type == 'click' && me.button == -1){
                    me.button = 0;
                }
                me.type = e.type;
                me.shiftKey = e.shiftKey;
                // mac metaKey behaves like ctrlKey
                me.ctrlKey = e.ctrlKey || e.metaKey || false;
                me.altKey = e.altKey;
                // in getKey these will be normalized for the mac
                me.keyCode = e.keyCode;
                me.charCode = e.charCode;
                // cache the target for the delayed and or buffered events
                me.target = E.getTarget(e);
                // same for XY
                me.xy = E.getXY(e);
            }else{
                me.button = -1;
                me.shiftKey = false;
                me.ctrlKey = false;
                me.altKey = false;
                me.keyCode = 0;
                me.charCode = 0;
                me.target = null;
                me.xy = [0, 0];
            }
            return me;
        },

        /**
         * Stop the event (preventDefault and stopPropagation)
         */
        stopEvent : function(){
            var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Rs.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopEvent(me.browserEvent);
            }
        },

        /**
         * Prevents the browsers default handling of the event.
         */
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },

        /**
         * Cancels bubbling of the event.
         */
        stopPropagation : function(){
            var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Rs.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopPropagation(me.browserEvent);
            }
        },

        /**
         * Gets the character code for the event.
         * @return {Number}
         */
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        /**
         * Returns a normalized keyCode for the event.
         * @return {Number} The key code
         */
        getKey : function(){
            return this.normalizeKey(this.keyCode || this.charCode)
        },

        // private
        normalizeKey: function(k){
            return Rs.isSafari ? (safariKeys[k] || k) : k;
        },

        /**
         * Gets the x coordinate of the event.
         * @return {Number}
         */
        getPageX : function(){
            return this.xy[0];
        },

        /**
         * Gets the y coordinate of the event.
         * @return {Number}
         */
        getPageY : function(){
            return this.xy[1];
        },

        /**
         * Gets the page coordinates of the event.
         * @return {Array} The xy values like [x, y]
         */
        getXY : function(){
            return this.xy;
        },

        /**
         * Gets the target for the event.
         * @param {String} selector (optional) A simple selector to filter the target or look for an ancestor of the target
         * @param {Number/Mixed} maxDepth (optional) The max depth to
                search as a number or element (defaults to 10 || document.body)
         * @param {Boolean} returnEl (optional) True to return a RS.Element object instead of DOM node
         * @return {HTMLelement}
         */
        getTarget : function(selector, maxDepth, returnEl){
            return selector ? Rs.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Rs.get(this.target) : this.target);
        },

        /**
         * Gets the related target.
         * @return {HTMLElement}
         */
        getRelatedTarget : function(){
            return this.browserEvent ? E.getRelatedTarget(this.browserEvent) : null;
        },

        /**
         * Normalizes mouse wheel delta across browsers
         * @return {Number} The delta
         */
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ /* IE/Opera. */
                delta = e.wheelDelta/120;
            }else if(e.detail){ /* Mozilla case. */
                delta = -e.detail/3;
            }
            return delta;
        },

        /**
         * Returns true if the target of this event is a child of el.  Unless the allowEl parameter is set, it will return false if if the target is el.
         * Example usage:<pre><code>
         // Handle click on any child of an element
         Rs.getBody().on('click', function(e){
             if(e.within('some-el')){
                 alert('Clicked on a child of some-el!');
             }
         });

         // Handle click directly on an element, ignoring clicks on child nodes
         Rs.getBody().on('click', function(e,t){
             if((t.id == 'some-el') && !e.within(t, true)){
                 alert('Clicked directly on some-el!');
             }
         });
         </code></pre>
          * @param {Mixed} el The id, DOM element or Rs.Element to check
          * @param {Boolean} related (optional) true to test if the related target is within el instead of the target
          * @param {Boolean} allowEl {optional} true to also check if the passed element is the target or related target
          * @return {Boolean}
          */
        within : function(el, related, allowEl){
            if(el){
                var t = this[related ? "getRelatedTarget" : "getTarget"]();
                return t && ((allowEl ? (t == Rs.getDom(el)) : false) || Rs.fly(el).contains(t));
            }
            return false;
        }
     };

    return new Rs.EventObjectImpl();
}();

/////////////////////////////////////////////////////////// 
///
///    Rs.EventManager more...
///
///////////////////////////////////////////////////////////

Rs.apply(Rs.EventManager, function(){
	   var resizeEvent,
	       resizeTask,
	       textEvent,
	       textSize,
	       D = Rs.lib.Dom,
	       propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
	       curWidth = 0,
	       curHeight = 0,
	       // note 1: IE fires ONLY the keydown event on specialkey autorepeat
	       // note 2: Safari < 3.1, Gecko (Mac/Linux) & Opera fire only the keypress event on specialkey autorepeat
	       // (research done by @Jan Wolter at http://unixpapa.com/js/key.html)
	       useKeydown = Rs.isWebKit ?
	                   Rs.num(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1]) >= 525 :
	                   !((Rs.isGecko && !Rs.isWindows) || Rs.isOpera);

	   return {
	       // private
	       doResizeEvent: function(){
	           var h = D.getViewHeight(),
	               w = D.getViewWidth();

	            //whacky problem in IE where the resize event will fire even though the w/h are the same.
	            if(curHeight != h || curWidth != w){
	               resizeEvent.fire(curWidth = w, curHeight = h);
	            }
	       },

	       /**
	        * Adds a listener to be notified when the browser window is resized and provides resize event buffering (100 milliseconds),
	        * passes new viewport width and height to handlers.
	        * @param {Function} fn      The handler function the window resize event invokes.
	        * @param {Object}   scope   The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
	        * @param {boolean}  options Options object as passed to {@link Rs.Element#addListener}
	        */
	       onWindowResize : function(fn, scope, options){
	           if(!resizeEvent){
	               resizeEvent = new Rs.util.Event();
	               resizeTask = new Rs.util.DelayedTask(this.doResizeEvent);
	               Rs.EventManager.on(window, "resize", this.fireWindowResize, this);
	           }
	           resizeEvent.addListener(fn, scope, options);
	       },

	       // exposed only to allow manual firing
	       fireWindowResize : function(){
	           if(resizeEvent){
	               resizeTask.delay(100);
	           }
	       },

	       /**
	        * Adds a listener to be notified when the user changes the active text size. Handler gets called with 2 params, the old size and the new size.
	        * @param {Function} fn      The function the event invokes.
	        * @param {Object}   scope   The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
	        * @param {boolean}  options Options object as passed to {@link Rs.Element#addListener}
	        */
	       onTextResize : function(fn, scope, options){
	           if(!textEvent){
	               textEvent = new Rs.util.Event();
	               var textEl = new Rs.Element(document.createElement('div'));
	               textEl.dom.className = 'x-text-resize';
	               textEl.dom.innerHTML = 'X';
	               textEl.appendTo(document.body);
	               textSize = textEl.dom.offsetHeight;
	               setInterval(function(){
	                   if(textEl.dom.offsetHeight != textSize){
	                       textEvent.fire(textSize, textSize = textEl.dom.offsetHeight);
	                   }
	               }, this.textResizeInterval);
	           }
	           textEvent.addListener(fn, scope, options);
	       },

	       /**
	        * Removes the passed window resize listener.
	        * @param {Function} fn        The method the event invokes
	        * @param {Object}   scope    The scope of handler
	        */
	       removeResizeListener : function(fn, scope){
	           if(resizeEvent){
	               resizeEvent.removeListener(fn, scope);
	           }
	       },

	       // private
	       fireResize : function(){
	           if(resizeEvent){
	               resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
	           }
	       },

	        /**
	        * The frequency, in milliseconds, to check for text resize events (defaults to 50)
	        */
	       textResizeInterval : 50,

	       /**
	        * Url used for onDocumentReady with using SSL (defaults to Rs.SSL_SECURE_URL)
	        */
	       ieDeferSrc : false,
	       
	       // protected, short accessor for useKeydown
	       getKeyEvent : function(){
	           return useKeydown ? 'keydown' : 'keypress';
	       },

	       // protected for use inside the framework
	       // detects whether we should use keydown or keypress based on the browser.
	       useKeydown: useKeydown
	   };
	}());

	Rs.EventManager.on = Rs.EventManager.addListener;

	Rs.apply(Rs.EventObjectImpl.prototype, {
	   /** Key constant @type Number */
	   BACKSPACE: 8,
	   /** Key constant @type Number */
	   TAB: 9,
	   /** Key constant @type Number */
	   NUM_CENTER: 12,
	   /** Key constant @type Number */
	   ENTER: 13,
	   /** Key constant @type Number */
	   RETURN: 13,
	   /** Key constant @type Number */
	   SHIFT: 16,
	   /** Key constant @type Number */
	   CTRL: 17,
	   CONTROL : 17, // legacy
	   /** Key constant @type Number */
	   ALT: 18,
	   /** Key constant @type Number */
	   PAUSE: 19,
	   /** Key constant @type Number */
	   CAPS_LOCK: 20,
	   /** Key constant @type Number */
	   ESC: 27,
	   /** Key constant @type Number */
	   SPACE: 32,
	   /** Key constant @type Number */
	   PAGE_UP: 33,
	   PAGEUP : 33, // legacy
	   /** Key constant @type Number */
	   PAGE_DOWN: 34,
	   PAGEDOWN : 34, // legacy
	   /** Key constant @type Number */
	   END: 35,
	   /** Key constant @type Number */
	   HOME: 36,
	   /** Key constant @type Number */
	   LEFT: 37,
	   /** Key constant @type Number */
	   UP: 38,
	   /** Key constant @type Number */
	   RIGHT: 39,
	   /** Key constant @type Number */
	   DOWN: 40,
	   /** Key constant @type Number */
	   PRINT_SCREEN: 44,
	   /** Key constant @type Number */
	   INSERT: 45,
	   /** Key constant @type Number */
	   DELETE: 46,
	   /** Key constant @type Number */
	   ZERO: 48,
	   /** Key constant @type Number */
	   ONE: 49,
	   /** Key constant @type Number */
	   TWO: 50,
	   /** Key constant @type Number */
	   THREE: 51,
	   /** Key constant @type Number */
	   FOUR: 52,
	   /** Key constant @type Number */
	   FIVE: 53,
	   /** Key constant @type Number */
	   SIX: 54,
	   /** Key constant @type Number */
	   SEVEN: 55,
	   /** Key constant @type Number */
	   EIGHT: 56,
	   /** Key constant @type Number */
	   NINE: 57,
	   /** Key constant @type Number */
	   A: 65,
	   /** Key constant @type Number */
	   B: 66,
	   /** Key constant @type Number */
	   C: 67,
	   /** Key constant @type Number */
	   D: 68,
	   /** Key constant @type Number */
	   E: 69,
	   /** Key constant @type Number */
	   F: 70,
	   /** Key constant @type Number */
	   G: 71,
	   /** Key constant @type Number */
	   H: 72,
	   /** Key constant @type Number */
	   I: 73,
	   /** Key constant @type Number */
	   J: 74,
	   /** Key constant @type Number */
	   K: 75,
	   /** Key constant @type Number */
	   L: 76,
	   /** Key constant @type Number */
	   M: 77,
	   /** Key constant @type Number */
	   N: 78,
	   /** Key constant @type Number */
	   O: 79,
	   /** Key constant @type Number */
	   P: 80,
	   /** Key constant @type Number */
	   Q: 81,
	   /** Key constant @type Number */
	   R: 82,
	   /** Key constant @type Number */
	   S: 83,
	   /** Key constant @type Number */
	   T: 84,
	   /** Key constant @type Number */
	   U: 85,
	   /** Key constant @type Number */
	   V: 86,
	   /** Key constant @type Number */
	   W: 87,
	   /** Key constant @type Number */
	   X: 88,
	   /** Key constant @type Number */
	   Y: 89,
	   /** Key constant @type Number */
	   Z: 90,
	   /** Key constant @type Number */
	   CONTEXT_MENU: 93,
	   /** Key constant @type Number */
	   NUM_ZERO: 96,
	   /** Key constant @type Number */
	   NUM_ONE: 97,
	   /** Key constant @type Number */
	   NUM_TWO: 98,
	   /** Key constant @type Number */
	   NUM_THREE: 99,
	   /** Key constant @type Number */
	   NUM_FOUR: 100,
	   /** Key constant @type Number */
	   NUM_FIVE: 101,
	   /** Key constant @type Number */
	   NUM_SIX: 102,
	   /** Key constant @type Number */
	   NUM_SEVEN: 103,
	   /** Key constant @type Number */
	   NUM_EIGHT: 104,
	   /** Key constant @type Number */
	   NUM_NINE: 105,
	   /** Key constant @type Number */
	   NUM_MULTIPLY: 106,
	   /** Key constant @type Number */
	   NUM_PLUS: 107,
	   /** Key constant @type Number */
	   NUM_MINUS: 109,
	   /** Key constant @type Number */
	   NUM_PERIOD: 110,
	   /** Key constant @type Number */
	   NUM_DIVISION: 111,
	   /** Key constant @type Number */
	   F1: 112,
	   /** Key constant @type Number */
	   F2: 113,
	   /** Key constant @type Number */
	   F3: 114,
	   /** Key constant @type Number */
	   F4: 115,
	   /** Key constant @type Number */
	   F5: 116,
	   /** Key constant @type Number */
	   F6: 117,
	   /** Key constant @type Number */
	   F7: 118,
	   /** Key constant @type Number */
	   F8: 119,
	   /** Key constant @type Number */
	   F9: 120,
	   /** Key constant @type Number */
	   F10: 121,
	   /** Key constant @type Number */
	   F11: 122,
	   /** Key constant @type Number */
	   F12: 123,

	   /** @private */
	   isNavKeyPress : function(){
	       var me = this,
	           k = this.normalizeKey(me.keyCode);
	       return (k >= 33 && k <= 40) ||  // Page Up/Down, End, Home, Left, Up, Right, Down
	       k == me.RETURN ||
	       k == me.TAB ||
	       k == me.ESC;
	   },

	   isSpecialKey : function(){
	       var k = this.normalizeKey(this.keyCode);
	       return (this.type == 'keypress' && this.ctrlKey) ||
	       this.isNavKeyPress() ||
	       (k == this.BACKSPACE) || // Backspace
	       (k >= 16 && k <= 20) || // Shift, Ctrl, Alt, Pause, Caps Lock
	       (k >= 44 && k <= 46);   // Print Screen, Insert, Delete
	   },

	   getPoint : function(){
	       return new Rs.lib.Point(this.xy[0], this.xy[1]);
	   },

	   /**
	    * Returns true if the control, meta, shift or alt key was pressed during this event.
	    * @return {Boolean}
	    */
	   hasModifier : function(){
	       return ((this.ctrlKey || this.altKey) || this.shiftKey);
	   }
	});
/**
 * @class Rs.Element
 * <p>Encapsulates a DOM element, adding simple DOM manipulation facilities, normalizing for browser differences.</p>
 * <p>All instances of this class inherit the methods of {@link Ext.Fx} making visual effects easily available to all DOM elements.</p>
 * <p>Note that the events documented in this class are not Ext events, they encapsulate browser events. To
 * access the underlying browser event, see {@link Ext.EventObject#browserEvent}. Some older
 * browsers may not support the full range of events. Which events are supported is beyond the control of ExtJs.</p>
 * Usage:<br>
<pre><code>
// by id
var el = Rs.get("my-div");

// by DOM element reference
var el = Rs.get(myDivElement);
</code></pre>
 * <b>Animations</b><br />
 * <p>When an element is manipulated, by default there is no animation.</p>
 * <pre><code>
var el = Rs.get("my-div");

// no animation
el.setWidth(100);
 * </code></pre>
 * <p>Many of the functions for manipulating an element have an optional "animate" parameter.  This
 * parameter can be specified as boolean (<tt>true</tt>) for default animation effects.</p>
 * <pre><code>
// default animation
el.setWidth(100, true);
 * </code></pre>
 *
 * <p>To configure the effects, an object literal with animation options to use as the Element animation
 * configuration object can also be specified. Note that the supported Element animation configuration
 * options are a subset of the {@link Ext.Fx} animation options specific to Fx effects.  The supported
 * Element animation configuration options are:</p>
<pre>
Option    Default   Description
--------- --------  ---------------------------------------------
{@link Rs.Fx#duration duration}  .35       The duration of the animation in seconds
{@link Rs.Fx#easing easing}    easeOut   The easing method
{@link Rs.Fx#callback callback}  none      A function to execute when the anim completes
{@link Rs.Fx#scope scope}     this      The scope (this) of the callback function
</pre>
 *
 * <pre><code>
// Element animation options object
var opt = {
    {@link Rs.Fx#duration duration}: 1,
    {@link Rs.Fx#easing easing}: 'elasticIn',
    {@link Rs.Fx#callback callback}: this.foo,
    {@link Rs.Fx#scope scope}: this
};
// animation with some options set
el.setWidth(100, opt);
 * </code></pre>
 * <p>The Element animation object being used for the animation will be set on the options
 * object as "anim", which allows you to stop or manipulate the animation. Here is an example:</p>
 * <pre><code>
// using the "anim" property to get the Anim object
if(opt.anim.isAnimated()){
    opt.anim.stop();
}
 * </code></pre>
 * <p>Also see the <tt>{@link #animate}</tt> method for another animation technique.</p>
 * <p><b> Composite (Collections of) Elements</b></p>
 * <p>For working with collections of Elements, see {@link Ext.CompositeElement}</p>
 * @constructor Create a new Element directly.
 * @param {String/HTMLElement} element
 * @param {Boolean} forceNew (optional) By default the constructor checks to see if there is already an instance of this element in the cache and if there is it returns the same instance. This will skip that check (useful for extending this class).
 */
(function(){
var DOC = document;

Rs.Element = function(element, forceNew){
    var dom = typeof element == "string" ?
              DOC.getElementById(element) : element,
        id;

    if(!dom) return null;

    id = dom.id;

    if(!forceNew && id && Rs.elCache[id]){ // element object already exists
        return Rs.elCache[id].el;
    }

    /**
     * The DOM element
     * @type HTMLElement
     */
    this.dom = dom;


    /**
     * The DOM element ID
     * @type String
     */
    this.id = id || Rs.id(dom);
};

var D = Rs.lib.Dom,
    DH = Rs.DomHelper,
    E = Rs.lib.Event,
    A = Rs.lib.Anim,
    El = Rs.Element,
    EC = Rs.elCache;

El.prototype = {
    
	/**
     * Sets the passed attributes as attributes of this element (a style attribute can be a string, object or function)
     * @param {Object} o The object with the attributes
     * @param {Boolean} useSet (optional) false to override the default setAttribute to use expandos.
     * @return {Rs.Element} this
     */
    set : function(o, useSet){
        var el = this.dom,
            attr,
            val,
            useSet = (useSet !== false) && !!el.setAttribute;

        for(attr in o){
            if (o.hasOwnProperty(attr)) {
                val = o[attr];
                if (attr == 'style') {
                    DH.applyStyles(el, val);
                } else if (attr == 'cls') {
                    el.className = val;
                } else if (useSet) {
                    el.setAttribute(attr, val);
                } else {
                    el[attr] = val;
                }
            }
        }
        return this;
    },


//  Mouse events
    /**
     * @event click
     * Fires when a mouse click is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event contextmenu
     * Fires when a right click is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event dblclick
     * Fires when a mouse double click is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event mousedown
     * Fires when a mousedown is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event mouseup
     * Fires when a mouseup is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event mouseover
     * Fires when a mouseover is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event mousemove
     * Fires when a mousemove is detected with the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event mouseout
     * Fires when a mouseout is detected with the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event mouseenter
     * Fires when the mouse enters the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event mouseleave
     * Fires when the mouse leaves the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

//  Keyboard events
    /**
     * @event keypress
     * Fires when a keypress is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event keydown
     * Fires when a keydown is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event keyup
     * Fires when a keyup is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */


//  HTML frame/object events
    /**
     * @event load
     * Fires when the user agent finishes loading all content within the element. Only supported by window, frames, objects and images.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event unload
     * Fires when the user agent removes all content from a window or frame. For elements, it fires when the target element or any of its content has been removed.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event abort
     * Fires when an object/image is stopped from loading before completely loaded.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event error
     * Fires when an object/image/frame cannot be loaded properly.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event resize
     * Fires when a document view is resized.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event scroll
     * Fires when a document view is scrolled.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

//  Form events
    /**
     * @event select
     * Fires when a user selects some text in a text field, including input and textarea.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event change
     * Fires when a control loses the input focus and its value has been modified since gaining focus.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event submit
     * Fires when a form is submitted.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event reset
     * Fires when a form is reset.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event focus
     * Fires when an element receives focus either via the pointing device or by tab navigation.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event blur
     * Fires when an element loses focus either via the pointing device or by tabbing navigation.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

//  User Interface events
    /**
     * @event DOMFocusIn
     * Where supported. Similar to HTML focus event, but can be applied to any focusable element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event DOMFocusOut
     * Where supported. Similar to HTML blur event, but can be applied to any focusable element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event DOMActivate
     * Where supported. Fires when an element is activated, for instance, through a mouse click or a keypress.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

//  DOM Mutation events
    /**
     * @event DOMSubtreeModified
     * Where supported. Fires when the subtree is modified.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event DOMNodeInserted
     * Where supported. Fires when a node has been added as a child of another node.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event DOMNodeRemoved
     * Where supported. Fires when a descendant node of the element is removed.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event DOMNodeRemovedFromDocument
     * Where supported. Fires when a node is being removed from a document.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event DOMNodeInsertedIntoDocument
     * Where supported. Fires when a node is being inserted into a document.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event DOMAttrModified
     * Where supported. Fires when an attribute has been modified.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
    /**
     * @event DOMCharacterDataModified
     * Where supported. Fires when the character data has been modified.
     * @param {Rs.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

    /**
     * The default unit to append to CSS values where a unit isn't provided (defaults to px).
     * @type String
     */		
	defaultUnit : "px",

	/**
     * Returns true if this element matches the passed simple selector (e.g. div.some-class or span:first-child)
     * @param {String} selector The simple selector to test
     * @return {Boolean} True if this element matches the selector, else false
     */
    is : function(simpleSelector){
        return Rs.DomQuery.is(this.dom, simpleSelector);
    },

    /**
     * Tries to focus the element. Any exceptions are caught and ignored.
     * @param {Number} defer (optional) Milliseconds to defer the focus
     * @return {Rs.Element} this
     */
    focus : function(defer, /* private */ dom) {
        var me = this,
            dom = dom || me.dom;
        try{
            if(Number(defer)){
                me.focus.defer(defer, null, [null, dom]);
            }else{
                dom.focus();
            }
        }catch(e){}
        return me;
    },

    /**
     * Tries to blur the element. Any exceptions are caught and ignored.
     * @return {Rs.Element} this
     */
    blur : function() {
        try{
            this.dom.blur();
        }catch(e){}
        return this;
    },

    
    /**
     * Stops the specified event(s) from bubbling and optionally prevents the default action
     * @param {String/Array} eventName an event / array of events to stop from bubbling
     * @param {Boolean} preventDefault (optional) true to prevent the default action too
     * @return {Rs.Element} this
     */
    swallowEvent : function(eventName, preventDefault) {
        var me = this;
        function fn(e) {
            e.stopPropagation();
            if (preventDefault) {
                e.preventDefault();
            }
        }
        
        if (Rs.isArray(eventName)) {
            Rs.each(eventName, function(e) {
                 me.on(e, fn);
            });
            return me;
        }
        me.on(eventName, fn);
        return me;
    },
    
    /**
     * Returns the value of the "value" attribute
     * @param {Boolean} asNumber true to parse the value as a number
     * @return {String/Number}
     */
    getValue : function(asNumber){
        var val = this.dom.value;
        return asNumber ? parseInt(val, 10) : val;
    },

    /**
     * Appends an event handler to this element.  The shorthand version {@link #on} is equivalent.
     * @param {String} eventName The name of event to handle.
     * @param {Function} fn The handler function the event invokes. This function is passed
     * the following parameters:<ul>
     * <li><b>evt</b> : EventObject<div class="sub-desc">The {@link Rs.EventObject EventObject} describing the event.</div></li>
     * <li><b>el</b> : HtmlElement<div class="sub-desc">The DOM element which was the target of the event.
     * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
     * <li><b>o</b> : Object<div class="sub-desc">The options object from the addListener call.</div></li>
     * </ul>
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to this Element.</b>.
     * @param {Object} options (optional) An object containing handler configuration properties.
     * This may contain any of the following properties:<ul>
     * <li><b>scope</b> Object : <div class="sub-desc">The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to this Element.</b></div></li>
     * <li><b>delegate</b> String: <div class="sub-desc">A simple selector to filter the target or look for a descendant of the target. See below for additional details.</div></li>
     * <li><b>stopEvent</b> Boolean: <div class="sub-desc">True to stop the event. That is stop propagation, and prevent the default action.</div></li>
     * <li><b>preventDefault</b> Boolean: <div class="sub-desc">True to prevent the default action</div></li>
     * <li><b>stopPropagation</b> Boolean: <div class="sub-desc">True to prevent event propagation</div></li>
     * <li><b>normalized</b> Boolean: <div class="sub-desc">False to pass a browser event to the handler function instead of an Ext.EventObject</div></li>
     * <li><b>target</b> Ext.Element: <div class="sub-desc">Only call the handler if the event was fired on the target Element, <i>not</i> if the event was bubbled up from a child node.</div></li>
     * <li><b>delay</b> Number: <div class="sub-desc">The number of milliseconds to delay the invocation of the handler after the event fires.</div></li>
     * <li><b>single</b> Boolean: <div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
     * <li><b>buffer</b> Number: <div class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
     * </ul><br>
     * <p>
     * <b>Combining Options</b><br>
     * In the following examples, the shorthand form {@link #on} is used rather than the more verbose
     * addListener.  The two are equivalent.  Using the options argument, it is possible to combine different
     * types of listeners:<br>
     * <br>
     * A delayed, one-time listener that auto stops the event and adds a custom argument (forumId) to the
     * options object. The options object is available as the third parameter in the handler function.<div style="margin: 5px 20px 20px;">
     * Code:<pre><code>
el.on('click', this.onClick, this, {
    single: true,
    delay: 100,
    stopEvent : true,
    forumId: 4
});</code></pre></p>
     * <p>
     * <b>Attaching multiple handlers in 1 call</b><br>
     * The method also allows for a single argument to be passed which is a config object containing properties
     * which specify multiple handlers.</p>
     * <p>
     * Code:<pre><code>
el.on({
    'click' : {
        fn: this.onClick,
        scope: this,
        delay: 100
    },
    'mouseover' : {
        fn: this.onMouseOver,
        scope: this
    },
    'mouseout' : {
        fn: this.onMouseOut,
        scope: this
    }
});</code></pre>
     * <p>
     * Or a shorthand syntax:<br>
     * Code:<pre><code></p>
el.on({
    'click' : this.onClick,
    'mouseover' : this.onMouseOver,
    'mouseout' : this.onMouseOut,
    scope: this
});
     * </code></pre></p>
     * <p><b>delegate</b></p>
     * <p>This is a configuration option that you can pass along when registering a handler for
     * an event to assist with event delegation. Event delegation is a technique that is used to
     * reduce memory consumption and prevent exposure to memory-leaks. By registering an event
     * for a container element as opposed to each element within a container. By setting this
     * configuration option to a simple selector, the target element will be filtered to look for
     * a descendant of the target.
     * For example:<pre><code>
// using this markup:
&lt;div id='elId'>
    &lt;p id='p1'>paragraph one&lt;/p>
    &lt;p id='p2' class='clickable'>paragraph two&lt;/p>
    &lt;p id='p3'>paragraph three&lt;/p>
&lt;/div>
// utilize event delegation to registering just one handler on the container element:
el = Rs.get('elId');
el.on(
    'click',
    function(e,t) {
        // handle click
        console.info(t.id); // 'p2'
    },
    this,
    {
        // filter the target element to be a descendant with the class 'clickable'
        delegate: '.clickable'
    }
);
     * </code></pre></p>
     * @return {Rs.Element} this
     */
    addListener : function(eventName, fn, scope, options){
        Rs.EventManager.on(this.dom,  eventName, fn, scope || this, options);
        return this;
    },

    /**
     * Removes an event handler from this element.  The shorthand version {@link #un} is equivalent.
     * <b>Note</b>: if a <i>scope</i> was explicitly specified when {@link #addListener adding} the
     * listener, the same scope must be specified here.
     * Example:
     * <pre><code>
el.removeListener('click', this.handlerFn);
// or
el.un('click', this.handlerFn);
</code></pre>
     * @param {String} eventName The name of the event from which to remove the handler.
     * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
     * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
     * then this must refer to the same object.
     * @return {Rs.Element} this
     */
    removeListener : function(eventName, fn, scope){
        Rs.EventManager.removeListener(this.dom,  eventName, fn, scope || this);
        return this;
    },

    /**
     * Removes all previous added listeners from this element
     * @return {Rs.Element} this
     */
    removeAllListeners : function(){
        Rs.EventManager.removeAll(this.dom);
        return this;
    },

    /**
     * Recursively removes all previous added listeners from this element and its children
     * @return {Rs.Element} this
     */
    purgeAllListeners : function() {
        Rs.EventManager.purgeElement(this, true);
        return this;
    },

    /**
     * @private Test if size has a unit, otherwise appends the default
     */
    addUnits : function(size){
        if(size === "" || size == "auto" || size === undefined){
            size = size || '';
        } else if(!isNaN(size) || !unitPattern.test(size)){
            size = size + (this.defaultUnit || 'px');
        }
        return size;
    },

    /**
     * <p>Updates the <a href="http://developer.mozilla.org/en/DOM/element.innerHTML">innerHTML</a> of this Element
     * from a specified URL. Note that this is subject to the <a href="http://en.wikipedia.org/wiki/Same_origin_policy">Same Origin Policy</a></p>
     * <p>Updating innerHTML of an element will <b>not</b> execute embedded <tt>&lt;script></tt> elements. This is a browser restriction.</p>
     * @param {Mixed} options. Either a sring containing the URL from which to load the HTML, or an {@link Ext.Ajax#request} options object specifying
     * exactly how to request the HTML.
     * @return {Rs.Element} this
     */
    load : function(url, params, cb){
        Rs.Ajax.request(Rs.apply({
            params: params,
            url: url.url || url,
            callback: cb,
            el: this.dom,
            indicatorText: url.indicatorText || ''
        }, Rs.isObject(url) ? url : {}));
        return this;
    },

    /**
     * Tests various css rules/browsers to determine if this element uses a border box
     * @return {Boolean}
     */
    isBorderBox : function(){
        return noBoxAdjust[(this.dom.tagName || "").toLowerCase()] || Rs.isBorderBox;
    },

    /**
     * <p>Removes this element's dom reference.  Note that event and cache removal is handled at {@link Rs#removeNode}</p>
     */
    remove : function(){
        var me = this,
            dom = me.dom;

        if (dom) {
            delete me.dom;
            Rs.removeNode(dom);
        }
    },

    /**
     * Sets up event handlers to call the passed functions when the mouse is moved into and out of the Element.
     * @param {Function} overFn The function to call when the mouse enters the Element.
     * @param {Function} outFn The function to call when the mouse leaves the Element.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the functions are executed. Defaults to the Element's DOM element.
     * @param {Object} options (optional) Options for the listener. See {@link Rs.util.Observable#addListener the <tt>options</tt> parameter}.
     * @return {Rs.Element} this
     */
    hover : function(overFn, outFn, scope, options){
        var me = this;
        me.on('mouseenter', overFn, scope || me.dom, options);
        me.on('mouseleave', outFn, scope || me.dom, options);
        return me;
    },

    /**
     * Returns true if this element is an ancestor of the passed element
     * @param {HTMLElement/String} el The element to check
     * @return {Boolean} True if this element is an ancestor of el, else false
     */
    contains : function(el){
        return !el ? false : Rs.lib.Dom.isAncestor(this.dom, el.dom ? el.dom : el);
    },

    /**
     * Returns the value of a namespaced attribute from the element's underlying DOM node.
     * @param {String} namespace The namespace in which to look for the attribute
     * @param {String} name The attribute name
     * @return {String} The attribute value
     * @deprecated
     */
    getAttributeNS : function(ns, name){
        return this.getAttribute(name, ns);
    },

    /**
     * Returns the value of an attribute from the element's underlying DOM node.
     * @param {String} name The attribute name
     * @param {String} namespace (optional) The namespace in which to look for the attribute
     * @return {String} The attribute value
     */
    getAttribute : Rs.isIE ? function(name, ns){
        var d = this.dom,
            type = typeof d[ns + ":" + name];

        if(['undefined', 'unknown'].indexOf(type) == -1){
            return d[ns + ":" + name];
        }
        return d[name];
    } : function(name, ns){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name) || d.getAttribute(name) || d[name];
    },

    /**
     * Update the innerHTML of this element
     * @param {String} html The new HTML
     * @return {Rs.Element} this
      */
    update : function(html) {
        if (this.dom) {
            this.dom.innerHTML = html;
        }
        return this;
    }, 
    
    /**
     * 不可被选中
     * @return {Rs.Element} this
      */
    unselectable : function(){
        this.dom.unselectable = "on";
        return this.swallowEvent("selectstart", true).
                    applyStyles("-moz-user-select:none;-khtml-user-select:none;").
                    addClass("x-unselectable");
    }, 
    
    /**
     * 修改样式
     * @param {String} style 
     * @return {Rs.Element} this
     */
    applyStyles : function(style){
        Rs.DomHelper.applyStyles(this.dom, style);
        return this;
    },

    /**
     * 获取样式
     * @return {Rs.Element} this
     */
    getStyles : function(){
        var ret = {};
        Rs.each(arguments, function(v) {
           ret[v] = this.getStyle(v);
        },
        this);
        return ret;
    }
    
};

var ep = El.prototype;

El.addMethods = function(o){
   Rs.apply(ep, o);
};

/**
 * Appends an event handler (shorthand for {@link #addListener}).
 * @param {String} eventName The name of event to handle.
 * @param {Function} fn The handler function the event invokes.
 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function is executed.
 * @param {Object} options (optional) An object containing standard {@link #addListener} options
 * @member Rs.Element
 * @method on
 */
ep.on = ep.addListener;


/**
 * Removes an event handler from this element (see {@link #removeListener} for additional notes).
 * @param {String} eventName The name of the event from which to remove the handler.
 * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
 * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
 * then this must refer to the same object.
 * @return {Rs.Element} this
 * @member Rs.Element
 * @method un
 */
ep.un = ep.removeListener;

/**
 * true to automatically adjust width and height settings for box-model issues (default to true)
 */
ep.autoBoxAdjust = true;

// private
var unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    docEl;

/**
 * Retrieves Rs.Element objects.
 * <p><b>This method does not retrieve {@link Rs.Component Component}s.</b> This method
 * retrieves Rs.Element objects which encapsulate DOM elements. To retrieve a Component by
 * its ID, use {@link Rs.ComponentMgr#get}.</p>
 * <p>Uses simple caching to consistently return the same object. Automatically fixes if an
 * object was recreated with the same id via AJAX or DOM.</p>
 * @param {Mixed} el The id of the node, a DOM Node or an existing Element.
 * @return {Element} The Element object (or null if no matching element was found)
 * @static
 * @member Rs.Element
 * @method get
 */
El.get = function(el){
    var ex,
        elm,
        id;
    if(!el){ return null; }
    if (typeof el == "string") { // element id
        if (!(elm = DOC.getElementById(el))) {
            return null;
        }
        if (EC[el] && EC[el].el) {
            ex = EC[el].el;
            ex.dom = elm;
        } else {
            ex = El.addToCache(new El(elm));
        }
        return ex;
    } else if (el.tagName) { // dom element
        if(!(id = el.id)){
            id = Rs.id(el);
        }
        if (EC[id] && EC[id].el) {
            ex = EC[id].el;
            ex.dom = el;
        } else {
            ex = El.addToCache(new El(el));
        }
        return ex;
    } else if (el instanceof El) {
        if(el != docEl){
            el.dom = DOC.getElementById(el.id) || el.dom; // refresh dom element in case no longer valid,
                                                          // catch case where it hasn't been appended
        }
        return el;
    } else if(el.isComposite) {
        return el;
    } else if(Rs.isArray(el)) {
        return El.select(el);
    } else if(el == DOC) {
        // create a bogus element object representing the document object
        if(!docEl){
            var f = function(){};
            f.prototype = El.prototype;
            docEl = new f();
            docEl.dom = DOC;
        }
        return docEl;
    }
    return null;
};

El.addToCache = function(el, id){
    id = id || el.id;    
    EC[id] = {
        el:  el,
        data: {},
        events: {}
    };
    return el;
};

// private method for getting and setting element data
El.data = function(el, key, value){
    el = El.get(el);
    if (!el) {
        return null;
    }
    var c = EC[el.id].data;
    if(arguments.length == 2){
        return c[key];
    }else{
        return (c[key] = value);
    }
};

// private
// Garbage collection - uncache elements/purge listeners on orphaned elements
// so we don't hold a reference and cause the browser to retain them
function garbageCollect(){
    if(!Rs.enableGarbageCollector){
        clearInterval(El.collectorThreadId);
    } else {
        var eid,
            el,
            d,
            o;

        for(eid in EC){
            o = EC[eid];
            if(o.skipGC){
                continue;
            }
            el = o.el;
            d = el.dom;
            // -------------------------------------------------------
            // Determining what is garbage:
            // -------------------------------------------------------
            // !d
            // dom node is null, definitely garbage
            // -------------------------------------------------------
            // !d.parentNode
            // no parentNode == direct orphan, definitely garbage
            // -------------------------------------------------------
            // !d.offsetParent && !document.getElementById(eid)
            // display none elements have no offsetParent so we will
            // also try to look it up by it's id. However, check
            // offsetParent first so we don't do unneeded lookups.
            // This enables collection of elements that are not orphans
            // directly, but somewhere up the line they have an orphan
            // parent.
            // -------------------------------------------------------
            if(!d || !d.parentNode || (!d.offsetParent && !DOC.getElementById(eid))){
                if(Rs.enableListenerCollection){
                    Rs.EventManager.removeAll(d);
                }
                delete EC[eid];
            }
        }
        // Cleanup IE Object leaks
        if (Rs.isIE) {
            var t = {};
            for (eid in EC) {
                t[eid] = EC[eid];
            }
            EC = Rs.elCache = t;
        }
    }
}
El.collectorThreadId = setInterval(garbageCollect, 30000);

var flyFn = function(){};
flyFn.prototype = El.prototype;

// dom is optional
El.Flyweight = function(dom){
    this.dom = dom;
};

El.Flyweight.prototype = new flyFn();
El.Flyweight.prototype.isFlyweight = true;
El._flyweights = {};


/**
 * <p>Gets the globally shared flyweight Element, with the passed node as the active element. Do not store a reference to this element -
 * the dom node can be overwritten by other code. Shorthand of {@link Rs.Element#fly}</p>
 * <p>Use this to make one-time references to DOM elements which are not going to be accessed again either by
 * application code, or by Ext's classes. If accessing an element which will be processed regularly, then {@link Rs#get}
 * will be more appropriate to take advantage of the caching provided by the Rs.Element class.</p>
 * @param {String/HTMLElement} el The dom node or id
 * @param {String} named (optional) Allows for creation of named reusable flyweights to prevent conflicts
 * (e.g. internally Rs uses "_global")
 * @return {Element} The shared Element object (or null if no matching element was found)
 * @member Rs.Element
 * @method fly
 */
El.fly = function(el, named){
    var ret = null;
    named = named || '_global';

    if (el = Rs.getDom(el)) {
        (El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
        ret = El._flyweights[named];
    }
    return ret;
};

/**
 * Retrieves Rs.Element objects.
 * <p><b>This method does not retrieve {@link Rs.Component Component}s.</b> This method
 * retrieves Rs.Element objects which encapsulate DOM elements. To retrieve a Component by
 * its ID, use {@link Rs.ComponentMgr#get}.</p>
 * <p>Uses simple caching to consistently return the same object. Automatically fixes if an
 * object was recreated with the same id via AJAX or DOM.</p>
 * Shorthand of {@link Rs.Element#get}
 * @param {Mixed} el The id of the node, a DOM Node or an existing Element.
 * @return {Element} The Element object (or null if no matching element was found)
 * @member Rs
 * @method get
 */
Rs.get = El.get;

/**
 * <p>Gets the globally shared flyweight Element, with the passed node as the active element. Do not store a reference to this element -
 * the dom node can be overwritten by other code. Shorthand of {@link Rs.Element#fly}</p>
 * <p>Use this to make one-time references to DOM elements which are not going to be accessed again either by
 * application code, or by Ext's classes. If accessing an element which will be processed regularly, then {@link Rs#get}
 * will be more appropriate to take advantage of the caching provided by the Rs.Element class.</p>
 * @param {String/HTMLElement} el The dom node or id
 * @param {String} named (optional) Allows for creation of named reusable flyweights to prevent conflicts
 * (e.g. internally Rs uses "_global")
 * @return {Element} The shared Element object (or null if no matching element was found)
 * @member Rs
 * @method fly
 */
Rs.fly = El.fly;

// speedy lookup for elements never to box adjust
var noBoxAdjust = Rs.isStrict ? {
    select:1
} : {
    input:1, select:1, textarea:1
};
if(Rs.isIE || Rs.isGecko){
    noBoxAdjust['button'] = 1;
}

Rs.EventManager.on(window, 'unload', function(){
    delete EC;
    delete El._flyweights;
});
})();
/**
 * @class Rs.Element
 */
Rs.Element.addMethods(function(){
	var PARENTNODE = 'parentNode',
		NEXTSIBLING = 'nextSibling',
		PREVIOUSSIBLING = 'previousSibling',
		DQ = Rs.DomQuery,
		GET = Rs.get;
	
	return {
		/**
	     * Looks at this node and then at parent nodes for a match of the passed simple selector (e.g. div.some-class or span:first-child)
	     * @param {String} selector The simple selector to test
	     * @param {Number/Mixed} maxDepth (optional) The max depth to search as a number or element (defaults to 50 || document.body)
	     * @param {Boolean} returnEl (optional) True to return a Rs.Element object instead of DOM node
	     * @return {HTMLElement} The matching DOM node (or null if no match was found)
	     */
	    findParent : function(simpleSelector, maxDepth, returnEl){
	        var p = this.dom,
	        	b = document.body, 
	        	depth = 0, 	        	
	        	stopEl;	        
            if(Rs.isGecko && Object.prototype.toString.call(p) == '[object XULElement]') {
                return null;
            }
	        maxDepth = maxDepth || 50;
	        if (isNaN(maxDepth)) {
	            stopEl = Rs.getDom(maxDepth);
	            maxDepth = Number.MAX_VALUE;
	        }
	        while(p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl){
	            if(DQ.is(p, simpleSelector)){
	                return returnEl ? GET(p) : p;
	            }
	            depth++;
	            p = p.parentNode;
	        }
	        return null;
	    },
	
	    /**
	     * Looks at parent nodes for a match of the passed simple selector (e.g. div.some-class or span:first-child)
	     * @param {String} selector The simple selector to test
	     * @param {Number/Mixed} maxDepth (optional) The max depth to
	            search as a number or element (defaults to 10 || document.body)
	     * @param {Boolean} returnEl (optional) True to return a Rs.Element object instead of DOM node
	     * @return {HTMLElement} The matching DOM node (or null if no match was found)
	     */
	    findParentNode : function(simpleSelector, maxDepth, returnEl){
	        var p = Rs.fly(this.dom.parentNode, '_internal');
	        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
	    },
	
	    /**
	     * Walks up the dom looking for a parent node that matches the passed simple selector (e.g. div.some-class or span:first-child).
	     * This is a shortcut for findParentNode() that always returns an Rs.Element.
	     * @param {String} selector The simple selector to test
	     * @param {Number/Mixed} maxDepth (optional) The max depth to
	            search as a number or element (defaults to 10 || document.body)
	     * @return {Rs.Element} The matching DOM node (or null if no match was found)
	     */
	    up : function(simpleSelector, maxDepth){
	        return this.findParentNode(simpleSelector, maxDepth, true);
	    },
	
	    /**
	     * Creates a {@link Rs.CompositeElement} for child nodes based on the passed CSS selector (the selector should not contain an id).
	     * @param {String} selector The CSS selector
	     * @return {CompositeElement/CompositeElementLite} The composite element
	     */
	    select : function(selector){
	        return Rs.Element.select(selector, this.dom);
	    },
	
	    /**
	     * Selects child nodes based on the passed CSS selector (the selector should not contain an id).
	     * @param {String} selector The CSS selector
	     * @return {Array} An array of the matched nodes
	     */
	    query : function(selector){
	        return DQ.select(selector, this.dom);
	    },
	
	    /**
	     * Selects a single child at any depth below this element based on the passed CSS selector (the selector should not contain an id).
	     * @param {String} selector The CSS selector
	     * @param {Boolean} returnDom (optional) True to return the DOM node instead of Rs.Element (defaults to false)
	     * @return {HTMLElement/Rs.Element} The child Rs.Element (or DOM node if returnDom = true)
	     */
	    child : function(selector, returnDom){
	        var n = DQ.selectNode(selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	
	    /**
	     * Selects a single *direct* child based on the passed CSS selector (the selector should not contain an id).
	     * @param {String} selector The CSS selector
	     * @param {Boolean} returnDom (optional) True to return the DOM node instead of Rs.Element (defaults to false)
	     * @return {HTMLElement/Rs.Element} The child Rs.Element (or DOM node if returnDom = true)
	     */
	    down : function(selector, returnDom){
	        var n = DQ.selectNode(" > " + selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	
		 /**
	     * Gets the parent node for this element, optionally chaining up trying to match a selector
	     * @param {String} selector (optional) Find a parent node that matches the passed simple selector
	     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Rs.Element
	     * @return {Rs.Element/HTMLElement} The parent node or null
		 */
	    parent : function(selector, returnDom){
	        return this.matchNode(PARENTNODE, PARENTNODE, selector, returnDom);
	    },
	
	     /**
	     * Gets the next sibling, skipping text nodes
	     * @param {String} selector (optional) Find the next sibling that matches the passed simple selector
	     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Rs.Element
	     * @return {Rs.Element/HTMLElement} The next sibling or null
		 */
	    next : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, NEXTSIBLING, selector, returnDom);
	    },
	
	    /**
	     * Gets the previous sibling, skipping text nodes
	     * @param {String} selector (optional) Find the previous sibling that matches the passed simple selector
	     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Rs.Element
	     * @return {Rs.Element/HTMLElement} The previous sibling or null
		 */
	    prev : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, PREVIOUSSIBLING, selector, returnDom);
	    },
	
	
	    /**
	     * Gets the first child, skipping text nodes
	     * @param {String} selector (optional) Find the next sibling that matches the passed simple selector
	     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Rs.Element
	     * @return {Rs.Element/HTMLElement} The first child or null
		 */
	    first : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, 'firstChild', selector, returnDom);
	    },
	
	    /**
	     * Gets the last child, skipping text nodes
	     * @param {String} selector (optional) Find the previous sibling that matches the passed simple selector
	     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Rs.Element
	     * @return {Rs.Element/HTMLElement} The last child or null
		 */
	    last : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, 'lastChild', selector, returnDom);
	    },
	    
	    matchNode : function(dir, start, selector, returnDom){
	        var n = this.dom[start];
	        while(n){
	            if(n.nodeType == 1 && (!selector || DQ.is(n, selector))){
	                return !returnDom ? GET(n) : n;
	            }
	            n = n[dir];
	        }
	        return null;
	    }	
    }
}());
/**
 * @class Rs.Element
 */
Rs.Element.addMethods(
function() {
	var GETDOM = Rs.getDom,
		GET = Rs.get,
		DH = Rs.DomHelper;
	
	return {
	    /**
	     * Appends the passed element(s) to this element
	     * @param {String/HTMLElement/Array/Element/CompositeElement} el
	     * @return {Rs.Element} this
	     */
	    appendChild: function(el){        
	        return GET(el).appendTo(this);        
	    },
	
	    /**
	     * Appends this element to the passed element
	     * @param {Mixed} el The new parent element
	     * @return {Rs.Element} this
	     */
	    appendTo: function(el){        
	        GETDOM(el).appendChild(this.dom);        
	        return this;
	    },
	
	    /**
	     * Inserts this element before the passed element in the DOM
	     * @param {Mixed} el The element before which this element will be inserted
	     * @return {Rs.Element} this
	     */
	    insertBefore: function(el){  	          
	        (el = GETDOM(el)).parentNode.insertBefore(this.dom, el);
	        return this;
	    },
	
	    /**
	     * Inserts this element after the passed element in the DOM
	     * @param {Mixed} el The element to insert after
	     * @return {Rs.Element} this
	     */
	    insertAfter: function(el){
	        (el = GETDOM(el)).parentNode.insertBefore(this.dom, el.nextSibling);
	        return this;
	    },
	
	    /**
	     * Inserts (or creates) an element (or DomHelper config) as the first child of this element
	     * @param {Mixed/Object} el The id or element to insert or a DomHelper config to create and insert
	     * @return {Rs.Element} The new child
	     */
	    insertFirst: function(el, returnDom){
            el = el || {};
            if(el.nodeType || el.dom || typeof el == 'string'){ // element
                el = GETDOM(el);
                this.dom.insertBefore(el, this.dom.firstChild);
                return !returnDom ? GET(el) : el;
            }else{ // dh config
                return this.createChild(el, this.dom.firstChild, returnDom);
            }
        },
	
	    /**
	     * Replaces the passed element with this element
	     * @param {Mixed} el The element to replace
	     * @return {Rs.Element} this
	     */
	    replace: function(el){
	        el = GET(el);
	        this.insertBefore(el);
	        el.remove();
	        return this;
	    },
	
	    /**
	     * Replaces this element with the passed element
	     * @param {Mixed/Object} el The new element or a DomHelper config of an element to create
	     * @return {Rs.Element} this
	     */
	    replaceWith: function(el){
		    var me = this;
                
            if(el.nodeType || el.dom || typeof el == 'string'){
                el = GETDOM(el);
                me.dom.parentNode.insertBefore(el, me.dom);
            }else{
                el = DH.insertBefore(me.dom, el);
            }
	        
	        delete Rs.elCache[me.id];
	        Rs.removeNode(me.dom);      
	        me.id = Rs.id(me.dom = el);
	        Rs.Element.addToCache(me.isFlyweight ? new Rs.Element(me.dom) : me);     
            return me;
	    },
	    
		/**
		 * Creates the passed DomHelper config and appends it to this element or optionally inserts it before the passed child element.
		 * @param {Object} config DomHelper element config object.  If no tag is specified (e.g., {tag:'input'}) then a div will be
		 * automatically generated with the specified attributes.
		 * @param {HTMLElement} insertBefore (optional) a child element of this element
		 * @param {Boolean} returnDom (optional) true to return the dom node instead of creating an Element
		 * @return {Rs.Element} The new child element
		 */
		createChild: function(config, insertBefore, returnDom){
		    config = config || {tag:'div'};
		    return insertBefore ? 
		    	   DH.insertBefore(insertBefore, config, returnDom !== true) :	
		    	   DH[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
		},
		
		/**
		 * Creates and wraps this element with another element
		 * @param {Object} config (optional) DomHelper element config object for the wrapper element or null for an empty div
		 * @param {Boolean} returnDom (optional) True to return the raw DOM element instead of Rs.Element
		 * @return {HTMLElement/Element} The newly created wrapper element
		 */
		wrap: function(config, returnDom){        
		    var newEl = DH.insertBefore(this.dom, config || {tag: "div"}, !returnDom);
		    newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
		    return newEl;
		},
		
		/**
		 * Inserts an html fragment into this element
		 * @param {String} where Where to insert the html in relation to this element - beforeBegin, afterBegin, beforeEnd, afterEnd.
		 * @param {String} html The HTML fragment
		 * @param {Boolean} returnEl (optional) True to return an Rs.Element (defaults to false)
		 * @return {HTMLElement/Rs.Element} The inserted node (or nearest related if more than 1 inserted)
		 */
		insertHtml : function(where, html, returnEl){
		    var el = DH.insertHtml(where, this.dom, html);
		    return returnEl ? Rs.get(el) : el;
		}
	}
}());
/**
 * @class Rs.Element
 */
Rs.Element.addMethods(function(){
    // local style camelizing for speed
    var propCache = {},
        camelRe = /(-[a-z])/gi,
        classReCache = {},
        view = document.defaultView,
        propFloat = Rs.isIE ? 'styleFloat' : 'cssFloat',
        opacityRe = /alpha\(opacity=(.*)\)/i,
        trimRe = /^\s+|\s+$/g,
        EL = Rs.Element,
        PADDING = "padding",
        MARGIN = "margin",
        BORDER = "border",
        LEFT = "-left",
        RIGHT = "-right",
        TOP = "-top",
        BOTTOM = "-bottom",
        WIDTH = "-width",
        MATH = Math,
        HIDDEN = 'hidden',
        ISCLIPPED = 'isClipped',
        OVERFLOW = 'overflow',
        OVERFLOWX = 'overflow-x',
        OVERFLOWY = 'overflow-y',
        ORIGINALCLIP = 'originalClip',
        // special markup used throughout Ext when box wrapping elements
        borders = {l: BORDER + LEFT + WIDTH, r: BORDER + RIGHT + WIDTH, t: BORDER + TOP + WIDTH, b: BORDER + BOTTOM + WIDTH},
        paddings = {l: PADDING + LEFT, r: PADDING + RIGHT, t: PADDING + TOP, b: PADDING + BOTTOM},
        margins = {l: MARGIN + LEFT, r: MARGIN + RIGHT, t: MARGIN + TOP, b: MARGIN + BOTTOM},
        data = Rs.Element.data;


    // private
    function camelFn(m, a) {
        return a.charAt(1).toUpperCase();
    }

    function chkCache(prop) {
        return propCache[prop] || (propCache[prop] = prop == 'float' ? propFloat : prop.replace(camelRe, camelFn));
    }

    return {
        // private  ==> used by Fx
        adjustWidth : function(width) {
            var me = this;
            var isNum = Rs.isNumber(width);
            if(isNum && me.autoBoxAdjust && !me.isBorderBox()){
               width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
            }
            return (isNum && width < 0) ? 0 : width;
        },

        // private   ==> used by Fx
        adjustHeight : function(height) {
            var me = this;
            var isNum = Rs.isNumber(height);
            if(isNum && me.autoBoxAdjust && !me.isBorderBox()){
               height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
            }
            return (isNum && height < 0) ? 0 : height;
        },


        /**
         * Adds one or more CSS classes to the element. Duplicate classes are automatically filtered out.
         * @param {String/Array} className The CSS class to add, or an array of classes
         * @return {Rs.Element} this
         */
        addClass : function(className){
            var me = this, i, len, v;
            className = Rs.isArray(className) ? className : [className];
            for (i=0, len = className.length; i < len; i++) {
                v = className[i];
                if (v) {
                    me.dom.className += (!me.hasClass(v) && v ? " " + v : "");
                };
            };
            return me;
        },

        /**
         * Adds one or more CSS classes to this element and removes the same class(es) from all siblings.
         * @param {String/Array} className The CSS class to add, or an array of classes
         * @return {Rs.Element} this
         */
        radioClass : function(className){
            var cn = this.dom.parentNode.childNodes, v;
            className = Rs.isArray(className) ? className : [className];
            for (var i=0, len = cn.length; i < len; i++) {
                v = cn[i];
                if(v && v.nodeType == 1) {
                    Rs.fly(v, '_internal').removeClass(className);
                }
            };
            return this.addClass(className);
        },

        /**
         * Removes one or more CSS classes from the element.
         * @param {String/Array} className The CSS class to remove, or an array of classes
         * @return {Rs.Element} this
         */
        removeClass : function(className){
            var me = this, v;
            className = Rs.isArray(className) ? className : [className];
            if (me.dom && me.dom.className) {
                for (var i=0, len=className.length; i < len; i++) {
                    v = className[i];
                    if(v) {
                        me.dom.className = me.dom.className.replace(
                            classReCache[v] = classReCache[v] || new RegExp('(?:^|\\s+)' + v + '(?:\\s+|$)', "g"), " "
                        );
                    }
                };
            }
            return me;
        },

        /**
         * Toggles the specified CSS class on this element (removes it if it already exists, otherwise adds it).
         * @param {String} className The CSS class to toggle
         * @return {Rs.Element} this
         */
        toggleClass : function(className){
            return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
        },

        /**
         * Checks if the specified CSS class exists on this element's DOM node.
         * @param {String} className The CSS class to check for
         * @return {Boolean} True if the class exists, else false
         */
        hasClass : function(className){
            return className && (' '+this.dom.className+' ').indexOf(' '+className+' ') != -1;
        },

        /**
         * Replaces a CSS class on the element with another.  If the old name does not exist, the new name will simply be added.
         * @param {String} oldClassName The CSS class to replace
         * @param {String} newClassName The replacement CSS class
         * @return {Rs.Element} this
         */
        replaceClass : function(oldClassName, newClassName){
            return this.removeClass(oldClassName).addClass(newClassName);
        },

        isStyle : function(style, val) {
            return this.getStyle(style) == val;
        },

        /**
         * Normalizes currentStyle and computedStyle.
         * @param {String} property The style property whose value is returned.
         * @return {String} The current value of the style property for this element.
         */
        getStyle : function(){
            return view && view.getComputedStyle ?
                function(prop){
                    var el = this.dom,
                        v,
                        cs,
                        out,
                        display,
                        wk = Rs.isWebKit,
                        display;
                        
                    if(el == document){
                        return null;
                    }
                    prop = chkCache(prop);
                    // Fix bug caused by this: https://bugs.webkit.org/show_bug.cgi?id=13343
                    if(wk && /marginRight/.test(prop)){
                        display = this.getStyle('display');
                        el.style.display = 'inline-block';
                    }
                    out = (v = el.style[prop]) ? v :
                           (cs = view.getComputedStyle(el, "")) ? cs[prop] : null;

                    // Webkit returns rgb values for transparent.
                    if(wk){
                        if(out == 'rgba(0, 0, 0, 0)'){
                            out = 'transparent';
                        }else if(display){
                            el.style.display = display;
                        }
                    }
                    return out;
                } :
                function(prop){
                    var el = this.dom,
                        m,
                        cs;

                    if(el == document) return null;
                    if (prop == 'opacity') {
                        if (el.style.filter.match) {
                            if(m = el.style.filter.match(opacityRe)){
                                var fv = parseFloat(m[1]);
                                if(!isNaN(fv)){
                                    return fv ? fv / 100 : 0;
                                }
                            }
                        }
                        return 1;
                    }
                    prop = chkCache(prop);
                    return el.style[prop] || ((cs = el.currentStyle) ? cs[prop] : null);
                };
        }(),

        /**
         * Return the CSS color for the specified CSS attribute. rgb, 3 digit (like #fff) and valid values
         * are convert to standard 6 digit hex color.
         * @param {String} attr The css attribute
         * @param {String} defaultValue The default value to use when a valid color isn't found
         * @param {String} prefix (optional) defaults to #. Use an empty string when working with
         * color anims.
         */
        getColor : function(attr, defaultValue, prefix){
            var v = this.getStyle(attr),
                color = Rs.isDefined(prefix) ? prefix : '#',
                h;

            if(!v || /transparent|inherit/.test(v)){
                return defaultValue;
            }
            if(/^r/.test(v)){
                Rs.each(v.slice(4, v.length -1).split(','), function(s){
                    h = parseInt(s, 10);
                    color += (h < 16 ? '0' : '') + h.toString(16);
                });
            }else{
                v = v.replace('#', '');
                color += v.length == 3 ? v.replace(/^(\w)(\w)(\w)$/, '$1$1$2$2$3$3') : v;
            }
            return(color.length > 5 ? color.toLowerCase() : defaultValue);
        },

        /**
         * Wrapper for setting style properties, also takes single object parameter of multiple styles.
         * @param {String/Object} property The style property to be set, or an object of multiple styles.
         * @param {String} value (optional) The value to apply to the given property, or null if an object was passed.
         * @return {Rs.Element} this
         */
        setStyle : function(prop, value){
            var tmp,
                style,
                camel;
            if (!Rs.isObject(prop)) {
                tmp = {};
                tmp[prop] = value;
                prop = tmp;
            }
            for (style in prop) {
                value = prop[style];
                style == 'opacity' ?
                    this.setOpacity(value) :
                    this.dom.style[chkCache(style)] = value;
            }
            return this;
        },

        /**
         * Set the opacity of the element
         * @param {Float} opacity The new opacity. 0 = transparent, .5 = 50% visibile, 1 = fully visible, etc
         * @param {Boolean/Object} animate (optional) a standard Element animation config object or <tt>true</tt> for
         * the default animation (<tt>{duration: .35, easing: 'easeIn'}</tt>)
         * @return {Rs.Element} this
         */
         setOpacity : function(opacity, animate){
            var me = this,
                s = me.dom.style;

            if(!animate || !me.anim){
                if(Rs.isIE){
                    var opac = opacity < 1 ? 'alpha(opacity=' + opacity * 100 + ')' : '',
                    val = s.filter.replace(opacityRe, '').replace(trimRe, '');

                    s.zoom = 1;
                    s.filter = val + (val.length > 0 ? ' ' : '') + opac;
                }else{
                    s.opacity = opacity;
                }
            }else{
                me.anim({opacity: {to: opacity}}, me.preanim(arguments, 1), null, .35, 'easeIn');
            }
            return me;
        },

        /**
         * Clears any opacity settings from this element. Required in some cases for IE.
         * @return {Rs.Element} this
         */
        clearOpacity : function(){
            var style = this.dom.style;
            if(Rs.isIE){
                if(!Rs.isEmpty(style.filter)){
                    style.filter = style.filter.replace(opacityRe, '').replace(trimRe, '');
                }
            }else{
                style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = '';
            }
            return this;
        },

        /**
         * Returns the offset height of the element
         * @param {Boolean} contentHeight (optional) true to get the height minus borders and padding
         * @return {Number} The element's height
         */
        getHeight : function(contentHeight){
            var me = this,
                dom = me.dom,
                hidden = Rs.isIE && me.isStyle('display', 'none'),
                h = MATH.max(dom.offsetHeight, hidden ? 0 : dom.clientHeight) || 0;

            h = !contentHeight ? h : h - me.getBorderWidth("tb") - me.getPadding("tb");
            return h < 0 ? 0 : h;
        },

        /**
         * Returns the offset width of the element
         * @param {Boolean} contentWidth (optional) true to get the width minus borders and padding
         * @return {Number} The element's width
         */
        getWidth : function(contentWidth){
            var me = this,
                dom = me.dom,
                hidden = Rs.isIE && me.isStyle('display', 'none'),
                w = MATH.max(dom.offsetWidth, hidden ? 0 : dom.clientWidth) || 0;
            w = !contentWidth ? w : w - me.getBorderWidth("lr") - me.getPadding("lr");
            return w < 0 ? 0 : w;
        },

        /**
         * Set the width of this Element.
         * @param {Mixed} width The new width. This may be one of:<div class="mdetail-params"><ul>
         * <li>A Number specifying the new width in this Element's {@link #defaultUnit}s (by default, pixels).</li>
         * <li>A String used to set the CSS width style. Animation may <b>not</b> be used.
         * </ul></div>
         * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Rs.Element} this
         */
        setWidth : function(width, animate){
            var me = this;
            width = me.adjustWidth(width);
            !animate || !me.anim ?
                me.dom.style.width = me.addUnits(width) :
                me.anim({width : {to : width}}, me.preanim(arguments, 1));
            return me;
        },

        /**
         * Set the height of this Element.
         * <pre><code>
// change the height to 200px and animate with default configuration
Rs.fly('elementId').setHeight(200, true);

// change the height to 150px and animate with a custom configuration
Rs.fly('elId').setHeight(150, {
    duration : .5, // animation will have a duration of .5 seconds
    // will change the content to "finished"
    callback: function(){ this.{@link #update}("finished"); }
});
         * </code></pre>
         * @param {Mixed} height The new height. This may be one of:<div class="mdetail-params"><ul>
         * <li>A Number specifying the new height in this Element's {@link #defaultUnit}s (by default, pixels.)</li>
         * <li>A String used to set the CSS height style. Animation may <b>not</b> be used.</li>
         * </ul></div>
         * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Rs.Element} this
         */
         setHeight : function(height, animate){
            var me = this;
            height = me.adjustHeight(height);
            !animate || !me.anim ?
                me.dom.style.height = me.addUnits(height) :
                me.anim({height : {to : height}}, me.preanim(arguments, 1));
            return me;
        },

        /**
         * Gets the width of the border(s) for the specified side(s)
         * @param {String} side Can be t, l, r, b or any combination of those to add multiple values. For example,
         * passing <tt>'lr'</tt> would get the border <b><u>l</u></b>eft width + the border <b><u>r</u></b>ight width.
         * @return {Number} The width of the sides passed added together
         */
        getBorderWidth : function(side){
            return this.addStyles(side, borders);
        },

        /**
         * Gets the width of the padding(s) for the specified side(s)
         * @param {String} side Can be t, l, r, b or any combination of those to add multiple values. For example,
         * passing <tt>'lr'</tt> would get the padding <b><u>l</u></b>eft + the padding <b><u>r</u></b>ight.
         * @return {Number} The padding of the sides passed added together
         */
        getPadding : function(side){
            return this.addStyles(side, paddings);
        },

        /**
         *  Store the current overflow setting and clip overflow on the element - use <tt>{@link #unclip}</tt> to remove
         * @return {Rs.Element} this
         */
        clip : function(){
            var me = this,
                dom = me.dom;

            if(!data(dom, ISCLIPPED)){
                data(dom, ISCLIPPED, true);
                data(dom, ORIGINALCLIP, {
                    o: me.getStyle(OVERFLOW),
                    x: me.getStyle(OVERFLOWX),
                    y: me.getStyle(OVERFLOWY)
                });
                me.setStyle(OVERFLOW, HIDDEN);
                me.setStyle(OVERFLOWX, HIDDEN);
                me.setStyle(OVERFLOWY, HIDDEN);
            }
            return me;
        },

        /**
         *  Return clipping (overflow) to original clipping before <tt>{@link #clip}</tt> was called
         * @return {Rs.Element} this
         */
        unclip : function(){
            var me = this,
                dom = me.dom;

            if(data(dom, ISCLIPPED)){
                data(dom, ISCLIPPED, false);
                var o = data(dom, ORIGINALCLIP);
                if(o.o){
                    me.setStyle(OVERFLOW, o.o);
                }
                if(o.x){
                    me.setStyle(OVERFLOWX, o.x);
                }
                if(o.y){
                    me.setStyle(OVERFLOWY, o.y);
                }
            }
            return me;
        },

        // private
        addStyles : function(sides, styles){
            var val = 0,
                m = sides.match(/\w/g),
                s;
            for (var i=0, len=m.length; i<len; i++) {
                s = m[i] && parseInt(this.getStyle(styles[m[i]]), 10);
                if (s) {
                    val += MATH.abs(s);
                }
            }
            return val;
        },

        margins : margins
    }
}()
);
/**
 * @class Rs.Element
 */
(function(){
var D = Rs.lib.Dom,
        LEFT = "left",
        RIGHT = "right",
        TOP = "top",
        BOTTOM = "bottom",
        POSITION = "position",
        STATIC = "static",
        RELATIVE = "relative",
        AUTO = "auto",
        ZINDEX = "z-index";

Rs.Element.addMethods({
	/**
      * Gets the current X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Number} The X position of the element
      */
    getX : function(){
        return D.getX(this.dom);
    },

    /**
      * Gets the current Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Number} The Y position of the element
      */
    getY : function(){
        return D.getY(this.dom);
    },

    /**
      * Gets the current position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Array} The XY position of the element
      */
    getXY : function(){
        return D.getXY(this.dom);
    },

    /**
      * Returns the offsets of this element from the passed element. Both element must be part of the DOM tree and not have display:none to have page coordinates.
      * @param {Mixed} element The element to get the offsets from.
      * @return {Array} The XY page offsets (e.g. [100, -200])
      */
    getOffsetsTo : function(el){
        var o = this.getXY(),
        	e = Rs.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    /**
     * Sets the X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} The X position of the element
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Rs.Element} this
     */
    setX : function(x, animate){	    
	    return this.setXY([x, this.getY()], this.animTest(arguments, animate, 1));
    },

    /**
     * Sets the Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} The Y position of the element
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Rs.Element} this
     */
    setY : function(y, animate){	    
	    return this.setXY([this.getX(), y], this.animTest(arguments, animate, 1));
    },

    /**
     * Sets the element's left position directly using CSS style (instead of {@link #setX}).
     * @param {String} left The left CSS property value
     * @return {Rs.Element} this
     */
    setLeft : function(left){
        this.setStyle(LEFT, this.addUnits(left));
        return this;
    },

    /**
     * Sets the element's top position directly using CSS style (instead of {@link #setY}).
     * @param {String} top The top CSS property value
     * @return {Rs.Element} this
     */
    setTop : function(top){
        this.setStyle(TOP, this.addUnits(top));
        return this;
    },

    /**
     * Sets the element's CSS right style.
     * @param {String} right The right CSS property value
     * @return {Rs.Element} this
     */
    setRight : function(right){
        this.setStyle(RIGHT, this.addUnits(right));
        return this;
    },

    /**
     * Sets the element's CSS bottom style.
     * @param {String} bottom The bottom CSS property value
     * @return {Rs.Element} this
     */
    setBottom : function(bottom){
        this.setStyle(BOTTOM, this.addUnits(bottom));
        return this;
    },

    /**
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Array} pos Contains X & Y [x, y] values for new position (coordinates are page-based)
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Rs.Element} this
     */
    setXY : function(pos, animate){
	    var me = this;
        if(!animate || !me.anim){
            D.setXY(me.dom, pos);
        }else{
            me.anim({points: {to: pos}}, me.preanim(arguments, 1), 'motion');
        }
        return me;
    },

    /**
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} x X value for new position (coordinates are page-based)
     * @param {Number} y Y value for new position (coordinates are page-based)
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Rs.Element} this
     */
    setLocation : function(x, y, animate){
        return this.setXY([x, y], this.animTest(arguments, animate, 2));
    },

    /**
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} x X value for new position (coordinates are page-based)
     * @param {Number} y Y value for new position (coordinates are page-based)
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Rs.Element} this
     */
    moveTo : function(x, y, animate){
        return this.setXY([x, y], this.animTest(arguments, animate, 2));        
    },    
    
    /**
     * Gets the left X coordinate
     * @param {Boolean} local True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getLeft : function(local){
	    return !local ? this.getX() : parseInt(this.getStyle(LEFT), 10) || 0;
    },

    /**
     * Gets the right X coordinate of the element (element X position + element width)
     * @param {Boolean} local True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getRight : function(local){
	    var me = this;
	    return !local ? me.getX() + me.getWidth() : (me.getLeft(true) + me.getWidth()) || 0;
    },

    /**
     * Gets the top Y coordinate
     * @param {Boolean} local True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getTop : function(local) {
	    return !local ? this.getY() : parseInt(this.getStyle(TOP), 10) || 0;
    },

    /**
     * Gets the bottom Y coordinate of the element (element Y position + element height)
     * @param {Boolean} local True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getBottom : function(local){
	    var me = this;
	    return !local ? me.getY() + me.getHeight() : (me.getTop(true) + me.getHeight()) || 0;
    },

    /**
    * Initializes positioning on this element. If a desired position is not passed, it will make the
    * the element positioned relative IF it is not already positioned.
    * @param {String} pos (optional) Positioning to use "relative", "absolute" or "fixed"
    * @param {Number} zIndex (optional) The zIndex to apply
    * @param {Number} x (optional) Set the page X position
    * @param {Number} y (optional) Set the page Y position
    */
    position : function(pos, zIndex, x, y){
	    var me = this;
	    
        if(!pos && me.isStyle(POSITION, STATIC)){           
            me.setStyle(POSITION, RELATIVE);           
        } else if(pos) {
            me.setStyle(POSITION, pos);
        }
        if(zIndex){
            me.setStyle(ZINDEX, zIndex);
        }
        if(x || y) me.setXY([x || false, y || false]);
    },

    /**
    * Clear positioning back to the default when the document was loaded
    * @param {String} value (optional) The value to use for the left,right,top,bottom, defaults to '' (empty string). You could use 'auto'.
    * @return {Rs.Element} this
     */
    clearPositioning : function(value){
        value = value || '';
        this.setStyle({
            left : value,
            right : value,
            top : value,
            bottom : value,
            "z-index" : "",
            position : STATIC
        });
        return this;
    },

    /**
    * Gets an object with all CSS positioning properties. Useful along with setPostioning to get
    * snapshot before performing an update and then restoring the element.
    * @return {Object}
    */
    getPositioning : function(){
        var l = this.getStyle(LEFT);
        var t = this.getStyle(TOP);
        return {
            "position" : this.getStyle(POSITION),
            "left" : l,
            "right" : l ? "" : this.getStyle(RIGHT),
            "top" : t,
            "bottom" : t ? "" : this.getStyle(BOTTOM),
            "z-index" : this.getStyle(ZINDEX)
        };
    },
    
    /**
    * Set positioning with an object returned by getPositioning().
    * @param {Object} posCfg
    * @return {Rs.Element} this
     */
    setPositioning : function(pc){
	    var me = this,
	    	style = me.dom.style;
	    	
        me.setStyle(pc);
        
        if(pc.right == AUTO){
            style.right = "";
        }
        if(pc.bottom == AUTO){
            style.bottom = "";
        }
        
        return me;
    },    
	
    /**
     * Translates the passed page coordinates into left/top css values for this element
     * @param {Number/Array} x The page x or an array containing [x, y]
     * @param {Number} y (optional) The page y, required if x is not an array
     * @return {Object} An object with left and top properties. e.g. {left: (value), top: (value)}
     */
    translatePoints : function(x, y){        	     
	    y = isNaN(x[1]) ? y : x[1];
        x = isNaN(x[0]) ? x : x[0];
        var me = this,
        	relative = me.isStyle(POSITION, RELATIVE),
        	o = me.getXY(),
        	l = parseInt(me.getStyle(LEFT), 10),
        	t = parseInt(me.getStyle(TOP), 10);
        
        l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
        t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);        

        return {left: (x - o[0] + l), top: (y - o[1] + t)}; 
    },
    
    animTest : function(args, animate, i) {
        return !!animate && this.preanim ? this.preanim(args, i) : false;
    }
});
})();
/**
 * @class Rs.Element
 */
Rs.Element.addMethods({
    /**
     * Returns true if this element is scrollable.
     * @return {Boolean}
     */
    isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    /**
     * Scrolls this element the specified scroll point. It does NOT do bounds checking so if you scroll to a weird value it will try to do it. For auto bounds checking, use scroll().
     * @param {String} side Either "left" for scrollLeft values or "top" for scrollTop values.
     * @param {Number} value The new scroll value.
     * @return {Element} this
     */
    scrollTo : function(side, value){
        this.dom["scroll" + (/top/i.test(side) ? "Top" : "Left")] = value;
        return this;
    },

    /**
     * Returns the current scroll position of the element.
     * @return {Object} An object containing the scroll position in the format {left: (scrollLeft), top: (scrollTop)}
     */
    getScroll : function(){
        var d = this.dom, 
            doc = document,
            body = doc.body,
            docElement = doc.documentElement,
            l,
            t,
            ret;

        if(d == doc || d == body){
            if(Rs.isIE && Rs.isStrict){
                l = docElement.scrollLeft; 
                t = docElement.scrollTop;
            }else{
                l = window.pageXOffset;
                t = window.pageYOffset;
            }
            ret = {left: l || (body ? body.scrollLeft : 0), top: t || (body ? body.scrollTop : 0)};
        }else{
            ret = {left: d.scrollLeft, top: d.scrollTop};
        }
        return ret;
    }
});
/**
 * @class Rs.Element
 */
/**
 * Visibility mode constant for use with {@link #setVisibilityMode}. Use visibility to hide element
 * @static
 * @type Number
 */
Rs.Element.VISIBILITY = 1;
/**
 * Visibility mode constant for use with {@link #setVisibilityMode}. Use display to hide element
 * @static
 * @type Number
 */
Rs.Element.DISPLAY = 2;

Rs.Element.addMethods(function(){
    var VISIBILITY = "visibility",
        DISPLAY = "display",
        HIDDEN = "hidden",
        NONE = "none",      
        ORIGINALDISPLAY = 'originalDisplay',
        VISMODE = 'visibilityMode',
        ELDISPLAY = Rs.Element.DISPLAY,
        data = Rs.Element.data,
        getDisplay = function(dom){
            var d = data(dom, ORIGINALDISPLAY);
            if(d === undefined){
                data(dom, ORIGINALDISPLAY, d = '');
            }
            return d;
        },
        getVisMode = function(dom){
            var m = data(dom, VISMODE);
            if(m === undefined){
                data(dom, VISMODE, m = 1)
            }
            return m;
        };
    
    return {
        /**
         * The element's default display mode  (defaults to "")
         * @type String
         */
        originalDisplay : "",
        visibilityMode : 1,
        
        /**
         * Sets the element's visibility mode. When setVisible() is called it
         * will use this to determine whether to set the visibility or the display property.
         * @param {Number} visMode Rs.Element.VISIBILITY or Rs.Element.DISPLAY
         * @return {Rs.Element} this
         */
        setVisibilityMode : function(visMode){  
            data(this.dom, VISMODE, visMode);
            return this;
        },
        
        /**
         * Perform custom animation on this element.
         * <div><ul class="mdetail-params">
         * <li><u>Animation Properties</u></li>
         * 
         * <p>The Animation Control Object enables gradual transitions for any member of an
         * element's style object that takes a numeric value including but not limited to
         * these properties:</p><div><ul class="mdetail-params">
         * <li><tt>bottom, top, left, right</tt></li>
         * <li><tt>height, width</tt></li>
         * <li><tt>margin, padding</tt></li>
         * <li><tt>borderWidth</tt></li>
         * <li><tt>opacity</tt></li>
         * <li><tt>fontSize</tt></li>
         * <li><tt>lineHeight</tt></li>
         * </ul></div>
         * 
         * 
         * <li><u>Animation Property Attributes</u></li>
         * 
         * <p>Each Animation Property is a config object with optional properties:</p>
         * <div><ul class="mdetail-params">
         * <li><tt>by</tt>*  : relative change - start at current value, change by this value</li>
         * <li><tt>from</tt> : ignore current value, start from this value</li>
         * <li><tt>to</tt>*  : start at current value, go to this value</li>
         * <li><tt>unit</tt> : any allowable unit specification</li>
         * <p>* do not specify both <tt>to</tt> and <tt>by</tt> for an animation property</p>
         * </ul></div>
         * 
         * <li><u>Animation Types</u></li>
         * 
         * <p>The supported animation types:</p><div><ul class="mdetail-params">
         * <li><tt>'run'</tt> : Default
         * <pre><code>
var el = Rs.get('complexEl');
el.animate(
    // animation control object
    {
        borderWidth: {to: 3, from: 0},
        opacity: {to: .3, from: 1},
        height: {to: 50, from: el.getHeight()},
        width: {to: 300, from: el.getWidth()},
        top  : {by: - 100, unit: 'px'},
    },
    0.35,      // animation duration
    null,      // callback
    'easeOut', // easing method
    'run'      // animation type ('run','color','motion','scroll')    
);
         * </code></pre>
         * </li>
         * <li><tt>'color'</tt>
         * <p>Animates transition of background, text, or border colors.</p>
         * <pre><code>
el.animate(
    // animation control object
    {
        color: { to: '#06e' },
        backgroundColor: { to: '#e06' }
    },
    0.35,      // animation duration
    null,      // callback
    'easeOut', // easing method
    'color'    // animation type ('run','color','motion','scroll')    
);
         * </code></pre> 
         * </li>
         * 
         * <li><tt>'motion'</tt>
         * <p>Animates the motion of an element to/from specific points using optional bezier
         * way points during transit.</p>
         * <pre><code>
el.animate(
    // animation control object
    {
        borderWidth: {to: 3, from: 0},
        opacity: {to: .3, from: 1},
        height: {to: 50, from: el.getHeight()},
        width: {to: 300, from: el.getWidth()},
        top  : {by: - 100, unit: 'px'},
        points: {
            to: [50, 100],  // go to this point
            control: [      // optional bezier way points
                [ 600, 800],
                [-100, 200]
            ]
        }
    },
    3000,      // animation duration (milliseconds!)
    null,      // callback
    'easeOut', // easing method
    'motion'   // animation type ('run','color','motion','scroll')    
);
         * </code></pre> 
         * </li>
         * <li><tt>'scroll'</tt>
         * <p>Animate horizontal or vertical scrolling of an overflowing page element.</p>
         * <pre><code>
el.animate(
    // animation control object
    {
        scroll: {to: [400, 300]}
    },
    0.35,      // animation duration
    null,      // callback
    'easeOut', // easing method
    'scroll'   // animation type ('run','color','motion','scroll')    
);
         * </code></pre> 
         * </li>
         * </ul></div>
         * 
         * </ul></div>
         * 
         * @param {Object} args The animation control args
         * @param {Float} duration (optional) How long the animation lasts in seconds (defaults to <tt>.35</tt>)
         * @param {Function} onComplete (optional) Function to call when animation completes
         * @param {String} easing (optional) {@link Rs.Fx#easing} method to use (defaults to <tt>'easeOut'</tt>)
         * @param {String} animType (optional) <tt>'run'</tt> is the default. Can also be <tt>'color'</tt>,
         * <tt>'motion'</tt>, or <tt>'scroll'</tt>
         * @return {Rs.Element} this
         */
        animate : function(args, duration, onComplete, easing, animType){       
            this.anim(args, {duration: duration, callback: onComplete, easing: easing}, animType);
            return this;
        },
    
        /*
         * @private Internal animation call
         */
        anim : function(args, opt, animType, defaultDur, defaultEase, cb){
            animType = animType || 'run';
            opt = opt || {};
            var me = this,              
                anim = Rs.lib.Anim[animType](
                    me.dom, 
                    args,
                    (opt.duration || defaultDur) || .35,
                    (opt.easing || defaultEase) || 'easeOut',
                    function(){
                        if(cb) cb.call(me);
                        if(opt.callback) opt.callback.call(opt.scope || me, me, opt);
                    },
                    me
                );
            opt.anim = anim;
            return anim;
        },
    
        // private legacy anim prep
        preanim : function(a, i){
            return !a[i] ? false : (Rs.isObject(a[i]) ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
        },
        
        /**
         * Checks whether the element is currently visible using both visibility and display properties.         
         * @return {Boolean} True if the element is currently visible, else false
         */
        isVisible : function() {
            return !this.isStyle(VISIBILITY, HIDDEN) && !this.isStyle(DISPLAY, NONE);
        },
        
        /**
         * Sets the visibility of the element (see details). If the visibilityMode is set to Element.DISPLAY, it will use
         * the display property to hide the element, otherwise it uses visibility. The default is to hide and show using the visibility property.
         * @param {Boolean} visible Whether the element is visible
         * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
         * @return {Rs.Element} this
         */
         setVisible : function(visible, animate){
            var me = this,
                dom = me.dom,
                isDisplay = getVisMode(this.dom) == ELDISPLAY;
                
            if (!animate || !me.anim) {
                if(isDisplay){
                    me.setDisplayed(visible);
                }else{
                    me.fixDisplay();
                    dom.style.visibility = visible ? "visible" : HIDDEN;
                }
            }else{
                // closure for composites            
                if(visible){
                    me.setOpacity(.01);
                    me.setVisible(true);
                }
                me.anim({opacity: { to: (visible?1:0) }},
                        me.preanim(arguments, 1),
                        null,
                        .35,
                        'easeIn',
                        function(){
                             if(!visible){
                                 dom.style[isDisplay ? DISPLAY : VISIBILITY] = (isDisplay) ? NONE : HIDDEN;                     
                                 Rs.fly(dom).setOpacity(1);
                             }
                        });
            }
            return me;
        },
    
        /**
         * Toggles the element's visibility or display, depending on visibility mode.
         * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
         * @return {Rs.Element} this
         */
        toggle : function(animate){
            var me = this;
            me.setVisible(!me.isVisible(), me.preanim(arguments, 0));
            return me;
        },
    
        /**
         * Sets the CSS display property. Uses originalDisplay if the specified value is a boolean true.
         * @param {Mixed} value Boolean value to display the element using its default display, or a string to set the display directly.
         * @return {Rs.Element} this
         */
        setDisplayed : function(value) {            
            if(typeof value == "boolean"){
               value = value ? getDisplay(this.dom) : NONE;
            }
            this.setStyle(DISPLAY, value);
            return this;
        },
        
        // private
        fixDisplay : function(){
            var me = this;
            if(me.isStyle(DISPLAY, NONE)){
                me.setStyle(VISIBILITY, HIDDEN);
                me.setStyle(DISPLAY, getDisplay(this.dom)); // first try reverting to default
                if(me.isStyle(DISPLAY, NONE)){ // if that fails, default to block
                    me.setStyle(DISPLAY, "block");
                }
            }
        },
    
        /**
         * Hide this element - Uses display mode to determine whether to use "display" or "visibility". See {@link #setVisible}.
         * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Rs.Element} this
         */
        hide : function(animate){
            this.setVisible(false, this.preanim(arguments, 0));
            return this;
        },
    
        /**
        * Show this element - Uses display mode to determine whether to use "display" or "visibility". See {@link #setVisible}.
        * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Rs.Element} this
         */
        show : function(animate){
            this.setVisible(true, this.preanim(arguments, 0));
            return this;
        }
    }
}());

(function(){
    // contants
    var NULL = null,
        UNDEFINED = undefined,
        TRUE = true,
        FALSE = false,
        SETX = "setX",
        SETY = "setY",
        SETXY = "setXY",
        LEFT = "left",
        BOTTOM = "bottom",
        TOP = "top",
        RIGHT = "right",
        HEIGHT = "height",
        WIDTH = "width",
        POINTS = "points",
        HIDDEN = "hidden",
        ABSOLUTE = "absolute",
        VISIBLE = "visible",
        MOTION = "motion",
        POSITION = "position",
        EASEOUT = "easeOut",
        /*
         * Use a light flyweight here since we are using so many callbacks and are always assured a DOM element
         */
        flyEl = new Rs.Element.Flyweight(),
        queues = {},
        getObject = function(o){
            return o || {};
        },
        fly = function(dom){
            flyEl.dom = dom;
            flyEl.id = Rs.id(dom);
            return flyEl;
        },
        /*
         * Queueing now stored outside of the element due to closure issues
         */
        getQueue = function(id){
            if(!queues[id]){
                queues[id] = [];
            }
            return queues[id];
        },
        setQueue = function(id, value){
            queues[id] = value;
        };
        
//Notifies Element that fx methods are available
Rs.enableFx = TRUE;

/**
 * @class Rs.Fx
 * <p>A class to provide basic animation and visual effects support.  <b>Note:</b> This class is automatically applied
 * to the {@link Rs.Element} interface when included, so all effects calls should be performed via {@link Rs.Element}.
 * Conversely, since the effects are not actually defined in {@link Rs.Element}, Rs.Fx <b>must</b> be
 * {@link Ext#enableFx included} in order for the Element effects to work.</p><br/>
 * 
 * <p><b><u>Method Chaining</u></b></p>
 * <p>It is important to note that although the Fx methods and many non-Fx Element methods support "method chaining" in that
 * they return the Element object itself as the method return value, it is not always possible to mix the two in a single
 * method chain.  The Fx methods use an internal effects queue so that each effect can be properly timed and sequenced.
 * Non-Fx methods, on the other hand, have no such internal queueing and will always execute immediately.  For this reason,
 * while it may be possible to mix certain Fx and non-Fx method calls in a single chain, it may not always provide the
 * expected results and should be done with care.  Also see <tt>{@link #callback}</tt>.</p><br/>
 *
 * <p><b><u>Anchor Options for Motion Effects</u></b></p>
 * <p>Motion effects support 8-way anchoring, meaning that you can choose one of 8 different anchor points on the Element
 * that will serve as either the start or end point of the animation.  Following are all of the supported anchor positions:</p>
<pre>
Value  Description
-----  -----------------------------
tl     The top left corner
t      The center of the top edge
tr     The top right corner
l      The center of the left edge
r      The center of the right edge
bl     The bottom left corner
b      The center of the bottom edge
br     The bottom right corner
</pre>
 * <b>Note</b>: some Fx methods accept specific custom config parameters.  The options shown in the Config Options
 * section below are common options that can be passed to any Fx method unless otherwise noted.</b>
 * 
 * @cfg {Function} callback A function called when the effect is finished.  Note that effects are queued internally by the
 * Fx class, so a callback is not required to specify another effect -- effects can simply be chained together
 * and called in sequence (see note for <b><u>Method Chaining</u></b> above), for example:<pre><code>
 * el.slideIn().highlight();
 * </code></pre>
 * The callback is intended for any additional code that should run once a particular effect has completed. The Element
 * being operated upon is passed as the first parameter.
 * 
 * @cfg {Object} scope The scope (<code>this</code> reference) in which the <tt>{@link #callback}</tt> function is executed. Defaults to the browser window.
 * 
 * @cfg {String} easing A valid Rs.lib.Easing value for the effect:</p><div class="mdetail-params"><ul>
 * <li><b><tt>backBoth</tt></b></li>
 * <li><b><tt>backIn</tt></b></li>
 * <li><b><tt>backOut</tt></b></li>
 * <li><b><tt>bounceBoth</tt></b></li>
 * <li><b><tt>bounceIn</tt></b></li>
 * <li><b><tt>bounceOut</tt></b></li>
 * <li><b><tt>easeBoth</tt></b></li>
 * <li><b><tt>easeBothStrong</tt></b></li>
 * <li><b><tt>easeIn</tt></b></li>
 * <li><b><tt>easeInStrong</tt></b></li>
 * <li><b><tt>easeNone</tt></b></li>
 * <li><b><tt>easeOut</tt></b></li>
 * <li><b><tt>easeOutStrong</tt></b></li>
 * <li><b><tt>elasticBoth</tt></b></li>
 * <li><b><tt>elasticIn</tt></b></li>
 * <li><b><tt>elasticOut</tt></b></li>
 * </ul></div>
 *
 * @cfg {String} afterCls A css class to apply after the effect
 * @cfg {Number} duration The length of time (in seconds) that the effect should last
 * 
 * @cfg {Number} endOpacity Only applicable for {@link #fadeIn} or {@link #fadeOut}, a number between
 * <tt>0</tt> and <tt>1</tt> inclusive to configure the ending opacity value.
 *  
 * @cfg {Boolean} remove Whether the Element should be removed from the DOM and destroyed after the effect finishes
 * @cfg {Boolean} useDisplay Whether to use the <i>display</i> CSS property instead of <i>visibility</i> when hiding Elements (only applies to 
 * effects that end with the element being visually hidden, ignored otherwise)
 * @cfg {String/Object/Function} afterStyle A style specification string, e.g. <tt>"width:100px"</tt>, or an object
 * in the form <tt>{width:"100px"}</tt>, or a function which returns such a specification that will be applied to the
 * Element after the effect finishes.
 * @cfg {Boolean} block Whether the effect should block other effects from queueing while it runs
 * @cfg {Boolean} concurrent Whether to allow subsequently-queued effects to run at the same time as the current effect, or to ensure that they run in sequence
 * @cfg {Boolean} stopFx Whether preceding effects should be stopped and removed before running current effect (only applies to non blocking effects)
 */
Rs.Fx = {
    
    // private - calls the function taking arguments from the argHash based on the key.  Returns the return value of the function.
    //           this is useful for replacing switch statements (for example).
    switchStatements : function(key, fn, argHash){
        return fn.apply(this, argHash[key]);
    },
    
    /**
     * Slides the element into view.  An anchor point can be optionally passed to set the point of
     * origin for the slide effect.  This function automatically handles wrapping the element with
     * a fixed-size container if needed.  See the Fx class overview for valid anchor point options.
     * Usage:
     *<pre><code>
// default: slide the element in from the top
el.slideIn();

// custom: slide the element in from the right with a 2-second duration
el.slideIn('r', { duration: 2 });

// common config options shown with default values
el.slideIn('t', {
    easing: 'easeOut',
    duration: .5
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to top: 't')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Rs.Element} The Element
     */
    slideIn : function(anchor, o){ 
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            xy,
            r,
            b,              
            wrap,               
            after,
            st,
            args, 
            pt,
            bw,
            bh;
            
        anchor = anchor || "t";

        me.queueFx(o, function(){            
            xy = fly(dom).getXY();
            // fix display to visibility
            fly(dom).fixDisplay();            
            
            // restore values after effect
            r = fly(dom).getFxRestore();      
            b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            b.right = b.x + b.width;
            b.bottom = b.y + b.height;
            
            // fixed size for slide
            fly(dom).setWidth(b.width).setHeight(b.height);            
            
            // wrap if needed
            wrap = fly(dom).fxWrap(r.pos, o, HIDDEN);
            
            st.visibility = VISIBLE;
            st.position = ABSOLUTE;
            
            // clear out temp styles after slide and unwrap
            function after(){
                 fly(dom).fxUnwrap(wrap, r.pos, o);
                 st.width = r.width;
                 st.height = r.height;
                 fly(dom).afterFx(o);
            }
            
            // time to calculate the positions        
            pt = {to: [b.x, b.y]}; 
            bw = {to: b.width};
            bh = {to: b.height};
                
            function argCalc(wrap, style, ww, wh, sXY, sXYval, s1, s2, w, h, p){                    
                var ret = {};
                fly(wrap).setWidth(ww).setHeight(wh);
                if(fly(wrap)[sXY]){
                    fly(wrap)[sXY](sXYval);                  
                }
                style[s1] = style[s2] = "0";                    
                if(w){
                    ret.width = w
                };
                if(h){
                    ret.height = h;
                }
                if(p){
                    ret.points = p;
                }
                return ret;
            };

            args = fly(dom).switchStatements(anchor.toLowerCase(), argCalc, {
                    t  : [wrap, st, b.width, 0, NULL, NULL, LEFT, BOTTOM, NULL, bh, NULL],
                    l  : [wrap, st, 0, b.height, NULL, NULL, RIGHT, TOP, bw, NULL, NULL],
                    r  : [wrap, st, b.width, b.height, SETX, b.right, LEFT, TOP, NULL, NULL, pt],
                    b  : [wrap, st, b.width, b.height, SETY, b.bottom, LEFT, TOP, NULL, bh, pt],
                    tl : [wrap, st, 0, 0, NULL, NULL, RIGHT, BOTTOM, bw, bh, pt],
                    bl : [wrap, st, 0, 0, SETY, b.y + b.height, RIGHT, TOP, bw, bh, pt],
                    br : [wrap, st, 0, 0, SETXY, [b.right, b.bottom], LEFT, TOP, bw, bh, pt],
                    tr : [wrap, st, 0, 0, SETX, b.x + b.width, LEFT, BOTTOM, bw, bh, pt]
                });
            
            st.visibility = VISIBLE;
            fly(wrap).show();

            arguments.callee.anim = fly(wrap).fxanim(args,
                o,
                MOTION,
                .5,
                EASEOUT, 
                after);
        });
        return me;
    },
    
    /**
     * Slides the element out of view.  An anchor point can be optionally passed to set the end point
     * for the slide effect.  When the effect is completed, the element will be hidden (visibility = 
     * 'hidden') but block elements will still take up space in the document.  The element must be removed
     * from the DOM using the 'remove' config option if desired.  This function automatically handles 
     * wrapping the element with a fixed-size container if needed.  See the Fx class overview for valid anchor point options.
     * Usage:
     *<pre><code>
// default: slide the element out to the top
el.slideOut();

// custom: slide the element out to the right with a 2-second duration
el.slideOut('r', { duration: 2 });

// common config options shown with default values
el.slideOut('t', {
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to top: 't')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Rs.Element} The Element
     */
    slideOut : function(anchor, o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            xy = me.getXY(),
            wrap,
            r,
            b,
            a,
            zero = {to: 0}; 
                    
        anchor = anchor || "t";

        me.queueFx(o, function(){
            
            // restore values after effect
            r = fly(dom).getFxRestore(); 
            b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            b.right = b.x + b.width;
            b.bottom = b.y + b.height;
                
            // fixed size for slide   
            fly(dom).setWidth(b.width).setHeight(b.height);

            // wrap if needed
            wrap = fly(dom).fxWrap(r.pos, o, VISIBLE);
                
            st.visibility = VISIBLE;
            st.position = ABSOLUTE;
            fly(wrap).setWidth(b.width).setHeight(b.height);            

            function after(){
                o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();                
                fly(dom).fxUnwrap(wrap, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                fly(dom).afterFx(o);
            }            
            
            function argCalc(style, s1, s2, p1, v1, p2, v2, p3, v3){                    
                var ret = {};
                
                style[s1] = style[s2] = "0";
                ret[p1] = v1;               
                if(p2){
                    ret[p2] = v2;               
                }
                if(p3){
                    ret[p3] = v3;
                }
                
                return ret;
            };
            
            a = fly(dom).switchStatements(anchor.toLowerCase(), argCalc, {
                t  : [st, LEFT, BOTTOM, HEIGHT, zero],
                l  : [st, RIGHT, TOP, WIDTH, zero],
                r  : [st, LEFT, TOP, WIDTH, zero, POINTS, {to : [b.right, b.y]}],
                b  : [st, LEFT, TOP, HEIGHT, zero, POINTS, {to : [b.x, b.bottom]}],
                tl : [st, RIGHT, BOTTOM, WIDTH, zero, HEIGHT, zero],
                bl : [st, RIGHT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.x, b.bottom]}],
                br : [st, LEFT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.x + b.width, b.bottom]}],
                tr : [st, LEFT, BOTTOM, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.right, b.y]}]
            });
            
            arguments.callee.anim = fly(wrap).fxanim(a,
                o,
                MOTION,
                .5,
                EASEOUT, 
                after);
        });
        return me;
    },

    /**
     * Fades the element out while slowly expanding it in all directions.  When the effect is completed, the 
     * element will be hidden (visibility = 'hidden') but block elements will still take up space in the document. 
     * The element must be removed from the DOM using the 'remove' config option if desired.
     * Usage:
     *<pre><code>
// default
el.puff();

// common config options shown with default values
el.puff({
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Rs.Element} The Element
     */
    puff : function(o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            width,
            height,
            r;

        me.queueFx(o, function(){
            width = fly(dom).getWidth();
            height = fly(dom).getHeight();
            fly(dom).clearOpacity();
            fly(dom).show();

            // restore values after effect
            r = fly(dom).getFxRestore();                   
            
            function after(){
                o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();                  
                fly(dom).clearOpacity();  
                fly(dom).setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                st.fontSize = '';
                fly(dom).afterFx(o);
            }   

            arguments.callee.anim = fly(dom).fxanim({
                    width : {to : fly(dom).adjustWidth(width * 2)},
                    height : {to : fly(dom).adjustHeight(height * 2)},
                    points : {by : [-width * .5, -height * .5]},
                    opacity : {to : 0},
                    fontSize: {to : 200, unit: "%"}
                },
                o,
                MOTION,
                .5,
                EASEOUT,
                 after);
        });
        return me;
    },

    /**
     * Blinks the element as if it was clicked and then collapses on its center (similar to switching off a television).
     * When the effect is completed, the element will be hidden (visibility = 'hidden') but block elements will still 
     * take up space in the document. The element must be removed from the DOM using the 'remove' config option if desired.
     * Usage:
     *<pre><code>
// default
el.switchOff();

// all config options shown with default values
el.switchOff({
    easing: 'easeIn',
    duration: .3,
    remove: false,
    useDisplay: false
});
</code></pre>
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Rs.Element} The Element
     */
    switchOff : function(o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            r;

        me.queueFx(o, function(){
            fly(dom).clearOpacity();
            fly(dom).clip();

            // restore values after effect
            r = fly(dom).getFxRestore();
                
            function after(){
                o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();  
                fly(dom).clearOpacity();
                fly(dom).setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;   
                fly(dom).afterFx(o);
            };

            fly(dom).fxanim({opacity : {to : 0.3}}, 
                NULL, 
                NULL, 
                .1, 
                NULL, 
                function(){                                 
                    fly(dom).clearOpacity();
                        (function(){                            
                            fly(dom).fxanim({
                                height : {to : 1},
                                points : {by : [0, fly(dom).getHeight() * .5]}
                            }, 
                            o, 
                            MOTION, 
                            0.3, 
                            'easeIn', 
                            after);
                        }).defer(100);
                });
        });
        return me;
    },

    /**
     * Highlights the Element by setting a color (applies to the background-color by default, but can be
     * changed using the "attr" config option) and then fading back to the original color. If no original
     * color is available, you should provide the "endColor" config option which will be cleared after the animation.
     * Usage:
<pre><code>
// default: highlight background to yellow
el.highlight();

// custom: highlight foreground text to blue for 2 seconds
el.highlight("0000ff", { attr: 'color', duration: 2 });

// common config options shown with default values
el.highlight("ffff9c", {
    attr: "background-color", //can be any valid CSS property (attribute) that supports a color value
    endColor: (current color) or "ffffff",
    easing: 'easeIn',
    duration: 1
});
</code></pre>
     * @param {String} color (optional) The highlight color. Should be a 6 char hex color without the leading # (defaults to yellow: 'ffff9c')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Rs.Element} The Element
     */ 
    highlight : function(color, o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            attr = o.attr || "backgroundColor",
            a = {},
            restore;

        me.queueFx(o, function(){
            fly(dom).clearOpacity();
            fly(dom).show();

            function after(){
                dom.style[attr] = restore;
                fly(dom).afterFx(o);
            }            
            restore = dom.style[attr];
            a[attr] = {from: color || "ffff9c", to: o.endColor || fly(dom).getColor(attr) || "ffffff"};
            arguments.callee.anim = fly(dom).fxanim(a,
                o,
                'color',
                1,
                'easeIn', 
                after);
        });
        return me;
    },

   /**
    * Shows a ripple of exploding, attenuating borders to draw attention to an Element.
    * Usage:
<pre><code>
// default: a single light blue ripple
el.frame();

// custom: 3 red ripples lasting 3 seconds total
el.frame("ff0000", 3, { duration: 3 });

// common config options shown with default values
el.frame("C3DAF9", 1, {
    duration: 1 //duration of each individual ripple.
    // Note: Easing is not configurable and will be ignored if included
});
</code></pre>
    * @param {String} color (optional) The color of the border.  Should be a 6 char hex color without the leading # (defaults to light blue: 'C3DAF9').
    * @param {Number} count (optional) The number of ripples to display (defaults to 1)
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Rs.Element} The Element
    */
    frame : function(color, count, o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            proxy,
            active;

        me.queueFx(o, function(){
            color = color || '#C3DAF9';
            if(color.length == 6){
                color = '#' + color;
            }            
            count = count || 1;
            fly(dom).show();

            var xy = fly(dom).getXY(),
                b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight},
                queue = function(){
                    proxy = fly(document.body || document.documentElement).createChild({
                        style:{
                            position : ABSOLUTE,
                            'z-index': 35000, // yee haw
                            border : '0px solid ' + color
                        }
                    });
                    return proxy.queueFx({}, animFn);
                };
            
            
            arguments.callee.anim = {
                isAnimated: true,
                stop: function() {
                    count = 0;
                    proxy.stopFx();
                }
            };
            
            function animFn(){
                var scale = Rs.isBorderBox ? 2 : 1;
                active = proxy.anim({
                    top : {from : b.y, to : b.y - 20},
                    left : {from : b.x, to : b.x - 20},
                    borderWidth : {from : 0, to : 10},
                    opacity : {from : 1, to : 0},
                    height : {from : b.height, to : b.height + 20 * scale},
                    width : {from : b.width, to : b.width + 20 * scale}
                },{
                    duration: o.duration || 1,
                    callback: function() {
                        proxy.remove();
                        --count > 0 ? queue() : fly(dom).afterFx(o);
                    }
                });
                arguments.callee.anim = {
                    isAnimated: true,
                    stop: function(){
                        active.stop();
                    }
                };
            };
            queue();
        });
        return me;
    },

   /**
    * Creates a pause before any subsequent queued effects begin.  If there are
    * no effects queued after the pause it will have no effect.
    * Usage:
<pre><code>
el.pause(1);
</code></pre>
    * @param {Number} seconds The length of time to pause (in seconds)
    * @return {Rs.Element} The Element
    */
    pause : function(seconds){        
        var dom = this.dom,
            t;

        this.queueFx({}, function(){
            t = setTimeout(function(){
                fly(dom).afterFx({});
            }, seconds * 1000);
            arguments.callee.anim = {
                isAnimated: true,
                stop: function(){
                    clearTimeout(t);
                    fly(dom).afterFx({});
                }
            };
        });
        return this;
    },

   /**
    * Fade an element in (from transparent to opaque).  The ending opacity can be specified
    * using the <tt>{@link #endOpacity}</tt> config option.
    * Usage:
<pre><code>
// default: fade in from opacity 0 to 100%
el.fadeIn();

// custom: fade in from opacity 0 to 75% over 2 seconds
el.fadeIn({ endOpacity: .75, duration: 2});

// common config options shown with default values
el.fadeIn({
    endOpacity: 1, //can be any value between 0 and 1 (e.g. .5)
    easing: 'easeOut',
    duration: .5
});
</code></pre>
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Rs.Element} The Element
    */
    fadeIn : function(o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            to = o.endOpacity || 1;
        
        me.queueFx(o, function(){
            fly(dom).setOpacity(0);
            fly(dom).fixDisplay();
            dom.style.visibility = VISIBLE;
            arguments.callee.anim = fly(dom).fxanim({opacity:{to:to}},
                o, NULL, .5, EASEOUT, function(){
                if(to == 1){
                    fly(dom).clearOpacity();
                }
                fly(dom).afterFx(o);
            });
        });
        return me;
    },

   /**
    * Fade an element out (from opaque to transparent).  The ending opacity can be specified
    * using the <tt>{@link #endOpacity}</tt> config option.  Note that IE may require
    * <tt>{@link #useDisplay}:true</tt> in order to redisplay correctly.
    * Usage:
<pre><code>
// default: fade out from the element's current opacity to 0
el.fadeOut();

// custom: fade out from the element's current opacity to 25% over 2 seconds
el.fadeOut({ endOpacity: .25, duration: 2});

// common config options shown with default values
el.fadeOut({
    endOpacity: 0, //can be any value between 0 and 1 (e.g. .5)
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Rs.Element} The Element
    */
    fadeOut : function(o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            style = dom.style,
            to = o.endOpacity || 0;         
        
        me.queueFx(o, function(){  
            arguments.callee.anim = fly(dom).fxanim({ 
                opacity : {to : to}},
                o, 
                NULL, 
                .5, 
                EASEOUT, 
                function(){
                    if(to == 0){
                        Rs.Element.data(dom, 'visibilityMode') == Rs.Element.DISPLAY || o.useDisplay ? 
                            style.display = "none" :
                            style.visibility = HIDDEN;
                            
                        fly(dom).clearOpacity();
                    }
                    fly(dom).afterFx(o);
            });
        });
        return me;
    },

   /**
    * Animates the transition of an element's dimensions from a starting height/width
    * to an ending height/width.  This method is a convenience implementation of {@link shift}.
    * Usage:
<pre><code>
// change height and width to 100x100 pixels
el.scale(100, 100);

// common config options shown with default values.  The height and width will default to
// the element&#39;s existing values if passed as null.
el.scale(
    [element&#39;s width],
    [element&#39;s height], {
        easing: 'easeOut',
        duration: .35
    }
);
</code></pre>
    * @param {Number} width  The new width (pass undefined to keep the original width)
    * @param {Number} height  The new height (pass undefined to keep the original height)
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Rs.Element} The Element
    */
    scale : function(w, h, o){
        this.shift(Rs.apply({}, o, {
            width: w,
            height: h
        }));
        return this;
    },

   /**
    * Animates the transition of any combination of an element's dimensions, xy position and/or opacity.
    * Any of these properties not specified in the config object will not be changed.  This effect 
    * requires that at least one new dimension, position or opacity setting must be passed in on
    * the config object in order for the function to have any effect.
    * Usage:
<pre><code>
// slide the element horizontally to x position 200 while changing the height and opacity
el.shift({ x: 200, height: 50, opacity: .8 });

// common config options shown with default values.
el.shift({
    width: [element&#39;s width],
    height: [element&#39;s height],
    x: [element&#39;s x position],
    y: [element&#39;s y position],
    opacity: [element&#39;s opacity],
    easing: 'easeOut',
    duration: .35
});
</code></pre>
    * @param {Object} options  Object literal with any of the Fx config options
    * @return {Rs.Element} The Element
    */
    shift : function(o){
        o = getObject(o);
        var dom = this.dom,
            a = {};
                
        this.queueFx(o, function(){
            for (var prop in o) {
                if (o[prop] != UNDEFINED) {                                                 
                    a[prop] = {to : o[prop]};                   
                }
            } 
            
            a.width ? a.width.to = fly(dom).adjustWidth(o.width) : a;
            a.height ? a.height.to = fly(dom).adjustWidth(o.height) : a;   
            
            if (a.x || a.y || a.xy) {
                a.points = a.xy || 
                           {to : [ a.x ? a.x.to : fly(dom).getX(),
                                   a.y ? a.y.to : fly(dom).getY()]};                  
            }

            arguments.callee.anim = fly(dom).fxanim(a,
                o, 
                MOTION, 
                .35, 
                EASEOUT, 
                function(){
                    fly(dom).afterFx(o);
                });
        });
        return this;
    },

    /**
     * Slides the element while fading it out of view.  An anchor point can be optionally passed to set the 
     * ending point of the effect.
     * Usage:
     *<pre><code>
// default: slide the element downward while fading out
el.ghost();

// custom: slide the element out to the right with a 2-second duration
el.ghost('r', { duration: 2 });

// common config options shown with default values
el.ghost('b', {
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to bottom: 'b')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Rs.Element} The Element
     */
    ghost : function(anchor, o){
        o = getObject(o);
        var me = this,
            dom = me.dom,
            st = dom.style,
            a = {opacity: {to: 0}, points: {}},
            pt = a.points,
            r,
            w,
            h;
            
        anchor = anchor || "b";

        me.queueFx(o, function(){
            // restore values after effect
            r = fly(dom).getFxRestore();
            w = fly(dom).getWidth();
            h = fly(dom).getHeight();
            
            function after(){
                o.useDisplay ? fly(dom).setDisplayed(FALSE) : fly(dom).hide();   
                fly(dom).clearOpacity();
                fly(dom).setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                fly(dom).afterFx(o);
            }
                
            pt.by = fly(dom).switchStatements(anchor.toLowerCase(), function(v1,v2){ return [v1, v2];}, {
               t  : [0, -h],
               l  : [-w, 0],
               r  : [w, 0],
               b  : [0, h],
               tl : [-w, -h],
               bl : [-w, h],
               br : [w, h],
               tr : [w, -h] 
            });
                
            arguments.callee.anim = fly(dom).fxanim(a,
                o,
                MOTION,
                .5,
                EASEOUT, after);
        });
        return me;
    },

    /**
     * Ensures that all effects queued after syncFx is called on the element are
     * run concurrently.  This is the opposite of {@link #sequenceFx}.
     * @return {Rs.Element} The Element
     */
    syncFx : function(){
        var me = this;
        me.fxDefaults = Rs.apply(me.fxDefaults || {}, {
            block : FALSE,
            concurrent : TRUE,
            stopFx : FALSE
        });
        return me;
    },

    /**
     * Ensures that all effects queued after sequenceFx is called on the element are
     * run in sequence.  This is the opposite of {@link #syncFx}.
     * @return {Rs.Element} The Element
     */
    sequenceFx : function(){
        var me = this;
        me.fxDefaults = Rs.apply(me.fxDefaults || {}, {
            block : FALSE,
            concurrent : FALSE,
            stopFx : FALSE
        });
        return me;
    },

    /* @private */
    nextFx : function(){        
        var ef = getQueue(this.dom.id)[0];
        if(ef){
            ef.call(this);
        }
    },

    /**
     * Returns true if the element has any effects actively running or queued, else returns false.
     * @return {Boolean} True if element has active effects, else false
     */
    hasActiveFx : function(){
        return getQueue(this.dom.id)[0];
    },

    /**
     * Stops any running effects and clears the element's internal effects queue if it contains
     * any additional effects that haven't started yet.
     * @return {Rs.Element} The Element
     */
    stopFx : function(finish){
        var me = this,
            id = me.dom.id;
        if(me.hasActiveFx()){
            var cur = getQueue(id)[0];
            if(cur && cur.anim){
                if(cur.anim.isAnimated){
                    setQueue(id, [cur]); //clear
                    cur.anim.stop(finish !== undefined ? finish : TRUE);
                }else{
                    setQueue(id, []);
                }
            }
        }
        return me;
    },

    /* @private */
    beforeFx : function(o){
        if(this.hasActiveFx() && !o.concurrent){
           if(o.stopFx){
               this.stopFx();
               return TRUE;
           }
           return FALSE;
        }
        return TRUE;
    },

    /**
     * Returns true if the element is currently blocking so that no other effect can be queued
     * until this effect is finished, else returns false if blocking is not set.  This is commonly
     * used to ensure that an effect initiated by a user action runs to completion prior to the
     * same effect being restarted (e.g., firing only one effect even if the user clicks several times).
     * @return {Boolean} True if blocking, else false
     */
    hasFxBlock : function(){
        var q = getQueue(this.dom.id);
        return q && q[0] && q[0].block;
    },

    /* @private */
    queueFx : function(o, fn){
        var me = fly(this.dom);
        if(!me.hasFxBlock()){
            Rs.applyIf(o, me.fxDefaults);
            if(!o.concurrent){
                var run = me.beforeFx(o);
                fn.block = o.block;
                getQueue(me.dom.id).push(fn);
                if(run){
                    me.nextFx();
                }
            }else{
                fn.call(me);
            }
        }
        return me;
    },

    /* @private */
    fxWrap : function(pos, o, vis){ 
        var dom = this.dom,
            wrap,
            wrapXY;
        if(!o.wrap || !(wrap = Rs.getDom(o.wrap))){            
            if(o.fixPosition){
                wrapXY = fly(dom).getXY();
            }
            var div = document.createElement("div");
            div.style.visibility = vis;
            wrap = dom.parentNode.insertBefore(div, dom);
            fly(wrap).setPositioning(pos);
            if(fly(wrap).isStyle(POSITION, "static")){
                fly(wrap).position("relative");
            }
            fly(dom).clearPositioning('auto');
            fly(wrap).clip();
            wrap.appendChild(dom);
            if(wrapXY){
                fly(wrap).setXY(wrapXY);
            }
        }
        return wrap;
    },

    /* @private */
    fxUnwrap : function(wrap, pos, o){      
        var dom = this.dom;
        fly(dom).clearPositioning();
        fly(dom).setPositioning(pos);
        if(!o.wrap){
            var pn = fly(wrap).dom.parentNode;
            pn.insertBefore(dom, wrap); 
            fly(wrap).remove();
        }
    },

    /* @private */
    getFxRestore : function(){
        var st = this.dom.style;
        return {pos: this.getPositioning(), width: st.width, height : st.height};
    },

    /* @private */
    afterFx : function(o){
        var dom = this.dom,
            id = dom.id;
        if(o.afterStyle){
            fly(dom).setStyle(o.afterStyle);            
        }
        if(o.afterCls){
            fly(dom).addClass(o.afterCls);
        }
        if(o.remove == TRUE){
            fly(dom).remove();
        }
        if(o.callback){
            o.callback.call(o.scope, fly(dom));
        }
        if(!o.concurrent){
            getQueue(id).shift();
            fly(dom).nextFx();
        }
    },

    /* @private */
    fxanim : function(args, opt, animType, defaultDur, defaultEase, cb){
        animType = animType || 'run';
        opt = opt || {};
        var anim = Rs.lib.Anim[animType](
                this.dom, 
                args,
                (opt.duration || defaultDur) || .35,
                (opt.easing || defaultEase) || EASEOUT,
                cb,            
                this
            );
        opt.anim = anim;
        return anim;
    }
};

// backwards compat
Rs.Fx.resize = Rs.Fx.scale;

//When included, Rs.Fx is automatically applied to Element so that all basic
//effects are available directly via the Element API
Rs.Element.addMethods(Rs.Fx);
})();
/**
 * @class Rs.CompositeElementLite
 * <p>This class encapsulates a <i>collection</i> of DOM elements, providing methods to filter
 * members, or to perform collective actions upon the whole set.</p>
 * <p>Although they are not listed, this class supports all of the methods of {@link Rs.Element} and
 * {@link Rs.Fx}. The methods from these classes will be performed on all the elements in this collection.</p>
 * Example:<pre><code>
var els = Rs.select("#some-el div.some-class");
// or select directly from an existing element
var el = Rs.get('some-el');
el.select('div.some-class');

els.setWidth(100); // all elements become 100 width
els.hide(true); // all elements fade out and hide
// or
els.setWidth(100).hide(true);
</code>
 */
Rs.CompositeElementLite = function(els, root){
    /**
     * <p>The Array of DOM elements which this CompositeElement encapsulates. Read-only.</p>
     * <p>This will not <i>usually</i> be accessed in developers' code, but developers wishing
     * to augment the capabilities of the CompositeElementLite class may use it when adding
     * methods to the class.</p>
     * <p>For example to add the <code>nextAll</code> method to the class to <b>add</b> all
     * following siblings of selected elements, the code would be</p><code><pre>
Rs.override(Rs.CompositeElementLite, {
    nextAll: function() {
        var els = this.elements, i, l = els.length, n, r = [], ri = -1;

//      Loop through all elements in this Composite, accumulating
//      an Array of all siblings.
        for (i = 0; i < l; i++) {
            for (n = els[i].nextSibling; n; n = n.nextSibling) {
                r[++ri] = n;
            }
        }

//      Add all found siblings to this Composite
        return this.add(r);
    }
});</pre></code>
     * @type Array
     * @property elements
     */
    this.elements = [];
    this.add(els, root);
    this.el = new Rs.Element.Flyweight();
};

Rs.CompositeElementLite.prototype = {
    isComposite: true,    
    
    // private
    getElement : function(el){
        // Set the shared flyweight dom property to the current element
        var e = this.el;
        e.dom = el;
        e.id = el.id;
        return e;
    },
    
    // private
    transformElement : function(el){
        return Rs.getDom(el);
    },
    
    /**
     * Returns the number of elements in this Composite.
     * @return Number
     */
    getCount : function(){
        return this.elements.length;
    },    
    /**
     * Adds elements to this Composite object.
     * @param {Mixed} els Either an Array of DOM elements to add, or another Composite object who's elements should be added.
     * @return {CompositeElement} This Composite object.
     */
    add : function(els, root){
        var me = this,
            elements = me.elements;
        if(!els){
            return this;
        }
        if(Rs.isString(els)){
            els = Rs.Element.selectorFunction(els, root);
        }else if(els.isComposite){
            els = els.elements;
        }else if(!Rs.isIterable(els)){
            els = [els];
        }
        
        for(var i = 0, len = els.length; i < len; ++i){
            elements.push(me.transformElement(els[i]));
        }
        return me;
    },
    
    invoke : function(fn, args){
        var me = this,
            els = me.elements,
            len = els.length, 
            e, 
            i;
            
        for(i = 0; i < len; i++) {
            e = els[i];
            if(e){
                Rs.Element.prototype[fn].apply(me.getElement(e), args);
            }
        }
        return me;
    },
    /**
     * Returns a flyweight Element of the dom element object at the specified index
     * @param {Number} index
     * @return {Rs.Element}
     */
    item : function(index){
        var me = this,
            el = me.elements[index],
            out = null;

        if(el){
            out = me.getElement(el);
        }
        return out;
    },

    // fixes scope with flyweight
    addListener : function(eventName, handler, scope, opt){
        var els = this.elements,
            len = els.length,
            i, e;
        
        for(i = 0; i<len; i++) {
            e = els[i];
            if(e) {
                Rs.EventManager.on(e, eventName, handler, scope || e, opt);
            }
        }
        return this;
    },
    /**
     * <p>Calls the passed function for each element in this composite.</p>
     * @param {Function} fn The function to call. The function is passed the following parameters:<ul>
     * <li><b>el</b> : Element<div class="sub-desc">The current Element in the iteration.
     * <b>This is the flyweight (shared) Rs.Element instance, so if you require a
     * a reference to the dom node, use el.dom.</b></div></li>
     * <li><b>c</b> : Composite<div class="sub-desc">This Composite object.</div></li>
     * <li><b>idx</b> : Number<div class="sub-desc">The zero-based index in the iteration.</div></li>
     * </ul>
     * @param {Object} scope (optional) The scope (<i>this</i> reference) in which the function is executed. (defaults to the Element)
     * @return {CompositeElement} this
     */
    each : function(fn, scope){       
        var me = this,
            els = me.elements,
            len = els.length,
            i, e;
        
        for(i = 0; i<len; i++) {
            e = els[i];
            if(e){
                e = this.getElement(e);
                if(fn.call(scope || e, e, me, i)){
                    break;
                }
            }
        }
        return me;
    },
    
    /**
    * Clears this Composite and adds the elements passed.
    * @param {Mixed} els Either an array of DOM elements, or another Composite from which to fill this Composite.
    * @return {CompositeElement} this
    */
    fill : function(els){
        var me = this;
        me.elements = [];
        me.add(els);
        return me;
    },
    
    /**
     * Filters this composite to only elements that match the passed selector.
     * @param {String/Function} selector A string CSS selector or a comparison function.
     * The comparison function will be called with the following arguments:<ul>
     * <li><code>el</code> : Rs.Element<div class="sub-desc">The current DOM element.</div></li>
     * <li><code>index</code> : Number<div class="sub-desc">The current index within the collection.</div></li>
     * </ul>
     * @return {CompositeElement} this
     */
    filter : function(selector){
        var els = [],
            me = this,
            elements = me.elements,
            fn = Rs.isFunction(selector) ? selector
                : function(el){
                    return el.is(selector);
                };
                
        
        me.each(function(el, self, i){
            if(fn(el, i) !== false){
                els[els.length] = me.transformElement(el);
            }
        });
        me.elements = els;
        return me;
    },
    
    /**
     * Find the index of the passed element within the composite collection.
     * @param el {Mixed} The id of an element, or an Rs.Element, or an HtmlElement to find within the composite collection.
     * @return Number The index of the passed Rs.Element in the composite collection, or -1 if not found.
     */
    indexOf : function(el){
        return this.elements.indexOf(this.transformElement(el));
    },
    
    /**
    * Replaces the specified element with the passed element.
    * @param {Mixed} el The id of an element, the Element itself, the index of the element in this composite
    * to replace.
    * @param {Mixed} replacement The id of an element or the Element itself.
    * @param {Boolean} domReplace (Optional) True to remove and replace the element in the document too.
    * @return {CompositeElement} this
    */    
    replaceElement : function(el, replacement, domReplace){
        var index = !isNaN(el) ? el : this.indexOf(el),
            d;
        if(index > -1){
            replacement = Rs.getDom(replacement);
            if(domReplace){
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Rs.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    },
    
    /**
     * Removes all elements.
     */
    clear : function(){
        this.elements = [];
    }
};

Rs.CompositeElementLite.prototype.on = Rs.CompositeElementLite.prototype.addListener;

(function(){
var fnName,
    ElProto = Rs.Element.prototype,
    CelProto = Rs.CompositeElementLite.prototype;
    
for(fnName in ElProto){
    if(Rs.isFunction(ElProto[fnName])){
        (function(fnName){ 
            CelProto[fnName] = CelProto[fnName] || function(){
                return this.invoke(fnName, arguments);
            };
        }).call(CelProto, fnName);
        
    }
}
})();

if(Rs.DomQuery){
    Rs.Element.selectorFunction = Rs.DomQuery.select;
} 

/**
 * Selects elements based on the passed CSS selector to enable {@link Rs.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Rs.CompositeElement CompositeElement} or
 * {@link Rs.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Rs.Element
 * @method select
 */
Rs.Element.select = function(selector, root){
    var els;
    if(typeof selector == "string"){
        els = Rs.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    return new Rs.CompositeElementLite(els);
};
/**
 * Selects elements based on the passed CSS selector to enable {@link Rs.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Rs.CompositeElement CompositeElement} or
 * {@link Rs.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Rs
 * @method select
 */
Rs.select = Rs.Element.select;
(function(){
    var BEFOREREQUEST = "beforerequest",
        REQUESTCOMPLETE = "requestcomplete",
        REQUESTEXCEPTION = "requestexception",
        UNDEFINED = undefined,
        LOAD = 'load',
        POST = 'POST',
        GET = 'GET',
        WINDOW = window;

    /**
     * @class Rs.data.Connection
     * @extends Rs.util.Observable
     * <p>The class encapsulates a connection to the page's originating domain, allowing requests to be made
     * either to a configured URL, or to a URL specified at request time.</p>
     * <p>Requests made by this class are asynchronous, and will return immediately. No data from
     * the server will be available to the statement immediately following the {@link #request} call.
     * To process returned data, use a
     * <a href="#request-option-success" ext:member="request-option-success" ext:cls="Rs.data.Connection">success callback</a>
     * in the request options object,
     * or an {@link #requestcomplete event listener}.</p>
     * <p><h3>File Uploads</h3><a href="#request-option-isUpload" ext:member="request-option-isUpload" ext:cls="Rs.data.Connection">File uploads</a> are not performed using normal "Ajax" techniques, that
     * is they are <b>not</b> performed using XMLHttpRequests. Instead the form is submitted in the standard
     * manner with the DOM <tt>&lt;form></tt> element temporarily modified to have its
     * <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
     * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
     * but removed after the return data has been gathered.</p>
     * <p>The server response is parsed by the browser to create the document for the IFRAME. If the
     * server is using JSON to send the return object, then the
     * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17">Content-Type</a> header
     * must be set to "text/html" in order to tell the browser to insert the text unchanged into the document body.</p>
     * <p>Characters which are significant to an HTML parser must be sent as HTML entities, so encode
     * "&lt;" as "&amp;lt;", "&amp;" as "&amp;amp;" etc.</p>
     * <p>The response text is retrieved from the document, and a fake XMLHttpRequest object
     * is created containing a <tt>responseText</tt> property in order to conform to the
     * requirements of event handlers and callbacks.</p>
     * <p>Be aware that file upload packets are sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form</a>
     * and some server technologies (notably JEE) may require some custom processing in order to
     * retrieve parameter names and parameter values from the packet content.</p>
     * @constructor
     * @param {Object} config a configuration object.
     */
    Rs.data.Connection = function(config){
        Rs.apply(this, config);
        this.addEvents(
            /**
             * @event beforerequest
             * Fires before a network request is made to retrieve a data object.
             * @param {Connection} conn This Connection object.
             * @param {Object} options The options config object passed to the {@link #request} method.
             */
            BEFOREREQUEST,
            /**
             * @event requestcomplete
             * Fires if the request was successfully completed.
             * @param {Connection} conn This Connection object.
             * @param {Object} response The XHR object containing the response data.
             * See <a href="http://www.w3.org/TR/XMLHttpRequest/">The XMLHttpRequest Object</a>
             * for details.
             * @param {Object} options The options config object passed to the {@link #request} method.
             */
            REQUESTCOMPLETE,
            /**
             * @event requestexception
             * Fires if an error HTTP status was returned from the server.
             * See <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html">HTTP Status Code Definitions</a>
             * for details of HTTP status codes.
             * @param {Connection} conn This Connection object.
             * @param {Object} response The XHR object containing the response data.
             * See <a href="http://www.w3.org/TR/XMLHttpRequest/">The XMLHttpRequest Object</a>
             * for details.
             * @param {Object} options The options config object passed to the {@link #request} method.
             */
            REQUESTEXCEPTION
        );
        Rs.data.Connection.superclass.constructor.call(this);
    };

    Rs.extend(Rs.data.Connection, Rs.util.Observable, {
        /**
         * @cfg {String} url (Optional) <p>The default URL to be used for requests to the server. Defaults to undefined.</p>
         * <p>The <code>url</code> config may be a function which <i>returns</i> the URL to use for the Ajax request. The scope
         * (<code><b>this</b></code> reference) of the function is the <code>scope</code> option passed to the {@link #request} method.</p>
         */
        /**
         * @cfg {Object} extraParams (Optional) An object containing properties which are used as
         * extra parameters to each request made by this object. (defaults to undefined)
         */
        /**
         * @cfg {Object} defaultHeaders (Optional) An object containing request headers which are added
         *  to each request made by this object. (defaults to undefined)
         */
        /**
         * @cfg {String} method (Optional) The default HTTP method to be used for requests.
         * (defaults to undefined; if not set, but {@link #request} params are present, POST will be used;
         * otherwise, GET will be used.)
         */
        /**
         * @cfg {Number} timeout (Optional) The timeout in milliseconds to be used for requests. (defaults to 30000)
         */
        timeout : 30000,
        /**
         * @cfg {Boolean} autoAbort (Optional) Whether this request should abort any pending requests. (defaults to false)
         * @type Boolean
         */
        autoAbort:false,

        /**
         * @cfg {Boolean} disableCaching (Optional) True to add a unique cache-buster param to GET requests. (defaults to true)
         * @type Boolean
         */
        disableCaching: true,

        /**
         * @cfg {String} disableCachingParam (Optional) Change the parameter which is sent went disabling caching
         * through a cache buster. Defaults to '_dc'
         * @type String
         */
        disableCachingParam: '_dc',

        /**
         * <p>Sends an HTTP request to a remote server.</p>
         * <p><b>Important:</b> Ajax server requests are asynchronous, and this call will
         * return before the response has been received. Process any returned data
         * in a callback function.</p>
         * <pre><code>
Rs.Ajax.request({
   url: 'ajax_demo/sample.json',
   success: function(response, opts) {
      var obj = Rs.decode(response.responseText);
      console.dir(obj);
   },
   failure: function(response, opts) {
      console.log('server-side failure with status code ' + response.status);
   }
});
         * </code></pre>
         * <p>To execute a callback function in the correct scope, use the <tt>scope</tt> option.</p>
         * @param {Object} options An object which may contain the following properties:<ul>
         * <li><b>url</b> : String/Function (Optional)<div class="sub-desc">The URL to
         * which to send the request, or a function to call which returns a URL string. The scope of the
         * function is specified by the <tt>scope</tt> option. Defaults to the configured
         * <tt>{@link #url}</tt>.</div></li>
         * <li><b>params</b> : Object/String/Function (Optional)<div class="sub-desc">
         * An object containing properties which are used as parameters to the
         * request, a url encoded string or a function to call to get either. The scope of the function
         * is specified by the <tt>scope</tt> option.</div></li>
         * <li><b>method</b> : String (Optional)<div class="sub-desc">The HTTP method to use
         * for the request. Defaults to the configured method, or if no method was configured,
         * "GET" if no parameters are being sent, and "POST" if parameters are being sent.  Note that
         * the method name is case-sensitive and should be all caps.</div></li>
         * <li><b>callback</b> : Function (Optional)<div class="sub-desc">The
         * function to be called upon receipt of the HTTP response. The callback is
         * called regardless of success or failure and is passed the following
         * parameters:<ul>
         * <li><b>options</b> : Object<div class="sub-desc">The parameter to the request call.</div></li>
         * <li><b>success</b> : Boolean<div class="sub-desc">True if the request succeeded.</div></li>
         * <li><b>response</b> : Object<div class="sub-desc">The XMLHttpRequest object containing the response data.
         * See <a href="http://www.w3.org/TR/XMLHttpRequest/">http://www.w3.org/TR/XMLHttpRequest/</a> for details about
         * accessing elements of the response.</div></li>
         * </ul></div></li>
         * <li><a id="request-option-success"></a><b>success</b> : Function (Optional)<div class="sub-desc">The function
         * to be called upon success of the request. The callback is passed the following
         * parameters:<ul>
         * <li><b>response</b> : Object<div class="sub-desc">The XMLHttpRequest object containing the response data.</div></li>
         * <li><b>options</b> : Object<div class="sub-desc">The parameter to the request call.</div></li>
         * </ul></div></li>
         * <li><b>failure</b> : Function (Optional)<div class="sub-desc">The function
         * to be called upon failure of the request. The callback is passed the
         * following parameters:<ul>
         * <li><b>response</b> : Object<div class="sub-desc">The XMLHttpRequest object containing the response data.</div></li>
         * <li><b>options</b> : Object<div class="sub-desc">The parameter to the request call.</div></li>
         * </ul></div></li>
         * <li><b>scope</b> : Object (Optional)<div class="sub-desc">The scope in
         * which to execute the callbacks: The "this" object for the callback function. If the <tt>url</tt>, or <tt>params</tt> options were
         * specified as functions from which to draw values, then this also serves as the scope for those function calls.
         * Defaults to the browser window.</div></li>
         * <li><b>timeout</b> : Number (Optional)<div class="sub-desc">The timeout in milliseconds to be used for this request. Defaults to 30 seconds.</div></li>
         * <li><b>form</b> : Element/HTMLElement/String (Optional)<div class="sub-desc">The <tt>&lt;form&gt;</tt>
         * Element or the id of the <tt>&lt;form&gt;</tt> to pull parameters from.</div></li>
         * <li><a id="request-option-isUpload"></a><b>isUpload</b> : Boolean (Optional)<div class="sub-desc"><b>Only meaningful when used
         * with the <tt>form</tt> option</b>.
         * <p>True if the form object is a file upload (will be set automatically if the form was
         * configured with <b><tt>enctype</tt></b> "multipart/form-data").</p>
         * <p>File uploads are not performed using normal "Ajax" techniques, that is they are <b>not</b>
         * performed using XMLHttpRequests. Instead the form is submitted in the standard manner with the
         * DOM <tt>&lt;form></tt> element temporarily modified to have its
         * <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
         * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
         * but removed after the return data has been gathered.</p>
         * <p>The server response is parsed by the browser to create the document for the IFRAME. If the
         * server is using JSON to send the return object, then the
         * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17">Content-Type</a> header
         * must be set to "text/html" in order to tell the browser to insert the text unchanged into the document body.</p>
         * <p>The response text is retrieved from the document, and a fake XMLHttpRequest object
         * is created containing a <tt>responseText</tt> property in order to conform to the
         * requirements of event handlers and callbacks.</p>
         * <p>Be aware that file upload packets are sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form</a>
         * and some server technologies (notably JEE) may require some custom processing in order to
         * retrieve parameter names and parameter values from the packet content.</p>
         * </div></li>
         * <li><b>headers</b> : Object (Optional)<div class="sub-desc">Request
         * headers to set for the request.</div></li>
         * <li><b>xmlData</b> : Object (Optional)<div class="sub-desc">XML document
         * to use for the post. Note: This will be used instead of params for the post
         * data. Any params will be appended to the URL.</div></li>
         * <li><b>jsonData</b> : Object/String (Optional)<div class="sub-desc">JSON
         * data to use as the post. Note: This will be used instead of params for the post
         * data. Any params will be appended to the URL.</div></li>
         * <li><b>disableCaching</b> : Boolean (Optional)<div class="sub-desc">True
         * to add a unique cache-buster param to GET requests.</div></li>
         * </ul></p>
         * <p>The options object may also contain any other property which might be needed to perform
         * postprocessing in a callback because it is passed to callback functions.</p>
         * @return {Number} transactionId The id of the server transaction. This may be used
         * to cancel the request.
         */
        request : function(o){
            var me = this;
            if(me.fireEvent(BEFOREREQUEST, me, o)){
                if (o.el) {
                    if(!Rs.isEmpty(o.indicatorText)){
                        me.indicatorText = '<div class="loading-indicator">'+o.indicatorText+"</div>";
                    }
                    if(me.indicatorText) {
                        Rs.getDom(o.el).innerHTML = me.indicatorText;
                    }
                    o.success = (Rs.isFunction(o.success) ? o.success : function(){}).createInterceptor(function(response) {
                        Rs.getDom(o.el).innerHTML = response.responseText;
                    });
                }

                var ep = o.extraParams || me.extraParams || {}, 
                	p = o.params,
                    url = o.url || me.url,
                    method,
                    cb = {success: me.handleResponse,
                          failure: me.handleFailure,
                          scope: me,
                          argument: {options: o},
                          timeout : o.timeout || me.timeout
                    },
                    form,
                    serForm;


                if (Rs.isFunction(p)) {
                    p = p.call(o.scope||WINDOW, o);
                }

                p = Rs.urlEncode(ep, Rs.isObject(p) ? Rs.urlEncode(p) : p);

                if (Rs.isFunction(url)) {
                    url = url.call(o.scope || WINDOW, o);
                }

                if((form = Rs.getDom(o.form))){
                    url = url || form.action;
                     if(o.isUpload || /multipart\/form-data/i.test(form.getAttribute("enctype"))) {
                         return me.doFormUpload.call(me, o, p, url);
                     }
                    serForm = Rs.lib.Ajax.serializeForm(form);
                    p = p ? (p + '&' + serForm) : serForm;
                }

                method = o.method || me.method || ((p || o.xmlData || o.jsonData) ? POST : GET);

                if(method === GET && (me.disableCaching && o.disableCaching !== false) || o.disableCaching === true){
                    var dcp = o.disableCachingParam || me.disableCachingParam;
                    url = Rs.urlAppend(url, dcp + '=' + (new Date().getTime()));
                }

                o.headers = Rs.apply(o.headers || {}, me.defaultHeaders || {});

                if(o.autoAbort === true || me.autoAbort) {
                    me.abort();
                }

                if((method == GET || o.xmlData || o.jsonData) && p){
                    url = Rs.urlAppend(url, p);
                    p = '';
                }
                return (me.transId = Rs.lib.Ajax.request(method, url, cb, p, o));
            }else{
                return o.callback ? o.callback.apply(o.scope, [o,UNDEFINED,UNDEFINED]) : null;
            }
        },

        /**
         * Determine whether this object has a request outstanding.
         * @param {Number} transactionId (Optional) defaults to the last transaction
         * @return {Boolean} True if there is an outstanding request.
         */
        isLoading : function(transId){
            return transId ? Rs.lib.Ajax.isCallInProgress(transId) : !! this.transId;
        },

        /**
         * Aborts any outstanding request.
         * @param {Number} transactionId (Optional) defaults to the last transaction
         */
        abort : function(transId){
            if(transId || this.isLoading()){
                Rs.lib.Ajax.abort(transId || this.transId);
            }
        },

        // private
        handleResponse : function(response){
            this.transId = false;
            var options = response.argument.options;
            response.argument = options ? options.argument : null;
            this.fireEvent(REQUESTCOMPLETE, this, response, options);
            if(options.success){
                options.success.call(options.scope, response, options);
            }
            if(options.callback){
                options.callback.call(options.scope, options, true, response);
            }
        },

        // private
        handleFailure : function(response, e){
            this.transId = false;
            var options = response.argument.options;
            response.argument = options ? options.argument : null;
            this.fireEvent(REQUESTEXCEPTION, this, response, options, e);
            if(options.failure){
                options.failure.call(options.scope, response, options);
            }
            if(options.callback){
                options.callback.call(options.scope, options, false, response);
            }
        },

        // private
        doFormUpload : function(o, ps, url){
            var id = Rs.id(),
                doc = document,
                frame = doc.createElement('iframe'),
                form = Rs.getDom(o.form),
                hiddens = [],
                hd,
                encoding = 'multipart/form-data',
                buf = {
                    target: form.target,
                    method: form.method,
                    encoding: form.encoding,
                    enctype: form.enctype,
                    action: form.action
                };

            Rs.fly(frame).set({
                id: id,
                name: id,
                cls: 'x-hidden'

            });

            doc.body.appendChild(frame);

            //Reset the Frame to neutral domain
            Rs.fly(frame).set({
               src : Rs.SSL_SECURE_URL
            });

            // This is required so that IE doesn't pop the response up in a new window.
            if(Rs.isIE){
               document.frames[id].name = id;
            }


            Rs.fly(form).set({
                target: id,
                method: POST,
                enctype: encoding,
                encoding: encoding,
                action: url || buf.action
            });

            // add dynamic params
            Rs.iterate(Rs.urlDecode(ps, false), function(k, v){
                hd = doc.createElement('input');
                Rs.fly(hd).set({
                    type: 'hidden',
                    value: v,
                    name: k
                });
                form.appendChild(hd);
                hiddens.push(hd);
            });

            function cb(){
                var me = this,
                    // bogus response object
                    r = {responseText : '',
                         responseXML : null,
                         argument : o.argument},
                    doc,
                    firstChild;

                try{
                    doc = frame.contentWindow.document || frame.contentDocument || WINDOW.frames[id].document;
                    if(doc){
                        if(doc.body){
                            if(/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)){ // json response wrapped in textarea
                                r.responseText = firstChild.value;
                            }else{
                                r.responseText = doc.body.innerHTML;
                            }
                        }
                        //in IE the document may still have a body even if returns XML.
                        r.responseXML = doc.XMLDocument || doc;
                    }
                }
                catch(e) {}

                Rs.EventManager.removeListener(frame, LOAD, cb, me);

                me.fireEvent(REQUESTCOMPLETE, me, r, o);

                function runCallback(fn, scope, args){
                    if(Rs.isFunction(fn)){
                        fn.apply(scope, args);
                    }
                }

                runCallback(o.success, o.scope, [r, o]);
                runCallback(o.callback, o.scope, [o, true, r]);

                if(!me.debugUploads){
                    setTimeout(function(){Rs.removeNode(frame);}, 100);
                }
            }

            Rs.EventManager.on(frame, LOAD, cb, this);
            form.submit();

            Rs.fly(form).set(buf);
            Rs.each(hiddens, function(h) {
                Rs.removeNode(h);
            });
        }
    });
})();

/**
 * @class Rs.Ajax
 * @extends Rs.data.Connection
 * <p>The global Ajax request class that provides a simple way to make Ajax requests
 * with maximum flexibility.</p>
 * <p>Since Rs.Ajax is a singleton, you can set common properties/events for it once
 * and override them at the request function level only if necessary.</p>
 * <p>Common <b>Properties</b> you may want to set are:<div class="mdetail-params"><ul>
 * <li><b><tt>{@link #method}</tt></b><p class="sub-desc"></p></li>
 * <li><b><tt>{@link #extraParams}</tt></b><p class="sub-desc"></p></li>
 * <li><b><tt>{@link #url}</tt></b><p class="sub-desc"></p></li>
 * </ul></div>
 * <pre><code>
// Default headers to pass in every request
Rs.Ajax.defaultHeaders = {
    'Powered-By': 'Rs'
};
 * </code></pre>
 * </p>
 * <p>Common <b>Events</b> you may want to set are:<div class="mdetail-params"><ul>
 * <li><b><tt>{@link Rs.data.Connection#beforerequest beforerequest}</tt></b><p class="sub-desc"></p></li>
 * <li><b><tt>{@link Rs.data.Connection#requestcomplete requestcomplete}</tt></b><p class="sub-desc"></p></li>
 * <li><b><tt>{@link Rs.data.Connection#requestexception requestexception}</tt></b><p class="sub-desc"></p></li>
 * </ul></div>
 * <pre><code>
// Example: show a spinner during all Ajax requests
Rs.Ajax.on('beforerequest', this.showSpinner, this);
Rs.Ajax.on('requestcomplete', this.hideSpinner, this);
Rs.Ajax.on('requestexception', this.hideSpinner, this);
 * </code></pre>
 * </p>
 * <p>An example request:</p>
 * <pre><code>
// Basic request
Rs.Ajax.{@link Rs.data.Connection#request request}({
   url: 'foo.php',
   success: someFn,
   failure: otherFn,
   headers: {
       'my-header': 'foo'
   },
   params: { foo: 'bar' }
});

// Simple ajax form submission
Rs.Ajax.{@link Rs.data.Connection#request request}({
    form: 'some-form',
    params: 'foo=bar'
});
 * </code></pre>
 * </p>
 * @singleton
 */
Rs.Ajax = new Rs.data.Connection({
    /**
     * @cfg {String} url @hide
     */
    /**
     * @cfg {Object} extraParams @hide
     */
    /**
     * @cfg {Object} defaultHeaders @hide
     */
    /**
     * @cfg {String} method (Optional) @hide
     */
    /**
     * @cfg {Number} timeout (Optional) @hide
     */
    /**
     * @cfg {Boolean} autoAbort (Optional) @hide
     */

    /**
     * @cfg {Boolean} disableCaching (Optional) @hide
     */

    /**
     * @property  disableCaching
     * True to add a unique cache-buster param to GET requests. (defaults to true)
     * @type Boolean
     */
    /**
     * @property  url
     * The default URL to be used for requests to the server. (defaults to undefined)
     * If the server receives all requests through one URL, setting this once is easier than
     * entering it on every request.
     * @type String
     */
    /**
     * @property  extraParams
     * An object containing properties which are used as extra parameters to each request made
     * by this object (defaults to undefined). Session information and other data that you need
     * to pass with each request are commonly put here.
     * @type Object
     */
    /**
     * @property  defaultHeaders
     * An object containing request headers which are added to each request made by this object
     * (defaults to undefined).
     * @type Object
     */
    /**
     * @property  method
     * The default HTTP method to be used for requests. Note that this is case-sensitive and
     * should be all caps (defaults to undefined; if not set but params are present will use
     * <tt>"POST"</tt>, otherwise will use <tt>"GET"</tt>.)
     * @type String
     */
    /**
     * @property  timeout
     * The timeout in milliseconds to be used for requests. (defaults to 30000)
     * @type Number
     */

    /**
     * @property  autoAbort
     * Whether a new request should abort any pending requests. (defaults to false)
     * @type Boolean
     */
    autoAbort : false,

    /**
     * Serialize the passed form into a url encoded string
     * @param {String/HTMLElement} form
     * @return {String}
     */
    serializeForm : function(form){
        return Rs.lib.Ajax.serializeForm(form);
    }
});
(function(){
	var RS_METHOD = 'Rs-method',
		RS_DATATYPE = 'Rs-dataType',
		RS_ACCEPT = 'Rs-accept',
		BEFORECALL = "beforecall",
    	//BEFOREREQUEST = "beforerequest",	
    	REQUESTCOMPLETE = "requestcomplete",
    	//REQUESTEXCEPTION = "requestexception",
    	BEFORECALLCOMPLATE = 'beforecallcomplate',
        CALLCOMPLATE = "callcomplete",
        CALLEXCEPTION = "callexception",
        UNDEFINED = undefined,
        LOAD = 'load',
        POST = 'POST',
        GET = 'GET',
        WINDOW = window,
    	DOC = document,
    	rvalidchars = /^[\],:{}\s]*$/,
		rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
		rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
		rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
    	rnotwhite = /\S/;
    
	/**
	 * 
	 * 
	 * 
	 */
	var DATATYPES = {
		json : 'json',
		xml : 'xml'
	};
	
    /**
     *  key   要获取的数据的类型
     *  value 可被认定为该类型数据的响应content-type
     */ 
    var ACCEPTS = {
    	xml : /xml/,
		html: /html/,
		text: /plain/,
		json: /[json,javascript]/,
		script: /javascript/,
		"*" : /\*/
    };
    
	var CONVERTERS = {
		"* text": WINDOW.String,
		"text html": true,
		"text json": function( data ) {
			if ( typeof data !== "string" || !data ) {
				return null;
			}
			data = Rs.trim( data );
			data = data == "" ? "{}" : data;
			try{
				return Rs.decode(data);
			}catch(e){
				if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, "")) ) {
					return WINDOW.JSON && WINDOW.JSON.parse ? WINDOW.JSON.parse( data ) : (new Function("return " + data))();
				} else {
					Rs.error( "Invalid JSON: " + data );
				}
			}
		},
		"text xml": function( data , xml , tmp ) {
			if ( WINDOW.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
			tmp = xml.documentElement;
			if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
				Rs.error( "Invalid XML: " + data );
			}
			return xml;
		},
		"text script": function( text ) {
			(function( data ) {
				if ( data && rnotwhite.test(data) ) {
					var head = DOC.getElementsByTagName("head")[0] || DOC.documentElement,
						script = DOC.createElement("script");
					script.type = "text/javascript";
					if (Rs.isSupportScriptEval) {
						script.appendChild( DOC.createTextNode( data ) );
					} else {
						script.text = data;
					}
					head.insertBefore( script, head.firstChild );
					head.removeChild( script );
				}
			})(text);
			return text;
		}
	};
    
	/**
     * @class Rs.data.Service
     * @extends Rs.util.Observable
     * <p>该类封装了对后台业务方法的调用，
     * <pre><code>
//创建一个service对象,并指定后台业务的URL和业务方法名称 
var service = new Rs.data.Service({
    url : 'service.jsp',
    method : 'getJSON',
    accept : 'json'    
});
//调用该业务方法
service.call( {
    params : { id : 101},
    success : function(sheet) {
        Rs.fly('out').update(sheet);
    }
});
	 * </code></pre> 
     * </p>
     * <p></p>
     * @constructor
     * @param {Object} config a configuration object.
     */
    Rs.data.Service = function(config){
        Rs.apply(this, config);
        this.addEvents(
            
        	/**
        	 * @event beforecall  在调用后台业务方法之前调用该方法，如果回调方法返回为false,则终止执行调用后台业务方法.
             * @param {Service} service
             * @param {Object} options
             */
            BEFORECALL,
            
            /**
             * @event beforecallcomplate  在调用回调方法之前，触发该事件，可通过监听beforecallcomplate事件, 实现对Ajax原生数据的预处理
             * @param {Service} service 
             * @param {Object} response The XHR object containing the response data.
             * See <a href="http://www.w3.org/TR/XMLHttpRequest/">The XMLHttpRequest Object</a>
             * for details.
             */
            BEFORECALLCOMPLATE,
            
            /**
             * @event callcomplate  调用回调方法时触发该事件
             * @param {Service} service
             * @param {Mixed} data
             * @param {Object} options
             */
            CALLCOMPLATE,
            
            /**
             * @event callexception  发生异常时触发该事件
             * @param {Service} service
             * @param {Object} response
             * @param {Object} options
             * @param {String} exception
             */
            CALLEXCEPTION
        );
        Rs.data.Service.superclass.constructor.call(this);
    };

    Rs.extend(Rs.data.Service, Rs.util.Observable, {
        
    	/**
         * @cfg {String} url 后台业务URL 
         */
    	
    	/**
         * @cfg {String} method 后台业务方法名称
         */
        
    	/**
         * @cfg {Number} timeout (Optional) The timeout in milliseconds to be used for requests. (defaults to 30000)
         */
        timeout : 30000,
        
        /**
         * @cfg {Boolean} autoAbort (Optional) Whether this request should abort any pending requests. (defaults to false)
         * @type Boolean
         */
        autoAbort : false,
        
        
        /**
         * @cfg {String} dataType
         * 传入的参数的数据类型， 默认是json
         * 
         */
        dataType : 'json',
        
    	/**
		 * @cfg {String} accept 
    	 * <p>预期服务器返回的数据类型, 默认的值为json</p>
    	 * <p>
    	 * 可用值:
    	 * xml   : 返回 XML 文档，可用Rs.Service处理.
    	 * html  : 返回纯文本 HTML 信息；包含 script 元素.
    	 * script: 返回纯文本 JavaScript 代码,不会自动缓存结果,除非设置了"cache"参数.
    	 * json  : 返回 JSON 数据
    	 * text  : 返回纯文本字符串
    	 * </p>
    	 * @type String
    	 */
    	accept : 'json',
    	
    	/**
    	 * 任务队列
    	 */
    	taskQueue : [],
    	
        /**
         * 调用后台的业务方法, 如果当前正在执行后台业务方法，尚未接收到响应，此时再
         * 调用call方法会进入任务队列，当上一次调用返回后方可执行下一次调用。
         * <b>Important:</b>发送请求到后台执行业务方法，可通过设置accept 来指
         * 定要获取的数据的类型 ：xml, html, script, json, text
         * 
         * @param {Object} params
         * @param [Function callback]
         * @param [Object scope]
         */
        call : function(o, callback, scope){
            var me = this;
            if(me.isLoading(me.transId) == true){ //如果正在发送请求，则将参数缓存
    			me.taskQueue.push({
            		options : o,
    				callback : callback,
    				scope : scope
    			});
    			return null;
            }
            if(Rs.isFunction(callback)){
            	o.callback = callback;
            }
            if(Rs.isDefined(scope)){
            	o.scope = scope;
            }
            if(me.fireEvent(BEFORECALL, me, o)){
                var ep = o.extraParams || me.extraParams || {},
                	m = o.method || me.method || '',
                	dt = o.dataType || me.dataType,
                    ac = o.accept || me.accept,
                	p = o.params,
                    url = o.url || me.url,
                    cb = {success: me.handleResponse,
                		  failure: me.handleResponse,
                          //failure: me.handleFailure,
                          scope: me,
                          argument: {options: o},
                          timeout : o.timeout || me.timeout
                    },
                    form,
                    serForm;
                
                if (Rs.isFunction(p)) {
                    p = p.call(o.scope||WINDOW, o);
                }
                p = Rs.urlEncode(ep, Rs.isObject(p) ? Rs.urlEncode(p) : p);
                if (Rs.isFunction(url)) {
                    url = url.call(o.scope || WINDOW, o);
                }
                o.dataType = DATATYPES[dt] != undefined ? dt : "json";
                o.accept = ACCEPTS[ac] != undefined ? ac : "*";
                if((form = Rs.getDom(o.form))){
                    url = url || form.action;
                     if(o.isUpload || (/multipart\/form-data/i.test(form.getAttribute("enctype")))) {
                         return me.doFormUpload.call(me, o, p, url);
                     }
                    serForm = Rs.lib.Ajax.serializeForm(form);
                    p = p ? (p + '&' + serForm) : serForm;
                }
                o.headers = o.headers || {};
                o.headers[RS_METHOD] = m;
                o.headers[RS_DATATYPE] = o.dataType;
                o.headers[RS_ACCEPT] = o.accept;
                if(o.autoAbort === true || me.autoAbort) {
                    me.abort();
                }
                return (me.transId = Rs.lib.Ajax.request('POST', url, cb, p, o));
            }else {
                return o.callback ? o.callback.apply(o.scope, [o,UNDEFINED,UNDEFINED]) : null;
            }
        },

        /**
         * Determine whether this object has a request outstanding.
         * 
         * @param {Number} transactionId (Optional) defaults to the last transaction
         * @return {Boolean} True if there is an outstanding request.
         */
        isLoading : function(transId){
            return transId ? Rs.lib.Ajax.isCallInProgress(transId) : !! this.transId;
        },

        /**
         * Aborts any outstanding request.
         * 
         * @param {Number} transactionId (Optional) defaults to the last transaction
         */
        abort : function(transId){
            if(transId || this.isLoading()){
                Rs.lib.Ajax.abort(transId || this.transId);
            }
        },
        
        //private
        ajaxConvert : function(response, options){
        	var ct = response.getResponseHeader('Content-type'),
	        	data = response.responseText || response.responseXML,
	        	prev, 
	        	current,
	        	conversion;
	        
        	//实际数据类型
        	/*
        	for(var dt in ACCEPTS){
	        	if(ACCEPTS[dt].test(ct)){
	        		prev = dt;
	        		break;
	        	}
	        }
        	prev = prev == undefined ? '*' : prev;
	        */
        	prev = 'text';
        	
        	//期望数据类型
        	current = options && ACCEPTS[options.accept] ? options.accept : '*';
			
	        if(current == '*'){
	        	current = prev;
	        }else if(prev !== '*' && prev !== current){
	        	var conv = CONVERTERS[ prev + " " + current ] || CONVERTERS[ "* " + current ],
	        		conv1,
	        		conv2, 
	        		tmp;
				if ( !conv ) {
					conv2 = undefined;
					for( conv1 in CONVERTERS ) {
						tmp = conv1.split( " " );
						if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
							conv2 = CONVERTERS[ tmp[1] + " " + current ];
							if ( conv2 ) {
								conv1 = CONVERTERS[ conv1 ];
								if ( conv1 === true ) {
									conv = conv2;
								} else if ( conv2 === true ) {
									conv = conv1;
								}
								break;
							}
						}
					}
				}
				// If we found no converter, dispatch an error
				if ( !( conv || conv2 ) ) {
					Rs.error( "No conversion from " + prev + " to " + current);
				}
				// If found converter is not an equivalence
				if ( conv !== true ) {
					// Convert with 1 or 2 converters accordingly
					data = conv ? conv( data ) : conv2( conv1(data) );
				}
	        }
        	return data;
        },
        
        // private
        handleResponse : function(response){
            
        	this.transId = false;
            var options = response.argument.options;
            response.argument = options ? options.argument : null;
            if(this.fireEvent(BEFORECALLCOMPLATE, this, response, options) !== false){
            	
            	var data = this.ajaxConvert(response, options),
	    			succ = data.Success == true ? true : false,
	    			result = data.Result || {},
	    			ec = data.Error_Code || '',
	    			em = data.Error_Message || '';
	    			
            	if(options.success && succ === true){
                	this.fireEvent(CALLCOMPLATE, this, result, data, options, response);
                    options.success.call(options.scope, result, data, options, response);
                }
            	if(options.failure && succ === false){
            		this.fireEvent(CALLEXCEPTION, this, ec, em, data, options, response);
                    options.failure.call(options.scope, ec, em, data, options, response);
                }
                if(options.callback){
                    options.callback.call(options.scope, succ, result, ec, em, data, options, response);
                }
            }
            this.nextTask();
        },

        // private
        /*
        handleFailure : function(response, e){
            this.transId = false;
            var options = response.argument.options;
            response.argument = options ? options.argument : null;
            this.fireEvent(CALLEXCEPTION, this, response, options, e);
            if(options.failure){
                options.failure.call(options.scope, response, options);
            }
            if(options.callback){
                options.callback.call(options.scope, response, false, options);
            }
            this.nextTask();
        },
        */
        
        //private
        nextTask : function(){
        	if (this.taskQueue.length > 0) {
				var task = this.taskQueue.shift();
				this.call(task.options, task.callback, task.scope);
			}
        },
        
        // private
        doFormUpload : function(o, ps, url){
            var id = Rs.id(),
                doc = document,
                frame = doc.createElement('iframe'),
                form = Rs.getDom(o.form),
                hiddens = [],
                hd,
                encoding = 'multipart/form-data',
                buf = {
                    target: form.target,
                    method: form.method,
                    encoding: form.encoding,
                    enctype: form.enctype,
                    action: form.action
                },
                action = url || buf.action;

            Rs.fly(frame).set({
                id: id,
                name: id,
                cls: 'x-hidden',
                src : Rs.SSL_SECURE_URL
            });

            doc.body.appendChild(frame);

            // This is required so that IE doesn't pop the response up in a new window.
            if(Rs.isIE){
               document.frames[id].name = id;
            }
            
            //业务方法名称和请求数据类型追加在action后面作为参数传入，
            //这样后台就可以通过request.getParameter(“Rs-method”)
            //和request.getParameter(“Rs-accept”)获取参数了
            action += ("?" + RS_METHOD + "=" + o.method + "&" + RS_DATATYPE + "=" + o.dataType + "&" + RS_ACCEPT + "=" + o.accept);
            
            Rs.fly(form).set({
                target: id,
                method: POST,
                enctype: encoding,
                encoding: encoding,
                action: action
            });
            
            // add dynamic params
            Rs.iterate(Rs.urlDecode(ps, false), function(k, v){
                hd = doc.createElement('input');
                Rs.fly(hd).set({
                    type: 'hidden',
                    value: v,
                    name: k
                });
                form.appendChild(hd);
                hiddens.push(hd);
            });
            
            function cb(){
                var me = this,
                    // bogus response object
                    r = {responseText : '',
                         responseXML : null,
                         argument : o.argument},
                    doc,
                    firstChild;

                try{
                    doc = frame.contentWindow.document || frame.contentDocument || WINDOW.frames[id].document;
                    if(doc){
                        if(doc.body){
                            if(/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)){ // json response wrapped in textarea
                                r.responseText = firstChild.value;
                            }else{
                                r.responseText = doc.body.innerHTML;
                            }
                        }
                        //in IE the document may still have a body even if returns XML.
                        r.responseXML = doc.XMLDocument || doc;
                    }
                }
                catch(e) {}

                Rs.EventManager.removeListener(frame, LOAD, cb, me);

                me.fireEvent(REQUESTCOMPLETE, me, r, o);

                function runCallback(fn, scope, args){
                    if(Rs.isFunction(fn)){
                        fn.apply(scope, args);
                    }
                }

                runCallback(o.success, o.scope, [r, o]);
                runCallback(o.callback, o.scope, [o, true, r]);

                if(!me.debugUploads){
                    setTimeout(function(){Rs.removeNode(frame);}, 100);
                }
            }

            Rs.EventManager.on(frame, LOAD, cb, this);
            
            form.submit();

            Rs.fly(form).set(buf);
            Rs.each(hiddens, function(h) {
                Rs.removeNode(h);
            });
        }
        
    });
})();

/**
 * @class Rs.Service
 * A static {@link Rs.data.Service} instance that can be used to call services.  See
 * {@link Rs.data.Service} for supported methods.
 * <pre><code>
Rs.Service.call({
	url : 'service.jsp',
	method : 'getJSON',
	accept : 'json',
	params : { id : 100},
	success : function(sheet) {
		Rs.fly('out').update(sheet);
	}
});
</code></pre>
 * @singleton
 */
Rs.Service = new Rs.data.Service({
    autoAbort : false
});

/**
 * 调用后台的业务方法, 如果当前正在执行后台业务方法，尚未接收到响应，此时再
 * 调用call方法会进入任务队列，当上一次调用返回后方可执行下一次调用。
 * <b>Important:</b>发送请求到后台执行业务方法，可通过设置accept 来指
 * 定要获取的数据的类型 ：xml, html, script, json, text
 * @method call
 * @member Rs.Service
 * @param {Object} params
 * @param [{Function} callback]
 */
/**
 * @class Rs.util.JSON
 * @singleton <br/>
 */
Rs.util.JSON = new (function() {
	var useHasOwn = !! {}.hasOwnProperty, isNative = function() {
		var useNative = null;
		return function() {
			if (useNative === null) {
				useNative = Rs.USE_NATIVE_JSON && window.JSON
						&& JSON.toString() == '[object JSON]';
			}
			return useNative;
		};
	}(), pad = function(n) {
		return n < 10 ? "0" + n : n;
	}, doDecode = function(json) {
		return eval("(" + decodeURIComponent(decodeURIComponent(json)) + ")");
	}, doEncode = function(o) {
		if (!Rs.isDefined(o) || o === null) {
			return "null";
		} else if (Rs.isArray(o)) {
			return encodeArray(o);
		} else if (Rs.isDate(o)) {
			return Rs.util.JSON.encodeDate(o);
		} else if (Rs.isString(o)) {
			return encodeString(o);
		} else if (typeof o == "number") {
			// don't use isNumber here, since finite checks happen inside
			// isNumber
			return isFinite(o) ? String(o) : "null";
		} else if (Rs.isBoolean(o)) {
			return String(o);
		} else {
			var a = [ "{" ], b, i, v;
			for (i in o) {
				// don't encode DOM objects
				if (!o.getElementsByTagName) {
					if (!useHasOwn || o.hasOwnProperty(i)) {
						v = o[i];
						switch (typeof v) {
						case "undefined":
						case "function":
						case "unknown":
							break;
						default:
							if (b) {
								a.push(',');
							}
							a.push(doEncode(i), ":", v === null ? "null"
									: doEncode(v));
							b = true;
						}
					}
				}
			}
			a.push("}");
			return a.join("");
		}
	}, m = {
		"\b" : '\\b',
		"\t" : '\\t',
		"\n" : '\\n',
		"\f" : '\\f',
		"\r" : '\\r',
		'"' : '\\"',
		"\\" : '\\\\'
	}, encodeString = function(s) {
		if (/["\\\x00-\x1f]/.test(s)) {
			s = s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
				var c = m[b];
				if (c) {
					return c;
				}
				c = b.charCodeAt();
				return "\\u00" + Math.floor(c / 16).toString(16)
						+ (c % 16).toString(16);
			});
		}
		return '"' + encodeURIComponent(encodeURIComponent(s)) + '"';
	}, encodeArray = function(o) {
		var a = [ "[" ], b, i, l = o.length, v;
		for (i = 0; i < l; i += 1) {
			v = o[i];
			switch (typeof v) {
			case "undefined":
			case "function":
			case "unknown":
				break;
			default:
				if (b) {
					a.push(',');
				}
				a.push(v === null ? "null" : Rs.util.JSON.encode(v));
				b = true;
			}
		}
		a.push("]");
		return a.join("");
	};
	
	this.encodeDate = function(o) {
		return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-"
				+ pad(o.getDate()) + "T" + pad(o.getHours()) + ":"
				+ pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"';
	};

	/**
	 * Encodes an Object, Array or other value
	 * @param {Mixed}
	 *            o The variable to encode
	 * @return {String} The JSON string
	 */
	this.encode = function() {
		var ec;
		return function(o) {
			if (!ec) {
				// setup encoding function on first access
				ec = isNative() ? JSON.stringify : doEncode;
			}
			return ec(o);
		};
	}();

	/**
	 * Decodes (parses) a JSON string to an object. If the JSON is invalid, this
	 * function throws a SyntaxError unless the safe option is set.
	 * @param {String}
	 *            json The JSON string
	 * @return {Object} The resulting object
	 */
	this.decode = function() {
		var dc;
		return function(json) {
			if (!dc) {
				// setup decoding function on first access
				dc = isNative() ? JSON.parse : doDecode;
			}
			return dc(json);
		};
	}();

})();


/**
 * Shorthand for {@link Rs.util.JSON#encode}
 * @param {Mixed} o The variable to encode
 * @return {String} The JSON string
 * @member Rs
 * @method encode
 */
Rs.encode = Rs.util.JSON.encode;

/**
 * Shorthand for {@link Rs.util.JSON#decode}
 * @param {String} json The JSON string
 * @param {Boolean} safe (optional) Whether to return null or throw an exception if the JSON is invalid.
 * @return {Object} The resulting object
 * @member Rs
 * @method decode
 */
Rs.decode = Rs.util.JSON.decode;
(function(){
	
	/**
	 * @class Rs.Clipboard
	 * 用户可通过此类访问浏览器剪贴板，暂不支持chrome和safari两个版本的浏览器。
<pre><code>
Rs.onReady(function() {

    Rs.Clipboard.setData("剪贴板里的内容");
	    	    		
}, this);
</code></pre>
	 * @singleton
	 */
	Rs.Clipboard = (function(){
		
		//设置剪贴板里内容
		function copyToClipboard(txt){
	    	txt = ""+txt;
	    	if(window.clipboardData){
	    		window.clipboardData.clearData();
	    		window.clipboardData.setData("Text", txt);
	    		return true;
	    	}else if(navigator.userAgent.indexOf("Opera") != -1){   
	    		window.location = txt;
	    		return true;
	    	}else if(window.netscape){
	    		try{
	    			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");   
	    		}catch(e){
	    			alert("被浏览器拒绝!\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");   
	    		}
	    		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);   
	    		if (!clip){
	    			return false;
	    		}
	    		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);   
	    		if (!trans){
	    			return false;
	    		}
	    		trans.addDataFlavor('text/unicode');   
	    		var str = new Object(),
	    			len = new Object(),
	    			str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString),
	    			copytext = txt;
	    		str.data = copytext;
	    		trans.setTransferData("text/unicode",str,copytext.length*2);   
	    		var clipid = Components.interfaces.nsIClipboard;   
	    		if (!clip){
	    			return false;
	    		}
	    		clip.setData(trans, null, clipid.kGlobalClipboard);
	    		return true;
	    	}
	    };
		
		return {
			
			/**
			 * 给剪贴板里设置内容
		     * @method setData 
		     * @param {String} txt 文本内容 
		     * @return {Boolean} 是否设置成功
		     */
			setData : copyToClipboard
		};
	})();
	
})();
/**
 * @class Rs.util.MixedCollection
 * @extends Rs.util.Observable
 * A Collection class that maintains both numeric indexes and keys and exposes events.
 * @constructor
 * @param {Boolean} allowFunctions Specify <tt>true</tt> if the {@link #addAll}
 * function should add function references to the collection. Defaults to
 * <tt>false</tt>.
 * @param {Function} keyFn A function that can accept an item of the type(s) stored in this MixedCollection
 * and return the key value for that item.  This is used when available to look up the key on items that
 * were passed without an explicit key parameter to a MixedCollection method.  Passing this parameter is
 * equivalent to providing an implementation for the {@link #getKey} method.
 */
Rs.util.MixedCollection = function(allowFunctions, keyFn){
    this.items = [];
    this.map = {};
    this.keys = [];
    this.length = 0;
    this.addEvents(
        /**
         * @event clear
         * Fires when the collection is cleared.
         */
        'clear',
        /**
         * @event add
         * Fires when an item is added to the collection.
         * @param {Number} index The index at which the item was added.
         * @param {Object} o The item added.
         * @param {String} key The key associated with the added item.
         */
        'add',
        /**
         * @event replace
         * Fires when an item is replaced in the collection.
         * @param {String} key he key associated with the new added.
         * @param {Object} old The item being replaced.
         * @param {Object} new The new item.
         */
        'replace',
        /**
         * @event remove
         * Fires when an item is removed from the collection.
         * @param {Object} o The item being removed.
         * @param {String} key (optional) The key associated with the removed item.
         */
        'remove',
        'sort'
    );
    this.allowFunctions = allowFunctions === true;
    if(keyFn){
        this.getKey = keyFn;
    }
    Rs.util.MixedCollection.superclass.constructor.call(this);
};

Rs.extend(Rs.util.MixedCollection, Rs.util.Observable, {

    /**
     * @cfg {Boolean} allowFunctions Specify <tt>true</tt> if the {@link #addAll}
     * function should add function references to the collection. Defaults to
     * <tt>false</tt>.
     */
    allowFunctions : false,

    /**
     * Adds an item to the collection. Fires the {@link #add} event when complete.
     * @param {String} key <p>The key to associate with the item, or the new item.</p>
     * <p>If a {@link #getKey} implementation was specified for this MixedCollection,
     * or if the key of the stored items is in a property called <tt><b>id</b></tt>,
     * the MixedCollection will be able to <i>derive</i> the key for the new item.
     * In this case just pass the new item in this parameter.</p>
     * @param {Object} o The item to add.
     * @return {Object} The item added.
     */
    add : function(key, o){
        if(arguments.length == 1){
            o = arguments[0];
            key = this.getKey(o);
        }
        if(typeof key != 'undefined' && key !== null){
            var old = this.map[key];
            if(typeof old != 'undefined'){
                return this.replace(key, o);
            }
            this.map[key] = o;
        }
        this.length++;
        this.items.push(o);
        this.keys.push(key);
        this.fireEvent('add', this.length-1, o, key);
        return o;
    },

    /**
      * MixedCollection has a generic way to fetch keys if you implement getKey.  The default implementation
      * simply returns <b><code>item.id</code></b> but you can provide your own implementation
      * to return a different value as in the following examples:<pre><code>
// normal way
var mc = new Rs.util.MixedCollection();
mc.add(someEl.dom.id, someEl);
mc.add(otherEl.dom.id, otherEl);
//and so on

// using getKey
var mc = new Rs.util.MixedCollection();
mc.getKey = function(el){
   return el.dom.id;
};
mc.add(someEl);
mc.add(otherEl);

// or via the constructor
var mc = new Rs.util.MixedCollection(false, function(el){
   return el.dom.id;
});
mc.add(someEl);
mc.add(otherEl);
     * </code></pre>
     * @param {Object} item The item for which to find the key.
     * @return {Object} The key for the passed item.
     */
    getKey : function(o){
         return o.id;
    },

    /**
     * Replaces an item in the collection. Fires the {@link #replace} event when complete.
     * @param {String} key <p>The key associated with the item to replace, or the replacement item.</p>
     * <p>If you supplied a {@link #getKey} implementation for this MixedCollection, or if the key
     * of your stored items is in a property called <tt><b>id</b></tt>, then the MixedCollection
     * will be able to <i>derive</i> the key of the replacement item. If you want to replace an item
     * with one having the same key value, then just pass the replacement item in this parameter.</p>
     * @param o {Object} o (optional) If the first parameter passed was a key, the item to associate
     * with that key.
     * @return {Object}  The new item.
     */
    replace : function(key, o){
        if(arguments.length == 1){
            o = arguments[0];
            key = this.getKey(o);
        }
        var old = this.map[key];
        if(typeof key == 'undefined' || key === null || typeof old == 'undefined'){
             return this.add(key, o);
        }
        var index = this.indexOfKey(key);
        this.items[index] = o;
        this.map[key] = o;
        this.fireEvent('replace', key, old, o);
        return o;
    },

    /**
     * Adds all elements of an Array or an Object to the collection.
     * @param {Object/Array} objs An Object containing properties which will be added
     * to the collection, or an Array of values, each of which are added to the collection.
     * Functions references will be added to the collection if <code>{@link #allowFunctions}</code>
     * has been set to <tt>true</tt>.
     */
    addAll : function(objs){
        if(arguments.length > 1 || Rs.isArray(objs)){
            var args = arguments.length > 1 ? arguments : objs;
            for(var i = 0, len = args.length; i < len; i++){
                this.add(args[i]);
            }
        }else{
            for(var key in objs){
                if(this.allowFunctions || typeof objs[key] != 'function'){
                    this.add(key, objs[key]);
                }
            }
        }
    },

    /**
     * Executes the specified function once for every item in the collection, passing the following arguments:
     * <div class="mdetail-params"><ul>
     * <li><b>item</b> : Mixed<p class="sub-desc">The collection item</p></li>
     * <li><b>index</b> : Number<p class="sub-desc">The item's index</p></li>
     * <li><b>length</b> : Number<p class="sub-desc">The total number of items in the collection</p></li>
     * </ul></div>
     * The function should return a boolean value. Returning false from the function will stop the iteration.
     * @param {Function} fn The function to execute for each item.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the current item in the iteration.
     */
    each : function(fn, scope){
        var items = [].concat(this.items); // each safe for removal
        for(var i = 0, len = items.length; i < len; i++){
            if(fn.call(scope || items[i], items[i], i, len) === false){
                break;
            }
        }
    },

    /**
     * Executes the specified function once for every key in the collection, passing each
     * key, and its associated item as the first two parameters.
     * @param {Function} fn The function to execute for each item.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
     */
    eachKey : function(fn, scope){
        for(var i = 0, len = this.keys.length; i < len; i++){
            fn.call(scope || window, this.keys[i], this.items[i], i, len);
        }
    },

    /**
     * Returns the first item in the collection which elicits a true return value from the
     * passed selection function.
     * @param {Function} fn The selection function to execute for each item.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
     * @return {Object} The first item in the collection which returned true from the selection function.
     */
    find : function(fn, scope){
        for(var i = 0, len = this.items.length; i < len; i++){
            if(fn.call(scope || window, this.items[i], this.keys[i])){
                return this.items[i];
            }
        }
        return null;
    },

    /**
     * Inserts an item at the specified index in the collection. Fires the {@link #add} event when complete.
     * @param {Number} index The index to insert the item at.
     * @param {String} key The key to associate with the new item, or the item itself.
     * @param {Object} o (optional) If the second parameter was a key, the new item.
     * @return {Object} The item inserted.
     */
    insert : function(index, key, o){
        if(arguments.length == 2){
            o = arguments[1];
            key = this.getKey(o);
        }
        if(this.containsKey(key)){
            this.suspendEvents();
            this.removeKey(key);
            this.resumeEvents();
        }
        if(index >= this.length){
            return this.add(key, o);
        }
        this.length++;
        this.items.splice(index, 0, o);
        if(typeof key != 'undefined' && key !== null){
            this.map[key] = o;
        }
        this.keys.splice(index, 0, key);
        this.fireEvent('add', index, o, key);
        return o;
    },

    /**
     * Remove an item from the collection.
     * @param {Object} o The item to remove.
     * @return {Object} The item removed or false if no item was removed.
     */
    remove : function(o){
        return this.removeAt(this.indexOf(o));
    },

    /**
     * Remove an item from a specified index in the collection. Fires the {@link #remove} event when complete.
     * @param {Number} index The index within the collection of the item to remove.
     * @return {Object} The item removed or false if no item was removed.
     */
    removeAt : function(index){
        if(index < this.length && index >= 0){
            this.length--;
            var o = this.items[index];
            this.items.splice(index, 1);
            var key = this.keys[index];
            if(typeof key != 'undefined'){
                delete this.map[key];
            }
            this.keys.splice(index, 1);
            this.fireEvent('remove', o, key);
            return o;
        }
        return false;
    },

    /**
     * Removed an item associated with the passed key fom the collection.
     * @param {String} key The key of the item to remove.
     * @return {Object} The item removed or false if no item was removed.
     */
    removeKey : function(key){
        return this.removeAt(this.indexOfKey(key));
    },

    /**
     * Returns the number of items in the collection.
     * @return {Number} the number of items in the collection.
     */
    getCount : function(){
        return this.length;
    },

    /**
     * Returns index within the collection of the passed Object.
     * @param {Object} o The item to find the index of.
     * @return {Number} index of the item. Returns -1 if not found.
     */
    indexOf : function(o){
        return this.items.indexOf(o);
    },

    /**
     * Returns index within the collection of the passed key.
     * @param {String} key The key to find the index of.
     * @return {Number} index of the key.
     */
    indexOfKey : function(key){
        return this.keys.indexOf(key);
    },

    /**
     * Returns the item associated with the passed key OR index.
     * Key has priority over index.  This is the equivalent
     * of calling {@link #key} first, then if nothing matched calling {@link #itemAt}.
     * @param {String/Number} key The key or index of the item.
     * @return {Object} If the item is found, returns the item.  If the item was not found, returns <tt>undefined</tt>.
     * If an item was found, but is a Class, returns <tt>null</tt>.
     */
    item : function(key){
        var mk = this.map[key],
            item = mk !== undefined ? mk : (typeof key == 'number') ? this.items[key] : undefined;
        return typeof item != 'function' || this.allowFunctions ? item : null; // for prototype!
    },

    /**
     * Returns the item at the specified index.
     * @param {Number} index The index of the item.
     * @return {Object} The item at the specified index.
     */
    itemAt : function(index){
        return this.items[index];
    },

    /**
     * Returns the item associated with the passed key.
     * @param {String/Number} key The key of the item.
     * @return {Object} The item associated with the passed key.
     */
    key : function(key){
        return this.map[key];
    },

    /**
     * Returns true if the collection contains the passed Object as an item.
     * @param {Object} o  The Object to look for in the collection.
     * @return {Boolean} True if the collection contains the Object as an item.
     */
    contains : function(o){
        return this.indexOf(o) != -1;
    },

    /**
     * Returns true if the collection contains the passed Object as a key.
     * @param {String} key The key to look for in the collection.
     * @return {Boolean} True if the collection contains the Object as a key.
     */
    containsKey : function(key){
        return typeof this.map[key] != 'undefined';
    },

    /**
     * Removes all items from the collection.  Fires the {@link #clear} event when complete.
     */
    clear : function(){
        this.length = 0;
        this.items = [];
        this.keys = [];
        this.map = {};
        this.fireEvent('clear');
    },

    /**
     * Returns the first item in the collection.
     * @return {Object} the first item in the collection..
     */
    first : function(){
        return this.items[0];
    },

    /**
     * Returns the last item in the collection.
     * @return {Object} the last item in the collection..
     */
    last : function(){
        return this.items[this.length-1];
    },

    /**
     * @private
     * Performs the actual sorting based on a direction and a sorting function. Internally,
     * this creates a temporary array of all items in the MixedCollection, sorts it and then writes
     * the sorted array data back into this.items and this.keys
     * @param {String} property Property to sort by ('key', 'value', or 'index')
     * @param {String} dir (optional) Direction to sort 'ASC' or 'DESC'. Defaults to 'ASC'.
     * @param {Function} fn (optional) Comparison function that defines the sort order.
     * Defaults to sorting by numeric value.
     */
    _sort : function(property, dir, fn){
        var i, len,
            dsc   = String(dir).toUpperCase() == 'DESC' ? -1 : 1,

            //this is a temporary array used to apply the sorting function
            c     = [],
            keys  = this.keys,
            items = this.items;

        //default to a simple sorter function if one is not provided
        fn = fn || function(a, b) {
            return a - b;
        };

        //copy all the items into a temporary array, which we will sort
        for(i = 0, len = items.length; i < len; i++){
            c[c.length] = {
                key  : keys[i],
                value: items[i],
                index: i
            };
        }

        //sort the temporary array
        c.sort(function(a, b){
            var v = fn(a[property], b[property]) * dsc;
            if(v === 0){
                v = (a.index < b.index ? -1 : 1);
            }
            return v;
        });

        //copy the temporary array back into the main this.items and this.keys objects
        for(i = 0, len = c.length; i < len; i++){
            items[i] = c[i].value;
            keys[i]  = c[i].key;
        }

        this.fireEvent('sort', this);
    },

    /**
     * Sorts this collection by <b>item</b> value with the passed comparison function.
     * @param {String} direction (optional) 'ASC' or 'DESC'. Defaults to 'ASC'.
     * @param {Function} fn (optional) Comparison function that defines the sort order.
     * Defaults to sorting by numeric value.
     */
    sort : function(dir, fn){
        this._sort('value', dir, fn);
    },

    /**
     * Reorders each of the items based on a mapping from old index to new index. Internally this
     * just translates into a sort. The 'sort' event is fired whenever reordering has occured.
     * @param {Object} mapping Mapping from old item index to new item index
     */
    reorder: function(mapping) {
        this.suspendEvents();

        var items = this.items,
            index = 0,
            length = items.length,
            order = [],
            remaining = [],
            oldIndex;

        //object of {oldPosition: newPosition} reversed to {newPosition: oldPosition}
        for (oldIndex in mapping) {
            order[mapping[oldIndex]] = items[oldIndex];
        }

        for (index = 0; index < length; index++) {
            if (mapping[index] == undefined) {
                remaining.push(items[index]);
            }
        }

        for (index = 0; index < length; index++) {
            if (order[index] == undefined) {
                order[index] = remaining.shift();
            }
        }

        this.clear();
        this.addAll(order);

        this.resumeEvents();
        this.fireEvent('sort', this);
    },

    /**
     * Sorts this collection by <b>key</b>s.
     * @param {String} direction (optional) 'ASC' or 'DESC'. Defaults to 'ASC'.
     * @param {Function} fn (optional) Comparison function that defines the sort order.
     * Defaults to sorting by case insensitive string.
     */
    keySort : function(dir, fn){
        this._sort('key', dir, fn || function(a, b){
            var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        });
    },

    /**
     * Returns a range of items in this collection
     * @param {Number} startIndex (optional) The starting index. Defaults to 0.
     * @param {Number} endIndex (optional) The ending index. Defaults to the last item.
     * @return {Array} An array of items
     */
    getRange : function(start, end){
        var items = this.items;
        if(items.length < 1){
            return [];
        }
        start = start || 0;
        end = Math.min(typeof end == 'undefined' ? this.length-1 : end, this.length-1);
        var i, r = [];
        if(start <= end){
            for(i = start; i <= end; i++) {
                r[r.length] = items[i];
            }
        }else{
            for(i = start; i >= end; i--) {
                r[r.length] = items[i];
            }
        }
        return r;
    },

    /**
     * Filter the <i>objects</i> in this collection by a specific property.
     * Returns a new collection that has been filtered.
     * @param {String} property A property on your objects
     * @param {String/RegExp} value Either string that the property values
     * should start with or a RegExp to test against the property
     * @param {Boolean} anyMatch (optional) True to match any part of the string, not just the beginning
     * @param {Boolean} caseSensitive (optional) True for case sensitive comparison (defaults to False).
     * @return {MixedCollection} The new filtered collection
     */
    filter : function(property, value, anyMatch, caseSensitive){
        if(Rs.isEmpty(value, false)){
            return this.clone();
        }
        value = this.createValueMatcher(value, anyMatch, caseSensitive);
        return this.filterBy(function(o){
            return o && value.test(o[property]);
        });
    },

    /**
     * Filter by a function. Returns a <i>new</i> collection that has been filtered.
     * The passed function will be called with each object in the collection.
     * If the function returns true, the value is included otherwise it is filtered.
     * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key)
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to this MixedCollection.
     * @return {MixedCollection} The new filtered collection
     */
    filterBy : function(fn, scope){
        var r = new Rs.util.MixedCollection();
        r.getKey = this.getKey;
        var k = this.keys, it = this.items;
        for(var i = 0, len = it.length; i < len; i++){
            if(fn.call(scope||this, it[i], k[i])){
                r.add(k[i], it[i]);
            }
        }
        return r;
    },

    /**
     * Finds the index of the first matching object in this collection by a specific property/value.
     * @param {String} property The name of a property on your objects.
     * @param {String/RegExp} value A string that the property values
     * should start with or a RegExp to test against the property.
     * @param {Number} start (optional) The index to start searching at (defaults to 0).
     * @param {Boolean} anyMatch (optional) True to match any part of the string, not just the beginning.
     * @param {Boolean} caseSensitive (optional) True for case sensitive comparison.
     * @return {Number} The matched index or -1
     */
    findIndex : function(property, value, start, anyMatch, caseSensitive){
        if(Rs.isEmpty(value, false)){
            return -1;
        }
        value = this.createValueMatcher(value, anyMatch, caseSensitive);
        return this.findIndexBy(function(o){
            return o && value.test(o[property]);
        }, null, start);
    },

    /**
     * Find the index of the first matching object in this collection by a function.
     * If the function returns <i>true</i> it is considered a match.
     * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key).
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to this MixedCollection.
     * @param {Number} start (optional) The index to start searching at (defaults to 0).
     * @return {Number} The matched index or -1
     */
    findIndexBy : function(fn, scope, start){
        var k = this.keys, it = this.items;
        for(var i = (start||0), len = it.length; i < len; i++){
            if(fn.call(scope||this, it[i], k[i])){
                return i;
            }
        }
        return -1;
    },

    /**
     * Returns a regular expression based on the given value and matching options. This is used internally for finding and filtering,
     * and by Rs.data.Store#filter
     * @private
     * @param {String} value The value to create the regex for. This is escaped using Rs.escapeRe
     * @param {Boolean} anyMatch True to allow any match - no regex start/end line anchors will be added. Defaults to false
     * @param {Boolean} caseSensitive True to make the regex case sensitive (adds 'i' switch to regex). Defaults to false.
     * @param {Boolean} exactMatch True to force exact match (^ and $ characters added to the regex). Defaults to false. Ignored if anyMatch is true.
     */
    createValueMatcher : function(value, anyMatch, caseSensitive, exactMatch) {
        if (!value.exec) { // not a regex
            var er = Rs.escapeRe;
            value = String(value);

            if (anyMatch === true) {
                value = er(value);
            } else {
                value = '^' + er(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
         }
         return value;
    },

    /**
     * Creates a shallow copy of this collection
     * @return {MixedCollection}
     */
    clone : function(){
        var r = new Rs.util.MixedCollection();
        var k = this.keys, it = this.items;
        for(var i = 0, len = it.length; i < len; i++){
            r.add(k[i], it[i]);
        }
        r.getKey = this.getKey;
        return r;
    }
});
/**
 * This method calls {@link #item item()}.
 * Returns the item associated with the passed key OR index. Key has priority
 * over index.  This is the equivalent of calling {@link #key} first, then if
 * nothing matched calling {@link #itemAt}.
 * @param {String/Number} key The key or index of the item.
 * @return {Object} If the item is found, returns the item.  If the item was
 * not found, returns <tt>undefined</tt>. If an item was found, but is a Class,
 * returns <tt>null</tt>.
 */
Rs.util.MixedCollection.prototype.get = Rs.util.MixedCollection.prototype.item;
Rs.apply(Rs, {
	
    /**
     * 系统主题
     */
    Themes : (function(){
        
        return {
            
            'blue' : ['resources/css/xtheme-blue.css'],
            
            'gray' : ['resources/css/xtheme-gray.css'],
            
            'access' : ['resources/css/xtheme-access.css'],
            
            'black' : ['resources/css/xtheme-black.css'],
            
            'blue03' : ['resources/css/xtheme-blue03.css'],
            
            'brown' : ['resources/css/xtheme-brown.css'],
            
            'brown02' : ['resources/css/xtheme-brown02.css'],
            
            'green' : ['resources/css/xtheme-green.css'],
            
            'pink' : ['resources/css/xtheme-pink.css'],
            
            'purple' : ['resources/css/xtheme-purple.css'],
            
            'red03' : ['resources/css/xtheme-red03.css']
                       
        };
        
    })(),
    
	/**
	 * 引入第三方类库 
	 */
	Libraries : (function() {

		return {
			
		    'ext-3.3.1' : {
                js : ['lib/ext-3.3.1/adapter/ext/ext-base.js', 
                      'lib/ext-3.3.1/ext-all.js',
                      'lib/ext-3.3.1/override.js',
                      'ext/rs-ext-mini.js',
                      'lib/ext-3.3.1/src/locale/ext-lang-zh_CN.js'
                      ],
                css : ['lib/ext-3.3.1/resources/css/ext-all-notheme.css',
                       'ext/resources/css/rs-ext-mini.css'],
                getTheme : function(theme){
		            return 'lib/ext-3.3.1/resources/css/xtheme-' + theme + '.css';
                }
            },
            
            'ext-3.3.1-debug' : {
                js : ['lib/ext-3.3.1/adapter/ext/ext-base-debug.js', 
                      'lib/ext-3.3.1/ext-all-debug.js',
                      'lib/ext-3.3.1/override.js',
                      'ext/rs-ext-debug.js',
                      'lib/ext-3.3.1/src/locale/ext-lang-zh_CN.js'],
                css : ['lib/ext-3.3.1/resources/css/ext-all-notheme.css',
                       'ext/resources/css/rs-ext-all.css'],
                getTheme : function(theme){
                    return 'lib/ext-3.3.1/resources/css/xtheme-' + theme + '.css';
                }
            },
            
            'jquery-1.5' : {
                js : ['lib/jquery/jquery-1.5.min.js'],
                getTheme : function(){return;}
            },
            
            'jquery-1.5-debug' : {
                js : ['lib/jquery/jquery-1.5.js'],
                getTheme : function(){return;}                      
            }

		};

	})()
});
Rs.ns("Rs.app");

(function() {
    
    /**
     * @class Rs.app.Application
     * @extends Rs.util.Observable
     * 应用程序类。
     * 应用程序描述文件示例:
     * <pre><code>
        R = (function() {

            return {
                id : 'app_store',
                name : '应用商店',
                icon16 : 'app-store-icon16',
                js : ['AppStore.js'],
                css : ['css/main.css'],
                objCfg : 'rs.acct.AppStore'
            };
        
        })(); 
     * </code></pre>
     * 应用程序创建方法如下:
     * <pre><code>
        Rs.define('tab1', {

            config : {
                html : '窗口'
            },
        
            constructor : function(config) {
                this.initConfig(config);
            },
        
            mixins : [ Rs.app.Main ]
        
        });
     * </code></pre>
     * @constructor
     * @param config
     * @param engine
     */
    Rs.app.Application = function(config, engine) {
        
        config = config || {};
        Rs.apply(this, config);
        this.engine = engine;
        
        Rs.app.Application.superclass.constructor.call(this);
        
        this.addEvents(
            /**
             * @event loadresfile
             * 当加载完该应用程序的资源文件后触发该事件
             * @param {Rs.app.Application} this
             */
            'loadresfile',
            
            /**
             * @event beforeinstall
             * 当安装该应用程序之前触发该事件,如果该事件监听着返回false则终止安装
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             * @param {Number} index
             */
            'beforeinstall',
            
            /**
             * @event install
             * 当该应用程序安装完成后触发该事件
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             */
            'install',
            
            /**
             * @event installfailed
             * 当该应用程序安装失败后触发该事件
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             */
            'installfailed',
            
            /**
             * @event beforeshow
             * 当应用程序显示之前触发该事件,如果该事件的回调方法返回false则终止显示该应用程序
             * @param {Rs.app.Application} this
             */
            'beforeopen',
            
            /**
             * @event show
             * 当应用程序显示的时候触发该事件
             * @param {Rs.app.Application} this
             */
            'open',
            
            /**
             * @event beforeclose
             * 当应用程序关闭之前触发该事件,如果该事件的回调方法返回false则终止关闭
             * @param {Rs.app.Application} this
             */
            'beforeclose',
            
            /**
             * @event close
             * 当应用程序关闭之后执行该方法
             * @param {Rs.app.Application} this
             */
            'close'
        );
        
        //region is an object 
        var r = this.region;
        if(Rs.isObject(r)){
            this.regionId = r.rid;
            this.regionCfg = Rs.apply(this.regionCfg || {}, r);;
            delete this.region;
        }else if(Rs.isString(r)){
            this.regionId = r;
            delete this.region;
        }
    };

    Rs.extend(Rs.app.Application, Rs.util.Observable, {
        
        /**
         * @cfg {String} id
         * 应用程序唯一ID
         */
        
        /**
         * @cfg {String} name
         * 应用程序名称
         */
        
        /**
         * @cfg {String} icon8
         * 应用程序图标 8*8, 默认值为'rs-app-default-icon8'
         */
        
        /**
         * @cfg {String} icon16
         * 应用程序图标 16*16, 默认值为'rs-app-default-icon16'
         */
        
        
        /**
         * @cfg {String} icon32
         * 应用程序图标 32*32, 默认值为'rs-app-default-icon32'
         */
        
        /**
         * @cfg {object} region
         * 程序位置配置信息
         */
        
        /**
         * @cfg {String} folder
         * 应用程序所在文件夹路径，如果应用程序为内置程序，可简单配置为 BUILDINS/app_folder。 
         */
        
        /**
         * @cfg {String} objCfg 
         * 应用程序obj对象配置属性
         * <pre><code>
         * objCfg : {
         *     cfg : {}, //构造参数,默认值为{}
         *     clazz : 'AcctTree', //obj类名, 必输参数
         *     main : 'main', //应用程序入口方法,默认值为main,该方法传入参数为固定的engine 和 region
         *     provider : 'createInstance', //对象创建方法,该方法返回一个obj对象
         *     release : 'relaase' //程序关闭时释放方法,非必须参数 
         * }
         * 
         * objCfg : 'AcctTree' //只声明类名,main provider 使用默认值
         * </code></pre>
         */
        
        /**
         * @cfg {Boolean} autoRun
         * 程序是否自动运行
         */
        autoRun : false,
        
        //private
        running : false,
        
        /**
         * @cfg {Array} js
         * JS文件名字列表,相对folder文件夹的位置。
         */
        
        /**
         * @cfg {Array} css
         * app特有CSS样式表文件列表,相对folder文件夹的位置
         */
        
        //private  资源文件是否加载完成
        resFileLoaded : false,
        
        //private
        installed : false,
        
        /**
         * @cfg {String} resFileName
         * 应用程序描述文件名称
         */
        resFileName : 'R.js',
        
        // private 加载应用程序描述文件
        loadResFile : function(callback, scope){
            if(this.resFileLoaded !== true){
                var folder = this.getRealFolder(),
                    src = folder + "/" + this.resFileName;
                Rs.lr(src, function(){
                    if(R){
                        this.resFileLoaded = true;
                        this.resFileConfig = R;
                        Rs.applyIf(this, R);
                        this.fireEvent('loadresfile', this, R);
                        R = null;
                    }else {
                        Rs.error(src + ' file error!');
                    }
                    if(Rs.isFunction(callback)){
                        callback.call(scope || this, this);
                    }
                }, this, this.engine.environment.clearCache? true : false);//this.clearCache? true : false);
            }else {
                if(Rs.isFunction(callback)){
                    callback.call(scope || this, this);
                }
            }
        },
        
        /**
         * 获取应用程序ID
         * @method getId
         * @return {String} id
         */
        getId : function(){
            return this.id;
        },
        
        /**
         * 获取该应用程序所在文件夹路径
         * @method getFolder
         * @return {String} folder
         */
        getFolder : function(){
            return this.folder;
        },
        
        /**
         * 对于内置应用程序,配置其folder 属性为 BUILDINS/app_folder
         * 通过该方法可获取实际的文件夹路径
         * @method getRealFolder
         * @return {String} readFolder
         */
        getRealFolder : function(){
            var folder = this.folder;
            if(folder.length > 9 && folder.substr(0, 9) == 'BUILDINS/'){
                folder = Rs.BASE_PATH + '/build-in_apps/' + folder.substr(9);
            }
            return folder;
        },
        
        
        /**
         * 获取应用程序名称
         * @method getName
         */
        getName : function(){
           return this.name; 
        },
        
        /**
         * 获取应用程序图标8*8
         * @method getIcon8
         */
        getIcon8 : function(){
            return this.icon8 || 'rs-app-default-icon8';
        },
        
        /**
         * 获取应用程序图标16*16
         * @method getIcon16
         */
        getIcon16 : function(){
            return this.icon16 || 'rs-app-default-icon16';
        },
        
        /**
         * 获取应用程序图标32*32
         * @method getIcon32
         */
        getIcon32 : function(){
            return this.icon23 || 'rs-app-default-icon23';
        },
        
        /**
         * 获取应用程序位置ID
         * @method getRegionId
         * @return {String} the id of region
         */
        getRegionId : function(){
            return this.regionId;
        },
        
        /**
         * 获取应用程序位置配置信息
         * @method getRegionCfg
         * @return {Object} regionCfg 
         */
        getRegionCfg : function(){
            return Rs.apply({}, this.regionCfg);
        },
        
        /**
         * 获取该应用程序安装后的位置
         * @method getRegion
         * @return {Region} region
         */
        getRegion : function(){
            return this.region;
        },
        
        //private
        loadRes : function(callback, scope){
            var js = this.js || [],
                css = this.css || [];
            this.loadResList([].concat(css, js), callback, scope);
        },
        
        //private
        loadResList : function(list, callback, scope){
            var file = list.shift();
            if(file){
                var folder = this.getRealFolder(),
                    src = folder + "/" + file;
                Rs.lr(src, this.goOnLoadResFile.createDelegate(this, 
                        [this.loadResList, list, callback, scope], false), this, this.engine.environment.clearCache? true : false);
            }else {
                this.fireEvent('loadresfile', this, this.js, this.css);
                callback.call(scope || this, this);
            }
        },
        
        //private
        goOnLoadResFile:function(fun, list, callback, scope){
            fun.call(this, list, callback, scope);
        },
        
        /*
         * 安装该应用程序之前执行该方法,如果该方法返回false则终止安装
         */
        onBeforeInstall : Rs.emptyFn,
        
        /**
         * 应用程序安装,如果当前对象所在文件夹下应用程序的其他实例,则不再加载资源文件,
         * 如果存在相同ID的改应用程序实例,则当前应用程序实例销毁,返回原有的实例.
         * @method onInstall
         * @param {Engine} engine
         * @param {Region} region
         * @param {Number} index
         * @param {Function} callback 回调方法,执行该回调方法时传入参数为succ, succ为true表示安装成功
         * @param {Objecat} scope
         */
        onInstall : function(engine, region, index, callback, scope) {
            if(!this.installed && this.fireEvent('beforeinstall', engine, this, region, index)
                    && this.onBeforeInstall(engine, this, region, index) !== false){
                var apps = Rs.app.AppMgr.getAppsByFolder(this.folder) || [], 
                    len = apps.length,
                    installFn = function(app, engine, region, callback, scope){
                        //当ResFile文件加载完毕之后，将该应用程序注册到应用程序管理类中
                        Rs.app.AppMgr.add(app);
                        app.doInstall(engine, region, callback, scope);
                    };
                if(len > 0){
                    //如果存在该文件夹下的应用程序的实例,则取其一，
                    //将其从应用程序描述文件(R.js)中获取的配置信息
                    //应用当前对象
                    Rs.applyIf(this, apps[0].resFileConfig);
                    //判断是否存在和当前对象ID相同的应用程序实例
                    //如果存在则终止安装,执行回调方法的时候传入参
                    //数为安装成功标记和已经安装的相同ID的应用程序实例
                    var id = this.getId(), i, app;
                    for(i = 0; i < len; i++){
                        app = apps[i];
                        if(app && app.getId() == id){
                            if(Rs.isFunction(callback)){
                                callback.call(scope || this, true, app);
                            }
                            return ;
                        }
                    }
                    if(i == len){
                        installFn(this, engine, region, callback, scope);
                    }
                }else {
                    //不存在该文件夹下的应用程序实例,
                    //加载该文件夹下的应用程序描述文件(R.js)
                    this.loadResFile(function(){
                        //加载该应用程序的资源文件(css & js)
                        this.loadRes(function(){
                            installFn(this, engine, region, callback, scope);
                        }, this);
                    }, this);
                }
            }
        },
        
        //安装应用程序
        doInstall : function(engine, region, callback, scope){
            var onDoInstall = function(succ, app){
                if(Rs.isFunction(callback)){
                    callback.call(scope || this, succ, succ ? app : undefined);
                }
            }, succ = true;
            try{
                this.engine = engine;
                this.region = region;
                this.relayEvents(region, ['resize', 'move']);
                if(this.autoRun === true){
                    this.run();
                }
                this.installed = true;
                this.fireEvent('install', engine, this, region);
                region.applyApp(this);
            }catch(e){
                succ = false;
                Rs.error('安装应用程序失败');
                this.fireEvent('installfailed', engine, this, region);
            };
            onDoInstall(succ, this);
        },
        
        /**
         * 获取obj对象配置参数
         * @method getObjCfg
         * @return {Object} objCfg
         */
        getObjCfg : function(){
            var objCfg = this.objCfg;
            if(Rs.isString(objCfg)){
                objCfg = {
                    clazz : objCfg
                };
            }
            return Rs.apply({
                cfg : {},
                main : 'main'/*,
                provider : 'createInstance'*/
            }, objCfg);
        },
        
        /**
         * 获取应用程序对象
         * @method getObj
         * @return {Object} obj
         */
        getObj : function(){
            var obj = this.obj;
            if(!obj){
                var objCfg = this.getObjCfg(),
                    cfg = objCfg.cfg,
                    clazz = objCfg.clazz/*, provider = objCfg.provider*/; 
                
                obj = this.obj = Rs.create(clazz, cfg);
                //obj = this.obj = eval(clazz + '.prototype.' + provider + '(cfg)');
            }
            return obj;
        },
        
        /**
         * 应用程序运行之前执行该方法，如果该方法返回false则终止执行
         * @method onBeforeRun
         * @return {Boolean}
         */
        onBeforeRun : Rs.emptyFn,
        
        /**
         * 运行应用程序,成功返回true，反之则返回false
         * @method run
         * @return {Boolean}
         */
        run : function(){
            var engine = this.engine;
            //确保该应用程序已经具有obj
            if(this.running != true && this.getObj() 
                && this.fireEvent('beforerun', engine, this)
                && this.onBeforeRun(engine, this) !== false){
                try{
                    //运行该应用程序的入口方法
                    region = this.region;
                    this.obj[this.getObjCfg().main](engine, region, this);
                    this.running = true;
                    this.fireEvent('run', engine, this);
                    return true;
                }catch(e){
                    Rs.error('运行应用程序发生异常');
                    return false;
                }
            }
            return false;
        },
        
        /**
         * 关闭程序之前执行该方法,如果该方法返回false则终止关闭
         * @method onBeforeShut
         * @return {Boolean} bool
         */
        onBeforeShut : Rs.emptyFn,
        
        /**
         * 关闭应用程序,成功返回true，反之则返回false
         * @method shut
         * @return {Boolean}
         */
        shut : function(){
            var engine = this.engine;
            if(this.running == true && this.getObj()
                    && this.fireEvent('beforeshut', engine, this)
                    && this.onBeforeShut(engine, this) !== false){
                try{
                    //运行应用程序关闭方法
                    var release = this.getObjCfg().release;
                    if(release && Rs.isString(release) 
                        && Rs.isFunction(this.obj[release])){
                        this.obj[release](engine, region, this);
                    }
                    this.running = false;
                    this.fireEvent('shut', engine, this);
                    return true;
                }catch(e){
                    Rs.error('关闭应用程序发生异常');
                    return false;
                }
            }else {
                return false;
            }
        },
        
        /**
         * 显示应用程序窗口或展开面板之前执行该方法,如果该方法返回false则取消打开
         * 在显示应用程序之前必须确保其已经执行 
         * @method onBeforeOpen
         */
        onBeforeOpen : Rs.emptyFn,
        
        /**
         * 显示应用程序窗口或展开面板
         * 在region的applyApp方法中实例该方法
         * @method show
         * @param {Boolean} behind 是否打开应用程序面板,当传入参数为true时才后台运行,
         * 如果是border类型的shell表示是否展开东西南北方向上的面板,如果是window或tab
         * 类型的shell,则表示是否打开窗口.
         */
        open : function(behind){
            var region = this.region;
            if(region && this.fireEvent('beforeopen', this) !== false
                && this.onBeforeOpen(this, region) !== false){
                //如果当前应用程序尚未启动则启动该应用程序
                if(this.running !== true){
                    this.run();
                }
                if(behind !== true){
                    //打开应用程序面板
                    region.open();
                    this.fireEvent('open', this);
                }else {
                    //不打开应用程序面板
                    this.fireEvent('behindopen', this);
                }
                this.openFlag = true;
                this.afterOpen();
            }
        },
        
        /**
         * 打开该应用程序之后执行该方法
         * @method afterOpen
         */
        afterOpen : Rs.emptyFn,
        
        /**
         * 关闭应用程序窗口或合并面板之前执行该方法,如果该方法返回false则取消关闭
         * @method onBeforeClose
         */
        onBeforeClose : Rs.emptyFn,
        
        /**
         * 关闭应用程序窗口或合并面板
         * 在region的applyApp方法中实例该方法
         * @method close
         */
        close : function(){
            var region = this.region;
            if(region && this.fireEvent('beforeclose', this) 
                && this.onBeforeClose() !== false){
                //如果应用程序正在运行,则关闭该应用程序
                if(this.running == true){
                    this.shut();
                }
                //关闭应用程序面板
                region.close();
                this.openFlag = false;
                this.fireEvent('close', this);
                this.afterClose();
            }
        },
        
        /**
         * 关闭应用程序之后执行该方法
         * @method afterClose
         */
        afterClose : Rs.emptyFn, 
        
        /**
         * 判断该应用程序是否正在运行
         * @method isOpen
         * @return {Boolean}
         */
        isOpen : function(){
            return this.openFlag === true;
        }, 
        
        /**
         * 获取应用程序状态信息,并将其保存到后台服务器,
         * @method getState
         * @return {Object} state
         */
        getState : function(){
            var state = {},
                region = this.getRegion();
            if(region){
                Rs.apply(state, {
                    region : region.getState()
                });
            }
            return  state;
        },
        
        /**
         * 应用程序偏好信息
         * @method applyState
         */
        applyState : function(state){
            //修改应用程序配置信息
            
            
            //修改应用程序位置信息
            var region = this.getRegion(),
                regionCfg = state && state.region ? state.region : undefined;
            if(region && Rs.isFunction(region.applyState) && regionCfg){
                this.on('open', function(){
                    region.applyState(regionCfg);
                }, this, {
                   scope : this,
                   single : true
                });
            }
        }
        
    });

    /**
     * 应用程序管理类
     * @class Rs.app.AppMgr
     * @constructor
     */
    Rs.app.AppMgr = function(){
        
        var keyFn = function(app){
            return app.getId();
        };
        
        var all = new Rs.util.MixedCollection(false, keyFn);

        return {
            
            /**
             * 添加应用程序
             * @method add 
             */
            add : function(app){
                all.add(app);
            },
            
            /**
             * 获取应用程序
             * @method get
             * @param {String} id 应用程序id
             * @return {Rs.app.Application}
             */
            get : function(id){
                return all.get(id);
            },
            
            /**
             * 删除应用程序
             * @method remove
             */
            remove : function(app){
                all.remove(app);
            },
            
            /**
             * 通过文件夹路径获取应用程序实例
             * @method getAppsByFolder
             * @param {String} folder 文件夹地址
             * @return {Array} apps
             */
            getAppsByFolder : function(folder){
                var apps = [];
                all.each(function(app){
                    if(app.getFolder() === folder){
                        apps.push(app);
                    }
                }, this);
                return apps;
            },
            
            //private
            all : all
            
        };
    }();
    
})();
Rs.ns("Rs.app");

(function() {
    
    /**
     * @class Rs.app.EventBus
     * @extends Rs.util.Observable
     * 负责传递app事件，包括响应和抛出
     * 向Rs.app.EventBus注册事件示例：
     * <pre><code>
        Rs.EventBus.register(this, 'addwindow', ['adddim']);
     * </code></pre>
     * 监听Rs.app.EventBus事件示例：
     * <pre><code>
        Rs.EventBus.on('addwindow-adddim', this.onAddDim, this);
     * </code></pre>
     * @constructor
     * @param {Object} config
     */
    Rs.app.EventBus = function(config) {
        config = config || {};
        Rs.apply(this, config);
        Rs.app.EventBus.superclass.constructor.call(this);
        this.bus = new Rs.util.MixedCollection();
    };

    Rs.extend(Rs.app.EventBus, Rs.util.Observable, {

        /**
         * @cfg {String} separator
         * 分隔符
         */
        separator : '-',

        /**
         * 注册添加到BUS上的对象
         * @method register
         * @param {Object} o
         * @param {String} prefix
         * @param {Array} events 
         */
        register : function(o, prefix, events) {
            prefix = (Rs.isString(prefix) ? prefix : '') + this.separator;
            this.relayBusEvents(o, prefix, events);
            this.bus.add(prefix, o);
        },

        //private
        relayBusEvents : function(o, prefix, events) {
            var me = this;
            function createHandler(ename) {
                return function() {
                    return me.fireEvent.apply(me, [ ename ]
                            .concat(Array.prototype.slice.call(arguments, 0)));
                };
            }
            for ( var i = 0, len = events.length; i < len; i++) {
                var ename = events[i],
                    ename2 = prefix + ename;
                me.events[ename2] = me.events[ename2] || true;
                o.on(ename, createHandler(ename2), me);
            }
        },

        //取消注册
        unregister : function(c) {
            this.bus.remove(c);
        }

    });

    /**
     * @class Rs.EventBus 
     * 事件总线
     */
    Rs.EventBus = new Rs.app.EventBus({});

})();
Rs.ns("Rs.app");
(function(Rs) {

    /**
     * @class Rs.app.Engine
     * @extends Rs.util.Observable
     * 应用程序引擎,通过以下方法创建应用程序引擎
     * <pre><code>
        Rs.engine({
            
            shell : 'border', //shell 类型
            
            onBeforeInitEngine : function(){
                Rs.BASE_PATH = '/rs/js/rs';
            },
            
            libraries : ['ext-3.3.1'],
            
            apps : [{
                folder : 'gridPanel',
                region : 'center'
            }, {
                folder : 'queryPanel',
                region : {
                    rid : 'north', // border类型分东南西北，windowregion此项缺省，tab类型此项为'tab'
                    height : 200,
                    collapsible : true,
                    collapsed : false,
                    minHeight : 100,
                    maxHeight : 300
                }
            }]
        });

     * </code></pre>
     * @constructor
     * @param {Object} config
     */
    Rs.app.Engine = function(config) {
        
        config = config || {};
        
        this.initialConfig = config;
        
        Rs.apply(this, config);
        
        Rs.app.Engine.superclass.constructor.call(this);
        
        this.addEvents(
            /**
             * @event beforeinitialized
             * 应用程序引擎初始化之前触发该事件
             * @param {Rs.app.Engine} this
             */
            'beforeinitialized',
            
            /**
             * @event initialize
             * 应用程序引擎初始化完毕之后触发该事件
             * @param {Rs.app.Engine} this
             */
            'initialize',
            
            /**
             * @event importlibraries
             * 当引入第三方类库时触发该事件
             * @param {Rs.app.Engine} this
             * @param {Array} libraries
             */
            'importlibraries',
            
            /**
             * @event beforelaunch
             * 启动该引擎之前触发该事件
             * @param {Rs.app.Engine} this
             */
            'beforelaunch',
            
            /**
             * @event launch
             * 启动该引擎之后触发该事件
             * @param {Rs.app.Engine} this
             */
            'launch',
            
            /**
             * @event beforeinstall
             * 安装应用程序之前触发该事件
             * @param {Rs.app.Engine} this
             * @param {Rs.app.Application} app
             * @param {Number} index
             */
            'beforeinstall',
            
            /**
             * @event install
             * 安装应用程序之后触发该事件
             * @param {Rs.app.Engine} this
             * @param {Rs.app.Appliaction} app
             */
            'install',
            
            /**
             * @event beforestatesave
             * 保存用户偏好设置之前触发该事件
             * @param {Rs.app.Engine} this
             * @param {Object} state
             */
            'beforestatesave',
            
            /**
             * @event statesave
             * 保存用户偏好信息之后触发该事件
             * @param {Rs.app.Engine} this
             * @param {Object} state
             */
            'statesave', 
            
            /**
             * @event themechange
             * 当页面样式发生变化的时候触发该事件
             * @param {String} newTheme
             * @param {String} oldTheme
             */
            'themechange'
            );
    };

    Rs.extend(Rs.app.Engine, Rs.util.Observable, {
        
        //private
        initialized : false,
        
        //private 是否启动标记
        launched : false,
        
        /**
         * @cfg {Boolean} autoLaunch
         * 是否自启动,默认值为true
         */
        autoLaunch : true,
        
        /**
         * @cfg {Array} apps
         * 应用程序列表
         */
        
        /**
         * @cfg {String} theme
         * 系统页面主题,默认样式为blue浅蓝色,另外可选'grey'和'black'
         */
        theme : 'blue',
        
        /**
         * @cfg {Array} libraries
         * 引入第三方框架, 引入第三方框架时候需要设置Rs.BASE_PATH为第三方框架所在目录的绝对路径
         * 可用框架有'ext-3.3.1'，'ext-3.3.1-debug'，'jquery-1.5'和'jquery-1.5-debug'
         * eg : libraries : ['ext-3.3.1']
         */
        libraries : [],
        
        /**
         * @cfg {String} stateId
         * 页面偏好信息存储ID
         */
        
        /**
         * @cfg {Boolean} stateful
         * 是否自动保存用户偏好设置,默认值为false,表示不自动保存用户偏好设置
         */
        stateful : false,
        
        /**
         * @cfg {Array} stateEvents
         * 当以下事件触发的时候将用户信息保存
         */
        
        /**
         * @cfg {Object} defaults
         * 应用程序默认配置
         */
        
        /**
         * @cfg {String/Object} environment 
         * Engine所运行的环境,可以为开发环境(development)和产品环境(production),默认为产品环境。
         * 开发环境提供程序运行的性能指标监视窗口。用法如下：
         * <pre></code>
            enviroment : 'production'
            
            enviroment : {
                type : 'development',
                config : {
                    monitor : true, //是否打开监视器，非必需
                    clearCache : true //是否自动清除缓存，非必需
                }
            }
    
         * </code></pre>
         */
        environment : 'production',
        
        /**
         * @method setShell
         * 设置shell
         * @param {Rs.app.Shell} shell
         */
        setShell : function(shell){
            if(this.shell && this.shell != shell){
                this.shell.setEngine(null);
            }
            this.shell = shell;
            shell.setEngine(this);
            this.relayEventsByPrefix(shell, 'shell', ['build', 'resize']);
        },
        
        /**
         * 获取shell
         * @method getShell
         */
        getShell : function(){
            var shell = this.shell;
            if(!shell){
                shell = {
                    type : 'window'
                };
            }else if(!shell.type){
                Rs.error('Shell类型未定义');
            }
            if(!(shell instanceof Rs.app.Shell)){
                shell = this.shell = new Rs.app.SHELL[shell.type.toLowerCase()](shell);
            }
            return shell;
        },
        
        getXY : function(){
            return [0, 0];
        },
        
        /**
         * 获取shell的宽高
         * @method getSize
         * @return {Object} obj
         */
        getSize : function(){
            var D = Rs.lib.Dom,
                w = D.getViewWidth(false),    
                h = D.getViewHeight(false);
            return {
                width : w,
                height : h
            };
        },
        
        /**
         * 获取用户偏好存储ID
         * @method getStateId
         * @return {String} stateId
         */
        getStateId : function(){
            return this.stateId;
        },

        /**
         * 应用程序引擎的入口方法,在该引擎的构造方法中调用该方法
         * @method main
         * @return {Rs.app.Engine} this
         */
        main : function(){
            if(this.onBeforeMain(this) === false){
                return this;
            }
            //如果shell属性为字符串,则将其转换为object配置
            var shell = this.shell;
            if(Rs.isString(shell)){
                this.shell = {
                    type : shell
                };
            }
            //初始化运行环境
            this.initEnvironment(function(){
                //如果定义了偏好信息保存则先读取用户偏好信息,
                //在回调方法中再启动程序引擎
                if(this.stateful !== false){
                    this.initState(this.initEngine, this);
                }else {
                    //初始化程序引擎
                    this.initEngine();
                }
            }, this);
            return this;
        },
        
        /**
         * 当入口程序运行前执行该方法,如果该方法返回false则终止运行。
         * 
         * @method onBeforeMain
         */
        onBeforeMain : Rs.emptyFn,
        
        /**
         * 初始化引擎运行环境
         * @method initEnvironment
         * @param {Function} callback
         * @param {Object} scope 
         */
        initEnvironment : function(callback, scope){
            var ENV = Rs.app.Environment,
                env = this.environment,
                environment,
                type, cfg;
            if(Rs.isObject(env)){
                type = env.type;
                cfg = Rs.isObject(env.config) ? env.config : {};
            }else if(Rs.isString(env)){
                type = env;
            }
            if(ENV.hasOwnProperty(type)){
                this.environment = new ENV[type](Rs.apply(cfg || {}, {
                    engine : this
                }), callback, scope);
            }else {
                Rs.error('尚未定义的程序运行环境:' + type);
            }
        },
        
        /**
         * 初始化用户偏好设置
         * @method initState
         * @param {Function} callback 回调方法
         * @param {Object} scope 回调方法作用域
         */
        initState : function(callback, scope){
            var id = this.getStateId(),
                StateManager = Rs.app.StateManager,
                doCallback = function(){
                    if(Rs.isFunction(callback)){
                        callback.call(scope || this);
                    }
                };
            if(StateManager && id){
                StateManager.load(id, function(state){
                    this.stateData = state;
                    this.applySetting();
                    doCallback();
                }, this);
           }else {
               doCallback();
           }
        },
        
        // private
        initStateEvents : function(){
            if(this.stateEvents){
                for(var i = 0, e; e = this.stateEvents[i]; i++){
                    this.on(e, this.saveState, this, {
                        scope : this,
                        delay : 100,
                        buffer : 200
                    });
                }
            }
        },
        
        // private
        getState : function(){
            var apps = this.apps,
                appsState = {}, settings;
            
            //应用程序设置
            apps.each(function(app){
                if(app && app.installed === true){
                    appsState[app.getId()] = app.getState();
                }
            }, this);
            
            //引擎设置
            settings = Rs.apply({}, {
                theme : this.theme
            });
            return {
                apps : appsState,
                settings : settings
            };
        },
        
        // private
        saveState : function(){
            var StateManager = Rs.app.StateManager;
            if(StateManager && this.stateful !== false){
                var id = this.getStateId();
                if(id){
                    var state = this.getState();
                    if(this.fireEvent('beforestatesave', this, state) !== false){
                        StateManager.sync(id, state);
                        this.fireEvent('statesave', this, state);
                    }
                }
            }
        },
        
        //private
        applySetting : function(){
            var stateData = this.stateData,
                settingsState = stateData ? stateData.settings : undefined;
            if(settingsState){
                //修改主题样式
                if(this.theme != settingsState.theme){
                    this.theme = settingsState.theme;
                }
            }
        },
        
        /**
         * 获取引擎容器
         * @method getContainer
         * @return {Rs.Element} container
         */
        getContainer : function(){
           var container = this.container;
           if(!container){
               container = this.container = Rs.getBody();
           }
           return container; 
        },
        
        /**
         * 初始化引擎, 首先加载所需要的第三方框架libraries,
         * 加载完后再构建
         * @method initEngine
         */
        initEngine : function() {
            if(!this.initialized && this.fireEvent('beforeinitialized', this) !== false 
                && this.onBeforeInitialize(this) !== false){
                this.container = this.getContainer();
                this.el = this.container.createChild({
                    tag : 'div',
                    cls : 'rs-engine'
                });
                this.initialized = true;
                
                //当设置保存用户偏好信息后初始化保存事件监听
                if(this.stateful !== false){
                    this.initStateEvents();
                }
                this.buildShell();
                this.fireEvent('initialize', this);
            }
        },
        
        /**
         * 初始化引擎时执行该方法,如果该方法返回false则取消初始化引擎
         * @method onBeforeInitialize
         * @param {Engine} engine
         */
        onBeforeInitialize : Rs.emptyFn,
        
        /**
         * 构建shell
         * @method buildShell
         */
        buildShell : function(){
            this.setShell(this.getShell());
            if(this.shell){
                this.shell.build(this.el, this.onRebuildShell, this);
            }
        }, 
        
        /**
         * 构建shell完毕,启动引擎,并引入libraries
         * @method onRebuildShell
         */
        onRebuildShell : function(){
            this.importLibraries(function(){
                this.applyTheme(this.theme, function(){
                    if(this.autoLaunch === true){
                        this.launch();
                    }
                }, this);
            }, this);
        }, 
        
        /**
         * 应用主题
         * @method applyTheme
         * @param {String} theme
         * @param {Function} callback 回调方法
         * param {Object} scope 回调方法作用域
         */
        applyTheme : function(theme, callback, scope){
            var Themes = Rs.Themes,
                oldThemeUrls, newThemeUrls;
            if(Themes && Rs.isArray(Themes[theme])){
                var oldTheme = this.theme,
                    onApplyFn = (function(){
                        this.fireEvent('themechange', this, theme, oldTheme);
                        if(Rs.isFunction(callback)){
                            callback.apply(this, arguments);
                        }
                    }).createDelegate(this);
                
                //删除原主题样式
                oldThemeUrls = this.getThemeCssUrls(this.theme);
                Rs.each(oldThemeUrls, function(url){
                    Rs.removeResource(url);
                }, this);
                
                //引入新主题样式
                newThemeUrls = this.getThemeCssUrls(theme);
                this.importFileList(newThemeUrls, onApplyFn, scope);
                
                this.theme = theme;
            }else {
                if(Rs.isFunction(callback)){
                    callback.call(scope || this);
                }
            }
        },
        
        //private
        getThemeCssUrls : function(theme){
            var Themes = Rs.Themes,
                list = [];
            if(Themes && Rs.isArray(Themes[theme])){
                var libs = this.libraries,
                    Libraries = Rs.Libraries, lib,
                    list = [].concat(Themes[theme]),
                    BASE_PATH = Rs.BASE_PATH;
                Rs.each(libs, function(v){
                    lib = Libraries[v];
                    if(lib){
                        list = list.concat(lib.getTheme(theme) || []);
                    }
                }, this);
                for(var i = 0, len = list.length; i < len; i++){
                    list[i] = BASE_PATH + '/' + list[i]; 
                }
            }
            return list;
        },
        
        //load libs file
        importLibraries : function(callback, scope){
            var libs = this.libraries,
                Libraries = Rs.Libraries, lib,
                list = [],
                BASE_PATH = Rs.BASE_PATH;
            Rs.each(libs, function(v){
                lib = Libraries[v];
                if(lib){
                    list = list.concat(lib.css || [], lib.js || []);
                }
            }, this);
            for(var i = 0, len = list.length; i < len; i++){
                list[i] = BASE_PATH + '/' + list[i]; 
            }
            this.importFileList(list, callback, scope);
        },
        
        //private
        importFileList : function(list, callback, scope){
            var url = list.shift();
            if(url){
                Rs.lr(url, this.goOnImportFile.createDelegate(this, 
                        [this.importFileList, list, callback, scope], false), this);
            }else {
                this.fireEvent('importlibraries', this, this.libraries);
                Ext.BLANK_IMAGE_URL = Rs.BASE_PATH + "/lib/ext-3.3.1/resources/images/default/s.gif" ;
                callback.call(scope || this, this);
            }
        },
        
        //private
        goOnImportFile : function(fun, list, callback, scope){
            fun.call(this, list, callback, scope);
        },
        
        /**
         * 启动引擎
         * @method launch
         * @return {Rs.app.Engine}
         */
        launch : function(){
            if(!this.launched 
                    && this.fireEvent('beforelaunch', this) !== false
                    && this.onBeforeLaunch() !== false){
                this.launched = true;
                this.onLaunch();
                this.fireEvent('launch', this);
                this.onAfterLaunch();
            }
            return this;
        },
        
        /**
         * 当启动该引擎之前执行该方法,如果该方法返回false则终止启动
         * @method onBeforeLaunch
         */
        onBeforeLaunch : Rs.emptyFn,
        
        /**
         * 启动引擎,并安装应用程序
         * @method onLaunch
         */
        onLaunch : function(){
            var apps = this.apps;
            if(apps){
                delete this.apps;
                this.install(apps);
            }
        },
        
        /**
         * 系统启动完毕后执行该方法
         * @method onAfterLaunch
         */
        onAfterLaunch : Rs.emptyFn,
        
        //private
        getAppId : function(app){
            return app.getId();
        },

        //private
        initApps : function(){
            if(!this.apps){
                this.apps = new Rs.util.MixedCollection(false, this.getAppId);
            }
        },
        
        /**
         * 安装应用程序,如果传入的为数组,则循环装入每个应用程序
         * @method install
         * @param {Array/Object} app
         * @param {Function} callback (optional)
         * @param {Object} scope (optional)
         * @return {Array} app
         */
        install : function(apps, callback, scope){
            this.initApps();
            if(Rs.isArray(apps)){
                var result = [];
                Rs.each(apps, function(a){
                    result.push(this.install(a, callback, scope));
                }, this);
                return result;
            }
            //检查如果已经有相同ID的应用程序安装,则程序返回false,不继续进行安装
            var a = this.createApp(this.applyDefaults(apps)),
                index = this.apps.length,
                callbackFn = function(succ, app){
                    if(Rs.isFunction(callback)){
                        callback.call(scope || this, succ, app);
                    }
                };
            if(this.fireEvent('beforeinstall', this, a, index) !== false 
                    && this.onBeforeInstall(a) !== false){
                var shell = this.shell, 
                    region = shell.getRegion(a.getRegionId());
                a.onInstall(this, region, index, function(succ, app){
                    if(succ === true){
                        this.onInstall(app, region);
                    }else {
                        app = undefined; delete app;
                    }
                    callbackFn(succ, app);
                }, this);
            }
            return a;
        },
        
        /**
         * 当安装应用程序之前调用该方法,如果该方法返回false则终止安装程序
         * @method onBeforeInstall
         * @param {Application} app
         */
        onBeforeInstall : Rs.emptyFn,
        
        /**
         * 如果不存在已经安装的该应用程序实例,则将其添加入引擎中
         * @method onInstall
         * @param {Rs.app.Application} app,
         * @param {Rs.app.Region} region
         */
        onInstall : function(app, region){
            if(!this.apps.contains(app)){
                this.fireEvent('install', this, app);
                this.relayEventsByPrefix(app, 'app', ['resize', 'move']);
                this.applyAppState(app);
                this.apps.add(app);
                this.shell.reBuild(app.getRegion(), app);
            }
        },
        
        //private
        applyAppState : function(app){
            var stateData = this.stateData,
                appsState = stateData ? stateData.apps : undefined;
            if(appsState){
                var id = app.getId();
                app.applyState(appsState[id] || {});
            }
        },
        
        /**
         * 创建应用程序
         * @method createApp
         * @param {Object} config
         * @return {Rs.app.Application}
         */
        createApp : function(config){
            return new Rs.app.Application(config, this);
        },
        
        //private
        applyDefaults : function(app){
            var d = this.defaults;
            if(d){
                if(Rs.isFunction(d)){
                    d = d.call(this, app);
                }else {
                    var dd = {};
                    for(var k in d){
                        dd[k] = Rs.apply({}, d[k]);
                    }
                    Rs.apply(app, dd);
                }
            }
            return app;
        },
        
        /**
         * 通过应用程序ID获取应用程序
         * @method getAppById
         * @param {String} appId
         * @return {Rs.app.Application}
         */
        getAppById : function(appId){
            return Rs.app.AppMgr.get(appId);
        }, 
        
        //private
        relayEventsByPrefix : function(o, prefix, events){
            var me = this;
            function createHandler(ename){
                return function(){
                    return me.fireEvent.apply(me, [ename].concat(Array.prototype.slice.call(arguments, 0)));
                };
            }
            for(var i = 0, len = events.length; i < len; i++){
                var ename = events[i],
                    ename2 = prefix + ename;
                me.events[ename2] = me.events[ename2] || true;
                o.on(ename, createHandler(ename2), me);
            }
        }
        
    });

})(Rs);

/**
 * 创建engine
 * @class Rs
 * @method engine
 */
Rs.engine = function(config, callback, scope) {
    Rs.onReady(function(){
        Rs.appEngine = new Rs.app.Engine(config).main();
        if(Rs.appEngine && Rs.isFunction(callback)){
            callback.call(scope || this, Rs.appEngine);
        }
    }, this);
};

/**
 * 获取engine
 * @class Rs
 * @method getAppEngine
 */
Rs.getAppEngine = function(){
    return Rs.appEngine;
};
(function() {
    
    //开发环境
    var DevEnvironment = function(config, callback, scope) {
        Rs.apply(this, config);
        this.init(callback, scope);
    };
    
    var story = [];
    
    DevEnvironment.prototype = {

        type : 'development',

        monitor : true,
        
        clearCache : true,
        
        interval : 1000,
        
        init : function(callback, scope) {
            if (this.monitor === true) {
                this.doMonitor();
            }
            if (Rs.isFunction(callback)) {
                callback.call(scope || this);
            }
        },
        
        //监听
        doMonitor : function() {
            var engine = this.engine,
                storyboard,
                updater = (function() {
                    if (story.length > 20) {
                        story = story.slice(-20);
                    }
                    storyboard && storyboard.update(story);
                }).createDelegate(this),
                monitorAppCfg = {
                    folder : 'BUILDINS/monitor',
                    id : 'build-in_app_monitor',
                    autoRun : true,
                    region : {
                        x : 500,
                        y : 50,
                        width : 500,
                        height : 400,
                        minimizable : false, 
                        maximizable : false,
                        closable : false
                    }
                };
            
            if (engine.launched === true) {
                engine.install(monitorAppCfg, function(e, a) {
                    storyboard = a.getObj();
                    setInterval(updater, this.interval);
                }, this);
            } else {
                engine.apps.push(monitorAppCfg);
                var onInstall = function(e, a) {
                    var id = a.getId();
                    if (id == 'build-in_app_monitor') {
                        storyboard = a.getObj();
                        setInterval(updater, this.interval);
                        engine.un('install', onInstall, this);
                    }
                };
                engine.on('install', onInstall, this);
            }
            
            //服务调用监听
            Rs.Service.on('beforecall', function(s, o){
                var start = new Date(),
                    url = o ? o.url : '',
                    method = o ? o.method : '';
                Rs.Service.on('callcomplete', function(){
                    var end = new Date();
                    story.push({
                       type : 'service',
                       start : start,
                       end : end,
                       name : '调用服务',
                       desc : o ? ('URL:' + url + ' METHOD:' + method) : ''
                    });
                }, this, {
                    single : true
                });
            }, this);
            
            //表格数据增删改查操作监听
            engine.on('install', this.onEngineAppInstall, this);
        },
        
        //private
        onEngineAppInstall : function(engine, app){
            var id = app.getId(),
                obj = app.getObj();
            
            //Ext表格
            if(obj instanceof Ext.grid.GridPanel){
                var store = obj.getStore();
                if(store){
                	store.on('beforeload',  function() { //数据加载
                        var start = new Date();
                        store.on('load',function() {
                            var end = new Date();
                            story.push({
                               type : 'store',
                               start : start,
                               end : end,
                               name : '数据加载',
                               desc : 'APP:' + id
                            });
                        },this, {
                            single : true
                        });
                    }, this);
                    //数据保存
                    store.on('beforesave', function(){
                        var start = new Date();
                        store.on('save', function(){
                            var end = new Date();
                            story.push({
                               type : 'store',
                               start : start,
                               end : end,
                               name : '数据更新',
                               desc : 'APP:' + id 
                            });
                        }, this, {
                           single : true 
                        });
                    }, this);
                }
            }
            
            //Ext组件渲染
            if(obj instanceof Ext.Component){
                obj.on('beforerender', function(){
                    var start = new Date();
                    obj.on('afterrender', function(){
                        var end = new Date();
                        story.push({
                           type : 'component',
                           start : start,
                           end : end,
                           name : '组件渲染',
                           desc : 'APP:' + id
                        });
                    }, this, {
                        single : true
                    });
                }, this);
            }
            
            //树加载资源
            if(obj instanceof Ext.tree.TreePanel){
                var loader = obj.getLoader();
                if(loader && loader instanceof Ext.tree.TreeLoader){
                    loader.on('beforeload', function(){
                        var start = new Date();
                        loader.on('load', function(l, n){
                            var end = new Date();
                            story.push({
                                type : 'treeloader',
                                start : start,
                                end : end,
                                name : '树节加载',
                                desc : 'APP:' + id + ' NODE:' + (n.text || '')
                            });
                        }, this, {
                            single : true
                        });
                    }, this);
                }
            }
            
            //LittleEngine 组合应用程序
            if(obj instanceof Rs.app.LittleEngine){
                //启动
                obj.on('beforelaunch', function(){
                    var start = new Date();
                    obj.on('launch', function(){
                        var end = new Date();
                        story.push({
                            type : 'engine',
                            start : start,
                            end : end,
                            name : '组合程序',
                            desc : 'APP:' + id
                         });
                    }, this, {
                        single : true
                    });
                }, this);
                //程序安装
                obj.on('install', this.onEngineAppInstall, this);
            }
        }
    };

    
    
    //生产环境
    var ProEnvironment = function(config, callback, scope) {
        Rs.apply(this, config);
        this.init(callback, scope);
    };

    ProEnvironment.prototype = {

        type : 'production',

        init : function(callback, scope) {
            if (Rs.isFunction(callback)) {
                callback.call(scope || this);
            }
        }

    };

    /**
     * @class Rs.app.Environment 
     * 程序运行环境,现支持开发环境和产品环境两种。在开发环境用户可设置是否使用性能监视器。
     */
    Rs.app.Environment = (function() {

        return {

            development : DevEnvironment,

            production : ProEnvironment
        };

    })();
    
})();
/**
 * 组合应用程序引擎,在定义组合应用程序时,在其描述文件中objCfg属性使用该类，如下示例：
 * @class Rs.app.LittleEngine
 * @extends Rs.app.Engine 
 * <pre><code>
    R = (function() {
        return {
            id : 'all_in_one_app',
            name : '组合程序',
            objCfg : {
                clazz : 'Rs.app.LittleEngine', //声明该应用程序类
                cfg : {
                    shell : 'border', //声明该组合程序的布局方式
                    apps : [ { //配置该组合程序要引入的应用程序
                        folder : 'acctTree',
                        id : 'all_in_one_acct_tree',
                        region : {
                            rid : 'west',
                            width : 200,
                            collapsible : true
                        }
                    }, {
                        folder : 'acctGrid',
                        id : 'all_in_one_acct_grid',
                        region : 'center'
                    }, {
                        folder : 'acctCreate',
                        id : 'all_in_one_acct_create_panel',
                        region : {
                            rid : 'east',
                            width : 220,
                            collapsible : true
                        }
                    }]
                }
            }
        };
    })();
 * 
 * </code></pre>
 * @constructor
 * @param {Object} config
 */
Rs.define('Rs.app.LittleEngine', {

    extend : Rs.app.Engine,

    constructor : function(config) {
        config = Rs.apply(config || {}, {
            width : 0,
            height : 0
        });
        Rs.app.LittleEngine.superclass.constructor.call(this, config);
    },

    /**
     * 重写Rs.app.Engine的main方法，传入参数为页面程序引擎,和该小引擎所在位置
     * 
     * @param {Rs.app.Engine} engine
     * @param {Rs.app.Region} region
     */
    main : function(engine, region) {
        this.engine = engine;
        this.region = region;
        Rs.app.LittleEngine.superclass.main.call(this);
        var callback = function(w, h, x, y) {
            this.setSize( {
                width : w,
                height : h
            });
            this.setXY( [ x, y ]);
        };
        region.addResizeListener(callback, this, {
            delay : 100,
            buffer : 100
        });
        region.addMoveListener(callback, this, {
            delay : 100,
            buffer : 100
        });
        return this;
    },

    // 重写父类方法
    getContainer : function() {
        var container = this.container, region = this.region;
        if (!container && region) {
            container = this.container = region.getTargetEl();
        }
        return container;
    },

    /**
     * 设置位置
     * 
     * @method setXY
     * @param {Array} xy
     */
    setXY : function(xy) {
        var x = xy[0], y = xy[1];
        if (Rs.isNumber(x)) {
            this.x = x;
        }
        if (Rs.isNumber(y)) {
            this.y = y;
        }
        this.shell.reBuild();
    },

    /**
     * 获取坐标
     * 
     * @method getXY
     * @return {Array} xy
     */
    getXY : function() {
        var x = this.x, y = this.y;
        return [ x, y ];
    },

    /**
     * 设置宽高
     * 
     * @method setSize
     * @param {Object} box
     */
    setSize : function(box) {
        if (box) {
            var w = box.width, h = box.height;
            if (Rs.isNumber(w) && w > 0) {
                this.width = w;
            }
            if (Rs.isNumber(h) && h > 0) {
                this.height = h;
            }
            if (this.shell && Rs.isFunction(this.shell.reBuild)) {
                this.shell.reBuild();
            }
        }
    },

    /**
     * 获取的宽高
     * 
     * @method getSize
     * @return {Object}
     */
    getSize : function() {
        return {
            width : this.width,
            height : this.height
        };
    }, 
    
    //重写父类方法,该小引擎不支持单独设置主题
    applyTheme : function(theme, callback, scope){
        if(Rs.isFunction(callback)){
            callback.call(scope || this);
        }
    }

});
(function() {

    /**
     * @class Rs.app.StateManager
     * 页面偏好信息管理类,提供加载和同步用户设置的方法.
     * @constructor
     */
    Rs.app.StateManager = (function() {

        var URL = '/rsc/rsclient/pagestatemanager', 
            onLoad = function(scheme, options, callback, scope) {
                var state = scheme && scheme.stateData ? scheme.stateData : '';
                if (Rs.isFunction(callback)) {
                    callback.call(scope || this, Rs.trim(state)==""?{}:Rs.decode(state));
                }
            }, onSync = function(succ) {
                if(succ != true){
                    alert("提示", "操作失败");
                }
            };

        return {

            /**
             * 加载用户偏好信息,当用户打开页面时读取用户偏好信息数据
             * 
             * @method load
             * @param {String} id 用户偏好id
             * @param {Function} callback 回调方法
             * @param {Object} scope 回调方法作用域
             */
            load : function(id, callback, scope) {
                Rs.Service.call( {
                    url : URL,
                    method : "load",
                    params : {
                        id : id
                    }
                }, onLoad.createDelegate(this, [ callback, scope ], 3), scope);
            },

            /**
             * 同步用户偏好数据到后台服务器
             * 
             * @method sync
             * @param {String} id
             * @param {Object} state
             */
            sync : function(id, state) {
                var stateData = Rs.encode(state);
                Rs.Service.call({
                    url : URL,
                    method : 'sync',
                    params : {
                        id : id,
                        data : stateData
                    }
                }, onSync, this);
            }
            
        };
    })();

})();
Rs.ns("Rs.app");

(function(){
    
    /**
     * @class Rs.app.Shell 
     * @extends Rs.util.Observable 
     * <p>
     * 应用程序引擎外壳,对页面中各个应用程序位置进行布局。
     * </p>
     * @constructor
     * @param {Object} config
     */
    Rs.app.Shell = function(config){
        
        this.id = Rs.id(null, 'rs-shell-');
        
        Rs.apply(this, config);
        
        Rs.app.Shell.superclass.constructor.call(this);
        
        this.addEvents(
            /**
             * @event beforebuild
             * 当开始构建该应用程序外壳前触发该事件
             * @param {Rs.app.Shell} this
             */
            'beforebuild',
            
            /**
             * @event build
             * 当构建该应用程序外壳完成时触发该事件
             * @param {Rs.app.Shell} this 
             */
            'build', 
            
            /**
             * @event afterbuild
             * 当构建该应用程序外壳完成后触发该事件
             * @param {Rs.app.Shell} this
             */
            'afterbuild',
            
            /**
             * @event resize
             * 当该应用程序外壳大小发生改变时触发该事件
             * @param {Rs.app.Shell} this
             */
            'resize');
        
    };
    
    Rs.extend(Rs.app.Shell, Rs.util.Observable, {
        
        //private
        builded : false,
        
        /**
         * @cfg {String} frameTpl
         * Shell基础架构
         */
        frameTpl : '<div>Hello World.</div>',
        
        /**
         * @cfg {String} regionCls
         * 应用程序区域样式
         */
        regionCls : 'rs-app-region',
        
        /**
         * @cfg {String} targetCls
         * 目标位置样式
         */
        
        /**
         * 设置应用程序引擎
         * @method setEngine
         * @param {Rs.app.Engine} engine
         */
        setEngine : function(engine){
            this.engine = engine;
        },
        
        /**
         * 获取应用程序引擎
         * @method getEngine
         * @return {Rs.app.Engine} engine
         */
        getEngine : function(){
           return this.engine; 
        },
        
        /**
         * 构建Shell
         * @method build
         * @param {Rs.Element} ct 构建shell的位置
         * @param {Function} callback 回调方法
         * @param {Object} scope 回调方法作用域
         */
        build : function(ct, callback, scope){
            if(!this.builded && this.fireEvent('beforebuild', this) !== false){
                //设置样式
                if(!(Rs.isEmpty(this.targetCls))){
                    ct.addClass(this.targetCls);
                }
                var engine = this.engine;
                this.onBuild(ct, engine);
                this.fireEvent('build', this);
                this.afterBuild();
                this.builded = true;
                this.fireEvent('afterbuild', this);
                //监听窗口大小变化，同步调整shell大小
                Rs.EventManager.onWindowResize(this.onWindowResize, this);
            }
            if(Rs.isFunction(callback)){
                callback.call(scope || this, engine, this);
            }
        },
        
        /**
         * 当窗口大小发生变的时候执行该方法
         * @method onWindowResize
         */
        onWindowResize : function(){
            var b = this.getSize(),
                w = b.width,
                h = b.height;
            this.setSize(b);
            this.fireEvent('resize', this, w, h);
        },
        
        /**
         * 构建Shell
         * @method onBuild
         * @param {Rs.Element} ct 构建shell的位置
         * @param {Rs.app.Engine} engine
         */
        onBuild : function(ct, engine){
            //frame
            this.frame = ct.createChild({
                id : 'rs-engine-frame',
                tag : 'div'
            });
            this.frame.addClass('rs-engine-frame');
            
            var t = new Rs.Template(this.frameTpl).compile();
            t.insertFirst(this.frame, this.getFrameConfig(), true);
            
            //初始化所有应用程序位置容器
            this.initAllRegionCollection();
            
            //构建Shell
            this.doBuild();
        }, 
        
        //private
        initAllRegionCollection : function(){
            //记录具有固定位置的region
            this.regions = new Rs.util.MixedCollection(false);
            
            //无固定位置的窗口类型region
            this.windowRegions = new Rs.util.MixedCollection(false);
        }, 
        
        /**
         * 构建shell,设置各应用程序位置的大小等
         * @method doBuild
         */
        doBuild : Rs.emptyFn,
        
        /**
         * 构建shell,
         * @method afterBuild
         */
        afterBuild : Rs.emptyFn,
        
        /**
         * 重构shell,当应用程序安装成功后执行该方法
         * @method reBuild
         * @param {Rs.app.Region} reigon
         * @param {Rs.app.Application} app
         */
        reBuild : function(region, app){
            this.doReBuild(region, app);
            this.afterReBuild(region, app);
        },
        
        /**
         * 重构应用程序位置
         * @method doReBuild
         * @param {Rs.app.Region} region
         * @param {Rs.app.Application} app
         */
        doReBuild : Rs.emptyFn,
        
        /**
         * 构建shell完毕之后，设置shell的大小.
         * @method afterBuild
         * @param {Rs.app.Region} region
         * @param {Rs.app.Application} app
         */
        afterReBuild : function(region, app){
            //如果是window类型的应用程序且该程序可显示则打开该窗口应用程序
            if(region instanceof Rs.app.WindowRegion){
                if(region && app && app.autoRun === true && app.isOpen() != true){
                    app.open(!region.isVisible());
                }
            }
        },
        
        
        /**
         * 设置shell宽高,调用doBuild方法,设置各个应用程序的位置和大小
         * @method setSize
         * @param {Object/Number} w Shell的大小或者shell的宽度
         * @param {Number} h (optional) Shell的高度
         */
        setSize : function(w, h){
            // support for standard size objects
            if(typeof w == 'object'){
                h = w.height;
                w = w.width;
            }
            // not builded
            if(!this.builded){
                this.width  = w;
                this.height = h;
                return this;
            }
            this.lastSize = {width: w, height: h};
            this.frame.setWidth(w);
            this.frame.setHeight(h);
            this.fireEvent('resize', this, w, h);
            //re build all regions
            this.reBuild();
        },
        
        /**
         * 获取shell所处位置
         * @method getXY
         * @return {Array}
         */
        getXY : function(){
            var engine = this.engine;
            if(engine){
                return engine.getXY();
            }else {
                return [0, 0];
            }
        },
        
        /**
         * 获取shell的宽高
         * @method getSize
         * @return {Object}
         */
        getSize : function(){
            var engine = this.engine;
            if(engine){
                return engine.getSize();
            }else {
                var D = Rs.lib.Dom,
                    w = D.getViewWidth(false),    
                    h = D.getViewHeight(false);
                return {
                    width : w,
                    height : h
                };
            }
        },
        
        
        /**
         * 获取基础框架配置
         * @method getFrameConfig
         */
        getFrameConfig : function(){
            return {};
        }, 
        
        /**
         * 获取应用程序放置位置
         * @method gerRegion
         * @param {String} id 
         */
        getRegion : function(id){
            var region = this.regions.get(id); 
            if(region){
                return region;
            }else {
                region = new Rs.app.WindowRegion(this, {});
                return this.windowRegions.add(region);
            }
        },
        
        /**
         * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
         * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
         * @param {Number|String} v The encoded margins
         * @return {Object} An object with margin sizes for top, right, bottom and left
         */
        parseMargins : function(v){
            if (Rs.isNumber(v)) {
                v = v.toString();
            }
            var ms  = v.split(' '),
                len = ms.length;
                
            if (len == 1) {
                ms[1] = ms[2] = ms[3] = ms[0];
            } else if(len == 2) {
                ms[2] = ms[0];
                ms[3] = ms[1];
            } else if(len == 3) {
                ms[3] = ms[1];
            }        
            return {
                top   :parseInt(ms[0], 10) || 0,
                right :parseInt(ms[1], 10) || 0,
                bottom:parseInt(ms[2], 10) || 0,
                left  :parseInt(ms[3], 10) || 0
            };
        }

        
    });
    
    /**
     * 
     */
    Rs.app.SHELL = {};
    
})();
(function(){
    
    /**
     * @class Rs.app.Region
     * @extends Rs.util.Observable
     * 应用程序放置区域
     * @constructor
     * @param {Rs.app.Shell} shell 页面框架类型
     * @param {Object} config
     */
    Rs.app.Region = function(shell, config){
        this.shell = shell;
        Rs.apply(this, config);
        Rs.app.Region.superclass.constructor.call(this);
        
        this.addEvents(
            
            /**
             * @event beforerender
             * 在该应用程序位置渲染之前触发该事件
             * @param {Rs.app.Region} this 
             */
            'beforerender',
            
            /**
             * @event render
             * 当该应用程序位置渲染完成时触发该事件
             * @param {Rs.app.Region} this
             */
            'render', 
            
            /**
             * @event beforeapplyapp
             * 当应用程序被安装到该位置之前触发该事件
             * @param {Rs.app.Region} this
             * @param {Rs.app.Application} app
             */
            'beforeapplyapp',
            
            /**
             * @event applyapp
             * 当应用程序被安装当该位置时触发该事件
             * @param {Rs.app.Region} this
             * @param {Rs.app.Application} app
             */
            'applyapp',
            
            /**
             * @event beforedestroy
             * 当窗口销毁前触发该事件
             * @param {WindowRegion} this
             */
            'beforedestroy',
            
            /**
             * @event destroy
             * 当窗口被销毁时触发该事件
             * @param {WindowRegion} this
             */
            'destroy');
    };
    
    Rs.extend(Rs.app.Region, Rs.util.Observable, {
        
        /**
         * @cfg {Number} minWidth 
         * 最小宽度
         */
        minWidth : 0,
        
        /**
         * @cfg {Number} maxWidth
         * 最大宽度
         */
        maxWidth : 500,
        
        /**
         * @cfg {Number} minHeight
         * 最小高度
         */
        minHeight : 0,
        
        /**
         * @cfg {Number} maxHeight
         * 最大高度
         */
        maxHeight : 500,
        
        //private 
        applyedapp : false, 
        
        //private
        rendered : false,
        
        //private
        isDestroyed : false,
        
        /**
         * 判断该应用程序位置是否有程序安装
         * @return {Boolean}
         */
        isApplyApp : function(){
            return this.applyedapp === true;
        },
        
        /**
         * 设置宽度
         * @param {Number} w 宽度值
         */
        setWidth : function(w){
            var min = this.minWidth,
                max = this.maxWidth;
            if(w < min){
                w = min;
            }else if(w > max){
                w = max;
            }
            return this.width = w;
        },
        
        /**
         * 设置高度
         * @param {Number} h 高度值
         */
        setHeight : function(h){
            var min = this.minHeight,
                max = this.maxHeight;
            if(h < min){
                h = min;
            }else if(h > max){
                h = max;
            }
            return this.height = h;
        },
        
        /**
         * 获取大小
         * @return {Object}
         */
        getSize : function(){
            return {
                width : this.width,
                height : this.height
            };
        },
        
        /**
         * 设置大小
         * @param {Object} box
         */
        setSize : function(box){
            if(box){
                var w = box.width,
                    h = box.height; 
                if(w){
                    this.setWidth(w);
                }
                if(h){
                    this.setHeight(h);
                }
            }
        },
        
        //private
        getState : function(){
            var size = this.getSize();
            return {
                width : size.width,
                height : size.height
            };
        },
        
        //private
        applyState : function(state){
            var size = {};
            for(var k in state){
                if(k == 'width' || k == 'height'){
                    size[k] = state[k];
                }
            }
            this.setSize(size);
        },
        
        /**
         * 打开该应用程序
         * @method open
         */
        open : function(){
            var el = this.targetEl,
                w = el.getWidth(), h = el.getHeight();
            this.fireEvent('resize', el, w, h);
        },
        
        /**
         * 关闭该应用程序
         * @method close
         */
        close : Rs.emptyFn,
        
        /**
         * 渲染应用程序区域
         * @param {Rs.Element} el
         */
        renderTo : function(el){
            if(!this.rendered && this.fireEvent('beforerender', this) !== false){
                this.targetEl = el;
                this.panelEl = el.wrap({
                    tag : 'div',
                    cls : 'rs-app-blank-region'
                }, false);
                this.rendered = true;
                this.fireEvent('render', this);
            }
        },
        
        /**
         * 将要安装到该位置的应用程序配置信息应用到该位置
         * @param {Rs.app.Application} app
         */
        applyApp : function(app){
            if(app != undefined && !this.applyedapp 
                && this.fireEvent('beforeapplyapp', this, app) !== false){
                
                //应用位置配置
                Rs.apply(this, app.getRegionCfg() || {});
                this.app = app;
                this.name = app.getName();
                this.applyedapp = true;
                
                this.fireEvent('applyapp', this, app);
                
                //应用程序安装完成后修改其面板的配置
                this.afterApplyApp(app);
            }
        },
        
        /**
         * 当安装应用程序到该位置之后执行该方法
         * @method initEvents
         * @param {Application} app
         */
        afterApplyApp : Rs.emptyFn,
        
        /**
         * 获取目标节点
         * @method getTargetEl
         * @return {Rs.Element}
         */
        getTargetEl : function(){
            return this.targetEl;
        },
        
        /**
         * 获取该应用程序位置的原始dom节点,
         * 在应用程序的main方法中可直接将应用程序渲染到该dom节点上
         * @method getRawEl
         * @return {HTTPDOMElement} 
         */
        getRawEl : function(){
            var el = this.targetEl;
            return el.dom;
        },
        
        /**
         * 添加大小调整监听器,当应用程序位置的大小发生变化时可修改应用程序窗体的大小
         * @method addResizeListener
         * @param {Function} callback
         * @param {Object} scope
         * @param {Object} options
         */
        addResizeListener : function(callback, scope, options){
            this.on('resize', function(){
                var el = this.targetEl,
                    w = el.getWidth(), 
                    h = el.getHeight(),
                    x = el.getX(),
                    y = el.getY();
                callback.call(scope || this, w, h, x, y);
            }, this, Rs.apply({
                delay : 40,
                buffer : 40,
                scope : this
            }, options));
        },
        
        /**
         * 添加位置调整监听器,当应用程序位置的大小发生变化时可修改应用程序窗体的大小
         * @method addMoveListener
         * @param {Function} callback
         * @param {Object} scope
         * @param {Object} options
         */
        addMoveListener : function(callback, scope, options){
            this.on('move', function(){
                var el = this.targetEl,
                    w = el.getWidth(), 
                    h = el.getHeight(),
                    x = el.getX(),
                    y = el.getY();
                callback.call(scope || this, w, h, x, y);
            }, this, Rs.apply({
                delay : 40,
                buffer : 40,
                scope : this
            }, options));
        },
        
        /**
         * 当该应用程序位置被销毁之前,执行该方法
         * @method beforeDestroy
         */
        beforeDestroy : Rs.emptyFn,
        
        /**
         * 销毁该应用程序位置
         * @method destroy
         */
        destroy : function(){
            if(!this.isDestroyed){
                if(this.fireEvent('beforedestroy', this) !== false){
                    this.destroying = true;
                    this.beforeDestroy();
                    this.onDestroy();
                    this.purgeListeners();
                    this.fireEvent('destroy', this);
                    this.destroying = false;
                    this.isDestroyed = true;
                }
            }
        },
        
        /**
         * 当该应用程序位置被销毁时,执行该方法
         * @method onDestroy
         */
        onDestroy : Rs.emptyFn
        
    });
    
})();
(function() {
    
    /**
     * @class Rs.app.WindowRegion
     * @extends Rs.app.Region
     * 窗口式应用程序位置
     * @constructor
     * @param {Rs.app.WindowShell} shell
     * @param {Object} config
     */
    Rs.app.WindowRegion = function(shell, config) {
        Rs.app.WindowRegion.superclass.constructor.call(this, shell, config);
        
        this.addEvents(
            /**
             * @event resize
             * 窗口大小发生变化时触发该事件,
             * @param {Rs.Element} targetEl
             * @param {Number} width
             * @param {Number} height
             */
            'resize',
            
            /**
             * @event restore
             * 当窗口有最大化复原的时候触发该事件
             * @param {Rs.app.WindowRegion} this
             */
            'restore',
            
            /**
             * @event beforeclose
             * 当窗口关闭的时候触发该事件,如果该事件回调方法返回false则取消关闭该方法
             * @param {Rs.app.WindowRegion} this
             */
            'beforeclose',
            
            /**
             * @event close
             * 当窗口关闭后触发该事件
             * @param {Rs.app.WindowRegion} this
             */
            'close',
            
            /**
             * @event maximize
             * 当窗口最大化时触发该事件
             * @param {Rs.app.WindowRegion} this
             */
            'maximize',
            
            /**
             * @event minimize
             * 当窗口最小化时触发该事件
             * @param {Rs.app.WindowRegion} this 
             */
            'minimize',
            
            /**
             * @event beforeshow
             * 当窗口显示之前触发该事件,如果该事件回调方法返回false则取消显示
             * @param {Rs.app.WindowRegion} this
             */
            'beforeshow',
            
            /**
             * @event show
             * 当窗口显示后触发该事件
             * @param {Rs.app.WindowRegion} this
             */
            'show',
            
            /**
             * @event beforehide
             * 当窗口隐藏前触发该事件,如果该事件回调方法返回false则取消隐藏
             * @param {Rs.app.WindowRegion} this 
             */
            'beforehide',
            
            /**
             * @event hide
             * 当窗口隐藏后触发该事件
             * @param {Rs.app.WindowRegion} this
             */
            'hide',
            
            /**
             * @event move
             * 当窗口移动后触发该事件
             * @param {Rs.app.WindowRegion} this
             * @param {Array} xy0 前一位置
             * @param {Array} xy 当前位置
             */
            'move',
            
            /**
             * @event activate
             * 当窗口被激活时触发该事件
             * @param {Rs.app.WindowRegion} this  
             */
            'activate',
            
            /**
             * @event deactivate
             * 当窗口取消激活时触发该事件
             * @param {Rs.app.WindowRegion} this 
             */
            'deactivate',
            
            /**
             * @event beforedestroy
             * 当窗口销毁前触发该事件
             * @param {Rs.app.WindowRegion} this
             */
            'beforedestroy',
            
            /**
             * @event destroy
             * 当窗口被销毁时触发该事件
             * @param {Rs.app.WindowRegion} this
             */
            'destroy');
        
        this.renderTo(Rs.DomHelper.append(document.body, {
            tag : 'div',
            cls : 'rs-app-region-cell'
        }, true));
    };

    Rs.extend(Rs.app.WindowRegion, Rs.app.Region, {
        
        //private
        headerCls : 'rs-app-window-header',
        
        //private
        hideCls : 'rs-app-window-hidden',
        
        //pivate
        hidden : false,
        
        /**
         * @cfg {Number} x 
         * 坐标X, 默认值为100
         */
        x : 100,
        
        /**
         * @cfg {Number} y
         * 坐标Y, 默认值为100
         */
        y : 100,
        
        /**
         * @cfg {Number} minWidth
         * 最小宽度, 默认值为50
         */
        minWidth : 50,
        
        /**
         * @cfg {Number} maxWidth
         * 最大宽度, 默认值为100
         */
        maxWidth : 1000,
        
        /**
         * @cfg {Number} minHeight
         * 最小高度, 默认值为50
         */
        minHeight : 50,
        
        /**
         * @cfg {Number} maxHeight
         * 最大高度,默认值为800
         */
        maxHeight : 800,
        
        /**
         * @cfg {Boolean} minimizable
         * 是否可最小化,默认值为true
         */
        minimizable : true, 

        /**
         * @cfg {Boolean} maximizable
         * 是否可最大化,默认值为true
         */
        maximizable : true,
        
        /**
         * @cfg {Boolean} closable
         * 是否可关闭
         */
        closable : true,
        
        /**
         * @cfg {Boolean} draggable
         * 是否可拖动,默认值为true
         */
        draggable : true,
        
        /**
         * @cfg {Boolean} resizable
         * 是否可调整大小, 默认值为true
         */
        resizable : true,
        
        /**
         * @cfg {String} resizeHandles
         * 调整大小handles
         */
        
        /**
         * 是否显示
         * @method isVisible
         * @return {Boolean}
         */
        isVisible : function(){
            return this.hidden === false;
        },
        
        //override private
        getState : function(){
            var maximized = this.maximized;
            if(maximized == true){
                var restorePos = this.restorePos || this.getXY(),
                    restoreSize = this.restoreSize || this.getSize();
                return {
                    x : restorePos[0], 
                    y : restorePos[1],
                    width : restoreSize.width,
                    height : restoreSize.height,
                    maximized : true
                };
            }else {
                var xy = this.getXY(),
                    state = Rs.app.WindowRegion.superclass.getState.call(this);
                return Rs.apply(state, {
                    x : xy[0],
                    y : xy[1]
                });
            }
        },
        
        //private
        applyState : function(state){
            var box = {};
            for(var k in state){
                if(k == 'x' || k == 'y' 
                    || k == 'width' || k == 'height'){
                    box[k] = state[k];
                }
            }
            this.applyPanelEl(box);
            if(state && state.maximized == true){
                this.doMaximize();
            }
        },
        
        //override
        renderTo : function(el){
            Rs.app.WindowRegion.superclass.renderTo.apply(this, arguments);
            var panelEl = this.panelEl;
            if(panelEl){
                panelEl.addClass('rs-app-window rs-app-window-plain');
                this.focusEl = panelEl.insertFirst({
                    tag: 'a',
                    href:'#',
                    cls:'rs-app-window-focus',
                    tabIndex:'-1',
                    html: '&#160;'
                });
                this.focusEl.swallowEvent('click', true);
            }
        },
        
        //private
        afterApplyApp : function(){
            Rs.app.WindowRegion.superclass.afterApplyApp.apply(this, arguments);
            
            var panelEl = this.panelEl;
            if(panelEl){
                panelEl.on('mousedown', this.toFront, this);
                
                //调整窗口大小
                if(this.resizable === true){
                    this.windowResizer = new WindowResizable(this, panelEl, {
                        minWidth : this.minWidth,
                        minHeight : this.minHeight,
                        maxWidth : this.maxWidth,
                        maxHeight : this.maxHeight,
                        handles: this.resizeHandles || 'all'
                    });
                    this.windowResizer.on('beforeresize', this.beforeResize, this);
                }
                
                //模态窗口
                if(this.modal === true){
                    var BODY = Rs.getBody(),
                        mask = this.mask = BODY.createChild({
                        tag : 'div',
                        cls : 'rs-app-window-mask',
                        id : panelEl.id + '-mask'
                    });
                    
                    var DOM = Rs.lib.Dom,
                        x = 0, y = 0,
                        w = DOM.getViewWidth(true),
                        h = DOM.getViewHeight(true);
                    mask.setX(x);
                    mask.setY(y);
                    mask.setWidth(w);
                    mask.setHeight(h);
                    mask.setStyle('display', 'none');
                    mask.on('click', this.focus, this);
                }
                
                //调整大小和位置
                var b = this.getSize(),
                    p = this.getXY();
                this.applyPanelEl({
                    x : p[0],
                    y : p[1],
                    width : b.width,
                    height : b.height
                });
            }
            
            //窗口管理
            this.manager = Rs.app.WindowRegionMgr;
            this.manager.register(this);
            
        },
        
        // private
        beforeResize : function(){
            var panelEl = this.panelEl;
            this.resizeBox = {
                x : panelEl.getX(),
                y : panelEl.getY(),
                width : panelEl.getWidth(),
                height : panelEl.getHeight()
            };
        },
        
        // private
        updateHandles : function(){
            if(Rs.isIE && this.windowResizer){
                this.windowResizer.syncHandleHeight();
            }
        },

        // private
        handleResize : function(box){
            var rz = this.resizeBox;
            if(rz.x != box.x || rz.y != box.y){
                this.setXY([box.x, box.y]);
            }
            if(rz.width != box.width || rz.height != box.height){
                this.setSize({
                    width : box.width,
                    height : box.height
                });
            }
            this.toFront();
            this.updateHandles();
        },
        
        /**
         * 设置X坐标
         * @method setX
         * @param {Number} x
         */
        setX : function(x){
            var DOM = Rs.lib.Dom, 
                w = DOM.getViewWidth(true),
                size = this.getSize();
            if(x < (0 - size.width)){
                x = 30 - size.width;
            }else if(x > w){
                x = w - 30;
            }
            return this.x = x;
        },
        
        /**
         * 设置Y坐标
         * @method setY
         * @param {Number} y
         */
        setY : function(y){
            var DOM = Rs.lib.Dom, 
                h = DOM.getViewHeight(true),
                size = this.getSize();
            if(y < 0){
                y = 0;
            }else if(y > h - 30){
                y = h - 30;
            }
            return this.y = y;
        },
        
        /**
         * 获取坐标
         * @method getXY
         * @return {Array}
         */
        getXY : function(){
            var x = this.x,
                y = this.y;
            return [x, y];
        },
        
        /**
         * 设置位置
         * @method setXY
         * @param {Array} xy
         */
        setXY : function(xy){
            var x = xy[0],
                y = xy[1],
                x0, y0,
                flag = false;
            if(Rs.isNumber(x)){
                x0 = this.x;
                x = this.setX(x);
                this.panelEl.setX(x);
                flag = true;
            }
            if(Rs.isNumber(y)){
                y0 = this.y;
                y = this.setY(y);
                this.panelEl.setY(y);
                flag = true;
            }
            if(flag === true){
                this.fireEvent('move', this, [x0, y0], [x, y]);
            }
        },
        
        /**
         * 设置大小
         * @method setSize
         * @param {Object} box
         */
        setSize : function(box){
            var w = box ? box.width : undefined,
                h = box ? box.height : undefined;
            if(!Rs.isNumber(w) || !Rs.isNumber(h)){
                return;
            }
            var panelEl = this.panelEl,
                headerEl = this.getHeaderEl(),
                bodyEl = this.getBodyEl(),
                footerEl = this.getFooterEl(),
                targetEl = this.targetEl;
            
            this.width = w;
            this.height = h;
            
            panelEl.setWidth(w);
            
            headerEl.setWidth(w-12);
            headerEl.setHeight(25);
            
            footerEl.setWidth(w-12);
            footerEl.setHeight(6);
            
            w = w-12;
            h = h-headerEl.getHeight()-footerEl.getHeight();
            
            bodyEl.setWidth(w);
            bodyEl.setHeight(h);
            
            targetEl.setWidth(w);
            targetEl.setHeight(h);
            
            this.fireEvent('resize', targetEl, w, h);
        },
        
        //private
        getHeaderEl : function(){
            var headerEl = this.headerEl,
                panelEl = this.panelEl;
            if(!headerEl){
                var tl = panelEl.insertFirst({
                    tag : 'div',
                    cls : 'rs-app-window-tl x-app-window-tl'
                }), tr = tl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-tr x-app-window-tr'
                }), tc = tr.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-tc x-app-window-tc'
                });
                if(this.headerCfg){
                    headerEl = this.headerEl = tc.createChild(this.headerCfg);
                }else {
                    headerEl = this.headerEl = tc.createChild({
                        tag : 'div',
                        cls : this.headerCls
                    });
                }
                //鼠标经过窗口标题样式改变
                headerEl.on('mouseover', function(){
                    var cls = 'rs-app-window-header-over';
                    headerEl.addClass(cls);
                    headerEl.on("mouseout", function(){
                        headerEl.removeClass(cls);
                    }, this, {
                        single : true,
                        scope : this
                    });
                }, this);
                
                if(this.draggable){
                     this.windowRegionDD = new WindowRegionDD(this, headerEl, panelEl);
                }
                this.initTools();
                
                var app = this.app,
                    name = app.getName() || '', icon = app.getIcon16();
                headerEl.createChild({
                    html : '<span class="' + icon + ' rs-app-window-header-text">' + name + '</span>' 
                });
                headerEl.unselectable();
            }
            return headerEl;
        },
        
        //private
        initTools : function(){
            var headerEl = this.headerEl;
            if(this.closable){
                var closeEl = this.closeEl = headerEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-tool rs-app-tool-close x-app-tool'
                });
                closeEl.setStyle('display', 'block');
                closeEl.on('click', function(){
                    if(this.app){
                        this.app.close();
                    }else {
                        this.close();
                    }
                }, this);
                closeEl.on('mouseover', function(){
                    closeEl.addClass('rs-app-tool-close-over');
                    closeEl.on('mouseleave', function(){
                        closeEl.removeClass('rs-app-tool-close-over');
                    }, this, {single : true});
                }, this);
            }
            if(this.minimizable){
                var minimizeEl = this.minimizeEl = headerEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-tool rs-app-tool-minimize x-app-tool'
                });
                minimizeEl.setStyle('display', 'block');
                minimizeEl.on('click', this.minimize, this);
                minimizeEl.on('mouseover', function(){
                    minimizeEl.addClass('rs-app-tool-minimize-over');
                    minimizeEl.on('mouseleave', function(){
                        minimizeEl.removeClass('rs-app-tool-minimize-over');
                    }, this, {single : true});
                }, this);
                
            }
            if(this.maximizable){
                var restoreEl = this.restoreEl = headerEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-tool rs-app-tool-restore x-app-tool'
                });
                restoreEl.on('click', this.restore, this);
                restoreEl.setStyle('display', 'none');
                restoreEl.on('mouseover', function(){
                    restoreEl.addClass('rs-app-tool-restore-over');
                    restoreEl.on('mouseleave', function(){
                        restoreEl.removeClass('rs-app-tool-restore-over');
                    }, this, {single : true});
                }, this);
                
                var maximizeEl = this.maximizeEl = headerEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-tool rs-app-tool-maximize x-app-tool' 
                });
                maximizeEl.setStyle('display', 'block');
                maximizeEl.on('click', this.maximize, this);
                maximizeEl.on('mouseover', function(){
                    maximizeEl.addClass('rs-app-tool-maximize-over');
                    maximizeEl.on('mouseleave', function(){
                        maximizeEl.removeClass('rs-app-tool-maximize-over');
                    }, this, {single : true});
                }, this);
            }
            if(this.maximizable){
                headerEl.on('dblclick', this.toggleMaximize, this);
            }
        },
        
        /**
         * 重写region的open方法,窗口应用程序显示
         * @method open
         */
        open : function(){
            Rs.app.WindowRegion.superclass.open.apply(this, arguments);
            this.show();
        },
        
        /**
         * 此处重写region的close方法.
         * 关闭该应用程序,窗口式应用程序关闭,则app也将终止运行
         * @method close
         */
        close : function(){
            if(this.fireEvent('beforeclose', this) !== false){
                if(this.hidden){
                    this.doClose();
                }else {
                    this.hide(this.doClose, this);
                }
            }
        },

        // private
        doClose : function(){
            this.fireEvent('close', this);
            this.destroy();
        },
        
        //private
        restore : function(){
            if(this.maximized){
                this.doRestore();
            }
            //窗口置前
            this.toFront();
            return this;
        },
        
        //private
        doRestore : function(){
            var panelEl = this.panelEl,
                cls = 'rs-app-window-maximized',
                restorePos = this.restorePos,
                x = restorePos[0],
                y = restorePos[1],
                restoreSize = this.restoreSize,
                w = restoreSize.width,
                h = restoreSize.height;
            
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
            
            //隐藏恢复按钮显示最大化按钮
            this.maximizeEl.setStyle('display', 'block');
            this.restoreEl.setStyle('display', 'none');
            
            //调整大小和位置
            this.applyPanelEl({
                x : x,
                y : y,
                width : w,
                height : h
            });
            delete this.restorePos;
            delete this.restoreSize;
            if(this.windowRegionDD){
                this.windowRegionDD.unlock();
            }
            this.maximized = false;
            this.fireEvent('restore', this);
        },
        
        //private
        maximize : function(){
            if(!this.maximized){
                this.doMaximize();
            }
            //窗口置前
            this.toFront();
            return this;
        },
        
        //private
        doMaximize : function(){
            var DOM = Rs.lib.Dom,
                h = DOM.getViewHeight(true),
                w = DOM.getViewWidth(true),
                panelEl = this.panelEl,
                x, y, cls = 'rs-app-window-maximized';
            
            //记录最大化之前的原始位置和大小
            this.restoreSize = this.getSize();
            x = panelEl.getX();
            y = panelEl.getY();
            this.restorePos = [x, y];
            
            if(!panelEl.hasClass(cls)){
                panelEl.addClass(cls);
            }
            
            //显示恢复按钮隐藏最大化按钮
            this.maximizeEl.setStyle('display', 'none');
            this.restoreEl.setStyle('display', 'block');
            
            this.applyPanelEl({
                x : 0,
                y : 0,
                width : w - 2,
                height : h - 2
            });
            if(this.windowRegionDD){
                this.windowRegionDD.lock();
            }
            this.maximized = true;
            this.fireEvent('maximize', this);
        },
        
        //private 
        minimize : function(){
            this.hide(function(){
                this.fireEvent('minimize', this);
            }, this);
            return this;
        },
        
        //private
        toggleMaximize : function(){
            return this[this.maximized ? 'restore' : 'maximize']();
        },
        
        //private
        getBodyEl : function(){
            var bodyEl = this.bodyEl,
                panelEl = this.panelEl;
            if(!bodyEl){
                var bwrap = panelEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-bwrap'
                }), bl = bwrap.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-bl x-app-window-bl'
                }), br = bl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-br x-app-window-br'
                }), bc = br.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-bc x-app-window-bc'
                }), bodyEl = this.bodyEl = bc.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-body x-app-window-body' 
                });
                bodyEl.appendChild(this.targetEl);
            }
            return bodyEl;
        },
        
        //private
        getFooterEl : function(){
            var footerEl = this.foolterEl,
                panelEl = this.panelEl;
            if(!footerEl){
                var fwrap = panelEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-fwrap'
                }), fl = fwrap.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-fl x-app-window-fl'
                }), fr = fl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-fr x-app-window-fr'
                }), footerEl = this.foolterEl = fr.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-fc x-app-window-fc'
                });
            }
            return footerEl;
        },
        
        //private
        applyPanelEl : function(box){
            var x = box.x,
                y = box.y,
                w = box.width,
                h = box.height;
            
            this.setXY([x, y]);
            
            this.setSize({
                width : w,
                height : h
            });
        },
        
        /**
         * 当显示之后执行该方法
         * @method onShow
         */
        onShow : Rs.emptyFn,
        
        /**
         * 显示之前执行该方法
         * @method beforeShow
         */
        beforeShow : Rs.emptyFn,
        
        //private
        showMask : function(){
            if(this.modal === true){
                this.mask.setStyle('display', 'block');
            }
        },
        
        //private
        hideMask : function(){
            if(this.modal === true){
                this.mask.setStyle('display', 'none');
            }
        },
        
        /**
         * 显示窗口
         * @method show
         * @param {Function} cb 回调方法
         * @param {Object} scope 回调方法的作用域 
         */
        show : function(cb, scope){
            this.removeBlankClass();
            
            //如果隐藏则显示在前面
            if(this.hidden === false){
                this.showMask();
                this.toFront();
                return this;
            }
            
            if(this.fireEvent('beforeshow', this) === false
                || this.beforeShow(this) === false){
                return this;
            }
            if(cb){
                this.on('show', cb, scope, {single:true});
            }
            this.hidden = false;
            
            this.showMask();
            var cls = this.hideCls,
                panelEl = this.panelEl;
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
            this.afterShow();
        },
        
        //private
        afterShow : function(){
            if (this.isDestroyed){
                return false;
            }
            if(this.modal === true){
                Rs.EventManager.onWindowResize(this.onWindowResize, this);
            }
            this.toFront();
            this.onShow();
            this.fireEvent('show', this);
        },
        
        // private
        onWindowResize : function(){
            if(this.modal === true && this.mask){
                var DOM = Rs.lib.Dom,
                    x = 0, y = 0,
                    w = DOM.getViewWidth(true),
                    h = DOM.getViewHeight(true),
                    mask = this.mask;
                
                mask.setX(x);
                mask.setY(y);
                mask.setWidth(w);
                mask.setHeight(h);
            }
        },
        
        /**
         * 当隐藏该窗口之后执行该方法
         * @mehod onHide
         */
        onHide : Rs.emptyFn,
        
        /**
         * 隐藏窗口
         * @method hide
         * @param {Function} cb 回调方法
         * @param {Object} scope 回调方法的作用域
         */
        hide : function(cb, scope){
            if(this.hidden || this.fireEvent('beforehide', this) === false){
                return this;
            }
            if(Rs.isFunction(cb)){
                this.on('hide', cb, scope, {single:true});
            }
            this.hidden = true;
            this.hideMask();
            var cls = this.hideCls,
                panelEl = this.panelEl;
            if(!panelEl.hasClass(cls)){
                panelEl.addClass(cls);
            }
            this.afterHide();
        },
        
        // private
        afterHide : function(){
            if(this.modal === true){
                Rs.EventManager.removeResizeListener(this.onWindowResize, this);
            }
            this.onHide();
            this.fireEvent('hide', this);
        },
        
        //private  窗口前置
        toFront : function(e){
            if(this.manager.bringToFront(this)){
                if(!e || !e.getTarget().focus){
                    this.focus();
                }
            }
            return this;
        },
        
        /**
         * 设置活动窗口
         * @method setActive
         * @param {Boolean} active
         */
        setActive : function(active){
            if(active){
                this.fireEvent('activate', this);
            }else{
                this.fireEvent('deactivate', this);
            }
        },
        
        /**
         * 将焦点置于该窗口
         * @method focus
         */
        focus : function(){
            var f = this.focusEl;
            if(f){
                f.focus.defer(10, f);
            }
        },
        
        //private
        setZIndex : function(index){
            if(this.modal){
                this.mask.setStyle('z-index', index);
            }
            var panelEl = this.panelEl;
            if(panelEl){
                panelEl.setStyle('z-index', ++index);
                index += 5;
            }
            if(this.windowResizer){
                this.windowResizer.proxy.setStyle('z-index', ++index);
            }
            this.lastZIndex = index;
        },
        
        //private 删除空白位置样式
        removeBlankClass : function(){
            var cls = 'rs-app-blank-region',
                panelEl = this.panelEl;
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
        }, 
        
        //private
        ghost : function(){
            var panel = this.panelEl,
                bodyEl = this.bodyEl,
                w = bodyEl.dom.offsetWidth,
                h = bodyEl.dom.offsetHeight,
                x = panel.getX(),
                y = panel.getY(),
                ghost = Rs.DomHelper.append(document.body, {
                    tag : 'div',
                    cls : 'rs-app-window-ghost rs-app-window rs-app-window-plain' 
                }, true);
            ghost.appendChild(panel.dom.firstChild.cloneNode(true));
            ghost.createChild({
                html : '<div class="rs-app-window-bwrap">'
                    +'<div class="rs-app-window-bl x-app-window-bl">'
                    +'<div class="rs-app-window-br x-app-window-br"><div class="rs-app-window-bc x-app-window-bc">'
                    +'<div class="rs-app-window-body x-app-window-body" style="width: '+ w + 'px; height: '+ h +'px;">'
                    +'<ul style="width: '+ w + 'px; height: '+ h +'px;"></ul>'
                    +'</div></div></div></div></div>'
            });
            ghost.appendChild(panel.dom.lastChild.cloneNode(true));
            ghost.setStyle('cursor', 'move !important');
            if(Rs.isIE){
                ghost.setStyle({
                    'opacity' : '65',
                    'filter' : 'alpha(opacity=65)'
                });
            }else {
                ghost.setStyle({
                    'opacity' : '.65',
                    '-moz-opacity' : '.65',
                    'filter' : 'alpha(opacity=.65)'
                });
            } 
            ghost.unselectable();
            ghost.setX(x);
            ghost.setY(y);
            //隐藏该窗口
            this.hide();
            this.activeGhost = ghost;
            return ghost;
        }, 
        
        //private
        unghost : function(){
            if(!this.activeGhost) {
                return;
            }
            //显示该窗口
            this.show();
            this.activeGhost.hide();
            this.activeGhost.remove();
            delete this.activeGhost;
        }
        
    });

    //表格拖动操作
    var WindowRegionDD = function(win, header, panel){
        this.win = win;
        this.header = header;
        this.panel = panel;
        this.init();
    };
    
    WindowRegionDD.prototype = {
        
        //private
        loacked : false,
            
        //private
        init : function(){
            this.header.on('mouseenter', this.notifyEnter, this);
            this.header.on('mousedown', this.notifyOut, this, {
                //delay : 10,
                scope : this
            });
        }, 
        
        //鼠标进入
        notifyEnter : function(){
            
        },
        
        //鼠标点下开始拖动
        notifyOut : function(e, t, o){
            var t = Rs.get(e.getTarget());
            if(t && (t.hasClass('rs-app-tool') || t.hasClass('rs-app-window-header-text'))){
                return ;
            }
            var xy = e.getXY(),
                x = xy[0], y = xy[1],
                win = this.win,
                panel = this.panel,
                x1 = panel.getX(),
                y1 = panel.getY();
            this.offsetXY = {
                x : x - x1,
                y : y - y1
            };
            this.addOverlay();
            ghost = this.ghost = win.ghost();
            ghost.on('mousemove', this.notifyOver, this);
            ghost.on('mouseup', this.notifyDrop, this, {
                delay : 100,
                scope : this
            });
        },
        
        //添加遮盖层
        addOverlay : function(){
            var DOM = Rs.lib.Dom, 
                x = 0, y = 0,
                w = DOM.getViewWidth(true),
                h = DOM.getViewHeight(true),
                overlay, ghost;

            overlay = this.overlay =  Rs.DomHelper.append(document.body,  {
                tag : 'div',
                cls: 'rs-app-window-overlay'
            }, true);
            
            overlay.setX(x);
            overlay.setY(y);
            overlay.setWidth(w);
            overlay.setHeight(h);
            overlay.unselectable();
            
            overlay.on('mousedown', this.notifyDrop, this);
            overlay.on('mousemove', this.notifyOver, this);
            overlay.on('mouseup', this.notifyDrop, this);
        },
        
        //删除遮盖层
        removeOverlay : function(){
            var overlay = this.overlay;
            if(overlay){
                overlay.removeAllListeners();
                overlay.remove();
                delete overlay;
            }
        },
        
        //鼠标移动
        notifyOver : function(e, t, o){
            var ghost = this.ghost,
                win = this.win,
                xy = e.getXY(), 
                x = xy[0], y = xy[1],
                
                offset = this.offsetXY,
                x1 = 0, y1 = 0,
                x2, y2; 
                /*
                DOM = Rs.lib.Dom, 
                w = DOM.getViewWidth(true),
                h = DOM.getViewHeight(true),
                size = this.win.getSize();
                */
            if(offset){
                x1 = offset.x ;
                y1 = offset.y
            }
            x2 = x - x1;
            y2 = y - y1;
            /*if(x2 >=0 && x2 <= w - size.width)*/{
                ghost.setX(x2);
            }
            if(y2 >= 0 /*&& y2 <= h - size.height*/){
                ghost.setY(y2);
            }else {
                win.unghost();
                win.setXY([x2, 0]);
                win.toFront(e);
                
                this.removeOverlay();
                this.offsetXY = null;
            }
        },

        //鼠标点击弹起
        notifyDrop : function(e, t, o){
            var xy = e.getXY(),
                x = xy[0], y = xy[1],
                offset = this.offsetXY,
                x1 = 0, y1 = 0,
                win = this.win,
                x2, y2;
            if(offset){
                x1 = offset.x ;
                y1 = offset.y
            }
            x2 = x - x1;
            y2 = y - y1;
            win.unghost();
            win.setXY([x2, y2]);
            win.toFront(e);
            
            this.removeOverlay();
            this.offsetXY = null;
        }, 
        
        //锁定拖拽
        lock : function(){
            if(this.loacked === false){
                this.header.un('mouseenter', this.notifyEnter, this);
                this.header.un('mousedown', this.notifyOut, this);
                this.locked = true;
            }
        },
        
        //解锁拖拽
        unlock : function(){
            if(this.locked === true){
                this.header.on('mouseenter', this.notifyEnter, this);
                this.header.on('mousedown', this.notifyOut, this, {
                    //delay : 10,
                    scope : this
                });
                this.locked = false;
            }
        }, 
        
        //销毁
        destroy : function(){
            this.removeOverlay();
            if(this.header){
                this.header.un('mouseenter', this.notifyEnter, this);
                this.header.un('mousedown', this.notifyOut, this);
            }
            if(this.ghost){
                this.ghost.un('mousemove', this.notifyOver, this);
                this.ghost.un('mouseup', this.notifyDrop, this);
                delete this.ghost;
            }
        }
        
    };
    
    
    //窗口管理
    var WindowGroup = function(){
        var list = {};
        var accessList = [];
        var front = null;
        
        //窗口排序,如果是模态窗口则排在最后,显示到最上层
        var sortWindows = function(d1, d2){
            if(d1.modal === true && d1.hidden !== true){
                return 1;
            }else if(d2.modal === true && d2.hidden !== true){
                return -1;
            }else {
                return (!d1._lastAccess || d1._lastAccess < d2._lastAccess) ? -1 : 1;
            }
        };
        
        // private
        var orderWindows = function(){
            var a = accessList, len = a.length;
            if(len > 0){
                a.sort(sortWindows);
                var seed = a[0].manager.zseed;
                for(var i = 0; i < len; i++){
                    var win = a[i];
                    if(win && !win.hidden){
                        win.setZIndex(seed + (i*10));
                    }
                }
            }
            activateLast();
        };

        // private
        var setActiveWin = function(win){
            if(win != front){
                if(front){
                    front.setActive(false);
                }
                front = win;
                if(win){
                    win.setActive(true);
                }
            }
        };

        // private
        var activateLast = function(){
            for(var i = accessList.length-1; i >=0; --i) {
                if(!accessList[i].hidden){
                    setActiveWin(accessList[i]);
                    return;
                }
            }
            // none to activate
            setActiveWin(null);
        };
        
        return {
            
            //private
            zseed : 7000,
            
            //private 注册窗口
            register : function(win){
                if(win.manager){
                    win.manager.unregister(win);
                }
                win.manager = this;
    
                list[win.id] = win;
                accessList.push(win);
                win.on('hide', activateLast);
            },
            
            //private
            unregister : function(win){
                delete win.manager;
                delete list[win.id];
                win.un('hide', activateLast);
                accessList.remove(win);
            },
            
            //private
            get : function(id){
                return typeof id == "object" ? id : list[id];
            },
            
            //private 将窗口置于最前面
            bringToFront : function(win){
                win = this.get(win);
                if(win != front){
                    win._lastAccess = new Date().getTime();
                    orderWindows();
                    return true;
                }
                return false;
            },
            
            //private 将窗口至于最后面
            sendToBack : function(win){
                win = this.get(win);
                win._lastAccess = -(new Date().getTime());
                orderWindows();
                return win;
            },
            
            //隐藏所有窗口
            hideAll : function(){
                for(var id in list){
                    if(list[id] && typeof list[id] != "function" && list[id].isVisible()){
                        list[id].hide();
                    }
                }
            },
            
            //private
            getActive : function(){
                return front;
            },
            
            //private
            getBy : function(fn, scope){
                var r = [];
                for(var i = accessList.length-1; i >=0; --i) {
                    var win = accessList[i];
                    if(fn.call(scope||win, win) !== false){
                        r.push(win);
                    }
                }
                return r;
            },

            //private
            each : function(fn, scope){
                for(var id in list){
                    if(list[id] && typeof list[id] != "function"){
                        if(fn.call(scope || list[id], list[id]) === false){
                            return;
                        }
                    }
                }
            }
        };
        
    };
    
    /**
     * 窗口管理
     */
    Rs.app.WindowRegionMgr = new WindowGroup();
    
    
    //窗口调整大小类
    var WindowResizable = function(win, el, config){
        
        this.win = win;
        
        this.el = el;
        
        //创建调整大小代理
        this.proxy = this.createProxy({
            tag: 'div', 
            cls: 'rs-app-window-resizable-proxy', 
            id: this.el.id + '-rzproxy'
        }, Rs.getBody());
        this.proxy.unselectable();
        this.proxy.setStyle('display', 'block');
        
        //应用配置
        Rs.apply(this, config);
        
        //设置调整大小的位置
        if(!this.handles){ // no handles passed, must be legacy style
            this.handles = 's,e,se';
            if(this.multiDirectional){
                this.handles += ',n,w';
            }
        }
        if(this.handles == 'all'){
            this.handles = 'n s e w ne nw se sw';
        }
        var hs = this.handles.split(/\s*?[,;]\s*?| /),
            ps = WindowResizable.positions;
        
        for(var i = 0, len = hs.length; i < len; i++){
            if(hs[i] && ps[hs[i]]){
                var pos = ps[hs[i]];
                this[pos] = new WindowResizable.Handle(this, pos);
            }
        }
        //legacy
        this.corner = this.southeast;
        
        this.addEvents(
            /**
             * @event beforeresize
             */
            'beforeresize',
            
            /**
             * @event resize
             */
            'resize'
        );
        
        if(this.width && this.height){
            this.resizeTo(this.width, this.height);
        }
        
        WindowResizable.superclass.constructor.call(this);
    };
    
    Rs.extend(WindowResizable, Rs.util.Observable, {
        
        //private
        enabled : true,
        
        heightIncrement : 0,
            
        widthIncrement : 0,
        
        minHeight : 5,

        minWidth : 5,
        
        maxHeight : 10000,

        maxWidth : 10000,

        minX: 0,
        
        minY: 0,
        
        //是否保持原有比例
        preserveRatio : false,
        
        //private
        init : function(){
            this.proxy = this.createProxy({
                tag: 'div', 
                cls: 'rs-app-window-resizable-proxy', 
                id: this.el.id + '-rzproxy'
            }, Rs.getBody());
            this.proxy.unselectable();
            this.proxy.setStyle('display', 'block');
        },
        
        //private 创建当调整大小时的代理DIV
        createProxy : function(config, renderTo){
            config = (typeof config == 'object') ? config : {tag : "div", cls: config};
            var me = this,
                DH = Rs.DomHelper,
                el = me.el,
                proxy = DH.append(renderTo, config, true),
                x, y, w, h;
            return proxy;
        }, 
        
        //调整大小
        resizeTo : function(w, h){
            this.win.setSize({
                width : w,
                height : h
            });
            this.fireEvent('resize', this, w, h, null);
        },
        
        // private
        startSizing : function(e, handle){
            this.fireEvent('beforeresize', this, e);
            if(this.enabled){
                var overlay = this.overlay;
                if(!overlay){
                    overlay = this.overlay = this.createOverlay({
                        tag: 'div', 
                        cls: 'rs-app-window-resizable-overlay', 
                        html: '&#160;'
                    }, Rs.getBody());
                    overlay.on({
                        scope: this,
                        mousemove: this.onMouseMove,
                        mouseup: this.onMouseUp
                    });
                }
                this.resizing = true;
                
                overlay.setStyle('cursor', handle.el.getStyle('cursor'));
                overlay.show();
                
                var el = this.el,
                    proxy = this.proxy,
                    x, y, w, h, 
                    box, pot;
                
                x = el.getX();
                y = el.getY();
                w = el.getWidth();
                h = el.getHeight();
                
                box = this.startBox = {
                    x : x, 
                    y : y,
                    width : w,
                    height : h
                };
                pot = this.startPoint = e.getXY();
                this.offsets = [(box.x + box.width) - pot[0], 
                                (box.y + box.height) - pot[1]];
                
                proxy.setStyle('visibility', 'hidden');
                proxy.setX(x);
                proxy.setY(y);
                proxy.setWidth(w);
                proxy.setHeight(h);
                proxy.show();
            }
        },
        
        //创建遮盖层
        createOverlay : function(config, renderTo){
            config = (typeof config == 'object') ? config : {tag : "div", cls: config};
            
            var DOM = Rs.lib.Dom, 
                DH = Rs.DomHelper,
                x = 0, y = 0,
                w = DOM.getViewWidth(true),
                h = DOM.getViewHeight(true),
                overlay = DH.append(renderTo, config, true);
            
            overlay.setX(x);
            overlay.setY(y);
            overlay.setWidth(w);
            overlay.setHeight(h);
            overlay.unselectable();
            
            return overlay;
        },
        
        // private
        onMouseDown : function(handle, e){
            if(this.enabled){
                e.stopEvent();
                this.activeHandle = handle;
                this.startSizing(e, handle);
            }
        },
        
        
        // private
        onMouseUp : function(e){
            this.activeHandle = null;
            var size = this.resizeElement(),
                overlay = this.overlay;
            
            this.resizing = false;
            this.handleOut();
            overlay.hide();
            this.fireEvent('resize', this, size.width, size.height, e);
        },
        
        //private
        resizeElement : function(){
            var proxy = this.proxy,
                win = this.win,
                x = proxy.getX(),
                y = proxy.getY(),
                w = proxy.getWidth(),
                h = proxy.getHeight(), 
                box;
            
            box = {
                x : x,
                y : y,
                width : w,
                height : h
            };
            
            proxy.hide();
            win.handleResize(box);
            return box;
        },
        
        
        // private
        constrain : function(v, diff, m, mx){
            if(v - diff < m){
                diff = v - m;
            }else if(v - diff > mx){
                diff = v - mx;
            }
            return diff;
        },
        
        // private
        snap : function(value, inc, min){
            if(!inc || !value){
                return value;
            }
            var newValue = value;
            var m = value % inc;
            if(m > 0){
                if(m > (inc/2)){
                    newValue = value + (inc-m);
                }else{
                    newValue = value - m;
                }
            }
            return Math.max(min, newValue);
        },
        
        // private
        onMouseMove : function(e){
            if(this.enabled && this.activeHandle){
                try{
                    var curSize = this.curSize || this.startBox,
                        x = this.startBox.x, y = this.startBox.y,
                        ox = x,
                        oy = y,
                        w = curSize.width,
                        h = curSize.height,
                        ow = w,
                        oh = h,
                        mw = this.minWidth,
                        mh = this.minHeight,
                        mxw = this.maxWidth,
                        mxh = this.maxHeight,
                        wi = this.widthIncrement,
                        hi = this.heightIncrement,
                        eventXY = e.getXY(),
                        diffX = -(this.startPoint[0] - Math.max(this.minX, eventXY[0])),
                        diffY = -(this.startPoint[1] - Math.max(this.minY, eventXY[1])),
                        pos = this.activeHandle.position,
                        tw,
                        th,
                        proxy = this.proxy;
    
                    switch(pos){
                        case 'east':
                            w += diffX;
                            w = Math.min(Math.max(mw, w), mxw);
                            break;
                        case 'south':
                            h += diffY;
                            h = Math.min(Math.max(mh, h), mxh);
                            break;
                        case 'southeast':
                            w += diffX;
                            h += diffY;
                            w = Math.min(Math.max(mw, w), mxw);
                            h = Math.min(Math.max(mh, h), mxh);
                            break;
                        case 'north':
                            diffY = this.constrain(h, diffY, mh, mxh);
                            y += diffY;
                            h -= diffY;
                            break;
                        case 'west':
                            diffX = this.constrain(w, diffX, mw, mxw);
                            x += diffX;
                            w -= diffX;
                            break;
                        case 'northeast':
                            w += diffX;
                            w = Math.min(Math.max(mw, w), mxw);
                            diffY = this.constrain(h, diffY, mh, mxh);
                            y += diffY;
                            h -= diffY;
                            break;
                        case 'northwest':
                            diffX = this.constrain(w, diffX, mw, mxw);
                            diffY = this.constrain(h, diffY, mh, mxh);
                            y += diffY;
                            h -= diffY;
                            x += diffX;
                            w -= diffX;
                            break;
                       case 'southwest':
                            diffX = this.constrain(w, diffX, mw, mxw);
                            h += diffY;
                            h = Math.min(Math.max(mh, h), mxh);
                            x += diffX;
                            w -= diffX;
                            break;
                    }
    
                    var sw = this.snap(w, wi, mw);
                    var sh = this.snap(h, hi, mh);
                    if(sw != w || sh != h){
                        switch(pos){
                            case 'northeast':
                                y -= sh - h;
                            break;
                            case 'north':
                                y -= sh - h;
                                break;
                            case 'southwest':
                                x -= sw - w;
                            break;
                            case 'west':
                                x -= sw - w;
                                break;
                            case 'northwest':
                                x -= sw - w;
                                y -= sh - h;
                            break;
                        }
                        w = sw;
                        h = sh;
                    }
    
                    if(this.preserveRatio){
                        switch(pos){
                            case 'southeast':
                            case 'east':
                                h = oh * (w/ow);
                                h = Math.min(Math.max(mh, h), mxh);
                                w = ow * (h/oh);
                               break;
                            case 'south':
                                w = ow * (h/oh);
                                w = Math.min(Math.max(mw, w), mxw);
                                h = oh * (w/ow);
                                break;
                            case 'northeast':
                                w = ow * (h/oh);
                                w = Math.min(Math.max(mw, w), mxw);
                                h = oh * (w/ow);
                            break;
                            case 'north':
                                tw = w;
                                w = ow * (h/oh);
                                w = Math.min(Math.max(mw, w), mxw);
                                h = oh * (w/ow);
                                x += (tw - w) / 2;
                                break;
                            case 'southwest':
                                h = oh * (w/ow);
                                h = Math.min(Math.max(mh, h), mxh);
                                tw = w;
                                w = ow * (h/oh);
                                x += tw - w;
                                break;
                            case 'west':
                                th = h;
                                h = oh * (w/ow);
                                h = Math.min(Math.max(mh, h), mxh);
                                y += (th - h) / 2;
                                tw = w;
                                w = ow * (h/oh);
                                x += tw - w;
                               break;
                            case 'northwest':
                                tw = w;
                                th = h;
                                h = oh * (w/ow);
                                h = Math.min(Math.max(mh, h), mxh);
                                w = ow * (h/oh);
                                y += th - h;
                                x += tw - w;
                                break;
    
                        }
                    }
                    
                    proxy.setX(x);
                    proxy.setY(y);
                    proxy.setWidth(w);
                    proxy.setHeight(h);
                }catch(ex){}
            }
        },
        
        handleOver : function(){
            if(this.enabled){
                this.el.addClass('rs-app-window-resizable-over');
            }
        },
        
        handleOut : function(){
            if(!this.resizing){
                this.el.removeClass('rs-app-window-resizable-over');
            }
        }, 
        
        destroy : function(){
            this.overlay = null;
            this.proxy = null;

            var ps = WindowResizable.positions;
            for(var k in ps){
                if(typeof ps[k] != 'function' && this[ps[k]]){
                    this[ps[k]].destroy();
                }
            }
            this.purgeListeners();
        },
        
        syncHandleHeight : function(){
            var h = this.el.getHeight(true);
            if(this.west){
                this.west.el.setHeight(h);
            }
            if(this.east){
                this.east.el.setHeight(h);
            }
        }
        
    });
    
    //位置
    WindowResizable.positions  = {
            n: 'north', 
            s: 'south', 
            e: 'east', 
            w: 'west', 
            se: 'southeast', 
            sw: 'southwest', 
            nw: 'northwest', 
            ne: 'northeast'
    };
    
    //
    WindowResizable.Handle = function(rz, pos, disableTrackOver){
        this.position = pos;
        this.rz = rz;
        this.init();
    };
    
    WindowResizable.Handle.prototype = {
        
        init : function(){
            this.el = this.rz.el.createChild({
                tag : 'div',
                cls : 'rs-app-window-resizable-handle rs-app-window-resizable-handle-' + this.position 
            });
            this.el.unselectable();
            
            this.el.on('mousedown', this.onMouseDown, this);
            
            if(!this.disableTrackOver){
                this.el.on({
                    scope: this,
                    mouseover: this.onMouseOver,
                    mouseout: this.onMouseOut
                });
            }
        },
        
        // private
        onMouseDown : function(e){
            this.rz.onMouseDown(this, e);
        },
        
        // private
        onMouseOver : function(e){
            this.rz.handleOver(this, e);
        },
        
        // private
        onMouseOut : function(e){
            this.rz.handleOut(this, e);
        },
        
        // private
        destroy : function(){
            this.el = null;
        }

    };
    
})();
(function(){
    
    /**
     * 窗口式界面
     * @class Rs.app.WindowShell
     * @extend Rs.app.Shell
     * @constructor
     * @param {Object} config
     */
    Rs.app.WindowShell = Rs.extend(Rs.app.Shell, {
        
        //整体框架
        frameTpl : ['<div class="rs-window-shell-background"></div>',
                    '<div class="rs-window-shell-taskbar"></div>'],
        
        //任务栏配置
        taskBarCfg : {},
        
        //任务栏的位置,可选的位置有north south east west
        taskBarPosition : 'south',
        
        /**
         * @cfg {String} backgroundCls
         * 背景样式
         */
        backgroundCls : 'rs-window-shell-background-1',
        
        //当窗口大小发生变化的时候执行该方法,调整任务栏的大小和位置
        onWindowResize : function(){
            Rs.app.WindowShell.superclass.onWindowResize.apply(this, arguments);
            //调整任务栏的大小和位置
            var taskbar = this.taskbar;
            if(taskbar){
                taskbar.doLayout();
            }
            //调整背景的大小和样式
            this.syncBackGround();
        },
        
        /**
         * 重写doBuild方法,当程序引擎启动的时候调用该方法,构建应用程序
         * @method doBuild
         */
        doBuild : function(){
            Rs.app.WindowShell.superclass.doBuild.apply(this, arguments);
            
            var frame = this.frame,
                taskBarEl = frame.child('.rs-window-shell-taskbar');
            
            //创建任务栏
            if(taskBarEl){
                var taskbar = this.taskbar,
                    xy, size;
                if(!taskbar){
                    taskbar = this.taskbar = new WindowShellTaskBar(this, 
                            this.taskBarPosition, this.taskBarCfg);
                    taskbar.renderTo(taskBarEl);
                }
            }
            //设置背景
            this.backgroundEl = frame.child('.rs-window-shell-background');
            this.syncBackGround();
        },
        
        //调整背景的大小和样式图片
        syncBackGround : function(){
            var backgroundEl = this.backgroundEl;
            if(backgroundEl){
                var size = this.getSize();
                backgroundEl.setX(0);
                backgroundEl.setY(0);
                backgroundEl.setWidth(size.width);
                backgroundEl.setHeight(size.height);
                
                backgroundEl.addClass(this.backgroundCls);
            }
        }
        
    });
    
    //注册window类型的shell
    Rs.app.SHELL['window'] = Rs.app.WindowShell;
    
    /*
     * 任务栏, 其中包括开始按钮,当用户点击打开应用程序的时候
     * 在任务栏显示所有已经打开的程序
     */
    var WindowShellTaskBar = function(shell, position, config){
        this.shell = shell;
        this.position = position || 'south';
        Rs.apply(this, config);
        WindowShellTaskBar.superclass.constructor.call(this);
    };

    Rs.extend(WindowShellTaskBar, Rs.util.Observable, {
        
        /**
         * @cfg {Number} width default 50
         */
        width : 30,
        
        /**
         * @cfg {Number} height defualt 30
         */
        height : 30,
        
        /**
         * 开始菜单名字
         * @cfg {String} startButtonText 
         */
        startButtonText : '开始',
        
        //private
        rendered : false,
        
        /**
         * 渲染开始菜单
         * @method renderTo
         * @param {Element} el
         */
        renderTo : function(el){
            if(this.rendered === false && this.fireEvent('beforerender', this) !== false){
                this.targetEl = el;
                this.rendered = true;
                //设置样式
                this.targetEl.addClass('rs-window-shell-taskbar-' + this.position);
                
                //添加开始菜单按钮
                this.getStartButtonEl();
                
                //添加任务栏上的按钮位置
                this.getTaskButtonsEl();
                
                //保存任务栏程序按钮
                this.taskButtons = new Rs.util.MixedCollection();
                
                //初始化事件设置
                this.initEvents();
                this.afterRender();
                this.syncPosSize();
            }
        },
        
        //获取开始菜单按钮
        getStartButtonEl : function(){
            var pos = this.position,
                startButtonEl = this.startButtonEl,
                innerHTML ;
            if(!startButtonEl){
                if(pos == 'north' || pos == 'south'){
                    innerHTML = '<table><tr>'
                        +'<td class="rs-window-shell-start-left-h"><i>&#160;</i></td>'
                        +'<td class="rs-window-shell-start-center-h">'
                        +'<button id="rs-window-shell-start-button" class="rs-window-shell-start-text start"'
                        +'type="button" style="height:28px;">' + this.startButtonText + '</button></td>'
                        +'<td class="rs-window-shell-start-right-h"><i>&#160;</i></td>'
                        +'<td><i>&#160;</i></td>'
                        +'<td class="rs-window-shell-start-split-h"><i></i></td>'
                        +'</tr></table>';
                }else if(pos == 'west' || pos == 'east'){
                    innerHTML = '<table><tr>'
                        +'<td class="rs-window-shell-start-left-v"><i>&#160;</i></td></tr><tr>'
                        +'<td class="rs-window-shell-start-center-v">'
                        +'<button id="rs-window-shell-start-button" class="rs-window-shell-start-text start" '
                        +'type="button" style="height:30px;"></button></td></tr><tr>'
                        +'<td class="rs-window-shell-start-right-v"><i>&#160;</i></td></tr><tr>'
                        +'<td><i>&#160;</i></td></tr><tr>'
                        +'<td class="rs-window-shell-start-split-v"><i></i></td></tr><tr>'
                        +'</table>';
                }
                
                //添加开始菜单
                startButtonEl = this.startButtonEl = this.targetEl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start',
                    html : innerHTML
                });
                startButtonEl.addClass('rs-window-shell-start-' + pos);
                startButtonEl.unselectable();
                
                var startButton = this.startButton = Rs.get('rs-window-shell-start-button');
                if(startButton){
                    startButton.on('click', this.toggleStartMenu, this);
                }
                var body = Rs.getBody();
                body && body.on('keydown', function(k, el){
                    if(k && k.ctrlKey === true && k.getKey() == 91){
                        this.toggleStartMenu();
                    }
                }, this);
            }
            return startButtonEl;
        },
        
        //任务栏上已打开程序名字按钮
        getTaskButtonsEl : function(){
            var taskButtonsEl = this.taskButtonsEl;
            if(!taskButtonsEl){
                //位置
                var pos = this.position,
                    v = (pos == 'west' || pos == 'east'),
                    strip = this.targetEl.createChild({
                        tag : 'div',
                        cls : 'rs-window-shell-taskbuttons-strip' + (v?'-vertical':'')
                    }), wrap = this.taskButtonsWrap = strip.createChild({
                        tag : 'div',
                        cls : 'rs-window-shell-taskbuttons-strip-wrap' + (v?'-vertical':'')
                    }), leftScroller = this.leftScroller = wrap.createChild({
                        tag : 'div',
                        cls : 'rs-window-shell-taskbuttons-scroller-left' + (v?'-vertical':'')
                    }), taskButtonsEl = this.taskButtonsEl = wrap.createChild({
                        tag : 'ul'
                    }), rightScroller = this.rightScroller = wrap.createChild({
                        tag : 'div',
                        cls : 'rs-window-shell-taskbuttons-scroller-right' + (v?'-vertical':'')
                    });
                
                leftScroller.on('mousedown', function(){
                    var id = setInterval((function(){
                        if(this.scrollerToLeft() !== true){
                            clearInterval(id);
                        }
                    }).createDelegate(this), 15);
                    leftScroller.on('mouseup', function(){
                        clearInterval(id);    
                    }, this, {
                        single : true
                    });
                }, this);
                rightScroller.on('mousedown', function(){
                    var id = setInterval((function(){
                        if(this.scrollerToRight() !== true){
                            clearInterval(id);
                        }
                    }).createDelegate(this), 15);
                    rightScroller.on('mouseup', function(){
                        clearInterval(id);
                    }, this, {
                        single : true
                    });
                }, this);

                leftScroller.hide();
                rightScroller.hide();
                
                leftScroller.unselectable();
                rightScroller.unselectable();
                taskButtonsEl.unselectable();
            }
            return taskButtonsEl;
        },
        
        //private
        scrollerToLeft : function(){
            var taskButtonsEl = this.taskButtonsEl,
                last = taskButtonsEl.last('li'),
                rightScroller = this.rightScroller,
                pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                getRight = v?'getBottom':'getRight',
                getLeft = v?'getTop':'getLeft',
                setX = v?'setY':'setX',
                getX = v?'getY':'getX'; 
            if(last){
                var r = last[getRight](),
                    o = rightScroller[getLeft]();
                if(r > o){
                    taskButtonsEl[setX](taskButtonsEl[getX]() - 5);
                    return true;
                }
            }
        },
        
        //private
        scrollerToRight : function(){
            var taskButtonsEl = this.taskButtonsEl,
                first = taskButtonsEl.first('li'),
                leftScroller = this.leftScroller,
                pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                getRight = v?'getBottom':'getRight',
                getLeft = v?'getTop':'getLeft',
                setX = v?'setY':'setX',
                getX = v?'getY':'getX'; 
            if(first){
                var r = first[getLeft](),
                    o = leftScroller[getRight]();
                if(r < o){
                    taskButtonsEl[setX](taskButtonsEl[getX]() + 5);
                    return true;
                }
            }
        },
        
        //打开关闭开始菜单
        toggleStartMenu : function(){
            var startMenu = this.getStartMenu();
            if(startMenu){
                startMenu[startMenu.isVisible()?'hide':'show']();
            }
        },
        
        //初始化事件设置
        initEvents : function(){
            var shell = this.shell,
                engine = shell.getEngine();
            engine.on('install', this.onAppInstall, this);
            engine.on('uninstall', this.onAppUninstall, this);
        },
        
        //当应用程序安装的时候执行该方法
        onAppInstall : function(engine, app){
            var startMenu = this.getStartMenu();
            startMenu.onAppInstall(app);
            app.on('open', this.onAppOpen, this);
            app.on('close', this.onAppClose, this);
        },
        
        //当应用程序卸载的时候执行该方法
        onAppUninstall : function(engine, app){
            var startMenu = this.getStartMenu();
            startMenu.onAppUninstall(app);
            app.un('open', this.onAppOpen, this);
            app.un('close', this.onAppClose, this);
        },
        
        //当应用程序打开的时候
        onAppOpen : function(app){
            var startMenu = this.getStartMenu();
            startMenu.onAppOpen(app);
            //在任务栏上显示该应用程序的名字
            this.doAddTaskButton(app);
        },
        
        //添加程序按钮
        doAddTaskButton : function(app){
            var taskButtonsEl = this.taskButtonsEl;
            if(taskButtonsEl){
                var pos = this.position,
                    v = (pos == 'west' || pos == 'east'),
                    startButtonEl = this.startButtonEl,
                    last = taskButtonsEl.last('li'),
                    offset = (last?last:startButtonEl)[v?'getBottom':'getRight']() + 3,
                    region = app.region,
                    id = 'taskbutton-' + app.getId(),
                    name = app.getName() || '',
                    icon = app.getIcon16(),
                    innerHTML, name_v = [];
                
                if(v){
                    for(var i = 0, len = name.length; i < len; i++){
                        name_v.push((i==0?'':'<br/>')+name.charAt(i));
                    }
                }
                innerHTML = v ? '<table class="rs-window-shell-taskbuttons-activate"><tr>'
                        +'<td class="rs-window-shell-taskbutton-left-vertical"><i></i></td>'
                        +'</tr><tr><td class="rs-window-shell-taskbutton-center-vertical">'
                        +'<div class="rs-window-shell-taskbutton-text-vertical rs-window-shell-taskbutton-icon-vertical '+ icon +'">'
                        + name_v.join('')
                        +'</div></td></tr><tr>'
                        +'<td class="rs-window-shell-taskbutton-right-vertical"><i></i></td>'
                        +'</tr></table>' : '<table class="rs-window-shell-taskbuttons-activate"><tr>'
                            +'<td class="rs-window-shell-taskbutton-left"><i></i></td>' //&#160;
                            +'<td class="rs-window-shell-taskbutton-center">'
                            +'<button class="rs-window-shell-taskbutton-text rs-window-shell-taskbutton-icon '+ icon +'"'
                            +'type="button">' + name + '</button></td>'
                            +'<td class="rs-window-shell-taskbutton-right"><i></i></td>' //&#160;
                            +'</tr></table>';
                
                var button = this.taskButtons.add(taskButtonsEl.createChild({
                    tag : 'li',
                    id : id,
                    html : innerHTML
                }));
                
                button[v?'setY':'setX'](offset);
                
                //点击该按钮显示或隐藏应用程序
                button.on('click', this.toggleTaskButton.createDelegate(this, 
                    [app, region]), this);
                
                //窗口状态发生变化时修改按钮样式
                var table = button.first('table'),
                    cls = 'rs-window-shell-taskbuttons-activate';
                region.on('activate', function(){
                    if(table && !table.hasClass(cls)){
                        table.addClass(cls);
                    }
                }, this);
                region.on('deactivate', function(){
                    if(table && table.hasClass(cls)){
                        table.removeClass(cls);
                    }
                }, this);
                
                //调整显示左右滚动条按钮
                this.toggleLeftRightScroller();
            }
        },
        
        //private
        toggleLeftRightScroller : function(){
            var wrap = this.taskButtonsWrap,
                taskButtonsEl = this.taskButtonsEl,
                first = taskButtonsEl.first('li'),
                last = taskButtonsEl.last('li'),
                leftScroller = this.leftScroller,
                rightScroller = this.rightScroller,
                pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                get = v?'getY':'getX',
                set = v?'setY':'setX',
                getLeft = v?'getTop':'getLeft',
                getRight = v?'getBottom':'getRight',
                moveToLeft = function(m){
                    var btns = this.taskButtons, btn,
                        i = 0, len = btns.length;
                    for(; i < len; i++){
                        btn = btns.get(i);
                        btn[set](btn[get]() - m);
                    }
                }, moveToRight = function(m){
                    var btns = this.taskButtons, btn,
                        i = 0, len = btns.length;
                    for(; i < len; i++){
                        btn = btns.get(i);
                        btn[set](btn[get]() + m);
                    }
                }, showScroller = function(){
                    if(!leftScroller.isVisible()){
                        leftScroller.show();
                        moveToRight.call(this, 19);
                    }
                    if(!rightScroller.isVisible()){
                        rightScroller.show();
                    }
                }, hiddenScroller = function(){
                    if(leftScroller.isVisible()){
                        leftScroller.hide();
                        moveToLeft.call(this, 19);
                    }
                    if(rightScroller.isVisible()){
                        rightScroller.hide();
                    }
                };
            if(last){
                var l = wrap[getLeft](),
                    r = wrap[getRight](),
                    a = first[getLeft](),
                    b = last[getRight]();
                if(Math.abs(b - a) > Math.abs(r - l)){
                    showScroller.call(this);
                    if(r > b){
                        moveToRight.call(this, r - b);
                    }else if(l < a - 19){
                        moveToLeft.call(this, a - 19 - l);
                    }
                }else {
                    hiddenScroller.call(this);
                }
            }else {
                hiddenScroller.call(this);
            }
        },
        
        
        //private
        toggleTaskButton : function(app, region){
            if(region){
                if(Rs.app.WindowRegionMgr.getActive() != region){
                    region.show();
                }else {
                    region[region.isVisible()?'hide':'show']();
                }
            }
        },
        
        //当应用程序关闭的时候
        onAppClose : function(app){
            //在任务栏上删除该任务栏的名字
            var taskButtons = this.taskButtons,
                id = 'taskbutton-' + app.getId(),
                startButtonEl = this.startButtonEl,
                left = startButtonEl.getRight() + 3,
                found = false, button,
                pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                getLeft = v?'getTop':'getLeft',
                getRight = v?'getBottom':'getRight',
                setX = v?'setY':'setX';
            for(var i = 0; i < taskButtons.length; i++){
                button = taskButtons.itemAt(i);
                if(id == button.id){
                    left = button[getLeft]();
                    found = true;
                    button.remove();
                    taskButtons.remove(button); 
                    i--;
                }else if(found === true){
                    button[setX](left);
                    left = button[getRight]() + 3;
                }
            }
            
            //调整显示左右滚动条按钮
            this.toggleLeftRightScroller();
            
            //执行startMenu的onAppClose方法
            var startMenu = this.getStartMenu();
                startMenu.onAppClose(app);
        },
        
        //渲染完成之后执行该方法
        afterRender : Rs.emptyFn,
        
        //同步任务栏的大小和位置
        syncPosSize : function(){
            
            //设置整体任务栏大小
            var xy = this.getXY(),
                size = this.getSize();
            this.setX(xy[0]);
            this.setY(xy[1]);
            this.setWidth(size.width);
            this.setHeight(size.height);
            
            var wrap = this.taskButtonsWrap;
            if(wrap){
                var pos = this.position,
                    v = (pos == 'west' || pos == 'east'),
                    w = this.getTaskButtonsWrapWidth();
                wrap[v?'setHeight':'setWidth'](w);
            }
            
            //调整显示左右滚动条按钮
            this.toggleLeftRightScroller();
            
            this.fireEvent('render', this);
        },
        
        //private 获取任务栏的宽度,如果任务栏为垂直模式则返回的是任务栏的高度
        getTaskButtonsWrapWidth : function(){
            var pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                shell = this.shell,
                size = shell.getSize(),
                startBtn = this.getStartButtonEl();
            if(v == true){
                return size.height - startBtn.getHeight();
            }else {
                return size.width - startBtn.getWidth();
            }
        },
        
        //设置任务栏的X坐标
        setX : function(x){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setX(x);
            }
        },
        
        //设置任务栏Y坐标
        setY : function(y){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setY(y);
            }
        },
        
        /**
         * 获取任务栏的位置
         * @method getXY
         * @return {Array} pos
         */
        getXY : function(){
            var shell = this.shell,
                size = shell.getSize(),
                pos = this.position,
                b = this.getSize(),
                x, y;
            if(pos == 'north' || pos == 'south'){
                x = 0;
                y = size.height - (pos=='north'?size.height:b.height);
            }else if(pos == 'west' || pos == 'east'){
                y = 0;
                x = size.width - (pos=='west'?size.width:b.width); 
            }
            return [x, y];
        },
        
        //设置任务栏的宽度
        setWidth : function(w){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setWidth(w);
            }
        },
        
        //设置任务栏高度
        setHeight : function(h){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setHeight(h);
            }
        },
        
        /**
         * 获取开始菜单大小
         * <pre><code> 
          return {
             width : 1024,
             height : 30
          }
         </code></pre>
         * @method getSize
         * @return {Object} size
         */
        getSize : function(){
            var shell = this.shell,
                size = shell.getSize(),    
                pos = this.position,
                w, h;
            if(pos == 'north' || pos == 'south'){
                w = size.width;
                h = this.height;
            }else if(pos == 'east' || pos == 'west'){
                w = this.width;
                h = size.height;
            }
            return {
                width : w,
                height : h
            };
        },
        
        
        //调整任务栏以及其中的各个元素的位置和大小
        doLayout : function(){
            this.syncPosSize();
        }, 
        
        //获取开始菜单
        getStartMenu : function(){
            var startMenu = this.startMenu;
            if(!startMenu){
                startMenu = this.startMenu = new WindowShellStartMenu(this.shell, this, {});
            }
            return startMenu;
        }
        
    });
    
    /*
     * 开始菜单栏
     */
    var WindowShellStartMenu = function(shell, taskbar, config){
        
        this.shell = shell;
        
        this.taskbar = taskbar;
        
        Rs.apply(this, config);
        
        this.appEls = new Rs.util.MixedCollection();

        this.settings = new Rs.util.MixedCollection();
        
        WindowShellStartMenu.superclass.constructor.call(this);
        
        this.init();
    };
    
    Rs.extend(WindowShellStartMenu, Rs.util.Observable, {
        
        width : 300,
        
        height : 400,
        
        //设置面板部分的宽度
        settingBodyWidth : 100,
        
        //private
        hidden : true,
        
        //初始化菜单栏
        init : function(){
            this.body = Rs.getBody().createChild({
               tag : 'div',
               cls : 'rs-window-shell-start-menu'
            });
            this.body.addClass('rs-window-shell-start-menu-hidden');
            
            var focusEl = this.focusEl = this.body.insertFirst({
                tag: 'a',
                href:'#',
                cls:'rs-app-window-focus',
                tabIndex:'-1',
                html: '&#160;'
            });
            focusEl.swallowEvent('click', true);
            focusEl.on('blur', function(e, a, b){
                this.hide();
            }, this, {
                delay : 300,
                scope : this
            });
            this.getHeaderEl();
            this.getContentEl();
        },
        
        //开始菜单头部   
        getHeaderEl : function(){
            var body = this.body,
                headerEl = this.headerEl;
            if(!headerEl){
                var hl = body.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-hl'
                }), hr = hl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-hr'
                }), hc = hr.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-hc'
                }), headerEl = this.headerEl = hc.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-header'
                });
                headerEl.addClass('user');
                headerEl.createChild({
                    html : '<span class="rs-window-shell-start-menu-user">' 
                        + (USERINFO && USERINFO.USERNAME ? USERINFO.USERNAME : '')
                        + '</span>'
                });
            }
            return headerEl;
        },
        
        //开始菜单主体部分
        getContentEl : function(){
            var body = this.body,
                contentEl = this.contentEl;
            if(!contentEl){
                var cb = body.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-cb'
                }), cl = cb.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-cl'
                }), cr = cl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-cr'
                }), contentEl = this.contentEl = cr.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-content'
                });
                //应用程序列表
                this.appBody = contentEl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-app'
                });
                this.allAppEl = this.appBody.createChild({
                    tag : 'ul'
                });
                //设置面板
                this.settingBody = contentEl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-setting'
                });
                this.settingUl = this.settingBody.createChild({
                    tag : 'ul'
                });
                
                //底部边框
                var fb = this.footerEl = body.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-fb'
                }), fl = fb.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-fl'
                }), fr = fl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-fr'
                }), fc = fr.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-footer'
                });
            }
            return contentEl;
        },
        
        //当应用程序安装
        onAppInstall : function(app){
            
            //添加应用程序名称
            var id = app.getId(), 
                name = app.getName() || '',
                item = this.appEls.add(id, this.allAppEl.createChild({
                    tag : 'li',
                    cls : 'rs-window-shell-start-menu-item'
                }));
            
            item.createChild({
                cls :  app.getIcon16() || 'rs-window-shell-default-app-icon',
                html : '<span class="rs-window-shell-start-menu-app-name">' + name + '</span>' 
            });
            
            //当鼠标经过该应用程序修改样式
            item.on('mouseover', function(){
                item.addClass('rs-window-shell-start-menu-item-over');
                item.on('mouseleave', function(){
                    item.removeClass('rs-window-shell-start-menu-item-over');
                }, this, {
                    single : true
                });
            }, this);
            
            //点击应用程序名称打开该程序
            item.on('click', function(a){
                if(!a.isOpen()){
                    a.open();
                    (function(){
                        this.hide();
                    }).defer(100, this);
                }
            }.createDelegate(this, [app]), this);
        },
        
        //当应用程序卸载
        onAppUninstall : function(app){
            var appEls = this.appEls;
                id = app.getId(),
                appEl = appEls.get(id);
            if(appEl){
                appEl.removeAllListeners();
                appEl.remove();
                appEls.removeKey(id);
            }
        }, 
        
        //当应用程序打开,在开始菜单将该应用程序名字高亮
        onAppOpen : function(app){
            var appEls = this.appEls;
                id = app.getId(),
                appEl = appEls.get(id),
                cls = 'rs-window-shell-start-menu-app-opened';
            if(appEl && !appEl.hasClass(cls)){
                appEl.addClass(cls);
            }
        },
        
        //当应用程序关闭,在开始菜单将该应用程序名字取消高亮
        onAppClose : function(app){
            var appEls = this.appEls;
                id = app.getId(),
                appEl = appEls.get(id),
                cls = 'rs-window-shell-start-menu-app-opened';
            if(appEl && appEl.hasClass(cls)){
                appEl.removeClass(cls);
            }
        },
        
        //是否显示
        isVisible : function(){
            return this.hidden === false;
        },
        
        //调整位置和大小
        syncPosSize : function(){
            var body = this.body,
                contentEl = this.getContentEl(),
                sbw = this.settingBodyWidth,
                
                taskbar = this.taskbar,
                appBody = this.appBody,
                settingBody = this.settingBody,
                
                pos = taskbar.position,
                xy1 = taskbar.getXY(),
                x1 = xy1[0], y1 = xy1[1],
                wh1 = taskbar.getSize(),
                x, y, w, h;
            
            //body的大小和位置
            w = this.width;
            h = this.height;
            
            if(pos == 'north' || pos == 'south'){
                x = 3;
                y = y1 - (pos=='south'?h+3:(-1)*(3+wh1.height));
            }else if(pos == 'west' || pos == 'east'){
                x = x1 + (pos=='west'?(wh1.width+3):(-1)*(3+w));
                y = 3;
            }
            
            //主面板的大小和位置
            body.setX(x);
            body.setY(y);
            
            body.setWidth(w);
            body.setHeight(h);
            
            contentEl.setHeight(h - 26);
            
            //程序部分的大小和位置
            appBody.setWidth(w - sbw -6);
            appBody.setHeight(h - 26);
            
            //设置面板的大小和位置
            settingBody.setX(x + w - sbw);
            settingBody.setWidth(sbw);
            settingBody.setHeight(h - 26);
        },
        
        //显示菜单栏
        show : function(){
            var f = this.focusEl;
            if(f){
                f.focus.defer(10, f);
            }
            this.hidden = false;
            var cls = 'rs-window-shell-start-menu-hidden',
                body = this.body;
            if(body.hasClass(cls)){
                body.removeClass(cls);
            }
            this.syncPosSize();
        },
        
        //隐藏菜单栏
        hide : function(){
            this.hidden = true;
            var cls = 'rs-window-shell-start-menu-hidden',
                body = this.body;
            if(!body.hasClass(cls)){
                body.addClass(cls);
            }
        }
         
    });
    
})();
(function(){
    
    /**
     * @class Rs.app.BorderShell
     * @extends Rs.app.Shell
     * border布局框架
     * @constructor
     * @param {Object} config
     */
    Rs.app.BorderShell = Rs.extend(Rs.app.Shell, {
        
        //类型
        type : 'border',
        
        //BorderShell的基本框架
        frameTpl : ['<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-center"></div></div>',
                    '<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-north"></div></div>',
                    '<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-west"></div></div>',
                    '<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-east"></div></div>',
                    '<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-south"></div></div>'],
        
        //private
        regionPos : ['north', 'south', 'west', 'east', 'center'],
            
        //重写初始化所有应用程序位置容器
        initAllRegionCollection : function(){
            Rs.app.BorderShell.superclass.initAllRegionCollection.apply(this, arguments);
            
            var regionEls = this.regionEls = new Rs.util.MixedCollection(false),
                frame = this.frame,
                regionCls = this.regionCls,
                regionPos = this.regionPos,
                els = frame.query('.' + regionCls), 
                el, ps;
            
            for(var i = 0, len = regionPos.length; i < len; i++){
                ps = regionPos[i];
                el = frame.child('.' + regionCls + '-' + ps);
                if(el){
                    regionEls.add(ps, el);
                }
            }
        },
        
        /**
         * 重写构建shell方法
         * @method doBuild
         */
        doBuild : function(){
            Rs.app.BorderShell.superclass.doBuild.apply(this, arguments);
            
            //添加应用程序位置
            var regionEls = this.regionEls,
                n = regionEls.get('north'),
                s = regionEls.get('south'),
                w = regionEls.get('west'),
                e = regionEls.get('east'),
                c = regionEls.get('center'),
                ps;
            if(n){
                var north = this.north;
                if(!north || !(north instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'north';
                    north = this.north = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    north.renderTo(n);
                    this.regions.add(ps, north);
                }
            }
            if(s){
                var south = this.south;
                if(!south || !(south instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'south';
                    south = this.south = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    south.renderTo(s);
                    this.regions.add(ps, south);
                }
            }
            if(w){
                var west = this.west;
                if(!west || !(west instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'west';
                    west = this.west = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    west.renderTo(w);
                    this.regions.add(ps, west);
                }
            }
            if(e){
                var east = this.east;
                if(!east || !(east instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'east';
                    east = this.east = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    east.renderTo(e);
                    this.regions.add(ps, east);
                }
            }
            if(c){
                var center = this.center;
                if(!center || !(center instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'center';
                    center = this.center = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    center.renderTo(c);
                    this.regions.add(ps, center);
                }
            }
        }, 
        
        /**
         * 重写方法reBuildRegions,重构shell
         * 
         * @param {Rs.app.Region} r
         * @param {Rs.app.Application} a 
         */
        doReBuild : function(r, a){
            Rs.app.BorderShell.superclass.doReBuild.apply(this, arguments);
            var regions = this.regions;
            regions.each(function(region){
                //有程序安装后,构建该应用程序位置
                if(region.isApplyApp()){
                    this.doReBuildRegion.defer(10, this, [region]);
                }
            }, this);
        },
        
        //private
        doReBuildRegion : function(region){
            var b = region.getSize(),
                m = region.getMargins(),
                ps = region.position,
                xy = this.getXY(),
                x = xy[0], y = xy[1],
                size = this.getSize(),
                w = size.width, 
                h = size.height,
                box = {}, mixBox = {height:0,width:0},
                nb = this.north?this.north.getSize():mixBox,
                sb = this.south?this.south.getSize():mixBox,
                wb = this.west?this.west.getSize():mixBox,
                eb = this.east?this.east.getSize():mixBox;
            if(ps !== 'center'){
                box.x = ((ps == 'east')?(w - b.width):0) + m.left + x;
                box.y = ((ps == 'north')?0:(ps == 'south')?(h - b.height):nb.height) + m.top + y;
                box.width = ((ps == 'north' || ps == 'south') ? w : b.width) - (m.left+m.right);
                box.height = ((ps == 'north' || ps == 'south') ? b.height : (h - nb.height - sb.height)) - (m.top + m.bottom);    
            }else {
                box.x = wb.width + m.left + x;
                box.y = nb.height + m.top + y;
                box.width = w - wb.width - eb.width - (m.left + m.right);
                box.height = h - nb.height - sb.height - (m.top + m.bottom);
            }
            if(!region.isVisible()){
                region.applyCollapsedEl(box);
            }else {
                region.applyPanelEl(box);
            }
        }, 
        
        //重写父类afterRebuild方法,确保Border中东西南北中五个部位上的应用程序都运行起来
        afterReBuild : function(region, app){
            Rs.app.BorderShell.superclass.afterReBuild.apply(this, arguments);
            if(region instanceof Rs.app.BorderShell.SplitRegion){
                if(region && app && app.isOpen() != true){
                    app.open(!region.isVisible());
                }
            }
        }
    });
    
    //注册BorderShell
    Rs.app.SHELL['border'] = Rs.app.BorderShell;
    
    /**
     * @class Rs.app.BorderShell.SplitRegion
     * @extends Rs.app.Region
     * 封装应用程序位置
     * @constructor
     * @param {Rs.app.BorderShell} shell
     * @param {Object} config
     * @param {String} pos App存放区域的位置
     */
    Rs.app.BorderShell.SplitRegion = function(shell, config, pos){
        Rs.apply(this, config);
        this.shell = shell;
        this.position = pos;
        if(typeof this.margins == 'string'){
            this.margins = this.shell.parseMargins(this.margins);
        }
        this.margins = Rs.applyIf(this.margins || {}, this.defaultMargins);
        Rs.app.BorderShell.SplitRegion.superclass.constructor.call(this, shell, config);
    };

    Rs.extend(Rs.app.BorderShell.SplitRegion, Rs.app.Region, {
                
        defaultMargins : {left:0,top:0,right:0,bottom:0},
        
        collapsedCls : 'rs-app-collapsed',
        
        isCollapsed : false,
        
        collapsed : false,
        
        /** 
         *@cfg {Number} headerHeight 
         *App存放区域标题栏高度
         */
        headerHeight : 25,
        /** 
         *@cfg {Boolean} header 
         *是否显示区域头
         */
        header : true,
        
        /** 
         *@cfg {Number} collapsedElWidth 
         *App存放区域隐藏按钮宽度
         */
        collapsedElWidth : 25,
        
        //private
        getState : function(){
            var state = Rs.app.BorderShell.SplitRegion.superclass.getState.call(this);
            return Rs.apply(state, {
                width : this.width,
                height : this.height,
                collapsed : this.collapsed
            });
        },
        
        afterApplyApp : function(app){
            if(!this.header){
                this.collapsedElWidth = 6;
            }
        },
        
        //private
        applyState : function(state){
            Rs.app.BorderShell.SplitRegion.superclass.applyState.apply(this, arguments);
            if(state && Rs.isBoolean(state.collapsed)){
                this[state.collapsed === true?'onCollapse':'onExpand']();
            }
        },
        
        /**
         * 重写region中的open方法,在region中open表示打开该应用程序,
         * borderregion中的应用程序在初始化的时候就已经开始运行,
         * 此处的打开表示将东西南北四个方向上的面板展开.
         * @method open
         */
        open : function(){
            Rs.app.BorderShell.SplitRegion.superclass.open.apply(this, arguments);
            this.expand();
        },
        
        /**
         * 重写region的close方法, 在region中close方法表示将该应用程序关闭, 
         * 此处border region不许将应用程序关闭,只有将应用程序合并或隐藏,
         * 此处的关闭表示将东西南北四个方向上的面板合并.
         * @mehthod close
         */
        close : function(){
            Rs.app.BorderShell.SplitRegion.superclass.close.apply(this, arguments);
            this.collapse();
        },

        /**
         * 判断该区域是否显示
         *@return {Boolean}
         */
        isVisible : function(){
            return this.collapsed !== true;
        },
        
        //设置程序面板的位置和大小
        applyPanelEl : function(box){
            this.removeBlankClass();
            var ps = this.position,
                x = box.x, 
                y = box.y,
                w = box.width,
                h = box.height;
            
            //设置区域分割线的位置和大小
            if(ps != 'center'){
                var splitEl = this.getSplitEl();
                
                splitEl.setXY([x + (ps=='west'?w-5:0), y + (ps =='north'?h-5:0)]);
                splitEl.setWidth((ps=='north' || ps=='south')?w:5);
                splitEl.setHeight((ps=='west' || ps=='east')?h:5);
            }
            
            //设置工具栏的位置和大小
            if(ps != 'center'){
                if(this.header){
                    var headerEl = this.getHeaderEl();
                    headerEl.setXY([x + (ps=='east'?5:0), y]);
                    headerEl.setWidth(w - ((ps == 'east' || ps == 'west')?5:0));
                    headerEl.setHeight(this.headerHeight);
                } else if(this.collapsible){
                    var toggle = this.getToggle('middle');
                }
            }
            //设置应用程序的位置和大小
            var targetEl = this.targetEl;
            if(ps != 'center'){
                targetEl.setXY([x + (ps=='east'?5:0), y+(this.header?this.headerHeight:5)]);
                
                w = w - ((ps=='west' || ps=='east')?5:0);
                h = h-(this.header?this.headerHeight:5)-((ps=='north' || ps=='south')?5:0);
                targetEl.setWidth(w);
                targetEl.setHeight(h);
                
                this.fireEvent('resize', targetEl, w, h);
            }else {
                targetEl.setXY([x, y]);
                targetEl.setWidth(w);
                targetEl.setHeight(h);
                
                this.fireEvent('resize', targetEl, w, h);
            }
        }, 
        
        //获取Header
        getHeaderEl : function(){
            var headerEl = this.headerEl,
                panelEl = this.panelEl;
            if(!headerEl){
                if(this.headerCfg){
                    headerEl = this.headerEl = panelEl.insertFirst(this.headerCfg);
                }else {
                    headerEl = this.headerEl = panelEl.insertFirst({
                        tag : 'div',
                        cls : 'rs-app-header x-app-header'
                    });
                }
                //是否可隐藏
                if(this.collapsible == true){
                    var ps = this.position,
                        collapsed = this.collapsed, 
                        toggle = this.toggle;
                    if(!toggle){
                        this.getToggle('top');
                    }
                }
                //添加程序名称
                var icon = this.app.getIcon16();
                headerEl.createChild({
                    html : '<span class="' + icon + ' rs-app-header-text x-app-header-text">' + (this.name||'') + '</span>' 
                });
            }
            return headerEl;
        },
        
        //获取展合面板
        getCollapsedEl : function(){
            var collapsedEl = this.collapsedEl;
            if(!collapsedEl){
                var panelEl = this.panelEl,
                ps = this.position,
                collapsed = this.collapsed;
                collapsedEl = this.collapsedEl = Rs.DomHelper.insertAfter(panelEl, {
                    cls: "rs-app-collapser x-app-collapser rs-app-collapser-" + ps
                }, true);
                collapsedEl.on('click', this.onClickCollapsedEl, this);
                if(this.header){
                    var ccls = 'rs-app-tool x-app-tool rs-app-tool-' + (collapsed ? 'expand' : 'collapse') + '-' + ps;
                    var bcls = 'rs-app-tool-' + (collapsed ? 'expand' : 'collapse') + '-' + ps + '-over';
                } else{                    
                    var ccls = 'rs-app-tool-middle x-app-tool-middle-' + (collapsed ? 'expand' : 'collapse') + '-' + ps 
                        + ' rs-app-tool-middle-'+ ps;
                    var bcls = 'rs-app-tool-middle-over';
                }
                var collapsedElToggle = this.collapsedElToggle = collapsedEl.createChild({
                    tag : 'div',
                    cls : ccls
                });
                collapsedEl.on('mouseover', function(){
                    collapsedEl.addClass('x-app-collapser-over');
                    collapsedElToggle.addClass(bcls);
                    collapsedEl.on('mouseleave', function(){
                        collapsedEl.removeClass('x-app-collapser-over');
                        collapsedElToggle.removeClass(bcls);
                    }, this, {single : true});
                }, this);
                collapsedElToggle.on('click', this.toggleCollapse, this);
            }
            return this.collapsedEl;
        },
        
        // private
        onClickCollapsedEl : function(e, el){
            this.toggleCollapse(e, el);
        },
        
        //获取分割线
        getSplitEl : function(){
            if(!this.splitEl){
                var ps = this.position;
                this.splitEl = this.panelEl.createChild({
                    cls: "rs-app-split x-app-split", 
                    html: "&#160;"
                });
                this.splitEl.setStyle('cursor', (ps == 'north' || ps == 'south')?'row-resize':'col-resize');
                this.splitElDD = new SplitElDD(this, this.splitEl, this.panelEl,
                    (ps == 'east' || ps == 'west') ? SplitElDD.HORIZONTAL : SplitElDD.VERTICAL);
            }
            return this.splitEl;
        },
        
        //获取大小
        getSize : function(){
            var w = this.width, 
                h = this.height,
                ps = this.position,
                cew = this.collapsedElWidth,
                size = this.shell.getSize();
            if(this.collapsed !== true){
                w = (ps == 'west' || ps == 'east') ? w ? w : this.minWidth : size.width;
                h = (ps == 'north' || ps == 'south') ? h ? h : this.minHeight : size.height;
            }else {
                w = (ps == 'west' || ps == 'east') ? cew : size.width;
                h = (ps == 'north' || ps == 'south') ? cew : size.height;
            }
            return {
                width : w,
                height : h
            };
        },
        
        //获取周边留白
        getMargins : function(){
            return this.margins;
        },
        
        //private 删除空白位置样式
        removeBlankClass : function(){
            var cls = 'rs-app-blank-region',
                panelEl = this.panelEl;
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
        },
        
        getToggle : function(togglePosition){
        
            var ps = this.position,
            collapsed = this.collapsed, 
            toggle = this.toggle;
            if(!toggle){
                if(togglePosition == "top"){
                    toggle = this.toggle = this.headerEl.createChild({
                        tag : 'div',
                        cls : 'rs-app-tool x-app-tool rs-app-tool-' + (collapsed ? 'expand' : 'collapse') + '-' + ps
                    });
                    toggle.on('click', this.toggleCollapse, this);
                    toggle.on('mouseover', function(){
                        var cls = 'rs-app-tool-' + (collapsed ? 'expand' : 'collapse') + '-' + ps + '-over';
                        toggle.addClass(cls);
                        toggle.on('mouseleave', function(){
                            toggle.removeClass(cls);
                        }, this, {single : true});
                    }, this);
                } else if(togglePosition == "middle"){
                    toggle = this.toggle = this.splitEl.createChild({
                       tag : 'div',
                       cls : 'rs-app-tool-middle x-app-tool-middle-' + (collapsed ? 'expand' : 'collapse') + '-' + ps 
                           + ' rs-app-tool-middle-'+ ps
                    });
                    toggle.on('click', this.toggleCollapse, this);
                    toggle.on('mouseover', function(){
                        var cls = 'rs-app-tool-middle-over';
                        toggle.addClass(cls);                        
                        this.splitEl.un('mousedown', this.splitElDD.notifyOut, this.splitElDD);
                        toggle.on('mouseleave', function(){
                            toggle.removeClass(cls);
                            this.splitEl.on('mousedown', this.splitElDD.notifyOut, this.splitElDD);
                        }, this, {single : true});
                    }, this);
                }
            }
        },
        
        
        /**
         * 展开或合并面板
         * @param {Event} e
         * @return {Rs.app.BorderShell.SplitRegion} 当前操作区域
         */
        toggleCollapse : function(e){
            this[this.collapsed ? 'expand' : 'collapse']();
            if(e){
                e.stopEvent();
            }
            return this;
        }, 
        
        //合并之前执行该方法,如果该方法返回false则终止执行
        onBeforeCollapse : Rs.emptyFn,
        
        /**
         * 合并面板
         * @return {Rs.app.BorderShell.SplitRegion} 当前操作区域
         */
        collapse : function(){
            if(this.collapsed 
                || this.fireEvent('beforecollapse', this) === false
                || this.onBeforeCollapse(this) === false){
                return;
            }
            this.onCollapse();
            return this;
        },

        // private
        onCollapse : function(){
            this.collapsed = true;
            //显示展合面板
            this.showCollapsedEl();
            //隐藏程序位置
            this.hidePanelEl();
            this.afterCollapse();
        },
        
        // private
        afterCollapse : function(){
            var shell = this.shell;
            if(shell){
                shell.reBuild();
            }
            this.fireEvent('collapse', this, shell);
        },
        
        //显示合并面板
        showCollapsedEl : function(){
            var ce = this.getCollapsedEl(),
                cls = this.collapsedCls,
                ps = this.position;
            if(ce && ce.hasClass(cls)){ //去除隐藏样式
                ce.removeClass(cls);
            }
            this.collapsedElToggle.removeClass('rs-app-tool-collapse' + '-' + ps);
            if(this.header){
                this.collapsedElToggle.addClass('rs-app-tool-expand' + '-' + ps);
            }
        },
        
        //隐藏合并面板
        hideCollapsedEl : function(){
            var ce = this.getCollapsedEl(),
                cls = this.collapsedCls,
                ps = this.position;
            if(ce && !ce.hasClass(cls)){
                ce.addClass(cls);
            }
            this.collapsedElToggle.removeClass('rs-app-tool-expand' + '-' + ps);
            if(this.header){
                this.collapsedElToggle.addClass('rs-app-tool-collapse' + '-' + ps);
            }
        },
        
        //设置展开合并面板的位置和大小
        applyCollapsedEl : function(box){
            var ce = this.getCollapsedEl(),
                x = box.x,
                y = box.y,
                w = box.width,
                h = box.height,
                ps = this.position;
            ce.setXY([x, y]);
            ce.setWidth(w);
            ce.setHeight(h);
        },
        
        //隐藏程序面板
        hidePanelEl : function(){
            var cls = this.collapsedCls,
                panelEl = this.panelEl;
            if(!panelEl.hasClass(cls)){
                panelEl.addClass(cls);
            }
        },
        
        //显示程序面板
        showPanelEl : function(){
            var cls = this.collapsedCls,
                panelEl = this.panelEl;
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
        },
        
        //展开之前执行该方法,如果该方法返回false则终止展开
        onBeforeExpand : Rs.emptyFn,
        
        /**
         * 展开面板
         * @return {Rs.app.BorderShell.SplitRegion} 当前操作区域
         */
        expand : function(){
            if(!this.collapsed
                || this.fireEvent('beforeexpand', this) === false
                || this.onBeforeExpand(this) === false){
                return;
            }
            this.onExpand();
            return this;
        },

        // private
        onExpand : function(){
            this.collapsed = false;
            //显示程序面板
            this.showPanelEl();
            //隐藏合并面板
            this.hideCollapsedEl();
            this.afterExpand();
        },

        // private
        afterExpand : function(){
            var shell = this.shell;
            if(shell) {
                shell.reBuild();
            }
            this.fireEvent('expand', this, shell);
        }

    });
    
    //处理分割线的拖拽操作
    var SplitElDD = function(region, splitEl, panelEl, orientation){
        this.region = region;
        this.splitEl = splitEl;
        this.panelEl = panelEl;
        this.orientation = orientation;
        this.init();
    };
    
    //垂直移动
    SplitElDD.VERTICAL = 1;
    
    //水平移动
    SplitElDD.HORIZONTAL = 2;
    
    SplitElDD.prototype = {
        
        //初始化方法,监听分割线上的鼠标进入和点击事件
        init : function(){
            this.splitEl.on('mouseenter', this.notifyEnter, this);
            this.splitEl.on('mousedown', this.notifyOut, this);
        },
        
        //当鼠标进入分割线时执行该方法
        notifyEnter : function(){
            
        },
        
        //当点击分割线时显示分割线拖动阴影
        notifyOut : function(){
            this.showProxy();
        },
        
        //显示分割线拖动阴影
        showProxy : function(){
            var DOM = Rs.lib.Dom, 
                x = 0, y = 0, 
                w = DOM.getViewWidth(true),
                h = DOM.getViewHeight(true),
                overlay,
                proxy,
                splitEl = this.splitEl;

            overlay = this.overlay =  Rs.DomHelper.append(document.body,  {
                tag : 'div',
                cls: "rs-app-split-overlay"
            }, true);
            overlay.setX(x);
            overlay.setY(y);
            overlay.setWidth(w);
            overlay.setHeight(h);
            overlay.unselectable();
            if(Rs.isIE){
                overlay.setStyle({
                    'opacity' : '30',
                    'filter' : 'alpha(opacity=30)'
                });
            }else {
                overlay.setStyle({
                    'opacity' : '.30',
                    '-moz-opacity' : '.30',
                    'filter' : 'alpha(opacity=.30)'
                });
            }
            
            overlay.on('mousemove', this.notifyOver, this);
            overlay.on('mouseup', this.notifyDrop, this);
            
            x = splitEl.getX(),
            y = splitEl.getY(),
            w = splitEl.getWidth(),
            h = splitEl.getHeight();
            
            proxy = this.proxy =  Rs.DomHelper.append(document.body,  {
                tag : 'div',
                cls : 'rs-app-split-proxy'
            }, true);
            proxy.on('mouseup', this.notifyDrop, this);
            
            proxy.setX(x);
            proxy.setY(y);
            proxy.setWidth(w);
            proxy.setHeight(h);
            proxy.unselectable();
            
            //记录分割线初始位置
            this.sourceposition = {
                x : x,
                y : y
            };
        },
        
        //隐藏分割线拖动阴影
        hideProxy : function(){
            var overlay = this.overlay, 
                proxy = this.proxy;
            if(overlay){
                overlay.removeAllListeners();
                overlay.remove();
                delete overlay;
            }
            if(proxy){
                proxy.removeAllListeners();
                proxy.remove();
                delete proxy;
            }
            
            delete this.sourceposition;
        },
        
        //当鼠标移动时执行该方法,修改分割线拖动阴影位置
        notifyOver : function(e, t, o){
            var orientation =  this.orientation,
                proxy = this.proxy, 
                xy = e.getXY(), 
                x = xy[0],
                y = xy[1],
                region = this.region,
                ps = region.position,
                size = region.getSize(),
                source = this.sourceposition,
                min, max, v;
            
            if(orientation == SplitElDD.VERTICAL){
                min = region.minHeight;
                max = region.maxHeight;
                v = size.height + (ps == 'north'?1:-1)*(y - source.y);
                if(v >= min && v <= max){
                    proxy.setY(y);
                }
            }else if(orientation == SplitElDD.HORIZONTAL){
                min = region.minWidth;
                max = region.maxWidth;
                v = size.width + (ps == 'west'?1:-1)*(x - source.x);
                if(v >= min && v <= max){
                    proxy.setX(x);
                }
            }
        },
        
        //当鼠标按键弹起时执行该方法,调整应用程序大小
        notifyDrop : function(e, t, o){
            var proxy = this.proxy,
                x = proxy.getX(),
                y = proxy.getY(),
                w, h,
                region = this.region,
                shell = region.shell,
                ps = region.position,
                size = region.getSize(),
                source = this.sourceposition,
                orientation =  this.orientation;
            
            if(orientation == SplitElDD.VERTICAL){
                h = size.height + (ps == 'north'?1:-1)*(y - source.y);
                region.setHeight(h);
                shell.reBuild();
            }else if(orientation == SplitElDD.HORIZONTAL){
                w = size.width + (ps == 'west'?1:-1)*(x - source.x);
                region.setWidth(w);
                shell.reBuild();
            }
            
            this.hideProxy();
        }
        
    };
    
    
})();
(function(){
    
    /**
     * @class Rs.app.TabShell
     * @extends Rs.app.Shell
     * 标签页式框架
     * @constructor
     * @param {Object} config
     */
    Rs.app.TabShell = Rs.extend(Rs.app.Shell, {
        
        //整体框架
        frameTpl : ['<div onselectstart="return false;" class="rs-tab-shell-tabheader x-tab-shell-tabheader"></div>',
                    '<div class="rs-tab-shell-tabbody-wrap"></div>'],
        
        //标签栏配置
        tabBarCfg : {},
        
        //标签栏的位置,可选的位置有top
        tabBarPosition : 'top',
        
        /**
         * 标签宽度，缺省值为135
         * @cfg {Number} tabWidth default 135
         */
        tabWidth : 135,
        

        enableTabScroll : true,
        
        /**
         * 重写doBuild方法,当程序引擎启动的时候调用该方法,构建应用程序
         * @method doBuild
         */
        doBuild : function(){
            Rs.app.TabShell.superclass.doBuild.apply(this, arguments);
            
            var frame = this.frame,
                tabHeaderEl = frame.child('.rs-tab-shell-tabheader'),
                tabBodyEl = frame.child('.rs-tab-shell-tabbody-wrap');
            
            //创建标签栏
            if(tabHeaderEl){
                var tabheader = this.tabheader;
                if(!tabheader){
                    tabheader = this.tabheader = new TabShellTabbar(this, 
                            this.tabBarPosition, Rs.apply(this.tabBarCfg,{
                                tabWidth : this.tabWidth, 
                                enableTabScroll : this.enableTabScroll}));
                    tabheader.renderTo(tabHeaderEl);
                }
            }
            //创建程序区域
            if(tabBodyEl){
                var tabbody = this.tabbody;
                if(!tabbody){
                    tabbody = this.tabbody = new TabShellTabbody(this, this.tabBarPosition);
                    tabbody.renderTo(tabBodyEl);
                }
            }
        }, 
        
        /**
         * 重写方法reBuildRegions,重构shell
         * @param {Rs.app.Region} region
         * @param {Rs.app.Application} app 
         */
        doReBuild : function(region, app){
            Rs.app.TabShell.superclass.doReBuild.apply(this, arguments);
            //调整标签栏的大小和位置
            var tabheader = this.tabheader;
            var tabbody = this.tabbody;
            if(tabheader){
                tabheader.doLayout();
            }
            //调整程序区域的大小和样式
            if(tabbody){
                tabbody.doLayout();
            }
        },
        /**
         * 获取应用程序位置
         * @method getRegion
         * @param {String} id (optional) App存放位置id
         * @return {Object} 
         */
        getRegion : function(id){
            if(id == "tab"){
                region = new Rs.app.TabRegion(this, {});
                return region;
            }else {
                region = new Rs.app.WindowRegion(this, {});
                return this.windowRegions.add(region);
            }
        }
        
    });
    
    //注册window类型的shell
    Rs.app.SHELL['tab'] = Rs.app.TabShell;
    
    /**
     * 标签栏, 其中包括开始按钮,当用户点击打开应用程序的时候
     * 在标签栏显示所有已经打开的程序
     */
    var TabShellTabbar = function(shell, position, config){
        this.shell = shell;
        this.position = position || 'top';
        Rs.apply(this, config);
        TabShellTabbar.superclass.constructor.call(this);
        this.addEvents(
                
                /**
                 * @event beforetabchange
                 * 在活动标签改变之前触发该事件
                 * @param {TabShellTabbar} this
                 * @param tab 新的活动标签
                 * @param activetab 当前活动标签 
                 */
                'beforetabchange',
                
                /**
                 * @event tabchange
                 * 在活动标签改变之后触发该事件
                 * @param {TabShellTabbar} this
                 * @param tab 改变后的活动标签 
                 */
                'tabchange',
                
                /**
                 * @event beforetabclose
                 * 在标签关闭之前触发该事件
                 * @param tab 将要被关闭的标签 
                 */
                'beforetabclose',
                
                /**
                 * @event tabclose
                 * 在标签关闭之后触发该事件
                 * @param tab 被关闭的标签 
                 */
                'tabclose');
    };

    Rs.extend(TabShellTabbar, Rs.util.Observable, {


        /**
         * @cfg {Number} width default 50
         */
        width : 60,
        
        /**
         * @cfg {Number} height defualt 30
         */
        height : 30,
        
        //private
        rendered : false,
        
        tabs : [],
        
        scrollDuration : 0.35,
        
        animScroll : true,
        
        closable : true,
        
        tabWidth : 120,
        
        scrollIncrement: 100,
        
        //访问堆栈
        accessStack : [],
        
        /**
         * 渲染tab栏
         * @method renderTo
         * @param {Element} el
         */
        renderTo : function(el){
            if(this.rendered === false && this.fireEvent('beforerender', this) !== false){
                this.header = el;
                this.rendered = true;
                //设置样式
                this.header.addClass('rs-tab-shell-tabheader-' + this.position);
                
                //滚动可视区域
                this.stripWrap = this.header.createChild({
                    tag : 'div',
                    cls : 'rs-tab-strip-wrap-'+this.position,
                    cn : {
                        tag : 'ul',
                        cls : 'rs-tab-strip-' + this.position + ' x-tab-strip-' + this.position
                    }
                });
                this.header.createChild({cls:'rs-tab-strip-spacer'});
                
                //滚动区域
                this.strip = new Rs.Element(this.stripWrap.dom.firstChild);
                
                //当前滚动区域被标签覆盖部分的右边界
                this.edge = this.strip.createChild({
                    tag : 'li',
                    cls : 'rs-tab-edge-' + this.position,
                    cn: [{tag: 'span', cls: 'rs-tab-strip-text', cn: '&#160;'}]
                });

                this.strip.createChild({cls:'rs-clear'});
                
                this.doLayout();
                
                //初始化事件设置
                this.afterRender();
            }
        },

        /**
         * 获取标签栏大小
         * <pre><code> 
          return {
             width : 1024,
             height : 30
          }
         </code></pre>
         * @method getSize
         * @return {Object} size
         */
        getSize : function(){
            var shell = this.shell,
                size = shell.getSize(),    
                pos = this.position,
                w, h;
            if(pos == 'top'){
                w = size.width;
                h = this.height;
            }else if(pos == 'left'){
                w = this.width;
                h = size.height;
            }
            return {
                width : w,
                height : h
            };
        },
        
        //设置tabbar宽度
        doLayout : function(){
            var size = this.shell.getSize();
            this.header.setWidth(size.width);
            this.autoScrollTabs(); 
        },
        
        //调整tabbar滚动按钮
        autoScrollTabs : function(){
            this.pos = this.position=='top' ? this.header : null;
            var count = this.tabs.length,
                ow = this.pos.dom.offsetWidth,
                tw = this.pos.dom.clientWidth,
                wrap = this.stripWrap,
                wd = wrap.dom,
                cw = wd.offsetWidth,
                pos = this.getScrollPos(),
                l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

            if(!this.enableTabScroll || cw < 20){ 
                return;
            }
            if(count == 0 || l <= tw){
                wd.scrollLeft = 0;
                wrap.setWidth(tw);
                if(this.scrolling){
                    this.scrolling = false;
                    this.pos.removeClass('rs-tab-scrolling');
                    this.scrollLeft.hide();
                    this.scrollRight.hide();
                    //if(Ext.isAir || Ext.isWebKit){
                        wd.style.marginLeft = '';
                        wd.style.marginRight = '';
                    //}
                }
            } else{
                if(!this.scrolling){
                    this.pos.addClass('rs-tab-scrolling');
                    //if(Ext.isAir || Ext.isWebKit){
                        wd.style.marginLeft = '18px';
                        wd.style.marginRight = '18px';
                    //}
                }
                var wMarginLeft = parseInt(wd.style.marginLeft.substring(0,wd.style.marginLeft.length-2),10);
                var wMarginRight = parseInt(wd.style.marginRight.substring(0,wd.style.marginRight.length-2),10);
                tw-=(wMarginLeft+wMarginRight);
                wrap.setWidth(tw > 20 ? tw : 20);
                if(!this.scrolling){
                    if(!this.scrollLeft){
                        this.createScrollers();
                    }else{
                        this.scrollLeft.show();
                        this.scrollRight.show();
                    }
                }
                this.scrolling = true;
                if(pos > (l-tw)){ 
                    wd.scrollLeft = l-tw;
                }else{ 
                    this.scrollToTab(this.activeTab, false);
                }
                this.updateScrollButtons();
            }
        },
        
        //获取对象左边界和可见内容的最左端的距离
        getScrollPos : function(){
            return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
        },
        
        //获取滚动区域的可视宽度
        getScrollArea : function(){
            return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
        },
        
        //
        getScrollWidth : function(){
            return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
        },
        
        getScrollIncrement : function(){
            return this.scrollIncrement || (this.resizeTabs ? this.lastTabWidth+2 : 100);
        },
        
        createScrollers : function(){
            this.header.addClass('rs-tab-scrolling');;
            var h = this.stripWrap.dom.offsetHeight;

            // left
            var sl = this.header.insertFirst({
                cls:'rs-tab-scroller-left x-tab-scroller-left'
            });
            sl.setHeight(h);
            sl.on('mouseover',function(){
                sl.addClass('rs-tab-scroller-left-over');
            },this);
            sl.on('mouseleave',function(){
                sl.removeClass('rs-tab-scroller-left-over');
            },this);
            sl.on('mousedown', this.onScrollLeft, this);
            this.scrollLeft = sl;

            // right
            var sr = this.header.insertFirst({
                cls:'rs-tab-scroller-right x-tab-scroller-right'
            });
            sr.setHeight(h);
            sr.on('mouseover',function(){
                sr.addClass('rs-tab-scroller-left-over');
            },this);
            sr.on('mouseleave',function(){
                sr.removeClass('rs-tab-scroller-left-over');
            },this);
            sr.on('mousedown', this.onScrollRight, this);
            this.scrollRight = sr;
        },
        
        onScrollRight : function(){
            var sw = this.getScrollWidth()-this.getScrollArea(),
                pos = this.getScrollPos(),
                s = Math.min(sw, pos + this.getScrollIncrement());
            if(s != pos){
                this.scrollTo(s, this.animScroll);
            }
        },

        
        onScrollLeft : function(){
            var pos = this.getScrollPos(),
                s = Math.max(0, pos - this.getScrollIncrement());
            if(s != pos){
                this.scrollTo(s, this.animScroll);
            }
        },
        
        
        scrollToTab : function(tab, animate){
            if(!tab){
                return;
            }
            var el = tab.tabEl,
                pos = this.getScrollPos(),
                area = this.getScrollArea(),
                left = el.getOffsetsTo(this.stripWrap)[0] + pos,
                right = left + el.dom.offsetWidth;
            if(left < pos){
                this.scrollTo(left, animate);
            }else if(right > (pos + area)){
                this.scrollTo(right - area, animate);
            }
        },
        
        scrollTo : function(pos, animate){
            this.stripWrap.scrollTo('left', pos);
            //if(!animate){
                this.updateScrollButtons();
            //}
        },
        
        getScrollAnim : function(){
            return {duration:this.scrollDuration, callback: this.updateScrollButtons, scope: this};
        },
        
        updateScrollButtons : function(){
            var pos = this.getScrollPos();
            this.scrollLeft[pos === 0 ? 'addClass' : 'removeClass']('rs-tab-scroller-left-disabled');
            this.scrollRight[pos >= (this.getScrollWidth()-this.getScrollArea()) ? 'addClass' : 'removeClass']('rs-tab-scroller-right-disabled');
        },
        
        //添加程序按钮
        addTab : function(app, tabconfig){
            var index = this.tabs.length,
                before = this.strip.dom.childNodes[index],
                p = this.getTemplateArgs(app);
                cls = 'rs-tab-strip-over',
                tab = new Tab(this.strip, before, p, tabconfig);
                tab.hover(function(){
                        tab.addClass(cls);
                    }, function(){
                        tab.removeClass(cls);
                });
                tab.setWidth(this.tabWidth);
                tab.on('close', this.removeTab, this);
                tab.on('activated', this.setActiveTab, this);
                tab.on('mousedown', this.onTabMouseDown, this);
                this.tabs.push(tab);
            this.autoScrollTabs();
            return tab;
        },
        
        onTabMouseDown : function(tab, e){
            if(this.tabs.length==1){
                return;
            }
            this.startTab = tab;
            this.startTabX = this.startTab.getX();
            this.mousedownX = e.getXY()[0];
            this.activeX = this.startTabX;
            this.startOffset = e.getXY()[0] - this.startTabX;
            this.lfTabEl = this.startTab.next();
            this.header.on('mouseup', this.onHeaderMouseUp, this);
            this.header.on('mousemove', this.onHeaderMouseMove, this);
            this.header.on('mouseleave', this.onHeaderMouseLeave, this);
        },
        
        addEventHandler : function(oTarget, sEventType, fnHandler) {
            if (oTarget.addEventListener) {
                oTarget.addEventListener(sEventType, fnHandler, false);
            } else if (oTarget.attachEvent) {
                oTarget.attachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = fnHandler;
            }
        },
         
        removeEventHandler : function (oTarget, sEventType, fnHandler) {
            if (oTarget.removeEventListener) {
                oTarget.removeEventListener(sEventType, fnHandler, false);
            } else if (oTarget.detachEvent) {
                oTarget.detachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = null;
            }
        },

        bindAsEventListener : function(object, fun) {
            return function(event) {
                return fun.call(object, (event || window.event));
            };
        },
        
        onHeaderMouseLeave : function(e){
            Rs.fly(document.body).addClass('rs-tab-leave');
            this.header.on('mouseover', this.onHeaderMouseOver, this);
            this.shell.tabbody.on('mouseup', this.onTabbodyMouseUp, this);
            this.addEventHandler(document, "mouseup", this.bindAsEventListener(this, this.handleMouseUp));
        },
        
        handleMouseUp : function(e){
            if(e.x<0 || e.y<0 || e.x > window.innerWidth || e.y > window.innerHeight){
                this.cancelMove();
                this.shell.tabbody.un('mouseup', this.onTabbodyMouseUp, this);
            }
            this.removeEventHandler(document, "mouseup", this.handleMouseUp);
        },
        
        cancelMove : function(){
            if(this.startTab){
                this.startTab.insertBefore(this.lfTabEl);
                this.endMove();
            }
        },
        
        endMove : function(){
            if(this.startTab){
                Rs.fly(document.body).removeClass('rs-tab-leave');
                this.startTab.show();
                this.startTab = null;
                if(this.cloneTab){
                    this.cloneTab.remove();
                    delete(this.cloneTab);
                }
                this.removeTabListeners();
            }
        },
        
        onHeaderMouseOver : function(e){
            Rs.fly(document.body).removeClass('rs-tab-leave');
            this.header.un('mouseover', this.onHeaderMouseOver, this);
            this.shell.tabbody.un('mouseup', this.onTabbodyMouseUp, this);
        },
        
        onTabbodyMouseUp : function(tabbody){
            this.cancelMove();
            this.shell.tabbody.un('mouseup', this.onTabbodyMouseUp, this);
        },
        
        removeTabListeners : function(){
            this.header.un('mouseover', this.onHeaderMouseOver, this);
            this.header.un('mousemove', this.onHeaderMouseMove, this);
            this.header.un('mouseup', this.onHeaderMouseUp, this);
            this.header.un('mouseleave', this.onHeaderMouseLeave, this);
        },
        
        onHeaderMouseMove : function(e){
            if(this.startTab ){
                if(!this.cloneTab){
                    this.cloneTab = this.startTab.tabEl.dom.cloneNode(true);
                    this.cloneTab.id = "clone-tab";
                    if(this.cloneTab.style.setProperty){
                        this.cloneTab.style.setProperty("position","absolute","");
                    }else{
                        this.cloneTab.style.setAttribute("position","absolute");
                    }
                    this.cloneTab = this.strip.appendChild(this.cloneTab);
                    this.cloneTab.insertBefore(this.strip.dom.childNodes[0]);
                    this.cloneTab.setStyle("position : absolute;");
                }
                var ex = e.getXY()[0];
                this.cloneTab.setX(ex-this.startOffset);
                if(this.startTab.isVisible()){
                    this.startTab.hide();
                }
                if(this.scrollLeft && this.scrollLeft.isVisible()){
                    if(e.getXY()[0]>=this.scrollRight.getX()){
                        this.onScrollRight();
                    }
                    if(e.getXY()[0]<=(this.scrollLeft.getX()+this.scrollLeft.getWidth())){
                        this.onScrollLeft();
                    }
                }
                if((ex - this.mousedownX) > 0 && (ex-this.startOffset-this.activeX) >= this.tabWidth/2){
                    var nextTab = this.startTab.next();
                    if(nextTab.dom != this.strip.dom.childNodes[this.strip.dom.childNodes.length-2]){
                        this.startTab.insertAfter(nextTab);
                        this.activeX = this.startTab.getX();
                        this.mousedownX = this.activeX + this.startOffset;
                    }
                } else if((ex - this.mousedownX) < 0 && (this.activeX - (ex-this.startOffset)) >= this.tabWidth/2){
                    this.startTab.insertBefore(this.startTab.prev());
                    this.activeX = this.startTab.getX();
                    this.mousedownX = this.activeX + this.startOffset;
                }
            }
        },
        
        onHeaderMouseUp : function(e){
            this.removeTabListeners();
            if(this.startTab){
                this.endMove();
            }
            return;
        },
        
        moveTab : function(tab1, tab2, offset){
            if(offset>0){
                tab1.insertBefore(tab2);
            } else{
                tab1.insertAfter(tab2);
            }
            return;
        },
        
        removeTab : function(tab){
            if(tab){
                for(var i = 0; i < this.tabs.length; i++){
                    if(this.tabs[i].id == tab.id){
                        this.tabs.splice(i,1);
                        break;
                    }
                }
                tab.un('close', this.removeTab, this);
                tab.un('activated', this.setActiveTab, this);
                tab.destroy();
            }
            this.removeFromAccessStack(tab);
        },
        
        getTemplateArgs : function(app) {
            return {
                id: 'rs-app-tab-'+ this.tabs.length,
                text: app.getName() || '&#160;',
                iconCls: app.getIcon16() || ''
            };
        },
        
        setActiveTab : function(tab){
            if(tab.active !== true && this.tabs.length > 1){
                return;
            }
            if(this.fireEvent('beforetabchange', this, tab, this.activeTab) === false){
                return;
            }
            if(!this.rendered){
                this.activeTab = tab;
                return;
            }
            if(this.activeTab != tab){
                if(this.activeTab){
                    var oldTab = this.activeTab;
                    if(oldTab){
                        oldTab.unActivated();
                    }
                }
                this.activeTab = tab;
                if(tab){
                    tab.doActivated();
                    this.addToAccessStack(tab);
                    this.autoScrollTabs();
                    if(this.scrolling){
                        this.scrollToTab(tab, this.animScroll);
                    }
                }
                this.fireEvent('tabchange', this, tab);
            }
        },
        
        addToAccessStack : function(tab){
            for(var i = 0; i < this.accessStack.length;i++){
                if(this.accessStack[i].id == tab.id){
                    this.accessStack.splice(i,1);
                    break;
                }
            }
            this.accessStack.push(tab);
        },
        
        removeFromAccessStack : function(tab){
            for(var i = 0; i < this.accessStack.length;i++){
                if(this.accessStack[i].id == tab.id){
                    this.accessStack.splice(i,1);
                    if(i == this.accessStack.length){
                        this.activeTab = null;
                        if(i!=0){
                            this.setActiveTab(this.accessStack[this.accessStack.length-1]);
                        }
                    }
                }
            }
        },
        
        //渲染完成之后执行该方法
        afterRender : Rs.emptyFn
        
    });
    
    var Tab = function(strip, nextEl, args, config){
        this.id = args.id;
        this.strip = strip;
        Rs.apply(this, config);
        Tab.superclass.constructor.call(this);
        
        if(!this.itemTpl){
            var tt = new Rs.Template([
                 '<li class="rs-tab-with-icon" id="{id}"><a class="rs-tab-strip-close x-tab-strip-close"></a>',
                 '<a class="rs-tab-right x-tab-right"><em class="rs-tab-left x-tab-left">',
                 '<span class="rs-tab-strip-inner x-tab-strip-inner"><span class="rs-tab-strip-text x-tab-strip-text {iconCls}">{text}</span></span>',
                 '</em></a></li>']
            );
            tt.compile();
            this.itemTpl = tt;
        }
        
        this.addEvents(
                'beforeclose',
                'close',
                'activated',
                'unactivated',
                'mousedown',
                'mouseup'
        );
        
        this.tabEl = nextEl ?
                this.itemTpl.insertBefore(nextEl, args, true) :
                    this.itemTpl.append(this.strip, args, true);
                
        this.tabEl.select('a').on('click', function(e){
            this.onStripClick(e);
        }, this);
        this.tabEl.select('a').on('mousedown', function(e){
            this.onStripMouseDown(e);
        }, this);

        this.tabEl.select('a').on('mouseup', function(e){
            this.onStripMouseUp(e);
        }, this);
    };
    Rs.extend(Tab, Rs.util.Observable, {
        
        closable : true,
        
        active : false,
        
        onStripClick : function(e){
            if(e.button !== 0){
                return;
            }
            e.preventDefault();
            if(e.getTarget('.rs-tab-strip-close', this.strip)){
                if (this.fireEvent('beforeclose', this) !== false) {
                    this.fireEvent('close', this);
                }
                return;
            }
            if(this.active == false){
                this.doActivated();
            }
            return;
        },
        
        onStripMouseDown : function(e){
            if(e.button !== 0){
                return;
            }
            e.preventDefault();
            if(e.getTarget('.rs-tab-strip-close', this.strip)){
                return;
            }
            if(this.active == false){
                this.doActivated();
            }
            this.fireEvent('mousedown', this, e);
            return;
        },
        
        onStripMouseUp : function(e){
            this.mousedown = false;
            e.preventDefault();
            this.fireEvent('mouseup', this);
            return;
        },
        
        doActivated : function(){
            this.active = true;
            if(this.closable){
                this.addClass('rs-tab-strip-closable');
            }
            this.addClass('rs-tab-strip-active');
            this.fireEvent('activated',this);
        },
        
        unActivated : function(){
            this.active = false;
            this.removeClass(['rs-tab-strip-closable','rs-tab-strip-active']);
            this.fireEvent('unactivated', this);
        },
        
        isActivated : function(){
            return this.active;
        },
        
        hover : function(over, leave){
            if(this.tabEl){
                this.tabEl.hover(over, leave);
            }
        },
        
        addClass : function(cls){
            if(this.tabEl){
                this.tabEl.addClass(cls);
            }
        },
        
        removeClass : function(cls){
            if(this.tabEl){
                this.tabEl.removeClass(cls);
            }
        },
        
        setWidth : function(w){
            this.tabEl.setWidth(w);
        },
        
        getTabEl : function(){
            return this.tabEl;
        },
        
        destroy : function(){
            this.active = false;
            this.tabEl.removeAllListeners();
            this.tabEl.remove();
            delete(this.tabEl);
        },
        
        getX : function(){
            return this.tabEl.getX();
        },
        
        getY : function(){
            return this.tabEl.getY();
        },
        
        insertBefore : function(tab){
            if(!tab){
                return;
            }
            if(tab instanceof Tab){
                this.tabEl.insertBefore(tab.tabEl);
            } else{
                this.tabEl.insertBefore(tab);
            }
        },
        
        insertAfter : function(tab){
            if(!tab){
                return;
            }
            if(tab instanceof Tab){
                this.tabEl.insertAfter(tab.tabEl);
            } else{
                this.tabEl.insertAfter(tab);
            }
        },
        
        hide : function(){
            this.tabEl.hide();
        },
        
        show : function(){
            this.tabEl.show();
        },
        
        next : function(){
            return this.tabEl.next();
        },
        
        prev : function(){
            return this.tabEl.prev();
        },
        
        isVisible : function(){
            return this.tabEl.isVisible();
        }
        
    });
    
    var TabShellTabbody = function(shell, position){
        this.shell = shell;
        this.position = position;
        TabShellTabbody.superclass.constructor.call(this);
        this.addEvents('resize','mouseup');
    };
    Rs.extend(TabShellTabbody, Rs.util.Observable, {
        
        rendered : false,
        
        regions : [],
        
        renderTo:function(el){
            if(this.rendered === false && this.fireEvent('beforerender', this) !== false){
                this.targetEl = el.createChild({
                    tag : 'div',
                    cls : 'rs-tab-shell-tabbody rs-tab-shell-tabbody-' + this.position
                });
                this.targetEl.on('mouseup', this.onMouseUp, this);
                this.rendered = true;
            }
            this.doLayout();
        },
        
        doLayout : function(){
            if(this.position == 'top'){
                var size = this.shell.getSize();
                this.width = size.width;
                this.height = size.height-this.shell.tabheader.getSize().height;
                this.targetEl.setWidth(this.width);
                this.targetEl.setHeight(this.height);
            }
            this.fireEvent('resize', this.targetEl, this.width, this.height);
        },
        
        onMouseUp : function(e){
            this.fireEvent('mouseup',this);
        },
        
        addRegion : function(){
            var region = this.targetEl.createChild({
                tag : 'div',
                cls : 'rs-tab-region rs-tab-region-hide'
            });
            this.regions.push(region);
            return region;
        },
        
        displayRegion : function(region){
            region.removeClass('rs-tab-region-hide');
        },
        
        hideRegion : function(region){
            region.addClass('rs-tab-region-hide');
        },
        
        removeRegion : function(region){
            region.remove();
        }
    });
    

    /**
     * @class TabRegion
     * @extends Rs.app.Region
     * 标签页式应用程序位置
     * @constructor
     * @param {Rs.app.TabShell} shell
     * @param {Object} config
     */
    Rs.app.TabRegion = function(shell, config){
        Rs.app.TabRegion.superclass.constructor.call(this);
        this.shell = shell;
        this.engine = this.shell.getEngine();
        this.tabheader = shell.tabheader;
        this.tabbody = shell.tabbody;
        this.tabbody.on('resize', this.onTabbodyResize, this);
        this.config = config || {};
        this.targetEl = this.tabbody.addRegion();
    };
    Rs.extend(Rs.app.TabRegion, Rs.app.Region, {
        
        /**
         * @cfg {Boolean} active 
         * 当前标签是否为活动标签
         */
        active : false,
        
        //private
        afterApplyApp : function(app){
            Rs.app.TabRegion.superclass.afterApplyApp.apply(this, arguments);
            this.tab = this.tabheader.addTab(app, Rs.apply(Rs.apply({active : this.active},this.config),app.getRegionCfg()));
            this.tab.on('activated', this.onTabActivated, this);
            this.tab.on('unactivated', this.onTabUnActivated, this);
            this.tab.on('close', this.onTabClose, this);
            this.tabheader.setActiveTab(this.tab);
            app.open();
        },
        
        //private
        onTabbodyResize : function(tabbody, w, h){
            if(this.active && this.app.isOpen()){
                this.fireEvent('resize', this.targetEl, w, h);
            }
        },
        
        //private
        onTabActivated : function(tab){
            this.tabbody.displayRegion(this.targetEl);
            if(this.app.isOpen()){
                this.fireEvent('resize', this.targetEl, this.targetEl.getWidth(), this.targetEl.getHeight());
            }
            if(!this.app.isOpen()){
                this.app.open();
            }
            this.active = true;
        },
        
        //private
        onTabUnActivated : function(tab){
            this.active = false;
            this.tabbody.hideRegion(this.targetEl);
        },
        
        //private
        onTabClose : function(tab){
            this.active = false;
            this.tabbody.removeRegion(this.targetEl);
            this.app.close();
        },
        
        /**
         * 区域是否可见
         * @return {Boolean}
         */
        isVisible : function(){
            return this.targetEl.isVisible();
        }
        
    });
})();
Rs.define('Rs.app.Resizable', {

	setWidth : function() {
		Rs.error('必须实现setWidth方法!');
	},

	setHeight : function() {
		Rs.error('必须实现setHeight方法!');
	}

});


/**
 * @class Rs.app.Main
 * 应用程序的通用入口类，使用方法,在应用程序中配置mixins参数
 * <pre><code>
      mixins : [ Rs.app.Main ],
 * </code></pre>
 */
Rs.define('Rs.app.Main', {
    //private
	mixins : [ Rs.app.Resizable ],

	main : function(engine, region) {
        this.render.defer(15,this,[region.getRawEl()]);
        this.region = region;
		this.region.addResizeListener(function(w, h) {
			this.setWidth(w);
			this.setHeight(h);
		}, this);
	},

	render : function() {
		Rs.error('必须实现render方法!');
	}

});