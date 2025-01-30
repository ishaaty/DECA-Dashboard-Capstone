import './SignIn.css';
import Header from '../../components/Header/Header'

import React from 'react';


export default function SignIn() {

    return (
        <>
        <div>
    </div>
            <Header />
            <div>
                <img src="decaLogo.png" alt="decaLogoNotWorking"></img>
            </div>
            <div class="button-container">
                <a href="/login" id="signupbtn"><strong>Login</strong></a>
                <a href="/logout" id="loginbtn"><strong>Logout</strong></a>
            </div>
        </>
    )
}