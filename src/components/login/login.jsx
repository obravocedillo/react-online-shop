import React, { Component } from 'react';
import './login-style.css';
import $ from 'jquery';
;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''

        };


        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
  }

    handleSubmit(event) {
        sessionStorage.setItem('email', this.state.email);

        

        event.preventDefault();

        $.ajax({
            url: "https://oliver45.000webhostapp.com/check_login.php",
            method: "POST",
            header: {
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Methods':"GET,PUT,POST,DELETE",
                'Access-Control-Allow-Headers': 'Content-Type'
             } ,
            data: {username: this.state.email, password: this.state.password},
            dataType: 'json',
            success:(respuesta)=> {
                 //eslint-disable-next-line
                if(respuesta.msg = "OK"){
                    this.props.history.push('/main')

                }
            },
            error:(respuesta)=>{



            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
  }

  render() {
    return (
      <div className="login-principal">

            <div className="login-formulario">

                <div className="titulo-login">
                    <h1 className="titulo"> Login </h1>
                </div>

                <form className="form" onSubmit={this.handleSubmit}>

                    <div className="container-form">

                        <div className="user-name">
                            <label htmlFor="email"><h2>Username</h2></label>
                        </div>

                        <div className="user-input">
                            <input type="text" placeholder="Enter Username" name="email" required value={this.state.email} onChange={this.handleInputChange}></input>
                        </div>

                        <div className="user-pass">
                            <label htmlFor="password"><h2>Password</h2></label>
                        </div>

                        <div className="pass-input">
                            <input type="password" placeholder="Enter Password" name="password" required value={this.state.password} onChange={this.handleInputChange}></input>
                        </div>

                        <div className="login-button">
                            <button type="submit">Login</button>
                        </div>


                    </div>

                </form>

            </div>

      </div>

    );
  }
}

export default Login;
