import { useEffect, useState } from "react";
import ProductSection from "./Productsection";
import HeroSection from "./Herosection";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(shuffle(all));
  }, []);

  return (
    <>
      <HeroSection/>
      <ProductSection products={products} />
    </>
  );
}

export default Home;
