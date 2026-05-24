# Booking API Detail

Tài liệu này mô tả chi tiết các API chính của project booking/e-commerce trong `6_8_TMDT_backend`, bao gồm:
- endpoint
- method
- request body
- response body
- kiểu dữ liệu từng field
- các enum giá trị hợp lệ

> Base URL thường dùng trong project:
>
> ```text
> http://localhost:8080/api
> ```
>
> Lưu ý: nếu ứng dụng không cấu hình prefix `/api` ở tầng gateway/filter thì base URL có thể chỉ là `http://localhost:8080`.

---

## 1) Format response chung

Tất cả controller đang trả về theo wrapper `ResponseDto<T>`.

File định nghĩa:
- `common/src/main/java/com/quangnt/common/dto/ResponseDto.java`

### Cấu trúc chung

| Field | Type | Ý nghĩa |
|---|---|---|
| `success` | `boolean` | Trạng thái thành công/thất bại |
| `message` | `String` | Thông báo trả về |
| `data` | `T` | Dữ liệu chính của API |
| `statusCode` | `Integer` | HTTP status code |
| `metaData` | `MetaData` | Thông tin phân trang (nếu có) |

### `MetaData`

File định nghĩa:
- `common/src/main/java/com/quangnt/common/dto/MetaData.java`

| Field | Type | Ý nghĩa |
|---|---|---|
| `totalPage` | `int` | Tổng số trang |
| `currentPage` | `int` | Trang hiện tại |
| `pageSize` | `int` | Kích thước mỗi trang |

### Response mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {},
  "statusCode": 200,
  "metaData": null
}
```

---

## 2) Enum values dùng trong request/response

### `Role`
- `USER`
- `ADMIN`

### `RoomType`
- `STANDARD`
- `IMAX`
- `VIP`
- `FOUR_DX`

### `SeatType`
- `STANDARD`
- `VIP`
- `COUPLE`

### `MovieStatus`
- `COMING_SOON`
- `NOW_SHOWING`
- `ENDED`

### `ShowtimeStatus`
- `SCHEDULED`
- `ONGOING`
- `ENDED`
- `CANCELLED`

### `BookingStatus`
- `PENDING`
- `CONFIRMED`
- `CANCELLED`

### `PaymentMethod`
- `VNPAY`
- `MOMO`
- `ZALOPAY`
- `CASH`

### `PaymentStatus`
- `PENDING`
- `SUCCESS`
- `FAILED`
- `REFUNDED`

---

# 3) User API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/UserController.java`

Base path:
- `/v1/users`

---

## 3.1 Register user

**Method:** `POST`

**Endpoint:** `/v1/users/register`

**Auth:** `noauth`

### Request body: `UserCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `email` | `String` | Yes | Email đăng ký |
| `phone` | `String` | Yes | Số điện thoại |
| `fullName` | `String` | Yes | Họ tên |
| `password` | `String` | Yes | Mật khẩu |
| `role` | `Role` | No/ignored ở register | Controller register luôn dùng `Role.USER` |

### Request JSON mẫu

```json
{
  "email": "booking_123@mail.com",
  "phone": "0900000000",
  "fullName": "Booking Test User",
  "password": "Pass@123",
  "role": "USER"
}
```

### Response body: `UserResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `String` | ID user |
| `email` | `String` | Email |
| `phone` | `String` | Số điện thoại |
| `fullName` | `String` | Họ tên |
| `role` | `Role` | Vai trò |
| `avatarUrl` | `String` | URL avatar |
| `createdAt` | `Instant` | Thời gian tạo |
| `createdBy` | `UUID` | Người tạo |
| `updatedAt` | `Instant` | Thời gian cập nhật |
| `updatedBy` | `UUID` | Người cập nhật |
| `isLock` | `boolean` | Trạng thái khóa tài khoản |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": "usr_001",
    "email": "booking_123@mail.com",
    "phone": "0900000000",
    "fullName": "Booking Test User",
    "role": "USER",
    "avatarUrl": null,
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "isLock": false
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 3.2 Login

**Method:** `POST`

**Endpoint:** `/v1/users/login`

**Auth:** `noauth`

