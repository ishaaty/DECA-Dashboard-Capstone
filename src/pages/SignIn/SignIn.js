import './SignIn.css';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function SignIn() {
    const { loginWithRedirect } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect();
    };

    return (
        <>
            <div>
                <div className="mainPg">
                    <img id="signinlogo" src="decaLogo.png" alt="DECA Logo Not Working" />
                </div>

                <div className="button-container">
                    <button id="signupbtn" onClick={handleLogin}><strong>Login</strong></button>
                </div>
            </div>
        </>
    );
}
