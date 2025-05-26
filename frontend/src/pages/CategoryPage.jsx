import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { category } = useParams();
  const { data: ProductsData, isLoading } = useQuery({
    queryKey: ["category", `${category}`],
    queryFn: async () => {
      return await axiosInstance.get(`/product/${category}`);
    },
  });
  const products = ProductsData?.data;
  console.log(products);

  return (
    <div className="flex flex-col items-center w-full min-h-screen py-10">
      <h1 className="text-3xl text-white mb-7">{category}</h1>
      <div className="grid grid-cols-1 gap-5  md:grid-cols-2 lg:grid-cols-3">
        {products?.length === 0 && (
          <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
            No products found
          </h2>
        )}
        {products?.map((product) => {
          return <ProductCard product={product} key={product._id} />;
        })}
      </div>
    </div>
  );
};

export default CategoryPage;