### Request body: `LoginRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `email` | `String` | Yes | Email đăng nhập, có validate `@Email` |
| `password` | `String` | Yes | Mật khẩu |

### Request JSON mẫu

```json
{
  "email": "booking_123@mail.com",
  "password": "Pass@123"
}
```

### Response body: `LoginResponse`

| Field | Type | Mô tả |
|---|---|---|
| `accessToken` | `String` | JWT access token |
| `refreshToken` | `String` | JWT refresh token |
| `role` | `String` | Vai trò user |
| `fullName` | `String` | Họ tên |
| `avatar` | `String` | Avatar |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "role": "USER",
    "fullName": "Booking Test User",
    "avatar": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 3.3 Get profile

**Method:** `GET`

**Endpoint:** `/v1/users/me`

**Auth:** Bearer token

### Response body

`data` là `UserResponse`.

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": "usr_001",
    "email": "booking_123@mail.com",
    "phone": "0900000000",
    "fullName": "Booking Test User",
    "role": "USER",
    "avatarUrl": null,
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "isLock": false
  },
  "statusCode": 200,
  "metaData": null
}
```

---

# 4) Cinema API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/CinemaController.java`

Base path:
- `/v1/cinemas`

---

## 4.1 Create cinema

**Method:** `POST`

**Endpoint:** `/v1/cinemas`

### Request body: `CinemaCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `name` | `String` | Yes | Tên rạp |
| `address` | `String` | Yes | Địa chỉ |
| `city` | `String` | Yes | Thành phố |

### Request JSON mẫu

```json
{
  "name": "CGV Seed 123",
  "address": "123 Test Street",
  "city": "HCM"
}
```

### Response body: `CinemaResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID rạp |
| `name` | `String` | Tên rạp |
| `address` | `String` | Địa chỉ |
| `city` | `String` | Thành phố |
| `createdAt` | `Instant` | Thời gian tạo |
| `createdBy` | `UUID` | Người tạo |
| `updatedAt` | `Instant` | Thời gian cập nhật |
| `updatedBy` | `UUID` | Người cập nhật |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "name": "CGV Seed 123",
    "address": "123 Test Street",
    "city": "HCM",
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 4.2 Search / list cinema

**Method:** `GET`

**Endpoint:** `/v1/cinemas`

**Auth:** tùy cấu hình security

### Response body

`data` là `Page<CinemaResponse>`.

### Các field thường gặp của `Page`

| Field | Type | Mô tả |
|---|---|---|
| `content` | `Array<CinemaResponse>` | Danh sách phần tử |
| `pageable` | object | Thông tin phân trang |
| `totalElements` | `long` | Tổng số bản ghi |
| `totalPages` | `int` | Tổng số trang |
| `size` | `int` | Số phần tử/trang |
| `number` | `int` | Trang hiện tại (0-based) |
| `first` | `boolean` | Có phải trang đầu |
| `last` | `boolean` | Có phải trang cuối |
| `empty` | `boolean` | Có rỗng hay không |

---

# 5) Room API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/RoomController.java`

Base path:
- `/v1/rooms`

---

## 5.1 Create room

**Method:** `POST`

**Endpoint:** `/v1/rooms`

### Request body: `RoomCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `name` | `String` | Yes | Tên phòng |
| `totalSeats` | `Integer` | Yes | Tổng số ghế |
| `cinemaId` | `Integer` | Yes | ID rạp |
| `type` | `RoomType` | Yes | Loại phòng |

### Request JSON mẫu

```json
{
  "name": "Room A",
  "totalSeats": 100,
  "cinemaId": 1,
  "type": "STANDARD"
}
```

### Response body: `RoomResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID phòng |
| `name` | `String` | Tên phòng |
| `totalSeats` | `Integer` | Tổng số ghế |
| `cinemaId` | `Integer` | ID rạp |
| `type` | `RoomType` | Loại phòng |
| `createdAt` | `Instant` | Thời gian tạo |
| `createdBy` | `UUID` | Người tạo |
| `updatedAt` | `Instant` | Thời gian cập nhật |
| `updatedBy` | `UUID` | Người cập nhật |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 10,
    "name": "Room A",
    "totalSeats": 100,
    "cinemaId": 1,
    "type": "STANDARD",
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 5.2 Search / list room

