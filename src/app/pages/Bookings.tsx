import { FormEvent, useMemo, useState } from "react";
import { Eye, Filter, Loader2, Plus, Search } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { adminApi, type BookingStatus } from "../lib/adminApi";

type BookingRow = {
  id: number;
  userId: string;
  showtimeId: number;
  promotionId: number | null;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: BookingStatus;
  qrCode: string;
  createdAt: string | null;
};

const initialBookings: BookingRow[] = [
  {
    id: 50,
    userId: "usr_001",
    showtimeId: 30,
    promotionId: 40,
    totalAmount: 90000,
    discountAmount: 9000,
    finalAmount: 81000,
    status: "PENDING",
    qrCode: "QR-123",
    createdAt: "2026-05-24T10:00:00Z",
  },
  {
    id: 51,
    userId: "usr_002",
    showtimeId: 31,
    promotionId: null,
    totalAmount: 170000,
    discountAmount: 0,
    finalAmount: 170000,
    status: "CONFIRMED",
    qrCode: "QR-124",
    createdAt: "2026-05-24T11:00:00Z",
  },
  {
    id: 52,
    userId: "usr_003",
    showtimeId: 32,
    promotionId: null,
    totalAmount: 510000,
    discountAmount: 0,
    finalAmount: 510000,
    status: "CANCELLED",
    qrCode: "QR-125",
    createdAt: "2026-05-24T12:00:00Z",
  },
];

const statusLabels: Record<BookingStatus, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Xác nhận",
  CANCELLED: "Đã hủy",
};

const statusColors: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  CONFIRMED: "bg-green-500/20 text-green-600 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-600 border-red-500/30",
};

