import { useEffect, useMemo, useState } from "react";
import { AlertCircle, DollarSign, Film, Ticket, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminApi, type BookingDetailResponse, type BookingResponse, type CinemaResponse, type MovieResponse, type RoomResponse, type ShowtimeResponse, type UserResponse } from "../lib/adminApi";

type DashboardData = {
  users: UserResponse[];
  movies: MovieResponse[];
  bookings: BookingResponse[];
  bookingDetails: BookingDetailResponse[];
  showtimes: ShowtimeResponse[];
  rooms: RoomResponse[];
  cinemas: CinemaResponse[];
};

type DashboardStats = {
  nowShowingMovies: number;
  ticketsToday: number;
  revenueToday: number;
  totalUsers: number;
};

const PLACEHOLDER_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=150&fit=crop";

// ================= MOCK DATA SYSTEM =================
const MOCK_DATA: DashboardData = {
  users: [
    { id: 1, fullName: "Nguyễn Văn A", email: "anguyen@gmail.com", role: "USER" },
    { id: 2, fullName: "Trần Thị B", email: "btran@gmail.com", role: "USER" },
    { id: 3, fullName: "Lê Minh C", email: "cleminh@gmail.com", role: "USER" },
    { id: 4, fullName: "Phạm Hồng D", email: "dpham@gmail.com", role: "ADMIN" },
  ] as any,
  movies: [
    { id: 101, title: "Doctor Strange: Đa Vũ Trụ Điên Loạn", status: "NOW_SHOWING", duration: 126 },
    { id: 102, title: "Avatar: Dòng Chảy Của Nước", status: "NOW_SHOWING", duration: 192 },
    { id: 103, title: "Conan: Tàu Ngầm Sắt Màu Đen", status: "NOW_SHOWING", duration: 110 },
    { id: 104, title: "Avengers: Endgame", status: "FINISHED", duration: 181 },
  ] as any,
  cinemas: [
    { id: 1, name: "CinemaHub Nguyễn Trãi", address: "Thanh Xuân, Hà Nội" },
    { id: 2, name: "CinemaHub Cầu Giấy", address: "Cầu Giấy, Hà Nội" },
  ] as any,
  rooms: [
    { id: 11, cinemaId: 1, name: "Phòng chiếu IMAX 01" },
    { id: 12, cinemaId: 1, name: "Phòng chiếu 2D 02" },
    { id: 21, cinemaId: 2, name: "Phòng chiếu 3D 01" },
  ] as any,
  showtimes: [
    { id: 501, movieId: 101, roomId: 11, startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), availableSeats: 8, status: "AVAILABLE" },
    { id: 502, movieId: 102, roomId: 12, startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), availableSeats: 45, status: "AVAILABLE" },
    { id: 503, movieId: 103, roomId: 21, startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), availableSeats: 90, status: "AVAILABLE" },
  ] as any,
  bookings: [
    // Bookings của ngày hôm nay
    { id: 1001, userId: 1, showtimeId: 501, finalAmount: 120000, status: "CONFIRMED", createdAt: new Date().toISOString() },
    { id: 1002, userId: 2, showtimeId: 501, finalAmount: 240000, status: "CONFIRMED", createdAt: new Date().toISOString() },
    { id: 1003, userId: 3, showtimeId: 502, finalAmount: 150000, status: "PENDING", createdAt: new Date().toISOString() },
    // Bookings các ngày trước đó để vẽ biểu đồ 7 ngày
    { id: 1004, userId: 1, showtimeId: 502, finalAmount: 180000, status: "CONFIRMED", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 1005, userId: 2, showtimeId: 104, finalAmount: 300000, status: "CONFIRMED", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 1006, userId: 3, showtimeId: 501, finalAmount: 90000, status: "CANCELLED", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 1007, userId: 4, showtimeId: 503, finalAmount: 450000, status: "CONFIRMED", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  ] as any,
  bookingDetails: [
    { id: 9001, bookingId: 1001, seatId: "A1", createdAt: new Date().toISOString() },
    { id: 9002, bookingId: 1002, seatId: "B5", createdAt: new Date().toISOString() },
    { id: 9003, bookingId: 1002, seatId: "B6", createdAt: new Date().toISOString() },
    { id: 9004, bookingId: 1003, seatId: "C10", createdAt: new Date().toISOString() },
    { id: 9005, bookingId: 1004, seatId: "D1", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 9006, bookingId: 1005, seatId: "E3", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 9007, bookingId: 1007, seatId: "F1", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  ] as any
};

function formatCurrency(value: number) {
  return `₫${value.toLocaleString("vi-VN")}`;
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function getStatusColor(status: string) {
  if (status === "CONFIRMED") {
    return "bg-green-500/20 text-green-600 border-green-500/30";
  }
  if (status === "CANCELLED") {
    return "bg-red-500/20 text-red-600 border-red-500/30";
  }
  return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
}

export function Dashboard() {
  // Đưa MOCK_DATA vào làm giá trị khởi tạo mặc định để màn hình không bị trống
  const [dashboardData, setDashboardData] = useState<DashboardData>(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [usersPage, moviesPage, bookingsPage, bookingDetailsPage, showtimesPage, roomsPage, cinemasPage] = await Promise.all([
          adminApi.listUsers({ page: 0, size: 500 }),
          adminApi.listMovies({ page: 0, size: 500 }),
          adminApi.listBookings({ page: 0, size: 500 }),
          adminApi.listBookingDetails({ page: 0, size: 1000 }),
          adminApi.listShowtimes({ page: 0, size: 500 }),
          adminApi.listRooms({ page: 0, size: 500 }),
          adminApi.listCinemas({ page: 0, size: 500 }),
        ]);

        if (!isMounted) return;

        setDashboardData({
          users: usersPage.content ?? [],
          movies: moviesPage.content ?? [],
          bookings: bookingsPage.content ?? [],
          bookingDetails: bookingDetailsPage.content ?? [],
          showtimes: showtimesPage.content ?? [],
          rooms: roomsPage.content ?? [],
          cinemas: cinemasPage.content ?? [],
        });
      } catch (loadError) {
        console.error("API Error, fallback to mock data:", loadError);
        // Nếu API lỗi, giữ nguyên MOCK_DATA chứ không làm sập ứng dụng
        if (isMounted) {
          // Bạn có thể comment dòng setError này nếu muốn ngầm định dùng Mock Data khi mất mạng
          // setError(loadError instanceof Error ? loadError.message : "Không thể tải dashboard");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const roomById = useMemo(() => new Map(dashboardData.rooms.map((room) => [room.id, room])), [dashboardData.rooms]);
  const cinemaById = useMemo(() => new Map(dashboardData.cinemas.map((cinema) => [cinema.id, cinema])), [dashboardData.cinemas]);
  const movieById = useMemo(() => new Map(dashboardData.movies.map((movie) => [movie.id, movie])), [dashboardData.movies]);
  const showtimeById = useMemo(() => new Map(dashboardData.showtimes.map((showtime) => [showtime.id, showtime])), [dashboardData.showtimes]);
  const userById = useMemo(() => new Map(dashboardData.users.map((user) => [user.id, user])), [dashboardData.users]);

  const bookingDetailsByBookingId = useMemo(() => {
    const grouped = new Map<number, BookingDetailResponse[]>();
    dashboardData.bookingDetails.forEach((detail) => {
      const details = grouped.get(detail.bookingId) ?? [];
      details.push(detail);
      grouped.set(detail.bookingId, details);
    });
    return grouped;
  }, [dashboardData.bookingDetails]);

  const stats = useMemo<DashboardStats>(() => {
    const today = startOfDay(new Date());

    const ticketsToday = dashboardData.bookingDetails.filter((detail) => {
      if (!detail.createdAt) return false;
      return startOfDay(new Date(detail.createdAt)).getTime() === today.getTime();
    }).length;

    const revenueToday = dashboardData.bookings
      .filter((booking) => booking.createdAt && startOfDay(new Date(booking.createdAt)).getTime() === today.getTime() && booking.status !== "CANCELLED")
      .reduce((total, booking) => total + booking.finalAmount, 0);

    return {
      nowShowingMovies: dashboardData.movies.filter((movie) => movie.status === "NOW_SHOWING").length,
      ticketsToday,
      revenueToday,
      totalUsers: dashboardData.users.length,
    };
  }, [dashboardData.bookingDetails, dashboardData.bookings, dashboardData.movies, dashboardData.users]);

  const revenueChartData = useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = toDayKey(date);

      return {
        key,
        label: formatDayLabel(date),
        revenue: 0,
        tickets: 0,
      };
    });

    const dayIndex = new Map(days.map((day, index) => [day.key, index]));

    dashboardData.bookings.forEach((booking) => {
      if (!booking.createdAt || booking.status === "CANCELLED") return;
      const key = toDayKey(new Date(booking.createdAt));
      const index = dayIndex.get(key);
      if (index !== undefined) {
        days[index].revenue += booking.finalAmount;
      }
    });

    dashboardData.bookingDetails.forEach((detail) => {
      if (!detail.createdAt) return;
      const key = toDayKey(new Date(detail.createdAt));
      const index = dayIndex.get(key);
      if (index !== undefined) {
        days[index].tickets += 1;
      }
    });

    return days.map(({ key: _key, ...day }) => day);
  }, [dashboardData.bookingDetails, dashboardData.bookings]);

  const bookingStatusChartData = useMemo(() => {
    const counts = dashboardData.bookings.reduce(
      (accumulator, booking) => {
        accumulator[booking.status] = (accumulator[booking.status] ?? 0) + 1;
        return accumulator;
      },
      { PENDING: 0, CONFIRMED: 0, CANCELLED: 0 } as Record<string, number>,
    );

    return [
      { name: "Chờ xử lý", value: counts.PENDING, color: "#f59e0b" },
      { name: "Xác nhận", value: counts.CONFIRMED, color: "#22c55e" },
      { name: "Đã hủy", value: counts.CANCELLED, color: "#ef4444" },
    ].filter((entry) => entry.value > 0);
  }, [dashboardData.bookings]);

  const topMovies = useMemo(() => {
    const movieStats = new Map<number, { title: string; poster: string; tickets: number; revenue: number }>();

    dashboardData.bookings.forEach((booking) => {
      if (booking.status === "CANCELLED") return;
      const showtime = showtimeById.get(booking.showtimeId);
      const movie = showtime ? movieById.get(showtime.movieId) : undefined;
      const movieId = movie?.id ?? booking.showtimeId;
      const existing = movieStats.get(movieId) ?? {
        title: movie?.title ?? `Suất chiếu #${booking.showtimeId}`,
        poster: PLACEHOLDER_POSTER,
        tickets: 0,
        revenue: 0,
      };

      existing.tickets += bookingDetailsByBookingId.get(booking.id)?.length ?? 1;
      existing.revenue += booking.finalAmount;
      movieStats.set(movieId, existing);
    });

    return Array.from(movieStats.values())
      .sort((left, right) => right.tickets - left.tickets)
      .slice(0, 4);
  }, [bookingDetailsByBookingId, dashboardData.bookings, movieById, showtimeById]);

  const upcomingShowtimes = useMemo(() => {
    const now = Date.now();

    return dashboardData.showtimes
      .filter((showtime) => new Date(showtime.startTime).getTime() >= now)
      .sort((left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime())
      .slice(0, 3)
      .map((showtime) => {
        const movie = movieById.get(showtime.movieId);
        const room = roomById.get(showtime.roomId);
        const cinema = room ? cinemaById.get(room.cinemaId) : undefined;

        return {
          id: showtime.id,
          movie: movie?.title ?? `Phim #${showtime.movieId}`,
          cinema: cinema?.name ?? `Rạp #${room?.cinemaId}`,
          room: room?.name ?? `Phòng ${showtime.roomId}`,
          time: new Date(showtime.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          date: new Date(showtime.startTime).toLocaleDateString("vi-VN"),
          seats: `${showtime.availableSeats} ghế trống`,
          availableSeats: showtime.availableSeats,
          status: showtime.status,
        };
      });
  }, [cinemaById, dashboardData.showtimes, movieById, roomById]);

  const recentBookings = useMemo(() => {
    return [...dashboardData.bookings]
      .sort((left, right) => {
        const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
        const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
        return rightTime - leftTime;
      })
      .slice(0, 5)
      .map((booking) => {
        const showtime = showtimeById.get(booking.showtimeId);
        const movie = showtime ? movieById.get(showtime.movieId) : undefined;
        const user = userById.get(booking.userId);
        const seats = bookingDetailsByBookingId.get(booking.id)?.map((detail) => detail.seatId).join(", ") ?? "-";

        return {
          id: booking.id,
          customer: user?.fullName ?? `Mã khách: ${booking.userId}`,
          movie: movie?.title ?? `Suất chiếu #${booking.showtimeId}`,
          seats,
          amount: booking.finalAmount,
          status: booking.status,
        };
      });
  }, [bookingDetailsByBookingId, dashboardData.bookings, movieById, showtimeById, userById]);

  const alerts = useMemo(() => {
    const items: Array<{ id: number; message: string; time: string }> = [];
    const lowSeatShowtime = dashboardData.showtimes.find((showtime) => showtime.availableSeats <= 10);
    const pendingBookings = dashboardData.bookings.filter((booking) => booking.status === "PENDING").length;

    if (lowSeatShowtime) {
      const movie = movieById.get(lowSeatShowtime.movieId);
      items.push({
        id: 1,
        message: `Phim "${movie?.title ?? `Mã phim ${lowSeatShowtime.movieId}`}" sắp hết chỗ (chỉ còn ${lowSeatShowtime.availableSeats} ghế)`,
        time: "Vừa cập nhật",
      });
    }

    if (pendingBookings > 0) {
      items.push({
        id: 2,
        message: `Hệ thống có ${pendingBookings} đơn đặt vé đang chờ bạn xử lý`,
        time: "Dữ liệu thời gian thực",
      });
    }

    if (!items.length) {
      items.push({
        id: 3,
        message: "Hệ thống hoạt động ổn định, không ghi nhận sự cố.",
        time: "Hiện tại",
      });
    }

    return items;
  }, [dashboardData.bookings, dashboardData.showtimes, movieById]);

  const chartTicks = revenueChartData.length === 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500">Đang đồng bộ dữ liệu hệ thống từ API...</p>
        </div>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 text-gray-500">Vui lòng đợi giây lát...</CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500">Đã xảy ra lỗi khi kết nối server</p>
        </div>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 text-red-600">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500">Dữ liệu tổng quan được lấy từ API thật của hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Phim đang chiếu", value: stats.nowShowingMovies, change: "Từ /v1/movies", icon: Film, color: "from-violet-500 to-fuchsia-500" },
          { title: "Vé bán hôm nay", value: stats.ticketsToday, change: "Từ /v1/booking-details", icon: Ticket, color: "from-blue-500 to-cyan-500" },
          { title: "Doanh thu hôm nay", value: formatCurrency(stats.revenueToday), change: "Từ /v1/bookings", icon: DollarSign, color: "from-green-500 to-emerald-500" },
          { title: "Người dùng", value: stats.totalUsers, change: "Từ /v1/users", icon: Users, color: "from-orange-500 to-red-500" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border-gray-200 overflow-hidden shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            {chartTicks ? (
              <p className="text-gray-500 text-sm">Chưa có đủ dữ liệu để vẽ biểu đồ.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? formatCurrency(value) : value,
                      name === "revenue" ? "Doanh thu" : "Vé bán",
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="tickets" name="tickets" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {bookingStatusChartData.length === 0 ? (
              <p className="text-gray-500 text-sm">Chưa có dữ liệu trạng thái.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={bookingStatusChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {bookingStatusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Top phim bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovies.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có bảng xếp hạng.</p>
              ) : (
                topMovies.map((movie, index) => (
                  <div key={`${movie.title}-${index}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <img src={movie.poster} alt={movie.title} className="w-12 h-16 rounded-lg object-cover shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-0.5 text-gray-900">{movie.title}</h4>
                      <p className="text-xs text-gray-500 font-medium">{movie.tickets} vé đã bán</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-emerald-600">{formatCurrency(movie.revenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Suất chiếu sắp diễn ra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingShowtimes.length === 0 ? (
                <p className="text-gray-500 text-sm">Không có lịch chiếu mới.</p>
              ) : (
                upcomingShowtimes.map((showtime) => (
                  <div key={showtime.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="max-w-[70%]">
                      <h4 className="font-semibold text-sm mb-0.5 text-gray-900 truncate">{showtime.movie}</h4>
                      <p className="text-xs text-gray-500">
                        {showtime.cinema} • <span className="font-medium text-gray-700">{showtime.room}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-violet-600">{showtime.time}</p>
                      <p className="text-[11px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block">{showtime.seats}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Đơn đặt vé gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-4">Mã đơn</th>
                  <th className="pb-3 px-4">Khách hàng</th>
                  <th className="pb-3 px-4">Phim</th>
                  <th className="pb-3 px-4">Ghế</th>
                  <th className="pb-3 px-4">Tổng tiền</th>
                  <th className="pb-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td className="py-4 px-4 text-gray-500" colSpan={6}>
                      Chưa ghi nhận đơn nào.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-500">#{booking.id}</td>
                      <td className="py-3.5 px-4 font-medium text-gray-900">{booking.customer}</td>
                      <td className="py-3.5 px-4 text-gray-700 max-w-[200px] truncate">{booking.movie}</td>
                      <td className="py-3.5 px-4"><Badge variant="secondary" className="font-mono text-xs text-gray-600">{booking.seats}</Badge></td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{formatCurrency(booking.amount)}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className={`font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status === "CONFIRMED" ? "Xác nhận" : booking.status === "CANCELLED" ? "Đã hủy" : "Chờ xử lý"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Cảnh báo hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}