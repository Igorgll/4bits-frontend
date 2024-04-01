import React, { useState } from "react";
import Wrapper from "./Wrapper";
import { Navigate } from "react-router";

interface FormData {
  productName: string;
  price: string;
  description: string;
  rating: string;
  storage: string;
}

interface SignUpFormProps {
  redirectToLogin: () => void; // Função para redirecionar para o login
}

const ProductForm: React.FC<SignUpFormProps> = ({ redirectToLogin }) => {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    price: "",
    description: "",
    rating: "",
    storage: "",
  });

  const [redirect, setRedirect] = useState<boolean>(false); // State para controlar o redirecionamento

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    console.log(`Valor de ${name}: ${value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { productName, price, description, rating, storage } = formData;
    if (!productName || !price || !description || !rating || !storage) {
      console.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/products/createProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log("Produto cadastrado com sucesso");
        setFormData({
          productName: "",
          price: "",
          description: "",
          rating: "",
          storage: "",
        });
        setRedirect(true);
      } else {
        console.error("Falha ao cadastrar produto");
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
    }
  };

  if(redirect) {
    return <Navigate to="/login" />
  }

  return (
    <Wrapper className="bg-[#111827]">
      <form className="w-96 mx-auto" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="productName"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nome do Produto
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="price"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Preço
          </label>
        </div>
        {/* Continue para os outros campos como descrição, rating e armazenamento */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Cadastrar Produto
        </button>
      </form>
    </Wrapper>
  );
};

export default ProductForm;
