//DATOS ESTABLECIDOS
class Lote {
  constructor(
    id,
    marca,
    modelo,
    cilindrada,
    sobrealimentacion,
    precio,
    imagen
  ) {
    (this.id = id),
      (this.marca = marca),
      (this.modelo = modelo),
      (this.cilindrada = cilindrada),
      (this.sobrealimentacion = sobrealimentacion),
      (this.precio = precio),
      (this.imagen = imagen);
  }
  mostrarInfoLote() {}
}






let tinglado1 = [];


//INSTALANDO ARCHIVO JSON


const cargarTinglado1 = async ()=> {
  //----RUTA RELATIVA OJO, TODO DEPENDE DE DONDE ESTA EL ARCHIVO HTML RAIZ---- RELATIVE PATH EYE, EVERYTHING DEPENDS ON WHERE IS THE ROOT HTML FILE
  const response = await fetch ("../vehiculos.json")
  const data = await response.json()
  for (let lote of data){
    let loteNuevo = new Lote(lote.id, lote.marca, lote.modelo, lote.cilindrada, lote.sobrealimentacion, lote.precio, lote.imagen)
    tinglado1.push(loteNuevo)
  }
  console.log(tinglado1)
  localStorage.setItem("tinglado1", JSON.stringify(tinglado1))
}




//-------2 POSIBILIDADES DE QUE EXISTA ALGO O NO EN EL STORAGE-- POSSIBILITIES OF SOMETHING EXISTING OR NOT IN THE STORAGE-------//
if (localStorage.getItem("tinglado1")) {
  tinglado1 = JSON.parse(localStorage.getItem("tinglado1"));
} else {
  //console.log("seteamos por primera vez");
  cargarTinglado1()
}

//---------CAPTURANDO LET'S---CAPTURING LET'S----------//

let garajeDiv = document.getElementById("garaje");
let mostrarAutosBtn = document.getElementById("mostrarAutos");
let ocultarAutosBtn = document.getElementById("ocultarAutos");
let inputMarca = document.getElementById("marcaInput");
let inputModelo = document.getElementById("modeloInput");
let inputPrecio = document.getElementById("precioInput");

let inputBuscador = document.querySelector("#buscador");
let igualIgual = document.getElementById("igualIgual");
let selector = document.getElementById("selector");
let modalReservas = document.getElementById("modalReservas");
let botonReservas = document.getElementById("botonReservas");
let precioTotal = document.getElementById("precioTotal");
let btnFinReservar = document.getElementById("btnFinReservar");
let cargado = document.getElementById("cargado")
let cargador = document.getElementById("cargador")

// let autosReservados
// if(localStorage.getItem("carsreser")){
//   autosReservados = JSON.parse(localStorage.getItem("carsreser"))
// }else{
//   autosReservados = []
//   localStorage.setItem("carsreser", autosReservados)
// }
//REEEMPLAZANDO EL CODIGO DE ARRIBA CON OPERADOR OR
let autosReservados = JSON.parse(localStorage.getItem("carsreser")) || [];

//----------------FUNCIONES------------FUNCTIONS-----//


function verAutos(array) {
  garajeDiv.innerHTML = "";
  for (let Lote of array) {
    let tingladoSurDiv = document.createElement("div");
    tingladoSurDiv.className = "col-12 col-md-6 col-lg-4 my-2";
    tingladoSurDiv.innerHTML = `
    <div id="${Lote.id}" class="card" style="width: 18rem;">
              <img class="card-img-top img-fluid" style="height: 200px;"src="../imagenes/Alquiler/${Lote.imagen}" alt="">
              <div class="card-body">
                  <h4 class="card-title">${Lote.marca}</h4>
                  <p>Modelo: ${Lote.modelo}</p>
                  <p>Cm3: ${Lote.cilindrada}</p>
                  <p>Sobrealimentacion: ${Lote.sobrealimentacion}</p>
                  <p class="">Precio en:<strong> ${Lote.precio}</strong>USD por 24HS</p>
                  <button id="agregarBtn${Lote.id}" class="btn btn-outline-success">Reservar</button>
              </div>
          </div>
    `;
    garajeDiv.appendChild(tingladoSurDiv);
    let agregarBtn = document.getElementById(`agregarBtn${Lote.id}`);
    agregarBtn.onclick = () => {
      agregarReservas(Lote);
    };
  }
}

