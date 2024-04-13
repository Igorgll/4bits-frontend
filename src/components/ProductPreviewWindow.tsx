import { Modal } from "flowbite-react";
import ProductDescriptionPreview from "./ProductDescriptionPreview";

interface ProductPreviewWindowProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number;
  description: string;
  rating: number;
  productImages: { imagePath: string }[];
}

export default function ProductPreviewWindow({
  isOpen,
  onClose,
  productName,
  price,
  description,
  rating,
  productImages,
}: ProductPreviewWindowProps) {
  return (
    <>
      <Modal show={isOpen} size={"7xl"} onClose={onClose}>
        <Modal.Header>Preview do Produto</Modal.Header>
        <Modal.Body className="p-2">
          <div className="space-y-1">
            <ProductDescriptionPreview
              productName={productName}
              price={price}
              description={description}
              rating={rating}
              productImages={productImages}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
