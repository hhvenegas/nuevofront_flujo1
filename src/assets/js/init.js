(function($){
  $(function(){
  	M.AutoInit();
  	$('.datepicker').datepicker();
    //$('.sidenav').sidenav();
    $('select').formSelect();
    $('.modal').modal();

  }); // end of document ready

  function openModal(){
  	$("#modal2").open();
  }

})(jQuery); // end of jQuery name space