// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Lấy token từ cookie

  // Bỏ qua các yêu cầu tới các tệp CSS
  if (req.nextUrl.pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Nếu người dùng đã có token và đang ở trang login, chuyển hướng về trang chủ
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Nếu không có token và không ở trang login, chuyển hướng đến trang login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Cho phép truy cập nếu có token
  return NextResponse.next();
}

// Áp dụng middleware cho các trang cần bảo vệ
export const config = {
  matcher: ["/:path*"], // Áp dụng cho tất cả các đường dẫn
};
