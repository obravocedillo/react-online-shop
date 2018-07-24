import React, { Component } from 'react';
import './basket-style.css';

var firebase = require('firebase');

class Basket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objetos: [],
            carritoId:[],
            carrito:  sessionStorage.getItem('carrito'),
            currentId: sessionStorage.getItem('id'),
            total: 0,


        };

        this.pagar = this.pagar.bind(this);
        this.cancelar = this.cancelar.bind(this);



        var basket = firebase.database().ref("basket");
        basket.orderByChild("user_id").equalTo(this.state.currentId).on('value', (snapshot) => {



            try{
                this.setState({
                    carritoId: this.state.carritoId.concat(Object.keys(snapshot.val()))
                })
            }catch(err){

            }






          snapshot.forEach ( (data) => {

              this.setState({
                  objetos: this.state.objetos.concat(data.val()),
                  total: this.state.total + parseInt(data.val().subTotal,10)

              })

        });



        });


    }

    cancelar(event){

        for(var i=0; i<this.state.carritoId.length; i++){
            var basket = firebase.database().ref("basket");
            basket.child(this.state.carritoId[i]).remove();



        }
        this.setState({
            carrito: 0
        })
        this.props.history.push('/main')




      }

      pagar(event){
          this.state.objetos.forEach((objeto)=>{
              var restantes = parseInt(objeto.restantes,10)-parseInt(objeto.cantidad,10)
              var tienda = firebase.database().ref("tienda/"+objeto.producto);
              tienda.update({ cantidad: restantes });
          })



          for(var i=0; i<this.state.carritoId.length; i++){
              var basket = firebase.database().ref("basket");
              basket.child(this.state.carritoId[i]).remove();

          }

          this.setState({
              carrito: 0
          })
          this.props.history.push('/main')

        

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
                        <p className="precio">Sub Total: {element.subTotal}</p>
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
