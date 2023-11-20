import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/home/Home';
import MainNavbar from './components/MainNavbar';

function App() {
    return (
        <>
            <MainNavbar></MainNavbar>
            <BrowserRouter>
                <Routes>
                <Route path="/" element={<Home/>}></Route>
                
                {/*<Route path="/notes*" element={<Notes/>}></Route>*/}
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;