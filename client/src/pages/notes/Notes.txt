import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import NotePage from './NotePage';


const Notes: React.FC = () => {
    
    return (
        <>
           <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<NotePage />} />
            </Routes>
        </>
    );
};



export default Notes;