(function($){
  $(function(){
  	M.AutoInit();
    date = new Date();
    maxDate = date.getFullYear()-20;
    minDate = date.getFullYear()-70;
    var calendar = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(calendar, {
      autoClose: true,
      format: 'yyyy-mm-dd',
      defaultDate: new Date((maxDate-1)+'-01-01'),
      minDate: new Date(minDate+'-01-01'),
      maxDate: new Date(maxDate+'-01-01'),
      i18n: {
        months: 
          [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
          ],
        monthsShort:
          [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic'
          ],
        weekdays:
          [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado'
          ],
        weekdaysShort:
          [
            'Dom',
            'Lun',
            'Mar',
            'Mié',
            'Jue',
            'Vie',
            'Sáb'
          ],
        
      }
    });
    //$('.sidenav').sidenav();
    $('select').formSelect();
    $('.modal').modal();
    var instance = M.Carousel.init({
      fullWidth: true
    });

  }); // end of document ready

})(jQuery); // end of jQuery name space