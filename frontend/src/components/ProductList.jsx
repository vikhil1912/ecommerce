import React from "react";
import { Trash, Star, Loader } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const ProductList = () => {
  const queryClient = useQueryClient();
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      return await axiosInstance.get("/product");
    },
  });
  const { mutate: toggleFeatured, isPending: isToggleLoading } = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.put(`/product/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
    },
  });
  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id) => {
      var result = confirm("Are you sure you want to delete?");
      if (result) {
        await axiosInstance.delete(`/product/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
    },
  });
  const products = allProducts?.data || null;
  return (
    <table className=" min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Product
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Price
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Category
          </th>

          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Featured
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {!isLoading &&
          products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  ${product.price.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeatured(product._id)}
                  className={`p-1 rounded-full ${
                    product.isFeatured
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-600 text-gray-300"
                  } hover:bg-yellow-500 transition-colors duration-200`}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ProductList;
