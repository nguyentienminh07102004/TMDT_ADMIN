import { useState } from "react";
import { Plus, Percent, Edit, Trash2, Copy } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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

const promotions = [
  {
    id: 1,
    code: "SUMMER20",
    name: "Khuyến mãi mùa hè",
    type: "percentage",
    value: 20,
    minAmount: 200000,
    maxDiscount: 100000,
    quantity: 100,
    used: 45,
    startDate: "01/03/2026",
    endDate: "31/03/2026",
    status: "Đang áp dụng",
    applicableFor: "Tất cả phim",
  },
  {
    id: 2,
    code: "VIP10",
    name: "Ưu đãi VIP",
    type: "percentage",
    value: 10,
    minAmount: 300000,
    maxDiscount: 50000,
    quantity: 50,
    used: 28,
    startDate: "15/03/2026",
    endDate: "15/04/2026",
    status: "Đang áp dụng",
    applicableFor: "Phòng VIP",
  },
  {
    id: 3,
    code: "NEWUSER50",
    name: "Chào mừng thành viên mới",
    type: "fixed",
    value: 50000,
    minAmount: 150000,
    maxDiscount: 50000,
    quantity: 200,
    used: 156,
    startDate: "01/01/2026",
    endDate: "31/12/2026",
    status: "Đang áp dụng",
    applicableFor: "Người dùng mới",
  },
  {
    id: 4,
    code: "WEEKEND15",
    name: "Giảm giá cuối tuần",
    type: "percentage",
    value: 15,
    minAmount: 250000,
    maxDiscount: 75000,
    quantity: 150,
    used: 89,
    startDate: "01/03/2026",
    endDate: "31/03/2026",
    status: "Đang áp dụng",
    applicableFor: "Cuối tuần",
  },
  {
    id: 5,
    code: "BLACKFRIDAY",
    name: "Black Friday Sale",
    type: "percentage",
    value: 30,
    minAmount: 0,
    maxDiscount: 150000,
    quantity: 500,
    used: 500,
    startDate: "24/11/2025",
    endDate: "26/11/2025",
    status: "Hết hạn",
    applicableFor: "Tất cả",
  },
  {
    id: 6,
    code: "IMAX25",
    name: "Ưu đãi phòng IMAX",
    type: "percentage",
    value: 25,
    minAmount: 400000,
    maxDiscount: 100000,
    quantity: 80,
    used: 12,
    startDate: "25/03/2026",
    endDate: "10/04/2026",
    status: "Chưa bắt đầu",
    applicableFor: "Phòng IMAX",
  },
];

const statusColors = {
  "Đang áp dụng": "bg-green-500/20 text-green-600 border-green-500/30",
  "Chưa bắt đầu": "bg-blue-500/20 text-blue-600 border-blue-500/30",
  "Hết hạn": "bg-gray-500/20 text-gray-500 border-gray-500/30",
};

export function Promotions() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý khuyến mãi / Voucher</h1>
          <p className="text-gray-500">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
              <Plus className="w-4 h-4 mr-2" />
              Tạo voucher mới
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo voucher mới</DialogTitle>
              <DialogDescription>
                Tạo mã giảm giá cho khách hàng
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mã voucher</Label>
                  <Input placeholder="VD: SUMMER20" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Tên chương trình</Label>
                  <Input placeholder="Nhập tên chương trình" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea placeholder="Mô tả về chương trình..." className="bg-gray-50 border-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại giảm giá</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed">Số tiền cố định (₫)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Giá trị giảm</Label>
                  <Input type="number" placeholder="20" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giá trị đơn tối thiểu (₫)</Label>
                  <Input type="number" placeholder="200000" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Giảm tối đa (₫)</Label>
                  <Input type="number" placeholder="100000" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Số lượng voucher</Label>
                <Input type="number" placeholder="100" className="bg-gray-50 border-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày bắt đầu</Label>
                  <Input type="date" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc</Label>
                  <Input type="date" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Áp dụng cho</Label>
                <Select>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Chọn đối tượng áp dụng" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="new-user">Người dùng mới</SelectItem>
                    <SelectItem value="vip">Phòng VIP</SelectItem>
                    <SelectItem value="imax">Phòng IMAX</SelectItem>
                    <SelectItem value="weekend">Cuối tuần</SelectItem>
                    <SelectItem value="specific-movie">Phim cụ thể</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-200">
                  Hủy
                </Button>
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  Tạo voucher
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang áp dụng</p>
                <p className="text-2xl font-bold">
                  {promotions.filter(p => p.status === "Đang áp dụng").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chưa bắt đầu</p>
                <p className="text-2xl font-bold">
                  {promotions.filter(p => p.status === "Chưa bắt đầu").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hết hạn</p>
                <p className="text-2xl font-bold">
                  {promotions.filter(p => p.status === "Hết hạn").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số voucher</p>
                <p className="text-2xl font-bold">{promotions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id} className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 border border-violet-500/30 rounded-lg">
                      <code className="text-violet-700 font-mono font-semibold">{promo.code}</code>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-lg">{promo.name}</h3>
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[promo.status as keyof typeof statusColors]}
                >
                  {promo.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Loại giảm giá:</span>
                  <span className="font-semibold">
                    {promo.type === "percentage" ? `${promo.value}%` : `₫${promo.value.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Đơn tối thiểu:</span>
                  <span className="font-semibold">₫{promo.minAmount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Giảm tối đa:</span>
                  <span className="font-semibold">₫{promo.maxDiscount.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Số lượng:</span>
                    <span className="text-sm">{promo.used} / {promo.quantity}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                      style={{ width: `${(promo.used / promo.quantity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Thời gian:</span>
                  <span className="text-sm">{promo.startDate} - {promo.endDate}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Áp dụng cho:</span>
                  <span className="text-sm">{promo.applicableFor}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-gray-200 rounded-xl">
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-gray-200 rounded-xl text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
