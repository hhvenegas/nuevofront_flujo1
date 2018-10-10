(function($){
  $(function(){
  	M.AutoInit();
    date = new Date();
    maxDate = date.getFullYear()-20;
    minDate = date.getFullYear()-70;
    minDate2 = date.getFullYear()-45;
    var calendar = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(calendar, {
      autoClose: true,
      format: 'yyyy-mm-dd',
      defaultDate: new Date((minDate2)+'-01-01'),
      minDate: new Date(minDate+'-01-01'),
      maxDate: new Date(maxDate+'-01-01'),
      yearRange: 25,
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
        weekdaysAbbrev:  [
          'D',
          'L',
          'M',
          'M',
          'J',
          'V',
          'S'
        ],
      }
    });
    //$('.sidenav').sidenav();
    $('select').formSelect();
    $('.modal').modal();
    $('.tooltipped').tooltip();
    $('.carousel.carousel-slider').carousel({
      fullWidth: true
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space