// middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token"); // Lấy token từ cookie

    if (req.nextUrl.pathname.startsWith('/_next/')) {
        return NextResponse.next();
    }

    // Nếu người dùng đã có token và đang ở trang login hoặc register, chuyển hướng về trang chủ
    if (token) {
        if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Nếu không có token và không ở trang login hoặc register, chuyển hướng đến trang login
    if (!token && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/register") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Cho phép truy cập nếu có token và không thuộc về các điều kiện trên
    return NextResponse.next();
}

// Áp dụng middleware cho các trang cần bảo vệ
export const config = {
    matcher: ["/:path*"], // Áp dụng cho tất cả các đường dẫn
};
