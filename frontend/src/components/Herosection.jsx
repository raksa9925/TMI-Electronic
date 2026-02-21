import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Image1 from '../assets/Image/Laptop/18.jpg';
import Image2 from '../assets/Image/Laptop/25.jpg';
import Image3 from '../assets/Image/Laptop/19.jpg';
import Image4 from '../assets/Image/Laptop/21.jpg';
import Image5 from '../assets/Image/Laptop/29.jpg';
import Image6 from '../assets/Image/Laptop/23.jpg';
import Image7 from '../assets/Image/Laptop/24.jpg';
import Image8 from '../assets/Image/Laptop/27.jpg';

const heroData = [
  { image: Image1, title: "Headphones", price: 99 },
  { image: Image2, title: "Desktop Computers", price: 799 },
  { image: Image3, title: "Laptop", price: 499 },
  { image: Image4, title: "Laptop", price: 520 },
  { image: Image5, title: "Laptop", price: 550 },
  { image: Image6, title: "Laptop", price: 530 },
  { image: Image7, title: "Laptop", price: 600 },
  { image: Image8, title: "Laptop", price: 480 },
];

function HeroSection() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 🔁 AUTO SLIDE EVERY 3 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroData.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🧭 SCROLL WHEN INDEX CHANGES
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: currentIndex * window.innerWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="
      mt-20
        w-full flex snap-x snap-mandatory overflow-x-hidden
        h-[220px] sm:h-[300px] md:h-[450px] lg:h-[550px] xl:h-[600px]
      "
    >
      {heroData.map((item, index) => (
        <div
          key={index}
          className="relative flex-shrink-0 snap-start w-full"
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: window.innerWidth < 640 ? "contain" : "cover",
          }}
        />
      ))}
    </div>
  );
}

export default HeroSection;
