import React, { Component } from 'react';
import './tienda-style.css';
import $ from 'jquery';





class Tienda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objetos: [],
            carrito: 0,
            email: sessionStorage.getItem('email'),
            comprados: 0



        };

            this.actualizarCarrito = this.actualizarCarrito.bind(this);
            this.submitCarrito = this.submitCarrito.bind(this);



              $.ajax({
                  url: "https://oliver45.000webhostapp.com/obtener_tienda.php",
                  method: "POST",
                  header: {
                      'Access-Control-Allow-Origin':"*",
                      'Access-Control-Allow-Methods':"GET,PUT,POST,DELETE",
                      'Access-Control-Allow-Headers': 'Content-Type'
                   } ,
                   dataType: 'json',
                  data: {username:this.state.email},
                  success:(respuesta)=> {

                      if(respuesta.msg === "OK"){

                          for(let i=0; i<respuesta.objetos.length;i++){

                              //this.state.objetos.push(respuesta.objetos[i]);
                              this.setState({
                                  objetos: this.state.objetos.concat([respuesta.objetos[i]])
                              })
                          }

                          this.state.comprados = 0;

                      }else{
                          alert("Error del servidor");
                      }


                  }
              });
    }

    actualizarCarrito(event){
        event.preventDefault();
        const target = event.target;
        const value = target.value;


        this.setState({
            comprados: value
        });



        event.preventDefault();
    }


    submitCarrito(event){

        event.preventDefault();

        var tempId;
        var tempPrecio;
        var tempCantidad;
        var tempNombre;
        var tempImagen;

        var nombreCurrentId = event.target.id;


        for(let i=0; i<this.state.objetos.length; i++){
            if(this.state.objetos[i].nombre === nombreCurrentId){

                tempPrecio = this.state.objetos[i].precio;
                tempNombre = this.state.objetos[i].nombre;
                tempImagen = this.state.objetos[i].imagen;
                tempId = this.state.objetos[i].id;
                tempCantidad = event.target[1].valueAsNumber;
            }
        }

        console.log(tempId);
        console.log(tempImagen);
        console.log(tempNombre);
        console.log(tempPrecio);
        console.log(tempCantidad)

        $.ajax({
            url: "https://oliver45.000webhostapp.com/agregar_carrito.php",
            method: "POST",
            header: {
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Methods':"GET,PUT,POST,DELETE",
                'Access-Control-Allow-Headers': 'Content-Type'
             } ,
             dataType: 'json',
            data: {
                username: this.state.email,
                id: tempId,
                precio: tempPrecio,
                cantidad: this.state.comprados,
                nombre: tempNombre,
                imagen: tempImagen
            },
            success:(respuesta)=> {
                this.setState({
                    carrito: parseInt(this.state.carrito,10) + parseInt(this.state.comprados,10)
                })


            }

        });


    }




  render() {


      const accordionChildren = [];

        this.state.objetos.forEach((element)=>{

            accordionChildren.push(
                <div className="card">
                    <img src={element.imagen} alt="Avatar" className="imagen-carta"/>
                    <div className="container">
                        <h4><b className="name-card">{element.nombre}</b></h4>
                        <p>Restantes: {element.cantidad}</p>
                        <p className="precio">Precio: {element.precio}</p>
                        <div className="comprar">
                        <form onSubmit={(e) => {this.submitCarrito(e)}} id={element.nombre}>
                            <button type="submit">Comprar</button>
                            <input type="number" placeholder="cantidad a comprar"  min="0"          max={element.cantidad}  onChange={this.actualizarCarrito} />
                        </form>
                        </div>
                    </div>
                </div>
            );
        })






    return (
      <div className="principal-tienda">

            <div className="navegacion">
                <ul>
                    <li ><a>El mercado fresco</a></li>
                    <li className="nav"><a href="/"><i className="fa fa-sign-out"></i></a></li>
                    <li className="nav"><a href="/basket"><i className="fa fa-shopping-cart"><label className="badge badge-warning">{this.state.carrito}</label></i></a></li>
                    <li className="nav"><a className="active" href="/main"><i className="fa fa-th"></i></a></li>

                </ul>
            </div>

            <div className="tienda-completo">

                <div className="superior-tienda">

                    <div className="titulo">
                        <h1> Catalogo de Productos </h1>
                    </div>

                    <div className="busqueda">
                        <form className="buscador" >
                            <h2>Qué estas buscando</h2>
                            <input type="text" placeholder="Search.." name="search"/>

                        </form>
                    </div>

                </div>
                <hr/>
                <div className="central-tienda">

                    {accordionChildren}

                </div>


        </div>


      </div>

    );
  }


}

export default Tienda;
