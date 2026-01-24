// components/PageWrapper.jsx
import { useEffect } from "react";

export default function PageWrapper({ children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}