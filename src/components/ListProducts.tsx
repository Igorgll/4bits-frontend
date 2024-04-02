import { useState, useEffect } from "react";
import Wrapper from "./Wrapper";
import {
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { Button, Modal } from "flowbite-react";
import SearchBar from "./SearchBar";
import { BiRefresh } from "react-icons/bi";

interface ProductDTO {
    productId: number;
    productName: string;
    price: number;
    description: string;
    rating: number;
    storage: number;
    active: boolean;
  }

  const ListProducts = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null); // Estado para armazenar o usuário selecionado para edição
    const [products, setProducts] = useState<ProductDTO[]>([]); // Estado para armazenar os dados dos usuários
    const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]); // Estado para armazenar os produtos filtrados
  
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/products");
        if (response.ok) {
          const data: any[] = await response.json();
          const convertedData: ProductDTO[] = data.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            description: product.description,
            rating: product.rating,
            storage: product.storage,
            active: product.active
          }));
          console.log(convertedData)
          setProducts(convertedData);
        } else {
          console.error("Falha ao carregar os dados dos produtos, lista de produtos pode estar vazia.");
        }
      } catch (error) {
        console.error("Erro ao carregar os dados dos produtos:", error);
      }
    };
    
      useEffect(() => {
        fetchProducts();
      }, []);

      const handleSearch = (searchTerm: string) => {
        const filtered = products.filter((product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      };  

      return (
        <Wrapper className="bg-[#111827]">
          <div className="flex flex-row items-center w-[500px]">
            <SearchBar onSearch={handleSearch} />
            <div className="relative"><span className="text-white">+</span></div>
          </div>
          
          <Table striped>
            <TableHead>
              <TableHeadCell>Nome</TableHeadCell>
              <TableHeadCell>Preço</TableHeadCell>
              <TableHeadCell>Descrição</TableHeadCell>
              <TableHeadCell>Avaliação</TableHeadCell>
              <TableHeadCell>Estoque</TableHeadCell>   
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell></TableHeadCell>   
            </TableHead>
            <TableBody className="divide-y">
              {products.map((product, index) => (
                <TableRow
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {product.productName}
                </TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell>{product.storage}</TableCell>
                <TableCell>
                <a
                  href="#"
                  className={`font-medium ${
                    product.active ? 'text-green-600' : 'text-red-600'
                  } hover:underline`}
                >
                  {product.active ? "Ativo" : "Inativo"}
                </a>
                </TableCell>
                <TableCell>
                  <a
                    href="#"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Alterar
                  </a>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
        </Table>
        </Wrapper>
        );
}

export default ListProducts;
  
