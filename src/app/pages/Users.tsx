import { FormEvent, useMemo, useState } from "react";
import { Eye, Loader2, Search, Trash2, UserPlus, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { adminApi, type CreateUserPayload, type UserRole, type UserResponse } from "../lib/adminApi";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string | null;
  isLock: boolean;
  createdAt: string | null;
};

const initialUsers: UserRow[] = [
  {
    id: "usr_001",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    role: "USER",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=User1",
    isLock: false,
    createdAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "usr_002",
    fullName: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0945678901",
    role: "ADMIN",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=User5",
    isLock: false,
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "usr_003",
    fullName: "Đỗ Thị F",
    email: "dothif@email.com",
    phone: "0956789012",
    role: "USER",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=User6",
    isLock: true,
    createdAt: "2026-04-12T10:00:00Z",
  },
];

const roleLabels: Record<UserRole, string> = {
  USER: "Người dùng",
  ADMIN: "Quản trị viên",
};

const roleColors: Record<UserRole, string> = {
  USER: "bg-green-500/20 text-green-400 border-green-500/30",
  ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusColors = {
  "Hoạt động": "bg-green-500/20 text-green-400 border-green-500/30",
  "Tạm khóa": "bg-red-500/20 text-red-400 border-red-500/30",
};

function mapUserResponseToRow(user: UserResponse): UserRow {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isLock: Boolean(user.isLock),
    createdAt: user.createdAt ?? null,
  };
}

export function Users() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "USER" as UserRole,
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user.isLock) ||
        (statusFilter === "blocked" && user.isLock);

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchQuery, statusFilter, users]);

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    const payload: CreateUserPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: formData.role,
    };

    try {
      setIsSubmitting(true);
      const createdUser = await adminApi.createUser(payload);
      setUsers((currentUsers) => [mapUserResponseToRow(createdUser), ...currentUsers]);
      setIsAddDialogOpen(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "USER",
      });
      toast.success(`Đã tạo người dùng ${createdUser.fullName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo người dùng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
          <p className="text-gray-400">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a24] border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm người dùng mới</DialogTitle>
              <DialogDescription>Tạo tài khoản mới theo DTO user của API</DialogDescription>
            </DialogHeader>

            <form className="space-y-4 mt-4" onSubmit={handleCreateUser}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ tên</Label>
                  <Input
                    id="fullName"
                    placeholder="Nhập họ tên"
                    value={formData.fullName}
                    onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vai trò</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((current) => ({ ...current, role: value as UserRole }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a24] border-white/10">
                      <SelectItem value="USER">Người dùng</SelectItem>
                      <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-white/10">
                  Hủy
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Tìm theo tên, email, số điện thoại..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10 bg-white/5 border-white/10 rounded-xl"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-white/10">
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="USER">Người dùng</SelectItem>
                <SelectItem value="ADMIN">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-white/10">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="blocked">Tạm khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Người dùng</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Email / Số điện thoại</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Vai trò</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Trạng thái</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Ngày tạo</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl ?? undefined} />
                          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.fullName}</p>
                          <p className="text-xs text-gray-400">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.phone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={statusColors[user.isLock ? "Tạm khóa" : "Hoạt động"]}>
                        {user.isLock ? "Tạm khóa" : "Hoạt động"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-400">
              Hiển thị {filteredUsers.length} trong tổng số {users.length} người dùng
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}