import React from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import ProductCard from "../components/ProductCard.jsx";

const PeopleAlsoBought = () => {
  const queryClient = useQueryClient();
  const { data: recommendedProducts } = useQuery({
    queryKey: ["recommendedProducts"],
    queryFn: async () => {
      return await axiosInstance.get("/product/recommendations");
    },
  });
  const products = recommendedProducts?.data;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid  grid-cols-1 gap-3 sm:grid-cols-2 md: grid-col-3">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
