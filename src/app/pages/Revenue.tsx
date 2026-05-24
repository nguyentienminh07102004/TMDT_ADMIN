import { useState } from "react";
import { Download, TrendingUp, DollarSign, Ticket, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const dailyRevenue = [
  { date: "24/03", revenue: 35000000, tickets: 890, occupancy: 65 },
  { date: "25/03", revenue: 42000000, tickets: 1050, occupancy: 72 },
  { date: "26/03", revenue: 38000000, tickets: 920, occupancy: 68 },
  { date: "27/03", revenue: 51000000, tickets: 1280, occupancy: 78 },
  { date: "28/03", revenue: 48000000, tickets: 1150, occupancy: 75 },
  { date: "29/03", revenue: 55000000, tickets: 1380, occupancy: 82 },
  { date: "30/03", revenue: 45200000, tickets: 1234, occupancy: 70 },
];

const monthlyRevenue = [
  { month: "T1", revenue: 980000000, tickets: 24500 },
  { month: "T2", revenue: 1050000000, tickets: 26250 },
  { month: "T3", revenue: 1240000000, tickets: 31000 },
  { month: "T4", revenue: 1180000000, tickets: 29500 },
  { month: "T5", revenue: 1320000000, tickets: 33000 },
  { month: "T6", revenue: 1450000000, tickets: 36250 },
];

const topMovies = [
  { name: "Oppenheimer", revenue: 125500000, percentage: 28 },
  { name: "Barbie", revenue: 98200000, percentage: 22 },
  { name: "The Dark Knight", revenue: 87300000, percentage: 19 },
  { name: "Inception", revenue: 76800000, percentage: 17 },
  { name: "Khác", revenue: 62200000, percentage: 14 },
];

const revenueByCinema = [
  { cinema: "CGV Vincom", revenue: 156000000, tickets: 3900, color: "#8b5cf6" },
  { cinema: "Lotte Cinema", revenue: 134000000, tickets: 3350, color: "#ec4899" },
  { cinema: "CGV Aeon", revenue: 98000000, tickets: 2450, color: "#06b6d4" },
  { cinema: "Galaxy Cinema", revenue: 62000000, tickets: 1550, color: "#f59e0b" },
];

const genreRevenue = [
  { name: "Action", value: 35, color: "#ef4444" },
  { name: "Drama", value: 28, color: "#8b5cf6" },
  { name: "Comedy", value: 18, color: "#f59e0b" },
  { name: "Sci-Fi", value: 12, color: "#06b6d4" },
  { name: "Horror", value: 7, color: "#6b7280" },
];

const peakHours = [
  { time: "10:00", bookings: 45 },
  { time: "12:00", bookings: 89 },
  { time: "14:00", bookings: 156 },
  { time: "16:00", bookings: 234 },
  { time: "18:00", bookings: 289 },
  { time: "20:00", bookings: 312 },
  { time: "22:00", bookings: 187 },
];

export function Revenue() {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Báo cáo doanh thu</h1>
          <p className="text-gray-400">Phân tích và thống kê doanh thu hệ thống</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Time Range Filter */}
      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Khoảng thời gian:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 bg-white/5 border-white/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-white/10">
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
                <SelectItem value="year">Năm nay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#12121a] border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tổng doanh thu</p>
                <p className="text-2xl font-bold">₫314.2M</p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#12121a] border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tổng vé bán</p>
                <p className="text-2xl font-bold">7,904</p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.3%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#12121a] border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Lượng khách</p>
                <p className="text-2xl font-bold">6,542</p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +15.2%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#12121a] border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Lấp đầy TB</p>
                <p className="text-2xl font-bold">72.8%</p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +3.1%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="bg-[#12121a] border-white/10">
          <TabsTrigger value="daily">Theo ngày</TabsTrigger>
          <TabsTrigger value="monthly">Theo tháng</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <Card className="bg-[#12121a] border-white/10">
            <CardHeader>
              <CardTitle>Doanh thu theo ngày (7 ngày qua)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dailyRevenue}>
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
                  <Bar dataKey="revenue" name="Doanh thu (₫)" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <Card className="bg-[#12121a] border-white/10">
            <CardHeader>
              <CardTitle>Doanh thu theo tháng (6 tháng qua)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#888" />
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
                    dot={{ fill: "#8b5cf6", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movies */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle>Top phim theo doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovies.map((movie, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{movie.name}</span>
                    <span className="text-green-400">₫{movie.revenue.toLocaleString()}</span>
                  </div>
                  <div className="relative w-full bg-white/10 rounded-full h-2">
                    <div
                      className="absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${movie.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{movie.percentage}% tổng doanh thu</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle>Doanh thu theo thể loại</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {genreRevenue.map((entry, index) => (
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

        {/* Revenue by Cinema */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle>Doanh thu theo rạp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByCinema.map((cinema, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{cinema.cinema}</h4>
                    <span className="text-green-400 font-semibold">
                      ₫{cinema.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{cinema.tickets.toLocaleString()} vé</span>
                    <span>₫{Math.round(cinema.revenue / cinema.tickets).toLocaleString()} / vé</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle>Khung giờ đặt vé</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a24",
                    border: "1px solid #ffffff20",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="bookings" name="Số đơn" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
