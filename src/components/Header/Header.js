import React from 'react';
import { useAuth0 } from '@auth0/auth0-react'; 
import './Header.css';

export default function Header() {
    const { logout } = useAuth0();

    return (
        <header className="header">
            <div className="header-logo-container">
                <img src="/decaImg.png" alt="Logo" className="header-logo" />
            </div>
            <nav className="header-nav">
                <a href="home" className="header-link home-link">Home</a>
                <a href="about" className="header-link about-link">About</a>
                <a href="user" className="header-link user-link">User</a>
                {/* Logout button */}
                <span className="header-link logout-link" onClick={() => logout({ returnTo: window.location.origin })}>
                    Logout
                </span>
            </nav>
        </header>
    );
}
