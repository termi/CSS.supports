/** @license CSS.supports polyfill | @version 0.1 | MIT License | github.com/termi */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name CSS.supports.js
// @check_types
// ==/ClosureCompiler==

/*
TODO::
1. element.style.webkitProperty == element.style.WebkitProperty in Webkit (Chrome at least), so
CSS.supporst("webkit-animation", "name") is true. Think this is wrong.
*/

void function() {
	"use strict";
	var global = this;

	// HAS CSS.supports support
	if(
		(global["CSS"] && typeof global["CSS"]["supports"] === "function")
		|| (
			!global["document"]
			&& (!testElement || !testElement.style)
			)
		) {
		return;
	}

	if(!global["CSS"]) {
		global["CSS"] = {};
	}

	// HAS supportsCSS support
	if(global["supportsCSS"]) {// Opera 12.10 impl
		global["CSS"]["supports"] = global["supportsCSS"];
		if(global.__proto__) {
			delete global.__proto__["supportsCSS"];
		}

		return;
	}

	var RE_FIRST_LETTER = /(-)([a-z])/g
		, testElementStyle = global["document"].createElement("_").style
	;

	function fromCSSPropToCamel_replacer(a, b, c) {
		return c.toUpperCase()
	}

	function _supportsRule(propertyName, propertyValue) {
		propertyName = (propertyName || "").replace(RE_FIRST_LETTER, fromCSSPropToCamel_replacer);

		var result = propertyName in testElementStyle;

		if( result ) {
			testElementStyle[propertyName] = propertyValue;
			result = testElementStyle[propertyName] == propertyValue;
		}

		testElementStyle.cssText = "";

		return result;
	}

	function _supportsCondition(supports_condition) {
		//TODO:: http://www.w3.org/TR/css3-conditional/#supportscondition
	}

	function _supports() {
		if(!arguments.length || /*TODO:: delete this when _supportsCondition would be ready*/arguments.length == 1) {
			throw new Error("WRONG_ARGUMENTS_ERR");//TODO:: DOMException ?
		}

		/*TODO::
		if(arguments.length == 1) {
			return _supportsCondition.call(null, propertyName);
		}*/

		return _supportsRule.apply(null, arguments);
	}

	if(!global["CSS"])global["CSS"] = {};
	global["CSS"]["supports"] = _supports;

	testElementStyle.cssText = "";
	global = null;
}.call(this);
