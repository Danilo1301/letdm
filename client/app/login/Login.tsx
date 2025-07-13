import React from 'react';
import { HomepageItemCardList } from '../home/components/HomepageItemCardList';
import { HomepageItem, HomepageItemCategory } from '../home/HomepageItem';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {

    const responseGoogle = (response: any) => {
        // Exemplo: pegar o token JWT
        const token = response?.credential || response?.tokenId;

        if (token) {
            // Salvar token
            localStorage.setItem('google_token', token);

            // Opcional: decodificar o token para pegar infos do usuário
            // usando uma lib como jwt-decode (https://www.npmjs.com/package/jwt-decode)
        }

        location.href = "/";
    };


    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ height: 'calc(100vh - 56px)' }}
            >
            
            <GoogleLogin
                onSuccess={responseGoogle}
            />
        </div>
    );
}

export default Login;