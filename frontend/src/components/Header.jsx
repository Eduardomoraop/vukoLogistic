const Header = ({ onNewEntry, onNewExit }) => {
  return (
    <header className="mb-10 p-6 bg-white rounded-2xl shadow-lg border-l-8 border-teal-600 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          VukoLogistic ERP
        </h1>
        <p className="text-slate-600 mt-1">
          Panel de Control - Inventario Actual
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onNewEntry}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow transition-all duration-150"
        >
          Nueva Entrada
        </button>
        <button
          onClick={onNewExit}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow transition-all duration-150"
        >
          Nueva Salida
        </button>
      </div>
    </header>
  );
};

export default Header;
