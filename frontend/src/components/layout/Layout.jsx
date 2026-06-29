import React from 'react';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />
      
      {/* Contenido dinámico a la derecha */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;