function reservaTotal(array) {
  //--------------ACUMULADOR CON REDUCE--------------ACCUMULATOR WITH REDUCER-----//
  let total = array.reduce(
    (acc, productreserv) => acc + productreserv.precio,
    0
  );
  console.log("acc con reduce" + total);
  //---------------OP TERNARIO------OP TERNARY--------------------//
  total == 0
    ? (precioTotal.innerHTML = `No hay reservas`)
    : (precioTotal.innerHTML = `El total es <strong>${total}</strong> USD`);
  return total;
}

function agregarReservas(Lote) {
  let caragregado = autosReservados.find((elem) => elem.id == Lote.id);
  if (caragregado == undefined) {
    console.log(`El vehiculo ${Lote.marca} ha sido reservado`);
    autosReservados.push(Lote);
    localStorage.setItem("carsreser", JSON.stringify(autosReservados));
    console.log(autosReservados);

    Swal.fire({
      title: "El vehiculo se agrego correctamente",
      icon: "success",
      confirmButtonColor: "#2c0303",
      imageUrl: `../imagenes/Alquiler/${Lote.imagen}`,
      imagenHeight: 100,
      imagenWidth: 50,
    });
  } else {
    Swal.fire({
      title: "Ya tienes agregado este elemento",
      icon: "info",
      timer: 2000,
      confirmButtonColor: "#2c0303",
    });
  }
}

function cargarReservas(array) {
  modalReservas.innerHTML = "";
  array.forEach((careservado) => {
    console.log(careservado.marca);
    modalReservas.innerHTML += `
  <div class="card" style="width: 18rem;">
  <div class="card-body" id = "cardReserva${careservado.id}">
  <img src="../imagenes/Alquiler/${careservado.imagen}" class="card-img-top" alt="...">
  <h4 class="card-title">${careservado.marca}</h4>
    <p class="card-text">Modelo: ${careservado.modelo}</p>
    <p class="card-text">Caracteristica: ${careservado.sobrealimentacion}</p>
    <p class="card-text">Valor: ${careservado.precio}</p>
    <button class= "btn btn-danger" id="botonEliminar${careservado.id}">Eliminar<i class="fas fa-trash-alt"></i></button>
  </div>
</div>
  `;
  });

  //------------------------SEGUNDO FOR EACH (AGREGAR FUNCION ELIMINAR)----SECOND FOR EACH (ADD DELETE FUNCTION)---------------//
  array.forEach((careservado) => {
    document
      .getElementById(`botonEliminar${careservado.id}`)
      .addEventListener("click", () => {
        console.log("btn eliminar funciona");

        //-------BORRAR DEL DOM----DELETE FROM SUN---------//
        let cardReserva = document.getElementById(
          `cardReserva${careservado.id}`
        );
        cardReserva.remove();

        //----------------ELIMINAR DEL ARRAY------DELETE FROM ARRAY------------------//
        //-----------BUSCAR ID A ELIMINAR--------SEARCH PROD TO DELETE-------------------//
        let eliminarReserva = array.find((Lote) => Lote.id == careservado.id);
        console.log(eliminarReserva);
        let posicion = array.indexOf(eliminarReserva);
        console.log(posicion);
        //SPLICE
        array.splice(posicion, 1);
        console.log(array);
        //---------SETEAR EL STORAGE-------SET THE STORAGE----------//
        localStorage.setItem("carsreser", JSON.stringify(array));
        //----------RECALCULAR EL PRECIO---------RECALCULATE THE PRICE---------------------//
        reservaTotal(array);
      });
  });
  reservaTotal(array);
}


//------------------------------ATENCION--------//

