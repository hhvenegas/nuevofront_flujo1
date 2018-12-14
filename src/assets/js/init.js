$(".print-label-link").on("click", function () {
    var label_data = label;
    $.ajax({
      type: "POST",
      data: label_data,
      dataType: 'text',
      url: "http://192.168.15.150/pstprnt",
      crossDomain: true,
      xhrFields: {
        withCredentials: false
      },
      beforeSend: function(){
        console.log("SE ENVIA....")
      }
    })
    .done(function (response) {
      alert('Etiqueta impresa correctamente');
    })
    .fail(function (xhr, textStatus, errorThrown) {
      alert('La etiqueta no se pudo imprimir correctamente');
      //alert('Etiqueta impresa correctamente');
    });
  });