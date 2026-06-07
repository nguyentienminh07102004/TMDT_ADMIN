import { useEffect, useState } from "react";
import { Plus, Calendar, Clock, MapPin, Edit, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CinemaResponse } from "../types/Cinema";
import { RoomResponse, RoomSearch } from "../types/Room";
import { roomApi } from "../api/RoomApi";
import { cinemaApi } from "../api/CinemaApi";
import { movieApi } from "../api/MovieApi";
import { showtimeApi } from "../api/ShowtimeApi";
import { toast } from "sonner";
import { MovieResponse, MovieSearch } from "../types/Movie";
import { ShowtimeResponse, ShowtimeSearch, ShowtimeStatus } from "../types/Showtime";

const timeSlots = ["10:00", "12:30", "14:30", "16:30", "18:00", "19:30", "21:00", "22:30"];

const statusColors: Record<ShowtimeStatus, string> = {
  "COMING_SOON": "bg-green-500/20 text-green-600 border-green-500/30",
  "UPCOMING": "bg-orange-500/20 text-orange-600 border-orange-500/30",
  "ENDED": "bg-red-500/20 text-red-600 border-red-500/30",
  "CANCELLED": "bg-gray-500/20 text-gray-600 border-gray-500/30",
};

const statusLabels: Record<ShowtimeStatus, string> = {
  "COMING_SOON": "Chưa mở bán",
  "UPCOMING": "Đang mở bán",
  "ENDED": "Đã kết thúc",
  "CANCELLED": "Đã hủy",
};