**Method:** `GET`

**Endpoint:** `/v1/rooms`

**Response:** `Page<RoomResponse>`

---

# 6) Seat API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/SeatController.java`

Base path:
- `/v1/seats`

---

## 6.1 Create seat

**Method:** `POST`

**Endpoint:** `/v1/seats`

### Request body: `SeatCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `seatNumber` | `String` | Yes | Số ghế, ví dụ `A1` |
| `rowLabel` | `String` | Yes | Ký hiệu hàng ghế, ví dụ `A` |
| `roomId` | `Integer` | Yes | ID phòng |
| `type` | `SeatType` | Yes | Loại ghế |
| `basePrice` | `BigDecimal` | Yes | Giá cơ bản |

### Request JSON mẫu

```json
{
  "seatNumber": "A1",
  "rowLabel": "A",
  "roomId": 10,
  "type": "STANDARD",
  "basePrice": 90000
}
```

### Response body: `SeatResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID ghế |
| `seatNumber` | `String` | Số ghế |
| `rowLabel` | `String` | Hàng ghế |
| `roomId` | `Integer` | ID phòng |
| `type` | `SeatType` | Loại ghế |
| `basePrice` | `BigDecimal` | Giá cơ bản |
| `createdAt` | `Instant` | Thời gian tạo |
| `createdBy` | `UUID` | Người tạo |
| `updatedAt` | `Instant` | Thời gian cập nhật |
| `updatedBy` | `UUID` | Người cập nhật |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 100,
    "seatNumber": "A1",
    "rowLabel": "A",
    "roomId": 10,
    "type": "STANDARD",
    "basePrice": 90000,
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 6.2 Search / list seat

**Method:** `GET`

**Endpoint:** `/v1/seats`

**Response:** `Page<SeatResponse>`

---

# 7) Movie API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/MovieController.java`

Base path:
- `/v1/movies`

---

## 7.1 Create movie

**Method:** `POST`

**Endpoint:** `/v1/movies`

### Request body: `MovieCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `title` | `String` | Yes | Tên phim |
| `genre` | `String` | Yes | Thể loại |
| `duration` | `Integer` | Yes | Thời lượng, tính bằng phút |
| `director` | `String` | Yes | Đạo diễn |
| `cast` | `String` | Yes | Dàn diễn viên |
| `description` | `String` | Yes | Mô tả |
| `posterMediaId` | `String` | No | ID media poster, có thể `null` |
| `releaseDate` | `LocalDate` | Yes | Ngày phát hành, format `yyyy-MM-dd` |
| `status` | `MovieStatus` | Yes | Trạng thái phim |
| `teaserUrl` | `String` | No | Link teaser |
| `reviewUrl` | `String` | No | Link review |

### Request JSON mẫu

```json
{
  "title": "Test Movie 123",
  "genre": "Action",
  "duration": 120,
  "director": "Copilot Director",
  "cast": "Actor 1, Actor 2",
  "description": "Movie for booking flow test",
  "posterMediaId": null,
  "releaseDate": "2026-04-19",
  "status": "NOW_SHOWING",
  "teaserUrl": "https://example.com/teaser",
  "reviewUrl": "https://example.com/review"
}
```

### Response body: `MovieResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID phim |
| `title` | `String` | Tên phim |
| `genre` | `String` | Thể loại |
| `duration` | `Integer` | Thời lượng phút |
| `director` | `String` | Đạo diễn |
| `cast` | `String` | Dàn diễn viên |
| `description` | `String` | Mô tả |
| `posterMediaId` | `String` | ID poster |
| `releaseDate` | `LocalDate` | Ngày phát hành |
| `status` | `MovieStatus` | Trạng thái |
| `teaserUrl` | `String` | URL teaser |
| `reviewUrl` | `String` | URL review |
| `createdAt` | `Instant` | Thời gian tạo |
| `createdBy` | `UUID` | Người tạo |
| `updatedAt` | `Instant` | Thời gian cập nhật |
| `updatedBy` | `UUID` | Người cập nhật |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 20,
    "title": "Test Movie 123",
    "genre": "Action",
    "duration": 120,
    "director": "Copilot Director",
    "cast": "Actor 1, Actor 2",
    "description": "Movie for booking flow test",
    "posterMediaId": null,
    "releaseDate": "2026-04-19",
    "status": "NOW_SHOWING",
    "teaserUrl": "https://example.com/teaser",
    "reviewUrl": "https://example.com/review",
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 7.2 Search / list movie

