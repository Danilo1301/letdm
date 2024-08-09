import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/home/Home';
import MainNavbar from './components/MainNavbar';
import Projects from './pages/projects/Projects';
import GTASA from './pages/gtasa/GTASA';
import Mods from './pages/gtasa/mods/Mods';
import ModsAndroid from './pages/gtasa/mods/ModsAndroid';
import ModsPC from './pages/gtasa/mods/ModsPC';

function App() {
    return (
        <>
            <MainNavbar></MainNavbar>
            <BrowserRouter>
                <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/projects" element={<Projects/>}></Route>
                <Route path="/gtasa" element={<GTASA/>}></Route>
                <Route path="/gtasa/mods" element={<Mods/>}></Route>
                <Route path="/gtasa/mods/android" element={<ModsAndroid/>}></Route>
                <Route path="/gtasa/mods/pc" element={<ModsPC/>}></Route>
                
                {/*<Route path="/notes*" element={<Notes/>}></Route>*/}
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;