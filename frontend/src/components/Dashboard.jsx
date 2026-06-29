import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import InventoryTable from "./InventoryTable.jsx";
import { getItems } from "../services/api";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch((err) => console.error("Error conectando al backend:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <Header onNewEntry={() => {}} onNewExit={() => {}} />
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-5">
          Vision General del Stock
        </h2>
        <InventoryTable items={items} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
