function imprimirEtiqueta(obj){
    console.log(obj.id)
    var label_data = $("#label-" + obj.id).val();
    $.ajax({
        type: "POST",
        data: label_data,
        dataType: 'text',
        url: "http://192.168.15.150/pstprnt",
        xhrFields: {
        withCredentials: false
        }
    })
    .done(function (response) {
        console.log(response);
        alert('Etiqueta impresa correctamente');
    })
    .fail(function (xhr, textStatus, errorThrown) {
        console.log(textStatus)
        console.log(errorThrown)
        alert('La etiqueta no se pudo imprimir');
        //alert('Etiqueta impresa correctamente');
    });
}