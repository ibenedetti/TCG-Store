'use client'; 

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; 
import Loader from './Loader';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const AppWrapper = ({ children }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowLoader(false);
      setIsInitialMount(false); 
    }, 3000); 

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (isInitialMount) {
      return; 
    }

    setShowLoader(true);

    const navTimer = setTimeout(() => {
      setShowLoader(false);
    }, 1500); 

    return () => clearTimeout(navTimer);
    
  }, [pathname, isInitialMount]); 

  return (
    <>
      {showLoader && <Loader />}
      
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default AppWrapper;