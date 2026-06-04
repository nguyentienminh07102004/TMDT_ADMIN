"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { Edit, Eye, Loader2, Plus, Search, Trash2, Upload, ArrowRight, Film, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { movieApi } from "../api/MovieApi";
import { MovieResponse, MovieSearch, MovieStatus } from "../types/Movie";
import { mediaApi } from "../api/MediaApi";

const statusLabels: Record<MovieStatus, string> = {
  COMING_SOON: "Sắp chiếu",
  NOW_SHOWING: "Đang chiếu",
  ENDED: "Ngừng chiếu",
};

const statusColors: Record<MovieStatus, string> = {
  COMING_SOON: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  NOW_SHOWING: "bg-green-500/20 text-green-600 border-green-500/30",
  ENDED: "bg-gray-500/20 text-gray-500 border-gray-500/30",
};

const initialFormData = {
  title: "",
  genre: "",
  duration: "",
  director: "",
  movieCast: "",
  description: "",
  releaseDate: "",
  status: "NOW_SHOWING" as MovieStatus,
  posterId: null,
  teaserId: null,
};

type ModalMode = "CREATE" | "VIEW" | "EDIT";

export function Movies() {
  const [movies, setMovies] = useState<MovieResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("CREATE");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // State phụ để hiển thị URL Preview của ảnh/video cũ và mới
  const [oldUrls, setOldUrls] = useState({ posterUrl: "", teaserUrl: "" });
  const [newUrls, setNewUrls] = useState({ posterUrl: "", teaserUrl: "" });
  const [isUploading, setIsUploading] = useState({ poster: false, teaser: false });

  // Ref để trigger click chọn file ẩn
  const posterInputRef = useRef<HTMLInputElement>(null);
  const teaserInputRef = useRef<HTMLInputElement>(null);

  const [metaData, setMetaData] = useState({
    totalPage: 1,
    currentPage: 0,
    pageSize: 3,
  });

  const [movieSearch, setMovieSearch] = useState<MovieSearch>({
    page: 0,
    size: 10,
    keyword: "",
    status: null,
  });

  const fetchMovies = async (searchParams: MovieSearch) => {
    try {
      const result = await movieApi.search({
        ...searchParams,
        page: searchParams.page,
      });

      setMovies(result.data || []);
      setMetaData({
        totalPage: result.metaData?.totalPage ?? 1,
        currentPage: result.metaData?.currentPage ?? 0,
        pageSize: result.metaData?.pageSize ?? 10,
      });
    } catch (error) {
      toast.error("Không thể tải danh sách phim");
    }
  };

  useEffect(() => {
    fetchMovies(movieSearch);
  }, [movieSearch]);

  const handleOpenCreateModal = () => {
    setModalMode("CREATE");
    setSelectedMovieId(null);
    setFormData(initialFormData);
    setOldUrls({ posterUrl: "", teaserUrl: "" });
    setNewUrls({ posterUrl: "", teaserUrl: "" });
    setIsDialogOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < metaData.totalPage) {
      setMovieSearch((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const handleOpenViewModal = async (id: number) => {
    try {
      const result = await movieApi.getOne(id);
      if (result.success && result.data) {
        const movie = result.data;
        setFormData({
          title: movie.title,
          genre: movie.genre,
          duration: String(movie.duration),
          director: movie.director,
          movieCast: movie.movieCast,
          description: movie.description,
          releaseDate: movie.releaseDate,
          status: movie.status,
          posterId: null,
          teaserId: null,
        });
        // Lưu lại URL cũ để làm preview hành trình thay đổi
        setOldUrls({
          posterUrl: movie.posterUrl || "",
          teaserUrl: movie.teaserUrl || "",
        });
        setNewUrls({ posterUrl: "", teaserUrl: "" }); // Reset url mới
        setModalMode("VIEW");
        setSelectedMovieId(id);
        setIsDialogOpen(true);
      }
    } catch (error) {
      toast.error("Không thể tải thông tin chi tiết phim");
    }
  };

  // Hàm xử lý Upload File chung cho cả Poster và Teaser
  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>, type: "poster" | "teaser") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading((prev) => ({ ...prev, [type]: true }));
    try {
      // Gọi API Upload của bạn (Thay thế movieApi.uploadMedia bằng hàm thực tế của hệ thống)
      const response = await mediaApi.upload(file);

      if (response.success && response.data) {
        const { id, url } = response.data;

        // Cập nhật ID vào Form Data để gửi lên khi Save
        setFormData((prev) => ({
          ...prev,
          [type === "poster" ? "posterId" : "teaserId"]: id,
        }));

        // Cập nhật URL mới để hiển thị Preview bên phải mũi tên
        setNewUrls((prev) => ({
          ...prev,
          [type === "poster" ? "posterUrl" : "teaserUrl"]: url,
        }));

        toast.success(`Tải lên ${type === "poster" ? "ảnh poster" : "video teaser"} thành công!`);
      } else {
        toast.error("Tải file thất bại");
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi trong quá trình upload media");
    } finally {
      setIsUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDeleteMovie = async (id: number, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bộ phim "${title}" không?`)) {
      try {
        await movieApi.delete(id);
        toast.success("Xóa phim thành công!");
        fetchMovies(movieSearch);
      } catch (error) {
        toast.error("Xóa phim thất bại");
      }
    }
  };

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalMode === "VIEW") return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        duration: Number(formData.duration) || 0,
      };

      if (modalMode === "CREATE") {
        await movieApi.create(payload);
        toast.success("Thêm phim mới thành công!");
      } else if (modalMode === "EDIT" && selectedMovieId !== null) {
        await movieApi.update(selectedMovieId, payload);
        toast.success("Cập nhật thông tin phim thành công!");
      }

      setIsDialogOpen(false);
      setFormData(initialFormData);
      fetchMovies(movieSearch);
    } catch (error: any) {
      toast.error(error.message || "Thao tác thất bại, vui lòng kiểm tra lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Quản lý phim</h1>
          <p className="text-gray-500">Quản lý danh sách phim trong hệ thống</p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phim mới
        </Button>
      </div>

      {/* SEARCH BAR */}
      <Card className="bg-white border-gray-200 text-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Tìm theo tên phim, thể loại hoặc đạo diễn..."
                value={movieSearch.keyword}
                onChange={(event) => setMovieSearch((prev) => ({ ...prev, keyword: event.target.value, page: 1 }))}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl text-gray-900"
              />
            </div>

            <Select
              value={movieSearch.status || "all"}
              onValueChange={(value) => setMovieSearch((prev) => ({ ...prev, status: value === "all" ? null : value as MovieStatus, page: 1 }))}
            >
              <SelectTrigger className="w-full lg:w-48 bg-gray-50 border-gray-200 rounded-xl text-gray-900">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="COMING_SOON">Sắp chiếu</SelectItem>
                <SelectItem value="NOW_SHOWING">Đang chiếu</SelectItem>
                <SelectItem value="ENDED">Ngừng chiếu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* TABLE LIST */}
      <Card className="bg-white border-gray-200 text-gray-900">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-gray-900">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Tên phim</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Thể loại</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Thời lượng</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Đạo diễn</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Ngày phát hành</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Poster</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-gray-500 w-28">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {movies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500 text-sm">
                      Không tìm thấy bộ phim nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  movies.map((movie) => (
                    <tr key={movie.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-semibold">{movie.title}</p>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{movie.genre}</td>
                      <td className="py-4 px-4 text-sm">{movie.duration} phút</td>
                      <td className="py-4 px-4 text-sm">{movie.director}</td>
                      <td className="py-4 px-4 text-sm">{movie.releaseDate}</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={statusColors[movie.status]}>
                          {statusLabels[movie.status]}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {movie.posterUrl ? (
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              // Thay đổi kích thước thành w-20 (80px) và h-12 (48px) để tạo hình chữ nhật nằm ngang
                              className="w-20 h-12 object-cover rounded-md shadow-sm border border-gray-200"
                            />
                          ) : (
                            // Đồng bộ kích thước ô trống nằm ngang tương ứng
                            <div className="w-20 h-12 bg-gray-50 flex items-center justify-center rounded-md border border-gray-200 text-[10px] text-gray-500 text-center p-1">
                              Không có ảnh
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={() => handleOpenViewModal(movie.id)}
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">Xem chi tiết</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/20 text-red-600 hover:text-red-700 transition-colors"
                            onClick={() => handleDeleteMovie(movie.id, movie.title)}
                            title="Xóa phim"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Xóa phim</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">

            {/* INFO PAGE */}
            <span className="text-sm text-gray-500 mr-2">
              Trang {metaData.currentPage + 1} / {metaData.totalPage}
            </span>

            {/* PREV */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(movieSearch.page - 1)}
              disabled={movieSearch.page === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* PAGE NUMBER */}
            {Array.from({ length: metaData.totalPage }, (_, i) => i)
              .filter((p) => {
                // Luôn hiện trang đầu, trang cuối
                if (p === 0 || p === metaData.totalPage - 1) return true;
                // Hiện các trang xung quanh trang hiện tại (khoảng cách là 1 hoặc 2 trang)
                return Math.abs(movieSearch.page - p) <= 1;
              })
              .map((p, index, array) => {
                const elements = [];

                // Kiểm tra xem có cần chèn dấu "..." ở trước số trang này không
                if (index > 0 && p - array[index - 1] > 1) {
                  elements.push(
                    <span key={`dots-${p}`} className="w-9 text-center text-gray-500">
                      ...
                    </span>
                  );
                }

                // Render button trang hiện tại
                elements.push(
                  <Button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    variant={movieSearch.page === p ? "default" : "outline"}
                    className={`h-9 w-9 p-0 ${movieSearch.page === p
                      ? "bg-purple-600 text-gray-900"
                      : "border-gray-200 text-gray-600"
                      }`}
                  >
                    {p + 1}
                  </Button>
                );

                return elements;
              })}

            {/* NEXT */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(movieSearch.page + 1)}
              disabled={movieSearch.page === metaData.totalPage - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-3xl text-gray-900 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "CREATE" && "Thêm phim mới"}
              {modalMode === "VIEW" && "Chi tiết phim"}
              {modalMode === "EDIT" && "Chỉnh sửa thông tin phim"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {modalMode === "VIEW" ? "Thông tin chi tiết lưu trong hệ thống" : "Nhập đầy đủ thông tin bên dưới"}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 mt-4 text-gray-900" onSubmit={handleSubmitForm}>
            {/* TEXT FIELDS SECTION */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tên phim</Label>
                <Input
                  id="title"
                  required
                  disabled={modalMode === "VIEW"}
                  placeholder="Nhập tên phim"
                  value={formData.title}
                  onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Thể loại</Label>
                <Input
                  id="genre"
                  required
                  disabled={modalMode === "VIEW"}
                  placeholder="Action, Drama..."
                  value={formData.genre}
                  onChange={(event) => setFormData((current) => ({ ...current, genre: event.target.value }))}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Thời lượng (phút)</Label>
                <Input
                  id="duration"
                  type="number"
                  required
                  disabled={modalMode === "VIEW"}
                  placeholder="120"
                  value={formData.duration}
                  onChange={(event) => setFormData((current) => ({ ...current, duration: event.target.value }))}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Ngày khởi chiếu</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  required
                  disabled={modalMode === "VIEW"}
                  value={formData.releaseDate}
                  onChange={(event) => setFormData((current) => ({ ...current, releaseDate: event.target.value }))}
                  className="bg-gray-50 border-gray-200 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modalStatus">Trạng thái</Label>
                <Select
                  disabled={modalMode === "VIEW"}
                  value={formData.status}
                  onValueChange={(value: MovieStatus) => setFormData((current) => ({ ...current, status: value }))}
                >
                  <SelectTrigger id="modalStatus" className="bg-gray-50 border-gray-200 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
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
                required
                disabled={modalMode === "VIEW"}
                placeholder="Nhập tên đạo diễn"
                value={formData.director}
                onChange={(event) => setFormData((current) => ({ ...current, director: event.target.value }))}
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cast">Diễn viên</Label>
              <Input
                id="cast"
                required
                disabled={modalMode === "VIEW"}
                placeholder="Nhập tên diễn viên, phân cách bằng dấu phẩy"
                value={formData.movieCast}
                onChange={(event) => setFormData((current) => ({ ...current, movieCast: event.target.value }))}
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                required
                disabled={modalMode === "VIEW"}
                placeholder="Nhập mô tả phim..."
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                className="bg-gray-50 border-gray-200 min-h-24 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {/*--- PHẦN THAY ĐỔI CHÍNH: UPLOAD VÀ HIỂN THỊ MEDIA ---*/}
            <div className="space-y-6 border-t border-gray-200 pt-4">

              {/* 1. KHU VỰC POSTER IMAGE */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-600">Poster ảnh phim</Label>
                <div className="grid grid-cols-7 items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">

                  {/* Ô URL Cũ bên trái */}
                  <div className="col-span-3 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-lg bg-white h-32 text-center overflow-hidden">
                    {oldUrls.posterUrl ? (
                      <img
                        src={oldUrls.posterUrl}
                        alt="Old Poster"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-gray-500 flex flex-col items-center p-2">
                        <ImageIcon className="w-4 h-4 mb-1" /> Trống
                      </div>
                    )}
                  </div>

                  {/* Nút Upload / Mũi tên ở giữa */}
                  <div className="col-span-1 flex flex-col items-center justify-center gap-1">
                    {modalMode !== "VIEW" ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={posterInputRef}
                          onChange={(e) => handleUploadFile(e, "poster")}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isUploading.poster}
                          onClick={() => posterInputRef.current?.click()}
                          className="h-9 w-9 rounded-full bg-purple-500/10 text-purple-600 hover:bg-purple-500/20"
                          title="Tải lên hình ảnh mới"
                        >
                          {isUploading.poster ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        </Button>
                        <span className="text-[9px] text-purple-600 font-medium">Thay thế</span>
                      </>
                    ) : (
                      <ArrowRight className="text-gray-600 w-5 h-5" />
                    )}
                  </div>

                  {/* Ô kết quả Upload mới bên phải */}
                  <div className="col-span-3 flex flex-col items-center justify-center border border-dashed border-purple-500/30 rounded-lg p-2 bg-white h-32 text-center">
                    <span className="text-[10px] text-purple-600 mb-1 block">Poster mới tải lên</span>
                    {newUrls.posterUrl ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <img src={newUrls.posterUrl} alt="New Poster" className="h-16 max-w-full object-contain rounded border border-purple-500/30" />
                        <span className="text-[9px] text-gray-500 truncate w-full mt-1">ID: {formData.posterId}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Chưa chọn ảnh mới</span>
                    )}
                  </div>

                </div>
              </div>

              {/* 2. KHU VỰC TEASER VIDEO */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-600">Teaser Video</Label>
                <div className="grid grid-cols-7 items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">

                  {/* Ô Video Cũ bên trái */}
                  <div className="col-span-3 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-lg bg-white h-32 text-center overflow-hidden">
                    {oldUrls.teaserUrl ? (
                      <video
                        src={oldUrls.teaserUrl}
                        className="w-full h-full object-cover bg-black"
                        controls
                        muted
                      />
                    ) : (
                      <div className="text-xs text-gray-500 flex flex-col items-center p-2">
                        <Film className="w-4 h-4 mb-1" /> Teaser trống
                      </div>
                    )}
                  </div>

                  {/* Nút Upload / Mũi tên ở giữa */}
                  <div className="col-span-1 flex flex-col items-center justify-center gap-1">
                    {modalMode !== "VIEW" ? (
                      <>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          ref={teaserInputRef}
                          onChange={(e) => handleUploadFile(e, "teaser")}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isUploading.teaser}
                          onClick={() => teaserInputRef.current?.click()}
                          className="h-9 w-9 rounded-full bg-pink-500/10 text-pink-600 hover:bg-pink-500/20"
                          title="Tải lên video mới"
                        >
                          {isUploading.teaser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        </Button>
                        <span className="text-[9px] text-pink-600 font-medium">Thay thế</span>
                      </>
                    ) : (
                      <ArrowRight className="text-gray-600 w-5 h-5" />
                    )}
                  </div>

                  {/* Ô kết quả Upload mới bên phải */}
                  <div className="col-span-3 flex flex-col items-center justify-center border border-dashed border-pink-500/30 rounded-lg p-2 bg-white h-32 text-center">
                    <span className="text-[10px] text-pink-600 mb-1 block">Teaser mới tải lên</span>
                    {newUrls.teaserUrl ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <video src={newUrls.teaserUrl} className="h-14 max-w-full bg-black rounded" controls muted />
                        <span className="text-[9px] text-gray-500 truncate w-full mt-1">ID: {formData.teaserId}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Chưa chọn video mới</span>
                    )}
                  </div>

                </div>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                key="btn-close-modal"
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-200 text-black"
              >
                Đóng
              </Button>

              {modalMode === "VIEW" && (
                <Button
                  key="btn-trigger-edit"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalMode("EDIT");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-gray-900"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}

              {modalMode !== "VIEW" && (
                <Button
                  key="btn-submit-form"
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  disabled={isSubmitting || isUploading.poster || isUploading.teaser}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : modalMode === "CREATE" ? (
                    "Thêm phim"
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}