**Method:** `GET`

**Endpoint:** `/v1/movies`

**Response:** `Page<MovieResponse>`

---

# 8) Showtime API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/ShowtimeController.java`

Base path:
- `/v1/showtimes`

---

## 8.1 Create showtime

**Method:** `POST`

**Endpoint:** `/v1/showtimes`

### Request body: `ShowtimeCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `startTime` | `LocalDateTime` | Yes | Thời gian bắt đầu, format `yyyy-MM-ddTHH:mm:ss` |
| `endTime` | `LocalDateTime` | Yes | Thời gian kết thúc |
| `movieId` | `Integer` | Yes | ID phim |
| `roomId` | `Integer` | Yes | ID phòng |
| `basePrice` | `BigDecimal` | Yes | Giá vé gốc |
| `availableSeats` | `Integer` | Yes | Số ghế còn lại |
| `status` | `ShowtimeStatus` | Yes | Trạng thái suất chiếu |

### Request JSON mẫu

```json
{
  "startTime": "2026-04-20T18:00:00",
  "endTime": "2026-04-20T20:00:00",
  "movieId": 20,
  "roomId": 10,
  "basePrice": 90000,
  "availableSeats": 100,
  "status": "SCHEDULED"
}
```

### Response body: `ShowtimeResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID suất chiếu |
| `startTime` | `LocalDateTime` | Giờ bắt đầu |
| `endTime` | `LocalDateTime` | Giờ kết thúc |
| `movieId` | `Integer` | ID phim |
| `roomId` | `Integer` | ID phòng |
| `basePrice` | `BigDecimal` | Giá vé gốc |
| `availableSeats` | `Integer` | Ghế còn lại |
| `status` | `ShowtimeStatus` | Trạng thái |
| `createdAt` | `Instant` | Thời gian tạo |
| `createdBy` | `UUID` | Người tạo |
| `updatedAt` | `Instant` | Thời gian cập nhật |
| `updatedBy` | `UUID` | Người cập nhật |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 30,
    "startTime": "2026-04-20T18:00:00",
    "endTime": "2026-04-20T20:00:00",
    "movieId": 20,
    "roomId": 10,
    "basePrice": 90000,
    "availableSeats": 100,
    "status": "SCHEDULED",
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 8.2 Search / list showtime

**Method:** `GET`

**Endpoint:** `/v1/showtimes`

**Response:** `Page<ShowtimeResponse>`

---

# 9) Promotion API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/PromotionController.java`

Base path:
- `/v1/promotions`

---

## 9.1 Create promotion

**Method:** `POST`

**Endpoint:** `/v1/promotions`

### Request body: `PromotionCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `code` | `String` | Yes | Mã khuyến mãi |
| `discountType` | `String` | Yes | Loại giảm giá, ví dụ `PERCENT` hoặc `FIXED` nếu backend hỗ trợ |
| `discountValue` | `BigDecimal` | Yes | Giá trị giảm |
| `startDate` | `LocalDate` | Yes | Ngày bắt đầu |
| `endDate` | `LocalDate` | Yes | Ngày kết thúc |
| `maxUsage` | `Integer` | Yes | Số lần dùng tối đa |
| `usedCount` | `Integer` | Yes | Số lần đã dùng |
| `status` | `String` | Yes | Trạng thái |

### Request JSON mẫu

```json
{
  "code": "PROMO123",
  "discountType": "PERCENT",
  "discountValue": 10,
  "startDate": "2026-04-19",
  "endDate": "2026-12-31",
  "maxUsage": 1000,
  "usedCount": 0,
  "status": "ACTIVE"
}
```

