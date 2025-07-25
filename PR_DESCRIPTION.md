# Xây dựng chức năng CRU Users cho trang Sign Up và Settings

Pull request này xây dựng hệ thống quản lý người dùng hoàn chỉnh bao gồm các API endpoint cần thiết cho trang "Đăng ký" (Sign Up Page) và trang "Cài đặt" (Settings Page). Nó cho phép người dùng có thể tạo tài khoản mới, đăng nhập, và quản lý thông tin cá nhân của chính họ. Hoàn thiện CRU (Create, Read, Update) cho người dùng.

## Thay đổi chính

### API:
- **POST /auth/register**: Xây dựng endpoint cho phép người dùng đăng ký tài khoản mới với username, email và password.
- **POST /auth/login**: Xây dựng endpoint xác thực người dùng và trả về JWT access token + refresh token.
- **GET /users/me**: Xây dựng endpoint được bảo vệ để người dùng đã đăng nhập có thể lấy thông tin profile mới nhất.
- **PUT /users/me**: Xây dựng endpoint được bảo vệ để người dùng có thể cập nhật thông tin cá nhân (username, email, password, bio, image).

### Authentication & Security:
- **JWT Guard**: Implement JwtAuthGuard để bảo vệ các endpoint cần xác thực.
- **Password Hashing**: Sử dụng bcrypt để mã hóa password trước khi lưu database.
- **Token Management**: Cấu hình JWT với access token (1h) và refresh token (7d).

### Validation & DTO:
- **CreateUserDto**: Validate dữ liệu đầu vào cho việc đăng ký tài khoản mới.
- **UpdateUserDto**: Validate dữ liệu đầu vào cho việc cập nhật profile với tất cả fields optional.
- **UserResponseDto**: Chuẩn hóa response trả về, đảm bảo không bao giờ trả password.
- **Global Validation**: Cấu hình ValidationPipe với whitelist để ngăn chặn non-whitelisted fields.

### Database & ORM:
- **User Model**: Định nghĩa schema User trong Prisma với các trường cần thiết.
- **Unique Constraints**: Đảm bảo email và username không trùng lặp.
- **Auto Timestamps**: Tự động quản lý createdAt và updatedAt.

### Error Handling:
- **Consistent Error Messages**: Tất cả error messages bằng tiếng Việt, dễ hiểu cho end user.
- **HTTP Status Codes**: Sử dụng đúng status codes (200, 201, 400, 401, 404).
- **Validation Errors**: Trả về chi tiết lỗi validation cho frontend xử lý. 