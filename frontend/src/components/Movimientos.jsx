import React, { useState } from "react";

const initialMovements = [
  {
    id: 1,
    fecha: "2026-07-02 12:30",
    codigo_referencia: "REF-4502",
    tipo: "ENTRADA",
    cantidad: 50,
    operador: "Carlos Gómez",
    notas: "Compra de stock regular",
  },
  {
    id: 2,
    fecha: "2026-07-02 11:15",
    codigo_referencia: "REF-1092",
    tipo: "SALIDA",
    cantidad: 2,
    operador: "Ana Ruiz",
    notas: "Despacho cliente VukoStore",
  },
  {
    id: 3,
    fecha: "2026-07-02 10:00",
    codigo_referencia: "REF-8831",
    tipo: "ENTRADA",
    cantidad: 10,
    operador: "Felipe Marcos",
    notas: "Devolución de lote de prueba",
  },
  {
    id: 4,
    fecha: "2026-07-01 16:45",
    codigo_referencia: "REF-7742",
    tipo: "SALIDA",
    cantidad: 35,
    operador: "Carlos Gómez",
    notas: "Orden de envío #9923",
  },
  {
    id: 5,
    fecha: "2026-07-01 09:30",
    codigo_referencia: "REF-0021",
    tipo: "ENTRADA",
    cantidad: 100,
    operador: "Laura Milla",
    notas: "Importación aduana Lote C",
  },
];

const Movimientos = () => {
  const [movements, setMovements] = useState(initialMovements);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState({
    codigo_referencia: "",
    tipo: "ENTRADA",
    cantidad: "",
    operador: "",
    notas: "",
  });

  const handleAddMovement = (e) => {
    e.preventDefault();
    const qty = parseInt(newMovement.cantidad);
    if (!newMovement.codigo_referencia || isNaN(qty) || !newMovement.operador)
      return;

    const dateNow = new Date();
    const formattedDate =
      dateNow.toISOString().slice(0, 10) +
      " " +
      dateNow.toTimeString().slice(0, 5);

    const movementToAdd = {
      id: Date.now(),
      fecha: formattedDate,
      codigo_referencia: newMovement.codigo_referencia.toUpperCase(),
      tipo: newMovement.tipo,
      cantidad: qty,
      operador: newMovement.operador,
      notas: newMovement.notas || "Registro manual rápido",
    };

    setMovements([movementToAdd, ...movements]);
    setShowAddModal(false);
    setNewMovement({
      codigo_referencia: "",
      tipo: "ENTRADA",
      cantidad: "",
      operador: "",
      notas: "",
    });
  };

  const filteredMovements = movements.filter((mov) => {
    const matchesSearch =
      mov.codigo_referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.notas.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "todos" || mov.tipo === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Kardex / Historial de Movimientos
          </h2>
          <p className="text-slate-600 mt-1">
            Bitácora completa de entradas, salidas y traspasos en tiempo real.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-lg shadow-teal-600/15 transition flex items-center space-x-2 self-start sm:self-center"
        >
          <svg
            className="w-4.5 h-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Registrar Movimiento</span>
        </button>
      </div>

      {/* Tarjeta de Filtros */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por referencia, operador o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-slate-700"
          />
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tipo Movimiento:
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none text-slate-700 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-white"
          >
            <option value="todos">Todos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SALIDA">Salidas</option>
          </select>
        </div>
      </div>

      {/* Bitácora de Movimientos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredMovements.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No se encontraron movimientos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Fecha / Hora
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Referencia
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Operador
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {mov.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          mov.tipo === "ENTRADA"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                            : "bg-orange-50 text-orange-700 border border-orange-200/50"
                        }`}
                      >
                        {mov.tipo === "ENTRADA" ? (
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 19V5m0 0l-7 7m7-7l7 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 5v14m0 0l7-7m-7 7l-7-7"
                            />
                          </svg>
                        )}
                        {mov.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-slate-700">
                      {mov.codigo_referencia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-slate-900">
                      {mov.cantidad} ud
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                      {mov.operador}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {mov.notas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Registrar Movimiento Rápido */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden transform scale-100 transition-all">
            <div className="p-6 border-b text-white bg-teal-600 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Registrar Movimiento en Bitácora
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white hover:opacity-85 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMovement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Referencia del Producto
                </label>
                <input
                  type="text"
                  placeholder="REF-4502"
                  required
                  value={newMovement.codigo_referencia}
                  onChange={(e) =>
                    setNewMovement({
                      ...newMovement,
                      codigo_referencia: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo Movimiento
                  </label>
                  <select
                    value={newMovement.tipo}
                    onChange={(e) =>
                      setNewMovement({ ...newMovement, tipo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 bg-white"
                  >
                    <option value="ENTRADA">Entrada (+)</option>
                    <option value="SALIDA">Salida (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="10"
                    value={newMovement.cantidad}
                    onChange={(e) =>
                      setNewMovement({
                        ...newMovement,
                        cantidad: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Operador / Responsable
                </label>
                <input
                  type="text"
                  placeholder="Tu Nombre"
                  required
                  value={newMovement.operador}
                  onChange={(e) =>
                    setNewMovement({ ...newMovement, operador: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Observación / Notas
                </label>
                <input
                  type="text"
                  placeholder="Ej. Traspaso de pasillo o Pedido Cliente"
                  value={newMovement.notas}
                  onChange={(e) =>
                    setNewMovement({ ...newMovement, notas: e.target.value })
                  }
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
                  Registrar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movimientos;
