import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HiMiniPlus,
  HiOutlineInformationCircle,
  HiOutlineTrash,
} from "react-icons/hi2";
import { SiAirplayvideo } from "react-icons/si";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { isTokenExpired } from "@/services/authService";
import { getSpotifyId } from "@/utils/func/getSpotifyId";
import {
  addTracksToPlaylist,
  createPlaylist,
  getPlaylistInfo,
  getPlaylistTracks,
} from "@/services/playlistService";
import { LoadingSpinner } from "@/components/app/spinner";
import { toast } from "sonner";

const validationSchema = z.object({
  playlists: z
    .array(
      z.object({
        url: z
          .string()
          .regex(
            /^https:\/\/open\.spotify\.com\/playlist\/.*/,
            "Los links solo deben ser playlist, aún no se pueden agregar albumes o artistas."
          )
          .min(1, "El url de la playlist es obligatorio")
          .url("El link de la playlist debe ser válido."),
      })
    )
    .min(2, "Deben haber por lo menos 2 playlists"),
});

const MergeSection = () => {
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newPlaylistUrl, setNewPlaylistUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      playlists: [{ url: "" }, { url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "playlists",
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    setIsLoading(true);
    try {
      let newName = "Playlists Unidas";
      const newTraks: string[] = [];

      for (const playlist of values.playlists) {
        const playListId = await getSpotifyId(playlist.url);
        const playListInfo = await getPlaylistInfo(playListId ?? "");
        const playListTracks = await getPlaylistTracks(playListId ?? "");

        newName += ` - ${playListInfo?.name}`;

        for (const track of playListTracks) {
          newTraks.push(`spotify:track:${track.id}`);
        }
      }

      const newId = await createPlaylist(newName);

      const response = await addTracksToPlaylist(newId ?? "", newTraks);

      if (response) {
        setNewPlaylistUrl(
          `https://open.spotify.com/embed/playlist/${newId}?utm_source=generator`
        );
      }

      toast("Playlist Creada");

      form.reset();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setDisable(isTokenExpired());
  }, []);

  return (
    <>
      <section className="py-12 bg-gradient-to-r from-green-500 to-blue-500 dark:bg-gray-950">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-row">
                    <SiAirplayvideo className="text-2xl font-bold text-white mr-2" />

                    <h2 className="text-2xl font-bold text-white">
                      Merge Playlists
                    </h2>
                  </div>
                  <p className="text-gray-200 dark:text-gray-400">
                    Ingrese las URL de las listas de reproducción que desea
                    fusionar.
                  </p>
                </div>
                <div className="grid gap-2">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <div className="flex flex-row justify-between">
                        <FormField
                          control={form.control}
                          name={`playlists.${index}.url`}
                          render={({ field }) => (
                            <FormItem className="w-3/4">
                              <FormLabel className="text-white">
                                Playlist {index + 1}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  disabled={disable}
                                  placeholder="https://open.spotify.com/playlist/..."
                                  className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200 w-full"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-gray-200">
                                <a
                                  href="https://support.spotify.com/es/artists/article/sharing-your-music/"
                                  className="flex flex-row"
                                  target="_blank"
                                >
                                  ¿Como obtener el link de una playlist?
                                  <HiOutlineInformationCircle />
                                </a>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => remove(index)}
                          title="Delete"
                          disabled={disable}
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto bg-red-300 border-red-300 text-red-800 hover:bg-red-800 hover:border-red-800 hover:text-white mt-8"
                        >
                          <HiOutlineTrash />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    disabled={disable}
                    onClick={() => {
                      append({ url: "" });
                    }}
                    type="button"
                    variant="outline"
                    className="w-full  my-10 sm:w-auto text-black border-gray-200 hover:bg-gray-200 hover:text-gray-800"
                  >
                    <HiMiniPlus className="w-4 h-4 mr-2" />
                    Agregar Playlist
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  {!isLoading ? (
                    <Button
                      type="submit"
                      disabled={disable}
                      className="w-full sm:w-auto bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                    >
                      Merge Playlists
                    </Button>
                  ) : (
                    <LoadingSpinner className="w-full h-10 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </section>
      {newPlaylistUrl && (
        <section className="py-12 flex-1 bg-gradient-to-r from-green-500 to-blue-500 dark:bg-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Tu Nueva Playlist
                </h2>
                <p className="text-gray-200 dark:text-gray-400">
                  Una vista previa tu lista de reproducción recién creada.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src={newPlaylistUrl}
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default MergeSection;
