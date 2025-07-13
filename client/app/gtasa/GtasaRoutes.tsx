import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ModsMobile from './mobile/Mods';
import ModsPC from './pc/Mods';
import GTASA from './GTASA';
import Patterns from './patterns/Patterns';

const GtasaRoutes = () => (
  <Routes>
    <Route path="/gtasa" element={<GTASA />} />
    <Route path="/gtasa/patterns" element={<Patterns />} />
    <Route path="/gtasa/mobile/mods" element={<ModsMobile />} />
    <Route path="/gtasa/pc/mods" element={<ModsPC />} />
  </Routes>
);

export default GtasaRoutes;