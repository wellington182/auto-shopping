(function( $, doc ) {
  'use strict';

 
  var app = ( function() { 
   
  return {
     init: function() {
        request( 'http://127.0.0.1:5501/auto-shopping/company.json', function( response) {
          var $name = $( '[data-js="company-name"]' );
          var $phone = $( '[data-js="company-phone"]' );
  
          response = JSON.parse( response );
  
          $name.get().textContent = response.name;
          $phone.get().textContent = response.phone;
        }, 'GET' );
       
        var $btnInsert = $( '[data-js="btnInsert"]' );
        $btnInsert.on( 'click', insert );

        list();
      }
  };  
  
  function request( url, callback, method, data ) {
    if ( typeof callback != 'function') {
        throw {
          name: 'ReferenceError',
          message: 'Second param is not a function'
        };
    }

    var xhr = new XMLHttpRequest();
    
    if ( xhr ) {
      xhr.addEventListener( 'readystatechange', function() {
        handleStateChange( xhr, callback );
      }, false ); 
      
      
      xhr.open( method, url, true );
      
      if ( typeof data !== undefined ) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));

        return;
      }
      
      xhr.send( null );
    }
      
  }
    
  function handleStateChange( xhr, callback ) {
    if ( xhr.readyState === 4 ) {
      if ( xhr.status === 200 || xhr.status === 304 ) {
        callback( xhr.response );
      }
    }
  }
    
  function insert( e ) {
      e.preventDefault();
    
      var img = $( '[data-js="img"]' ).get().value;
      var brandModel = $( '[data-js="brandModel"]' ).get().value;
      var year = $( '[data-js="year"]' ).get().value;
      var plate = $( '[data-js="plate"]' ).get().value;
      var color = $( '[data-js="color"]' ).get().value;
     
      request( 'http://localhost:3000/car', function( response ) {
          console.log( response.status );

          list();
          
          clear();
      }, 'POST', { image: img, brandModel: brandModel, year: year, plate, plate, color: color} );
     
  }

  function parse( response ) {
    var cars;

    try {
      cars =  JSON.parse( response );
    }
    catch( e ) {
      console.warn( 'Lista de carros vazia' );
      cars = [];
    }

    return cars;
  }

  function clear() {
    $( '[data-js="img"]' ).get().value = '';
    $( '[data-js="brandModel"]' ).get().value = '';
    $( '[data-js="year"]' ).get().value = '';
    $( '[data-js="plate"]' ).get().value = '';
    $( '[data-js="color"]' ).get().value = '';
  }

  function list() {
      var cars;

      request( 'http://localhost:3000/car', function( response) {
        cars = parse( response );
        
        var tbody = '';
        var length = cars.length;
        
        for ( var i = 0; i < length; i++ ) {
          tbody += '<tr><td><img src="' + cars[i].image + '" /></td>' +
          '<td>' + cars[i].brandModel + '</td>' +
          '<td>' + cars[i].year + '</td>' +
          '<td>' + cars[i].plate + '</td>' +
          '<td>' + cars[i].color + '</td>';
        }
        
        var $tbody = $( '[data-js="body"]' ).get( 0 );
        $tbody.innerHTML = tbody;
      }, 'GET' );
    }      
} )();  

app.init();

})( window.DOM, document );