### Response body: `PromotionResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID promotion |
| `code` | `String` | Mã khuyến mãi |
| `discountType` | `String` | Kiểu giảm giá |
| `discountValue` | `BigDecimal` | Giá trị giảm |
| `startDate` | `LocalDate` | Ngày bắt đầu |
| `endDate` | `LocalDate` | Ngày kết thúc |
| `maxUsage` | `Integer` | Số lần dùng tối đa |
| `usedCount` | `Integer` | Số lần đã dùng |
| `status` | `String` | Trạng thái |
| `createdAt` | `LocalDateTime` | Thời gian tạo |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 40,
    "code": "PROMO123",
    "discountType": "PERCENT",
    "discountValue": 10,
    "startDate": "2026-04-19",
    "endDate": "2026-12-31",
    "maxUsage": 1000,
    "usedCount": 0,
    "status": "ACTIVE",
    "createdAt": "2026-05-24T10:00:00"
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 9.2 Search / list promotion

**Method:** `GET`

**Endpoint:** `/v1/promotions`

**Response:** `Page<PromotionResponse>`

---

# 10) Booking API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/BookingController.java`

Base path:
- `/v1/bookings`

---

## 10.1 Create booking

**Method:** `POST`

**Endpoint:** `/v1/bookings`

### Request body: `BookingCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `userId` | `String` | Yes | ID user |
| `showtimeId` | `Integer` | Yes | ID suất chiếu |
| `promotionId` | `Integer` | No | ID khuyến mãi, có thể `null` |
| `totalAmount` | `BigDecimal` | Yes | Tổng tiền |
| `discountAmount` | `BigDecimal` | Yes | Số tiền giảm |
| `finalAmount` | `BigDecimal` | Yes | Số tiền cuối |
| `status` | `BookingStatus` | Yes | Trạng thái booking |
| `qrCode` | `String` | Yes | Mã QR |

### Request JSON mẫu

```json
{
  "userId": "usr_001",
  "showtimeId": 30,
  "promotionId": 40,
  "totalAmount": 90000,
  "discountAmount": 9000,
  "finalAmount": 81000,
  "status": "PENDING",
  "qrCode": "QR-123"
}
```

### Response body: `BookingResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID booking |
| `userId` | `String` | ID user |
| `showtimeId` | `Integer` | ID suất chiếu |
| `promotionId` | `Integer` | ID promotion |
| `totalAmount` | `BigDecimal` | Tổng tiền |
| `discountAmount` | `BigDecimal` | Tiền giảm |
| `finalAmount` | `BigDecimal` | Tiền cuối |
| `status` | `BookingStatus` | Trạng thái |
| `qrCode` | `String` | Mã QR |
| `createdAt` | `Instant` | Thời gian tạo |
| `createdBy` | `UUID` | Người tạo |
| `updatedAt` | `Instant` | Thời gian cập nhật |
| `updatedBy` | `UUID` | Người cập nhật |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 50,
    "userId": "usr_001",
    "showtimeId": 30,
    "promotionId": 40,
    "totalAmount": 90000,
    "discountAmount": 9000,
    "finalAmount": 81000,
    "status": "PENDING",
    "qrCode": "QR-123",
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 10.2 Get booking by id

**Method:** `GET`

**Endpoint:** `/v1/bookings/{id}`

### Response body

`data` là `BookingResponse`.

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 50,
    "userId": "usr_001",
    "showtimeId": 30,
    "promotionId": 40,
    "totalAmount": 90000,
    "discountAmount": 9000,
    "finalAmount": 81000,
    "status": "PENDING",
    "qrCode": "QR-123",
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 10.3 Search / list booking

**Method:** `GET`

**Endpoint:** `/v1/bookings`

**Response:** `Page<BookingResponse>`

---

## 10.4 Update booking

**Method:** `PUT`

**Endpoint:** `/v1/bookings/{id}`

**Request body:** `BookingUpdateRequest`

> File `BookingUpdateRequest` chưa được đọc trong đợt này, nhưng theo pattern của project thì request update thường chứa các field có thể chỉnh sửa tương ứng với `BookingResponse`.

---

## 10.5 Delete booking

**Method:** `DELETE`

**Endpoint:** `/v1/bookings`

### Request body

Danh sách ID booking:

```json
[1, 2, 3]
```

### Response

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null,
  "statusCode": 200,
  "metaData": null
}
```

---

# 11) Booking Detail API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/BookingDetailController.java`

