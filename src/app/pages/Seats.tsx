import { useState } from "react";
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
import { Badge } from "../components/ui/badge";

type SeatType = "standard" | "vip" | "couple" | "unavailable";

interface Seat {
  row: string;
  number: number;
  type: SeatType;
}

const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const seatsPerRow = 12;

const seatTypeConfig = {
  standard: { label: "Ghế thường", color: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
  vip: { label: "Ghế VIP", color: "bg-purple-500", hoverColor: "hover:bg-purple-600" },
  couple: { label: "Ghế đôi", color: "bg-pink-500", hoverColor: "hover:bg-pink-600" },
  unavailable: { label: "Không khả dụng", color: "bg-gray-600", hoverColor: "hover:bg-gray-700" },
};

const generateInitialSeats = (): Seat[] => {
  const seats: Seat[] = [];
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      let type: SeatType = "standard";
      
      // VIP rows (D, E, F)
      if (["D", "E", "F"].includes(row)) {
        type = "vip";
      }
      
      // Couple seats in last row
      if (row === "J" && i % 2 === 0) {
        type = "couple";
      }
      
      // Some unavailable seats
      if ((row === "A" && (i === 1 || i === 12)) || (row === "J" && i === 1)) {
        type = "unavailable";
      }
      
      seats.push({ row, number: i, type });
    }
  });
  return seats;
};

export function Seats() {
  const [seats, setSeats] = useState<Seat[]>(generateInitialSeats());
  const [selectedType, setSelectedType] = useState<SeatType>("standard");
  const [selectedCinema, setSelectedCinema] = useState("cgv-vincom");
  const [selectedRoom, setSelectedRoom] = useState("room-1");

  const handleSeatClick = (row: string, number: number) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.row === row && seat.number === number
          ? { ...seat, type: selectedType }
          : seat
      )
    );
  };

  const getSeatCounts = () => {
    return {
      standard: seats.filter((s) => s.type === "standard").length,
      vip: seats.filter((s) => s.type === "vip").length,
      couple: seats.filter((s) => s.type === "couple").length,
      unavailable: seats.filter((s) => s.type === "unavailable").length,
    };
  };

  const counts = getSeatCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Quản lý sơ đồ ghế ngồi</h1>
        <p className="text-gray-400">Thiết lập và chỉnh sửa sơ đồ ghế cho từng phòng chiếu</p>
      </div>

      {/* Selection */}
      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Chọn rạp</label>
              <Select value={selectedCinema} onValueChange={setSelectedCinema}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/10">
                  <SelectItem value="cgv-vincom">CGV Vincom</SelectItem>
                  <SelectItem value="lotte-cinema">Lotte Cinema</SelectItem>
                  <SelectItem value="cgv-aeon">CGV Aeon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Chọn phòng</label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/10">
                  <SelectItem value="room-1">Phòng 1 (2D - 180 ghế)</SelectItem>
                  <SelectItem value="room-2">Phòng 2 (IMAX - 250 ghế)</SelectItem>
                  <SelectItem value="room-3">Phòng 3 (VIP - 50 ghế)</SelectItem>
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
                    <Armchair className="w-5 h-5" />
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
            <CardTitle>Sơ đồ phòng chiếu</CardTitle>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Save className="w-4 h-4 mr-2" />
              Lưu sơ đồ
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
          <div className="max-w-4xl mx-auto space-y-3">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-3">
                <div className="w-8 text-center font-semibold text-gray-400">{row}</div>
                <div className="flex-1 flex justify-center gap-2">
                  {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((num) => {
                    const seat = seats.find((s) => s.row === row && s.number === num);
                    const config = seatTypeConfig[seat?.type || "standard"];
                    return (
                      <button
                        key={num}
                        onClick={() => handleSeatClick(row, num)}
                        className={`w-8 h-8 rounded-lg ${config.color} ${config.hoverColor} transition-all flex items-center justify-center text-xs font-semibold`}
                        title={`${row}${num} - ${config.label}`}
                      >
                        {seat?.type === "couple" ? "♥" : <Armchair className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
                <div className="w-8 text-center font-semibold text-gray-400">{row}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <p className="text-sm font-semibold mb-4 text-gray-400">Chú thích:</p>
            <div className="flex flex-wrap gap-6">
              {Object.entries(seatTypeConfig).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg ${config.color} flex items-center justify-center`}>
                    <Armchair className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{config.label}</span>
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
              <p className="text-2xl font-bold">{seats.length - counts.unavailable}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Ghế VIP</p>
              <p className="text-2xl font-bold">{counts.vip}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Ghế đôi</p>
              <p className="text-2xl font-bold">{counts.couple}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
