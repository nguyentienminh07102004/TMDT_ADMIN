import { useEffect, useState } from "react";
import { Plus, MapPin, Edit, Trash2, Building2, Armchair, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { CinemaResponse, CinemaRequest } from "../types/Cinema";
import { cinemaApi } from "../api/CinemaApi";
import { RoomResponse, RoomRequest, RoomSearch } from "../types/Room";
import { roomApi } from "../api/RoomApi";

const roomTypeColors = {
  "STANDARD": "bg-blue-500/20 text-blue-600 border-blue-500/30",
  "3D": "bg-cyan-500/20 text-cyan-600 border-cyan-500/30",
  "IMAX": "bg-violet-500/20 text-violet-600 border-violet-500/30",
  "VIP": "bg-amber-500/20 text-amber-600 border-amber-500/30",
  "4DX": "bg-pink-500/20 text-pink-600 border-pink-500/30",
};

export function Cinemas() {
  // Trạng thái đóng/mở Modals (Thêm & Sửa)
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // Biến xác định đang ở chế độ Sửa (Lưu trữ object cần sửa, null nếu là Thêm mới)
  const [editingCinema, setEditingCinema] = useState<CinemaResponse | null>(null);
  const [editingRoom, setEditingRoom] = useState<RoomResponse | null>(null);

  // Danh sách dữ liệu từ API
  const [cinemas, setCinemas] = useState<CinemaResponse[]>([]);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);

  // State Form Payload
  const [cinemaRequest, setCinemaRequest] = useState<CinemaRequest>({ name: "", address: "", city: "" });
  const [roomRequest, setRoomRequest] = useState<RoomRequest>({ name: "", cinemaId: 0, type: "STANDARD", totalRow: 0, totalSeatOfRow: 0 });

  // State Phân trang & Tìm kiếm (Đã sửa đổi tên movieSearch -> roomSearch cho đúng ngữ nghĩa)
  const [metaData, setMetaData] = useState({ totalPage: 1, currentPage: 1, pageSize: 10 });
  const [roomSearch, setRoomSearch] = useState<RoomSearch>({ page: 0, size: 10, cinemaId: null });

  // --- FETCH DATA ---
  const fetchCinemas = async () => {
    try {
      const data = await cinemaApi.search();
      setCinemas(data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await roomApi.search(roomSearch);

      setRooms(data.data);

      if (data.metaData) {
        setMetaData({
          ...data.metaData,
          currentPage: roomSearch.page,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng:", error);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [roomSearch]);


  // --- HANDLERS: QUẢN LÝ CƠ SỞ RẠP (CINEMA) ---
  const openAddCinemaModal = () => {
    setEditingCinema(null);
    setCinemaRequest({ name: "", address: "", city: "" });
    setIsCinemaModalOpen(true);
  };

  const openEditCinemaModal = (cinema: CinemaResponse) => {
    setEditingCinema(cinema);
    setCinemaRequest({ name: cinema.name, address: cinema.address, city: cinema.city });
    setIsCinemaModalOpen(true);
  };

  const handleCinemaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCinemaRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCinema = async () => {
    try {
      if (!cinemaRequest.name || !cinemaRequest.address || !cinemaRequest.city) {
        toast.error("Vui lòng điền đầy đủ thông tin rạp!");
        return;
      }

      if (editingCinema) {
        // Hành động Cập nhật thông tin rạp
        await cinemaApi.update(editingCinema.id, cinemaRequest);
        toast.success("Cập nhật thông tin rạp thành công!");
      } else {
        // Hành động Tạo mới rạp
        await cinemaApi.create(cinemaRequest);
        toast.success("Thêm rạp mới thành công!");
      }

      setIsCinemaModalOpen(false);
      fetchCinemas();
    } catch (error) {
      toast.error("Lỗi xử lý thông tin rạp:");
    }
  };

  const handleDeleteCinema = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa rạp chiếu này và các dữ liệu liên quan?")) {
      try {
        await cinemaApi.delete(id);
        toast.success("Xóa rạp thành công!");
        fetchCinemas();
        fetchRooms(); // Tải lại phòng phòng hờ phòng thuộc rạp đã bị xóa
      } catch (error) {
        toast.error("Lỗi khi xóa rạp chiếu");
      }
    }
  };


  // --- HANDLERS: QUẢN LÝ PHÒNG CHIẾU (ROOM) ---
  const openAddRoomModal = () => {
    setEditingRoom(null);
    setRoomRequest({ name: "", cinemaId: cinemas[0]?.id || 0, type: "STANDARD", totalRow: 0, totalSeatOfRow: 0 });
    setIsRoomModalOpen(true);
  };

  const openEditRoomModal = (room: RoomResponse) => {
    setEditingRoom(room);
    // Tìm cinemaId từ cụm rạp dựa vào tên hoặc API cấu trúc của bạn (nếu roomResponse có trường cinemaId)
    // Giả định roomResponse có trường cinemaId hoặc bạn xử lý từ mảng cinemas có sẵn
    const matchedCinema = cinemas.find(c => c.name === room.cinemaName);
    setRoomRequest({
      name: room.name,
      cinemaId: matchedCinema ? matchedCinema.id : 0,
      type: room.type,
      totalRow: room.totalRow,
      totalSeatOfRow: room.totalSeatOfRow,
    });
    setIsRoomModalOpen(true);
  };

  const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setRoomRequest((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleRoomSelectChange = (fieldName: keyof RoomRequest, value: string) => {
    setRoomRequest((prev) => ({
      ...prev,
      [fieldName]: fieldName === "cinemaId" ? Number(value) : value,
    }));
  };

  const handleSaveRoom = async () => {
    try {
      if (!roomRequest.name || roomRequest.cinemaId === 0 || !roomRequest.totalRow || roomRequest.totalSeatOfRow <= 0) {
        toast.error("Vui lòng nhập chính xác và đầy đủ dữ liệu phòng!");
        return;
      }

      if (editingRoom) {
        // Hành động cập nhật phòng
        await roomApi.update(editingRoom.id, roomRequest);
        toast.success("Cập nhật phòng chiếu thành công!");
      } else {
        // Hành động thêm mới phòng
        await roomApi.create(roomRequest);
        toast.success("Thêm phòng chiếu mới thành công!");
      }

      setIsRoomModalOpen(false);
      fetchRooms();
    } catch (error) {
      toast.error("Lỗi xử lý thông tin phòng:");
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng chiếu này?")) {
      try {
        await roomApi.delete(id);
        toast.success("Xóa phòng chiếu thành công!");
        fetchRooms();
      } catch (error) {
        toast.error("Lỗi khi xóa phòng chiếu:");
      }
    }
  };

  // Thay đổi bộ lọc theo rạp chiếu phim
  const handleFilterCinemaChange = (value: string) => {
    setRoomSearch((prev) => ({
      ...prev,
      page: 0, // reset về trang đầu
      cinemaId: value === "ALL" ? null : Number(value),
    }));
  };

  // Thay đổi trang dữ liệu phòng chiếu
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < metaData.totalPage) {
      setRoomSearch((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };


  return (
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Quản lý rạp / phòng chiếu</h1>
        <p className="text-gray-500">Quản lý và thiết lập thông tin rạp phim, cấu hình phòng máy chiếu toàn hệ thống</p>
      </div>

      <Tabs defaultValue="cinemas" className="w-full">
        <TabsList className="bg-white border-gray-200">
          <TabsTrigger value="cinemas">Danh sách rạp</TabsTrigger>
          <TabsTrigger value="rooms">Danh sách phòng chiếu</TabsTrigger>
        </TabsList>

        {/* ================= CINEMAS TAB ================= */}
        <TabsContent value="cinemas" className="mt-6 space-y-6">
          <div className="flex justify-end">
            <Button onClick={openAddCinemaModal} className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
              <Plus className="w-4 h-4 mr-2" /> Thêm rạp mới
            </Button>
          </div>

          {/* Grid danh sách rạp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cinemas.map((cinema) => (
              <Card key={cinema.id} className="bg-white border-gray-200 text-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 text-white">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{cinema.name}</h3>
                        <div className="flex items-start gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{`[${cinema.city}] ${cinema.address}`}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
                      Hoạt động
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mã hệ thống</p>
                      <p className="text-2xl font-bold">#{cinema.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Trạng thái dữ liệu</p>
                      <p className="text-sm font-semibold text-violet-600 mt-1">Sẵn sàng</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => openEditCinemaModal(cinema)} variant="outline" size="sm" className="flex-1 border-gray-200 rounded-xl hover:bg-gray-100">
                      <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                    </Button>
                    <Button onClick={() => handleDeleteCinema(cinema.id)} variant="outline" size="sm" className="flex-1 border-gray-200 rounded-xl text-red-600 hover:text-red-700 hover:bg-gray-100">
                      <Trash2 className="w-4 h-4 mr-2" /> Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================= ROOMS TAB ================= */}
        <TabsContent value="rooms" className="mt-6 space-y-6">

          {/* Thanh Bộ Lọc & Tìm Kiếm Phòng Chiếu */}
          <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                <Filter className="w-4 h-4 text-violet-600" />
                <span>Lọc theo rạp:</span>
              </div>
              <Select
                value={roomSearch.cinemaId ? roomSearch.cinemaId.toString() : "ALL"}
                onValueChange={handleFilterCinemaChange}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200 w-full sm:w-[240px] text-gray-900">
                  <SelectValue placeholder="Tất cả các rạp" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="ALL">Tất cả các rạp</SelectItem>
                  {cinemas.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={openAddRoomModal} className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Thêm phòng chiếu
            </Button>
          </div>

          {/* Bảng dữ liệu */}
          <Card className="bg-white border-gray-200 text-gray-900">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Tên phòng</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Thuộc rạp</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Loại phòng</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Số ghế</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          Không có dữ liệu phòng chiếu phù hợp bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      rooms.map((room) => (
                        <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                <Armchair className="w-5 h-5 text-violet-600" />
                              </div>
                              <span className="font-semibold">{room.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{room.cinemaName}</td>
                          <td className="py-4 px-4">
                            <Badge
                              variant="outline"
                              className={roomTypeColors[room.type as keyof typeof roomTypeColors] || "bg-gray-500/20 text-gray-500"}
                            >
                              {room.type === "STANDARD" ? "2D Standard" : room.type}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{room.totalSeatOfRow * room.totalRow} </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button onClick={() => openEditRoomModal(room)} variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </Button>
                              <Button onClick={() => handleDeleteRoom(room.id)} variant="ghost" size="icon" className="rounded-xl text-red-600 hover:text-red-700 hover:bg-gray-100">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bộ Phân Trang (Pagination UI) */}
              <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">

                {/* INFO PAGE */}
                <span className="text-sm text-gray-500 mr-2">
                  Trang {metaData.currentPage + 1} / {metaData.totalPage}
                </span>

                {/* PREV */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(roomSearch.page - 1)}
                  disabled={roomSearch.page === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* PAGE NUMBER */}
                {Array.from({ length: metaData.totalPage }, (_, i) => i)
                  .filter((p) => {
                    // Luôn hiện trang đầu, trang cuối
                    if (p === 0 || p === metaData.totalPage - 1) return true;
                    // Hiện các trang xung quanh trang hiện tại (khoảng cách là 1 hoặc 2 trang)
                    return Math.abs(roomSearch.page - p) <= 1;
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
                        variant={roomSearch.page === p ? "default" : "outline"}
                        className={`h-9 w-9 p-0 ${roomSearch.page === p
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
                  onClick={() => handlePageChange(roomSearch.page + 1)}
                  disabled={roomSearch.page === metaData.totalPage - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ================= MODAL: DIALOG RẠP PHIM (DÙNG CHUNG THÊM / SỬA) ================= */}
      <Dialog open={isCinemaModalOpen} onOpenChange={setIsCinemaModalOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl text-gray-900">
          <DialogHeader>
            <DialogTitle>{editingCinema ? "Cập nhật rạp chiếu phim" : "Thêm rạp chiếu phim mới"}</DialogTitle>
            <DialogDescription className="text-gray-600">
              Điền các thông số chi tiết để đồng bộ cấu hình rạp trên hệ thống
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-gray-900">
            <div className="space-y-2">
              <Label>Tên rạp</Label>
              <Input
                name="name"
                value={cinemaRequest.name}
                onChange={handleCinemaInputChange}
                placeholder="VD: CGV Vincom Bà Triệu"
                className="bg-gray-50 border-gray-200 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label>Thành phố</Label>
              <Select value={cinemaRequest.city} onValueChange={(val) => setCinemaRequest(p => ({ ...p, city: val }))}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ chi tiết</Label>
              <Textarea
                name="address"
                value={cinemaRequest.address}
                onChange={handleCinemaInputChange}
                placeholder="Nhập vị trí chính xác..."
                className="bg-gray-50 border-gray-200 text-gray-900"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsCinemaModalOpen(false)} className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
                Hủy
              </Button>
              <Button onClick={handleSaveCinema} className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                {editingCinema ? "Cập nhật" : "Thêm rạp"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: DIALOG PHÒNG CHIẾU (DÙNG CHUNG THÊM / SỬA) ================= */}
      <Dialog open={isRoomModalOpen} onOpenChange={setIsRoomModalOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl text-gray-900">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Cập nhật phòng chiếu" : "Thêm phòng chiếu mới"}</DialogTitle>
            <DialogDescription className="text-gray-600">
              Thiết lập lại không gian hạ tầng, sức chứa và kiểu định dạng hình ảnh của phòng chiếu
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Thuộc cụm rạp</Label>
              <Select
                value={roomRequest.cinemaId ? roomRequest.cinemaId.toString() : ""}
                onValueChange={(val) => handleRoomSelectChange("cinemaId", val)}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Chọn rạp chỉ định" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  {cinemas.map((cinema) => (
                    <SelectItem key={cinema.id} value={cinema.id.toString()}>
                      {cinema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên phòng</Label>
                <Input
                  name="name"
                  value={roomRequest.name}
                  onChange={handleRoomInputChange}
                  placeholder="VD: Phòng chiếu 05"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Định dạng phòng</Label>
                <Select
                  value={roomRequest.type}
                  onValueChange={(val) => handleRoomSelectChange("type", val)}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Chọn loại định dạng" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="STANDARD">2D Standard</SelectItem>
                    <SelectItem value="3D">3D</SelectItem>
                    <SelectItem value="IMAX">IMAX</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="4DX">4DX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số hàng ghế</Label>
                <Input
                  name="totalRow"
                  type="number"
                  value={roomRequest.totalRow || ""}
                  onChange={handleRoomInputChange}
                  placeholder="180"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Số ghế mỗi hàng</Label>
                <Input
                  name="totalSeatOfRow"
                  type="number"
                  value={roomRequest.totalSeatOfRow || ""}
                  onChange={handleRoomInputChange}
                  placeholder="VD: 12"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsRoomModalOpen(false)} className="border-gray-200 text-gray-900 hover:bg-gray-100">
                Hủy
              </Button>
              <Button onClick={handleSaveRoom} className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                {editingRoom ? "Lưu thay đổi" : "Thêm phòng"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}