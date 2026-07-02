import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import InventoryTable from "./InventoryTable.jsx";
import { getItems, createMovement } from "../services/api";

const mockItems = [
  { id: 1, codigo_referencia: "REF-4502", descripcion: "Teclados Mecánicos RGB", tipo_unidad: "Caja", stock_actual: 125, ubicacion_almacen: "Estantería A-3" },
  { id: 2, codigo_referencia: "REF-1092", descripcion: "Monitores UltraWide 34\"", tipo_unidad: "Contenedor", stock_actual: 6, ubicacion_almacen: "Muelle 1" },
  { id: 3, codigo_referencia: "REF-8831", descripcion: "Sillas Ergonómicas Premium", tipo_unidad: "Pallet", stock_actual: 8, ubicacion_almacen: "Zona B-Pallets" },
  { id: 4, codigo_referencia: "REF-0021", descripcion: "Cables HDMI 2.1 de Alta Velocidad", tipo_unidad: "Caja", stock_actual: 45, ubicacion_almacen: "Estantería A-4" },
  { id: 5, codigo_referencia: "REF-7742", descripcion: "Mouse Gamer Inalámbrico", tipo_unidad: "Caja", stock_actual: 320, ubicacion_almacen: "Pasillo C-2" },
];

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("entrada"); // "entrada" o "salida"
  
  // Estado del formulario del modal
  const [form, setForm] = useState({
    referencia: "",
    cantidad: "",
    tipo_unidad: "Caja",
    descripcion: "",
    ubicacion: "Estantería A-3"
  });

  const [message, setMessage] = useState(null);

  const fetchItems = () => {
    setLoading(true);
    getItems()
      .then((data) => {
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(mockItems);
        }
      })
      .catch((err) => {
        console.warn("Backend no disponible. Usando datos simulados.", err);
        setItems(mockItems);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // KPIs
  const totalItems = items.length;
  const totalStock = items.reduce((acc, curr) => acc + curr.stock_actual, 0);
  const lowStockCount = items.filter(item => item.stock_actual < 10).length;
  const categoriesCount = new Set(items.map(item => item.tipo_unidad)).size;

  const handleOpenModal = (type) => {
    setModalType(type);
    // Resetear formulario con una referencia por defecto o vacía
    setForm({
      referencia: items[0]?.codigo_referencia || "REF-4502",
      cantidad: "10",
      tipo_unidad: "Caja",
      descripcion: "",
      ubicacion: "Estantería A-3"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = parseInt(form.cantidad);
    if (isNaN(qty) || qty <= 0) return;

    const payload = {
      codigo_referencia: form.referencia,
      tipo_movimiento: modalType === "entrada" ? "ENTRADA" : "SALIDA",
      cantidad: qty,
      descripcion: form.descripcion || `${modalType.toUpperCase()} manual de stock`
    };

    try {
      // Intentamos llamar a la API
      await createMovement(payload);
      setMessage({ type: "success", text: `Movimiento de ${modalType} registrado exitosamente en base de datos.` });
      fetchItems(); // Recargar datos
    } catch (err) {
      console.warn("Error API, actualizando estado de forma local:", err);
      // Fallback local: actualizamos el stock de los items en memoria
      const updatedItems = items.map(item => {
        if (item.codigo_referencia === form.referencia) {
          const newStock = modalType === "entrada" 
            ? item.stock_actual + qty 
            : Math.max(0, item.stock_actual - qty);
          return { ...item, stock_actual: newStock };
        }
        return item;
      });

      // Si es una entrada y no existía la referencia, podemos crearla
      const exists = items.some(item => item.codigo_referencia === form.referencia);
      if (!exists && modalType === "entrada") {
        updatedItems.push({
          id: Date.now(),
          codigo_referencia: form.referencia,
          descripcion: form.descripcion || "Nuevo Producto",
          tipo_unidad: form.tipo_unidad,
          stock_actual: qty,
          ubicacion_almacen: form.ubicacion
        });
      }

      setItems(updatedItems);
      setMessage({ 
        type: "info", 
        text: `Registrado de forma local (Backend Offline). Stock de ${form.referencia} actualizado.` 
      });
    }

    setShowModal(false);
    // Borrar mensaje tras 4 segundos
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <Header 
        onNewEntry={() => handleOpenModal("entrada")} 
        onNewExit={() => handleOpenModal("salida")} 
      />

      {/* Alertas informativas */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold border flex items-center justify-between transition-all shadow-sm ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-amber-50 text-amber-800 border-amber-200"
        }`}>
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="hover:opacity-70 text-slate-400 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Panel de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Productos Totales</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2">{totalItems}</p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Stock Acumulado</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2">{totalStock} ud</p>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Stock en Alerta</p>
            <p className="text-3xl font-extrabold text-red-600 mt-2">{lowStockCount}</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unidades de Almacén</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2">{categoriesCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contenedor Tabla */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Visión General del Stock
            </h2>
            <p className="text-slate-500 text-sm">Listado en tiempo real de unidades y referencias de inventario</p>
          </div>
          <button 
            onClick={fetchItems}
            className="flex items-center justify-center space-x-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>Actualizar</span>
          </button>
        </div>
        <InventoryTable items={items} loading={loading} />
      </div>

      {/* Modal interactivo de Entrada / Salida */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden transform scale-100 transition-all">
            <div className={`p-6 border-b text-white flex items-center justify-between ${
              modalType === "entrada" ? "bg-teal-600" : "bg-orange-500"
            }`}>
              <h3 className="text-lg font-bold">
                {modalType === "entrada" ? "Registrar Entrada de Stock" : "Registrar Salida de Stock"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white hover:opacity-85 text-lg font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Referencia</label>
                <select
                  value={form.referencia}
                  onChange={(e) => setForm({ ...form, referencia: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-slate-800 font-mono"
                >
                  {items.map(item => (
                    <option key={item.id} value={item.codigo_referencia}>
                      {item.codigo_referencia} - {item.descripcion}
                    </option>
                  ))}
                  {modalType === "entrada" && <option value="NUEVO">Crear Nueva Referencia...</option>}
                </select>
              </div>

              {form.referencia === "NUEVO" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Código Ref.</label>
                      <input
                        type="text"
                        placeholder="REF-XXXX"
                        required
                        value={form.referenciaInput || ""}
                        onChange={(e) => setForm({ ...form, referenciaInput: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tipo Unidad</label>
                      <select
                        value={form.tipo_unidad}
                        onChange={(e) => setForm({ ...form, tipo_unidad: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                      >
                        <option value="Caja">Caja</option>
                        <option value="Pallet">Pallet</option>
                        <option value="Contenedor">Contenedor</option>
                        <option value="Unidad">Unidad</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Descripción</label>
                    <input
                      type="text"
                      placeholder="Ej. Teclados Mecánicos"
                      required
                      value={form.descripcion}
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ubicación</label>
                    <input
                      type="text"
                      placeholder="Ej. Pasillo D-5"
                      required
                      value={form.ubicacion}
                      onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.cantidad}
                  onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 font-bold"
                />
              </div>

              {form.referencia !== "NUEVO" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Observación</label>
                  <input
                    type="text"
                    placeholder="Ej. Reabastecimiento semanal / Pedido especial"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-semibold shadow transition ${
                    modalType === "entrada" 
                      ? "bg-teal-600 hover:bg-teal-700" 
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                  onClick={() => {
                    // Si seleccionó nuevo, movemos el input al campo principal
                    if (form.referencia === "NUEVO" && form.referenciaInput) {
                      form.referencia = form.referenciaInput;
                    }
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