export function Showtimes() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Master Data từ API
  const [cinemas, setCinemas] = useState<CinemaResponse[]>([]);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [movies, setMovies] = useState<MovieResponse[]>([]);

  // Dữ liệu danh sách Suất chiếu chính thức từ API
  const [showtimes, setShowtimes] = useState<ShowtimeResponse[]>([]);

  // State Bộ lọc danh sách suất chiếu ngoài màn hình chính
  const [mainFilter, setMainFilter] = useState<ShowtimeSearch>({
    page: 0,
    size: 10, // Sửa lại size hợp lý thay vì 1
    cinemaId: null,
    movieName: "",
    date: null,
    status: null,
  });

  // State Bộ lọc hỗ trợ load danh mục con bên trong Form
  const [roomSearch, setRoomSearch] = useState<RoomSearch>({ page: 0, size: 1000, cinemaId: null });
  const [movieSearch, setMovieSearch] = useState<MovieSearch>({ page: 0, size: 1000, keyword: "", status: null });

  // State quản lý dữ liệu Form thêm mới
  const [formData, setFormData] = useState({
    movieId: "",
    cinemaId: "",
    roomId: "",
    date: "",
    time: "",
    basePrice: "",
  });

  // Metadata riêng cho Phân trang Suất Chiếu
  const [metaData, setMetaData] = useState({ totalPage: 1, currentPage: 0, pageSize: 10 });

  // --- Call APIs ---
  const fetchCinemas = async () => {
    try {
      const data = await cinemaApi.search();
      setCinemas(data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp:", error);
    }
  };

  const fetchMovies = async (searchParams: MovieSearch) => {
    try {
      const result = await movieApi.search({ ...searchParams, page: searchParams.page });
      setMovies(result.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách phim");
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await roomApi.search(roomSearch);
      setRooms(data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng:", error);
    }
  };

  // Hàm fetch danh sách suất chiếu động dựa theo mainFilter
  const fetchShowtimes = async () => {
    try {
      const data = await showtimeApi.search(mainFilter);
      setShowtimes(data.data || []); 
      if (data.metaData) {
        setMetaData({
          totalPage: data.metaData.totalPage || 1,
          currentPage: mainFilter.page, // Đồng bộ chuẩn theo page đang gửi đi của filter suất chiếu
          pageSize: data.metaData.pageSize || 10,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách suất chiếu:", error);
      toast.error("Không thể tải dữ liệu suất chiếu");
    }
  };

  useEffect(() => { fetchCinemas(); }, []);
  useEffect(() => { fetchMovies(movieSearch); }, [movieSearch]);
  useEffect(() => { fetchRooms(); }, [roomSearch]);

  // Gọi lại API suất chiếu bất cứ khi nào bộ lọc chính (bao gồm cả thay đổi số trang) được trigger
  useEffect(() => {
    fetchShowtimes();
  }, [mainFilter]);

  // Thay đổi trang dữ liệu dành riêng cho SUẤT CHIẾU ngoài màn hình chính
  const handleShowtimePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < metaData.totalPage) {
      setMainFilter((prev) => ({
        ...prev,
        page: newPage, // Cập nhật lại mainFilter để useEffect tự bắt và gọi lại API
      }));
    }
  };

  // --- Xử lý Logic Form ---
  const handleFormCinemaChange = (cinemaId: string) => {
    setFormData((prev) => ({ ...prev, cinemaId, roomId: "" }));
    setRoomSearch((prev) => ({ ...prev, cinemaId: cinemaId ? Number(cinemaId) : null }));
  };

  const handleCreateShowtime = async () => {
    const { movieId, roomId, date, time, basePrice } = formData;

    if (!movieId || !roomId || !date || !time || !basePrice) {
      toast.error("Vui lòng điền đầy đủ tất cả thông tin suất chiếu");
      return;
    }

    try {
      setIsSubmitting(true);
      const startTimeISO = `${date}T${time}:00`;

      await showtimeApi.create({
        movieId: Number(movieId),
        roomId: Number(roomId),
        startTime: startTimeISO,
        basePrice: Number(basePrice),
      });

      toast.success("Tạo suất chiếu thành công!");
      setIsAddDialogOpen(false);

      setFormData({ movieId: "", cinemaId: "", roomId: "", date: "", time: "", basePrice: "" });
      setRoomSearch((prev) => ({ ...prev, cinemaId: null }));

      fetchShowtimes();
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi khi tạo suất chiếu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (localDateTimeStr: string) => {
    if (!localDateTimeStr) return { date: "", time: "" };
    const [datePart, timePart] = localDateTimeStr.split("T");
    const [year, month, day] = datePart.split("-");
    return {
      date: `${day}/${month}/${year}`,
      time: timePart ? timePart.substring(0, 5) : "",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý suất chiếu</h1>
          <p className="text-gray-500">Quản lý lịch chiếu phim tại các rạp</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setFormData({ movieId: "", cinemaId: "", roomId: "", date: "", time: "", basePrice: "" });
            setRoomSearch(prev => ({ ...prev, cinemaId: null }));
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Thêm suất chiếu
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm suất chiếu mới</DialogTitle>
              <DialogDescription>Tạo suất chiếu mới cho phim</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Chọn phim</Label>
                <Select value={formData.movieId} onValueChange={(val) => setFormData({ ...formData, movieId: val })}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Chọn phim" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    {movies.map((movie) => (
                      <SelectItem key={movie.id} value={String(movie.id)}>{movie.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chọn rạp</Label>
                  <Select value={formData.cinemaId} onValueChange={handleFormCinemaChange}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Chọn rạp" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      {cinemas.map((cinema) => (
                        <SelectItem key={cinema.id} value={String(cinema.id)}>{cinema.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chọn phòng</Label>
                  <Select
                    value={formData.roomId}
                    onValueChange={(val) => setFormData({ ...formData, roomId: val })}
                    disabled={!formData.cinemaId}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder={formData.cinemaId ? "Chọn phòng" : "Vui lòng chọn rạp trước"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={String(room.id)}>{room.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày chiếu</Label>
                  <Input
                    type="date"
                    className="bg-gray-50 border-gray-200 text-gray-900"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giờ bắt đầu</Label>
                  <Input
                    type="time"
                    className="bg-gray-50 border-gray-200 text-gray-900"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Giá vé cơ bản (₫)</Label>
                <Input
                  type="number"
                  placeholder="170000"
                  className="bg-gray-50 border-gray-200 text-gray-900"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-200 text-gray-700 hover:bg-gray-50" disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white" onClick={handleCreateShowtime} disabled={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : "Tạo suất chiếu"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <Select
              value={mainFilter.movieName || "all"}
              onValueChange={(val) => setMainFilter({ ...mainFilter, page: 0, movieName: val === "all" ? "" : val })}
            >
              <SelectTrigger className="w-full lg:w-56 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Chọn phim" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="all">Tất cả phim</SelectItem>
                {movies.map((movie) => (
                  <SelectItem key={movie.id} value={movie.title}>{movie.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={mainFilter.cinemaId ? String(mainFilter.cinemaId) : "all"}
              onValueChange={(val) => setMainFilter({ ...mainFilter, page: 0, cinemaId: val === "all" ? null : Number(val) })}
            >
              <SelectTrigger className="w-full lg:w-56 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Chọn rạp" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="all">Tất cả rạp</SelectItem>
                {cinemas.map((cinema) => (
                  <SelectItem key={cinema.id} value={String(cinema.id)}>{cinema.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              className="bg-gray-50 border-gray-200 rounded-xl text-gray-900 w-full lg:w-56"
              value={mainFilter.date || ""}
              onChange={(e) => setMainFilter({ ...mainFilter, page: 0, date: e.target.value || null })}
            />

            <Select
              value={mainFilter.status || "all"}
              onValueChange={(val) => setMainFilter({ ...mainFilter, page: 0, status: val === "all" ? null : (val as ShowtimeStatus) })}
            >
              <SelectTrigger className="w-full lg:w-56 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Hiển thị Dữ liệu */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="bg-white border-gray-200">
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* View Danh sách */}
        <TabsContent value="list" className="mt-6">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="text-left py-4 px-4 text-sm font-medium">Phim</th>
                      <th className="text-left py-4 px-4 text-sm font-medium">Tên phòng</th>
                      <th className="text-left py-4 px-4 text-sm font-medium">Ngày giờ</th>
                      <th className="text-left py-4 px-4 text-sm font-medium">Giá vé cơ bản</th>
                      <th className="text-left py-4 px-4 text-sm font-medium">Ghế trống</th>
                      <th className="text-left py-4 px-4 text-sm font-medium">Trạng thái</th>
                      <th className="text-left py-4 px-4 text-sm font-medium">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900">
                    {showtimes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                          Không tìm thấy suất chiếu nào phù hợp bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      showtimes.map((showtime) => {
                        const { date, time } = formatDateTime(showtime.startTime);
                        return (
                          <tr key={showtime.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4"><p className="font-semibold">{showtime.movieName}</p></td>
                            <td className="py-4 px-4 text-sm">{showtime.roomName}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {date}
                                <Clock className="w-4 h-4 text-gray-400 ml-2" />
                                {time}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold">₫{showtime.basePrice.toLocaleString()}</td>
                            <td className="py-4 px-4 text-sm">
                              {showtime.availableSeats}/{showtime.totalSeats}
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline" className={statusColors[showtime.status]}>
                                {statusLabels[showtime.status]}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="rounded-xl"><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-xl text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bộ Phân Trang nằm gọn gàng bên trong Tab List Table */}
              <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500 mr-2">
                  Trang {metaData.currentPage + 1} / {metaData.totalPage}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShowtimePageChange(mainFilter.page - 1)}
                  disabled={mainFilter.page === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: metaData.totalPage }, (_, i) => i)
                  .filter((p) => p === 0 || p === metaData.totalPage - 1 || Math.abs(mainFilter.page - p) <= 1)
                  .map((p, index, array) => {
                    const elements = [];
                    if (index > 0 && p - array[index - 1] > 1) {
                      elements.push(
                        <span key={`dots-${p}`} className="w-9 text-center text-gray-500">...</span>
                      );
                    }

                    elements.push(
                      <Button
                        key={p}
                        onClick={() => handleShowtimePageChange(p)}
                        variant={mainFilter.page === p ? "default" : "outline"}
                        className={`h-9 w-9 p-0 ${mainFilter.page === p
                          ? "bg-purple-600 text-white hover:bg-purple-700" 
                          : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {p + 1}
                      </Button>
                    );
                    return elements;
                  })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShowtimePageChange(mainFilter.page + 1)}
                  disabled={mainFilter.page === metaData.totalPage - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* View Timeline */}
        <TabsContent value="timeline" className="mt-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Lịch chiếu phim - {mainFilter.date ? formatDateTime(`${mainFilter.date}T00:00:00`).date : "Tất cả"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cinemas.map((cinema) => {
                  if (mainFilter.cinemaId && mainFilter.cinemaId !== cinema.id) return null;

                  return (
                    <div key={cinema.id} className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-900">
                        <MapPin className="w-5 h-5 text-violet-600" />
                        <h3 className="font-semibold text-lg">{cinema.name}</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-8">
                        {timeSlots.map((slotTime) => {
                          const matchedShowtime = showtimes.find((s) => {
                            const { time } = formatDateTime(s.startTime);
                            return time === slotTime && s.roomName.includes(cinema.name.split(" ")[0]);
                          });

                          return (
                            <div
                              key={slotTime}
                              className={`p-4 rounded-xl border transition-all ${matchedShowtime
                                ? `${statusColors[matchedShowtime.status].split(" ")[0]} border-violet-500/30 hover:bg-violet-500/20`
                                : "bg-gray-50 border-gray-100 opacity-50"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2 text-gray-700">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold">{slotTime}</span>
                              </div>
                              {matchedShowtime && (
                                <div>
                                  <p className="text-sm font-medium text-gray-900 truncate">{matchedShowtime.movieName}</p>
                                  <p className="text-xs text-gray-500 mt-1">{matchedShowtime.roomName}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}