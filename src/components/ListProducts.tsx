import React, { useState, useEffect } from "react";
import Wrapper from "./Wrapper";
import ModalUpdateProduct from './ModalUpdateProduct'; // Importe o componente correto



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
  productImages: { imagePath: string }[];
  active: boolean;
}

const ListProducts = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [products, setProducts] = useState<ProductDTO[]>([]); // Estado para armazenar os dados dos produtos
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]); // Estado para armazenar os produtos filtrados
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null); // Estado para armazenar o produto selecionado para edição


  const [productDTO, setProductDTO] = useState<ProductDTO>({
    productId: 0,
    productName: "",
    price: 0,
    description: "",
    rating: 0,
    storage: 0,
    productImages: [],
    active: true
  });

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
          productImages: product.productImages,
          active: product.active,
        }));
        console.log(convertedData);
        setProducts(convertedData);
      } else {
        console.error(
          "Falha ao carregar os dados dos produtos, lista de produtos pode estar vazia."
        );
      }
    } catch (error) {
      console.error("Erro ao carregar os dados dos produtos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);





const handleOpenModal = (product: ProductDTO) => {
      setSelectedProduct(product);
      setOpenModal(true);
    };



  const handleCloseModal = () => {
    setOpenModal(false);
  };




 const handleUpdateOpenModal = (product: ProductDTO) => {
          setSelectedProduct(product);
          setOpenUpdateModal(true);
        };


 const handleUpdateCloseModal = () => {
    setUpdateModal(false);
  };



  const handleAddImage = () => {
    setProductDTO({
      ...productDTO,
      productImages: [...productDTO.productImages, { imagePath: "" }]
    });
  };

  const handleImageChange = (index: number, imagePath: string) => {
    const updatedImages = [...productDTO.productImages];
    updatedImages[index] = { imagePath };
    setProductDTO({ ...productDTO, productImages: updatedImages });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { productName, price, description, rating, storage, productImages, active } = productDTO;

      if (!productName || !price || !description || !rating || !storage || !productImages.length) {
        console.error("Todos os campos obrigatórios devem ser preenchidos");
        return;
      }

      const newProduct = { ...productDTO };

      const response = await fetch("http://localhost:8080/api/v1/products/createProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        console.log("Produto cadastrado com sucesso");
        handleCloseModal();
      } else {
        console.error("Falha ao cadastrar o produto");
      }
    } catch (error) {
      console.error("Erro ao cadastrar o produto:", error);
    }
  };

  
  const handleChangeProductStatus = async (productId: number, active: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/products/isProductActive/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, active }),
        }
      );
  
      if (response.ok) {
        const updatedProducts = products.map((product) => {
          if (product.productId === productId) {
            return {
              ...product,
              active: active,
            };
          }
          return product;
        });
        setProducts(updatedProducts); // Atualize o estado localmente
        console.log("Status do produto alterado com sucesso");
      } else {
        console.error("Falha ao mudar o status do produto:", response.statusText);
      }
    } catch (error) {
      console.error("Falha ao mudar o status do produto:", error);
    }
  };


  const handleSearch = (searchTerm: string) => {
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };


