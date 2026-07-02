import React, { useState } from "react";

const Reportes = () => {
  const [timeframe, setTimeframe] = useState("7d");
  const [activeChart, setActiveChart] = useState("stock"); // "stock" o "movimientos"

  // Datos simulados
  const reportData = {
    "7d": {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      stockLevels: [350, 390, 380, 410, 430, 420, 504],
      entries: [45, 60, 20, 55, 30, 10, 95],
      exits: [20, 20, 30, 25, 10, 20, 11]
    },
    "30d": {
      labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
      stockLevels: [280, 360, 450, 504],
      entries: [180, 220, 150, 240],
      exits: [100, 140, 60, 126]
    }
  };

  const currentData = reportData[timeframe];
  
  // Encontrar el valor máximo para escalar los gráficos SVG
  const maxStock = Math.max(...currentData.stockLevels);
  const maxMove = Math.max(...currentData.entries, ...currentData.exits);

  const handleExport = (format) => {
    alert(`Exportando reporte de inventario en formato ${format.toUpperCase()}...`);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Reportes y Analíticas</h2>
          <p className="text-slate-600 mt-1">Monitorea las tendencias de existencias y flujos de mercancía.</p>
        </div>
        
        {/* Controles de período */}
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex space-x-1 self-start sm:self-center">
          <button
            onClick={() => setTimeframe("7d")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              timeframe === "7d" ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-850"
            }`}
          >
            Últimos 7 días
          </button>
          <button
            onClick={() => setTimeframe("30d")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              timeframe === "30d" ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-850"
            }`}
          >
            Últimos 30 días
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Entradas Registradas</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">
            +{currentData.entries.reduce((a, b) => a + b, 0)} ud
          </p>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-2 border border-emerald-100">
            ▲ 12.5% vs período anterior
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Salidas Despachadas</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">
            -{currentData.exits.reduce((a, b) => a + b, 0)} ud
          </p>
          <span className="inline-flex items-center text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md mt-2 border border-orange-100">
            ▼ 4.8% vs período anterior
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Rotación Promedio</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">
            {((currentData.exits.reduce((a,b)=>a+b,0) / currentData.stockLevels[currentData.stockLevels.length-1]) * 100).toFixed(1)}%
          </p>
          <span className="inline-flex items-center text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md mt-2 border border-teal-100">
            Estable (óptimo)
          </span>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenedor del Gráfico Principal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Tendencia de Almacén</h3>
              <p className="text-xs text-slate-500">Representación visual interactiva del volumen de stock</p>
            </div>
            
            <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveChart("stock")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeChart === "stock" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Volumen Total
              </button>
              <button
                onClick={() => setActiveChart("movimientos")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeChart === "movimientos" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Flujo Entradas/Salidas
              </button>
            </div>
          </div>

          {/* Gráfico SVG Autogestionado Premium */}
          <div className="h-64 flex items-end justify-between px-4 pb-2 border-b border-slate-100">
            {activeChart === "stock" ? (
              // Gráfico de línea/área SVG para tendencia de stock
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Cuadrícula de fondo */}
                <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" />

                {/* Polígono de área */}
                <polygon
                  fill="url(#chartGrad)"
                  points={`
                    0,200
                    ${currentData.stockLevels.map((val, idx) => {
                      const x = (idx / (currentData.stockLevels.length - 1)) * 600;
                      const y = 180 - (val / maxStock) * 140;
                      return `${x},${y}`;
                    }).join(" ")}
                    600,200
                  `}
                />

                {/* Línea principal */}
                <polyline
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={currentData.stockLevels.map((val, idx) => {
                    const x = (idx / (currentData.stockLevels.length - 1)) * 600;
                    const y = 180 - (val / maxStock) * 140;
                    return `${x},${y}`;
                  }).join(" ")}
                />

                {/* Puntos interactivos / destacados */}
                {currentData.stockLevels.map((val, idx) => {
                  const x = (idx / (currentData.stockLevels.length - 1)) * 600;
                  const y = 180 - (val / maxStock) * 140;
                  return (
                    <g key={idx} className="group cursor-pointer">
                      <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
                      <circle cx={x} cy={y} r="10" fill="#0d9488" fillOpacity="0" className="hover:fill-opacity-10 transition-all" />
                    </g>
                  );
                })}
              </svg>
            ) : (
              // Gráfico de barras SVG doble para Entradas y Salidas
              <div className="w-full h-full flex items-end justify-around pt-6">
                {currentData.labels.map((label, idx) => {
                  const entryHeight = (currentData.entries[idx] / maxMove) * 140;
                  const exitHeight = (currentData.exits[idx] / maxMove) * 140;
                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full w-full group">
                      <div className="flex space-x-1 items-end h-full">
                        {/* Entrada (Teal) */}
                        <div 
                          style={{ height: `${Math.max(4, entryHeight)}px` }} 
                          className="w-3 bg-teal-500 rounded-t-sm group-hover:bg-teal-600 transition-all duration-200"
                          title={`Entradas: ${currentData.entries[idx]}`}
                        ></div>
                        {/* Salida (Orange) */}
                        <div 
                          style={{ height: `${Math.max(4, exitHeight)}px` }} 
                          className="w-3 bg-orange-400 rounded-t-sm group-hover:bg-orange-500 transition-all duration-200"
                          title={`Salidas: ${currentData.exits[idx]}`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Etiquetas del eje X */}
          <div className="flex justify-between text-xs font-bold text-slate-400 mt-3 px-2 font-mono">
            {currentData.labels.map((label, idx) => (
              <span key={idx}>{label}</span>
            ))}
          </div>
        </div>

        {/* Panel de Descargas e Informes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Exportación Oficial</h3>
            <p className="text-slate-500 text-sm mb-6">Genera informes auditables de inventarios, stock valorado y rotación listos para descarga.</p>
            
            <div className="space-y-3.5">
              <button 
                onClick={() => handleExport("pdf")}
                className="w-full flex items-center justify-between p-3.5 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/10 rounded-xl transition text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Reporte Ejecutivo (PDF)</h4>
                    <p className="text-slate-400 text-[10px]">Kardex resumido del período actual</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <button 
                onClick={() => handleExport("csv")}
                className="w-full flex items-center justify-between p-3.5 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/10 rounded-xl transition text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Base de Datos Stock (CSV)</h4>
                    <p className="text-slate-400 text-[10px]">Excel de existencias y ubicaciones</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Información Encriptada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
