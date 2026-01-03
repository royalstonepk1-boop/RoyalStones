// utils/inAppBrowserDetector.js

export const inAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /tiktok|instagram|fbav|fbios|fban|fb_iab/i.test(ua);
  };
  
  export const detectSpecificPlatform = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/tiktok/i.test(ua)) return 'TikTok';
    if (/instagram/i.test(ua)) return 'Instagram';
    if (/fbav|fbios|fban|fb_iab/i.test(ua)) return 'Facebook';
    
    return 'this app';
  };
  
  export const openInExternalBrowser = () => {
    const currentUrl = window.location.href;
    
    // Try different methods to open in external browser
    const schemes = [
      `googlechrome://navigate?url=${encodeURIComponent(currentUrl)}`, // Chrome on iOS
      `firefox://open-url?url=${encodeURIComponent(currentUrl)}`, // Firefox
      currentUrl // Fallback
    ];
    
    // Attempt to open in external browser
    // Note: This rarely works, but worth trying
    schemes.forEach((scheme, index) => {
      setTimeout(() => {
        window.location.href = scheme;
      }, index * 100);
    });
    
    return false; // Prevent default behavior
  };