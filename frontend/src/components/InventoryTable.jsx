const typeBadge = (tipo) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";
  const colors =
    tipo === "Pallet"
      ? "bg-amber-100 text-amber-800"
      : tipo === "Contenedor"
        ? "bg-sky-100 text-sky-800"
        : "bg-slate-100 text-slate-800";
  return <span className={`${base} ${colors}`}>{tipo}</span>;
};

const InventoryTable = ({ items, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500">
        Cargando inventario...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12 text-slate-500">
        No hay items en el inventario.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-slate-900 rounded-lg">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-slate-100 uppercase text-xs tracking-wider">
              Referencia
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-100 uppercase text-xs tracking-wider">
              Descripcion
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-100 uppercase text-xs tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-100 uppercase text-xs tracking-wider">
              Stock Actual
            </th>
            <th className="px-6 py-4 text-left font-semibold text-slate-100 uppercase text-xs tracking-wider">
              Ubicacion
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-slate-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 text-slate-800 font-mono text-sm">
                {item.codigo_referencia}
              </td>
              <td className="px-6 py-4 text-slate-800 font-medium">
                {item.descripcion}
              </td>
              <td className="px-6 py-4">{typeBadge(item.tipo_unidad)}</td>
              <td
                className={`px-6 py-4 font-bold text-lg ${item.stock_actual < 10 ? "text-red-600" : "text-slate-900"}`}
              >
                {item.stock_actual}
              </td>
              <td className="px-6 py-4 text-slate-700">
                {item.ubicacion_almacen}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
