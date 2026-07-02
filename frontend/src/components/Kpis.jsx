import React, { useState } from "react";

const initialKpiData = [
  { id: 1, referencia: "REF-4502", descripcion: "Teclados Mecánicos RGB", tipo: "Caja", stock: 125, ubicacion: "Almacén A", valorUnitario: 45, diasSinMovimiento: 3, salidasMes: 210 },
  { id: 2, referencia: "REF-1092", descripcion: "Monitores UltraWide 34\"", tipo: "Contenedor", stock: 6, ubicacion: "Almacén Muelle", valorUnitario: 320, diasSinMovimiento: 12, salidasMes: 14 },
  { id: 3, referencia: "REF-8831", descripcion: "Sillas Ergonómicas Premium", tipo: "Pallet", stock: 8, ubicacion: "Almacén B", valorUnitario: 180, diasSinMovimiento: 25, salidasMes: 8 },
  { id: 4, referencia: "REF-0021", descripcion: "Cables HDMI 2.1 Alta Vel.", tipo: "Caja", stock: 45, ubicacion: "Almacén A", valorUnitario: 15, diasSinMovimiento: 1, salidasMes: 180 },
  { id: 5, referencia: "REF-7742", descripcion: "Mouse Gamer Inalámbrico", tipo: "Caja", stock: 320, ubicacion: "Almacén C", valorUnitario: 55, diasSinMovimiento: 5, salidasMes: 450 },
];

const Kpis = () => {
  const [groupBy, setGroupBy] = useState("tipo"); // "tipo" o "ubicacion"
  const [sortField, setSortField] = useState("valorTotal");
  const [sortAsc, setSortAsc] = useState(false);

  // Procesar métricas por elemento individual
  const itemsWithMetrics = initialKpiData.map(item => {
    const valorTotal = item.stock * item.valorUnitario;
    // Rotación = salidasMes / stockPromedio (simplificado)
    const rotacion = item.stock > 0 ? (item.salidasMes / item.stock).toFixed(2) : 0;
    // Riesgo de ruptura de stock (días de cobertura) = stock actual / (salidas promedio diarias)
    const salidasDiarias = item.salidasMes / 30;
    const diasCobertura = salidasDiarias > 0 ? Math.round(item.stock / salidasDiarias) : 999;

    return {
      ...item,
      valorTotal,
      rotacion,
      diasCobertura
    };
  });

  // Agrupación dinámica (Pivot)
  const groupedData = () => {
    const groups = {};
    
    itemsWithMetrics.forEach(item => {
      const key = item[groupBy];
      if (!groups[key]) {
        groups[key] = {
          name: key,
          stockTotal: 0,
          valorTotal: 0,
          salidasTotales: 0,
          diasSinMovPromedio: 0,
          itemsCount: 0,
          itemsList: []
        };
      }
      
      groups[key].stockTotal += item.stock;
      groups[key].valorTotal += item.valorTotal;
      groups[key].salidasTotales += item.salidasMes;
      groups[key].diasSinMovPromedio += item.diasSinMovimiento;
      groups[key].itemsCount += 1;
      groups[key].itemsList.push(item);
    });

    // Calcular promedios
    Object.keys(groups).forEach(key => {
      groups[key].diasSinMovPromedio = Math.round(groups[key].diasSinMovPromedio / groups[key].itemsCount);
      groups[key].rotacionPromedio = (groups[key].salidasTotales / (groups[key].stockTotal || 1)).toFixed(2);
    });

    // Convertir a array y ordenar
    return Object.values(groups).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const activeGrouped = groupedData();

  // KPIs Totales del almacén
  const globalValorTotal = itemsWithMetrics.reduce((sum, item) => sum + item.valorTotal, 0);
  const globalStockTotal = itemsWithMetrics.reduce((sum, item) => sum + item.stock, 0);
  const stockCriticoCount = itemsWithMetrics.filter(item => item.diasCobertura <= 7).length;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Métricas y KPIs Avanzados</h2>
        <p className="text-slate-600 mt-1">Análisis de rendimiento, valoración financiera de stock y tablas dinámicas de rotación.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Valor Monetario Stock</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2">
              ${globalValorTotal.toLocaleString("es-ES")} USD
            </p>
            <p className="text-xs text-slate-450 mt-1">Suma del valor unitario × cantidad en almacén</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Productos en Ruptura Crítica</p>
            <p className="text-3xl font-extrabold text-rose-600 mt-2">{stockCriticoCount}</p>
            <p className="text-xs text-slate-450 mt-1">Con menos de 7 días de cobertura estimados</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Índice de Rotación General</p>
            <p className="text-3xl font-extrabold text-teal-600 mt-2">
              {(itemsWithMetrics.reduce((sum, i) => sum + i.salidasMes, 0) / globalStockTotal).toFixed(2)}x
            </p>
            <p className="text-xs text-slate-450 mt-1">Frecuencia mensual de renovación de mercancías</p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contenedor Tabla Dinámica */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Matriz de Análisis Dinámico</h3>
            <p className="text-xs text-slate-500">Agrupa y ordena métricas clave agregadas para toma de decisiones tácticas.</p>
          </div>

          {/* Selector de Agrupación */}
          <div className="flex items-center space-x-3 bg-slate-100 p-1 rounded-xl self-start">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase pl-2 tracking-wide">Agrupar por:</span>
            <button
              onClick={() => setGroupBy("tipo")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                groupBy === "tipo" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Tipo Unidad
            </button>
            <button
              onClick={() => setGroupBy("ubicacion")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                groupBy === "ubicacion" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Ubicación
            </button>
          </div>
        </div>

        {/* Tabla Agrupada Dinámicamente */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Grupo ({groupBy === "tipo" ? "Tipo Unidad" : "Ubicación"})
                </th>
                <th 
                  onClick={() => handleSort("itemsCount")} 
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                >
                  Referencias Distintas {sortField === "itemsCount" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th 
                  onClick={() => handleSort("stockTotal")} 
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                >
                  Stock Agregado {sortField === "stockTotal" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th 
                  onClick={() => handleSort("valorTotal")} 
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                >
                  Valor Total Estimado {sortField === "valorTotal" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th 
                  onClick={() => handleSort("rotacionPromedio")} 
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                >
                  Rotación Promedio {sortField === "rotacionPromedio" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th 
                  onClick={() => handleSort("diasSinMovPromedio")} 
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                >
                  Días Inactividad Promedio {sortField === "diasSinMovPromedio" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {activeGrouped.map((group) => (
                <tr key={group.name} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-slate-850">{group.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-650">{group.itemsCount} productos</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{group.stockTotal} ud</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-slate-900">${group.valorTotal.toLocaleString("es-ES")} USD</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100">
                      {group.rotacionPromedio}x
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                      group.diasSinMovPromedio > 15 
                        ? "bg-rose-50 text-rose-700 border-rose-100" 
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}>
                      {group.diasSinMovPromedio} días
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Kpis;
