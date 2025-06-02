import React from "react";
import OrderBlock from "./OrderBlock";

const NotYetShipped = ({ orders }) => {
  const filteredOrders = orders.map((order) => {
    return {
      ...order,
      products: order.products.filter((product) => {
        return product.status === "placed";
      }),
    };
  });
  let isProductsAvailable = false;
  filteredOrders.map((order) => {
    if (order.products.length > 0) {
      isProductsAvailable = true;
      return;
    }
  });
  return (
    <div>
      {filteredOrders?.length > 0 &&
        filteredOrders?.map((order) => {
          if (!order.products.length) return null;
          isProductsAvailable = true;
          return <OrderBlock key={order._id} order={order} />;
        })}
      {!isProductsAvailable && (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </div>
  );
};

export default NotYetShipped;
