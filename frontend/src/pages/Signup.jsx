import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: submitSignup, isPending } = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.post("/auth/signup", data);
    },
    onSuccess: () => {
      toast.success("user signed up");
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleOnSubmit = (e) => {
    e.preventDefault();
    submitSignup({ email, password, name });
  };
  return (
    <div className="w-full h-[742px] flex items-center justify-center">
      <form className="bg-white p-[20px]" onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="name"
          name="name"
          required
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered h-[40px] my-2 rounded-[6px]  bg-gray-400 px-2 text-black font-medium focus:outline-black flex items-center"
        />
        <input
          type="email"
          placeholder="email"
          name="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered h-[40px] my-2 rounded-[6px]  bg-gray-400 px-2 text-black font-medium focus:outline-black flex items-center"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered h-[40px] my-2 rounded-[6px] bg-gray-400 px-2 text-black font-medium focus:outline-black flex items-center"
        />
        <button
          type="submit"
          disabled={isPending}
          className="h-[40px] bg-amber-300 w-full rounded-[6px] flex items-center justify-center text-white hover:bg-amber-200 cursor-pointer"
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
