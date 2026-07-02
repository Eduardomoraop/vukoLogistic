import React from "react";
import { NavLink } from "react-router-dom";

// Iconos SVG en línea para evitar dependencias extras y asegurar compatibilidad
const icons = {
  dashboard: (
    <svg
      className="w-5 h-5 mr-3 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
      />
    </svg>
  ),
  inventario: (
    <svg
      className="w-5 h-5 mr-3 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  movimientos: (
    <svg
      className="w-5 h-5 mr-3 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4-4m-4 4l4 4"
      />
    </svg>
  ),
  reportes: (
    <svg
      className="w-5 h-5 mr-3 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
      />
    </svg>
  ),
  configuracion: (
    <svg
      className="w-5 h-5 mr-3 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  kpis: (
    <svg
      className="w-5 h-5 mr-3 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
      />
    </svg>
  ),
};

const navItems = [
  { label: "Dashboard", path: "/", iconKey: "dashboard" },
  { label: "Inventario", path: "/inventario", iconKey: "inventario" },
  { label: "Movimientos", path: "/movimientos", iconKey: "movimientos" },
  { label: "Reportes", path: "/reportes", iconKey: "reportes" },
  { label: "Configuración", path: "/configuracion", iconKey: "configuracion" },
  { label: "KPIs", path: "/kpis", iconKey: "kpis" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 min-h-screen flex flex-col shadow-2xl border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-500/25">
            V
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">
              Vuko<span className="text-teal-400 font-semibold">Logistic</span>
            </h1>
            <p className="text-slate-400 text-[10px] mt-1 font-medium tracking-wider uppercase">
              ERP de Gestión
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20 translate-x-1"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 hover:translate-x-0.5"
              }`
            }
          >
            {icons[item.iconKey]}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <p className="text-slate-400 text-xs font-semibold">Sistema Online</p>
        </div>
        <p className="text-slate-500 text-[10px] font-mono">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
