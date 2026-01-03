export const inAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return(
        /tiktok|instagram|fbav|fbios|fban|fb_iab/i.test(ua)
    )
}