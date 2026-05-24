import { Film, Ticket, DollarSign, Users, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "../components/ui/badge";

const statsData = [
  {
    title: "Phim đang chiếu",
    value: "24",
    change: "+3 so với tháng trước",
    icon: Film,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Vé bán hôm nay",
    value: "1,234",
    change: "+12% so với hôm qua",
    icon: Ticket,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Doanh thu hôm nay",
    value: "₫45.2M",
    change: "+18% so với hôm qua",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Người dùng",
    value: "12,543",
    change: "+234 tuần này",
    icon: Users,
    color: "from-orange-500 to-red-500",
  },
];

const revenueData = [
  { date: "24/03", revenue: 35000000, tickets: 890 },
  { date: "25/03", revenue: 42000000, tickets: 1050 },
  { date: "26/03", revenue: 38000000, tickets: 920 },
  { date: "27/03", revenue: 51000000, tickets: 1280 },
  { date: "28/03", revenue: 48000000, tickets: 1150 },
  { date: "29/03", revenue: 55000000, tickets: 1380 },
  { date: "30/03", revenue: 45200000, tickets: 1234 },
];

const occupancyData = [
  { name: "Đã đặt", value: 68, color: "#8b5cf6" },
  { name: "Còn trống", value: 32, color: "#334155" },
];

const topMovies = [
  {
    id: 1,
    title: "Oppenheimer",
    revenue: "₫125.5M",
    tickets: 3240,
    trend: "+12%",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&h=150&fit=crop",
  },
  {
    id: 2,
    title: "Barbie",
    revenue: "₫98.2M",
    tickets: 2850,
    trend: "+8%",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=100&h=150&fit=crop",
  },
  {
    id: 3,
    title: "The Dark Knight",
    revenue: "₫87.3M",
    tickets: 2340,
    trend: "+15%",
    image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=100&h=150&fit=crop",
  },
  {
    id: 4,
    title: "Inception",
    revenue: "₫76.8M",
    tickets: 2120,
    trend: "+5%",
    image: "https://images.unsplash.com/photo-1574267432644-f26f3b17e58c?w=100&h=150&fit=crop",
  },
];

const upcomingShowtimes = [
  {
    id: 1,
    movie: "Oppenheimer",
    cinema: "CGV Vincom",
    room: "P1",
    time: "14:30",
    date: "30/03/2026",
    seats: "45/180",
  },
  {
    id: 2,
    movie: "Barbie",
    cinema: "Lotte Cinema",
    room: "P3",
    time: "15:00",
    date: "30/03/2026",
    seats: "120/150",
  },
  {
    id: 3,
    movie: "The Dark Knight",
    cinema: "CGV Aeon",
    room: "P2",
    time: "16:30",
    date: "30/03/2026",
    seats: "80/200",
  },
];

const recentBookings = [
  {
    id: "BK-20240330-1234",
    customer: "Nguyễn Văn A",
    movie: "Oppenheimer",
    seats: "A12, A13",
    amount: "₫340,000",
    status: "Đã thanh toán",
  },
  {
    id: "BK-20240330-1233",
    customer: "Trần Thị B",
    movie: "Barbie",
    seats: "C5",
    amount: "₫170,000",
    status: "Đã thanh toán",
  },
  {
    id: "BK-20240330-1232",
    customer: "Lê Văn C",
    movie: "Inception",
    seats: "D8, D9, D10",
    amount: "₫510,000",
    status: "Chờ thanh toán",
  },
];

const alerts = [
  {
    id: 1,
    type: "warning",
    message: "Suất chiếu Oppenheimer 14:30 - Còn 10 ghế trống",
    time: "5 phút trước",
  },
  {
    id: 2,
    type: "info",
    message: "Phim mới 'Dune 2' đã được thêm vào hệ thống",
    time: "15 phút trước",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-[#12121a] border-white/10 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a24",
                    border: "1px solid #ffffff20",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu (₫)"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle>Tỉ lệ lấp đầy ghế</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a24",
                    border: "1px solid #ffffff20",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Movies and Upcoming Showtimes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movies */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle>Phim bán chạy nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-12 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{movie.title}</h4>
                    <p className="text-sm text-gray-400">{movie.tickets} vé</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">{movie.revenue}</p>
                    <p className="text-xs text-gray-400">{movie.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Showtimes */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle>Suất chiếu sắp diễn ra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingShowtimes.map((showtime) => (
                <div
                  key={showtime.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold mb-1">{showtime.movie}</h4>
                    <p className="text-sm text-gray-400">
                      {showtime.cinema} - {showtime.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{showtime.time}</p>
                    <p className="text-xs text-gray-400">{showtime.seats} ghế</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader>
          <CardTitle>Đơn đặt vé gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Mã đơn
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Khách hàng
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Phim
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Ghế
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Tổng tiền
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm">{booking.id}</td>
                    <td className="py-3 px-4 text-sm">{booking.customer}</td>
                    <td className="py-3 px-4 text-sm">{booking.movie}</td>
                    <td className="py-3 px-4 text-sm">{booking.seats}</td>
                    <td className="py-3 px-4 text-sm font-semibold">{booking.amount}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge
                        variant={booking.status === "Đã thanh toán" ? "default" : "secondary"}
                        className={
                          booking.status === "Đã thanh toán"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader>
          <CardTitle>Cảnh báo hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20"
              >
                <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
