import { useState } from "react";
import { Plus, MapPin, Edit, Trash2, Building2, Armchair } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const cinemas = [
  {
    id: 1,
    name: "CGV Vincom",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    rooms: 8,
    totalSeats: 1200,
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Lotte Cinema",
    address: "456 Lê Lợi, Quận 1, TP.HCM",
    rooms: 6,
    totalSeats: 900,
    status: "Hoạt động",
  },
  {
    id: 3,
    name: "CGV Aeon",
    address: "789 Xa lộ Hà Nội, Quận 2, TP.HCM",
    rooms: 10,
    totalSeats: 1500,
    status: "Hoạt động",
  },
  {
    id: 4,
    name: "Galaxy Cinema",
    address: "321 Cách Mạng Tháng 8, Quận 3, TP.HCM",
    rooms: 5,
    totalSeats: 750,
    status: "Bảo trì",
  },
];

const rooms = [
  {
    id: 1,
    name: "Phòng 1",
    cinema: "CGV Vincom",
    type: "2D Standard",
    capacity: 180,
    status: "Hoạt động",
    screenSize: "12m x 6m",
  },
  {
    id: 2,
    name: "Phòng 2",
    cinema: "CGV Vincom",
    type: "IMAX",
    capacity: 250,
    status: "Hoạt động",
    screenSize: "20m x 10m",
  },
  {
    id: 3,
    name: "Phòng 3",
    cinema: "Lotte Cinema",
    type: "3D",
    capacity: 150,
    status: "Hoạt động",
    screenSize: "10m x 5m",
  },
  {
    id: 4,
    name: "Phòng 4",
    cinema: "CGV Aeon",
    type: "VIP",
    capacity: 50,
    status: "Hoạt động",
    screenSize: "8m x 4m",
  },
  {
    id: 5,
    name: "Phòng 5",
    cinema: "CGV Aeon",
    type: "4DX",
    capacity: 120,
    status: "Bảo trì",
    screenSize: "12m x 6m",
  },
  {
    id: 6,
    name: "Phòng 1",
    cinema: "Galaxy Cinema",
    type: "2D Standard",
    capacity: 160,
    status: "Hoạt động",
    screenSize: "11m x 5.5m",
  },
];

const roomTypeColors = {
  "2D Standard": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "3D": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "IMAX": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "VIP": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "4DX": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const statusColors = {
  "Hoạt động": "bg-green-500/20 text-green-400 border-green-500/30",
  "Bảo trì": "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export function Cinemas() {
  const [isAddCinemaOpen, setIsAddCinemaOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Quản lý rạp / phòng chiếu</h1>
        <p className="text-gray-400">Quản lý thông tin rạp phim và phòng chiếu</p>
      </div>

      <Tabs defaultValue="cinemas" className="w-full">
        <TabsList className="bg-[#12121a] border-white/10">
          <TabsTrigger value="cinemas">Danh sách rạp</TabsTrigger>
          <TabsTrigger value="rooms">Danh sách phòng chiếu</TabsTrigger>
        </TabsList>

        {/* Cinemas Tab */}
        <TabsContent value="cinemas" className="mt-6 space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAddCinemaOpen} onOpenChange={setIsAddCinemaOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm rạp mới
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a24] border-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm rạp chiếu phim mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin rạp chiếu phim
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Tên rạp</Label>
                    <Input placeholder="VD: CGV Vincom" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Địa chỉ</Label>
                    <Textarea placeholder="Nhập địa chỉ đầy đủ..." className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea placeholder="Mô tả về rạp..." className="bg-white/5 border-white/10" />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsAddCinemaOpen(false)} className="border-white/10">
                      Hủy
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                      Thêm rạp
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cinemas.map((cinema) => (
              <Card key={cinema.id} className="bg-[#12121a] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{cinema.name}</h3>
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{cinema.address}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusColors[cinema.status as keyof typeof statusColors]}
                    >
                      {cinema.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Số phòng</p>
                      <p className="text-2xl font-bold">{cinema.rooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Tổng ghế</p>
                      <p className="text-2xl font-bold">{cinema.totalSeats}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-white/10 rounded-xl">
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-white/10 rounded-xl text-red-400">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="mt-6 space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm phòng chiếu
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a24] border-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm phòng chiếu mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin phòng chiếu
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Thuộc rạp</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Chọn rạp" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a24] border-white/10">
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
                      <Input placeholder="VD: Phòng 1" className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Loại phòng</Label>
                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a24] border-white/10">
                          <SelectItem value="2d">2D Standard</SelectItem>
                          <SelectItem value="3d">3D</SelectItem>
                          <SelectItem value="imax">IMAX</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                          <SelectItem value="4dx">4DX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sức chứa (ghế)</Label>
                      <Input type="number" placeholder="180" className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Kích thước màn hình</Label>
                      <Input placeholder="12m x 6m" className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsAddRoomOpen(false)} className="border-white/10">
                      Hủy
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                      Thêm phòng
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-[#12121a] border-white/10">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                        Tên phòng
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                        Thuộc rạp
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                        Loại phòng
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                        Sức chứa
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                        Kích thước màn hình
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                        Trạng thái
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr
                        key={room.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <Armchair className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="font-semibold">{room.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm">{room.cinema}</td>
                        <td className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={roomTypeColors[room.type as keyof typeof roomTypeColors]}
                          >
                            {room.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm">{room.capacity} ghế</td>
                        <td className="py-4 px-4 text-sm">{room.screenSize}</td>
                        <td className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={statusColors[room.status as keyof typeof statusColors]}
                          >
                            {room.status}
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
                              className="rounded-xl text-red-400 hover:text-red-300"
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
      </Tabs>
    </div>
  );
}
