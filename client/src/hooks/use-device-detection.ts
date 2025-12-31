import { useState, useEffect, useCallback } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type OrientationType = 'portrait' | 'landscape';

interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    deviceType: DeviceType;
    screenWidth: number;
    screenHeight: number;
    isTouchDevice: boolean;
    orientation: OrientationType;
    isSmallMobile: boolean; // < 375px
    isLargeMobile: boolean; // 375-768px
    pixelRatio: number;
}

const BREAKPOINTS = {
    smallMobile: 375,
    mobile: 768,
    tablet: 1024,
} as const;

/**
 * Hook to detect device type and screen characteristics
 * Automatically adds device classes to body element
 * @returns DeviceInfo object with device detection data
 */
export function useDeviceDetection(): DeviceInfo {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());

    const handleResize = useCallback(() => {
        const newInfo = getDeviceInfo();
        setDeviceInfo(newInfo);
        updateBodyClasses(newInfo);
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
            // Cleanup body classes on unmount
            cleanupBodyClasses();
        };
    }, [handleResize]);

    return deviceInfo;
}

/**
 * Update body element with device-specific classes
 */
function updateBodyClasses(info: DeviceInfo): void {
    if (typeof document === 'undefined') return;

    const body = document.body;

    // Remove all device classes first
    body.classList.remove(
        'is-mobile', 'is-tablet', 'is-desktop',
        'is-touch-device', 'is-small-mobile', 'is-large-mobile',
        'is-portrait', 'is-landscape', 'is-retina'
    );

    // Add device type class
    body.classList.add(`is-${info.deviceType}`);

    // Add touch device class
    if (info.isTouchDevice) {
        body.classList.add('is-touch-device');
    }

    // Add mobile size classes
    if (info.isSmallMobile) {
        body.classList.add('is-small-mobile');
    } else if (info.isLargeMobile) {
        body.classList.add('is-large-mobile');
    }

    // Add orientation class
    body.classList.add(`is-${info.orientation}`);

    // Add retina class for high DPI screens
    if (info.pixelRatio >= 2) {
        body.classList.add('is-retina');
    }
}

/**
 * Cleanup body classes on unmount
 */
function cleanupBodyClasses(): void {
    if (typeof document === 'undefined') return;

    document.body.classList.remove(
        'is-mobile', 'is-tablet', 'is-desktop',
        'is-touch-device', 'is-small-mobile', 'is-large-mobile',
        'is-portrait', 'is-landscape', 'is-retina'
    );
}

function getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
        return {
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            deviceType: 'desktop',
            screenWidth: 1920,
            screenHeight: 1080,
            isTouchDevice: false,
            orientation: 'landscape',
            isSmallMobile: false,
            isLargeMobile: false,
            pixelRatio: 1,
        };
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const pixelRatio = window.devicePixelRatio || 1;
    const orientation: OrientationType = screenWidth > screenHeight ? 'landscape' : 'portrait';

    // Check user agent for more accurate mobile detection
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTabletUA = /ipad|tablet|playbook|silk/i.test(userAgent);

    let deviceType: DeviceType;
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;
    let isSmallMobile = false;
    let isLargeMobile = false;

    if (screenWidth < BREAKPOINTS.smallMobile) {
        deviceType = 'mobile';
        isMobile = true;
        isSmallMobile = true;
    } else if (screenWidth < BREAKPOINTS.mobile || (isMobileUA && !isTabletUA)) {
        deviceType = 'mobile';
        isMobile = true;
        isLargeMobile = true;
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
        screenHeight,
        isTouchDevice,
        orientation,
        isSmallMobile,
        isLargeMobile,
        pixelRatio,
    };
}

export default useDeviceDetection;
