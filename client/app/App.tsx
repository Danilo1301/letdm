import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainNavbar from './components/MainNavbar';
import Home from './home/Home';
import Projects from './projects/Projects';
import GTASA from './gtasa/GTASA';
import Mods from './gtasa/mods/Mods';
import ModsAndroid from './gtasa/mods/ModsAndroid';
import ModsPC from './gtasa/mods/ModsPC';
import Suggestions from './gtasa/suggestions/Suggestions';
import { defaultUserInfo, UserInfo, UserInfoContext } from './components/UserInfo';
import { getCookie } from '../components/cookies';
import { cookieName_access_token } from '..';

import './App.css';
import './Vilubri.css';
import EditSuggestion from './gtasa/suggestions/EditSuggestion';
import NewSuggestion from './gtasa/suggestions/NewSuggestion';
import SuggestionsData from './gtasa/suggestions/SuggestionsData';
import Key from './key/Key';
import Tutorials from './gtasa/tutorials/Tutorials';
import Data from './data/Data';
import Vilubri from './vilubri/Vilubri';
import VilubriRoutes from './vilubri/VilubriRoutes';
import { SidebarProvider } from './components/Sidebar';
import { UserProvider } from './components/User';
import Login from './login/Login';
import Account from './account/Account';
import GtasaRoutes from './gtasa/GtasaRoutes';

const App: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);

    const updateUserInfo = (newUserInfo: Partial<UserInfo>) => {
        setUserInfo((prevUserInfo) => {
            return { ...prevUserInfo, ...newUserInfo };
        });
    };

    return (
        <>
            <UserProvider>
                <SidebarProvider>
                    <MainNavbar></MainNavbar>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home/>}></Route>
                            <Route path="/login" element={<Login/>}></Route>
                            <Route path="/account" element={<Account/>}></Route>
                            
                            <Route path="/projects" element={<Projects/>}></Route>

                            <Route path="/suggestions" element={<Suggestions/>}></Route>
                            <Route path="/suggestions/:id/edit" element={<EditSuggestion/>}></Route>
                            <Route path="/suggestions/new" element={<NewSuggestion/>}></Route>
                            <Route path="/suggestions/data" element={<SuggestionsData/>}></Route>
                            <Route path="/key" element={<Key/>}></Route>
                            <Route path="/data" element={<Data/>}></Route>
                        </Routes>

                        <GtasaRoutes />
                        <VilubriRoutes />
                        
                    </BrowserRouter>
                </SidebarProvider>
            </UserProvider>
        </>
    );
}

export default App;