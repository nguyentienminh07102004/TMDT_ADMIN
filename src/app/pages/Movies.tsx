import { FormEvent, useMemo, useState } from "react";
import { Edit, Eye, Filter, Loader2, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { toast } from "sonner";
import { adminApi, type CreateMoviePayload, type MovieResponse, type MovieStatus } from "../lib/adminApi";

type MovieRow = {
  id: number;
  title: string;
  genre: string;
  duration: number;
  director: string;
  cast: string;
  description: string;
  posterMediaId: string | null;
  releaseDate: string;
  status: MovieStatus;
  teaserUrl: string | null;
  reviewUrl: string | null;
  createdAt: string | null;
};

const initialMovies: MovieRow[] = [
  {
    id: 20,
    title: "Oppenheimer",
    genre: "Drama, History",
    duration: 180,
    director: "Christopher Nolan",
    cast: "Cillian Murphy, Emily Blunt",
    description: "A dramatized biography of J. Robert Oppenheimer.",
    posterMediaId: null,
    releaseDate: "2024-03-15",
    status: "NOW_SHOWING",
    teaserUrl: null,
    reviewUrl: null,
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: 21,
    title: "Inception",
    genre: "Sci-Fi, Thriller",
    duration: 148,
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt",
    description: "A skilled thief leads a dream-sharing heist.",
    posterMediaId: null,
    releaseDate: "2024-04-20",
    status: "COMING_SOON",
    teaserUrl: null,
    reviewUrl: null,
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: 22,
    title: "Interstellar",
    genre: "Sci-Fi, Drama",
    duration: 169,
    director: "Christopher Nolan",
    cast: "Matthew McConaughey, Anne Hathaway",
    description: "A team of explorers travel through a wormhole in space.",
    posterMediaId: null,
    releaseDate: "2024-02-10",
    status: "ENDED",
    teaserUrl: null,
    reviewUrl: null,
    createdAt: "2026-02-10T10:00:00Z",
  },
];

const statusLabels: Record<MovieStatus, string> = {
  COMING_SOON: "Sắp chiếu",
  NOW_SHOWING: "Đang chiếu",
  ENDED: "Ngừng chiếu",
};

const statusColors: Record<MovieStatus, string> = {
  COMING_SOON: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  NOW_SHOWING: "bg-green-500/20 text-green-400 border-green-500/30",
  ENDED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

function mapMovieResponseToRow(movie: MovieResponse): MovieRow {
  return {
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration,
    director: movie.director,
    cast: movie.cast,
    description: movie.description,
    posterMediaId: movie.posterMediaId,
    releaseDate: movie.releaseDate,
    status: movie.status,
    teaserUrl: movie.teaserUrl,
    reviewUrl: movie.reviewUrl,
    createdAt: movie.createdAt ?? null,
  };
}

export function Movies() {
  const [movies, setMovies] = useState<MovieRow[]>(initialMovies);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    duration: "",
    director: "",
    cast: "",
    description: "",
    posterMediaId: "",
    releaseDate: "",
    status: "NOW_SHOWING" as MovieStatus,
    teaserUrl: "",
    reviewUrl: "",
  });

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || movie.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [movies, searchQuery, statusFilter]);

  const handleCreateMovie = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateMoviePayload = {
      title: formData.title.trim(),
      genre: formData.genre.trim(),
      duration: Number(formData.duration),
      director: formData.director.trim(),
      cast: formData.cast.trim(),
      description: formData.description.trim(),
      posterMediaId: formData.posterMediaId.trim() || null,
      releaseDate: formData.releaseDate,
      status: formData.status,
      teaserUrl: formData.teaserUrl.trim() || null,
      reviewUrl: formData.reviewUrl.trim() || null,
    };

    if (
      !payload.title ||
      !payload.genre ||
      !payload.duration ||
      !payload.director ||
      !payload.cast ||
      !payload.description ||
      !payload.releaseDate
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin phim");
      return;
    }

    try {
      setIsSubmitting(true);
      const createdMovie = await adminApi.createMovie(payload);
      setMovies((currentMovies) => [mapMovieResponseToRow(createdMovie), ...currentMovies]);
      setIsAddDialogOpen(false);
      setFormData({
        title: "",
        genre: "",
        duration: "",
        director: "",
        cast: "",
        description: "",
        posterMediaId: "",
        releaseDate: "",
        status: "NOW_SHOWING",
        teaserUrl: "",
        reviewUrl: "",
      });
      toast.success(`Đã tạo phim ${createdMovie.title}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo phim");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý phim</h1>
          <p className="text-gray-400">Quản lý danh sách phim trong hệ thống</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Thêm phim mới
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a24] border-white/10 max-w-2xl text-white">
            <DialogHeader>
              <DialogTitle>Thêm phim mới</DialogTitle>
              <DialogDescription className="text-white/70">Nhập đúng các field theo MovieCreateRequest</DialogDescription>
            </DialogHeader>

            <form className="space-y-4 mt-4 text-white" onSubmit={handleCreateMovie}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên phim</Label>
                  <Input
                    id="title"
                    placeholder="Nhập tên phim"
                    value={formData.title}
                    onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Thể loại</Label>
                  <Input
                    id="genre"
                    placeholder="Action, Drama..."
                    value={formData.genre}
                    onChange={(event) => setFormData((current) => ({ ...current, genre: event.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="120"
                    value={formData.duration}
                    onChange={(event) => setFormData((current) => ({ ...current, duration: event.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="releaseDate">Ngày khởi chiếu</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={formData.releaseDate}
                    onChange={(event) => setFormData((current) => ({ ...current, releaseDate: event.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData((current) => ({ ...current, status: value as MovieStatus }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a24] border-white/10">
                      <SelectItem value="COMING_SOON">Sắp chiếu</SelectItem>
                      <SelectItem value="NOW_SHOWING">Đang chiếu</SelectItem>
                      <SelectItem value="ENDED">Ngừng chiếu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="director">Đạo diễn</Label>
                <Input
                  id="director"
                  placeholder="Nhập tên đạo diễn"
                  value={formData.director}
                  onChange={(event) => setFormData((current) => ({ ...current, director: event.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cast">Diễn viên</Label>
                <Input
                  id="cast"
                  placeholder="Nhập tên diễn viên, phân cách bằng dấu phẩy"
                  value={formData.cast}
                  onChange={(event) => setFormData((current) => ({ ...current, cast: event.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả phim..."
                  value={formData.description}
                  onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                  className="bg-white/5 border-white/10 min-h-24 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="posterMediaId">Poster Media ID</Label>
                <Input
                  id="posterMediaId"
                  placeholder="media-post-001"
                  value={formData.posterMediaId}
                  onChange={(event) => setFormData((current) => ({ ...current, posterMediaId: event.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teaserUrl">URL Teaser</Label>
                  <Input
                    id="teaserUrl"
                    placeholder="https://..."
                    value={formData.teaserUrl}
                    onChange={(event) => setFormData((current) => ({ ...current, teaserUrl: event.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewUrl">URL Review</Label>
                  <Input
                    id="reviewUrl"
                    placeholder="https://..."
                    value={formData.reviewUrl}
                    onChange={(event) => setFormData((current) => ({ ...current, reviewUrl: event.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-white/10">
                  Hủy
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Thêm phim"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Tìm theo tên phim, thể loại hoặc đạo diễn..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10 bg-white/5 border-white/10 rounded-xl"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-white/10">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="COMING_SOON">Sắp chiếu</SelectItem>
                <SelectItem value="NOW_SHOWING">Đang chiếu</SelectItem>
                <SelectItem value="ENDED">Ngừng chiếu</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-white/10 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Tên phim</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Thể loại</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Thời lượng</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Đạo diễn</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Ngày phát hành</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Trạng thái</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-semibold">{movie.title}</p>
                      <p className="text-xs text-gray-400">ID {movie.id}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">{movie.genre}</td>
                    <td className="py-4 px-4 text-sm">{movie.duration} phút</td>
                    <td className="py-4 px-4 text-sm">{movie.director}</td>
                    <td className="py-4 px-4 text-sm">{movie.releaseDate}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={statusColors[movie.status]}>
                        {statusLabels[movie.status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1a24] border-white/10">
                          <DropdownMenuItem className="focus:bg-white/5">
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-white/5">
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-white/5 text-red-400">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa phim
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-400">
              Hiển thị {filteredMovies.length} trong tổng số {movies.length} phim
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}