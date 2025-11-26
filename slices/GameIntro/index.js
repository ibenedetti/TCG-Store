'use client'
import { PrismicRichText } from "@prismicio/react";
import { asImageSrc } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { useState, useRef, useCallback, useEffect } from "react";
import {FadeIn} from "@/components/FadeIn";

/**
 * @typedef {import("@prismicio/client").Content.GameIntroSlice} GameIntroSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<GameIntroSlice>} GameIntroProps
 * @type {import("react").FC<GameIntroProps>}
 */
const GameIntro = ({ slice }) => {
  const [flippedCards, setFlippedCards] = useState({});
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [useGyroscope, setUseGyroscope] = useState(false);
  const [gyroscopeData, setGyroscopeData] = useState({ percentX: 50, percentY: 50, bgX: 50, bgY: 50, rotX: 0, rotY: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  const [cardInteraction, setCardInteraction] = useState({
    rotX: 0,
    rotY: 0,
    percentX: 50,
    percentY: 50,
    opacity: 0,
    bgX: 50,
    bgY: 50,
  });

  function adjust(value, fromMin, fromMax, toMin, toMax) {
    return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
  }

  function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
  }

  const flipTimeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
             ('ontouchstart' in window) || 
             (navigator.maxTouchPoints > 0);
    };
    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const requestGyroscope = () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              setUseGyroscope(true);
            }
          })
          .catch(console.error);
      } else if ('DeviceOrientationEvent' in window) {
        setUseGyroscope(true);
      }
    };

    document.body.addEventListener('click', requestGyroscope, { once: true });

    return () => {
      document.body.removeEventListener('click', requestGyroscope);
    };
  }, [isMobile]);

  // Handle gyroscope data
  useEffect(() => {
    if (!useGyroscope) return;

    const handleOrientation = (e) => {
      const gamma = e.gamma;
      const beta = e.beta;   
      
      const tiltX = clamp(gamma, -45, 45);
      const tiltY = clamp(beta - 45, -45, 45);
      
      const percentX = adjust(tiltX, -45, 45, 0, 100);
      const percentY = adjust(tiltY, -45, 45, 0, 100);
      
      const rotX = tiltY * 0.5;
      const rotY = tiltX * 0.5;
      
      const bgX = adjust(percentX, 0, 100, 37, 63);
      const bgY = adjust(percentY, 0, 100, 33, 67);

      setGyroscopeData({ percentX, percentY, bgX, bgY, rotX, rotY });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [useGyroscope]);

  const handleMouseMove = useCallback((e, index) => {
    if (isMobile) return; 
    if (activeCardIndex !== null && activeCardIndex !== index) return;

    const wrapper = e.currentTarget;
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotX = ((y / rect.height) - 1) * (flippedCards[index] ? 20 : -20);
    const rotY = ((x / rect.width) - 1) * (flippedCards[index] ? -20 : 20);

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    const bgX = adjust(percentX, 0, 100, 37, 63);
    const bgY = adjust(percentY, 0, 100, 33, 67);

    setActiveCardIndex(index);
    setCardInteraction({
      rotX,
      rotY,
      percentX,
      percentY,
      opacity: 1, 
      bgX,
      bgY,
    });
  }, [activeCardIndex, flippedCards, isMobile]);

  const handleTouchMove = useCallback((e, index) => {
    if (!isMobile) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const wrapper = e.currentTarget;
    const rect = wrapper.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const rotX = ((y / rect.height) - 0.5) * (flippedCards[index] ? 20 : -20);
    const rotY = ((x / rect.width) - 0.5) * (flippedCards[index] ? -20 : 20);

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    const bgX = adjust(percentX, 0, 100, 37, 63);
    const bgY = adjust(percentY, 0, 100, 33, 67);

    setActiveCardIndex(index);
    setCardInteraction({
      rotX,
      rotY,
      percentX,
      percentY,
      opacity: 1,
      bgX,
      bgY,
    });
  }, [flippedCards, isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return; 
    if (flipTimeoutRef.current === null) {
      setActiveCardIndex(null);
      setCardInteraction({
        rotX: 0,
        rotY: 0,
        percentX: 50,
        percentY: 50,
        opacity: 0,
        bgX: 50,
        bgY: 50,
      });
    }
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    if (flipTimeoutRef.current === null) {
      setActiveCardIndex(null);
      setCardInteraction({
        rotX: 0,
        rotY: 0,
        percentX: 50,
        percentY: 50,
        opacity: 0,
        bgX: 50,
        bgY: 50,
      });
    }
  }, [isMobile]);

  const handleCardClick = (index) => {
    const item = slice.primary.gamenews[index];
    
    const flipValue = item.flipselect && typeof item.flipselect === 'string' ? item.flipselect.toLowerCase() : '';
    const isFlippable = flipValue === 'yes';
    
    if (isFlippable) {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
      
      setActiveCardIndex(index);

      flipTimeoutRef.current = setTimeout(() => {
        setActiveCardIndex(null);
        flipTimeoutRef.current = null;
      }, 600); 

      setFlippedCards(prev => {
        const isCurrentlyFlipped = prev[index];

        setCardInteraction({ rotX: 0, rotY: 0, percentX: 50, percentY: 50, opacity: 0, bgX: 50, bgY: 50 });

        return {
          ...prev,
          [index]: !isCurrentlyFlipped 
        };
      });
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative pt-12 flex flex-col justify-center items-center"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full">
          <PrismicNextImage 
            field={slice.primary.gamebackground}
            className="w-full h-full object-cover object-top"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 70%, rgb(0,0,0) 100%)'
            }}
          />
        </div>
      </div>

      <div className="relative z-10 px-4">
        <FadeIn>
          <h2 className="font-bold-slanted text-white mb-8 scroll-pt-6 text-6xl uppercase md:text-8xl text-center text-pretty mt-4">
            {slice.primary.gametitle}
          </h2>

          <div className="text-white text-center mb-8">
            <PrismicRichText className="w-[30dvw] text-8xl" field={slice.primary.gamedescription} />
          </div>
        </FadeIn>

        <div className="set-container">
          <FadeIn className="flex flex-col justify-center items-center">
            <h3 className="font-bold-slanted text-white mb-8 scroll-pt-6 text-4xl uppercase md:text-4xl text-center w-[70dvw] text-pretty mt-4">
              {slice.primary.newstitle}
            </h3>
            <div className="news-description-container text-white text-center mb-8 text-2xl w-[70dvw]">
              <PrismicRichText field={slice.primary.newsdescription} />
            </div>
          </FadeIn>

          <div className="movingcards flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center flex-wrap py-8 md:mt-4 sm:mt-4 sm:gap-8">
            {slice.primary.gamenews.map((item, index) => {
              const isFlipped = flippedCards[index] || false;
              
              const foilValue = item.foil && typeof item.foil === 'string' ? item.foil.toLowerCase() : '';
              const isFoil = foilValue === 'yes'; 
              
              const flipValue = item.flipselect && typeof item.flipselect === 'string' ? item.flipselect.toLowerCase() : '';
              const isFlippable = flipValue === 'yes';
              
              const frontImage = asImageSrc(item.cardimg);
              const backImage = isFlippable ? asImageSrc(item.flippedimg) : null;

              const isCardActive = activeCardIndex === index;
              
              let currentInteraction;
              if (isCardActive) {
                currentInteraction = cardInteraction;
              } else if (useGyroscope && isMobile && activeCardIndex === null) {
                currentInteraction = { ...gyroscopeData, opacity: 1 };
              } else {
                currentInteraction = { rotX: 0, rotY: 0, percentX: 50, percentY: 50, opacity: 0, bgX: 50, bgY: 50 };
              }
              
              const hoverTransform = `rotateX(${currentInteraction.rotX || 0}deg) rotateY(${currentInteraction.rotY || 0}deg) translateZ(${isCardActive ? 30 : (useGyroscope && isMobile && activeCardIndex === null ? 30 : 0)}px)`;
              
              const finalTransform = isFlipped 
                ? `rotateX(${-(currentInteraction.rotX || 0)}deg) rotateY(${180 - (currentInteraction.rotY || 0)}deg) translateZ(${isCardActive ? 30 : (useGyroscope && isMobile && activeCardIndex === null ? 30 : 0)}px)`
                : hoverTransform;

              return (
                <div
                  key={index}
                  className="card-wrapper sm:mb-6"
                  style={{
                    width: '300px',
                    height: '504px',
                    perspective: '1200px',
                    cursor: isFlippable ? 'pointer' : 'default',
                    paddingBottom: '5vh!important',
                    touchAction: 'none'
                    
                  }}
                  onMouseMove={e => handleMouseMove(e, index)}
                  onMouseLeave={handleMouseLeave}
                  onTouchMove={e => handleTouchMove(e, index)}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => handleCardClick(index)} 
                >
                  <div
                    className={`game-card-inner ${isFlipped ? 'flipped' : ''} ${isCardActive && flipTimeoutRef.current ? 'flipping' : ''}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      transition: isFlippable ? 'transform 0.6s ease-out' : 'transform 0.15s ease-out',
                      transform: finalTransform
                    }}
                  >
                    {/* Front of card */}
                    <div
                      className="card-front"
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        backgroundImage: `url(${frontImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '12px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                        overflow: 'hidden',
                        '--pointer-x': `${currentInteraction.percentX || 50}%`,
                        '--pointer-y': `${currentInteraction.percentY || 50}%`,
                        '--background-x': `${currentInteraction.bgX || 50}%`,
                        '--background-y': `${currentInteraction.bgY || 50}%`,
                        '--card-opacity': `${currentInteraction.opacity || 0}`,
                      }}
                    >
                      {/* Foil effect with etching */}
                      {isFoil && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: `conic-gradient(from 180deg at 50% 50%,
                              #ff00ff 0deg, #00ffff 60deg, #ffff00 120deg, #ff0000 180deg, #00ff00 240deg, #0000ff 300deg, #ff00ff 360deg
                            )`,
                            backgroundSize: '200% 200%',
                            backgroundPosition: 'var(--background-x, 50%) var(--background-y, 50%)',
                            WebkitMask: 'url(/texture.png), linear-gradient(white, white)',
                            mask: 'url(/texture.png), linear-gradient(white, white)',
                            WebkitMaskSize: index % 2 === 0 ? '200%, 100%' : '50%, 100%',
                            maskSize: index % 2 === 0 ? '200%, 100%' : '50%, 100%',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            mixBlendMode: 'color-dodge',
                            opacity: 'calc(var(--card-opacity, 0) * 0.6)',
                            pointerEvents: 'none',
                            transition: 'background-position 0.08s ease-out, opacity 0.5s ease',
                            zIndex: 2
                          }}
                        />
                      )}

                      {/* Shine effect */}
                      <div
                        className="shine"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(circle 250px at var(--pointer-x, 50%) var(--pointer-y, 50%), 
                              rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 30%, rgba(255, 255, 255, 0) 60%)`,
                          mixBlendMode: 'overlay',
                          opacity: currentInteraction.opacity || 0,
                          pointerEvents: 'none',
                          transition: 'opacity 0.2s ease',
                          zIndex: 3
                        }}
                      />

                      {/* Glare effect */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 20%, transparent 50%)',
                          mixBlendMode: 'soft-light',
                          opacity: `calc(${currentInteraction.opacity || 0} * 0.5)`,
                          pointerEvents: 'none',
                          transition: 'opacity 0.2s ease',
                          zIndex: 4
                        }}
                      />
                    </div>

                    {/* Back of card (if flippable) */}
                    {isFlippable && backImage && (
                      <div
                        className="card-back"
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          backgroundImage: `url(${backImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: '12px',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                          transform: 'rotateY(180deg)',
                          overflow: 'hidden',
                          '--pointer-x': `${currentInteraction.percentX || 50}%`,
                          '--pointer-y': `${currentInteraction.percentY || 50}%`,
                        }}
                      >
                        {/* Shine effect on back */}
                        <div
                          className="shine"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(circle 250px at var(--pointer-x, 50%) var(--pointer-y, 50%), 
                                rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 30%, rgba(255, 255, 255, 0) 60%)`,
                            mixBlendMode: 'overlay',
                            opacity: currentInteraction.opacity || 0,
                            pointerEvents: 'none',
                            transition: 'opacity 0.2s ease',
                            zIndex: 3
                          }}
                        />

                        {/* Glare effect on back */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 20%, transparent 50%)',
                            mixBlendMode: 'soft-light',
                            opacity: `calc(${currentInteraction.opacity || 0} * 0.5)`,
                            pointerEvents: 'none',
                            transition: 'opacity 0.2s ease',
                            zIndex: 4
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Card name below */}
                  <div className="text-center mt-4">
                    <h4 className="text-white font-bold text-lg">
                      {isFlipped && item.flippedname ? item.flippedname : item.cardname}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .game-card-inner.flipping {
          pointer-events: none; 
        }
      `}</style>
    </section>
  );
};

export default GameIntro;