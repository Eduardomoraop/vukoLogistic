import React, { useState } from "react";

const Configuracion = () => {
  const [supabaseUrl, setSupabaseUrl] = useState("https://obtwjygpldxlyzqrkldj.supabase.co");
  const [supabaseKey, setSupabaseKey] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9idHdq...");
  const [isConnected, setIsConnected] = useState(false); // Estado de simulación de conexión
  
  const [threshold, setThreshold] = useState("10");
  const [maxCapacity, setMaxCapacity] = useState("1500");

  const [profile, setProfile] = useState({
    nombre: "Administrador Vuko",
    email: "admin@vukologistic.com",
    rol: "Supervisor General"
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Perfil de usuario actualizado correctamente (Simulación).");
  };

  const handleTestConnection = () => {
    setIsConnected(true);
    alert("¡Conexión de prueba con Supabase establecida con éxito!");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Configuración del Sistema</h2>
        <p className="text-slate-600 mt-1">Administra variables globales, credenciales de base de datos y tu cuenta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Supabase y Conexiones */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Conexión a Base de Datos (Supabase)
            </h3>
            <p className="text-xs text-slate-500 mt-1">Configura las credenciales de Supabase para almacenar y sincronizar datos del ERP.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-slate-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Supabase API Key (Anon/Public)</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-slate-700 font-mono"
              />
            </div>
          </div>

          {/* Estado de la Conexión */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isConnected 
              ? "bg-emerald-50/50 border-emerald-200 text-emerald-900" 
              : "bg-amber-50/50 border-amber-200 text-amber-900"
          }`}>
            <div className="flex items-center space-x-3">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`}>
                <span className={`w-2 h-2 rounded-full bg-white ${isConnected ? "animate-pulse" : ""}`}></span>
              </span>
              <div>
                <p className="text-sm font-bold">
                  {isConnected ? "Conectado al Backend Principal" : "Ejecutando en Modo Aislado (Modo Mock)"}
                </p>
                <p className="text-xs opacity-80">
                  {isConnected 
                    ? "Los datos se leen y escriben en Supabase." 
                    : "El frontend utiliza almacenamiento simulado temporal."
                  }
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              {isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 border border-red-200 bg-white text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition"
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={handleTestConnection}
                  className="px-3 py-1.5 border border-teal-200 bg-white text-teal-700 rounded-lg text-xs font-bold hover:bg-teal-50 transition"
                >
                  Probar Conexión
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow transition">
              Guardar Credenciales
            </button>
          </div>
        </div>

        {/* Panel Perfil y Ajustes Locales */}
        <div className="space-y-8">
          {/* Perfil */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-850 mb-4 flex items-center">
              <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Perfil de Operador
            </h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={profile.nombre}
                  onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/10 text-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/10 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Rol Operativo</label>
                <input
                  type="text"
                  disabled
                  value={profile.rol}
                  className="w-full px-3 py-2 border border-slate-100 bg-slate-50 rounded-lg text-sm text-slate-400 font-semibold cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow transition"
              >
                Actualizar Perfil
              </button>
            </form>
          </div>

          {/* Parámetros Operativos */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-850 flex items-center">
              <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              Reglas de Almacén
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Umbral Stock Bajo</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/10 text-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Capacidad Máxima Almacén</label>
                <input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/10 text-slate-700 font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
