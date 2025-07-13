import React from 'react';
import { useUser } from '../components/User';

function Account() {
    
    const { user, isLoggedIn, hasInitialized, logout } = useUser();

    const handleLogout = () => {

        logout();
        location.href = "/login";
    }

    if(!hasInitialized)
    {
        return <></>;
    }

    if(!isLoggedIn)
    {
        location.href = "/login";
        return;
    }

    return (
        <div className='container mt-2'>
            <div>
                <button className='btn btn-primary' onClick={handleLogout}>Deslogar</button>
            </div>
        </div>
    );
}

export default Account;