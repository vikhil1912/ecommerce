import React, { useState } from "react";
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";

const tabs = [
  { id: 1, name: "Create Dashboard", icon: PlusCircle },
  { id: 2, name: "Products", icon: ShoppingBasket },
  { id: 3, name: "Analytics", icon: BarChart },
];
const AdminPage = () => {
  const [tab, setTab] = useState(1);
  return (
    <div className="flex flex-col items-center py-10">
      <div className="flex flex-col items-center justify-around py-10">
        <h2 className="text-4xl text-white mb-4">Admin Dashboard</h2>
        <div className="flex">
          {tabs.map((t) => {
            return (
              <button
                onClick={() => setTab(t.id)}
                className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                  tab == t.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <t.icon className="mr-2 h-5 w-5" />
                {t.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
