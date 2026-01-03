export const inAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  return /instagram|fbav|fbios|fban|fb_iab|bytedance|musical\.ly|aweme|tiktok/i.test(ua);
};
