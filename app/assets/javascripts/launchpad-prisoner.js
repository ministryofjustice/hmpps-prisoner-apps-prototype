//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here


  document.addEventListener('DOMContentLoaded', function () {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    document.querySelectorAll('.reldate').forEach(function (el) {
      const relDate = Number(el.textContent.trim());
      if (Number.isNaN(relDate)) return;

      const date = new Date();
      date.setDate(date.getDate() + relDate);

      el.textContent = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    });
  });


   // POSTCODE

  // Hide the full address fields and lookup button
    $('.full-address').hide();
    $('#lookup-address').hide();

    // Enter the address mannually
    $('a#enter-manually').click(function(e){
      var enterAddress = "manual";
      $(this).hide();
      $('.address-lookup').hide();
      $('.full-address').show();
      $('#lookup-address').show();
      e.preventDefault();
    });

    // Uuse the address Lookup
    $('a#lookup-address').click(function(e){
      var enterAddress = "lookup";
      $('.full-address').hide();
      $('#lookup-address').hide();
      $('.address-lookup').show();
      $('#enter-manually').show();
      e.preventDefault();
    });

    $('.sensitive-card').click(function(){
      $(this).children('.sensitive').toggle();
    });

  

  });
