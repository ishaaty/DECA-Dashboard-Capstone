import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App/App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
const redirectUri = window.location.origin + "/callback";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
  domain={domain}
  clientId={clientId}
  authorizationParams={{
    redirect_uri: redirectUri,
    audience: audience,
  }}
  useRefreshTokens={true}
  cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
);

reportWebVitals();