Base path:
- `/v1/booking-details`

---

## 11.1 Create booking detail

**Method:** `POST`

**Endpoint:** `/v1/booking-details`

### Request body: `BookingDetailCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `bookingId` | `Integer` | Yes | ID booking |
| `seatId` | `Integer` | Yes | ID ghế |
| `priceAtTime` | `BigDecimal` | Yes | Giá tại thời điểm đặt |

### Request JSON mẫu

```json
{
  "bookingId": 50,
  "seatId": 100,
  "priceAtTime": 90000
}
```

### Response body: `BookingDetailResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID booking detail |
| `bookingId` | `Integer` | ID booking |
| `seatId` | `Integer` | ID ghế |
| `priceAtTime` | `BigDecimal` | Giá tại thời điểm đặt |
| `createdAt` | `Instant` | Thời gian tạo |
| `createdBy` | `UUID` | Người tạo |
| `updatedAt` | `Instant` | Thời gian cập nhật |
| `updatedBy` | `UUID` | Người cập nhật |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 60,
    "bookingId": 50,
    "seatId": 100,
    "priceAtTime": 90000,
    "createdAt": "2026-05-24T10:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 11.2 Search / list booking detail

**Method:** `GET`

**Endpoint:** `/v1/booking-details`

**Response:** `Page<BookingDetailResponse>`

---

# 12) Payment API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/PaymentController.java`

Base path:
- `/v1/payments`

---

## 12.1 Create payment

**Method:** `POST`

**Endpoint:** `/v1/payments`

### Request body: `PaymentCreateRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `method` | `String` | Yes | Phương thức thanh toán, ví dụ `MOMO` |
| `amount` | `BigDecimal` | Yes | Số tiền |
| `transactionId` | `String` | Yes | Mã giao dịch |
| `status` | `String` | Yes | Trạng thái thanh toán |
| `bookingId` | `Integer` | Yes | ID booking |

> Lưu ý: DTO hiện tại khai báo `method` và `status` là `String`, dù project có enum `PaymentMethod` và `PaymentStatus`. Khi test, bạn có thể truyền các giá trị enum như chuỗi.

### Request JSON mẫu

```json
{
  "method": "MOMO",
  "amount": 81000,
  "transactionId": "TX-123",
  "status": "SUCCESS",
  "bookingId": 50
}
```

### Response body: `PaymentResponse`

| Field | Type | Mô tả |
|---|---|---|
| `id` | `Integer` | ID payment |
| `method` | `String` | Phương thức thanh toán |
| `amount` | `BigDecimal` | Số tiền |
| `transactionId` | `String` | Mã giao dịch |
| `status` | `String` | Trạng thái thanh toán |
| `bookingId` | `Integer` | ID booking |
| `paidAt` | `LocalDateTime` | Thời gian thanh toán |
| `createdAt` | `LocalDateTime` | Thời gian tạo |

### Response JSON mẫu

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 70,
    "method": "MOMO",
    "amount": 81000,
    "transactionId": "TX-123",
    "status": "SUCCESS",
    "bookingId": 50,
    "paidAt": "2026-05-24T10:05:00",
    "createdAt": "2026-05-24T10:05:00"
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 12.2 Search / list payment

**Method:** `GET`

**Endpoint:** `/v1/payments`

**Response:** `Page<PaymentResponse>`

---

# 13) Media API

Controller:
- `ecom/src/main/java/com/quangnt/ecom/controller/MediaController.java`

Base path:
- `/v1/medias`

---

## 13.1 Upload media

**Method:** `POST`

**Endpoint:** `/v1/medias`

**Content-Type:** `multipart/form-data`

### Request body: `FileUploadRequest`

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `file` | `MultipartFile` | Yes | File upload |

### Form-data mẫu

| Key | Type | Value |
|---|---|---|
| `file` | File | poster.jpg |

### Response body

Controller trả về `ResponseDto<Object>`, nên cấu trúc cụ thể phụ thuộc `MediaService.upload(...)`.

