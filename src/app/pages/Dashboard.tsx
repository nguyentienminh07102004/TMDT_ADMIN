import { useEffect, useMemo, useState } from "react";
import { AlertCircle, DollarSign, Film, Ticket, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Bar,
  BarChart,
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
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    users: [],
    movies: [],
    bookings: [],
    bookingDetails: [],
    showtimes: [],
    rooms: [],
    cinemas: [],
  });
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

        if (!isMounted) {
          return;
        }

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
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải dashboard");
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
      if (!detail.createdAt) {
        return false;
      }

      return startOfDay(new Date(detail.createdAt)).getTime() === today.getTime();
    }).length;

    const revenueToday = dashboardData.bookings
      .filter((booking) => booking.createdAt && startOfDay(new Date(booking.createdAt)).getTime() === today.getTime())
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
      if (!booking.createdAt) {
        return;
      }

      const key = toDayKey(new Date(booking.createdAt));
      const index = dayIndex.get(key);

      if (index !== undefined) {
        days[index].revenue += booking.finalAmount;
      }
    });

    dashboardData.bookingDetails.forEach((detail) => {
      if (!detail.createdAt) {
        return;
      }

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
      const showtime = showtimeById.get(booking.showtimeId);
      const movie = showtime ? movieById.get(showtime.movieId) : undefined;
      const movieId = movie?.id ?? booking.showtimeId;
      const existing = movieStats.get(movieId) ?? {
        title: movie?.title ?? `Showtime #${booking.showtimeId}`,
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
          movie: movie?.title ?? `Movie #${showtime.movieId}`,
          cinema: cinema?.name ?? `Room #${showtime.roomId}`,
          room: room?.name ?? `Phòng ${showtime.roomId}`,
          time: new Date(showtime.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          date: new Date(showtime.startTime).toLocaleDateString("vi-VN"),
          seats: `${showtime.availableSeats} ghế`,
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
          customer: user?.fullName ?? booking.userId,
          movie: movie?.title ?? `Showtime #${booking.showtimeId}`,
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
        message: `${movie?.title ?? `Showtime #${lowSeatShowtime.id}`} còn ${lowSeatShowtime.availableSeats} ghế trống`,
        time: "Vừa cập nhật",
      });
    }

    if (pendingBookings > 0) {
      items.push({
        id: 2,
        message: `Có ${pendingBookings} booking đang chờ xử lý`,
        time: "Từ dữ liệu booking",
      });
    }

    if (!items.length) {
      items.push({
        id: 3,
        message: "Dữ liệu hệ thống đang ổn định, chưa có cảnh báo mới",
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
          <p className="text-gray-500">Đang tải dữ liệu thật từ API...</p>
        </div>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 text-gray-500">Đang đồng bộ dữ liệu...</CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500">Không thể tải dữ liệu từ API</p>
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
            <Card key={index} className="bg-white border-gray-200 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            {chartTicks ? (
              <p className="text-gray-500">Chưa có đủ dữ liệu để vẽ biểu đồ.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? formatCurrency(value) : value,
                      name === "revenue" ? "Doanh thu" : "Vé",
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 4 }} />
                  <Line type="monotone" dataKey="tickets" name="Vé bán" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Trạng thái booking</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {bookingStatusChartData.length === 0 ? (
              <p className="text-gray-500">Chưa có dữ liệu booking.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={bookingStatusChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
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
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Phim có nhiều vé nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovies.length === 0 ? (
                <p className="text-gray-500">Chưa có dữ liệu phim và booking để xếp hạng.</p>
              ) : (
                topMovies.map((movie, index) => (
                  <div key={`${movie.title}-${index}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 transition-colors">
                    <img src={PLACEHOLDER_POSTER} alt={movie.title} className="w-12 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{movie.title}</h4>
                      <p className="text-sm text-gray-500">{movie.tickets} vé</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCurrency(movie.revenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Suất chiếu sắp diễn ra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingShowtimes.length === 0 ? (
                <p className="text-gray-500">Chưa có suất chiếu sắp tới.</p>
              ) : (
                upcomingShowtimes.map((showtime) => (
                  <div key={showtime.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-semibold mb-1">{showtime.movie}</h4>
                      <p className="text-sm text-gray-500">
                        {showtime.cinema} - {showtime.room}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{showtime.time}</p>
                      <p className="text-xs text-gray-500">{showtime.seats}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Đơn đặt vé gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mã đơn</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phim</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ghế</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tổng tiền</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td className="py-4 px-4 text-gray-500" colSpan={6}>
                      Chưa có đơn đặt vé.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                      <td className="py-3 px-4 text-sm">#{booking.id}</td>
                      <td className="py-3 px-4 text-sm">{booking.customer}</td>
                      <td className="py-3 px-4 text-sm">{booking.movie}</td>
                      <td className="py-3 px-4 text-sm">{booking.seats}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{formatCurrency(booking.amount)}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
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

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Cảnh báo hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}