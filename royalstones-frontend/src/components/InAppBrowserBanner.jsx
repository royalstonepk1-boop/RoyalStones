import { detectSpecificPlatform } from "../util/inAppBrowserDetector";

export default function InAppBrowserBanner({ onClose }) {
  const platform = detectSpecificPlatform();
  
  const getInstructions = () => {
    switch (platform) {
      case 'TikTok':
        return "Tap the three dots (•••) at the top right, then select 'Open in browser'";
      case 'Instagram':
        return "Tap the three dots (•••) at the top right, then select 'Open in external browser'";
      case 'Facebook':
        return "Tap the three dots (•••) menu and select 'Open in Chrome' or 'Open in Safari'";
      default:
        return "Please open this page in your default browser (Chrome, Safari, etc.)";
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            {/* Warning Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1">
                Cannot Sign In from {platform}
              </h3>
              <p className="text-sm text-red-50 mb-2">
                Google authentication is blocked in {platform}'s browser for security reasons.
              </p>
              <div className="bg-red-700 bg-opacity-50 rounded-lg p-3 mb-2">
                <p className="text-sm font-semibold mb-1">
                  💡 How to fix:
                </p>
                <p className="text-sm text-red-50">
                  {getInstructions()}
                </p>
              </div>
            </div>
            
            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 text-white hover:text-red-100 transition-colors p-1"
                aria-label="Close banner"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}