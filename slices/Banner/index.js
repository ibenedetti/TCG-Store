"use client"

import { useState, useRef, useEffect } from "react";
import { PrismicImage, PrismicText } from "@prismicio/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Loader from "@/components/Loader";

const Banner = ({ slice }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const items = slice.primary.bannerentry;

  const prev = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    containerRef.current.scrollTo({
      left: newIndex * window.innerWidth,
      behavior: "smooth",
    });
  };

  const next = () => {
    const newIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(newIndex);
    containerRef.current.scrollTo({
      left: newIndex * window.innerWidth,
      behavior: "smooth",
    });
  };

  // Loader effect - shows for 3 seconds on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      setIsLoaded(true);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Auto-advance banner every 5 seconds
  useEffect(() => {
    if (!isLoaded) return; // Don't start auto-advance until loader is done

    const interval = setInterval(() => {
      next();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, items.length, isLoaded]);

  // Stagger animation for title and content
  useGSAP(() => {
    if (!isLoaded) return;

    const currentBanner = document.querySelector(`#banner-${currentIndex}`);
    const currentContent = document.querySelector(`#banner-content-${currentIndex}`);

    if (currentBanner && currentContent) {
      gsap.fromTo(
        currentBanner,
        { opacity: 0, y: -30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out"
        }
      );

      gsap.fromTo(
        currentContent,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          delay: 0.3, // Stagger delay
          ease: "power2.out"
        }
      );
    }
  }, [currentIndex, isLoaded]);

  if (showLoader) {
    return <Loader />;
  }

  return (
    <section className="relative overflow-hidden h-full">
      <div
        ref={containerRef}
        className="banner-container flex w-[100vw] overflow-x-hidden scroll-smooth gap-0 p-0 m-0"
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className="banner-content w-[100vw] flex-shrink-0"
          >
            <h2
              id={`banner-${index}`} 
              className="font-bold-slanted mb-8 scroll-pt-6 text-6xl uppercase md:text-5xl text-center background-black text-pretty mt-4"
            > 
              <PrismicText field={item.bannerinfo} />
            </h2>
            <div id={`banner-content-${index}`}>
              <PrismicImage field={item.bannerimg} />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
      >
        ▶
      </button>
    </section>
  );
};

export default Banner;