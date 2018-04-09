
(function( win, $ ) {
  'use strict';

  // Variables
  var Element = {
    FORM: $('[data-form="add-car"]'),
    BUTTON_REMOVE_CAR: $('[data-action="remove-car"]'),
    WRAPPER_LIST_CARD: $('[data-wrapper-list="cars"]').get()
  };

  var Data = {
    company: null
  };

  // Events
  Element.FORM.on('submit', addCar);
  Element.BUTTON_REMOVE_CAR.on('click', removeCar);

  // Methods
  function removeCar( event ) {
    var $button = event.target;
    var $row = $.getParent( $button ,'tr' );

    $row.remove();
  }

  function addCar( event ) {
    event.preventDefault();
    var $form = event.target;
    var data = getFormData( $form );

    requestSaveCar( data );
    cleanForm( $form );
  }

  function requestSaveCar( data ) {
    var params;
    var ajax = new XMLHttpRequest();
    ajax.open('POST', 'http://localhost:3000/car');
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajax.send( data[0] );

    ajax.onreadystatechange = function() {
      if( isRequestSuccess( ajax ) ) {
        console.log( ajax.responseText );
        showCars( data );
      }
    };
  }

  function getFormData( $form ) {
    var $inputs = $form.querySelectorAll('[data-input]');
    var contract = {
      year: 'year',
      image: 'image',
      brand: 'brandModel',
      plate: 'plate',
      color: 'color'
    };

    var data = {};

    $inputs.forEach(function($input) {
      var dataAtrributeName = $input.dataset.input;

      if( contract[ dataAtrributeName ] ) {
        data[ contract[ dataAtrributeName ] ] = $input.value;
      }
    });

    return [ data ];
  }

  function showCars( data ) {
    var $template = getTemplateCar( data );
    Element.WRAPPER_LIST_CARD.insertAdjacentHTML( 'beforeend', $template );
  }

  function getTemplateCar( data ) {
    var $template = '';

    data.forEach(function( car ) {
      $template += '<tr>';
        $template += '<td> <img src="' + car.image + '" /></td>';
        $template += '<td> ' + car.brandModel + ' </td>';
        $template += '<td> ' + car.year + ' </td>';
        $template += '<td> ' + car.plate + ' </td>';
        $template += '<td> ' + car.color + ' </td>';
        $template += '<td> <button data-action="remove-car">Remover</button> </td>';
      $template += '</tr>';
    });

    return $template;
  }

  function cleanForm( $form ) {
    $form.reset();
  }

  function init() {
    requestCompanyInfo();
    requestCars();
  }

  function requestCars( data ) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', 'http://localhost:3000/car');
    ajax.send();

    ajax.addEventListener('readystatechange' , function() {
      if ( isRequestSuccess(ajax) ) {
        var data = JSON.parse( ajax.responseText );
        showCars( data );
      }
    }, false);

  }

  function showCompanyInfo() {
    showCompany('name');
    showCompany('phone');
  }

  function showCompany( prop ) {
    var $company = $('[data-company="' + prop + '"]');
    $company.forEach(function($item) {
      $item.textContent = Data.company[prop];
    });
  }

  function isCompanyDataValid( item ) {
    return infoCompanyValid[ item ];
  }

  function requestCompanyInfo() {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', '/assets/data/company.json');
    ajax.send();

    ajax.addEventListener('readystatechange' , function(){
      if( isRequestSuccess(ajax) ) {
        saveCacheCompany( ajax.responseText );
        showCompanyInfo();
      }
    }, false);
  }

  function isRequestSuccess( ajax ) {
    return ajax.readyState === 4 && ajax.status === 200;
  }

  function saveCacheCompany( data ) {
    Data.company = JSON.parse( data );
  }

  // Public Api
  win.app = {
    init: init
  };

  // Start app
  win.app.init();

})( window, DOM );
