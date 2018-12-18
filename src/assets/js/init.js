function imprimirEtiqueta(obj){
    console.log(obj.id)
    var label_data = $("#label-" + obj.id).val();

    var http = new XMLHttpRequest();
    var url = "http://192.168.15.150/pstprnt";
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(label_data);
}