import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  Loader2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { movieApi } from "../../api/MovieApi";
import { MovieResponse } from "../../types/Movie";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
} from "../../components/ui/card";

export function TrendingMovieTab() {
  const [movies, setMovies] = useState<
    MovieResponse[]
  >([]);
  const [loading, setLoading] =
    useState(true);
  const [updating, setUpdating] =
    useState(false);

  const fetchTrendingMovies =
    async () => {
      try {
        const response =
          await movieApi.getTrending();

        if (response.success) {
          setMovies(response.data ?? []);
        }
      } catch {
        toast.error(
          "Không thể tải danh sách phim nổi bật"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const onDragEnd = async (
    result: DropResult
  ) => {
    if (!result.destination) return;

    const items = [...movies];

    const [removed] = items.splice(
      result.source.index,
      1
    );

    items.splice(
      result.destination.index,
      0,
      removed
    );

    setMovies(items);

    try {
      setUpdating(true);

      await movieApi.reorder({
        movieIds: items.map(
          (movie) => movie.id
        ),
      });

      toast.success(
        "Cập nhật thứ tự thành công"
      );
    } catch {
      toast.error(
        "Cập nhật thứ tự thất bại"
      );

      fetchTrendingMovies();
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveTrending =
    async (movieId: number) => {
      try {
        await movieApi.removeTrending({
          movieIds: [movieId],
        });

        setMovies((prev) =>
          prev.filter(
            (movie) =>
              movie.id !== movieId
          )
        );

        toast.success(
          "Đã gỡ khỏi danh sách nổi bật"
        );
      } catch {
        toast.error(
          "Gỡ khỏi danh sách nổi bật thất bại"
        );
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Phim nổi bật
        </h1>

        <p className="text-gray-500">
          Kéo thả để thay đổi thứ tự hiển
          thị
        </p>
      </div>

      <Card className="bg-white border-gray-200 text-gray-900">
        <CardContent className="p-6">
          <DragDropContext
            onDragEnd={onDragEnd}
          >
            <Droppable droppableId="movies">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="overflow-x-auto"
                >
                  <table className="w-full text-gray-900">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="w-12 py-4 px-4" />

                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                          STT
                        </th>

                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                          Tên phim
                        </th>

                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                          Poster
                        </th>

                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                          Director
                        </th>

                        <th className="text-center py-4 px-4 text-sm font-medium text-gray-500">
                          Hành động
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {movies.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            Chưa có phim
                            nổi bật
                          </td>
                        </tr>
                      ) : (
                        movies.map(
                          (
                            movie,
                            index
                          ) => (
                            <Draggable
                              key={
                                movie.id
                              }
                              draggableId={String(
                                movie.id
                              )}
                              index={
                                index
                              }
                            >
                              {(
                                provided
                              ) => (
                                <tr
                                  ref={
                                    provided.innerRef
                                  }
                                  {...provided.draggableProps}
                                  className="
                                    border-b
                                    border-gray-100
                                    hover:bg-gray-50
                                    transition-colors
                                  "
                                >
                                  <td className="py-4 px-4">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="
                                        cursor-grab
                                        text-gray-400
                                        hover:text-violet-600
                                      "
                                    >
                                      <GripVertical className="w-4 h-4" />
                                    </div>
                                  </td>

                                  <td className="py-4 px-4 font-semibold">
                                    {index +
                                      1}
                                  </td>

                                  <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold">
                                        {
                                          movie.title
                                        }
                                      </span>

                                      <Badge
                                        className="
                                          bg-amber-500/20
                                          text-amber-600
                                          border-amber-500/30
                                        "
                                      >
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Hot
                                      </Badge>
                                    </div>
                                  </td>

                                  <td className="py-4 px-4">
                                    {movie.posterUrl ? (
                                      <img
                                        src={
                                          movie.posterUrl
                                        }
                                        alt={
                                          movie.title
                                        }
                                        className="
                                          w-20
                                          h-12
                                          object-cover
                                          rounded-md
                                          border
                                          border-gray-200
                                        "
                                      />
                                    ) : (
                                      <div
                                        className="
                                          w-20
                                          h-12
                                          rounded-md
                                          border
                                          border-gray-200
                                          bg-gray-50
                                          flex
                                          items-center
                                          justify-center
                                          text-xs
                                          text-gray-400
                                        "
                                      >
                                        No
                                        Image
                                      </div>
                                    )}
                                  </td>

                                  <td className="py-4 px-4 text-sm text-gray-500">
                                    {
                                      movie.director
                                    }
                                  </td>

                                  <td className="py-4 px-4">
                                    <div className="flex justify-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleRemoveTrending(
                                            movie.id
                                          )
                                        }
                                        className="
                                          h-8
                                          w-8
                                          p-0
                                          rounded-lg
                                          text-red-600
                                          hover:text-red-700
                                          hover:bg-red-50
                                        "
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          )
                        )
                      )}

                      {provided.placeholder}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {updating && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang cập nhật thứ tự...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}