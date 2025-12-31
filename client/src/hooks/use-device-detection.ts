import { useState, useEffect, useCallback } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    deviceType: DeviceType;
    screenWidth: number;
    isTouchDevice: boolean;
}

const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
} as const;

/**
 * Hook to detect device type and screen characteristics
 * @returns DeviceInfo object with device detection data
 */
export function useDeviceDetection(): DeviceInfo {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());

    const handleResize = useCallback(() => {
        setDeviceInfo(getDeviceInfo());
    }, []);

    useEffect(() => {
        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Listen for orientation changes (mobile)
        window.addEventListener('orientationchange', handleResize);

        // Initial check
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [handleResize]);

    return deviceInfo;
}

function getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
        return {
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            deviceType: 'desktop',
            screenWidth: 1920,
            isTouchDevice: false,
        };
    }

    const screenWidth = window.innerWidth;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check user agent for more accurate mobile detection
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTabletUA = /ipad|tablet|playbook|silk/i.test(userAgent);

    let deviceType: DeviceType;
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;

    if (screenWidth < BREAKPOINTS.mobile || (isMobileUA && !isTabletUA)) {
        deviceType = 'mobile';
        isMobile = true;
    } else if (screenWidth < BREAKPOINTS.tablet || isTabletUA) {
        deviceType = 'tablet';
        isTablet = true;
    } else {
        deviceType = 'desktop';
        isDesktop = true;
    }

    return {
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        screenWidth,
        isTouchDevice,
    };
}

export default useDeviceDetection;
