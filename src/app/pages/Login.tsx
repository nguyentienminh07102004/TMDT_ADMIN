import { FormEvent, useEffect, useState } from "react";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { userApi } from "../api/UserApi";
import { Login as LoginType } from "../types/User";

export function Login() {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      window.location.href = "/";
    }
  }, []);

  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoginType>({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true); 
      
      // Call API Đăng nhập
      const data = await userApi.login(formData);
      const response = data.data;
      
      // 2. LƯU TOKENS
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      
      // 3. GOM CỤM DỮ LIỆU PROFILE ĐỂ DASHBOARDLAYOUT ĐỌC ĐƯỢC TRỰC TIẾP
      const userProfile = {
        role: response.role,
        fullName: response.fullName,
        avatar: response.avatar || null
      };
      
      // Lưu dưới dạng JSON string (Khớp với các key 'profile'/'user' mà Layout tìm kiếm)
      localStorage.setItem("profile", JSON.stringify(userProfile));

      toast.success("Đăng nhập thành công");
      
      // Điều hướng bằng reload full page sang trang quản trị
      window.location.href = redirectTo ?? "/";
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error(error instanceof Error ? error.message : "Không thể đăng nhập");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.15),_transparent_35%)]" />
      <Card className="relative z-10 w-full max-w-md bg-white/90 border-gray-200 backdrop-blur-xl shadow-2xl shadow-gray-300/40 text-gray-900">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
              <LockKeyhole className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold">Đăng nhập quản trị</h1>
            <p className="text-sm text-gray-500">Dùng tài khoản admin để vào dashboard.</p>
          </div>

          <form className="space-y-4 text-gray-900" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  className="pl-10 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  className="pl-10 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}