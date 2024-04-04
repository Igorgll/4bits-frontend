import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import React, { useState } from 'react';

export default function ModalUpdateProduct() {
  const [openModal, setOpenModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');
  const [storage, setStorage] = useState('');
  const [isActive, setIsActive] = useState(false);

  const onCloseModal = () => {
    setOpenModal(false);
  }

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Atualizar</Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Update Product</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="productName" value="Product Name" />
              </div>
              <TextInput
                id="productName"
                placeholder="Product Name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="price" value="Price" />
              </div>
              <TextInput
                id="price"
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <TextInput
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="rating" value="Rating" />
              </div>
              <TextInput
                id="rating"
                type="number"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="storage" value="Storage" />
              </div>
              <TextInput
                id="storage"
                type="number"
                value={storage}
                onChange={(event) => setStorage(event.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <Label htmlFor="isActive">Is Active</Label>
            </div>
            <div className="w-full">
              <Button>Atualizar produto</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
