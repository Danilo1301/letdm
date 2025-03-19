import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Vilubri from './Vilubri';
import Chamadas from './chamadas/Chamadas';
import NewChamada from './chamadas/newChamada/NewChamada';
import ChamadaPage from './chamadas/chamadaPage/ChamadaPage';
import { ThemeJSON } from '../../../src/vilubri/Theme';
import { defaultTheme, ThemeContext } from './chamadas/chamadaPage/ColorSettings';
import EditProduct from './chamadas/newProduct/EditProduct';
import NewProduct from './chamadas/newProduct/NewProduct';
import CompareTable from './compareTable/CompareTable';

function VilubriRoutes() {
    return (
        <Routes>
            <Route path="/vilubri" element={<Vilubri/>}></Route>

            <Route path="/vilubri/chamadas" element={<Chamadas/>}></Route>
            <Route path="/vilubri/chamadas/new" element={<NewChamada/>} />
            <Route path="/vilubri/chamadas/:id/product/:productIndex/edit" element={<EditProduct/>} />
            <Route path="/vilubri/chamadas/:id/product/new" element={<NewProduct/>} />
            <Route path="/vilubri/chamadas/:id" element={<ChamadaPage/>} />

            <Route path="/vilubri/compareTable" element={<CompareTable/>} />
        </Routes>
    );
}

export default VilubriRoutes;