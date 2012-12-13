/** @license CSS.supports polyfill | @version 0.4 | MIT License | github.com/termi/CSS.supports */

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

	var global = this
		, _CSS_supports
		, msie
		, testElement
	;

	if(!global["CSS"]) {
		global["CSS"] = {};
	}

	// ---=== HAS CSS.supports support ===---
	_CSS_supports = global["CSS"]["supports"];

	// ---=== HAS supportsCSS support ===---
	if(!_CSS_supports && global["supportsCSS"]) {// Opera 12.10 impl
		_CSS_supports = global["CSS"]["supports"] = global["supportsCSS"];
		if(global.__proto__) {
			delete global.__proto__["supportsCSS"];
		}
	}


	if(typeof _CSS_supports === "function") {
		if( !function() {
			// Test for support [supports condition](http://www.w3.org/TR/css3-conditional/#supportscondition)
			try {
				_CSS_supports.call(global, "(a:a)");
				_CSS_supports = null;
				// SUCCESS
			}
			catch(e) {
				_CSS_supports = _CSS_supports.bind(global);
				return true;//FAIL
			}
		}.call(null) ) {
			return;
		}
	}
	else {
		msie = "runtimeStyle" in document.documentElement;
		testElement = global["document"].createElement("_");

		// ---=== NO CSS.supports support ===---
		_CSS_supports = function(ToCamel_replacer, testStyle, testElement, propertyName, propertyValue) {
			/* TODO:: for IE < 9:
			 _ = document.documentElement.appendChild(document.createElement("_"))
			 _.currentStyle[propertyName] == propertyValue
			*/
			var __bind__RE_FIRST_LETTER = this;
			propertyName = (propertyName || "").replace(__bind__RE_FIRST_LETTER, ToCamel_replacer);

			var result = propertyName in testStyle;

			if( result ) {
				if( msie ) {
					testStyle.cssText = "display:none;height:0;width:0;visibility:hidden;position:fixed;" + propertyName + ":" + propertyValue;
					document.documentElement.appendChild(testElement);
					result = testElement.currentStyle[propertyName] == propertyValue;
					document.documentElement.removeChild(testElement);
				}
				else {
					testStyle.cssText = propertyName + ":" + propertyValue;
					result = testStyle[propertyName] == propertyValue;
				}
			}

			testStyle.cssText = "";

			return result;
		}.bind(
			/(-)([a-z])/g // __bind__RE_FIRST_LETTER
			, function(a, b, c) { // __bind__fromCSSPropToCamel_replacer
				return c.toUpperCase()
			}
			, testElement.style // __bind__testElementStyle
			, msie ? testElement : null
		);
	}

	// _supportsCondition("(a:b) or (display:block) or (display:none) and (display:block1)")
	function _supportsCondition(str) {
		if(!str) {
			_supportsCondition.throwSyntaxError();
		}

		str = _supportsCondition.normaliseMediaString(str + "");


		/** @enum {number} @const */
		var RMAP = {
			NOT: 1
			, AND: 2
			, OR: 4
			, PROPERTY: 8
			, VALUE: 16
			, GROUP_START: 32
			, GROUP_END: 64
		};

		var resultsStack = []
			, chr
			, result
			, valid = true
			, isNot
			, start
			, currentPropertyName
			, expectedPropertyValue
			, passThisGroup
			, nextRuleCanBe = 
				RMAP.NOT | RMAP.GROUP_START | RMAP.PROPERTY
			, currentRule
			, i = -1
			, newI
			, len = str.length
		;

		resultsStack.push(void 0);

		function _getResult() {
			var l = resultsStack.length - 1;
			if( l < 0 )valid = false;
			return resultsStack[ l ];
		}
		function _setResult(val) {
			var l = resultsStack.length - 1;
			if( l < 0 )valid = false;
			result = resultsStack[ l ] = val;
		}
		function _checkNext(that, notThat, __i, cssValue) {
			newI = __i || i;

			var chr
				, isQuited
				, isUrl
				, special
			;

			if(cssValue)newI--;

			do {
				chr = str.charAt(++newI);

				if(cssValue) {
					special = chr && (isQuited || isUrl);
					if(chr == "'" || chr == "\"") {
						special = (isQuited = !isQuited);
					}
					else if(!isQuited) {
						if(!isUrl && chr == "(") {
							// TODO:: in Chrome: $0.style.background = "url('http://asd))')"; $0.style.background == "url(http://asd%29%29/)"
							isUrl = true;
							special = true;
						}
						else if(isUrl && chr == ")") {
							isUrl = false;
							special = true;
						}
					}
				}
			}
			while(special || (chr && (!that || chr != that) && (!notThat || chr == notThat)));

			if(that == null || chr == that) {
				return newI;
			}
		}

		while(++i < len) {
			if(currentRule == RMAP.NOT) {
				nextRuleCanBe = RMAP.GROUP_START | RMAP.PROPERTY;
			}
			else if(currentRule == RMAP.AND || currentRule == RMAP.OR || currentRule == RMAP.GROUP_START) {
				nextRuleCanBe = RMAP.GROUP_START | RMAP.PROPERTY | RMAP.NOT;
			}
			else if(currentRule == RMAP.GROUP_END) {
				nextRuleCanBe = RMAP.GROUP_START | RMAP.NOT | RMAP.OR | RMAP.AND;
			}
			else if(currentRule == RMAP.VALUE) {
				nextRuleCanBe = RMAP.GROUP_END | RMAP.GROUP_START | RMAP.NOT | RMAP.OR | RMAP.AND;
			}
			else if(currentRule == RMAP.PROPERTY) {
				nextRuleCanBe = RMAP.VALUE;
			}

			chr = str.charAt(i);

			if(nextRuleCanBe & RMAP.NOT && chr == "n" && str.substr(i, 3) == "not") {
				currentRule = RMAP.NOT;
				i += 2;
			}
			else if(nextRuleCanBe & RMAP.AND && chr == "a" && str.substr(i, 3) == "and") {
				currentRule = RMAP.AND;
				i += 2;
			}
			else if(nextRuleCanBe & RMAP.OR && chr == "o" && str.substr(i, 2) == "or") {
				currentRule = RMAP.OR;
				i++;
			}
			else if(nextRuleCanBe & RMAP.GROUP_START && chr == "(" && _checkNext("(", " ")) {
				i = newI - 1;
				currentRule = RMAP.GROUP_START;
			}
			else if(nextRuleCanBe & RMAP.GROUP_END && chr == ")" && resultsStack.length > 1) {
				currentRule = RMAP.GROUP_END;
			}
			else if(nextRuleCanBe & RMAP.PROPERTY && chr == "(" && (start = _checkNext(null, " ")) && _checkNext(":", null, start)) {
				i = newI - 1;
				currentPropertyName = str.substr(start, i - start + 1).trim();
				start = 0;
				currentRule = RMAP.PROPERTY;
				expectedPropertyValue = null;
				continue;
			}
			else if(nextRuleCanBe & RMAP.VALUE && (start = _checkNext(null, " ")) && _checkNext(")", null, start, true)) {
				i = newI;
				expectedPropertyValue = str.substr(start, i - start).trim();
				start = 0;
				currentRule = RMAP.VALUE;
				chr = " ";
			}
			else if(chr == " ") {
				continue;
			}
			else currentRule = 0;

			if(!valid || !chr || !(currentRule & nextRuleCanBe)) {
				_supportsCondition.throwSyntaxError();
			}
			valid = true;

			if(currentRule == RMAP.OR) {
				if(result === false) {
					_setResult();
					passThisGroup = false;
				}
				else if(result === true) {
					passThisGroup = true;
				}

				continue;
			}

			if( passThisGroup ) {
				continue;
			}

			result = _getResult();

			if(currentRule == RMAP.NOT) {
				isNot = true;

				continue;
			}

			if(currentRule == RMAP.AND) {
				if(result === false) {
					passThisGroup = true;
				}
				else {
					_setResult();
				}

				continue;
			}

			if(result === false && !(currentRule & (RMAP.GROUP_END | RMAP.GROUP_START))) {
				_setResult(result);
				continue;
			}

			if( currentRule == RMAP.GROUP_START ) { // Group start
				resultsStack.push(void 0);
			}
			else if( currentRule == RMAP.GROUP_END ) { // Group end
				passThisGroup = false;

				resultsStack.pop();
				if( _getResult() !== void 0) {
					result = !!(result & _getResult());
				}

				isNot = false;
			}
			else if( currentRule == RMAP.VALUE ) { // Property value
				_setResult(_CSS_supports(currentPropertyName, expectedPropertyValue));
				if(isNot)result = !result;

				isNot = false;
				expectedPropertyValue = currentPropertyName = null;
			}

			_setResult(result);
		}

		if(!valid || result === void 0 || resultsStack.length > 1) {
			_supportsCondition.throwSyntaxError();
		}

		return result;
	}
	_supportsCondition.throwSyntaxError = function() {
		throw new Error("SYNTAX_ERR");
	};
	_supportsCondition.normaliseMediaString = function(str) {
		var RE_SPACES = this;
		return str.replace(RE_SPACES, " ")
	}.bind(/[\s\r\n]/g);


	global["CSS"]["supports"] = function(a, b) {
		if(!arguments.length) {
			throw new Error("WRONG_ARGUMENTS_ERR");//TODO:: DOMException ?
		}

		if(arguments.length == 1) {
			return _supportsCondition(a);
		}

		return _CSS_supports(a, b);
	};

	global = testElement = null;// no need this any more
}.call(this);
