"use client"

import { PrismicImage, PrismicText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { asImageSrc } from "@prismicio/client";
import { useEffect } from "react";
import { FadeIn } from "@/components/FadeIn";

const GameSelector = ({ slice }) => {

const routesByIndex = [
  "/mtg-page",
  "/pokemon-page",  
  "/lorcana-page",  
  "/yugioh-page"
];
  useEffect(() => {
    const wrappers = document.querySelectorAll('.card-wrapper');

    function handleHover(wrapper, x, y) {
      const card = wrapper.querySelector('.game-card');
      const shine = wrapper.querySelector('.shine');
      const rect = wrapper.getBoundingClientRect();

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      const shiftX = ((x / rect.width) - 0.5) * 10;
      const shiftY = ((y / rect.height) - 0.5) * 10;

      card.style.transform = `translateX(${shiftX}px) translateY(${shiftY}px)`;
      card.style.setProperty('--pointer-x', `${percentX}%`);
      card.style.setProperty('--pointer-y', `${percentY}%`);
      
      if (shine) {
        shine.style.opacity = '1';
      }
    }

    function resetCard(wrapper) {
      const card = wrapper.querySelector('.game-card');
      const shine = wrapper.querySelector('.shine');
      
      const baseTransform = card.dataset.baseTransform || 'translateX(0) translateY(0)';
      card.style.transform = baseTransform;
      
      if (shine) {
        shine.style.opacity = '0';
      }
    }

    wrappers.forEach(wrapper => {
      wrapper.addEventListener('mousemove', e => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleHover(wrapper, x, y);
      });

      wrapper.addEventListener('mouseleave', () => {
        resetCard(wrapper);
      });
    });

    return () => {
      wrappers.forEach(wrapper => {
        wrapper.replaceWith(wrapper.cloneNode(true));
      });
    };
  }, []);

  const getArchRotation = (index, total) => {
    if (total === 1) return { rotation: 0, yOffset: 0 };
    const mid = (total - 1) / 2;
    const offset = index - mid;
    const rotation = offset * 4;
    
    const distanceFromCenter = Math.abs(offset);
    const yOffset = -distanceFromCenter * 20; 
    
    return { rotation, yOffset };
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <FadeIn className="flex flex-col justify-center items-center">
        <h2 className="font-bold-slanted text-white mb-8 scroll-pt-6 text-6xl uppercase md:text-8xl text-center background-black text-pretty mt-4 text-center">
          {slice.primary.title}
        </h2>
      </FadeIn>
      
      <h2 className="font-bold-slanted text-white mb-8 scroll-pt-6 text-6xl uppercase md:text-5xl text-center background-black text-pretty mt-4">
        <PrismicText field={slice.primary.description} />
      </h2>
      
      <FadeIn>
        <div className="selector-container 
                        grid grid-cols-2 gap-4 justify-items-center
                        sm:gap-6
                        lg:flex lg:flex-row lg:gap-4 lg:justify-center lg:items-end 
                        w-full px-4 max-w-7xl mx-auto">
          {slice.primary.games.map((item, index) => {
            const { rotation, yOffset } = getArchRotation(index, slice.primary.games.length);
            const backgroundUrl = asImageSrc(item.cardback);
            
            return (
                <PrismicNextLink 
                  key={index} 
                  href={routesByIndex[index] || "/"} 
                  className="block w-full max-w-[180px] lg:max-w-none"
                >
                <div 
                  className="card-wrapper 
                             w-full aspect-[2/3]
                             lg:w-[20vw] lg:h-[55vh] lg:aspect-auto"
                  style={{ perspective: '1200px' }}
                >
                  <div 
                    className="game-card relative overflow-hidden rounded-xl transition-transform duration-150 ease-out w-full h-full"
                    data-base-transform={`rotateZ(${rotation}deg) translateY(${yOffset}px)`}
                    style={{
                      transform: window.innerWidth >= 1024 
                        ? `rotateZ(${rotation}deg) translateY(${yOffset}px)` 
                        : 'none',
                      backgroundImage: `url(${backgroundUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <div 
                      className="shine absolute inset-0 pointer-events-none transition-opacity duration-200"
                      style={{
                        background: 'radial-gradient(circle 60vh at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 30%, rgba(255, 255, 255, 0) 60%)',
                        mixBlendMode: 'overlay',
                        opacity: 0,
                      }}
                    />
                  </div>
                </div>
                {item.gamename && (
                  <div className="text-center mt-2 text-white text-sm lg:text-base">
                    {item.gamename}
                  </div>
                )}
              </PrismicNextLink>
            );
          })}
        </div>
      </FadeIn>
    </section>
  );
};

export default GameSelector;