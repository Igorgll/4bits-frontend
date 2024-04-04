import { useState } from "react";
import Wrapper from "./Wrapper";
import { Label, TextInput, Select } from "flowbite-react";
import { Button, Modal } from "flowbite-react";
import { ProductModel } from "./ProductModel";

const CreateProduct = () => {
  const [openModal, setOpenModal] = useState(false);
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

  return (
    <Wrapper className="bg-[#111827]">
      <Button onClick={handleOpenModal}>Criar Produto</Button>
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
              <Button color="success" onClick={handleCreateProduct}>
                Criar
              </Button>
              <Button onClick={handleCloseModal}>Cancelar</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Wrapper>
  );
};

export default CreateProduct;
