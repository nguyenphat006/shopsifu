import { useEffect, useState } from "react";

export function useCheckDevice(breakpoint: number = 768): "mobile" | "laptop" | "unknown" {
  const [deviceType, setDeviceType] = useState<"mobile" | "laptop" | "unknown">("unknown");

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod|webos|blackberry|windows phone/.test(userAgent);
      const isSmallScreen = window.innerWidth <= breakpoint;

      if (isMobileDevice || isSmallScreen) {
        setDeviceType("mobile");
      } else {
        setDeviceType("laptop");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, [breakpoint]);

  return deviceType;
}