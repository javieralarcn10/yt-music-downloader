$('#form-pc').on('submit', function(event) {
    event.preventDefault();
    const text = $('#busqueda').val().trim();
    buscar(text);
}); //formulario de pc

$('#form-mobile').on('submit', function(event) {
    event.preventDefault();
    const text = $('#busqueda-mobile').val().trim();
    buscar(text);
}); //formulario de mobile

function buscar(text) {
    $('#error').hide();
    $('#load').css("display", "flex");
    $('#content').empty();
    fetch(`http://localhost:3000/${text}`)
        .then(function(response) {
            return response.json();
        }) //lanzamos petición a api y recogemos respuesta en formato JSON
        .then(function(myJson) {
            $('#load').hide('slow');
            //pasamos la respuesta al index.html
            myJson.forEach(element => {
                $('#content').append(`
				<div class="col-12 col-md-3 my-2">
                <div class="card shadow rounded">
                    <div class="card-body">
                        <div class="row no-gutters">
                            <div class="col-5">
                                <img src="${element.img}" alt="" class="img-fluid rounded">
                            </div>
                            <div class="col-7 pl-2">
                                <span>${element.title}</span>
                                <p class="text-small text-muted">${element.channel}</p>
                            </div>
                        </div>
					</div>
					<div class="card-footer text-center"><a href='${element.download}'><b>Descargar</b></a></div>
                </div>
            </div>
				`)

            });
        }).catch(function(error) { //comprobamos que la petición no tenga errores
            $('#error').show();
        });

}