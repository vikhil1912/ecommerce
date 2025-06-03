import React, { useState } from "react";
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import CreateProduct from "../components/CreateProduct.jsx";
import ProductList from "../components/ProductList.jsx";
import AdminOrders from "../components/AdminOrders.jsx";

const tabs = [
  { id: 1, name: "Create Dashboard", icon: PlusCircle, comp: CreateProduct },
  { id: 2, name: "Products", icon: ShoppingBasket, comp: ProductList },
  { id: 3, name: "Orders", icon: BarChart, comp: AdminOrders },
];
const AdminPage = () => {
  const [tab, setTab] = useState(1);
  return (
    <div className={`flex flex-col items-center ${tab === 3 && "bg-white"} `}>
      <div className="w-full flex flex-col items-center justify-around py-10 px-48">
        <h2
          className={`text-4xl ${tab !== 3 && "text-white"} mb-4 ${
            tab === 3 && "text-black"
          }`}
        >
          Admin Dashboard
        </h2>
        <div className="flex mb-7">
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
        {tabs.map((t) => {
          return <>{tab == t.id && <t.comp />}</>;
        })}
      </div>
    </div>
  );
};

export default AdminPage;
