import { Card } from "flowbite-react";
import StarIcon from "./StarIcon";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importe Link do React Router

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

const ProductCard = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);

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

  return (
    <>
      {products.map((product) => (
        <Card
          key={product.productId}
          className="max-w-sm"
          imgAlt={product.productName}
          imgSrc={product.productImages[0].imagePath}
        >
          <Link to={`/description/${product.productId}`}> {/* Link para a página de detalhes do produto */}
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {product.productName}
            </h5>
          </Link>
          <div className="flex items-center mb-8">
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} />
            ))}
            <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
              {product.rating}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              R${product.price}
            </span>
            <Link
              to={`/description/${product.productId}`} // Link para a página de detalhes do produto
              className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Detalhes
            </Link>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ProductCard;
