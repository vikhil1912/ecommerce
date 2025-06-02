import React from "react";
import ProductCard from "./ProductCard.jsx";
import { useState } from "react";

const BuyAgain = ({ orders }) => {
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const yearOptions = [];
  for (let year = currentYear; year >= startYear; year--) {
    yearOptions.push(<option key={year}>{year}</option>);
  }
  const [selectedYear, setSelectedYear] = useState(currentYear);
  let uniqueProducts = new Map();
  const filteredOrders = orders.filter((order) => {
    if (selectedYear === "past 3 months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return new Date(order.createdAt) >= threeMonthsAgo;
    }
    const orderYear = new Date(order.createdAt).getFullYear();
    if (orderYear === parseInt(selectedYear)) {
      return true;
    }
    return false;
  });
  filteredOrders.forEach((order) => {
    order.products.forEach((product) => {
      const uniqueProduct = {
        _id: product.product._id,
        name: product.product.name,
        price: product.product.price,
        image: product.product.image,
      };
      uniqueProducts.set(uniqueProduct._id, uniqueProduct);
    });
  });
  console.log(uniqueProducts);

  return (
    <div>
      <div className="flex items-center space-x-2 mt-2 text-sm">
        <span className="font-semibold">
          {[...uniqueProducts.values()]?.length} products
        </span>
        <span>placed in</span>
        <select
          className="border text-sm px-2 py-1 rounded bg-gray-100 cursor-pointer"
          value={selectedYear}
          onChange={(e) => {
            (uniqueProducts = new Set()), setSelectedYear(e.target.value);
          }}
        >
          <option>past 3 months</option>
          {yearOptions}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredOrders?.length > 0 ? (
          [...uniqueProducts.values()]?.map((product) => {
            return <ProductCard key={product._id} product={product} />;
          })
        ) : (
          <p className="text-center text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
};

export default BuyAgain;
