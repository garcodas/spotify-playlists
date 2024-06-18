import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const CookieNotice = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const hasCookieConsent = Cookies.get("cookieConsent");
    if (!hasCookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    Cookies.set("cookieConsent", "accepted", { expires: 365 }); // Store consent for 1 year
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    Cookies.set("cookieConsent", "rejected", { expires: 365 }); // Store consent for 1 year
    setIsVisible(false);
  };

  const handleHideNotice = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null; // If the notice is not visible, don't render anything
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <p className="mr-4">
        Utilizamos cookies para mejorar su experiencia. Al continuar visitando
        este sitio, acepta nuestro uso de cookies.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={handleAcceptAll}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Aceptar todo
        </button>
        <button
          onClick={handleRejectAll}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Rechazar todo
        </button>
        <button
          onClick={handleHideNotice}
          className="text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CookieNotice;
