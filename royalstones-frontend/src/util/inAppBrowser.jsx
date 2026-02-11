export const inAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  // Check for social media in-app browsers AND Android WebView
  const isInApp = /instagram|fbav|fbios|fban|fb_iab|bytedance|musical\.ly|aweme|tiktok/i.test(ua);
  
  // Check for Android WebView
  const isWebView = /wv|WebView/i.test(ua) && /Android/i.test(ua);
  
  return isInApp || isWebView;
};