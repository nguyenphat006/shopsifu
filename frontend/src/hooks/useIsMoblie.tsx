import { useState, useEffect } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 640); // Adjust the width as needed for mobile
      };
    
      handleResize(); // Check on initial render
      window.addEventListener("resize", handleResize);
   
      return () => {  
        window.removeEventListener("resize", handleResize);
      };  
    }, []);
  
    return isMobile;
  }