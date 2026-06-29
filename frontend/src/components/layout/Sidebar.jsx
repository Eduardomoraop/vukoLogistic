const navItems = [
  { label: 'Dashboard', active: true },
  { label: 'Inventario', active: false },
  { label: 'Movimientos', active: false },
  { label: 'Reportes', active: false },
  { label: 'Configuracion', active: false },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          Vuko<span className="text-teal-400">Logistic</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">Sistema de Gestion</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
              item.active
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
