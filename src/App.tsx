import { useEffect } from "react";
import "./App.css";
import CloneSection from "./pages/CloneSection/CloneSection";
import MergeSection from "./pages/MergeSection/MergeSection";
import UserSection from "./pages/UserSection/UserSection";
import { isTokenExpired } from "./services/authService";
import { toast } from "sonner";
import CookieNotice from "./pages/CookieNotice/CookieNotice";
import Footer from "./pages/Footer/Footer";
import { Analytics } from "@vercel/analytics/react";
function App() {
  useEffect(() => {
    if (isTokenExpired()) {
      // window.location.href = getAuthUrl();
      toast("Debes acceder con Spotify para empezar a clonar y unir playlists");
    }
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Analytics debug={false} />
        <CookieNotice />
        <UserSection />
        <CloneSection />
        <MergeSection />
        <Footer />
      </div>
    </>
  );
}

export default App;