const bookingStatusOptions: Array<{ label: string; value: BookingStatus }> = [
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Xác nhận", value: "CONFIRMED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

export function Bookings() {
  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    showtimeId: "",
    promotionId: "",
    totalAmount: "",
    discountAmount: "",
    finalAmount: "",
    qrCode: "",
    status: "PENDING" as BookingStatus,
    seatId: "",
    priceAtTime: "",
  });

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        String(booking.id).includes(query) ||
        booking.userId.toLowerCase().includes(query) ||
        booking.qrCode.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleCreateTicket = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const bookingPayload = {
      userId: formData.userId.trim(),
      showtimeId: Number(formData.showtimeId),
      promotionId: formData.promotionId.trim() ? Number(formData.promotionId) : null,
      totalAmount: Number(formData.totalAmount),
      discountAmount: Number(formData.discountAmount),
      finalAmount: Number(formData.finalAmount),
      status: formData.status,
      qrCode: formData.qrCode.trim(),
    };

    const bookingDetailPayload = {
      seatId: Number(formData.seatId),
      priceAtTime: Number(formData.priceAtTime),
    };

    if (
      !bookingPayload.userId ||
      !bookingPayload.showtimeId ||
      !bookingPayload.totalAmount ||
      !bookingPayload.finalAmount ||
      !bookingPayload.qrCode ||
      !bookingDetailPayload.seatId ||
      !bookingDetailPayload.priceAtTime
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin vé");
      return;
    }

    try {
      setIsSubmitting(true);
      const booking = await adminApi.createBooking(bookingPayload);
      await adminApi.createBookingDetail({ bookingId: booking.id, ...bookingDetailPayload });

      setBookings((currentBookings) => [
        {
          id: booking.id,
          userId: booking.userId,
          showtimeId: booking.showtimeId,
          promotionId: booking.promotionId,
          totalAmount: booking.totalAmount,
          discountAmount: booking.discountAmount,
          finalAmount: booking.finalAmount,
          status: booking.status,
          qrCode: booking.qrCode,
          createdAt: booking.createdAt ?? new Date().toISOString(),
        },
        ...currentBookings,
      ]);

      setIsAddDialogOpen(false);
      setFormData({
        userId: "",
        showtimeId: "",
        promotionId: "",
        totalAmount: "",
        discountAmount: "",
        finalAmount: "",
        qrCode: "",
        status: "PENDING",
        seatId: "",
        priceAtTime: "",
      });
      toast.success(`Đã tạo vé cho booking #${booking.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo vé");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý đặt vé</h1>
          <p className="text-gray-500">Chỉ hiển thị các field có trong Booking API</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Tạo vé
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl text-gray-900">
            <DialogHeader>
              <DialogTitle>Tạo vé mới</DialogTitle>
            </DialogHeader>

            <form className="space-y-4 mt-4 text-gray-900" onSubmit={handleCreateTicket}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input id="userId" placeholder="usr_001" value={formData.userId} onChange={(event) => setFormData((current) => ({ ...current, userId: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="showtimeId">Showtime ID</Label>
                  <Input id="showtimeId" type="number" placeholder="30" value={formData.showtimeId} onChange={(event) => setFormData((current) => ({ ...current, showtimeId: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Tổng tiền</Label>
                  <Input id="totalAmount" type="number" placeholder="90000" value={formData.totalAmount} onChange={(event) => setFormData((current) => ({ ...current, totalAmount: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountAmount">Giảm giá</Label>
                  <Input id="discountAmount" type="number" placeholder="9000" value={formData.discountAmount} onChange={(event) => setFormData((current) => ({ ...current, discountAmount: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalAmount">Thành tiền</Label>
                  <Input id="finalAmount" type="number" placeholder="81000" value={formData.finalAmount} onChange={(event) => setFormData((current) => ({ ...current, finalAmount: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promotionId">Promotion ID</Label>
                  <Input id="promotionId" type="number" placeholder="40" value={formData.promotionId} onChange={(event) => setFormData((current) => ({ ...current, promotionId: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qrCode">QR Code</Label>
                  <Input id="qrCode" placeholder="QR-123" value={formData.qrCode} onChange={(event) => setFormData((current) => ({ ...current, qrCode: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seatId">Seat ID</Label>
                  <Input id="seatId" type="number" placeholder="100" value={formData.seatId} onChange={(event) => setFormData((current) => ({ ...current, seatId: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceAtTime">Giá tại thời điểm đặt</Label>
                  <Input id="priceAtTime" type="number" placeholder="90000" value={formData.priceAtTime} onChange={(event) => setFormData((current) => ({ ...current, priceAtTime: event.target.value }))} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData((current) => ({ ...current, status: value as BookingStatus }))}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {bookingStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-200">
                  Hủy
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo vé"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Tìm theo ID booking, user ID hoặc QR code..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-56 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Trạng thái booking" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="CONFIRMED">Xác nhận</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-gray-200 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">User ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Showtime ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Promotion ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Tổng tiền</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Giảm giá</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Thành tiền</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">QR Code</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Tạo lúc</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm">#{booking.id}</td>
                    <td className="py-4 px-4 text-sm">{booking.userId}</td>
                    <td className="py-4 px-4 text-sm">{booking.showtimeId}</td>
                    <td className="py-4 px-4 text-sm">{booking.promotionId ?? "-"}</td>
                    <td className="py-4 px-4 text-sm">₫{booking.totalAmount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm">₫{booking.discountAmount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm font-semibold">₫{booking.finalAmount.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={statusColors[booking.status]}>
                        {statusLabels[booking.status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm font-mono">{booking.qrCode}</td>
                    <td className="py-4 px-4 text-sm">{booking.createdAt ? new Date(booking.createdAt).toLocaleString("vi-VN") : "-"}</td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setSelectedBooking(booking)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Hiển thị {filteredBookings.length} trong tổng số {bookings.length} booking
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedBooking)} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="bg-white border-gray-200 max-w-xl text-gray-900">
          <DialogHeader>
            <DialogTitle>Chi tiết booking</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-3 mt-4 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">ID</span><span>#{selectedBooking.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">User ID</span><span>{selectedBooking.userId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Showtime ID</span><span>{selectedBooking.showtimeId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Promotion ID</span><span>{selectedBooking.promotionId ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tổng tiền</span><span>₫{selectedBooking.totalAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Giảm giá</span><span>₫{selectedBooking.discountAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Thành tiền</span><span>₫{selectedBooking.finalAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Trạng thái</span><Badge variant="outline" className={statusColors[selectedBooking.status]}>{statusLabels[selectedBooking.status]}</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">QR Code</span><span className="font-mono">{selectedBooking.qrCode}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}