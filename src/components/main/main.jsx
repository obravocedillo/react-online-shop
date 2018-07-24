import React, { Component } from 'react';
import { Route } from 'react-router';
import { BrowserRouter as Router} from "react-router-dom";
import  Login  from '../login/login';
import Tienda from '../tienda/tienda'
import Basket from '../basket/basket'
import './main-style.css';
var firebase = require('firebase');

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {

        };

        var config = {
            apiKey: "AIzaSyDlXmaokSwKags4hoJzsUd2Wr3Ffa-7PHI",
            authDomain: "app-mark45.firebaseapp.com",
            databaseURL: "https://app-mark45.firebaseio.com",
            projectId: "app-mark45",
            storageBucket: "app-mark45.appspot.com",
            messagingSenderId: "633445577020"
        };
        firebase.initializeApp(config);

    }




  render() {
    return (
      <div className="parte-principal">

        <Router>


                <div className="contenedor-principal">


                        <Route exact path="/" component={Login}/>
                        <Route path='/main' component={Tienda}/>
                        <Route path='/basket' component={Basket}/>



                </div>


        </Router>

      </div>
    );
  }
}

export default Main;
