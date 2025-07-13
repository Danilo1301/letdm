import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Vilubri from './Vilubri';
import Chamadas from './chamadas/Chamadas';
import NewTable from './chamadas/new/NewTable';
import ChamadaPage from './chamadas/chamada/ChamadaPage';
import NewDefault from './chamadas/new/NewDefault';
import NewProduct from './chamadas/chamada/newProduct/NewProduct';
import EditProduct from './chamadas/chamada/newProduct/EditProduct';
import CompareTable from './compareTable/CompareTable';
import SearchProducts from './searchProducts/SearchProducts';

function VilubriRoutes() {
    return (
        <Routes>
            <Route path="/vilubri" element={<Vilubri/>}></Route>

            <Route path="/vilubri/chamadas" element={<Chamadas/>}></Route>
            <Route path="/vilubri/compareTable" element={<CompareTable/>} />
            <Route path="/vilubri/searchProducts" element={<SearchProducts/>} />

            <Route path="/vilubri/chamadas/new" element={<NewDefault/>} />
            <Route path="/vilubri/chamadas/newTable" element={<NewTable/>} />
            <Route path="/vilubri/chamadas/:id" element={<ChamadaPage/>} />
            <Route path="/vilubri/chamadas/:id/product/new" element={<NewProduct/>} />
            <Route path="/vilubri/chamadas/:id/product/:productIndex/edit" element={<EditProduct/>} />
        </Routes>
    );
}

export default VilubriRoutes;