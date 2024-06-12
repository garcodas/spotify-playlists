import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/UserResponse";
import { getAuthUrl, getToken, getUserInfo } from "@/services/authService";
import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const UserSection = () => {
  const token = getToken();
  const [user, setUser] = useState<UserProfile | null>(null);

  const loadInfo = async () => {
    setUser(getUserInfo());
  };
  useEffect(() => {
    loadInfo();
  }, []);

  const redirect = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-500 py-12 dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Avatar className="w-20 h-20">
            {user?.images && <AvatarImage src={user?.images[1].url} />}
          </Avatar>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">
              {!token
                ? "Inicia con Spotify"
                : `Bienvenido ${user?.display_name}`}
            </h1>
            <p className="text-gray-200 dark:text-gray-400">
              Fusiona y clona tus listas de reproducción de Spotify con
              facilidad.
            </p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <div className="space-y-2">
              <div className="flex flex-col">
                {!token && (
                  <Button
                    onClick={() => {
                      redirect();
                    }}
                    variant="outline"
                    className="w-full max-w-md flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FaSpotify className="w-5 h-5" />
                    Iniciar con Spotify
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserSection;
