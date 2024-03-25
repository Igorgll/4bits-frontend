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

interface ProductUpdateRequestDTO {

    productName: string;
    price: number;
    description: string;
    storage: number;
  }
  const ListProducts = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductUpdateRequestDTO | null>(null); // Estado para armazenar o usuário selecionado para edição
    const [products, setProducts] = useState<ProductUpdateRequestDTO[]>([]); // Estado para armazenar os dados dos usuários
  
    const fetchProducts = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/v1/products/listProducts"
          );
          if (response.ok) {
            const data: ProductUpdateRequestDTO[] = await response.json();
            setProducts(data); // Atualiza o estado com os dados dos usuários
            //setConfirmDialogOpen(false);
          } else {
            console.error("Falha ao carregar os dados dos produtos");
          }
        } catch (error) {
          console.error("Erro ao carregar os dados dos produtos:", error);
        }
      };

      useEffect(() => {
        fetchProducts();
      }, []);

      const handleOpenModal = (product : ProductUpdateRequestDTO) => {
        setSelectedProduct(product);
        setOpenModal(true);
      };
    
      const handleCloseModal = () => {
        setOpenModal(false);
        fetchProducts();
      };

      return (
        <Wrapper className="bg-[#111827]">
          <SearchBar />
          <Table striped>
            <TableHead>
              <TableHeadCell>Nome</TableHeadCell>
              <TableHeadCell>Preço</TableHeadCell>
              <TableHeadCell>Descrição</TableHeadCell>
              <TableHeadCell>Stoque</TableHeadCell>   
              <TableHeadCell>
                <span className="sr-only">Alterar</span>
              </TableHeadCell>
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
                  <TableCell>{product.storage}</TableCell>
                  </TableRow>
          ))}
        </TableBody>
        </Table>
        </Wrapper>
        );
}

export default ListProducts;
  