Thường `data` sẽ chứa thông tin file upload thành công, ví dụ:

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": "media_001",
    "fileName": "poster.jpg",
    "fileUrl": "https://...",
    "fileType": "image/jpeg"
  },
  "statusCode": 200,
  "metaData": null
}
```

---

## 13.2 Delete medias

**Method:** `DELETE`

**Endpoint:** `/v1/medias`

### Request body

Danh sách media id dạng `String`:

```json
["media_001", "media_002"]
```

---

## 13.3 Auto cleanup unused media

**Method:** `GET`

**Endpoint:** `/v1/medias/remove-un-media`

> Đây là API nội bộ gắn `@Scheduled`, thường không gọi thủ công trong Postman.

---

# 14) Gợi ý flow test khi DB còn trống

Nếu bạn muốn bootstrap dữ liệu từ đầu để test booking, thứ tự nên là:

1. `POST /v1/users/register`
2. `POST /v1/users/login`
3. `POST /v1/cinemas`
4. `POST /v1/rooms`
5. `POST /v1/seats`
6. `POST /v1/movies`
7. `POST /v1/showtimes`
8. `POST /v1/promotions`
9. `POST /v1/bookings`
10. `POST /v1/booking-details`
11. `POST /v1/payments`
12. `GET /v1/bookings/{id}`

---

# 15) Lưu ý quan trọng khi test

## 15.1 Kiểu dữ liệu ID
- `UserResponse.id` là `String`
- Các entity còn lại đa phần dùng `Integer`

Vì vậy trong JSON:
- `userId` nên để kiểu chuỗi: `"usr_001"`
- các ID khác để số: `10`, `20`, `30`

## 15.2 Kiểu ngày giờ
- `LocalDate` dùng format: `yyyy-MM-dd`
- `LocalDateTime` dùng format: `yyyy-MM-ddTHH:mm:ss`
- `Instant` thường trả theo ISO-8601 có timezone, ví dụ: `2026-05-24T10:00:00Z`

## 15.3 `BigDecimal`
Các field tiền như:
- `basePrice`
- `discountValue`
- `totalAmount`
- `discountAmount`
- `finalAmount`
- `amount`
- `priceAtTime`

Nên gửi dạng số, ví dụ:
```json
"amount": 81000
```

Nếu cần giữ chính xác số thập phân, có thể gửi:
```json
"amount": 81000.50
```

## 15.4 `promotionId`
Nếu booking không dùng mã giảm giá thì field này có thể là `null`.

---

# 16) Bảng tóm tắt nhanh

| Resource | Method | Endpoint | Request DTO | Response DTO |
|---|---|---|---|---|
| User register | POST | `/v1/users/register` | `UserCreateRequest` | `UserResponse` |
| User login | POST | `/v1/users/login` | `LoginRequest` | `LoginResponse` |
| User profile | GET | `/v1/users/me` | - | `UserResponse` |
| Cinema create | POST | `/v1/cinemas` | `CinemaCreateRequest` | `CinemaResponse` |
| Room create | POST | `/v1/rooms` | `RoomCreateRequest` | `RoomResponse` |
| Seat create | POST | `/v1/seats` | `SeatCreateRequest` | `SeatResponse` |
| Movie create | POST | `/v1/movies` | `MovieCreateRequest` | `MovieResponse` |
| Showtime create | POST | `/v1/showtimes` | `ShowtimeCreateRequest` | `ShowtimeResponse` |
| Promotion create | POST | `/v1/promotions` | `PromotionCreateRequest` | `PromotionResponse` |
| Booking create | POST | `/v1/bookings` | `BookingCreateRequest` | `BookingResponse` |
| Booking detail create | POST | `/v1/booking-details` | `BookingDetailCreateRequest` | `BookingDetailResponse` |
| Payment create | POST | `/v1/payments` | `PaymentCreateRequest` | `PaymentResponse` |
| Media upload | POST | `/v1/medias` | `FileUploadRequest` | `ResponseDto<Object>` |

---

# 17) Kết luận

File này dùng để:
- test API bằng Postman
- đối chiếu request/response thực tế
- bootstrap dữ liệu khi DB còn trống

Nếu cần, mình có thể làm tiếp một file khác dạng:
- `booking-bootstrap-flow.postman_collection.json` đã sửa chuẩn theo DTO thật
- hoặc một bản markdown ngắn hơn chỉ gồm bảng endpoint + request/response JSON mẫu

