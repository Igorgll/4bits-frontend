import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-[#111827]">
        <div className="container mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <ProductCard />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}