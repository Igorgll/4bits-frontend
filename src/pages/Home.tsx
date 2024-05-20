import React, { useState } from 'react';
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CartSlideOver from "../components/ShoppingCart";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleCart={toggleCart} />
      <div className="flex-grow bg-[#111827]">
        <div className="container mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <ProductCard />
          </div>
        </div>
      </div>
      <Footer />
      {cartOpen && <CartSlideOver setOpen={setCartOpen} />}
    </div>
  );
}