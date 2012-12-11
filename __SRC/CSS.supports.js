/** @license CSS.supports polyfill | @version 0.2 | MIT License | github.com/termi */

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
		// ---=== NO CSS.supports support ===---
		_CSS_supports = function(__bind__fromCSSPropToCamel_replacer, __bind__testElementStyle, propertyName, propertyValue) {
			var __bind__RE_FIRST_LETTER = this;
			propertyName = (propertyName || "").replace(__bind__RE_FIRST_LETTER, __bind__fromCSSPropToCamel_replacer);

			var result = propertyName in __bind__testElementStyle;

			if( result ) {
				__bind__testElementStyle[propertyName] = propertyValue;
				result = __bind__testElementStyle[propertyName] == propertyValue;
			}

			__bind__testElementStyle.cssText = "";

			return result;
		}.bind(
			/(-)([a-z])/g // __bind__RE_FIRST_LETTER
			, function(a, b, c) { // __bind__fromCSSPropToCamel_replacer
				return c.toUpperCase()
			}
			, global["document"].createElement("_").style // __bind__testElementStyle
		);
	}

	// _supportsCondition("(a:b) or (display:block) or (display:none) and (display:block1)")
	function _supportsCondition(supports_condition) {
		if(!supports_condition) {
			_supportsCondition.throwSyntaxError();
		}

		supports_condition = _supportsCondition.normaliseMediaString(supports_condition + "");


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
			, chain
			, result
			, valid = true
			, LOCAL_RE_CHAINS = /\S+/g // this RegExp must be new every time
			, isNot
			, currentPropertyName
			, expectedPropertyValue
			, passThisGroup
			, nextRuleCanBe = 
				RMAP.NOT | RMAP.GROUP_START | RMAP.PROPERTY
			, currentRule
		;

		resultsStack.push(void 0);

		function _getResult() {
			return resultsStack[ resultsStack.length - 1 ];
		}
		function _setResult(val) {
			result = resultsStack[ resultsStack.length - 1 ] = val;
		}

		while(chain = LOCAL_RE_CHAINS.exec(supports_condition)) {
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
			else if(currentRule == RMAP.PROPERTY) { // TODO:: supportsCondition_rules.PROPERTY -> supportsCondition_rules.PROPERTY_and_VALUE
				nextRuleCanBe = RMAP.GROUP_END | RMAP.GROUP_START | RMAP.NOT | RMAP.OR | RMAP.AND;
			}

			chain = chain && chain[0] || "";

			if(chain === "not")currentRule = RMAP.NOT;
			else if(chain === "and")currentRule = RMAP.AND;
			else if(chain === "or")currentRule = RMAP.OR;
			else if(chain === "(")currentRule = RMAP.GROUP_START;
			else if(chain === ")")currentRule = RMAP.GROUP_END;
			else if(chain.charAt(0) == "(")currentRule = RMAP.PROPERTY;
			else if(chain.substr(-1) == ")")currentRule = RMAP.VALUE;
			else currentRule = 0;

			if(!valid || !chain || !(currentRule & nextRuleCanBe)) {
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
				if( _getResult() !== void 0)result &= _getResult();

				isNot = false;
			}
			else if( currentRule == RMAP.PROPERTY ) { // Property name
				if(chain.substr(-1) == ":") {
					currentPropertyName = chain.substr(1, chain.length - 2);

					continue;
				}
				else if(chain.indexOf(":") != -1) {
					result = chain.split(":"); // we can use 'result' variable here because we would overwrite it in next rule 'Property value'
					currentPropertyName = result[0].substr(1);
					chain = result[1]; // For 'Property value' check
					if(chain.substr(-1) == ")") {
						currentRule = RMAP.VALUE;
					}
					else {
						valid = false;
					}
				}
				else {
					valid = false;
				}
			}

			if( currentRule == RMAP.VALUE ) { // Property value
				expectedPropertyValue = chain.substr(0, chain.length - 1);
				_setResult(_CSS_supports(currentPropertyName, expectedPropertyValue));
				if(isNot)result = !result;

				isNot = false;
			}

			_setResult(result);
		}

		if(!valid) {
			_supportsCondition.throwSyntaxError();
		}

		return result;
	}
	_supportsCondition.throwSyntaxError = function() {
		throw new Error("SYNTAX_ERR");
	};
	_supportsCondition.normaliseMediaString = function(
		STR_RE_REDUNDANT_WHITESPACE
		, RE_MORE_WHITESPACE
		, STR_RE_MORE_WHITESPACE
		, RE_GROUP_START
		, STR_RE_GROUP_START
		, RE_GROUP_END
		, STR_RE_GROUP_END
		, RE_CONDITIONS
		, STR_RE_CONDITIONS
		, str
	) {
		var RE_REDUNDANT_WHITESPACE = this;
		return str
			.replace(RE_REDUNDANT_WHITESPACE, STR_RE_REDUNDANT_WHITESPACE)
			.replace(RE_MORE_WHITESPACE, STR_RE_MORE_WHITESPACE)
			.replace(RE_GROUP_START, STR_RE_GROUP_START)
			.replace(RE_GROUP_END, STR_RE_GROUP_END)
			.replace(RE_CONDITIONS, STR_RE_CONDITIONS)
	}.bind(
		/\s*(:)\s*|(\()\s+(\S)|(\S)\s+(\))/g // RE_REDUNDANT_WHITESPACE
		, "$1$2$3$4$5" // STR_RE_REDUNDANT_WHITESPACE
		, /\s{2,}/g // RE_MORE_WHITESPACE
		, " " // STR_RE_MORE_WHITESPACE
		, /\(\(/g // RE_GROUP_START
		, "( (" // STR_RE_GROUP_START
		, /\)\)/g // RE_GROUP_END
		, ") )" // STR_RE_GROUP_END
		, /(\))\s*(not|and|or)\s*(\()?/ig // RE_CONDITIONS
		, "$1 $2 $3" // STR_RE_CONDITIONS
	);


	global["CSS"]["supports"] = function(a, b) {
		if(!arguments.length) {
			throw new Error("WRONG_ARGUMENTS_ERR");//TODO:: DOMException ?
		}

		if(arguments.length == 1) {
			return _supportsCondition(a);
		}

		return _CSS_supports(a, b);
	};

	global = null;// no need this any more
}.call(this);
