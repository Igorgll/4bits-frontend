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
import { BiPlus } from "react-icons/bi";

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

const [newProduct, setNewProduct] = useState<ProductModel>({
    productId: 0,
    productName: "",
    price: 0.0,
    description: "",
    rating: 0.0,
    storage: 0,
    isActive: false,
  });

const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewProduct({
      productId: 0,
      productName: "",
      price: 0.0,
      description: "",
      rating: 0.0,
      storage: 0,
      isActive: false,
    });
  };

const handleCreateProduct = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/products/createProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (response.ok) {
        console.log("Produto criado com sucesso");
        handleCloseModal();
      } else {
        console.error("Falha ao criar o produto");
      }
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
    }
  };




      const handleSearch = (searchTerm: string) => {
        const filtered = products.filter((product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      };  

      return (
        <Wrapper className="bg-[#111827]">
          <SearchBar onSearch={handleSearch} />
          
          <Table striped>
            <TableHead>
              <TableHeadCell>Nome</TableHeadCell>
              <TableHeadCell>Preço</TableHeadCell>
              <TableHeadCell>Descrição</TableHeadCell>
              <TableHeadCell>Avaliação</TableHeadCell>
              <TableHeadCell>Estoque</TableHeadCell>   
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell></TableHeadCell>
              <TableHeadCell>Adicionar Produto</TableHeadCell>   
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
                <TableCell className="flex justify-center">
                  <a
                    onClick={handleOpenModal}
                    href="#"
                    className="font-medium text-green-450 hover:underline dark:text-green-500"
                  >
                    <BiPlus size={24} />
                  </a>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
        </Table>


        <Modal show={openModal} onClose={handleCloseModal}>
                <Modal.Header />
                <Modal.Body>
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                      Criar Produto
                    </h3>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="productName" value="Nome do Produto" />
                      </div>
                      <TextInput
                        id="productName"
                        value={newProduct.productName}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, productName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="price" value="Preço" />
                      </div>
                      <TextInput
                        id="price"
                        type="number"
                        value={newProduct.price.toString()}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="description" value="Descrição" />
                      </div>
                      <TextInput
                        id="description"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, description: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="rating" value="Avaliação" />
                      </div>
                      <TextInput
                        id="rating"
                        type="number"
                        value={newProduct.rating.toString()}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, rating: parseFloat(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="storage" value="Armazenamento" />
                      </div>
                      <TextInput
                        id="storage"
                        type="number"
                        value={newProduct.storage.toString()}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, storage: parseInt(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="isActive" value="Ativo" />
                      </div>
                      <Select
                        id="isActive"
                        defaultValue={newProduct.isActive ? "true" : "false"}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, isActive: e.target.value === "true" })
                        }
                        required
                      >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                      </Select>
                    </div>
                    <div className="w-full flex justify-between">
                      <Button color="success" onClick={handleOpenModal}>
                        Criar
                      </Button>

                      <Button onClick={handleCloseModal}>Cancelar</Button>


                    </div>
                  </div>
                </Modal.Body>
              </Modal>



        </Wrapper>
        );
}

export default ListProducts;
  
