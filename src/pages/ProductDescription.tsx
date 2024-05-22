import { BiCart } from "react-icons/bi";
import Footer from "../components/Footer";
import { Button, Carousel as FlowbiteCarousel } from "flowbite-react";
import StarIcon from "../components/StarIcon";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Spinner } from "flowbite-react";

interface ProductImage {
  file: File | null;
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

export default function ProductDescription() {
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const { productId } = useParams<{ productId: string }>();
  const [addingToCart, setAddingToCart] = useState(false);
  const [notificationModal, setNotificationModal] = useState({
    show: false,
    title: '',
    message: '',
  }); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/products/productId/${productId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);

          // Convert the image data to base64 format if not already done
          const updatedData: ProductDTO = {
            ...data,
            productImages: data.productImages.map((image: ProductImage) => ({
              ...image,
              imageData: image.imageData.startsWith("data:")
                ? image.imageData
                : `data:image/jpeg;base64,${image.imageData}`,
            })),
          };

          setProduct(updatedData);
        } else {
          console.error("Erro ao buscar detalhes do produto:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/cart/addItem/${productId}?quantity=1`, {
        method: "POST",
      });

      if (response.ok) {
        setNotificationModal({
          show: true,
          title: 'Sucesso',
          message: 'Produto adicionado ao carrinho com sucesso!',
        });
      } else {
        setNotificationModal({
          show: true,
          title: 'Erro',
          message: 'Erro ao adicionar produto ao carrinho. Por favor, tente novamente.',
        });
      }
    } catch (error) {
      setNotificationModal({
        show: true,
        title: 'Erro',
        message: 'Erro ao adicionar produto ao carrinho. Por favor, tente novamente.',
      });
      console.error("Erro ao adicionar produto ao carrinho:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (!product) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex-grow">
        <div className="p-20">
          <div className="grid place-items-center h-56 grid-cols-2 gap-8 sm:h-64 xl:h-80 2xl:h-96">
            <FlowbiteCarousel slideInterval={5000}>
              {product.productImages &&
                product.productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.imageData}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ))}
            </FlowbiteCarousel>
            <div className="dark:text-white flex flex-col">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {product.productName}
              </h2>
              <div className="flex flex-row mb-4">
                {[...Array(Math.round(product.rating))].map((_, index) => (
                  <StarIcon key={index} />
                ))}
                <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                  {product.rating}
                </span>
              </div>
              <p className="mb-16 line-clamp-6">{product.description}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                R$ {product.price.toFixed(2)}
              </h3>
              <Button
                onClick={handleAddToCart}
                className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    Adicionar ao carrinho
                    <BiCart size={24} className="ms-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Notification Modal */}
      <Modal
        className="text-white"
        show={notificationModal.show}
        onClose={() => setNotificationModal({ show: false, title: '', message: '' })}
      >
        <Modal.Header>{notificationModal.title}</Modal.Header>
        <Modal.Body>
          <p>{notificationModal.message}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}