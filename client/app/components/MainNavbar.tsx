import React, { useContext, useEffect, useState } from 'react';

import { Menu, UserCircle, X } from 'lucide-react';
import { Container, Navbar } from 'react-bootstrap';
import Sidebar, { useSidebar } from './Sidebar';
import { useUser } from './User';


const MainNavbar: React.FC = () => {
    
    const { isOpen, closeSidebar, openSidebar } = useSidebar();
    const { user, isLoggedIn, logout, hasInitialized } = useUser();

    const handleClickUser = () => {

        if(!isLoggedIn)
        {
            location.href = "/login";
        } else {
            location.href = "/account";
        }
    }

    const handleToggleSidebar = () =>
    {
        openSidebar();
    }

    if(!hasInitialized) return <></>;

    let userName = <>
        <a className='btn btn-light'>Fazer login</a>
    </>;

    if(isLoggedIn && user)
    {
        userName = <span style={{color: 'white'}}>{user.name}</span>
    }

    // const userName = <>
    //     <span style={{color: 'white'}}>Danilo</span>
    // </>;

    return (
        <>
            <Sidebar></Sidebar>
            <Navbar expand="lg" className="shadow-sm px-3">
                <Container fluid className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <button onClick={handleToggleSidebar} className="btn btn-link p-0 me-3">
                            <Menu size={24} color='white' />
                        </button>
                        <a href='/' className='navbar-title d-flex align-items-center border-0 bg-transparent p-0'>
                            <img src="/logo.png" alt="Logo" width="32" height="32" className="me-2" />
                            <span className="fw-semibold fs-5">Danilo1301</span>
                        </a>
                    </div>
                    <button className="d-flex align-items-center border-0 bg-transparent p-0" onClick={handleClickUser}>
                        <div className="me-2">{userName}</div>
                        <UserCircle size={28} className="text-secondary" />
                    </button>
                </Container>
            </Navbar>
        </>
    );
}

export default MainNavbar;