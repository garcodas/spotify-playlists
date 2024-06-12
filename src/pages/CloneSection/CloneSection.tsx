import { LoadingSpinner } from "@/components/app/spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isTokenExpired } from "@/services/authService";
import {
  addTracksToPlaylist,
  createPlaylist,
  getPlaylistInfo,
  getPlaylistTracks,
} from "@/services/playlistService";
import { getSpotifyId } from "@/utils/func/getSpotifyId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  HiMiniPlus,
  HiOutlineInformationCircle,
  HiOutlineTrash,
} from "react-icons/hi2";
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";

const validationSchema = z.object({
  playlist_url: z
    .string()
    .regex(
      /^https:\/\/open\.spotify\.com\/playlist\/.*/,
      "Los links solo deben ser playlist, aún no se pueden agregar albumes o artistas."
    )
    .min(1, "El url de la playlist es obligatorio")
    .url("El link de la playlist debe ser válido."),
  songs: z.array(
    z.object({
      url: z
        .string()
        .regex(
          /^https:\/\/open\.spotify\.com\/track\/.*/,
          "Los links solo deben ser canciones."
        )
        .min(1, "El url de la canción es obligatorio.")
        .url("El link de la canción debe ser válido."),
    })
  ),
});

const CloneSection = () => {
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newPlaylistUrl, setNewPlaylistUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      playlist_url: "",
      songs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "songs",
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    setIsLoading(true);
    try {
      const playListId = await getSpotifyId(values.playlist_url);
      const playListInfo = await getPlaylistInfo(playListId ?? "");
      const playListTracks = await getPlaylistTracks(playListId ?? "");

      const excludedSongs = new Set<string>();

      for (const song of values.songs) {
        const songId = await getSpotifyId(song.url);
        excludedSongs.add(songId ?? "");
      }

      const newTracks: string[] = [];

      for (const track of playListTracks) {
        if (!excludedSongs.has(track.id)) {
          newTracks.push(`spotify:track:${track.id}`);
        }
      }

      const newId = await createPlaylist(playListInfo?.name + " Clone");

      const response = await addTracksToPlaylist(newId ?? "", newTracks);

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
      <section className="py-12 bg-gradient-to-r from-blue-500 to-teal-500 dark:bg-gray-950">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-row">
                    <MdContentCopy className="text-2xl font-bold text-white" />

                    <h2 className="text-2xl font-bold text-white">
                      Clone Playlist
                    </h2>
                  </div>
                  <p className="text-gray-200 dark:text-gray-400">
                    Ingrese una URL de lista de reproducción de Spotify y,
                    opcionalmente, excluya canciones específicas.
                  </p>
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="playlist_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">
                          Playlist URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={disable}
                            placeholder="https://open.spotify.com/playlist/..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-200">
                          <a
                            href="https://support.spotify.com/es/artists/article/sharing-your-music/"
                            className="flex flex-row"
                            target="_blank"
                          >
                            ¿Como compartir una playlist?
                            <HiOutlineInformationCircle />
                          </a>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excluded-songs" className="text-gray-200">
                    Canciones excluidas
                  </Label>
                  <div className="grid gap-2">
                    {fields.map((field, index) => (
                      <div key={field.id}>
                        <div className="flex flex-row justify-between">
                          <FormField
                            control={form.control}
                            name={`songs.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="w-3/4">
                                <FormLabel className="text-white">
                                  Canción {index + 1}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://open.spotify.com/track/"
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
                                    ¿Como obtener el link de una canción?
                                    <HiOutlineInformationCircle />
                                  </a>
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            onClick={() => remove(index)}
                            disabled={disable}
                            title="Delete"
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
                      Agregar Canción
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {!isLoading ? (
                    <Button
                      disabled={disable}
                      type="submit"
                      className="w-full sm:w-auto bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                    >
                      Clonar Playlist
                    </Button>
                  ) : (
                    <LoadingSpinner className="w-full h-10 text-indigo-500" />
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </section>
      {newPlaylistUrl && (
        <section className="py-12 flex-1 bg-gradient-to-r from-blue-500 to-teal-500 dark:bg-gray-950">
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

export default CloneSection;
