const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const getItems = async () => {
  const res = await fetch(`${API_URL}/items`);
  if (!res.ok) throw new Error("Error al obtener items");
  return res.json();
};

export const createMovement = async (movement) => {
  const res = await fetch(`${API_URL}/movimientos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movement),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al registrar movimiento");
  }
  return res.json();
};
