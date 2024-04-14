import { BiCart } from "react-icons/bi";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button, Carousel as FlowbiteCarousel } from "flowbite-react";
import StarIcon from "../components/StarIcon";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

export default function ProductDescription() {
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/products/productId/${productId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProduct(data);
        } else {
          console.error("Erro ao buscar detalhes do produto:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <Navbar />
      <div className="flex-grow">
        <div className="p-20">
          <div className="grid place-items-center h-56 grid-cols-2 gap-8 sm:h-64 xl:h-80 2xl:h-96">
            <FlowbiteCarousel slideInterval={5000}>
              {product.productImages &&
                product.productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.imagePath}
                    alt={`Product Image ${index + 1}`}
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
              </div>
              <p className="mb-16 line-clamp-6">{product.description}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                R$ {product.price.toFixed(2)}
              </h3>
              <Button
                href="#"
                className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                disabled
              >
                Adicionar ao carrinho
                <BiCart size={24} className="ms-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}