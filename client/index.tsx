import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const clientId = "654983048583-9t56rgje9rnn7je6340oqi8kpvc1utp9.apps.googleusercontent.com";

export const cookieName_access_token = "g_a_t";
export const cookieName_name = "g_name";
export const cookieName_sub = "g_sub";

root.render(
  <>
    <GoogleOAuthProvider clientId={clientId}>
        <App></App>
    </GoogleOAuthProvider>
  </>
);

