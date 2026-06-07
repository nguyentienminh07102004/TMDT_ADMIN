import { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { adminApi } from "../lib/adminApi";
import { getAuthProfile, isAuthenticated, saveAuthSession } from "../lib/auth";
import { toast } from "sonner";

type LocationState = {
  from?: { pathname?: string };
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    const profile = getAuthProfile();
    if (!profile.fullName) {
      navigate("/", { replace: true });
      return;
    }

    navigate(state?.from?.pathname ?? "/", { replace: true });
  }, [navigate, state?.from?.pathname]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await adminApi.login(formData);
      saveAuthSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        fullName: response.fullName,
        avatar: response.avatar,
        role: response.role,
      });

      toast.success("Đăng nhập thành công");
      navigate(state?.from?.pathname ?? "/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đăng nhập");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated()) {
    return <Navigate to={state?.from?.pathname ?? "/"} replace />;
  }

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

            <Button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500" disabled={isSubmitting}>
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