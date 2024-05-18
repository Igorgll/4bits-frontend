import { BiCart } from "react-icons/bi";
import { Button, Carousel as FlowbiteCarousel } from "flowbite-react";
import StarIcon from "../components/StarIcon";

interface ProductDescriptionPreviewProps {
  productName: string;
  price: number;
  description: string;
  rating: number;
  productImages: { imageData: string }[];
}

const ProductDescriptionPreview: React.FC<ProductDescriptionPreviewProps> = ({
  productName,
  price,
  description,
  rating,
  productImages = [],
}) => {
  return (
    <div className="flex flex-col min-h-fit bg-[#111827]">
      <div className="p-8">
        <div className="grid place-items-center h-56 grid-cols-2 gap-8 sm:h-64 xl:h-80 2xl:h-96">
          <FlowbiteCarousel slideInterval={5000}>
            {productImages.map((image, index) => (
              <img
                key={index}
                src={image.imageData}
                alt={`Product Image ${index + 1}`}
              />
            ))}
          </FlowbiteCarousel>
          <div className="dark:text-white flex flex-col h-full relative">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {productName}
            </h2>
            <div className="flex flex-row mb-4">
              {[...Array(Math.round(rating))].map((_, index) => (
                <StarIcon key={index} />
              ))}
              <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                {rating}
              </span>
            </div>
            <p className="mb-6 line-clamp-6">{description}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              R$ {price}
            </h3>
            <div>
              <Button
                href="#"
                className="mb-8 absolute bottom-0 w-full rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                Adicionar ao carrinho
                <BiCart size={24} className="ms-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionPreview;
