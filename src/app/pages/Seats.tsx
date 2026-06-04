import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Save, Armchair } from "lucide-react";
import { cinemaApi } from "../api/CinemaApi";
import { RoomResponse } from "../types/Room";
import { roomApi } from "../api/RoomApi";
import { Seat, SeatType } from "../types/Seat";
import { seatApi } from "../api/SeatApi";

const seatTypeConfig = {
  STANDARD: { label: "Ghế thường", color: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
  VIP: { label: "Ghế VIP", color: "bg-purple-500", hoverColor: "hover:bg-purple-600" },
  COUPLE: { label: "Ghế đôi", color: "bg-pink-500", hoverColor: "hover:bg-pink-600" },
  UNAVAILABLE: { label: "Không khả dụng", color: "bg-gray-600", hoverColor: "hover:bg-gray-700" },
};

const generateRowLabel = (index: number): string => {
  return String.fromCharCode(65 + index);
};

export function Seats() {
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  
  const [selectedType, setSelectedType] = useState<SeatType>("STANDARD");
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [roomCurrent, setRoomCurrent] = useState<RoomResponse | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sinh sơ đồ mẫu nếu phòng chưa có ghế trên database
  const generateInitialSeats = (roomId: number, totalRow: number, totalSeatOfRow: number) => {
    const initialSeats: Seat[] = [];
    
    for (let r = 0; r < totalRow; r++) {
      const rowLabel = generateRowLabel(r);
      for (let c = 1; c <= totalSeatOfRow; c++) {
        let type: SeatType = "STANDARD";
        let priceMultiplier = 1.0;
        
        if (["D", "E", "F"].includes(rowLabel)) {
          type = "VIP";
          priceMultiplier = 1.2;
        }
        if (r === totalRow - 1 && c % 2 === 0) {
          type = "COUPLE";
          priceMultiplier = 1.5;
        }
        if (rowLabel === "A" && (c === 1 || c === totalSeatOfRow)) {
          type = "UNAVAILABLE";
          priceMultiplier = 0;
        }
        
        initialSeats.push({
          row: rowLabel,
          seatNumber: c,
          rowNumber: type, // Hoặc giữ theo thiết kế DB của bạn
          roomId: roomId,
          type,
          priceMultiplier
        });
      }
    }
    setSeats(initialSeats);
  };

  // 1. Lấy danh sách sơ đồ ghế từ API dựa theo roomId
  const fetchRoomSeats = async (roomId: string, currentRoomObj: RoomResponse) => {
    try {
      const response = await seatApi.search(Number(roomId));
      const dbSeats = response.data || [];

      if (dbSeats.length > 0) {
        // Nếu phòng đã có dữ liệu cấu hình ghế trên database -> Đổ dữ liệu ra
        setSeats(dbSeats);
      } else {
        // Nếu phòng trống hoàn toàn -> Tự động tạo layout thô mẫu ban đầu
        generateInitialSeats(Number(roomId), currentRoomObj.totalRow, currentRoomObj.totalSeatOfRow);
      }
    } catch (error) {
      console.error("Lỗi khi tải sơ đồ ghế:", error);
      setSeats([]);
    }
  };

  // 2. Lấy danh sách rạp khi load trang
  const fetchCinemas = async () => {
    try {
      const response = await cinemaApi.search();
      const cinemaList = response.data || [];
      setCinemas(cinemaList);
      
      if (cinemaList.length > 0) {
        setSelectedCinema(String(cinemaList[0].id));
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp:", error);
    }
  };

  // 3. Lấy danh sách phòng tương ứng với Rạp được chọn
  const fetchRooms = async (cinemaId: string) => {
    try {
      const response = await roomApi.search({
        page: 0,
        size: 1000,
        cinemaId: Number(cinemaId)
      });
      const roomList = response.data || [];
      setRooms(roomList);

      if (roomList.length > 0) {
        const firstRoom = roomList[0];
        setSelectedRoom(String(firstRoom.id));
        setRoomCurrent(firstRoom);
        
        // Gọi API lấy sơ đồ ghế ngay khi phòng đầu tiên được load ra
        fetchRoomSeats(String(firstRoom.id), firstRoom);
      } else {
        setSelectedRoom("");
        setRoomCurrent(null);
        setSeats([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng:", error);
    }
  };

  // Xử lý khi Admin chủ động chuyển đổi phòng chiếu trên SelectBox
  const handleRoomChange = (roomId: string) => {
    setSelectedRoom(roomId);
    const foundRoom = rooms.find((r) => String(r.id) === roomId);
    
    if (foundRoom) {
      setRoomCurrent(foundRoom);
      // Gọi API load ghế của phòng được chọn mới
      fetchRoomSeats(roomId, foundRoom);
    } else {
      setRoomCurrent(null);
      setSeats([]);
    }
  };

  // Logic gọi API lưu thông tin sơ đồ ghế hiện tại xuống cơ sở dữ liệu
  const handleSaveSeats = async () => {
    if (!selectedRoom || seats.length === 0) return;
    setIsSaving(true);
    try {
      await seatApi.update(seats);
      alert("Lưu sơ đồ ghế thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu sơ đồ ghế:", error);
      alert("Đã xảy ra lỗi trong quá trình lưu sơ đồ ghế.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  useEffect(() => {
    if (selectedCinema) {
      fetchRooms(selectedCinema);
    }
  }, [selectedCinema]);

  // Click vào ghế trên Grid để thay đổi loại ghế theo Loại đang chọn
  const handleSeatClick = (row: string, seatNumber: number) => {
    if (!selectedRoom) return;
    
    // Tự động gán hệ số giá đồng bộ theo loại ghế mới được đổi
    let newMultiplier = 1.0;
    if (selectedType === "VIP") newMultiplier = 1.2;
    if (selectedType === "COUPLE") newMultiplier = 1.5;
    if (selectedType === "UNAVAILABLE") newMultiplier = 0;

    setSeats((prev) =>
      prev.map((seat) =>
        seat.row === row && seat.seatNumber === seatNumber
          ? { ...seat, type: selectedType, priceMultiplier: newMultiplier }
          : seat
      )
    );
  };

  // Đếm tổng số ghế dựa vào Key UPPERCASE đồng bộ với Type mới từ API
  const getSeatCounts = () => {
    return {
      STANDARD: seats.filter((s) => s.type === "STANDARD").length,
      VIP: seats.filter((s) => s.type === "VIP").length,
      COUPLE: seats.filter((s) => s.type === "COUPLE").length,
      UNAVAILABLE: seats.filter((s) => s.type === "UNAVAILABLE").length,
    };
  };

  const counts = getSeatCounts();

  const dynamicRows = roomCurrent
    ? Array.from({ length: roomCurrent.totalRow }, (_, i) => generateRowLabel(i))
    : [];

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Quản lý sơ đồ ghế ngồi</h1>
        <p className="text-gray-400">Thiết lập và chỉnh sửa sơ đồ ghế cho từng phòng chiếu</p>
      </div>

      {/* Selection Filters */}
      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Chọn rạp</label>
              <Select value={selectedCinema} onValueChange={setSelectedCinema}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-white">
                  <SelectValue placeholder="Chọn rạp chiếu" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/10 text-white">
                  {cinemas.map((cinema) => (
                    <SelectItem key={cinema.id} value={String(cinema.id)}>
                      {cinema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Chọn phòng</label>
              <Select value={selectedRoom} onValueChange={handleRoomChange}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-white">
                  <SelectValue placeholder="Chọn phòng chiếu" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/10 text-white">
                  {rooms.length === 0 ? (
                    <SelectItem value="none" disabled>Không có phòng nào</SelectItem>
                  ) : (
                    rooms.map((room) => (
                      <SelectItem key={room.id} value={String(room.id)}>
                        {room.name} ({room.type} - {room.totalRow}x {room.totalSeatOfRow})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Type Selector */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Chọn loại ghế để chỉnh sửa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(seatTypeConfig).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as SeatType)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedType === type
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center`}>
                    <Armchair className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{config.label}</p>
                    <p className="text-xs text-gray-400">{counts[type as SeatType]} ghế</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seat Layout */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sơ đồ phòng chiếu {roomCurrent && `- ${roomCurrent.name}`}</CardTitle>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500" 
              disabled={!selectedRoom || isSaving}
              onClick={handleSaveSeats}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Đang lưu..." : "Lưu sơ đồ"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {/* Screen */}
          <div className="mb-12">
            <div className="w-full h-3 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl mb-2" />
            <p className="text-center text-sm text-gray-400">MÀN HÌNH</p>
          </div>

          {/* Seats Grid */}
          <div className="max-w-5xl mx-auto space-y-3 overflow-x-auto pb-4">
            {!roomCurrent || seats.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Vui lòng chọn rạp và phòng có sẵn dữ liệu ghế</p>
            ) : (
              dynamicRows.map((row) => (
                <div key={row} className="flex items-center gap-3 min-w-max justify-center">
                  <div className="w-8 text-center font-semibold text-gray-400">{row}</div>
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: roomCurrent.totalSeatOfRow }, (_, i) => i + 1).map((num) => {
                      // Tìm ghế dựa trên interface Seat mới (s.seatNumber thay vì s.number)
                      const seat = seats.find((s) => s.row === row && s.seatNumber === num);
                      const config = seatTypeConfig[seat?.type || "STANDARD"];
                      return (
                        <button
                          key={num}
                          onClick={() => handleSeatClick(row, num)}
                          className={`w-8 h-8 rounded-lg ${config.color} ${config.hoverColor} transition-all flex items-center justify-center text-xs font-semibold text-white`}
                          title={`${row}${num} - ${config.label}`}
                        >
                          {seat?.type === "COUPLE" ? "♥" : <Armchair className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="w-8 text-center font-semibold text-gray-400">{row}</div>
                </div>
              ))
            )}
          </div>

          {/* Legend */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <p className="text-sm font-semibold mb-4 text-gray-400">Chú thích:</p>
            <div className="flex flex-wrap gap-6">
              {Object.entries(seatTypeConfig).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg ${config.color} flex items-center justify-center`}>
                    <Armchair className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300">{config.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Tổng số ghế</p>
              <p className="text-2xl font-bold">{seats.length}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Ghế có thể sử dụng</p>
              <p className="text-2xl font-bold">{seats.length - counts.UNAVAILABLE}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Ghế VIP</p>
              <p className="text-2xl font-bold">{counts.VIP}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Ghế đôi</p>
              <p className="text-2xl font-bold">{counts.COUPLE}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}