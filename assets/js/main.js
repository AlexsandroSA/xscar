
(function( win, $ ) {
  'use strict';

  // Variables
  var ajax = new XMLHttpRequest();

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

    showNewCar( data );
    resetForm( $form );
  }

  function getFormData( $form ) {
    var $inputs = $form.querySelectorAll('[data-input]');
    var contract = {
      year: 'year',
      image: 'image',
      brand: 'brand',
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

    return data;
  }

  function showNewCar( data ) {
    var $template = getTemplateCar( data );
    Element.WRAPPER_LIST_CARD.insertAdjacentHTML( 'beforeend', $template );
  }

  function getTemplateCar( data ) {
    var $template = '';
    $template += '<tr>';
      $template += '<td> <img src="' + data.image + '" /></td>';
      $template += '<td> ' + data.brand + ' </td>';
      $template += '<td> ' + data.year + ' </td>';
      $template += '<td> ' + data.plate + ' </td>';
      $template += '<td> ' + data.color + ' </td>';
      $template += '<td> <button data-action="remove-car">Remover</button> </td>';
    $template += '</tr>';
    return $template;
  }

  function resetForm( $form ) {
    $form.reset();
  }

  function init() {
    requestCompanyInfo();
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
    ajax.open('GET', '/assets/data/company.json', true);
    ajax.send();
    ajax.addEventListener('readystatechange' , readyStateChange, false);
  }

  function readyStateChange() {
    if ( isRequestSuccess() ) {
      saveCacheCompany( ajax.responseText );
      showCompanyInfo();
    }
  }

  function isRequestSuccess() {
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
