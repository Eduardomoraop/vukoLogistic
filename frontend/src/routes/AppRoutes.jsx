import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard.jsx';
import Inventario from '../components/Inventario.jsx';
import Movimientos from '../components/Movimientos.jsx';
import Reportes from '../components/Reportes.jsx';
import Configuracion from '../components/Configuracion.jsx';
import Kpis from '../components/Kpis.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/inventario" element={<Inventario />} />
    <Route path="/movimientos" element={<Movimientos />} />
    <Route path="/reportes" element={<Reportes />} />
    <Route path="/configuracion" element={<Configuracion />} />
    <Route path="/kpis" element={<Kpis />} />
  </Routes>
);

export default AppRoutes;
