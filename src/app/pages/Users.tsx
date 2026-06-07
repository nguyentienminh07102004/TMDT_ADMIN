import { FormEvent, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Loader2, Search, Trash2, UserPlus } from "lucide-react";
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
import { Role, UserRequest, UserResponse, UserSearch } from "../types/User";
import { userApi } from "../api/UserApi";
import { CinemaResponse } from "../types/Cinema";
import { cinemaApi } from "../api/CinemaApi";

const roleLabels: Record<Role, string> = {
  [Role.USER]: "Người dùng",
  [Role.ADMIN]: "Quản trị viên",
  [Role.SUPER_ADMIN]: "Quản trị cấp cao",
};

const roleColors: Record<Role, string> = {
  [Role.USER]: "bg-green-500/20 text-green-600 border-green-500/30",
  [Role.ADMIN]: "bg-red-500/20 text-red-600 border-red-500/30",
  [Role.SUPER_ADMIN]: "bg-purple-500/20 text-purple-600 border-purple-500/30",
};

const statusColors = {
  "Hoạt động": "bg-green-500/20 text-green-600 border-green-500/30",
  "Tạm khóa": "bg-red-500/20 text-red-600 border-red-500/30",
};

export function Users() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [cinemas, setCinemas] = useState<CinemaResponse[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    cinemaId: "",
  });

  const [metaData, setMetaData] = useState({ totalPage: 1, currentPage: 0, pageSize: 10 });

  const [userSearch, setUserSearch] = useState<UserSearch>({
    page: 0,
    size: 10,
    keyword: '',
    isLock: undefined,
    role: null
  });

  const fetchUsers = async () => {
    try {
      const response = await userApi.search(userSearch);

      if (response && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers([]);
      }

      if (response && response.metaData) {
        setMetaData({
          totalPage: response.metaData.totalPage || 1,
          pageSize: response.metaData.pageSize || 10,
          currentPage: userSearch.page,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      toast.error("Không thể tải danh sách người dùng");
      setUsers([]);
    }
  };

  const fetchCinemas = async () => {
    try {
      const response = await cinemaApi.search();
      if (response && Array.isArray(response.data)) {
        setCinemas(response.data);
      } else if (Array.isArray(response)) {
        setCinemas(response);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userSearch]);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const handleSearchKeywordChange = (keyword: string) => {
    setUserSearch(prev => ({ ...prev, keyword, page: 0 }));
  };

  const handleRoleFilterChange = (value: string) => {
    setUserSearch(prev => ({
      ...prev,
      role: value === "all" ? null : (value as Role),
      page: 0
    }));
  };

  const handleStatusFilterChange = (value: string) => {
    let isLock: boolean | undefined = undefined;
    if (value === "active") isLock = false;
    if (value === "blocked") isLock = true;

    setUserSearch(prev => ({ ...prev, isLock, page: 0 }));
  };

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.cinemaId) {
      toast.error("Vui lòng chọn cụm rạp quản lý cho Admin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    const payload: UserRequest = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: null,
      cinemaId: Number(formData.cinemaId),
    };

    try {
      setIsSubmitting(true);
      const response = await userApi.createAdmin(payload);

      if (response && response.data) {
        setUsers((currentUsers) => [response.data, ...currentUsers]);
        toast.success(`Đã tạo thành công Admin ${response.data.fullName}`);
      }

      setIsAddDialogOpen(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        cinemaId: "",
      });

      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo tài khoản Admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ĐÃ SỬA: Thay thế userSearch bằng hàm cập nhật state chuẩn setUserSearch
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < metaData.totalPage) {
      setUserSearch((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
          <p className="text-gray-500">Quản lý và cấp tài khoản Admin cho các cụm rạp</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm Admin Rạp
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl text-gray-900">
            <DialogHeader>
              <DialogTitle>Thêm quản trị viên mới</DialogTitle>
              <DialogDescription className="text-gray-600">Tạo tài khoản quản lý phân quyền trực thuộc cụm rạp</DialogDescription>
            </DialogHeader>

            <form className="space-y-4 mt-4 text-gray-900" onSubmit={handleCreateUser}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ tên <span className="text-red-500">*</span></Label>
                  <Input
                    id="fullName"
                    placeholder="Nhập họ tên"
                    required
                    value={formData.fullName}
                    onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
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
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trực thuộc cụm rạp <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.cinemaId}
                    onValueChange={(value) => setFormData((current) => ({ ...current, cinemaId: value }))}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                      <SelectValue placeholder="Chọn rạp phim quản lý" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 max-h-56 overflow-y-auto">
                      {Array.isArray(cinemas) && cinemas.map((cinema) => (
                        <SelectItem key={cinema.id} value={String(cinema.id)}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                      {cinemas.length === 0 && (
                        <p className="text-xs text-center py-2 text-gray-400">Đang tải hoặc không có dữ liệu rạp</p>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  required
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  required
                  value={formData.confirmPassword}
                  onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-200">
                  Hủy
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-violet-500 to-fuchsia-500" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo tài khoản Admin"
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
                placeholder="Tìm theo tên, email, số điện thoại..."
                value={userSearch.keyword}
                onChange={(event) => handleSearchKeywordChange(event.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>

            <Select
              value={userSearch.role ?? "all"}
              onValueChange={handleRoleFilterChange}
            >
              <SelectTrigger className="w-full lg:w-48 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value={Role.USER}>Người dùng</SelectItem>
                <SelectItem value={Role.ADMIN}>Quản trị viên</SelectItem>
                <SelectItem value={Role.SUPER_ADMIN}>Quản trị cấp cao</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={userSearch.isLock === undefined ? "all" : userSearch.isLock ? "blocked" : "active"}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full lg:w-48 bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="blocked">Tạm khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Người dùng</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Email / Số điện thoại</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Vai trò</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Trạng thái</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Ngày tạo</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl ?? undefined} />
                            <AvatarFallback>{user.fullName ? user.fullName[0].toUpperCase() : "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user.fullName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={roleColors[user.role] || ""}>
                          {roleLabels[user.role] || user.role}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Không tìm thấy dữ liệu người dùng hợp lệ hoặc danh sách trống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bộ Phân Trang (Pagination UI) */}
          <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
            {/* INFO PAGE */}
            <span className="text-sm text-gray-500 mr-2">
              Trang {metaData.currentPage + 1} / {metaData.totalPage}
            </span>

            {/* PREV */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(userSearch.page - 1)}
              disabled={userSearch.page === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* PAGE NUMBER LIST */}
            {Array.from({ length: metaData.totalPage }, (_, i) => i)
              .filter((p) => {
                if (p === 0 || p === metaData.totalPage - 1) return true;
                return Math.abs(userSearch.page - p) <= 1;
              })
              .reduce((acc, p, index, array) => {
                // Thêm dấu ba chấm "..." nếu phát hiện khoảng cách giữa 2 trang lớn hơn 1
                if (index > 0 && p - array[index - 1] > 1) {
                  acc.push(
                    <span key={`dots-${p}`} className="w-9 text-center text-gray-400 select-none">
                      ...
                    </span>
                  );
                }

                // Thêm button số trang chính thức
                acc.push(
                  <Button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    variant={userSearch.page === p ? "default" : "outline"}
                    className={`h-9 w-9 p-0 ${userSearch.page === p
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {p + 1}
                  </Button>
                );

                return acc;
              }, [] as React.ReactNode[])}

            {/* NEXT */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(userSearch.page + 1)}
              disabled={userSearch.page === metaData.totalPage - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}