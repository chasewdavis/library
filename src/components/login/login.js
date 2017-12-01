import React, { Component } from 'react';
// import './login.css'

export default class Login extends Component {

    constructor(props) {
        super(props);
        
    }

    render(){
        return (
            <div>
                <a href={ process.env.REACT_APP_LOGIN }>sign in</a>
                <br/>
                <a href={ process.env.REACT_APP_LOGIN }>register</a>
            </div>
        )
    }

}