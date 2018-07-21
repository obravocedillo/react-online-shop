import React, { Component } from 'react';
import './basket-style.css';
import $ from 'jquery';

class Basket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objetos: [],
            carrito: 0,
            email: sessionStorage.getItem('email'),
            total: 0

        };

        this.pagar = this.pagar.bind(this);
        this.cancelar = this.cancelar.bind(this);

        $.ajax({
            url: "https://oliver45.000webhostapp.com/obtener_carrito.php",
            method: "POST",
            header: {
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Methods':"GET,PUT,POST,DELETE",
                'Access-Control-Allow-Headers': 'Content-Type'
             } ,
             dataType: 'json',
            data: {username: this.state.email},
            success:(respuesta)=> {

                if(respuesta.msg === "OK"){

                    for(let i=0; i<respuesta.objetos.length;i++){

                        this.setState({
                            objetos: this.state.objetos.concat([respuesta.objetos[i]]),
                            total: this.state.total + parseInt(respuesta.objetos[i].subtotal,10)
                        })
                    }

                    this.state.comprados = 0;

                }else{
                    alert("Error del servidor");
                }


            }
        });


    }

    cancelar(event){
        $.ajax({
            url: "https://oliver45.000webhostapp.com/cancelar_carrito.php",
            method: "POST",
            header: {
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Methods':"GET,PUT,POST,DELETE",
                'Access-Control-Allow-Headers': 'Content-Type'
             } ,
             dataType: 'json',
            data: {username: this.state.email},
            success:(respuesta)=> {

                if(respuesta.msg === "OK"){

                this.comprados = 0;
                this.props.history.push('/main')

                }else{
                    alert("Error del servidor");

                }
            }
        });

      }

      pagar(event){
          $.ajax({
              url: "https://oliver45.000webhostapp.com/pagar_carrito.php",
              method: "POST",
              header: {
                  'Access-Control-Allow-Origin':"*",
                  'Access-Control-Allow-Methods':"GET,PUT,POST,DELETE",
                  'Access-Control-Allow-Headers': 'Content-Type'
               } ,
               dataType: 'json',
              data: {
                  username: this.state.email,
                  objetos: this.state.objetos
              },
              success:(respuesta)=> {

                  if(respuesta.msg === "OK"){
                      this.props.history.push('/main')
                      this.comprados = 0;

                  }else{
                      alert("Error del servidor");

                  }
              }
          });

      }

  render() {

      const accordionChildren = [];

        this.state.objetos.forEach((element)=>{

            accordionChildren.push(
                <div className="card-grande">
                    <img src={element.imagen} alt="Avatar" className="imagen-pequeña"/>
                    <div className="container">
                        <h4><b className="name-card">{element.nombre}</b></h4>
                        <p className="precio">Precio: {element.precio}</p>
                        <p className="precio">cantidad: {element.cantidad}</p>
                        <p className="precio">Sub Total: {element.subtotal}</p>
                    </div>
                    <hr className="division-card"/>
                </div>

            );
        })

    return (
        <div className="principal-carrito">

              <div className="navegacion">
                  <ul>
                      <li ><a>El mercado fresco</a></li>
                      <li className="nav"><a href="/"><i className="fa fa-sign-out"></i></a></li>
                      <li className="nav"><a href="/basket"><i className="fa fa-shopping-cart"><label className="badge badge-warning">{this.state.carrito}</label></i></a></li>
                      <li className="nav"><a className="active" href="/main"><i className="fa fa-th"></i></a></li>

                  </ul>
              </div>

            <div className="parte-central">
                    <div className="titulo-carrito">
                        <h1>Carrito de Compras </h1>
                    </div>

                    <hr/>

                    <div className="body-carrito">

                        <div className="carrito">
                            {accordionChildren}
                        </div>

                        <div className="pagar-cancelar">
                            <h2>Total:{" $"+this.state.total}</h2>
                            <button className="cancelar-boton" onClick={(e) => {this.cancelar(e)}}>Cancelar</button>
                            <button className="pagar-boton" onClick={(e) => {this.pagar(e)}}>Pagar</button>
                        </div>


                    </div>

              </div>





          </div>




    );
  }
}

export default Basket;
