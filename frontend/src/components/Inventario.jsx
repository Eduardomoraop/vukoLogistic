import React, { useState, useEffect } from "react";
import { getItems } from "../services/api";

const mockItems = [
  { id: 1, codigo_referencia: "REF-4502", descripcion: "Teclados Mecánicos RGB", tipo_unidad: "Caja", stock_actual: 125, ubicacion_almacen: "Estantería A-3" },
  { id: 2, codigo_referencia: "REF-1092", descripcion: "Monitores UltraWide 34\"", tipo_unidad: "Contenedor", stock_actual: 6, ubicacion_almacen: "Muelle 1" },
  { id: 3, codigo_referencia: "REF-8831", descripcion: "Sillas Ergonómicas Premium", tipo_unidad: "Pallet", stock_actual: 8, ubicacion_almacen: "Zona B-Pallets" },
  { id: 4, codigo_referencia: "REF-0021", descripcion: "Cables HDMI 2.1 de Alta Velocidad", tipo_unidad: "Caja", stock_actual: 45, ubicacion_almacen: "Estantería A-4" },
  { id: 5, codigo_referencia: "REF-7742", descripcion: "Mouse Gamer Inalámbrico", tipo_unidad: "Caja", stock_actual: 320, ubicacion_almacen: "Pasillo C-2" },
];

const Inventario = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    codigo_referencia: "",
    descripcion: "",
    tipo_unidad: "Caja",
    stock_actual: "",
    ubicacion_almacen: ""
  });

  useEffect(() => {
    getItems()
      .then((data) => {
        if (data && data.length > 0) setItems(data);
        else setItems(mockItems);
      })
      .catch(() => setItems(mockItems))
      .finally(() => setLoading(false));
  }, []);

  const typeBadge = (tipo) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase";
    switch (tipo) {
      case "Pallet":
        return <span className={`${base} bg-amber-50 text-amber-700 border border-amber-200/50`}>{tipo}</span>;
      case "Contenedor":
        return <span className={`${base} bg-sky-50 text-sky-700 border border-sky-200/50`}>{tipo}</span>;
      default:
        return <span className={`${base} bg-slate-50 text-slate-700 border border-slate-200/50`}>{tipo}</span>;
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const stock = parseInt(newItem.stock_actual);
    if (!newItem.codigo_referencia || !newItem.descripcion || isNaN(stock)) return;

    const itemToAdd = {
      id: Date.now(),
      codigo_referencia: newItem.codigo_referencia.toUpperCase(),
      descripcion: newItem.descripcion,
      tipo_unidad: newItem.tipo_unidad,
      stock_actual: stock,
      ubicacion_almacen: newItem.ubicacion_almacen || "Sin ubicar"
    };

    setItems([...items, itemToAdd]);
    setShowAddModal(false);
    setNewItem({
      codigo_referencia: "",
      descripcion: "",
      tipo_unidad: "Caja",
      stock_actual: "",
      ubicacion_almacen: ""
    });
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta referencia del inventario?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo_referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ubicacion_almacen.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "todos" || item.tipo_unidad.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Inventario</h2>
          <p className="text-slate-600 mt-1">Administra referencias, stock y ubicaciones de almacén.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-lg shadow-teal-600/15 transition flex items-center space-x-2 self-start sm:self-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Referencia</span>
        </button>
      </div>

      {/* Tarjeta de Filtros */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por referencia, descripción o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-slate-700"
          />
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filtrar Unidad:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none text-slate-700 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-white"
          >
            <option value="todos">Todos los Tipos</option>
            <option value="caja">Cajas</option>
            <option value="pallet">Pallets</option>
            <option value="contenedor">Contenedores</option>
          </select>
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-500">Cargando catálogo...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No se encontraron productos coincidentes.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Referencia</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo Unidad</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Actual</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación Almacén</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-slate-700">{item.codigo_referencia}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{item.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{typeBadge(item.tipo_unidad)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center text-sm font-bold ${
                        item.stock_actual < 10 ? "text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100" : "text-slate-900"
                      }`}>
                        {item.stock_actual}
                        {item.stock_actual < 10 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-1.5 animate-ping"></span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.ubicacion_almacen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-rose-600 hover:text-rose-800 font-bold hover:underline transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Nueva Referencia */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden transform scale-100 transition-all">
            <div className="p-6 border-b text-white bg-teal-600 flex items-center justify-between">
              <h3 className="text-lg font-bold">Agregar Nueva Referencia</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:opacity-85 text-lg font-bold">✕</button>
            </div>
            
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Código de Referencia</label>
                <input
                  type="text"
                  placeholder="REF-9999"
                  required
                  value={newItem.codigo_referencia}
                  onChange={(e) => setNewItem({ ...newItem, codigo_referencia: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej. Lector Código Barras"
                  required
                  value={newItem.descripcion}
                  onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tipo Unidad</label>
                  <select
                    value={newItem.tipo_unidad}
                    onChange={(e) => setNewItem({ ...newItem, tipo_unidad: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 bg-white"
                  >
                    <option value="Caja">Caja</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Contenedor">Contenedor</option>
                    <option value="Unidad">Unidad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="0"
                    value={newItem.stock_actual}
                    onChange={(e) => setNewItem({ ...newItem, stock_actual: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ubicación en Almacén</label>
                <input
                  type="text"
                  placeholder="Ej. Estantería B-12"
                  value={newItem.ubicacion_almacen}
                  onChange={(e) => setNewItem({ ...newItem, ubicacion_almacen: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-lg text-sm font-semibold shadow transition"
                >
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;
