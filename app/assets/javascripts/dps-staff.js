//
// Javascript code for the staff facing side
//

window.GOVUKPrototypeKit.documentReady(() => {

   // Show prisoner name when entering a prison number

  var prisonNumber =  $('input#prisonNumber').val();

  if (prisonNumber === "") {
    $('#prisoner-name-check').hide();
  }

  $('a#prisonNumber-lookup').click(function () {
    // alert('this works');
    var prisonNumber = $('input#prisonNumber').val();
    console.log(prisonNumber);
    //alert(prisonNumber);
    if (prisonNumber.length > 2) {
        $('#prisoner-name-check').show();
        if (prisonNumber == 'G4567NO') {
            $('#prisoner-name-row').text('Prisoner name: Blake, Oliver');
            $('#prisonerName').val('Blake, Oliver'); // Use .val() instead of .value()
        } else if (prisonNumber == 'J6789TU') { // Use else if instead of else
            $('#prisoner-name-row').text('Prisoner name: Gupta, Vikram');
            $('#prisonerName').val('Gupta, Vikram'); // Use .val() instead of .value()
        } else if (prisonNumber == 'D2345HI') { // Use else if instead of else
            $('#prisoner-name-row').text('Prisoner name: Ali, Saeed');
            $('#prisonerName').val('Ali, Saeed'); // Use .val() instead of .value()
        } else if (prisonNumber == 'A1234BC') { // Use else if instead of else
            $('#prisoner-name-row').text('Prisoner name: Wright, Benjamin');
            $('#prisonerName').val('Wright, Benjamin'); // Use .val() instead of .value()
        } else {
            $('#prisoner-name-row').text('Prisoner name: Patel, Taj');
            $('#prisonerName').val('Patel, Taj'); // Use .val() instead of .value()
        }
    }
});

});
