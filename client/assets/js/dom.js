(function( win, doc ) {
    'use strict';

    // Variables
    var $body = doc.querySelector('body');
    var fn = {};
    var ObjectType = {
      NULL: '[object Null]',
      ARRAY: '[object Array]',
      NUMBER: '[object Number]',
      OBJECT: '[object Object]',
      STRING: '[object String]',
      BOLLEAN: '[object Boolean]',
      FUNCTION: '[object Function]',
      UNDEFINED: '[object Undefined]'
    };

    // polyfill
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    function DOM( element ) {
      if( !(this instanceof DOM) ){
        return new DOM(element);
      }

      this.element = has(element) ? getAll(element) : element;
    }

    function has( element ) {
      return getAll( element ).length > 0;
    }

    function getAll( element ) {
      return doc.querySelectorAll( element );
    }

    function addDynamicEventListener( elementName, eventName, callback ) {
      var attr = elementName;

      $body.addEventListener(eventName, function(event) {
        var $element = event.target;

        if ( isMatcheElement( $element, attr ) ) {
          registerFunction( attr, callback );
          callFunction( attr, event );
        }

      }, false);
    }

    function isMatcheElement( element, attribute ) {
      return element.matches( attribute );
    }

    function registerFunction( name, func ) {
      if( !fn[name] ) {
          fn[name] = func;
      }
    }

    function callFunction( name, event )  {
      fn[name]( event );
    }

    DOM.prototype.on = function on( event, callback ) {
      if( DOM.isString( this.element )  ) {
        addDynamicEventListener( this.element, event, callback );
        return;
      }

      this.element.forEach(function( elem ){
        elem.addEventListener( event, callback, false );
      });
    }

    DOM.prototype.off = function off( event, callback ) {
        this.element.forEach(function( elem ){
            elem.removeEventListener( event, callback, false );
        });
    }

    DOM.prototype.get = function get( index ) {
      if( index ) {
        return this.element[ index ];
      }

      return this.element[0];
    }

    DOM.getParent = function getParent( elem, selector ) {

      for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( elem.matches( selector ) ) return elem;
      }

      return null;
    }

    DOM.prototype.forEach = function forEach() {
      return Array.prototype.forEach.apply( this.element, arguments );
    }

    DOM.prototype.map = function map() {
      return Array.prototype.map.apply( this.element, arguments );
    }

    DOM.prototype.filter = function filter() {
      return Array.prototype.filter.apply( this.element, arguments );
    }

    DOM.prototype.filter = function filter() {
      return Array.prototype.filter.apply( this.element, arguments );
    }

    DOM.prototype.reduce = function reduce() {
      return Array.prototype.reduce.apply( this.element, arguments );
    }

    DOM.prototype.reduceRight = function reduceRight() {
      return Array.prototype.reduceRight.apply( this.element, arguments );
    }

    DOM.prototype.every = function every() {
      return Array.prototype.every.apply( this.element, arguments );
    }

    DOM.prototype.some = function some() {
      return Array.prototype.some.apply( this.element, arguments );
    }

    DOM.isArray = function isArray( obj ) {
      return getType( obj ) === ObjectType.ARRAY;
    }

    DOM.isNumber = function isNumber( obj ) {
      return getType( obj ) === ObjectType.NUMBER;
    }

    DOM.isFunction = function isFunction( obj ) {
      return getType( obj ) === ObjectType.FUNCTION;
    }

    DOM.isObject = function isObject( obj ) {
      return getType( obj ) === ObjectType.OBJECT;
    }

    DOM.isString = function isString( obj ) {
      return getType( obj ) === ObjectType.STRING;
    }

    DOM.isBoolean = function isBoolean( obj ) {
      return getType( obj ) === ObjectType.BOLLEAN;
    }

    DOM.isNull = function isNull( obj ) {
      var type = getType( obj );
      return type === ObjectType.NULL || type === ObjectType.UNDEFINED;
    }

    function getType( obj ) {
      return Object.prototype.toString.call( obj );
    }

    // Publc Api
    return win.DOM = DOM;

})( window, document );
