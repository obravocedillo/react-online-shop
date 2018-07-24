import React, { Component } from 'react';
import './tienda-style.css';
var firebase = require('firebase');








class Tienda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objetos: [],
            carrito: 0,
            userId: sessionStorage.getItem('id'),
            comprados: 0,
            busqueda:''




        };

            this.actualizarCarrito = this.actualizarCarrito.bind(this);
            this.submitCarrito = this.submitCarrito.bind(this);
            this.buscador = this.buscador.bind(this);


            var tienda = firebase.database().ref('tienda');

            tienda.on('child_added', (snapshot) => {

              this.setState({
                  objetos: this.state.objetos.concat(snapshot.val())

              })

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
        var objetoCarrito;
        var tempRestantes;



        var nombreCurrentId = event.target.id;


        for(let i=0; i<this.state.objetos.length; i++){
            if(this.state.objetos[i].nombre === nombreCurrentId){

                tempPrecio = this.state.objetos[i].precio;
                tempNombre = this.state.objetos[i].nombre;
                tempImagen = this.state.objetos[i].imagen;
                tempId = this.state.objetos[i].id_objeto;
                tempRestantes = this.state.objetos[i].cantidad;
                tempCantidad = event.target[1].valueAsNumber;

                 objetoCarrito = {
                    user_id: this.state.userId,
                    producto: tempNombre,
                    producto_id: tempId,
                    precio: tempPrecio,
                    cantidad: tempCantidad,
                    imagen: tempImagen,
                    subTotal: parseInt(tempPrecio,10)*parseInt(tempCantidad,10),
                    restantes:tempRestantes
                };






            }
        }


        this.setState({
            carrito: parseInt(this.state.carrito,10) + parseInt(this.state.comprados,10)

        });


        sessionStorage.setItem('carrito', this.state.carrito);


        var basket = firebase.database().ref("basket");
        basket.push(objetoCarrito);

    }

    buscador(event){

        event.preventDefault();
        this.state.objetos = [];

        const target = event.target;
        const value = target.value;
        

        this.setState({
            busqueda: value
        });
            var tienda = firebase.database().ref('tienda');
            tienda.orderByChild('nombre').startAt(value).endAt(value+"\uf8ff").on('value',  (snapshot) => {

                snapshot.forEach((dato)=>{
                    this.state.objetos.push(dato.val());
                })

                console.log(this.state.objetos);

            }
        )


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
                            <input type="number" placeholder="cantidad a comprar"  min="0" max={element.cantidad}  onChange={this.actualizarCarrito} />
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
                            <input type="text" placeholder="Search.."  value={this.state.busqueda} onChange={this.buscador}/>

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
