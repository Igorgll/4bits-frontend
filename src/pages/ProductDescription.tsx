import { BiCart } from "react-icons/bi";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Carousel as FlowbiteCarousel } from "flowbite-react";
import StarIcon from "../components/StarIcon";


export default function ProductDescription(){
  return (
    <div className="bg-[#111827]">
      <Navbar />
        <div className="p-20">
          <div className="grid h-56 grid-cols-2 gap-8 sm:h-64 xl:h-80 2xl:h-96">
          <FlowbiteCarousel slideInterval={5000}>
            <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
            <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
            <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
            <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
            <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
          </FlowbiteCarousel>
        <div className="dark:text-white flex flex-col">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Xbox Game Pass</h2>
            <div className="flex flex-row mb-4">
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </div>
          <p className="mb-28 line-clamp-8">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat molestiae hic ipsa ullam, magnam aspernatur minus beatae labore recusandae pariatur sed tempore delectus eos natus mollitia maxime et quis asperiores.
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat molestiae hic ipsa ullam.</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">R$ 250.00</h3>
          <a
            href="#"
            className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            Adicionar ao carrinho
          </a>
        </div>
      </div>
        </div>
      <Footer />
    </div>
  );
}