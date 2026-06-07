import { useState } from "react";
import { Plus, Calendar, Clock, MapPin, Edit, Trash2 } from "lucide-react";
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

const showtimes = [
  {
    id: 1,
    code: "ST-20240330-001",
    movie: "Oppenheimer",
    cinema: "CGV Vincom",
    room: "Phòng 1",
    date: "30/03/2026",
    time: "14:30",
    price: 170000,
    availableSeats: 45,
    totalSeats: 180,
    status: "Còn vé",
  },
  {
    id: 2,
    code: "ST-20240330-002",
    movie: "Barbie",
    cinema: "Lotte Cinema",
    room: "Phòng 3",
    date: "30/03/2026",
    time: "15:00",
    price: 150000,
    availableSeats: 30,
    totalSeats: 150,
    status: "Sắp hết",
  },
  {
    id: 3,
    code: "ST-20240330-003",
    movie: "The Dark Knight",
    cinema: "CGV Aeon",
    room: "Phòng 2",
    date: "30/03/2026",
    time: "16:30",
    price: 180000,
    availableSeats: 120,
    totalSeats: 200,
    status: "Còn vé",
  },
  {
    id: 4,
    code: "ST-20240330-004",
    movie: "Inception",
    cinema: "CGV Vincom",
    room: "Phòng 2 (IMAX)",
    date: "30/03/2026",
    time: "18:00",
    price: 250000,
    availableSeats: 0,
    totalSeats: 120,
    status: "Hết vé",
  },
  {
    id: 5,
    code: "ST-20240330-005",
    movie: "Oppenheimer",
    cinema: "Lotte Cinema",
    room: "Phòng 1",
    date: "30/03/2026",
    time: "19:30",
    price: 170000,
    availableSeats: 90,
    totalSeats: 160,
    status: "Còn vé",
  },
  {
    id: 6,
    code: "ST-20240330-006",
    movie: "The Matrix",
    cinema: "CGV Aeon",
    room: "Phòng 5 (VIP)",
    date: "30/03/2026",
    time: "20:00",
    price: 300000,
    availableSeats: 25,
    totalSeats: 50,
    status: "Còn vé",
  },
];

const timeSlots = ["10:00", "12:30", "14:30", "16:30", "18:00", "19:30", "21:00", "22:30"];
const cinemas = ["CGV Vincom", "Lotte Cinema", "CGV Aeon", "Galaxy Cinema"];

const statusColors = {
  "Còn vé": "bg-green-500/20 text-green-600 border-green-500/30",
  "Sắp hết": "bg-orange-500/20 text-orange-600 border-orange-500/30",
  "Hết vé": "bg-red-500/20 text-red-600 border-red-500/30",
};

export function Showtimes() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý suất chiếu</h1>
          <p className="text-gray-500">Quản lý lịch chiếu phim tại các rạp</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
              <Plus className="w-4 h-4 mr-2" />
              Thêm suất chiếu
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm suất chiếu mới</DialogTitle>
              <DialogDescription>
                Tạo suất chiếu mới cho phim
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Chọn phim</Label>
                <Select>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Chọn phim" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="oppenheimer">Oppenheimer</SelectItem>
                    <SelectItem value="barbie">Barbie</SelectItem>
                    <SelectItem value="inception">Inception</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chọn rạp</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Chọn rạp" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      <SelectItem value="cgv">CGV Vincom</SelectItem>
                      <SelectItem value="lotte">Lotte Cinema</SelectItem>
                      <SelectItem value="galaxy">Galaxy Cinema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Chọn phòng</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      <SelectItem value="room1">Phòng 1 (2D)</SelectItem>
                      <SelectItem value="room2">Phòng 2 (IMAX)</SelectItem>
                      <SelectItem value="room3">Phòng 3 (VIP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày chiếu</Label>
                  <Input type="date" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Giờ bắt đầu</Label>
                  <Input type="time" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Giá vé (₫)</Label>
                <Input type="number" placeholder="170000" className="bg-gray-50 border-gray-200" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-200 text-gray-700">
                  Hủy
                </Button>
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  Tạo suất chiếu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <Select>
              <SelectTrigger className="w-full lg:w-56 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Chọn phim" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Tất cả phim</SelectItem>
                <SelectItem value="oppenheimer">Oppenheimer</SelectItem>
                <SelectItem value="barbie">Barbie</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full lg:w-56 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Chọn rạp" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Tất cả rạp</SelectItem>
                {cinemas.map((cinema) => (
                  <SelectItem key={cinema} value={cinema.toLowerCase()}>
                    {cinema}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input type="date" className="bg-gray-50 border-gray-200 rounded-xl" defaultValue="2026-03-30" />

            <Select>
              <SelectTrigger className="w-full lg:w-56 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="available">Còn vé</SelectItem>
                <SelectItem value="almost">Sắp hết</SelectItem>
                <SelectItem value="soldout">Hết vé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="bg-white border-gray-200">
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Mã suất chiếu
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Phim
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Rạp
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Phòng
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Ngày giờ
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Giá vé
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Ghế trống
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Trạng thái
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {showtimes.map((showtime) => (
                      <tr
                        key={showtime.id}
                        className="border-b border-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm font-mono">{showtime.code}</td>
                        <td className="py-4 px-4">
                          <p className="font-semibold">{showtime.movie}</p>
                        </td>
                        <td className="py-4 px-4 text-sm">{showtime.cinema}</td>
                        <td className="py-4 px-4 text-sm">{showtime.room}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {showtime.date}
                            <Clock className="w-4 h-4 text-gray-500 ml-2" />
                            {showtime.time}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold">
                          ₫{showtime.price.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {showtime.availableSeats}/{showtime.totalSeats}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={statusColors[showtime.status as keyof typeof statusColors]}
                          >
                            {showtime.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-xl text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Lịch chiếu phim - 30/03/2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cinemas.map((cinema) => (
                  <div key={cinema} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-violet-600" />
                      <h3 className="font-semibold text-lg">{cinema}</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-3 ml-8">
                      {timeSlots.map((time) => {
                        const hasShowtime = showtimes.find(
                          (s) => s.cinema === cinema && s.time === time
                        );
                        return (
                          <div
                            key={time}
                            className={`p-4 rounded-xl border transition-all ${
                              hasShowtime
                                ? "bg-violet-500/20 border-violet-500/30 hover:bg-purple-500/30"
                                : "bg-gray-50 border-gray-200 opacity-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">{time}</span>
                            </div>
                            {hasShowtime && (
                              <p className="text-sm text-gray-600">{hasShowtime.movie}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
