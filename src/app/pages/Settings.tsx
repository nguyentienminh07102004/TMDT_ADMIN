import { Save, Bell, Mail, Shield, CreditCard, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Cài đặt hệ thống</h1>
        <p className="text-gray-500">Quản lý cấu hình và tùy chỉnh hệ thống</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white border-gray-200">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-violet-600" />
                </div>
                <CardTitle>Thông tin hệ thống</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên hệ thống</Label>
                  <Input defaultValue="CinemaHub Admin" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Email hệ thống</Label>
                  <Input
                    type="email"
                    defaultValue="admin@cinemahub.com"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số điện thoại hỗ trợ</Label>
                  <Input defaultValue="1900-1234" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Múi giờ</Label>
                  <Select defaultValue="asia-hcm">
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="asia-hcm">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                      <SelectItem value="asia-bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="asia-singapore">Asia/Singapore (GMT+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ngôn ngữ mặc định</Label>
                <Select defaultValue="vi">
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Cấu hình đặt vé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Thời gian giữ ghế (phút)</Label>
                  <Input type="number" defaultValue="10" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Số ghế tối đa mỗi đơn</Label>
                  <Input type="number" defaultValue="10" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Cho phép đặt vé trước</p>
                  <p className="text-sm text-gray-500">
                    Khách hàng có thể đặt vé cho các suất chiếu sắp tới
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Yêu cầu xác thực email</p>
                  <p className="text-sm text-gray-500">
                    Khách hàng phải xác thực email trước khi đặt vé
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle>Cài đặt thông báo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Thông báo đặt vé mới</p>
                  <p className="text-sm text-gray-500">
                    Nhận thông báo khi có đơn đặt vé mới
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Thông báo thanh toán</p>
                  <p className="text-sm text-gray-500">
                    Nhận thông báo về các giao dịch thanh toán
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Cảnh báo suất chiếu sắp hết vé</p>
                  <p className="text-sm text-gray-500">
                    Thông báo khi suất chiếu còn ít vé
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Báo cáo doanh thu hàng ngày</p>
                  <p className="text-sm text-gray-500">
                    Gửi báo cáo tổng kết doanh thu qua email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-pink-600" />
                </div>
                <CardTitle>Cấu hình Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SMTP Server</Label>
                <Input defaultValue="smtp.gmail.com" className="bg-gray-50 border-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input defaultValue="587" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Email gửi</Label>
                  <Input
                    type="email"
                    defaultValue="noreply@cinemahub.com"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="mt-6 space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">VNPay</p>
                    <p className="text-sm text-gray-500">Cổng thanh toán điện tử</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Momo</p>
                    <p className="text-sm text-gray-500">Ví điện tử Momo</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">ZaloPay</p>
                    <p className="text-sm text-gray-500">Ví điện tử ZaloPay</p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Giá vé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ghế thường (₫)</Label>
                  <Input type="number" defaultValue="150000" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Ghế VIP (₫)</Label>
                  <Input type="number" defaultValue="200000" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ghế đôi (₫)</Label>
                  <Input type="number" defaultValue="300000" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Phụ thu IMAX (₫)</Label>
                  <Input type="number" defaultValue="100000" className="bg-gray-50 border-gray-200" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <CardTitle>Bảo mật & Quyền truy cập</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Xác thực 2 yếu tố (2FA)</p>
                  <p className="text-sm text-gray-500">
                    Bắt buộc xác thực 2 lớp cho tài khoản admin
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Đăng nhập bằng Google</p>
                  <p className="text-sm text-gray-500">
                    Cho phép đăng nhập qua tài khoản Google
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold mb-1">Ghi log hoạt động</p>
                  <p className="text-sm text-gray-500">
                    Lưu lại tất cả các hành động trong hệ thống
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Thời gian hết phiên đăng nhập (phút)</Label>
                <Input type="number" defaultValue="60" className="bg-gray-50 border-gray-200" />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mật khẩu hiện tại</Label>
                <Input type="password" className="bg-gray-50 border-gray-200" />
              </div>

              <div className="space-y-2">
                <Label>Mật khẩu mới</Label>
                <Input type="password" className="bg-gray-50 border-gray-200" />
              </div>

              <div className="space-y-2">
                <Label>Xác nhận mật khẩu mới</Label>
                <Input type="password" className="bg-gray-50 border-gray-200" />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  Đổi mật khẩu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