const handleUpdateProduct = async () => {
    try {
      if (!selectedProduct) return;

      const updatedProduct = { ...selectedProduct };

      // Atualizar os dados do usuário com os valores dos campos de entrada

      const productNameInput = document.getElementById(
        "name"
      ) as HTMLInputElement | null;
      const priceInput = document.getElementById(
        "price"
      ) as HTMLInputElement | null;
      const descriptionInput = document.getElementById(
        "description"
      ) as HTMLInputElement | null;
      const ratingInput = document.getElementById(
        "rating"
      ) as HTMLSelectElement | null;
      const storageInput = document.getElementById(
        "storage"
      )



      if (
        !productNameInput ||
        !priceInput ||
        !descriptionInput ||
        !ratingInput ||
        !storageInput
      ) {
        console.error(
          "Não foi possível encontrar todos os elementos necessários."
        );
        return;
      }

      updatedProduct.product = nameInput.value;
      updatedProduct.price = emailInput.value;
      updatedProduct.description = cpfInput.value;
      updatedProduct.rating = groupSelect.value;
      updatedProduct.storage = passwordInput.value;



      // Atualize o estado selectedUser diretamente com o objeto atualizado
      setSelectedUser(updatedUser);

      const response = await fetch(
        `http://localhost:8080/api/v1/users/updateUser/${selectedProduct.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        console.log("Usuário atualizado com sucesso");
        handleCloseModal();
      } else {
        console.error("Falha ao atualizar o usuário");
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
    }
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
          {filteredProducts.length === 0 ? (
          products.map((product, index) => (
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
                  onClick={() => handleChangeProductStatus(product.productId, !product.active)}
                  href="#"
                  className={`font-medium ${
                    product.active ? "text-green-600" : "text-red-600"
                  } hover:underline`}
                >
                  {product.active ? "Ativo" : "Inativo"}
                </a>
              </TableCell>
              <TableCell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  onClick={() => handleUpdateOpenModal(product)} // Abrir o modal ao clicar no link "Alterar"
                >
                  Alterar
                </a>
              </TableCell>
              <TableCell className="flex justify-center">
                <a
                  onClick={() => handleOpenModal(product)}
                  href="#"
                  className="font-medium text-green-450 hover:underline dark:text-green-500"
                >
                  <BiPlus size={24} />
                </a>
              </TableCell>
            </TableRow>
          ))
          ) : (
            filteredProducts.map((product, index) => (
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
                      product.active ? "text-green-600" : "text-red-600"
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
            ))
          )}
        </TableBody>
      </Table>

      <Modal show={openModal} onClose={handleCloseModal}>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
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
                value={productDTO.productName}
                onChange={(e) => setProductDTO({ ...productDTO, productName: e.target.value })}
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
                value={productDTO.price.toString()}
                onChange={(e) => setProductDTO({ ...productDTO, price: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Descrição" />
              </div>
              <TextInput
                id="description"
                value={productDTO.description}
                onChange={(e) => setProductDTO({ ...productDTO, description: e.target.value })}
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
                value={productDTO.rating.toString()}
                onChange={(e) => setProductDTO({ ...productDTO, rating: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="storage" value="Estoque" />
              </div>
              <TextInput
                id="storage"
                type="number"
                value={productDTO.storage.toString()}
                onChange={(e) => setProductDTO({ ...productDTO, storage: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Links das Imagens" />
              </div>
              {productDTO.productImages.map((image, index) => (
                <div key={index} className="mb-2">
                  <TextInput
                    id={`image_${index}`}
                    type="string"
                    value={image.imagePath}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
              <Button color="info" onClick={handleAddImage}>Adicionar Imagem</Button>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="isActive" value="Ativo" />
              </div>
              <Select
                id="isActive"
                defaultValue={productDTO.active ? "true" : "false"}
                onChange={(e) => setProductDTO({ ...productDTO, active: e.target.value === "true" ? true : false })}
                required
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Select>
            </div>
            <div className="w-full flex justify-between">
              <Button type="submit" color="success">
                Criar
              </Button>

              <Button onClick={handleCloseModal}>Cancelar</Button>
            </div>
          </div>
          </form>
        </Modal.Body>
      </Modal>




      <Modal show={openUpdateModal} onClose={handleUpdateCloseModal}>
              <Modal.Header />
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Alterar Produto
                  </h3>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="productName" value="Nome do Produto" />
                    </div>
                    <TextInput
                      id="productName"
                      value={productDTO.productName}
                      onChange={(e) => setProductDTO({ ...productDTO, productName: e.target.value })}
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
                      value={productDTO.price.toString()}
                      onChange={(e) => setProductDTO({ ...productDTO, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="description" value="Descrição" />
                    </div>
                    <TextInput
                      id="description"
                      value={productDTO.description}
                      onChange={(e) => setProductDTO({ ...productDTO, description: e.target.value })}
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
                      value={productDTO.rating.toString()}
                      onChange={(e) => setProductDTO({ ...productDTO, rating: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="storage" value="Estoque" />
                    </div>
                    <TextInput
                      id="storage"
                      type="number"
                      value={productDTO.storage.toString()}
                      onChange={(e) => setProductDTO({ ...productDTO, storage: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label value="Links das Imagens" />
                    </div>
                    {productDTO.productImages.map((image, index) => (
                      <div key={index} className="mb-2">
                        <TextInput
                          id={`image_${index}`}
                          type="string"
                          value={image.imagePath}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                    <Button color="info" onClick={handleAddImage}>Adicionar Imagem</Button>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="isActive" value="Ativo" />
                    </div>
                    <Select
                      id="isActive"
                      defaultValue={productDTO.active ? "true" : "false"}
                      onChange={(e) => setProductDTO({ ...productDTO, active: e.target.value === "true" })}
                      required
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </Select>
                  </div>
                  <div className="w-full flex justify-between">
                    <Button type="submit" color="success">
                      Criar
                    </Button>

                    <Button onClick={handleCloseModal}>Cancelar</Button>
                  </div>
                </div>
                </form>
              </Modal.Body>
            </Modal>


















    </Wrapper>
  );
};

export default ListProducts;
