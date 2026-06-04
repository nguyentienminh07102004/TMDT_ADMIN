import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Film,
  Clock,
  Building2,
  Armchair,
  Ticket,
  Users,
  Gift,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { clearAuthSession, getAuthProfile } from "../lib/auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Film, label: "Quản lý phim", path: "/movies" },
  { icon: Clock, label: "Quản lý suất chiếu", path: "/showtimes" },
  { icon: Building2, label: "Quản lý rạp / phòng", path: "/cinemas" },
  { icon: Armchair, label: "Quản lý ghế ngồi", path: "/seats" },
  { icon: Ticket, label: "Quản lý đặt vé", path: "/bookings" },
  { icon: Users, label: "Quản lý người dùng", path: "/users" },
  { icon: Gift, label: "Khuyến mãi / Voucher", path: "/promotions" },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const profile = getAuthProfile();
  const roleLabel = profile.role === "ADMIN" ? "Quản trị viên" : "Người dùng";

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">CinemaHub</h2>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-700 border border-purple-500/30"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm phim, suất chiếu, người dùng..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-500/50 rounded-xl h-11"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 rounded-xl"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs rounded-full">
                  3
                </Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={profile.avatar ?? "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">{profile.fullName ?? "Admin User"}</p>
                      <p className="text-xs text-gray-500">{roleLabel}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem className="focus:bg-gray-50">
                    Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-50">
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem className="focus:bg-gray-50 text-red-600" onClick={handleLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
