var search = document.getElementById('search-button');
search.addEventListener('click', function(){
  var searchfield = document.getElementById('search-field').value;
  if (searchfield != "") {
    window.location.href = "/r/"+searchfield;
  }
});


document.getElementById('search-field').onkeypress = function(e) {
  var event = e || window.event;
  var charCode = event.which || event.keyCode;

  if ( charCode == '13' ) {
    search.click();
  }
}
