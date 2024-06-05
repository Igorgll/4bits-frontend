import React, { useState, useEffect } from "react";
import Wrapper from "./Wrapper";
import {
  FileInput,
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
import { BsEyeFill, BsTrash } from "react-icons/bs";
import ProductPreviewWindow from "./ProductPreviewWindow";
import { IoMdRefresh } from "react-icons/io";

interface ProductImage {
  file: File;
  imageData: string;
}

interface ProductDTO {
  productId: number;
  productName: string;
  price: number;
  description: string;
  rating: number;
  storage: number;
  productImages: ProductImage[];
  active: boolean;
}

const ListProducts = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [products, setProducts] = useState<ProductDTO[]>([]); // Estado para armazenar os dados dos produtos
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]); // Estado para armazenar os produtos filtrados
  const [openProductPreviewWindow, setOpenProductPreviewWindow] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  ); // Estado para armazenar o produto selecionado

  const [productDTO, setProductDTO] = useState<ProductDTO>({
    productId: 0,
    productName: "",
    price: 0,
    description: "",
    rating: 0,
    storage: 0,
    productImages: [],
    active: true,
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/products/all");
      if (response.ok) {
        const data: any[] = await response.json();
        const convertedData: ProductDTO[] = data.map((product) => ({
          productId: product.productId,
          productName: product.productName,
          price: product.price,
          description: product.description,
          rating: product.rating,
          storage: product.storage,
          productImages: product.productImages.map(
            (image: { imageData: string }) => ({
              ...image,
              imageData: `data:image/jpeg;base64,${image.imageData}`,
            })
          ),
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenUpdateModal = (product: ProductDTO) => {
    setSelectedProduct(product);
    setProductDTO({
      ...product,
      productImages: product.productImages.map((image) => ({ ...image })),
    });
    console.log(product);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        file,
        imageData: URL.createObjectURL(file),
      }));
      const newProductImages = [...productDTO.productImages, ...filesArray];
      setProductDTO({ ...productDTO, productImages: newProductImages });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newProductImages = productDTO.productImages.filter(
      (_, i) => i !== index
    );
    setProductDTO({ ...productDTO, productImages: newProductImages });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      productDTO.productImages.forEach((image, index) => {
        formData.append("images", image.file);
      });
      Object.entries(productDTO).forEach(([key, value]) => {
        if (key !== "productImages") {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(
        "http://localhost:8080/api/v1/products/createProduct",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Produto cadastrado com sucesso");
        handleCloseModal();
        fetchProducts();
      } else {
        console.error("Falha ao cadastrar o produto");
      }
    } catch (error) {
      console.error("Erro ao cadastrar o produto:", error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      try {
          const formData = new FormData();
          productDTO.productImages.forEach((image, index) => {
              formData.append("images", image.file);
          });
          formData.append("productName", productDTO.productName);
          formData.append("price", productDTO.price.toString());
          formData.append("description", productDTO.description);
          formData.append("rating", productDTO.rating.toString());
          formData.append("storage", productDTO.storage.toString());
          formData.append("active", productDTO.active.toString());

          const response = await fetch(
              `http://localhost:8080/api/v1/products/updateProduct/${selectedProduct.productId}`,
              {
                  method: "PUT",
                  body: formData,
              }
          );

          if (response.ok) {
              console.log("Produto atualizado com sucesso");
              handleCloseUpdateModal();
              fetchProducts();
          } else {
              console.error("Falha ao atualizar o produto");
          }
      } catch (error) {
          console.error("Erro ao atualizar o produto:", error);
      }
  };

  const handleChangeProductStatus = async (
    productId: number,
    active: boolean
  ) => {
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
        console.error(
          "Falha ao mudar o status do produto:",
          response.statusText
        );
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

  const handleUpdateData = () => {
    fetchProducts();
    setFilteredProducts([]);
  };

  const handleSelectProduct = (product: ProductDTO) => {
    setSelectedProduct(product);
    console.log(product);
    setOpenProductPreviewWindow(true);
  };

  return (
    <Wrapper className="bg-[#111827]">
      <SearchBar onSearch={handleSearch} onOpenModal={handleOpenModal} />

      <Table striped>
        <TableHead>
          <TableHeadCell>Nome</TableHeadCell>
          <TableHeadCell>Preço</TableHeadCell>
          <TableHeadCell>Descrição</TableHeadCell>
          <TableHeadCell>Avaliação</TableHeadCell>
          <TableHeadCell>Estoque</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>
            <div className="flex items-center justify-center">
              <IoMdRefresh
                size={22}
                color="white"
                cursor={"pointer"}
                onClick={handleUpdateData}
              />
            </div>
          </TableHeadCell>
          <TableHeadCell></TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {filteredProducts.length === 0
            ? products.map((product, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {product.productName}
                  </TableCell>
                  <TableCell className="text-center">{product.price}</TableCell>
                  <TableCell>
                    <p className="line-clamp-2 max-w-96">
                      {product.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.rating}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.storage}
                  </TableCell>
                  <TableCell>
                    <a
                      onClick={() =>
                        handleChangeProductStatus(
                          product.productId,
                          !product.active
                        )
                      }
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
                      onClick={() => handleOpenUpdateModal(product)}
                      href="#"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Alterar
                    </a>
                  </TableCell>
                  <TableCell>
                    <BsEyeFill
                      color="#cecece"
                      cursor={"pointer"}
                      onClick={() => handleSelectProduct(product)}
                    />
                  </TableCell>
                </TableRow>
              ))
            : filteredProducts.map((product, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {product.productName}
                  </TableCell>
                  <TableCell>R$ {product.price}</TableCell>
                  <TableCell>
                    <p className="line-clamp-2 max-w-96">
                      {product.description}
                    </p>
                  </TableCell>
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
              ))}
        </TableBody>
      </Table>

      {selectedProduct && (
        <ProductPreviewWindow
          isOpen={openProductPreviewWindow}
          onClose={() => setOpenProductPreviewWindow(false)}
          productName={selectedProduct.productName}
          price={selectedProduct.price}
          description={selectedProduct.description}
          rating={selectedProduct.rating}
          productImages={selectedProduct.productImages}
        />
      )}

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
                  onChange={(e) =>
                    setProductDTO({
                      ...productDTO,
                      productName: e.target.value,
                    })
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
                  value={productDTO.price.toString()}
                  onChange={(e) =>
                    setProductDTO({
                      ...productDTO,
                      price: parseFloat(e.target.value),
                    })
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
                  value={productDTO.description}
                  onChange={(e) =>
                    setProductDTO({
                      ...productDTO,
                      description: e.target.value,
                    })
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
                  value={productDTO.rating.toString()}
                  onChange={(e) =>
                    setProductDTO({
                      ...productDTO,
                      rating: parseFloat(e.target.value),
                    })
                  }
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
                  onChange={(e) =>
                    setProductDTO({
                      ...productDTO,
                      storage: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label value="Imagens" />
                </div>
                <div className="flex-1 h-full">
                  <FileInput
                    id="multiple-file-upload"
                    multiple
                    helperText="Selecione apenas imagens com extensão JPG, JPEG e PNG"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="isActive" value="Ativo" />
                </div>
                <Select
                  id="isActive"
                  defaultValue={productDTO.active ? "true" : "false"}
                  onChange={(e) =>
                    setProductDTO({
                      ...productDTO,
                      active: e.target.value === "true" ? true : false,
                    })
                  }
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

      {/* MODAL DE ALTERAR PRODUTO */}
      <Modal show={openUpdateModal} onClose={handleCloseUpdateModal}>
        {selectedProduct && (
          <>
            <Modal.Header />
            <Modal.Body>
              <form onSubmit={handleUpdateSubmit}>
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
                      value={
                        productDTO.productName || selectedProduct.productName
                      }
                      onChange={(e) =>
                        setProductDTO({
                          ...productDTO,
                          productName: e.target.value,
                        })
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
                      value={productDTO.price || selectedProduct.price}
                      onChange={(e) =>
                        setProductDTO({
                          ...productDTO,
                          price: parseFloat(e.target.value),
                        })
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
                      value={
                        productDTO.description || selectedProduct.description
                      }
                      onChange={(e) =>
                        setProductDTO({
                          ...productDTO,
                          description: e.target.value,
                        })
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
                      value={productDTO.rating || selectedProduct.rating}
                      onChange={(e) =>
                        setProductDTO({
                          ...productDTO,
                          rating: parseFloat(e.target.value),
                        })
                      }
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
                      value={productDTO.storage || selectedProduct.storage}
                      onChange={(e) =>
                        setProductDTO({
                          ...productDTO,
                          storage: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label value="Links das Imagens" />
                    </div>
                    <FileInput
                      id="multiple-file-upload"
                      multiple
                      helperText="Selecione apenas imagens com extensão JPG, JPEG e PNG"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {productDTO.productImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.imageData}
                          alt={`Produto ${index + 1}`}
                          className="w-20 h-20 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <BsTrash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="isActive" value="Ativo" />
                    </div>
                    <Select
                      id="isActive"
                      defaultValue={selectedProduct.active ? "true" : "false"}
                      onChange={(e) =>
                        setProductDTO({
                          ...productDTO,
                          active: e.target.value === "true" ? true : false,
                        })
                      }
                      required
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </Select>
                  </div>
                  <div className="w-full flex justify-between">
                    <Button type="submit" color="success">
                      Alterar
                    </Button>

                    <Button onClick={handleCloseUpdateModal}>Cancelar</Button>
                  </div>
                </div>
              </form>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Wrapper>
  );
};

export default ListProducts;