function buscarInfo(buscado, array) {
  //CONDICION COMPUESTA COINCIDENCIA TOTAL: (Lote.marca.toLowerCase() == buscado.toLowerCase() || Lote.modelo.toLowerCase() == buscado.toLowerCase() )
  let busquedaArray = array.filter(
    (Lote) =>
      Lote.marca.toLowerCase().includes(buscado) ||
      Lote.modelo.toLowerCase().includes(buscado) ||
      Lote.sobrealimentacion.toLowerCase().includes(buscado)
  );

  // if (busquedaArray.length == 0) {
  //   igualIgual.innerHTML = `<h2>No se encuetra el vehiculo solicitado</h2>`;
  //   verAutos(busquedaArray);
  // } else {
  //   igualIgual.innerHTML = "";
  //   verAutos(busquedaArray);
  // }

  //REEMPLAZANDO EL CODIGO DE ARRIBA POR UN OPERADOR TERNARIO (LA MISMA FUNCION PERO DISTINTO CODIGO)

  busquedaArray.length == 0
    ? ((igualIgual.innerHTML = `<h2>No se encuetra el vehiculo solicitado</h2>`),
      verAutos(busquedaArray))
    : ((igualIgual.innerHTML = ""), verAutos(busquedaArray));
}

function ordenarMenorMayor(array) {
  const menorMayor = [].concat(array);
  menorMayor.sort((param1, param2) => param1.precio - param2.precio);
  verAutos(menorMayor);
}

function ordenarMayorMenor(array) {
  const mayorMenor = [].concat(array);
  mayorMenor.sort((a, b) => b.cilindrada - a.cilindrada);
  verAutos(mayorMenor);
}

function ordenarAlfaMar(array) {
  const ordenadoAlfa = [].concat(array);
  ordenadoAlfa.sort((a, b) => {
    if (a.marca > b.marca) {
      return 1;
    }
    if (a.marca < b.marca) {
      return -1;
    }
    return 0;
  });
  verAutos(ordenadoAlfa);
}

function finalizarReserva(array) {
  Swal.fire({
    title: "¿Desea finalizar reserva?",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "No",
    confirmButtonColor: "green",
    cancelButtonColor: "red",
  }).then((result) => {
    if (result.isConfirmed) {
      let finReserva = reservaTotal(array);
      Swal.fire({
        title: "Reserva confirmada",
        icon: "success",
        confirmButtonColor: "green",
        text: `Su total es de: ${finReserva} USD por 24 hs, gracias por elejir FJR`,
      });
      //------RESETEAR EL ARRAY PARA VOLVER LAS RESERVAS A 0--------RESET THE ARRAY TO RETURN THE RESERVES TO 0-------//
      //---------nO fUnCiOnA
      autosReservados = [];
      localStorage.removeItem("carsreser");
    } else {
      Swal.fire({
        title: "Upss",
        icon: "info",
        text: "La reserva ha sido cancelada",
        confirmButtonColor: "green",
        timer: 2500,
      });
    }
  });
}

//----------------ADJUNTANDO EVENTOS--------------ATTACHING EVENTS--------------//

inputBuscador.addEventListener("input", () => {
  console.log(inputBuscador.value);
  buscarInfo(inputBuscador.value, tinglado1);
});

mostrarAutosBtn.onclick = function () {
  verAutos(tinglado1);
};





ocultarAutosBtn.addEventListener("dblclick", () => {
  garajeDiv.innerHTML = "";
});

selector.addEventListener("change", () => {
  if (selector.value == 1) {
    ordenarMenorMayor(tinglado1);
  } else if (selector.value == 2) {
    ordenarMayorMenor(tinglado1);
  } else if (selector.value == 3) {
    ordenarAlfaMar(tinglado1);
  } else {
    verAutos(tinglado1);
  }
});

botonReservas.addEventListener("click", () => {
  cargarReservas(autosReservados);
});

btnFinReservar.addEventListener("click", () => {
  finalizarReserva(autosReservados);
});

//SPREAD CON OBJETOS

//let superLote2 = {
 // ...Lote2,
  //Traccion: "Integral",
  //Combustible: "Etanol",
  //Alimentacion: "Biturbo",
//};

//console.log(superLote2);

//PRIMERA LIBRERIA

//LUXON
const DateTime = luxon.DateTime;
const fechaHoy = DateTime.now();
console.log(fechaHoy);



